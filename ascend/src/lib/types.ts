export type Difficulte = 'facile' | 'moyen' | 'difficile';

// 'recupere' n'est pas encore attribuable (dépend de la boutique cristaux,
// pas encore développée) mais le type le prévoit déjà.
export type StatutStreak = 'reussi' | 'manque' | 'recupere';

export type Theme = {
  id: string;
  label: string;
  icon: string | null;
};

export type UserThemePref = {
  theme_id: string;
  difficulte: Difficulte;
};

export type Challenge = {
  id: string;
  theme_id: string;
  difficulte: Difficulte;
  xp: number;
  objectif: string | null;
  titre: string;
};

export type Profile = {
  id: string;
  xp_global: number;
  cristaux: number;
  streak_actuel: number;
  streak_max: number;
};

export type DailyChallenge = {
  id: string;
  complete: boolean;
  completed_at: string | null;
  challenge_id: string;
  est_bonus: boolean;
  challenges: Challenge;
};

export type MysteryChallenge = {
  id: string;
  ouvert: boolean;
  complete: boolean;
  challenge_id: string;
  challenges: Challenge;
};
