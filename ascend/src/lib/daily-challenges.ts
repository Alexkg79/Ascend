import { supabase } from '@/lib/supabase';
import type { Challenge, DailyChallenge, MysteryChallenge, Theme, UserThemePref } from '@/lib/types';

const DAILY_CHALLENGE_COUNT = 3;
const UNIQUE_VIOLATION = '23505';

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatDateString(new Date());
}

export function addDays(date: Date, delta: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + delta);
  return result;
}

function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function fetchThemes(): Promise<Theme[]> {
  const { data, error } = await supabase.from('themes').select('id, label, icon');
  if (error) throw error;
  return data ?? [];
}

async function fetchDailyChallengesForDate(userId: string, date: string): Promise<DailyChallenge[]> {
  const { data, error } = await supabase
    .from('daily_challenges')
    .select('id, complete, completed_at, challenge_id, est_bonus, challenges(*)')
    .eq('user_id', userId)
    .eq('date', date);

  if (error) throw error;
  return (data ?? []) as unknown as DailyChallenge[];
}

// Choisit jusqu'à 3 thèmes pour la journée : si l'utilisateur en a choisi plus de 3,
// on en tire 3 au hasard ; sinon on complète en répétant des thèmes déjà tirés.
function buildSlotAssignments(themePrefs: UserThemePref[]): UserThemePref[] {
  if (themePrefs.length >= DAILY_CHALLENGE_COUNT) {
    return shuffle(themePrefs).slice(0, DAILY_CHALLENGE_COUNT);
  }
  const base = shuffle(themePrefs);
  const slots = [...base];
  while (slots.length < DAILY_CHALLENGE_COUNT) {
    slots.push(base[Math.floor(Math.random() * base.length)]);
  }
  return slots;
}

// Pour chaque emplacement (thème + difficulté), tire un défi qui n'a pas déjà été
// choisi aujourd'hui. Si aucun défi ne correspond exactement à la difficulté, on
// élargit à n'importe quelle difficulté du même thème plutôt que de laisser un trou.
function pickChallenges(slots: UserThemePref[], candidates: Challenge[]): Challenge[] {
  const usedIds = new Set<string>();
  const picked: Challenge[] = [];

  for (const slot of slots) {
    const exactPool = candidates.filter(
      (c) => c.theme_id === slot.theme_id && c.difficulte === slot.difficulte && !usedIds.has(c.id),
    );
    const pool =
      exactPool.length > 0
        ? exactPool
        : candidates.filter((c) => c.theme_id === slot.theme_id && !usedIds.has(c.id));

    if (pool.length === 0) continue;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    usedIds.add(chosen.id);
    picked.push(chosen);
  }

  return picked;
}

export async function ensureDailyChallenges(userId: string): Promise<DailyChallenge[]> {
  const today = getTodayDateString();
  const existing = await fetchDailyChallengesForDate(userId, today);
  if (existing.length > 0) return existing;

  const { data: themePrefs, error: themePrefsError } = await supabase
    .from('user_theme_prefs')
    .select('theme_id, difficulte')
    .eq('user_id', userId);
  if (themePrefsError) throw themePrefsError;
  if (!themePrefs || themePrefs.length === 0) return [];

  const slots = buildSlotAssignments(themePrefs);
  const themeIds = [...new Set(slots.map((slot) => slot.theme_id))];

  const { data: candidates, error: challengesError } = await supabase
    .from('challenges')
    .select('*')
    .in('theme_id', themeIds);
  if (challengesError) throw challengesError;

  const picked = pickChallenges(slots, candidates ?? []);
  if (picked.length === 0) return [];

  const { data: inserted, error: insertError } = await supabase
    .from('daily_challenges')
    .insert(picked.map((challenge) => ({ user_id: userId, challenge_id: challenge.id, date: today })))
    .select('id, complete, completed_at, challenge_id, est_bonus, challenges(*)');

  if (insertError) {
    // Course avec un autre chargement concurrent (ex. double effet en dev) : on
    // relit simplement ce qui a été inséré entre-temps plutôt que d'échouer.
    if (insertError.code === UNIQUE_VIOLATION) {
      return fetchDailyChallengesForDate(userId, today);
    }
    throw insertError;
  }

  return (inserted ?? []) as unknown as DailyChallenge[];
}

async function fetchMysteryChallengeForDate(userId: string, date: string): Promise<MysteryChallenge | null> {
  const { data, error } = await supabase
    .from('mystery_challenges')
    .select('id, ouvert, complete, challenge_id, challenges(*)')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as MysteryChallenge) ?? null;
}

export async function ensureMysteryChallenge(userId: string): Promise<MysteryChallenge | null> {
  const today = getTodayDateString();
  const existing = await fetchMysteryChallengeForDate(userId, today);
  if (existing) return existing;

  const { data: allChallenges, error: challengesError } = await supabase.from('challenges').select('*');
  if (challengesError) throw challengesError;
  if (!allChallenges || allChallenges.length === 0) return null;

  const chosen = allChallenges[Math.floor(Math.random() * allChallenges.length)];

  const { data: inserted, error: insertError } = await supabase
    .from('mystery_challenges')
    .insert({ user_id: userId, challenge_id: chosen.id, date: today })
    .select('id, ouvert, complete, challenge_id, challenges(*)')
    .single();

  if (insertError) {
    if (insertError.code === UNIQUE_VIOLATION) {
      return fetchMysteryChallengeForDate(userId, today);
    }
    throw insertError;
  }

  return inserted as unknown as MysteryChallenge;
}
