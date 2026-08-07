import { Flame, Gem } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { LevelRing } from '@/components/level-ring';
import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type HomeHeaderProps = {
  niveau: number;
  xpDansNiveau: number;
  xpProchainNiveau: number;
  streak: number;
  cristaux: number;
};

export function HomeHeader({ niveau, xpDansNiveau, xpProchainNiveau, streak, cristaux }: HomeHeaderProps) {
  const percentage = xpProchainNiveau > 0 ? (xpDansNiveau / xpProchainNiveau) * 100 : 0;

  return (
    <View style={styles.row}>
      <View style={styles.identity}>
        <LevelRing size={48} strokeWidth={4} percentage={percentage}>
          <Text style={styles.level}>{niveau}</Text>
        </LevelRing>
        <View>
          <Text style={styles.greeting}>Salut 👋</Text>
          <Text style={styles.xp}>
            {xpDansNiveau} / {xpProchainNiveau} XP
          </Text>
        </View>
      </View>

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Flame size={14} color={AuthColors.gold} />
          <Text style={styles.chipText}>{streak}</Text>
        </View>
        <View style={styles.chip}>
          <Gem size={14} color={AuthColors.teal} />
          <Text style={styles.chipText}>{cristaux}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  level: {
    fontFamily: AuthFonts.displayBold,
    fontSize: 13,
    color: AuthColors.textPrimary,
  },
  greeting: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 14,
    color: AuthColors.textPrimary,
  },
  xp: {
    fontFamily: AuthFonts.mono,
    fontSize: 10.5,
    color: AuthColors.textMuted,
    marginTop: 2,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
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
