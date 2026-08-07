import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/screens/auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

import { OnboardingStepHeader } from './onboarding-components';
import { useOnboarding } from './onboarding-context';

const PRESETS = [7, 30, 60, 90];

export function DureeScreen() {
  const [fontsLoaded] = useAuthFonts();
  const router = useRouter();
  const { dureeJours, setDureeJours } = useOnboarding();

  const [customMode, setCustomMode] = useState(!PRESETS.includes(dureeJours));
  const [customValue, setCustomValue] = useState(
    PRESETS.includes(dureeJours) ? '' : String(dureeJours),
  );

  if (!fontsLoaded) return null;

  function selectPreset(days: number) {
    setCustomMode(false);
    setDureeJours(days);
  }

  function handleCustomChange(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    setCustomValue(digits);
    const parsed = parseInt(digits, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setDureeJours(parsed);
    }
  }

  const canContinue = dureeJours > 0 && !(customMode && customValue.trim().length === 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingStepHeader
        step={2}
        total={3}
        title="Choisis la durée du challenge"
        subtitle="Tu pourras la prolonger plus tard."
      />

      <View style={styles.content}>
        <View style={styles.presetGrid}>
          {PRESETS.map((days) => {
            const active = !customMode && dureeJours === days;
            return (
              <TouchableOpacity
                key={days}
                activeOpacity={0.85}
                onPress={() => selectPreset(days)}
                style={[styles.presetCard, active && styles.presetCardActive]}>
                <Text style={[styles.presetValue, active && styles.presetValueActive]}>
                  {days}
                </Text>
                <Text style={[styles.presetLabel, active && styles.presetLabelActive]}>
                  jours
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setCustomMode(true)}
          style={[styles.customCard, customMode && styles.customCardActive]}>
          <Text style={styles.customLabel}>Durée personnalisée</Text>
          <TextInput
            value={customValue}
            onChangeText={handleCustomChange}
            onFocus={() => setCustomMode(true)}
            keyboardType="number-pad"
            placeholder="ex : 45"
            placeholderTextColor={AuthColors.textMuted}
            style={styles.customInput}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <AuthButton
          title="Continuer"
          onPress={() => router.push('/(onboarding)/temps')}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 14,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    width: '47%',
    paddingVertical: 22,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: AuthColors.border,
    backgroundColor: AuthColors.bgSurface,
    alignItems: 'center',
  },
  presetCardActive: {
    borderColor: AuthColors.gold,
    backgroundColor: AuthColors.bgSurfaceAlt,
  },
  presetValue: {
    fontFamily: AuthFonts.display,
    fontSize: 26,
    color: AuthColors.textPrimary,
  },
  presetValueActive: {
    color: AuthColors.gold,
  },
  presetLabel: {
    fontFamily: AuthFonts.mono,
    fontSize: 11,
    color: AuthColors.textMuted,
    marginTop: 4,
  },
  presetLabelActive: {
    color: AuthColors.gold,
  },
  customCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: AuthColors.border,
    backgroundColor: AuthColors.bgSurface,
    padding: 16,
    gap: 10,
  },
  customCardActive: {
    borderColor: AuthColors.violet,
  },
  customLabel: {
    fontFamily: AuthFonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    color: AuthColors.textMuted,
    textTransform: 'uppercase',
  },
  customInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: AuthColors.bgDeep,
    color: AuthColors.textPrimary,
    fontFamily: AuthFonts.body,
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
