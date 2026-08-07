-- ============================================================
-- Migration — user_theme_prefs (une difficulté par thème choisi)
-- À exécuter dans Supabase (Dashboard > SQL Editor).
-- Idempotente : peut être relancée sans erreur si déjà appliquée.
-- ============================================================

-- 1. Nouvelle table : une ligne par thème choisi, avec sa propre difficulté
create table if not exists user_theme_prefs (
  user_id uuid references profiles(id) on delete cascade,
  theme_id text references themes(id) not null,
  difficulte text not null
    check (difficulte in ('facile','moyen','difficile')),
  primary key (user_id, theme_id)
);

alter table user_theme_prefs enable row level security;

drop policy if exists "Utilisateur gère ses préférences de thème" on user_theme_prefs;
create policy "Utilisateur gère ses préférences de thème" on user_theme_prefs
  for all using (auth.uid() = user_id);

-- 2. Reprise des données existantes de user_challenge_prefs vers user_theme_prefs
--    (un thème choisi + la difficulté globale de l'ancien schéma, comme point de départ)
insert into user_theme_prefs (user_id, theme_id, difficulte)
select user_id, unnest(themes_choisis), difficulte
from user_challenge_prefs
on conflict (user_id, theme_id) do nothing;

-- 3. Suppression des colonnes obsolètes sur user_challenge_prefs
alter table user_challenge_prefs drop column if exists themes_choisis;
alter table user_challenge_prefs drop column if exists difficulte;
