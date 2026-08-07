import { Check, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

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
  const cardOpacity = useSharedValue(done ? 0.55 : 1);
  const checkScale = useSharedValue(1);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    cardOpacity.value = withTiming(done ? 0.55 : 1, { duration: 220 });

    if (done) {
      checkScale.value = withSequence(
        withTiming(1.35, { duration: 90, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <TouchableOpacity activeOpacity={done ? 1 : 0.85} disabled={done} onPress={onPress}>
      <Animated.View style={[styles.card, cardAnimatedStyle]}>
        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}22` }]}>
          <Icon size={18} color={accentColor} />
        </View>

        <View style={styles.info}>
          <Text style={[styles.titre, done && styles.titreDone]} numberOfLines={2}>
            {titre}
          </Text>
          <Text style={styles.xp}>+{xp} XP</Text>
        </View>

        <Animated.View style={[styles.checkbox, done && styles.checkboxDone, checkAnimatedStyle]}>
          {done && <Check size={14} color={AuthColors.bgDeep} strokeWidth={3} />}
        </Animated.View>
      </Animated.View>
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
