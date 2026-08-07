import { Stack } from 'expo-router';

import { OnboardingProvider } from '@/screens/onboarding/onboarding-context';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OnboardingProvider>
  );
}
