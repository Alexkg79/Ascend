import { StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

const LEGEND_ITEMS: { label: string; color: string; filled: boolean }[] = [
  { label: 'Réussi', color: AuthColors.gold, filled: true },
  { label: 'Manqué', color: AuthColors.textMuted, filled: false },
  { label: 'Récupéré', color: AuthColors.violet, filled: true },
];

export function CalendarLegend() {
  return (
    <View style={styles.row}>
      {LEGEND_ITEMS.map((item) => (
        <View key={item.label} style={styles.item}>
          <View
            style={[
              styles.dot,
              item.filled
                ? { backgroundColor: item.color, borderColor: item.color }
                : { borderColor: item.color },
            ]}
          />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  label: {
    fontFamily: AuthFonts.mono,
    fontSize: 10.5,
    color: AuthColors.textMuted,
  },
});
