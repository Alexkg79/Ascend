import { FunctionsHttpError } from '@supabase/supabase-js';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '@/components/confirm-modal';
import { useProfileProgress } from '@/hooks/use-profile-progress';
import { calculerProgression, seuilNiveauGlobal } from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import { getThemeAccentColor } from '@/lib/theme-icons';
import { AuthErrorText } from '@/screens/auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

import { BadgesSection } from './badges-section';
import { DeleteAccountModal } from './delete-account-modal';
import { ProfileHeader } from './profile-header';
import { ProfileStats } from './profile-stats';
import { SkillRow } from './skill-row';

async function extractErrorMessage(err: unknown): Promise<string> {
  if (err instanceof FunctionsHttpError) {
    try {
      const body = await err.context.json();
      if (typeof body?.error === 'string') return body.error;
    } catch {
      // Corps de réponse non-JSON ou déjà consommé : on garde le message générique.
    }
  }
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return 'Une erreur est survenue.';
}

export function ProfileScreen() {
  const [fontsLoaded] = useAuthFonts();
  const { profile, skills, badges, stats, loading, error } = useProfileProgress();
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!fontsLoaded) return null;

  async function handleConfirmSignOut() {
    setSignOutModalVisible(false);
    setSignOutError(null);
    // Pas de navigation manuelle : onAuthStateChange met session à null, ce
    // qui fait basculer le guard dans _layout.tsx vers (auth) tout seul.
    const { error: signOutErr } = await supabase.auth.signOut();
    if (signOutErr) {
      setSignOutError(signOutErr.message);
    }
  }

  async function handleConfirmDelete() {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const { error: invokeError } = await supabase.functions.invoke('delete-account');
      if (invokeError) throw invokeError;

      setDeleteModalVisible(false);
      // Même logique que la déconnexion : pas de navigation manuelle, le
      // guard dans _layout.tsx redirige vers (auth) dès que session est null.
      await supabase.auth.signOut();
    } catch (err) {
      setDeleteError(await extractErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  }

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

        <View style={styles.signOutSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSignOutModalVisible(true)}
            style={styles.signOutButton}>
            <Text style={styles.signOutText}>Se déconnecter</Text>
          </TouchableOpacity>
          <AuthErrorText message={signOutError} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDeleteModalVisible(true)}
            style={styles.deleteButton}>
            <Text style={styles.deleteText}>Supprimer mon compte</Text>
          </TouchableOpacity>
          <AuthErrorText message={deleteError} />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={signOutModalVisible}
        title="Se déconnecter ?"
        confirmLabel="Se déconnecter"
        destructive
        onConfirm={handleConfirmSignOut}
        onCancel={() => setSignOutModalVisible(false)}>
        <Text style={styles.signOutModalText}>Tu devras te reconnecter pour retrouver ton compte.</Text>
      </ConfirmModal>

      <DeleteAccountModal
        visible={deleteModalVisible}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
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
  signOutSection: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: AuthColors.border,
    alignItems: 'center',
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signOutText: {
    fontFamily: AuthFonts.bodyMedium,
    fontSize: 12.5,
    color: AuthColors.textMuted,
  },
  signOutModalText: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    color: AuthColors.textMuted,
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteText: {
    fontFamily: AuthFonts.bodyMedium,
    fontSize: 12.5,
    color: AuthColors.danger,
  },
});
