import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

import { DIFFICULTE_OPTIONS, type Difficulte } from './onboarding-context';

type OnboardingStepHeaderProps = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
};

export function OnboardingStepHeader({ step, total, title, subtitle }: OnboardingStepHeaderProps) {
  return (
    <View style={headerStyles.wrap}>
      <Text style={headerStyles.step}>{`ÉTAPE ${step} SUR ${total}`}</Text>
      <Text style={headerStyles.title}>{title}</Text>
      {subtitle ? <Text style={headerStyles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  step: {
    fontFamily: AuthFonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: AuthColors.textMuted,
  },
  title: {
    fontFamily: AuthFonts.display,
    fontSize: 26,
    fontWeight: '600',
    color: AuthColors.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textMuted,
    marginTop: 4,
  },
});

type DifficultySelectorProps = {
  value: Difficulte;
  onChange: (value: Difficulte) => void;
  accentColor: string;
};

export function DifficultySelector({ value, onChange, accentColor }: DifficultySelectorProps) {
  return (
    <View style={diffStyles.row}>
      {DIFFICULTE_OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.8}
            onPress={() => onChange(option.value)}
            style={[
              diffStyles.pill,
              active && { backgroundColor: accentColor, borderColor: accentColor },
            ]}>
            <Text style={[diffStyles.pillText, active && diffStyles.pillTextActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const diffStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  pill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: AuthColors.border,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  pillText: {
    fontFamily: AuthFonts.bodyMedium,
    fontSize: 11,
    color: AuthColors.textMuted,
  },
  pillTextActive: {
    color: AuthColors.bgDeep,
    fontFamily: AuthFonts.bodySemiBold,
  },
});
