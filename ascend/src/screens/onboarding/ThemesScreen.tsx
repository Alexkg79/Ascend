import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/screens/auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

import { getThemeAccentColor, getThemeIcon } from '@/lib/theme-icons';

import { DifficultySelector, OnboardingStepHeader } from './onboarding-components';
import { useOnboarding } from './onboarding-context';

export function ThemesScreen() {
  const [fontsLoaded] = useAuthFonts();
  const router = useRouter();
  const { themes, themesLoading, themesError, selectedThemes, toggleTheme, setThemeDifficulte } =
    useOnboarding();

  if (!fontsLoaded) return null;

  const canContinue = Object.keys(selectedThemes).length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingStepHeader
        step={1}
        total={3}
        title="Choisis tes thèmes"
        subtitle="Tu pourras en changer à tout moment."
      />

      {themesLoading ? (
        <ActivityIndicator color={AuthColors.violet} style={styles.loader} />
      ) : themesError ? (
        <Text style={styles.errorText}>{themesError}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.grid} keyboardShouldPersistTaps="handled">
          {themes.map((theme, index) => {
            const isSelected = theme.id in selectedThemes;
            const Icon = getThemeIcon(theme.icon);
            const accentColor = getThemeAccentColor(index);

            return (
              <View key={theme.id} style={styles.cardSlot}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => toggleTheme(theme.id)}
                  style={[
                    styles.card,
                    {
                      borderColor: isSelected ? accentColor : AuthColors.border,
                      backgroundColor: isSelected ? AuthColors.bgSurfaceAlt : AuthColors.bgSurface,
                    },
                  ]}>
                  {isSelected && (
                    <View style={[styles.badge, { backgroundColor: accentColor }]}>
                      <Check size={12} color={AuthColors.bgDeep} strokeWidth={3} />
                    </View>
                  )}
                  <Icon size={22} color={accentColor} />
                  <Text style={styles.cardLabel}>{theme.label}</Text>
                </TouchableOpacity>

                {isSelected && (
                  <DifficultySelector
                    value={selectedThemes[theme.id]}
                    onChange={(value) => setThemeDifficulte(theme.id, value)}
                    accentColor={accentColor}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <AuthButton
          title="Continuer"
          onPress={() => router.push('/(onboarding)/duree')}
          disabled={!canContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AuthColors.bgDeep,
  },
  loader: {
    marginTop: 32,
  },
  errorText: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.danger,
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  cardSlot: {
    width: '47%',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontFamily: AuthFonts.bodyMedium,
    fontSize: 14,
    color: AuthColors.textPrimary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
