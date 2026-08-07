import { getTodayDateString } from '@/lib/daily-challenges';
import {
  BADGE_NIVEAU_THRESHOLDS,
  BADGE_STREAK_THRESHOLDS,
  calculerProgression,
  CRISTAUX_DEFI_MYSTERE,
  CRISTAUX_PAR_DEFI,
  MULTIPLICATEUR_XP_MYSTERE,
  seuilNiveauCompetence,
  seuilNiveauGlobal,
} from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import type { Challenge } from '@/lib/types';

// Attribue les badges débloqués par cette complétion (premier défi/mystère,
// paliers de streak, paliers de niveau). Idempotent : ON CONFLICT DO NOTHING
// via ignoreDuplicates, donc sans risque d'être re-déclenché à chaque défi
// une fois le seuil déjà franchi.
async function checkAndAwardBadges(
  userId: string,
  context: {
    streakActuel: number;
    niveauGlobal: number;
    estPremierDefi: boolean;
    estPremierMystere: boolean;
  },
): Promise<void> {
  const badgeIds = new Set<string>();

  if (context.estPremierDefi) badgeIds.add('premier-defi');
  if (context.estPremierMystere) badgeIds.add('premier-mystere');

  for (const { seuil, badgeId } of BADGE_STREAK_THRESHOLDS) {
    if (context.streakActuel >= seuil) badgeIds.add(badgeId);
  }
  for (const { seuil, badgeId } of BADGE_NIVEAU_THRESHOLDS) {
    if (context.niveauGlobal >= seuil) badgeIds.add(badgeId);
  }

  if (badgeIds.size === 0) return;

  const { error } = await supabase.from('user_badges').upsert(
    Array.from(badgeIds).map((badge_id) => ({ user_id: userId, badge_id })),
    { onConflict: 'user_id,badge_id', ignoreDuplicates: true },
  );
  if (error) throw error;
}

type RewardResult = {
  xpGagne: number;
  cristauxGagnes: number;
};

async function applyChallengeRewards(
  userId: string,
  challenge: Pick<Challenge, 'xp' | 'theme_id'>,
  options: { estMystere: boolean },
): Promise<RewardResult> {
  const xpGagne = options.estMystere ? challenge.xp * MULTIPLICATEUR_XP_MYSTERE : challenge.xp;
  const cristauxGagnes = options.estMystere ? CRISTAUX_DEFI_MYSTERE : CRISTAUX_PAR_DEFI;
  const today = getTodayDateString();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('xp_global, cristaux, streak_actuel, streak_max')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  const nouveauXpGlobal = profile.xp_global + xpGagne;
  const { niveau: nouveauNiveauGlobal } = calculerProgression(nouveauXpGlobal, seuilNiveauGlobal);
  const nouveauxCristaux = profile.cristaux + cristauxGagnes;

  // Le streak n'avance que sur le tout premier défi (normal ou mystère) validé
  // aujourd'hui — celui qu'on vient de marquer complet compte dans ce total.
  // Les compteurs "tous temps" servent à détecter une toute première
  // complétion (badges premier-defi / premier-mystere).
  const [dailyToday, mysteryToday, dailyAllTime, mysteryAllTime] = await Promise.all([
    supabase
      .from('daily_challenges')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('date', today)
      .eq('complete', true),
    supabase
      .from('mystery_challenges')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('date', today)
      .eq('complete', true),
    supabase
      .from('daily_challenges')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('complete', true),
    supabase
      .from('mystery_challenges')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('complete', true),
  ]);
  if (dailyToday.error) throw dailyToday.error;
  if (mysteryToday.error) throw mysteryToday.error;
  if (dailyAllTime.error) throw dailyAllTime.error;
  if (mysteryAllTime.error) throw mysteryAllTime.error;

  const completedTodayCount = (dailyToday.count ?? 0) + (mysteryToday.count ?? 0);
  const estPremierDuJour = completedTodayCount === 1;
  const nouveauStreak = estPremierDuJour ? profile.streak_actuel + 1 : profile.streak_actuel;
  const nouveauStreakMax = Math.max(profile.streak_max, nouveauStreak);

  const estPremierDefi = !options.estMystere && (dailyAllTime.count ?? 0) === 1;
  const estPremierMystere = options.estMystere && (mysteryAllTime.count ?? 0) === 1;

  const { error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      xp_global: nouveauXpGlobal,
      niveau_global: nouveauNiveauGlobal,
      cristaux: nouveauxCristaux,
      streak_actuel: nouveauStreak,
      streak_max: nouveauStreakMax,
    })
    .eq('id', userId);
  if (updateProfileError) throw updateProfileError;

  if (estPremierDuJour) {
    const { error: streakHistoryError } = await supabase
      .from('streaks_history')
      .upsert({ user_id: userId, date: today, statut: 'reussi' });
    if (streakHistoryError) throw streakHistoryError;
  }

  await checkAndAwardBadges(userId, {
    streakActuel: nouveauStreak,
    niveauGlobal: nouveauNiveauGlobal,
    estPremierDefi,
    estPremierMystere,
  });

  const { data: existingSkill, error: skillReadError } = await supabase
    .from('user_skills')
    .select('xp')
    .eq('user_id', userId)
    .eq('theme_id', challenge.theme_id)
    .maybeSingle();
  if (skillReadError) throw skillReadError;

  const nouveauSkillXp = (existingSkill?.xp ?? 0) + xpGagne;
  const { niveau: nouveauSkillNiveau } = calculerProgression(nouveauSkillXp, seuilNiveauCompetence);

  const { error: skillUpsertError } = await supabase
    .from('user_skills')
    .upsert({ user_id: userId, theme_id: challenge.theme_id, xp: nouveauSkillXp, niveau: nouveauSkillNiveau });
  if (skillUpsertError) throw skillUpsertError;

  return { xpGagne, cristauxGagnes };
}

// Renvoie null si le défi était déjà complété (double appui) — pas de récompense
// re-attribuée dans ce cas.
export async function completeDailyChallenge(
  userId: string,
  dailyChallengeId: string,
  challenge: Pick<Challenge, 'xp' | 'theme_id'>,
): Promise<RewardResult | null> {
  const { data, error } = await supabase
    .from('daily_challenges')
    .update({ complete: true, completed_at: new Date().toISOString() })
    .eq('id', dailyChallengeId)
    .eq('user_id', userId)
    .eq('complete', false)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) return null;

  return applyChallengeRewards(userId, challenge, { estMystere: false });
}

export async function completeMysteryChallenge(
  userId: string,
  mysteryChallengeId: string,
  challenge: Pick<Challenge, 'xp' | 'theme_id'>,
): Promise<RewardResult | null> {
  const { data, error } = await supabase
    .from('mystery_challenges')
    .update({ complete: true })
    .eq('id', mysteryChallengeId)
    .eq('user_id', userId)
    .eq('complete', false)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) return null;

  return applyChallengeRewards(userId, challenge, { estMystere: true });
}

export async function openMysteryChallenge(userId: string, mysteryChallengeId: string): Promise<void> {
  const { error } = await supabase
    .from('mystery_challenges')
    .update({ ouvert: true })
    .eq('id', mysteryChallengeId)
    .eq('user_id', userId);
  if (error) throw error;
}
