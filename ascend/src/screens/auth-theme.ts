import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';

// Tokens mirrored from docs/design.jsx — dark, non-adaptive palette for the auth flow.
export const AuthColors = {
  bgDeep: '#161320',
  bgSurface: '#201C2E',
  bgSurfaceAlt: '#2A2440',
  gold: '#E7B24C',
  violet: '#9A8CFF',
  teal: '#59D6C4',
  textPrimary: '#F6F3FB',
  textMuted: '#9C93B5',
  border: 'rgba(255,255,255,0.08)',
  danger: '#F16565',
} as const;

export const AuthFonts = {
  display: 'SpaceGrotesk_600SemiBold',
  displayBold: 'SpaceGrotesk_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_500Medium',
} as const;

export function useAuthFonts() {
  return useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_500Medium,
  });
}
