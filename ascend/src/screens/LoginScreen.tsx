import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';

import {
  AuthButton,
  AuthErrorText,
  AuthLink,
  AuthLogo,
  AuthTextInput,
} from './auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from './auth-theme';

type LoginScreenProps = {
  onNavigateToSignup: () => void;
};

export function LoginScreen({ onNavigateToSignup }: LoginScreenProps) {
  const [fontsLoaded] = useAuthFonts();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!fontsLoaded) return null;

  async function handleLogin() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Renseigne ton e-mail et ton mot de passe.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <AuthLogo />

          <View style={styles.form}>
            <Text style={styles.title}>Content de te revoir</Text>

            <AuthTextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="toi@exemple.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <AuthTextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              textContentType="password"
            />

            <AuthErrorText message={error} />

            <AuthButton title="Se connecter" onPress={handleLogin} loading={loading} />
          </View>

          <AuthLink
            label="Pas encore de compte ?"
            actionLabel="Créer un compte"
            onPress={onNavigateToSignup}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AuthColors.bgDeep,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  form: {
    gap: 14,
  },
  title: {
    fontFamily: AuthFonts.display,
    fontSize: 22,
    color: AuthColors.textPrimary,
    marginBottom: 6,
  },
});
