// Constantes de gamification isolées ici pour pouvoir rééquilibrer
// sans toucher au code métier (voir docs/bareme.md).
import type { Difficulte } from './types';

export const XP_PAR_DIFFICULTE: Record<Difficulte, number> = {
  facile: 15,
  moyen: 25,
  difficile: 40,
};

export const CRISTAUX_PAR_DEFI = 1;
export const CRISTAUX_DEFI_MYSTERE = 2;
export const MULTIPLICATEUR_XP_MYSTERE = 2;

// XP nécessaire pour passer du niveau N à N+1 : 100 + (N-1) x 40
export function seuilNiveauGlobal(niveau: number): number {
  return 100 + (niveau - 1) * 40;
}

// Même formule, base plus basse : 50 + (N-1) x 20
export function seuilNiveauCompetence(niveau: number): number {
  return 50 + (niveau - 1) * 20;
}

// Paliers de streak/niveau qui débloquent un badge (voir docs/badges.sql
// pour la table de référence : premier-defi, premier-mystere, streak-7,
// streak-30, streak-90, niveau-5, niveau-10).
export const BADGE_STREAK_THRESHOLDS: { seuil: number; badgeId: string }[] = [
  { seuil: 7, badgeId: 'streak-7' },
  { seuil: 30, badgeId: 'streak-30' },
  { seuil: 90, badgeId: 'streak-90' },
];

export const BADGE_NIVEAU_THRESHOLDS: { seuil: number; badgeId: string }[] = [
  { seuil: 5, badgeId: 'niveau-5' },
  { seuil: 10, badgeId: 'niveau-10' },
];

export type ProgressionNiveau = {
  niveau: number;
  xpDansNiveau: number;
  xpProchainNiveau: number;
};

export function calculerProgression(
  xpTotal: number,
  seuil: (niveau: number) => number,
): ProgressionNiveau {
  let niveau = 1;
  let reste = xpTotal;
  let palier = seuil(niveau);
  while (reste >= palier) {
    reste -= palier;
    niveau += 1;
    palier = seuil(niveau);
  }
  return { niveau, xpDansNiveau: reste, xpProchainNiveau: palier };
}
