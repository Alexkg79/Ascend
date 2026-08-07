import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { formatDateString } from '@/lib/daily-challenges';
import { supabase } from '@/lib/supabase';
import type { StatutStreak } from '@/lib/types';

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Une erreur est survenue.';
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function useMonthStreaks() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()));
  const [statutByDate, setStatutByDate] = useState<Record<string, StatutStreak>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Voir use-daily-challenges.tsx : useFocusEffect peut redéclencher son
  // callback plusieurs fois pour une même transition de navigation.
  const loadInFlightRef = useRef(false);

  const load = useCallback(async () => {
    if (!userId || loadInFlightRef.current) return;
    loadInFlightRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const firstDay = formatDateString(monthDate);
      const lastDay = formatDateString(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0));

      const { data, error: fetchError } = await supabase
        .from('streaks_history')
        .select('date, statut')
        .eq('user_id', userId)
        .gte('date', firstDay)
        .lte('date', lastDay);
      if (fetchError) throw fetchError;

      const map: Record<string, StatutStreak> = {};
      for (const row of data ?? []) {
        map[row.date as string] = row.statut as StatutStreak;
      }
      setStatutByDate(map);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      loadInFlightRef.current = false;
    }
  }, [userId, monthDate]);

  // Recharge à chaque focus de l'écran (pas juste au montage ou au
  // changement de mois) : sans ça, "aujourd'hui" peut rester affiché comme
  // manqué jusqu'à un remontage complet de l'écran après une validation.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const goToPreviousMonth = useCallback(() => {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  return { monthDate, statutByDate, loading, error, goToPreviousMonth, goToNextMonth };
}
