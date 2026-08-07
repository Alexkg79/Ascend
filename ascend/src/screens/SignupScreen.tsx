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
  AuthSuccessText,
  AuthTextInput,
} from './auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from './auth-theme';

type SignupScreenProps = {
  onNavigateToLogin: () => void;
};

export function SignupScreen({ onNavigateToLogin }: SignupScreenProps) {
  const [fontsLoaded] = useAuthFonts();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  if (!fontsLoaded) return null;

  async function handleSignup() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Renseigne ton e-mail et ton mot de passe.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    // La ligne profiles est créée côté serveur par un trigger sur auth.users
    // (voir docs/schema.sql) — pas d'insertion client ici, la confirmation
    // e-mail signifie qu'aucune session n'est encore disponible à ce stade.
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setConfirmationSent(true);
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
            <Text style={styles.title}>Crée ton compte</Text>

            {confirmationSent ? (
              <AuthSuccessText message="Compte créé ! Vérifie tes e-mails pour confirmer ton adresse avant de te connecter." />
            ) : (
              <>
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
                  textContentType="newPassword"
                />

                <AuthErrorText message={error} />

                <AuthButton title="Créer un compte" onPress={handleSignup} loading={loading} />
              </>
            )}
          </View>

          <AuthLink
            label="Tu as déjà un compte ?"
            actionLabel="Se connecter"
            onPress={onNavigateToLogin}
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
