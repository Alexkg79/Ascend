import { Tabs, TabList, TabSlot, TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { Calendar, Home, User, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

const TAB_ITEMS: { name: string; href: '/' | '/calendrier' | '/profil'; label: string; icon: LucideIcon }[] = [
  { name: 'index', href: '/', label: 'Accueil', icon: Home },
  { name: 'calendrier', href: '/calendrier', label: 'Calendrier', icon: Calendar },
  { name: 'profil', href: '/profil', label: 'Profil', icon: User },
];

export default function AppTabs() {
  // Le label utilise une police custom (mono) chargée async : le rendre avant
  // qu'elle soit prête le mesure avec la police système de repli, plus large,
  // et ce composant n'a ensuite aucune raison de se re-render une fois la
  // police prête — d'où un texte qui reste tronqué en continu.
  const [fontsLoaded] = useAuthFonts();

  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <BottomNav>
          {TAB_ITEMS.map((item) => (
            <TabTrigger key={item.name} name={item.name} href={item.href} asChild>
              <TabButton label={item.label} icon={item.icon} showLabel={fontsLoaded} />
            </TabTrigger>
          ))}
        </BottomNav>
      </TabList>
    </Tabs>
  );
}

function BottomNav({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 16) }]}>{children}</View>;
}

type TabButtonProps = TabTriggerSlotProps & { label: string; icon: LucideIcon; showLabel: boolean };

function TabButton({ label, icon: Icon, isFocused, showLabel, ...props }: TabButtonProps) {
  const color = isFocused ? AuthColors.gold : AuthColors.textMuted;
  return (
    <Pressable {...props} style={styles.item}>
      <Icon size={19} color={color} />
      {showLabel && (
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: AuthColors.border,
    backgroundColor: AuthColors.bgDeep,
  },
  item: {
    alignItems: 'center',
    gap: 4,
    minWidth: 68,
    flexShrink: 0,
    paddingHorizontal: 4,
  },
  label: {
    fontFamily: AuthFonts.mono,
    fontSize: 8.5,
    flexShrink: 0,
  },
});
