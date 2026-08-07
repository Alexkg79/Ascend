import { StyleSheet, Text, View } from 'react-native';

import type { CalendarCell as CalendarCellType, CalendarCellStatus } from '@/lib/calendar-grid';
import { AuthColors, AuthFonts } from '@/screens/auth-theme';

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const STATUS_STYLES: Record<CalendarCellStatus, { background: string; border: string; text: string }> = {
  reussi: { background: `${AuthColors.gold}33`, border: AuthColors.gold, text: AuthColors.gold },
  manque: { background: 'transparent', border: AuthColors.border, text: AuthColors.textMuted },
  recupere: { background: `${AuthColors.violet}33`, border: AuthColors.violet, text: AuthColors.violet },
  futur: { background: 'transparent', border: 'transparent', text: AuthColors.textMuted },
  vide: { background: 'transparent', border: 'transparent', text: 'transparent' },
};

type CalendarGridProps = {
  cells: CalendarCellType[];
};

export function CalendarGrid({ cells }: CalendarGridProps) {
  const weeks: CalendarCellType[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <View>
      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((label, index) => (
          <Text key={`${label}-${index}`} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((cell) => (
            <DayCell key={cell.dateString} cell={cell} />
          ))}
        </View>
      ))}
    </View>
  );
}

function DayCell({ cell }: { cell: CalendarCellType }) {
  const palette = STATUS_STYLES[cell.status];

  // Le fond reflète toujours le statut ; "aujourd'hui" ne fait qu'ajouter un
  // anneau par-dessus, il ne doit jamais remplacer le fond du statut.
  const boxStyle = {
    backgroundColor: palette.background,
    borderColor: cell.isToday ? AuthColors.teal : palette.border,
    borderWidth: cell.isToday ? 2 : 1.5,
  };

  return (
    <View style={styles.cell}>
      {cell.status !== 'vide' && (
        <View style={[styles.dayBox, boxStyle]}>
          <Text style={[styles.dayNumber, { color: palette.text }]}>{cell.dayNumber}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: AuthFonts.mono,
    fontSize: 10,
    color: AuthColors.textMuted,
    paddingBottom: 8,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  dayBox: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontFamily: AuthFonts.mono,
    fontSize: 11.5,
  },
});
