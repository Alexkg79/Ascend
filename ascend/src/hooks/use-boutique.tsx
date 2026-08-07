import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { recoverMissedStreak, swapDailyChallenge, unlockBonusChallenge } from '@/lib/boutique';
import { getTodayDateString } from '@/lib/daily-challenges';
import { canRecoverMissedStreak } from '@/lib/streaks';
import { supabase } from '@/lib/supabase';
import type { DailyChallenge } from '@/lib/types';

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Une erreur est survenue.';
}

export function useBoutique() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [cristaux, setCristaux] = useState(0);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [canRecoverStreak, setCanRecoverStreak] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const today = getTodayDateString();
      const [profileResult, dailyResult, recoverable] = await Promise.all([
        supabase.from('profiles').select('cristaux').eq('id', userId).single(),
        supabase
          .from('daily_challenges')
          .select('id, complete, completed_at, challenge_id, est_bonus, challenges(*)')
          .eq('user_id', userId)
          .eq('date', today),
        canRecoverMissedStreak(userId),
      ]);
      if (profileResult.error) throw profileResult.error;
      if (dailyResult.error) throw dailyResult.error;

      setCristaux(profileResult.data.cristaux);
      setDailyChallenges((dailyResult.data ?? []) as unknown as DailyChallenge[]);
      setCanRecoverStreak(recoverable);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSwap(dailyChallengeId: string) {
    if (!userId || actionPending) return;
    setActionPending(true);
    setError(null);
    try {
      await swapDailyChallenge(userId, dailyChallengeId);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionPending(false);
    }
  }

  async function handleUnlockBonus() {
    if (!userId || actionPending) return;
    setActionPending(true);
    setError(null);
    try {
      await unlockBonusChallenge(userId);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionPending(false);
    }
  }

  async function handleRecoverStreak() {
    if (!userId || actionPending) return;
    setActionPending(true);
    setError(null);
    try {
      await recoverMissedStreak(userId);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionPending(false);
    }
  }

  return {
    cristaux,
    dailyChallenges,
    canRecoverStreak,
    loading,
    actionPending,
    error,
    handleSwap,
    handleUnlockBonus,
    handleRecoverStreak,
  };
}
