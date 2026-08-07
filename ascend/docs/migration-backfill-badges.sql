-- ============================================================
-- Backfill — badges déjà mérités avant que checkAndAwardBadges
-- (src/lib/challenge-rewards.ts) n'existe.
-- À exécuter une fois dans Supabase (Dashboard > SQL Editor).
-- Idempotente : ON CONFLICT DO NOTHING, donc peut être relancée
-- sans risque (et sans dupliquer un badge déjà obtenu depuis).
-- ============================================================

insert into user_badges (user_id, badge_id)

select distinct user_id, 'premier-defi'
from daily_challenges
where complete = true

union

select distinct user_id, 'premier-mystere'
from mystery_challenges
where complete = true

union

select id, 'streak-7'
from profiles
where streak_max >= 7

union

select id, 'streak-30'
from profiles
where streak_max >= 30

union

select id, 'streak-90'
from profiles
where streak_max >= 90

union

select id, 'niveau-5'
from profiles
where niveau_global >= 5

union

select id, 'niveau-10'
from profiles
where niveau_global >= 10

on conflict (user_id, badge_id) do nothing;
