import { Calendar, Flame, Target, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type ProfileStatsProps = {
  totalDefisCompletes: number;
  meilleurStreak: number;
  joursActifs: number;
};

export function ProfileStats({ totalDefisCompletes, meilleurStreak, joursActifs }: ProfileStatsProps) {
  const items: { icon: LucideIcon; value: number; label: string }[] = [
    { icon: Target, value: totalDefisCompletes, label: 'Défis complétés' },
    { icon: Flame, value: meilleurStreak, label: 'Meilleur streak' },
    { icon: Calendar, value: joursActifs, label: 'Jours actifs' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Statistiques</Text>

      <View style={styles.row}>
        {items.map(({ icon: Icon, value, label }) => (
          <View key={label} style={styles.card}>
            <Icon size={16} color={AuthColors.gold} />
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  title: {
    fontFamily: AuthFonts.display,
    fontSize: 15,
    fontWeight: '600',
    color: AuthColors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  value: {
    fontFamily: AuthFonts.displayBold,
    fontSize: 18,
    color: AuthColors.textPrimary,
  },
  label: {
    fontFamily: AuthFonts.mono,
    fontSize: 9,
    color: AuthColors.textMuted,
    textAlign: 'center',
  },
});
