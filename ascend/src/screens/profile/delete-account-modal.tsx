import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { ConfirmModal } from '@/components/confirm-modal';
import { AuthColors, AuthFonts } from '@/screens/auth-theme';

const CONFIRM_WORD = 'SUPPRIMER';

type DeleteAccountModalProps = {
  visible: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteAccountModal({ visible, loading, onConfirm, onCancel }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');

  // Repart d'un champ vide à chaque nouvelle ouverture de la modale.
  useEffect(() => {
    if (!visible) setConfirmText('');
  }, [visible]);

  const canConfirm = confirmText.trim().toUpperCase() === CONFIRM_WORD && !loading;

  return (
    <ConfirmModal
      visible={visible}
      title="Supprimer ton compte ?"
      confirmLabel={loading ? 'Suppression…' : 'Supprimer définitivement'}
      destructive
      confirmDisabled={!canConfirm}
      onConfirm={onConfirm}
      onCancel={onCancel}>
      <Text style={styles.description}>
        Cette action est irréversible. Ta progression, tes défis, ton streak et tes badges seront
        définitivement supprimés.
      </Text>
      <Text style={styles.instruction}>
        Tape <Text style={styles.keyword}>{CONFIRM_WORD}</Text> pour confirmer.
      </Text>
      <TextInput
        value={confirmText}
        onChangeText={setConfirmText}
        autoCapitalize="characters"
        autoCorrect={false}
        editable={!loading}
        placeholder={CONFIRM_WORD}
        placeholderTextColor={AuthColors.textMuted}
        style={styles.input}
      />
    </ConfirmModal>
  );
}

const styles = StyleSheet.create({
  description: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  instruction: {
    fontFamily: AuthFonts.body,
    fontSize: 12.5,
    color: AuthColors.textMuted,
    textAlign: 'center',
    marginTop: 10,
  },
  keyword: {
    fontFamily: AuthFonts.bodySemiBold,
    color: AuthColors.danger,
  },
  input: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 10,
    backgroundColor: AuthColors.bgDeep,
    borderWidth: 1.5,
    borderColor: AuthColors.border,
    color: AuthColors.textPrimary,
    fontFamily: AuthFonts.bodyMedium,
    fontSize: 14,
    textAlign: 'center',
  },
});
