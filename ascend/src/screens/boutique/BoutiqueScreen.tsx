import { useRouter } from 'expo-router';
import { Gem, X } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBoutique } from '@/hooks/use-boutique';
import { COUT_CHANGER_DEFI, COUT_DEFI_BONUS, COUT_RECUPERER_STREAK } from '@/lib/gamification';
import { AuthErrorText } from '@/screens/auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

import { ShopButton } from './shop-button';
import { ShopItem } from './shop-item';

export function BoutiqueScreen() {
  const [fontsLoaded] = useAuthFonts();
  const router = useRouter();
  const {
    cristaux,
    dailyChallenges,
    canRecoverStreak,
    loading,
    actionPending,
    error,
    handleSwap,
    handleUnlockBonus,
    handleRecoverStreak,
  } = useBoutique();

  if (!fontsLoaded) return null;

  const incompleteChallenges = dailyChallenges.filter((daily) => !daily.complete);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} style={styles.closeButton}>
          <X size={18} color={AuthColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.balance}>
          <Gem size={18} color={AuthColors.teal} />
          <Text style={styles.balanceValue}>{cristaux}</Text>
        </View>
        <View style={styles.closeButton} />
      </View>

      {loading ? (
        <ActivityIndicator color={AuthColors.violet} style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ShopItem
            title="Changer un défi"
            description="Remplace un défi du jour non complété par un autre du même thème et de la même difficulté."
            cost={COUT_CHANGER_DEFI}>
            {incompleteChallenges.length === 0 ? (
              <Text style={styles.emptyText}>Aucun défi à changer pour l&apos;instant.</Text>
            ) : (
              <View style={styles.challengeList}>
                {incompleteChallenges.map((daily) => (
                  <View key={daily.id} style={styles.challengeRow}>
                    <Text style={styles.challengeTitle} numberOfLines={1}>
                      {daily.challenges.titre}
                    </Text>
                    <ShopButton
                      variant="compact"
                      title="Échanger"
                      onPress={() => handleSwap(daily.id)}
                      disabled={actionPending || cristaux < COUT_CHANGER_DEFI}
                    />
                  </View>
                ))}
              </View>
            )}
          </ShopItem>

          <ShopItem
            title="Débloquer un défi bonus"
            description="Ajoute un 4e défi aléatoire à ta liste du jour."
            cost={COUT_DEFI_BONUS}>
            <ShopButton
              title="Débloquer"
              onPress={handleUnlockBonus}
              loading={actionPending}
              disabled={cristaux < COUT_DEFI_BONUS}
            />
          </ShopItem>

          {canRecoverStreak && (
            <ShopItem
              title="Récupérer un streak manqué"
              description="Marque la journée d'hier comme réussie pour ne pas perdre ton streak."
              cost={COUT_RECUPERER_STREAK}>
              <ShopButton
                title="Récupérer"
                onPress={handleRecoverStreak}
                loading={actionPending}
                disabled={cristaux < COUT_RECUPERER_STREAK}
              />
            </ShopItem>
          )}

          <AuthErrorText message={error} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AuthColors.bgDeep,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: AuthColors.bgSurface,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  balanceValue: {
    fontFamily: AuthFonts.displayBold,
    fontSize: 16,
    color: AuthColors.textPrimary,
  },
  loader: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 14,
  },
  emptyText: {
    fontFamily: AuthFonts.body,
    fontSize: 12.5,
    color: AuthColors.textMuted,
  },
  challengeList: {
    gap: 8,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  challengeTitle: {
    flex: 1,
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textPrimary,
  },
});
