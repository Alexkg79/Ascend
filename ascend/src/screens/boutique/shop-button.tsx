import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type ShopButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  // 'primary' : bouton pleine largeur, dégradé — actions principales de la boutique.
  // 'compact' : bouton contour, taille de contenu — utilisé en ligne dans une liste.
  variant?: 'primary' | 'compact';
};

export function ShopButton({ title, onPress, loading, disabled, variant = 'primary' }: ShopButtonProps) {
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    if (isDisabled) return;
    scale.value = withTiming(0.94, { duration: 100 });
  }

  function handlePressOut() {
    scale.value = withTiming(1, { duration: 150 });
  }

  if (variant === 'compact') {
    return (
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={isDisabled}>
        <Animated.View
          style={[styles.compactButton, isDisabled && styles.compactButtonDisabled, animatedStyle]}>
          <Text style={styles.compactButtonText}>{title}</Text>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={isDisabled}>
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={[AuthColors.gold, AuthColors.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}>
          {loading ? (
            <ActivityIndicator color={AuthColors.bgDeep} />
          ) : (
            <Text style={styles.primaryButtonText}>{title}</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 14,
    color: AuthColors.bgDeep,
  },
  compactButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: AuthColors.bgSurfaceAlt,
    borderWidth: 1,
    borderColor: AuthColors.violet,
  },
  compactButtonDisabled: {
    opacity: 0.4,
  },
  compactButtonText: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 11.5,
    color: AuthColors.violet,
  },
});
