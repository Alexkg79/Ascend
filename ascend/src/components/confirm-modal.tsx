import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
  // Colore le bouton de confirmation en rouge plutôt qu'en or — pour une
  // action qui ne peut pas être annulée légèrement (ex: déconnexion).
  destructive?: boolean;
  // Désactive le bouton de confirmation (ex: tant que l'utilisateur n'a pas
  // tapé le mot de confirmation exact pour la suppression de compte).
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

export function ConfirmModal({
  visible,
  title,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  destructive,
  confirmDisabled,
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          {children}

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={confirmDisabled}
              style={[
                styles.confirmButton,
                destructive && styles.confirmButtonDestructive,
                confirmDisabled && styles.confirmButtonDisabled,
              ]}>
              <Text style={[styles.confirmText, destructive && styles.confirmTextDestructive]}>
                {confirmLabel}
              </Text>
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
    textAlign: 'center',
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
  confirmButtonDestructive: {
    backgroundColor: AuthColors.danger,
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 13.5,
    color: AuthColors.bgDeep,
  },
  confirmTextDestructive: {
    color: AuthColors.textPrimary,
  },
});
