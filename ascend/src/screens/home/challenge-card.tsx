import { Check, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type ChallengeCardProps = {
  icon: LucideIcon;
  accentColor: string;
  titre: string;
  xp: number;
  done: boolean;
  onPress: () => void;
};

export function ChallengeCard({ icon: Icon, accentColor, titre, xp, done, onPress }: ChallengeCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={done ? 1 : 0.85}
      disabled={done}
      onPress={onPress}
      style={[styles.card, done && styles.cardDone]}>
      <View style={[styles.iconWrap, { backgroundColor: `${accentColor}22` }]}>
        <Icon size={18} color={accentColor} />
      </View>

      <View style={styles.info}>
        <Text style={[styles.titre, done && styles.titreDone]} numberOfLines={2}>
          {titre}
        </Text>
        <Text style={styles.xp}>+{xp} XP</Text>
      </View>

      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        {done && <Check size={14} color={AuthColors.bgDeep} strokeWidth={3} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  cardDone: {
    opacity: 0.55,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  titre: {
    fontFamily: AuthFonts.bodyMedium,
    fontSize: 13.5,
    color: AuthColors.textPrimary,
  },
  titreDone: {
    textDecorationLine: 'line-through',
  },
  xp: {
    fontFamily: AuthFonts.mono,
    fontSize: 11,
    color: AuthColors.gold,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: AuthColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: AuthColors.gold,
    borderColor: AuthColors.gold,
  },
});
