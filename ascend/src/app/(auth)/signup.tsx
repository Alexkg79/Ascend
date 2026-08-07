import { useRouter } from 'expo-router';

import { SignupScreen } from '@/screens/SignupScreen';

export default function Signup() {
  const router = useRouter();
  return <SignupScreen onNavigateToLogin={() => router.push('/(auth)/login')} />;
}
