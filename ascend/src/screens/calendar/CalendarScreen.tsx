import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMonthStreaks } from '@/hooks/use-month-streaks';
import { buildCalendarGrid } from '@/lib/calendar-grid';
import { AuthErrorText } from '@/screens/auth-components';
import { AuthColors, AuthFonts, useAuthFonts } from '@/screens/auth-theme';

import { CalendarGrid } from './calendar-grid';
import { CalendarLegend } from './calendar-legend';
import { MonthSelector } from './month-selector';

export function CalendarScreen() {
  const [fontsLoaded] = useAuthFonts();
  const { monthDate, statutByDate, loading, error, goToPreviousMonth, goToNextMonth } = useMonthStreaks();

  if (!fontsLoaded) return null;

  const cells = buildCalendarGrid(monthDate, statutByDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Calendrier</Text>

        <MonthSelector monthDate={monthDate} onPrevious={goToPreviousMonth} onNext={goToNextMonth} />

        {loading ? (
          <ActivityIndicator color={AuthColors.violet} style={styles.loader} />
        ) : (
          <CalendarGrid cells={cells} />
        )}

        <CalendarLegend />

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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontFamily: AuthFonts.display,
    fontSize: 22,
    fontWeight: '600',
    color: AuthColors.textPrimary,
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
});
