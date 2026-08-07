import { BookOpen, Dumbbell, Moon, Sparkles, Wallet, type LucideIcon } from 'lucide-react-native';

import { AuthColors } from '@/screens/auth-theme';

// Maps the `themes.icon` column (lucide icon names, see docs/schema.sql) to components.
const ICONS: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  moon: Moon,
  wallet: Wallet,
  'book-open': BookOpen,
};

const ACCENT_COLORS = [AuthColors.gold, AuthColors.violet, AuthColors.teal];

export function getThemeIcon(icon: string | null): LucideIcon {
  return (icon && ICONS[icon]) || Sparkles;
}

export function getThemeAccentColor(index: number): string {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}
