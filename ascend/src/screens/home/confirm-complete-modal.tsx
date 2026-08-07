import { StyleSheet, Text } from 'react-native';

import { ConfirmModal } from '@/components/confirm-modal';
import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type ConfirmCompleteModalProps = {
  visible: boolean;
  titre: string;
  xp: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmCompleteModal({ visible, titre, xp, onConfirm, onCancel }: ConfirmCompleteModalProps) {
  return (
    <ConfirmModal
      visible={visible}
      title="Valider ce défi ?"
      confirmLabel="Valider"
      onConfirm={onConfirm}
      onCancel={onCancel}>
      <Text style={styles.subtitle} numberOfLines={2}>
        {titre}
      </Text>
      <Text style={styles.xp}>+{xp} XP</Text>
    </ConfirmModal>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textMuted,
    textAlign: 'center',
  },
  xp: {
    fontFamily: AuthFonts.mono,
    fontSize: 12,
    color: AuthColors.gold,
    marginTop: 2,
  },
});
