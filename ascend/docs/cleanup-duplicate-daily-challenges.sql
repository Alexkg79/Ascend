-- ============================================================
-- Nettoyage — supprime les défis du jour en doublon générés par la
-- course entre appels concurrents de ensureDailyChallenges (corrigée
-- dans src/hooks/use-daily-challenges.tsx).
-- À exécuter une fois dans Supabase (Dashboard > SQL Editor).
--
-- Sûr par construction :
-- - ne considère que les défis NON bonus (est_bonus = false) — un
--   défi bonus débloqué via la boutique n'est jamais compté ni supprimé ;
-- - garde toujours les défis déjà complétés en priorité (complete
--   desc dans le tri) — aucune progression déjà enregistrée n'est perdue ;
-- - ne garde que 3 défis non-bonus par utilisateur et par jour, tous
--   utilisateurs et toutes dates confondus (pas besoin de connaître
--   l'identifiant du compte de test ni la date concernée).
-- ============================================================

with classement as (
  select
    id,
    row_number() over (
      partition by user_id, date
      order by complete desc, id asc
    ) as rang
  from daily_challenges
  where est_bonus = false
)
delete from daily_challenges
where id in (select id from classement where rang > 3);
