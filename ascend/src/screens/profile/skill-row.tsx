import { StyleSheet, Text, View } from 'react-native';

import { getThemeIcon } from '@/lib/theme-icons';
import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type SkillRowProps = {
  icon: string | null;
  accentColor: string;
  label: string;
  niveau: number;
  percentage: number;
};

export function SkillRow({ icon, accentColor, label, niveau, percentage }: SkillRowProps) {
  const Icon = getThemeIcon(icon);
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <View style={styles.row}>
      <Icon size={16} color={accentColor} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: accentColor }]} />
      </View>
      <Text style={styles.niveau}>{niveau}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  label: {
    fontFamily: AuthFonts.body,
    fontSize: 12.5,
    color: AuthColors.textPrimary,
    width: 96,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  niveau: {
    fontFamily: AuthFonts.mono,
    fontSize: 10.5,
    color: AuthColors.textMuted,
    width: 24,
    textAlign: 'right',
  },
});
