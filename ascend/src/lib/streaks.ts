import { addDays, formatDateString, getTodayDateString } from '@/lib/daily-challenges';
import { supabase } from '@/lib/supabase';
import type { StatutStreak } from '@/lib/types';

// Fenêtre de recherche en arrière largement suffisante pour n'importe quel
// streak réaliste, tout en gardant la requête bornée.
const STREAK_LOOKBACK_DAYS = 400;

// Reconstruit la longueur du streak en cours en remontant jour par jour depuis
// hier (jamais aujourd'hui, qui est géré séparément par l'incrémentation au
// moment de la complétion), tant que le jour a un statut 'reussi' ou
// 'recupere' dans streaks_history. S'arrête au premier trou.
async function recomputeStreakActuel(userId: string): Promise<number> {
  const yesterday = addDays(new Date(), -1);
  const rangeStart = addDays(yesterday, -STREAK_LOOKBACK_DAYS);

  const { data, error } = await supabase
    .from('streaks_history')
    .select('date, statut')
    .eq('user_id', userId)
    .gte('date', formatDateString(rangeStart))
    .lte('date', formatDateString(yesterday));
  if (error) throw error;

  const statutByDate = new Map<string, StatutStreak>(
    (data ?? []).map((row) => [row.date as string, row.statut as StatutStreak]),
  );

  let streak = 0;
  let cursor = yesterday;
  while (true) {
    const statut = statutByDate.get(formatDateString(cursor));
    if (statut !== 'reussi' && statut !== 'recupere') break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

// Vérification de rupture (à appeler au chargement de l'accueil, avant toute
// autre chose) : recalcule streak_actuel depuis l'historique réel. Sert aussi
// à restaurer streak_actuel après une récupération de streak (boutique), qui
// insère un 'recupere' pour hier puis rappelle cette fonction.
export async function syncStreakActuel(userId: string): Promise<void> {
  const streakActuel = await recomputeStreakActuel(userId);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('streak_max')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  const streakMax = Math.max(profile.streak_max, streakActuel);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ streak_actuel: streakActuel, streak_max: streakMax })
    .eq('id', userId);
  if (updateError) throw updateError;
}

// La récupération n'a de sens que si hier est actuellement manqué et que rien
// n'a encore été validé aujourd'hui (sinon le streak d'aujourd'hui a déjà
// repris sur des bases saines via l'incrémentation normale).
export async function canRecoverMissedStreak(userId: string): Promise<boolean> {
  const yesterday = formatDateString(addDays(new Date(), -1));
  const today = getTodayDateString();

  const [historyResult, dailyTodayResult, mysteryTodayResult] = await Promise.all([
    supabase.from('streaks_history').select('statut').eq('user_id', userId).eq('date', yesterday).maybeSingle(),
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
  if (historyResult.error) throw historyResult.error;
  if (dailyTodayResult.error) throw dailyTodayResult.error;
  if (mysteryTodayResult.error) throw mysteryTodayResult.error;

  const yesterdayOk = historyResult.data?.statut === 'reussi' || historyResult.data?.statut === 'recupere';
  const completedToday = (dailyTodayResult.count ?? 0) + (mysteryTodayResult.count ?? 0);

  return !yesterdayOk && completedToday === 0;
}
