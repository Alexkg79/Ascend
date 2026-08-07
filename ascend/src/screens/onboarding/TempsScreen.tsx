import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton, AuthErrorText } from '@/screens/auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

import { OnboardingStepHeader } from './onboarding-components';
import { useOnboarding } from './onboarding-context';

const QUICK_MINUTES = [5, 10, 15, 20, 30, 45, 60];

export function TempsScreen() {
  const [fontsLoaded] = useAuthFonts();
  const router = useRouter();
  const {
    tempsDisponibleMin,
    setTempsDisponibleMin,
    dureeJours,
    selectedThemes,
    saving,
    saveError,
    finishOnboarding,
  } = useOnboarding();

  const [minutesText, setMinutesText] = useState(String(tempsDisponibleMin));

  if (!fontsLoaded) return null;

  function handleMinutesChange(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    setMinutesText(digits);
    const parsed = parseInt(digits, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setTempsDisponibleMin(parsed);
    }
  }

  function selectQuick(minutes: number) {
    setMinutesText(String(minutes));
    setTempsDisponibleMin(minutes);
  }

  async function handleFinish() {
    const ok = await finishOnboarding();
    if (ok) {
      router.replace('/(tabs)');
    }
  }

  const themeCount = Object.keys(selectedThemes).length;
  const canFinish = tempsDisponibleMin > 0 && minutesText.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingStepHeader
        step={3}
        total={3}
        title="Ton rythme"
        subtitle="Combien de temps peux-tu consacrer à tes défis chaque jour ?"
      />

      <View style={styles.content}>
        <View style={styles.quickRow}>
          {QUICK_MINUTES.map((minutes) => {
            const active = tempsDisponibleMin === minutes;
            return (
              <TouchableOpacity
                key={minutes}
                activeOpacity={0.85}
                onPress={() => selectQuick(minutes)}
                style={[styles.quickChip, active && styles.quickChipActive]}>
                <Text style={[styles.quickChipText, active && styles.quickChipTextActive]}>
                  {minutes}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            value={minutesText}
            onChangeText={handleMinutesChange}
            keyboardType="number-pad"
            style={styles.minutesInput}
          />
          <Text style={styles.minutesUnit}>minutes / jour</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ton profil</Text>
          <Text style={styles.summaryLine}>
            {themeCount} thème{themeCount > 1 ? 's' : ''} choisi{themeCount > 1 ? 's' : ''}
          </Text>
          <Text style={styles.summaryLine}>{dureeJours} jours de challenge</Text>
          <Text style={styles.summaryLine}>{tempsDisponibleMin} min / jour</Text>
        </View>

        <AuthErrorText message={saveError} />
      </View>

      <View style={styles.footer}>
        <AuthButton
          title="Terminer"
          onPress={handleFinish}
          loading={saving}
          disabled={!canFinish}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 20,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AuthColors.border,
    backgroundColor: AuthColors.bgSurface,
  },
  quickChipActive: {
    borderColor: AuthColors.teal,
    backgroundColor: AuthColors.bgSurfaceAlt,
  },
  quickChipText: {
    fontFamily: AuthFonts.mono,
    fontSize: 13,
    color: AuthColors.textMuted,
  },
  quickChipTextActive: {
    color: AuthColors.teal,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  minutesInput: {
    height: 50,
    width: 90,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1.5,
    borderColor: AuthColors.border,
    color: AuthColors.textPrimary,
    fontFamily: AuthFonts.display,
    fontSize: 18,
    textAlign: 'center',
  },
  minutesUnit: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textMuted,
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: AuthColors.violet,
    backgroundColor: AuthColors.bgSurfaceAlt,
    padding: 16,
    gap: 6,
  },
  summaryTitle: {
    fontFamily: AuthFonts.display,
    fontSize: 15,
    color: AuthColors.textPrimary,
    marginBottom: 2,
  },
  summaryLine: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textMuted,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
