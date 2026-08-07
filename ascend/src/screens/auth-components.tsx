import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { AuthColors, AuthFonts } from './auth-theme';

export function AuthLogo() {
  return (
    <View style={styles.logoWrap}>
      <Text style={styles.logoText}>Ascend</Text>
      <Text style={styles.logoTagline}>Deviens la meilleure version de toi</Text>
    </View>
  );
}

type AuthTextInputProps = TextInputProps & {
  label: string;
};

export function AuthTextInput({ label, style, ...rest }: AuthTextInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused, style]}
        placeholderTextColor={AuthColors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />
    </View>
  );
}

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function AuthButton({ title, onPress, loading, disabled }: AuthButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={styles.buttonShadow}>
      <LinearGradient
        colors={[AuthColors.gold, AuthColors.violet]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, isDisabled && styles.buttonDisabled]}>
        {loading ? (
          <ActivityIndicator color={AuthColors.bgDeep} />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function AuthErrorText({ message }: { message: string | null }) {
  if (!message) return null;
  return <Text style={styles.errorText}>{message}</Text>;
}

export function AuthSuccessText({ message }: { message: string }) {
  return <Text style={styles.successText}>{message}</Text>;
}

export function AuthLink({ label, actionLabel, onPress }: { label: string; actionLabel: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.linkWrap}>
      <Text style={styles.linkText}>
        {label} <Text style={styles.linkAction}>{actionLabel}</Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontFamily: AuthFonts.displayBold,
    fontSize: 32,
    color: AuthColors.gold,
  },
  logoTagline: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textMuted,
    textAlign: 'center',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: AuthFonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    color: AuthColors.textMuted,
    textTransform: 'uppercase',
  },
  input: {
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1.5,
    borderColor: AuthColors.border,
    color: AuthColors.textPrimary,
    fontFamily: AuthFonts.body,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: AuthColors.violet,
  },
  buttonShadow: {
    shadowColor: AuthColors.gold,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  button: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 15,
    color: AuthColors.bgDeep,
  },
  errorText: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.danger,
    textAlign: 'center',
  },
  successText: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.teal,
    textAlign: 'center',
    lineHeight: 19,
  },
  linkWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textMuted,
  },
  linkAction: {
    fontFamily: AuthFonts.bodySemiBold,
    color: AuthColors.teal,
  },
});
