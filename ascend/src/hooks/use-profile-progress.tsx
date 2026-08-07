import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { calculerProgression, seuilNiveauCompetence } from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import type { Profile, Theme } from '@/lib/types';

export type SkillProgress = {
  themeId: string;
  themeLabel: string;
  themeIcon: string | null;
  niveau: number;
  xpDansNiveau: number;
  xpProchainNiveau: number;
};

export type BadgeEarned = {
  id: string;
  label: string;
  description: string | null;
  icon: string | null;
};

export type ProfileStatsData = {
  totalDefisCompletes: number;
  meilleurStreak: number;
  joursActifs: number;
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Une erreur est survenue.';
}

export function useProfileProgress() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [badges, setBadges] = useState<BadgeEarned[]>([]);
  const [stats, setStats] = useState<ProfileStatsData>({
    totalDefisCompletes: 0,
    meilleurStreak: 0,
    joursActifs: 0,
  });
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
      const [
        profileResult,
        themePrefsResult,
        skillsResult,
        badgesResult,
        dailyCompletedResult,
        mysteryCompletedResult,
        activeDaysResult,
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, xp_global, cristaux, streak_actuel, streak_max')
          .eq('id', userId)
          .single(),
        supabase.from('user_theme_prefs').select('theme_id, themes(id, label, icon)').eq('user_id', userId),
        supabase.from('user_skills').select('theme_id, niveau, xp').eq('user_id', userId),
        supabase.from('user_badges').select('badge_id, badges(id, label, description, icon)').eq('user_id', userId),
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
        supabase
          .from('streaks_history')
          .select('date', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (themePrefsResult.error) throw themePrefsResult.error;
      if (skillsResult.error) throw skillsResult.error;
      if (badgesResult.error) throw badgesResult.error;
      if (dailyCompletedResult.error) throw dailyCompletedResult.error;
      if (mysteryCompletedResult.error) throw mysteryCompletedResult.error;
      if (activeDaysResult.error) throw activeDaysResult.error;

      setProfile(profileResult.data);
      setStats({
        totalDefisCompletes: (dailyCompletedResult.count ?? 0) + (mysteryCompletedResult.count ?? 0),
        meilleurStreak: profileResult.data.streak_max,
        joursActifs: activeDaysResult.count ?? 0,
      });

      const skillXpByTheme = new Map(
        (skillsResult.data ?? []).map((skill) => [skill.theme_id as string, skill.xp as number]),
      );

      const skillProgress: SkillProgress[] = (themePrefsResult.data ?? [])
        .map((pref) => {
          const theme = pref.themes as unknown as Theme | null;
          if (!theme) return null;
          const progression = calculerProgression(skillXpByTheme.get(theme.id) ?? 0, seuilNiveauCompetence);
          return {
            themeId: theme.id,
            themeLabel: theme.label,
            themeIcon: theme.icon,
            niveau: progression.niveau,
            xpDansNiveau: progression.xpDansNiveau,
            xpProchainNiveau: progression.xpProchainNiveau,
          };
        })
        .filter((skill): skill is SkillProgress => skill !== null);
      setSkills(skillProgress);

      const earnedBadges = (badgesResult.data ?? [])
        .map((row) => row.badges as unknown as BadgeEarned | null)
        .filter((badge): badge is BadgeEarned => badge !== null);
      setBadges(earnedBadges);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      loadInFlightRef.current = false;
    }
  }, [userId]);

  // Recharge à chaque focus de l'écran (pas juste au montage) : sans ça,
  // revenir sur Profil après avoir validé un défi ailleurs affiche un
  // niveau/XP obsolète jusqu'au prochain remontage complet de l'écran.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { profile, skills, badges, stats, loading, error };
}
