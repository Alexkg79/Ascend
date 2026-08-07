-- ============================================================
-- Migration — daily_challenges.est_bonus (défis bonus débloqués via
-- la boutique cristaux).
-- À exécuter une fois dans Supabase (Dashboard > SQL Editor).
-- Idempotente : IF NOT EXISTS, peut être relancée sans risque.
-- ============================================================

alter table daily_challenges
  add column if not exists est_bonus boolean not null default false;
