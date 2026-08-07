import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileProgress } from '@/hooks/use-profile-progress';
import { calculerProgression, seuilNiveauGlobal } from '@/lib/gamification';
import { getThemeAccentColor } from '@/lib/theme-icons';
import { AuthErrorText } from '@/screens/auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

import { BadgesSection } from './badges-section';
import { ProfileHeader } from './profile-header';
import { ProfileStats } from './profile-stats';
import { SkillRow } from './skill-row';

export function ProfileScreen() {
  const [fontsLoaded] = useAuthFonts();
  const { profile, skills, badges, stats, loading, error } = useProfileProgress();

  if (!fontsLoaded) return null;

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator color={AuthColors.violet} style={styles.loader} />
      </SafeAreaView>
    );
  }

  const progression = calculerProgression(profile?.xp_global ?? 0, seuilNiveauGlobal);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileHeader
          niveau={progression.niveau}
          xpDansNiveau={progression.xpDansNiveau}
          xpProchainNiveau={progression.xpProchainNiveau}
          streak={profile?.streak_actuel ?? 0}
          badgeCount={badges.length}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compétences</Text>

          <View style={styles.skillList}>
            {skills.map((skill, index) => (
              <SkillRow
                key={skill.themeId}
                icon={skill.themeIcon}
                accentColor={getThemeAccentColor(index)}
                label={skill.themeLabel}
                niveau={skill.niveau}
                percentage={
                  skill.xpProchainNiveau > 0 ? (skill.xpDansNiveau / skill.xpProchainNiveau) * 100 : 0
                }
              />
            ))}
          </View>
        </View>

        <ProfileStats
          totalDefisCompletes={stats.totalDefisCompletes}
          meilleurStreak={stats.meilleurStreak}
          joursActifs={stats.joursActifs}
        />

        <BadgesSection badges={badges} />

        <AuthErrorText message={error} />
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
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: AuthFonts.display,
    fontSize: 15,
    fontWeight: '600',
    color: AuthColors.textPrimary,
  },
  skillList: {
    marginTop: 4,
  },
});
