import { getTodayDateString } from '@/lib/daily-challenges';
import {
  calculerProgression,
  CRISTAUX_DEFI_MYSTERE,
  CRISTAUX_PAR_DEFI,
  MULTIPLICATEUR_XP_MYSTERE,
  seuilNiveauCompetence,
  seuilNiveauGlobal,
} from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import type { Challenge } from '@/lib/types';

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
    .select('xp_global, cristaux, streak_actuel')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  const nouveauXpGlobal = profile.xp_global + xpGagne;
  const { niveau: nouveauNiveauGlobal } = calculerProgression(nouveauXpGlobal, seuilNiveauGlobal);
  const nouveauxCristaux = profile.cristaux + cristauxGagnes;

  // Le streak n'avance que sur le tout premier défi (normal ou mystère) validé
  // aujourd'hui — celui qu'on vient de marquer complet compte dans ce total.
  const [dailyCount, mysteryCount] = await Promise.all([
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
  ]);
  if (dailyCount.error) throw dailyCount.error;
  if (mysteryCount.error) throw mysteryCount.error;

  const completedTodayCount = (dailyCount.count ?? 0) + (mysteryCount.count ?? 0);
  const estPremierDuJour = completedTodayCount === 1;
  const nouveauStreak = estPremierDuJour ? profile.streak_actuel + 1 : profile.streak_actuel;

  const { error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      xp_global: nouveauXpGlobal,
      niveau_global: nouveauNiveauGlobal,
      cristaux: nouveauxCristaux,
      streak_actuel: nouveauStreak,
    })
    .eq('id', userId);
  if (updateProfileError) throw updateProfileError;

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
