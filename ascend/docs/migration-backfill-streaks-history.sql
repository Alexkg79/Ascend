-- ============================================================
-- Backfill — streaks_history pour les défis déjà validés avant
-- que la logique d'écriture automatique n'existe.
-- À exécuter une fois dans Supabase (Dashboard > SQL Editor).
-- Idempotente : les lignes déjà présentes ne sont pas touchées
-- (ON CONFLICT DO NOTHING), donc peut être relancée sans risque.
-- ============================================================

insert into streaks_history (user_id, date, statut)
select user_id, date, 'reussi'
from (
  select user_id, date from daily_challenges where complete = true
  union
  select user_id, date from mystery_challenges where complete = true
) as jours_reussis
on conflict (user_id, date) do nothing;
