import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>Valider ce défi ?</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {titre}
          </Text>
          <Text style={styles.xp}>+{xp} XP</Text>

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Valider</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,8,18,0.7)',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 22,
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1,
    borderColor: AuthColors.border,
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: AuthFonts.display,
    fontSize: 17,
    fontWeight: '600',
    color: AuthColors.textPrimary,
  },
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
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  cancelText: {
    fontFamily: AuthFonts.bodyMedium,
    fontSize: 13.5,
    color: AuthColors.textMuted,
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AuthColors.gold,
  },
  confirmText: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 13.5,
    color: AuthColors.bgDeep,
  },
});
