import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { AuthColors } from '@/screens/auth-theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type LevelRingProps = {
  size?: number;
  strokeWidth?: number;
  percentage: number;
  // Optionnel : si fourni, un pulse/glow se déclenche sur l'anneau quand ce
  // niveau augmente par rapport au rendu précédent (palier franchi).
  niveau?: number;
  children?: ReactNode;
};

export function LevelRing({ size = 64, strokeWidth = 6, percentage, niveau, children }: LevelRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));

  const animatedPercentage = useSharedValue(clamped);
  const glowOpacity = useSharedValue(0);
  const previousNiveau = useRef(niveau);
  const isFirstRender = useRef(true);

  useEffect(() => {
    animatedPercentage.value = withTiming(clamped, { duration: 700, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousNiveau.current = niveau;
      return;
    }

    if (niveau !== undefined && previousNiveau.current !== undefined && niveau > previousNiveau.current) {
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 650, easing: Easing.in(Easing.quad) }),
      );
    }
    previousNiveau.current = niveau;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [niveau]);

  const gradientId = `level-ring-gradient-${size}`;

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (animatedPercentage.value / 100) * circumference,
  }));

  const glowAnimatedProps = useAnimatedProps(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={AuthColors.gold} />
            <Stop offset="100%" stopColor={AuthColors.violet} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
          animatedProps={animatedCircleProps}
        />
        {/* Pulse/glow au passage de palier : trace l'anneau en entier, plus large et plus clair. */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={AuthColors.gold}
          strokeWidth={strokeWidth + 5}
          strokeLinecap="round"
          animatedProps={glowAnimatedProps}
        />
      </Svg>
      {children ? <View style={[StyleSheet.absoluteFill, styles.center]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
