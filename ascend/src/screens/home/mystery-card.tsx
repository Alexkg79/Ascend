import { Check, ChevronRight, CircleQuestionMark } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type MysteryCardProps = {
  ouvert: boolean;
  complete: boolean;
  titre: string;
  xp: number;
  onOpen: () => void;
  onComplete: () => void;
};

export function MysteryCard({ ouvert, complete, titre, xp, onOpen, onComplete }: MysteryCardProps) {
  const disabled = ouvert && complete;

  const revealProgress = useSharedValue(1);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (ouvert) {
      revealProgress.value = 0;
      revealProgress.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert]);

  const revealAnimatedStyle = useAnimatedStyle(() => ({
    opacity: revealProgress.value,
    transform: [{ scale: 0.94 + revealProgress.value * 0.06 }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled}
      onPress={ouvert ? onComplete : onOpen}
      style={[styles.card, complete && styles.cardDone]}>
      <View style={styles.iconWrap}>
        <CircleQuestionMark size={20} color={AuthColors.violet} />
      </View>

      <Animated.View style={[styles.info, revealAnimatedStyle]}>
        <Text style={[styles.title, complete && styles.titleDone]}>
          {ouvert ? titre : 'Défi mystère'}
        </Text>
        <Text style={styles.subtitle}>
          {ouvert ? `+${xp} XP · défi mystère` : 'Récompense surprise à la clé'}
        </Text>
      </Animated.View>

      {ouvert ? (
        <View style={[styles.checkbox, complete && styles.checkboxDone]}>
          {complete && <Check size={14} color={AuthColors.bgDeep} strokeWidth={3} />}
        </View>
      ) : (
        <ChevronRight size={16} color={AuthColors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: AuthColors.bgSurfaceAlt,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: `${AuthColors.violet}88`,
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
    backgroundColor: `${AuthColors.violet}22`,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 13.5,
    color: AuthColors.textPrimary,
  },
  titleDone: {
    textDecorationLine: 'line-through',
  },
  subtitle: {
    fontFamily: AuthFonts.body,
    fontSize: 11.5,
    color: AuthColors.textMuted,
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
