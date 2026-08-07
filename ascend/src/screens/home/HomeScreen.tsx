import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDailyChallenges } from '@/hooks/use-daily-challenges';
import { calculerProgression, seuilNiveauGlobal } from '@/lib/gamification';
import { getThemeAccentColor, getThemeIcon } from '@/lib/theme-icons';
import { AuthErrorText } from '@/screens/auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

import { ChallengeCard } from './challenge-card';
import { HomeHeader } from './home-header';
import { MysteryCard } from './mystery-card';

export function HomeScreen() {
  const [fontsLoaded] = useAuthFonts();
  const {
    profile,
    themes,
    dailyChallenges,
    mysteryChallenge,
    loading,
    error,
    completeChallenge,
    openMystery,
    completeMystery,
  } = useDailyChallenges();

  if (!fontsLoaded) return null;

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator color={AuthColors.violet} style={styles.loader} />
      </SafeAreaView>
    );
  }

  const progression = calculerProgression(profile?.xp_global ?? 0, seuilNiveauGlobal);
  const themeIndexById = new Map(themes.map((theme, index) => [theme.id, index]));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HomeHeader
          niveau={progression.niveau}
          xpDansNiveau={progression.xpDansNiveau}
          xpProchainNiveau={progression.xpProchainNiveau}
          streak={profile?.streak_actuel ?? 0}
          cristaux={profile?.cristaux ?? 0}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tes défis du jour</Text>

          <View style={styles.list}>
            {dailyChallenges.map((daily) => {
              const theme = themes.find((t) => t.id === daily.challenges.theme_id);
              const index = themeIndexById.get(daily.challenges.theme_id) ?? 0;

              return (
                <ChallengeCard
                  key={daily.id}
                  icon={getThemeIcon(theme?.icon ?? null)}
                  accentColor={getThemeAccentColor(index)}
                  titre={daily.challenges.titre}
                  xp={daily.challenges.xp}
                  done={daily.complete}
                  onPress={() => completeChallenge(daily.id)}
                />
              );
            })}

            {mysteryChallenge && (
              <MysteryCard
                ouvert={mysteryChallenge.ouvert}
                complete={mysteryChallenge.complete}
                titre={mysteryChallenge.challenges.titre}
                xp={mysteryChallenge.challenges.xp * 2}
                onOpen={openMystery}
                onComplete={completeMystery}
              />
            )}
          </View>

          <AuthErrorText message={error} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AuthColors.bgDeep,
  },
  loader: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontFamily: AuthFonts.display,
    fontSize: 17,
    fontWeight: '600',
    color: AuthColors.textPrimary,
  },
  list: {
    gap: 10,
    marginTop: 16,
  },
});
