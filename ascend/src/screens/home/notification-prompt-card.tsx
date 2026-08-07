import { Bell } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthColors, AuthFonts } from '@/screens/auth-theme';

type NotificationPromptCardProps = {
  onAccept: () => void;
  onDismiss: () => void;
};

export function NotificationPromptCard({ onAccept, onDismiss }: NotificationPromptCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Bell size={18} color={AuthColors.gold} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>Reste motivé</Text>
        <Text style={styles.description}>On peut te rappeler de faire tes défis chaque jour.</Text>

        <View style={styles.actions}>
          <TouchableOpacity activeOpacity={0.85} onPress={onAccept} style={styles.acceptButton}>
            <Text style={styles.acceptText}>Activer</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>Plus tard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 24,
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: AuthColors.bgSurfaceAlt,
    borderWidth: 1.5,
    borderColor: `${AuthColors.gold}55`,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${AuthColors.gold}22`,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 13.5,
    color: AuthColors.textPrimary,
  },
  description: {
    fontFamily: AuthFonts.body,
    fontSize: 12,
    color: AuthColors.textMuted,
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  acceptButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: AuthColors.gold,
  },
  acceptText: {
    fontFamily: AuthFonts.bodySemiBold,
    fontSize: 12,
    color: AuthColors.bgDeep,
  },
  dismissButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  dismissText: {
    fontFamily: AuthFonts.bodyMedium,
    fontSize: 12,
    color: AuthColors.textMuted,
  },
});
