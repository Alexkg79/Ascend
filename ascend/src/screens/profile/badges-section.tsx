import { Award } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { BadgeEarned } from '@/hooks/use-profile-progress';
import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type BadgesSectionProps = {
  badges: BadgeEarned[];
};

export function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Badges</Text>

      {badges.length === 0 ? (
        <Text style={styles.empty}>Pas encore de badge débloqué.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {badges.map((badge) => (
            <View key={badge.id} style={styles.badge}>
              <View style={styles.badgeIcon}>
                <Award size={20} color={AuthColors.gold} />
              </View>
              <Text style={styles.badgeLabel} numberOfLines={1}>
                {badge.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  title: {
    fontFamily: AuthFonts.display,
    fontSize: 15,
    fontWeight: '600',
    color: AuthColors.textPrimary,
  },
  empty: {
    fontFamily: AuthFonts.body,
    fontSize: 12.5,
    color: AuthColors.textMuted,
    marginTop: 10,
  },
  row: {
    gap: 10,
    marginTop: 12,
    paddingRight: 24,
  },
  badge: {
    width: 72,
    alignItems: 'center',
    gap: 6,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  badgeLabel: {
    fontFamily: AuthFonts.mono,
    fontSize: 9.5,
    color: AuthColors.textMuted,
    textAlign: 'center',
  },
});
