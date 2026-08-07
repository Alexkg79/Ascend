import { formatDateString } from '@/lib/daily-challenges';
import type { StatutStreak } from '@/lib/types';

export type CalendarCellStatus = StatutStreak | 'futur' | 'vide';

export type CalendarCell = {
  date: Date;
  dateString: string;
  dayNumber: number;
  status: CalendarCellStatus;
  isToday: boolean;
};

// Lundi = 0 ... Dimanche = 6 (semaine commençant le lundi).
function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

// Construit une grille complète de semaines (multiple de 7 cases) pour le mois
// donné, avec les jours des mois voisins en cases vides pour combler la grille.
export function buildCalendarGrid(
  monthDate: Date,
  statutByDate: Record<string, StatutStreak>,
): CalendarCell[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const leadingEmpty = mondayIndex(firstOfMonth.getDay());
  const gridStart = new Date(year, month, 1 - leadingEmpty);
  const totalCells = Math.ceil((leadingEmpty + lastOfMonth.getDate()) / 7) * 7;

  const todayString = formatDateString(new Date());

  const cells: CalendarCell[] = [];
  for (let i = 0; i < totalCells; i += 1) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    const dateString = formatDateString(date);
    const isCurrentMonth = date.getMonth() === month;
    const isToday = dateString === todayString;

    let status: CalendarCellStatus;
    if (!isCurrentMonth) {
      status = 'vide';
    } else if (dateString > todayString) {
      status = 'futur';
    } else {
      status = statutByDate[dateString] ?? 'manque';
    }

    cells.push({ date, dateString, dayNumber: date.getDate(), status, isToday });
  }

  return cells;
}
