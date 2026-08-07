import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

export type Difficulte = 'facile' | 'moyen' | 'difficile';

export const DIFFICULTE_OPTIONS: { value: Difficulte; label: string }[] = [
  { value: 'facile', label: 'Facile' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'difficile', label: 'Difficile' },
];

const DEFAULT_DIFFICULTE: Difficulte = 'moyen';
const DEFAULT_DUREE_JOURS = 30;
const DEFAULT_TEMPS_MIN = 15;

export type ThemeOption = {
  id: string;
  label: string;
  icon: string | null;
};

type OnboardingContextValue = {
  themes: ThemeOption[];
  themesLoading: boolean;
  themesError: string | null;
  selectedThemes: Record<string, Difficulte>;
  toggleTheme: (themeId: string) => void;
  setThemeDifficulte: (themeId: string, difficulte: Difficulte) => void;
  dureeJours: number;
  setDureeJours: (jours: number) => void;
  tempsDisponibleMin: number;
  setTempsDisponibleMin: (minutes: number) => void;
  saving: boolean;
  saveError: string | null;
  finishOnboarding: () => Promise<boolean>;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { session, refreshOnboardingStatus } = useAuth();

  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [themesLoading, setThemesLoading] = useState(true);
  const [themesError, setThemesError] = useState<string | null>(null);

  const [selectedThemes, setSelectedThemes] = useState<Record<string, Difficulte>>({});
  const [dureeJours, setDureeJours] = useState(DEFAULT_DUREE_JOURS);
  const [tempsDisponibleMin, setTempsDisponibleMin] = useState(DEFAULT_TEMPS_MIN);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('themes')
      .select('id, label, icon')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setThemesError(error.message);
        } else {
          setThemes(data ?? []);
        }
        setThemesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleTheme(themeId: string) {
    setSelectedThemes((prev) => {
      if (!(themeId in prev)) {
        return { ...prev, [themeId]: DEFAULT_DIFFICULTE };
      }
      const next = { ...prev };
      delete next[themeId];
      return next;
    });
  }

  function setThemeDifficulte(themeId: string, difficulte: Difficulte) {
    setSelectedThemes((prev) => (themeId in prev ? { ...prev, [themeId]: difficulte } : prev));
  }

  async function finishOnboarding() {
    if (!session) return false;
    setSaving(true);
    setSaveError(null);

    const userId = session.user.id;

    const { error: prefsError } = await supabase.from('user_challenge_prefs').upsert({
      user_id: userId,
      duree_jours: dureeJours,
      temps_disponible_min: tempsDisponibleMin,
    });

    if (prefsError) {
      setSaving(false);
      setSaveError(prefsError.message);
      return false;
    }

    const themeRows = Object.entries(selectedThemes).map(([theme_id, difficulte]) => ({
      user_id: userId,
      theme_id,
      difficulte,
    }));

    if (themeRows.length > 0) {
      const { error: themePrefsError } = await supabase.from('user_theme_prefs').upsert(themeRows);
      if (themePrefsError) {
        setSaving(false);
        setSaveError(themePrefsError.message);
        return false;
      }
    }

    setSaving(false);
    await refreshOnboardingStatus();
    return true;
  }

  return (
    <OnboardingContext.Provider
      value={{
        themes,
        themesLoading,
        themesError,
        selectedThemes,
        toggleTheme,
        setThemeDifficulte,
        dureeJours,
        setDureeJours,
        tempsDisponibleMin,
        setTempsDisponibleMin,
        saving,
        saveError,
        finishOnboarding,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
