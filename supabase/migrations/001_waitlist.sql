-- 001_waitlist.sql
-- Waitlist sign-ups for the yoga platform landing page.
--
-- Security model:
--   * The browser holds only the anon key.
--   * Row-Level Security restricts anon to INSERT only — it can add a
--     sign-up but can never read the list back (no SELECT policy exists).
--   * Honest social-proof counts are exposed through a SECURITY DEFINER
--     function (waitlist_counts) that returns aggregates only, never rows.

-- gen_random_uuid() lives in pgcrypto (built into Postgres 13+; Supabase
-- enables it by default — this guard makes the migration self-contained).
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null check (length(btrim(name)) >= 2),
  phone      text        not null check (phone ~ '^\+33[1-9]\d{8}$'),
  email      text        not null check (position('@' in email) > 1),
  city       text,
  consent    boolean     not null default false,
  -- App sends 'fr' / 'en'; keep it short and validated rather than free-form.
  locale     text        not null default 'fr' check (locale in ('fr', 'en')),
  created_at timestamptz not null default now()
);

comment on table public.waitlist is
  'Landing-page waitlist sign-ups. Insert-only for the anon role via RLS.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
-- One sign-up per email, case-insensitively. The client lowercases email
-- before insert and relies on the resulting 23505 unique violation to treat
-- a repeat sign-up as an idempotent success.
create unique index if not exists waitlist_email_lower_key
  on public.waitlist (lower(email));

-- waitlist_counts() groups by city; this keeps the aggregate cheap as the
-- list grows.
create index if not exists waitlist_city_idx
  on public.waitlist (city);

-- Most-recent-first scans (admin exports, dashboards).
create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
alter table public.waitlist enable row level security;

-- Least-privilege table grants: anon/authenticated may INSERT, nothing else.
-- (RLS is the real gate, but explicit grants make intent unambiguous and
-- keep the migration correct on plain Postgres too.)
revoke all on table public.waitlist from anon, authenticated;
grant insert on table public.waitlist to anon, authenticated;

-- Allow inserts only — and only when consent was actually given (RGPD).
-- No SELECT / UPDATE / DELETE policy exists, so RLS denies every read or
-- mutation for these roles.
drop policy if exists waitlist_anon_insert on public.waitlist;
create policy waitlist_anon_insert
  on public.waitlist
  for insert
  to anon, authenticated
  with check (consent is true);

-- ---------------------------------------------------------------------------
-- Aggregate counts (read path for the social-proof counter)
-- ---------------------------------------------------------------------------
-- Runs as owner (SECURITY DEFINER) so it can read the table despite the
-- insert-only RLS, but returns only per-city counts — no personal data.
create or replace function public.waitlist_counts()
  returns table (city text, count bigint)
  language sql
  stable
  security definer
  set search_path = public
as $$
  select w.city, count(*) as count
  from public.waitlist w
  group by w.city;
$$;

comment on function public.waitlist_counts() is
  'Aggregate waitlist sign-up counts per city. Exposes no personal data.';

-- Lock the function down to the intended callers.
revoke all on function public.waitlist_counts() from public;
grant execute on function public.waitlist_counts() to anon, authenticated;
