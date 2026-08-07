import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { completeDailyChallenge, completeMysteryChallenge, openMysteryChallenge } from '@/lib/challenge-rewards';
import { ensureDailyChallenges, ensureMysteryChallenge, fetchThemes } from '@/lib/daily-challenges';
import { supabase } from '@/lib/supabase';
import { syncStreakActuel } from '@/lib/streaks';
import type { DailyChallenge, MysteryChallenge, Profile, Theme } from '@/lib/types';

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Une erreur est survenue.';
}

export function useDailyChallenges() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [mysteryChallenge, setMysteryChallenge] = useState<MysteryChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (id: string) => {
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, xp_global, cristaux, streak_actuel, streak_max')
      .eq('id', id)
      .single();
    if (profileError) throw profileError;
    setProfile(data);
  }, []);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      // Vérifie/rompt le streak avant toute autre chose — même si rien n'est
      // encore validé aujourd'hui — puis seulement ensuite l'incrémentation
      // normale (dans completeChallenge/completeMystery) s'applique par-dessus.
      await syncStreakActuel(userId);

      const [daily, mystery, themesData] = await Promise.all([
        ensureDailyChallenges(userId),
        ensureMysteryChallenge(userId),
        fetchThemes(),
      ]);
      setDailyChallenges(daily);
      setMysteryChallenge(mystery);
      setThemes(themesData);
      await loadProfile(userId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId, loadProfile]);

  useEffect(() => {
    load();
  }, [load]);

  async function completeChallenge(dailyChallengeId: string) {
    if (!userId) return;
    const target = dailyChallenges.find((d) => d.id === dailyChallengeId);
    if (!target || target.complete) return;

    setDailyChallenges((prev) =>
      prev.map((d) =>
        d.id === dailyChallengeId ? { ...d, complete: true, completed_at: new Date().toISOString() } : d,
      ),
    );

    try {
      const result = await completeDailyChallenge(userId, dailyChallengeId, target.challenges);
      if (result) {
        await loadProfile(userId);
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setDailyChallenges((prev) =>
        prev.map((d) => (d.id === dailyChallengeId ? { ...d, complete: false, completed_at: null } : d)),
      );
    }
  }

  async function openMystery() {
    if (!userId || !mysteryChallenge || mysteryChallenge.ouvert) return;

    setMysteryChallenge((prev) => (prev ? { ...prev, ouvert: true } : prev));

    try {
      await openMysteryChallenge(userId, mysteryChallenge.id);
    } catch (err) {
      setError(getErrorMessage(err));
      setMysteryChallenge((prev) => (prev ? { ...prev, ouvert: false } : prev));
    }
  }

  async function completeMystery() {
    if (!userId || !mysteryChallenge || mysteryChallenge.complete) return;
    const target = mysteryChallenge;

    setMysteryChallenge((prev) => (prev ? { ...prev, complete: true } : prev));

    try {
      const result = await completeMysteryChallenge(userId, target.id, target.challenges);
      if (result) {
        await loadProfile(userId);
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setMysteryChallenge((prev) => (prev ? { ...prev, complete: false } : prev));
    }
  }

  return {
    profile,
    themes,
    dailyChallenges,
    mysteryChallenge,
    loading,
    error,
    completeChallenge,
    openMystery,
    completeMystery,
  };
}
