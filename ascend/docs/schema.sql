-- ============================================================
-- ASCEND — Schéma de base de données V1 (Supabase / Postgres)
-- ============================================================

-- Thèmes disponibles (référentiel, peu susceptible de changer)
create table themes (
  id text primary key,          -- ex: 'sport', 'confiance'
  label text not null,          -- ex: 'Sport'
  icon text                     -- nom d'icône (lucide) pour le front
);

insert into themes (id, label, icon) values
  ('sport', 'Sport', 'dumbbell'),
  ('confiance', 'Confiance', 'sparkles'),
  ('sommeil', 'Sommeil', 'moon'),
  ('finances', 'Finances', 'wallet'),
  ('apprentissage', 'Apprentissage', 'book-open');

-- Profil utilisateur (étend auth.users fourni par Supabase)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text,
  niveau_global int not null default 1,
  xp_global int not null default 0,
  cristaux int not null default 0,
  streak_actuel int not null default 0,
  streak_max int not null default 0,
  is_premium boolean not null default false,   -- champ d'extensibilité (Premium futur)
  created_at timestamptz not null default now()
);

-- Préférences de challenge choisies à l'onboarding
create table user_challenge_prefs (
  user_id uuid primary key references profiles(id) on delete cascade,
  duree_jours int not null default 30,               -- 7 / 30 / 60 / 90 / perso
  temps_disponible_min int not null default 15,
  updated_at timestamptz not null default now()
);

-- Thèmes choisis à l'onboarding, avec une difficulté par thème
create table user_theme_prefs (
  user_id uuid references profiles(id) on delete cascade,
  theme_id text references themes(id) not null,
  difficulte text not null                            -- 'facile' | 'moyen' | 'difficile'
    check (difficulte in ('facile','moyen','difficile')),
  primary key (user_id, theme_id)
);

-- Compétence par thème et par utilisateur
create table user_skills (
  user_id uuid references profiles(id) on delete cascade,
  theme_id text references themes(id),
  niveau int not null default 1,
  xp int not null default 0,
  primary key (user_id, theme_id)
);

-- Bibliothèque de défis (contenu, alimentée par Ascend_Defis_V1.csv)
create table challenges (
  id text primary key,               -- ex: 'sport-01'
  theme_id text references themes(id) not null,
  difficulte text not null check (difficulte in ('facile','moyen','difficile')),
  xp int not null,
  objectif text,                     -- champ d'extensibilité (personnalisation future), nullable
  titre text not null
);

-- Défis assignés à un utilisateur pour un jour donné
create table daily_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  challenge_id text references challenges(id),
  date date not null default current_date,
  complete boolean not null default false,
  completed_at timestamptz,
  est_bonus boolean not null default false,   -- débloqué via la boutique cristaux
  unique (user_id, challenge_id, date)
);

-- Défi mystère du jour
create table mystery_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  challenge_id text references challenges(id),
  date date not null default current_date,
  ouvert boolean not null default false,
  complete boolean not null default false,
  unique (user_id, date)
);

-- Badges (référentiel)
create table badges (
  id text primary key,          -- ex: 'streak-7'
  label text not null,
  description text,
  icon text
);

-- Badges obtenus par utilisateur
create table user_badges (
  user_id uuid references profiles(id) on delete cascade,
  badge_id text references badges(id),
  obtained_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- Historique pour le calendrier de progression
create table streaks_history (
  user_id uuid references profiles(id) on delete cascade,
  date date not null,
  statut text not null check (statut in ('reussi','manque','recupere')),
  primary key (user_id, date)
);

-- ============================================================
-- Row Level Security — chaque utilisateur ne voit que ses données
-- ============================================================
alter table profiles enable row level security;
alter table user_challenge_prefs enable row level security;
alter table user_theme_prefs enable row level security;
alter table user_skills enable row level security;
alter table daily_challenges enable row level security;
alter table mystery_challenges enable row level security;
alter table user_badges enable row level security;
alter table streaks_history enable row level security;

create policy "Utilisateur voit son propre profil" on profiles
  for select using (auth.uid() = id);
create policy "Utilisateur modifie son propre profil" on profiles
  for update using (auth.uid() = id);

create policy "Utilisateur gère ses préférences" on user_challenge_prefs
  for all using (auth.uid() = user_id);

create policy "Utilisateur gère ses préférences de thème" on user_theme_prefs
  for all using (auth.uid() = user_id);

create policy "Utilisateur gère ses compétences" on user_skills
  for all using (auth.uid() = user_id);

create policy "Utilisateur gère ses défis quotidiens" on daily_challenges
  for all using (auth.uid() = user_id);

create policy "Utilisateur gère ses défis mystère" on mystery_challenges
  for all using (auth.uid() = user_id);

create policy "Utilisateur gère ses badges" on user_badges
  for all using (auth.uid() = user_id);

create policy "Utilisateur gère son historique" on streaks_history
  for all using (auth.uid() = user_id);

-- challenges, themes, badges restent en lecture libre (contenu public de l'app)
alter table challenges enable row level security;
alter table themes enable row level security;
alter table badges enable row level security;

create policy "Lecture publique des défis" on challenges for select using (true);
create policy "Lecture publique des thèmes" on themes for select using (true);
create policy "Lecture publique des badges" on badges for select using (true);

-- ============================================================
-- Création automatique du profil à l'inscription
-- ============================================================
-- SECURITY DEFINER : le trigger crée la ligne profiles indépendamment
-- de la RLS et de la confirmation e-mail (auth.uid() n'est pas encore
-- disponible côté client tant que l'utilisateur n'a pas confirmé son
-- adresse). Le client n'a donc pas besoin — et n'a pas le droit —
-- d'insérer directement dans profiles.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
