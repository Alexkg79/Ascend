import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

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
  // useFocusEffect peut redéclencher son callback plusieurs fois de suite
  // pendant une même transition de navigation. Sans garde, deux appels à
  // load() qui se chevauchent peuvent tous les deux lire "aucun défi
  // aujourd'hui" avant que l'un ou l'autre n'ait inséré — et donc générer
  // chacun leur propre lot de défis (ensureDailyChallenges n'est pas
  // atomique). Ce ref sérialise les appels : un load() déjà en cours bloque
  // les suivants jusqu'à ce qu'il se termine.
  const loadInFlightRef = useRef(false);

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
    if (!userId || loadInFlightRef.current) return;
    loadInFlightRef.current = true;
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
      loadInFlightRef.current = false;
    }
  }, [userId, loadProfile]);

  // Recharge à chaque focus de l'écran (pas juste au montage) : couvre le
  // retour de la boutique, où le solde de cristaux, les défis du jour (ex.
  // défi bonus débloqué) ou le streak peuvent avoir changé entre-temps.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

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
