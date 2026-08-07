import { Award, Flame } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { LevelRing } from '@/components/level-ring';
import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type ProfileHeaderProps = {
  niveau: number;
  xpDansNiveau: number;
  xpProchainNiveau: number;
  streak: number;
  badgeCount: number;
};

export function ProfileHeader({
  niveau,
  xpDansNiveau,
  xpProchainNiveau,
  streak,
  badgeCount,
}: ProfileHeaderProps) {
  const percentage = xpProchainNiveau > 0 ? (xpDansNiveau / xpProchainNiveau) * 100 : 0;

  return (
    <View style={styles.wrap}>
      <LevelRing size={92} strokeWidth={7} percentage={percentage} niveau={niveau}>
        <View style={styles.ringContent}>
          <Text style={styles.niveau}>{niveau}</Text>
          <Text style={styles.niveauLabel}>NIVEAU</Text>
        </View>
      </LevelRing>

      <Text style={styles.xp}>
        {xpDansNiveau} / {xpProchainNiveau} XP
      </Text>

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Flame size={14} color={AuthColors.gold} />
          <Text style={styles.chipText}>{streak} jours</Text>
        </View>
        <View style={styles.chip}>
          <Award size={14} color={AuthColors.violet} />
          <Text style={styles.chipText}>{badgeCount} badges</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: 16,
  },
  ringContent: {
    alignItems: 'center',
  },
  niveau: {
    fontFamily: AuthFonts.displayBold,
    fontSize: 22,
    color: AuthColors.textPrimary,
  },
  niveauLabel: {
    fontFamily: AuthFonts.mono,
    fontSize: 8.5,
    color: AuthColors.textMuted,
  },
  xp: {
    fontFamily: AuthFonts.mono,
    fontSize: 11,
    color: AuthColors.textMuted,
    marginTop: 8,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  chipText: {
    fontFamily: AuthFonts.mono,
    fontSize: 12,
    color: AuthColors.textPrimary,
  },
});
