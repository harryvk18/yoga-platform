-- 002_admin_read.sql
-- Secure, owner-only read access to the waitlist for the /admin page.
--
-- Security model:
--   * The browser still holds only the public anon key. That key CANNOT read
--     sign-ups — migration 001 grants it INSERT only and RLS denies SELECT.
--   * Reading the list requires a real Supabase Auth login AND membership in
--     public.admins. The gate is enforced in Postgres (RLS), so a stranger who
--     discovers /admin and the anon key still sees zero rows.
--   * public.admins is writable only via the service role / dashboard, so no
--     one can add themselves as an admin from the browser.

-- ---------------------------------------------------------------------------
-- Admin allow-list
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id  uuid        primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

comment on table public.admins is
  'Auth users allowed to read waitlist sign-ups. Managed via dashboard only.';

alter table public.admins enable row level security;
-- No policies + no grants: only the service role / SQL editor can touch it.
revoke all on table public.admins from anon, authenticated;

-- ---------------------------------------------------------------------------
-- is_admin(): true when the current logged-in user is on the allow-list.
-- SECURITY DEFINER so it can read public.admins despite that table's locked
-- RLS. Returns false for anon (auth.uid() is null).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'True when the current authenticated user is an allow-listed admin.';

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Grant SELECT on waitlist to logged-in users, then restrict the rows via RLS
-- to admins only. Non-admin logged-in users (and anon) get zero rows.
-- ---------------------------------------------------------------------------
grant select on table public.waitlist to authenticated;

drop policy if exists waitlist_admin_select on public.waitlist;
create policy waitlist_admin_select
  on public.waitlist
  for select
  to authenticated
  using ( public.is_admin() );
