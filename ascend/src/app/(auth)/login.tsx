import { useRouter } from 'expo-router';

import { LoginScreen } from '@/screens/LoginScreen';

export default function Login() {
  const router = useRouter();
  return <LoginScreen onNavigateToSignup={() => router.push('/(auth)/signup')} />;
}
