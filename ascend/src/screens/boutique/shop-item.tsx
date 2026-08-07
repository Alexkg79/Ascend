import { Gem } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type ShopItemProps = {
  title: string;
  description: string;
  cost: number;
  children?: ReactNode;
};

export function ShopItem({ title, description, cost, children }: ShopItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.costChip}>
          <Gem size={12} color={AuthColors.teal} />
          <Text style={styles.costText}>{cost}</Text>
        </View>
      </View>

      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1,
    borderColor: AuthColors.border,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 14.5,
    color: AuthColors.textPrimary,
  },
  description: {
    fontFamily: AuthFonts.body,
    fontSize: 12,
    color: AuthColors.textMuted,
    lineHeight: 17,
  },
  costChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  costText: {
    fontFamily: AuthFonts.mono,
    fontSize: 12,
    color: AuthColors.teal,
  },
  content: {
    marginTop: 14,
  },
});
