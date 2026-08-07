import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { supabase } from '@/lib/supabase';

// 'unknown' while the check hasn't resolved yet (or there is no session).
export type OnboardingStatus = 'unknown' | 'pending' | 'complete';

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  onboardingStatus: OnboardingStatus;
  refreshOnboardingStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>('unknown');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  // Onboarding is considered complete once a user_challenge_prefs row exists —
  // it's only written at the very end of the onboarding flow (see OnboardingProvider).
  const refreshOnboardingStatus = useCallback(async () => {
    if (!userId) {
      setOnboardingStatus('unknown');
      return;
    }
    const { data, error } = await supabase
      .from('user_challenge_prefs')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    setOnboardingStatus(!error && data ? 'complete' : 'pending');
  }, [userId]);

  useEffect(() => {
    refreshOnboardingStatus();
  }, [refreshOnboardingStatus]);

  return (
    <AuthContext.Provider value={{ session, loading, onboardingStatus, refreshOnboardingStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
