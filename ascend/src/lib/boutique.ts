import { addDays, formatDateString, getTodayDateString } from '@/lib/daily-challenges';
import { COUT_CHANGER_DEFI, COUT_DEFI_BONUS, COUT_RECUPERER_STREAK } from '@/lib/gamification';
import { canRecoverMissedStreak, syncStreakActuel } from '@/lib/streaks';
import { supabase } from '@/lib/supabase';
import type { DailyChallenge } from '@/lib/types';

async function spendCristaux(userId: string, montant: number): Promise<void> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('cristaux')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  if (profile.cristaux < montant) {
    throw new Error('Solde de cristaux insuffisant.');
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ cristaux: profile.cristaux - montant })
    .eq('id', userId);
  if (updateError) throw updateError;
}

// Remplace un défi du jour non complété par un autre défi aléatoire du même
// thème/difficulté, sans doublon avec les défis déjà présents aujourd'hui.
export async function swapDailyChallenge(userId: string, dailyChallengeId: string): Promise<void> {
  const { data, error: targetError } = await supabase
    .from('daily_challenges')
    .select('id, complete, completed_at, challenge_id, est_bonus, challenges(*)')
    .eq('id', dailyChallengeId)
    .eq('user_id', userId)
    .single();
  if (targetError) throw targetError;

  const target = data as unknown as DailyChallenge;
  if (target.complete) {
    throw new Error('Ce défi est déjà complété.');
  }

  const today = getTodayDateString();
  const { data: todaysChallenges, error: todaysError } = await supabase
    .from('daily_challenges')
    .select('challenge_id')
    .eq('user_id', userId)
    .eq('date', today);
  if (todaysError) throw todaysError;

  const excludedIds = new Set((todaysChallenges ?? []).map((row) => row.challenge_id as string));

  const { data: candidates, error: candidatesError } = await supabase
    .from('challenges')
    .select('*')
    .eq('theme_id', target.challenges.theme_id)
    .eq('difficulte', target.challenges.difficulte);
  if (candidatesError) throw candidatesError;

  const pool = (candidates ?? []).filter((c) => !excludedIds.has(c.id));
  if (pool.length === 0) {
    throw new Error('Aucun autre défi disponible pour ce thème et cette difficulté.');
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  await spendCristaux(userId, COUT_CHANGER_DEFI);

  const { error: updateError } = await supabase
    .from('daily_challenges')
    .update({ challenge_id: chosen.id })
    .eq('id', dailyChallengeId)
    .eq('user_id', userId);
  if (updateError) throw updateError;
}

// Ajoute un 4e défi (ou plus) aux défis du jour, tiré au hasard parmi tous
// les thèmes — indépendant des thèmes choisis, comme le défi mystère.
export async function unlockBonusChallenge(userId: string): Promise<void> {
  const today = getTodayDateString();

  const { data: todaysChallenges, error: todaysError } = await supabase
    .from('daily_challenges')
    .select('challenge_id')
    .eq('user_id', userId)
    .eq('date', today);
  if (todaysError) throw todaysError;

  const excludedIds = new Set((todaysChallenges ?? []).map((row) => row.challenge_id as string));

  const { data: allChallenges, error: challengesError } = await supabase.from('challenges').select('*');
  if (challengesError) throw challengesError;

  const pool = (allChallenges ?? []).filter((c) => !excludedIds.has(c.id));
  if (pool.length === 0) {
    throw new Error('Aucun défi bonus disponible.');
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  await spendCristaux(userId, COUT_DEFI_BONUS);

  const { error: insertError } = await supabase
    .from('daily_challenges')
    .insert({ user_id: userId, challenge_id: chosen.id, date: today, est_bonus: true });
  if (insertError) throw insertError;
}

// Marque hier comme 'recupere' dans streaks_history, ce qui empêche la
// rupture du streak de se déclencher, puis fait recalculer streak_actuel
// (voir src/lib/streaks.ts) pour restaurer la continuité.
export async function recoverMissedStreak(userId: string): Promise<void> {
  const canRecover = await canRecoverMissedStreak(userId);
  if (!canRecover) {
    throw new Error("La récupération de streak n'est pas disponible.");
  }

  await spendCristaux(userId, COUT_RECUPERER_STREAK);

  const yesterday = formatDateString(addDays(new Date(), -1));
  const { error: upsertError } = await supabase
    .from('streaks_history')
    .upsert({ user_id: userId, date: yesterday, statut: 'recupere' });
  if (upsertError) throw upsertError;

  await syncStreakActuel(userId);
}
