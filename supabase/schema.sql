-- supabase/schema.sql
-- Run this once in the Supabase SQL editor if you want real accounts
-- instead of demo mode. Without it, the app works fine in demo mode.

create type user_role as enum ('admin', 'tecnico', 'paciente');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'paciente',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile (default role: paciente) whenever
-- someone signs up through Supabase Auth.
--
-- `set search_path = public` closes a known SECURITY DEFINER injection
-- risk: without a fixed search_path, a caller could create objects in a
-- schema that resolves earlier in their own search_path and trick this
-- function into operating on attacker-controlled objects instead of the
-- real public.profiles table.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role) values (new.id, 'paciente');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- This function only makes sense as a trigger (it relies on the special
-- `new` record, which only exists inside trigger execution) — calling it
-- directly via the API would just error out, but Postgres still grants
-- EXECUTE to every role by default. Revoke that explicitly: there's no
-- legitimate reason for anon/authenticated to call it directly.
revoke execute on function public.handle_new_user() from anon, authenticated;

-- To promote someone to tecnico or admin, run manually:
-- update public.profiles set role = 'tecnico' where id = '<user-uuid>';


-- ============================================================
-- Community knowledge submissions
-- ============================================================
-- The "Registar Saber" page lets técnicos document an elder's medicinal
-- knowledge. This table is where that *actually persists* — without it,
-- a submission only ever reached an email inbox and never appeared
-- anywhere in the app again.
--
-- Deliberately NOT a duplicate of the curated `PLANTS`/`TREATMENTS`
-- catalogue in src/constants/index.js — that data is static, well-known,
-- and fine to ship hardcoded for speed. This table is only for the part
-- that's genuinely growable: new contributions from the field.
--
-- `status` gates public visibility. Nothing reaches the public Treatments
-- page until an admin approves it — necessary for a health app where
-- anyone with a técnico/admin account could otherwise publish unverified
-- medical claims instantly.
create table if not exists public.knowledge_submissions (
  id           uuid primary key default gen_random_uuid(),
  plant_name   text not null,
  kimbundu     text,
  province     text not null,
  elder_name   text not null,
  elder_age    integer,
  use_case     text not null,
  preparation  text,
  notes        text,
  submitted_by uuid references auth.users(id) on delete set null,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at   timestamptz not null default now()
);

alter table public.knowledge_submissions enable row level security;

-- Anyone (including anonymous visitors) can read APPROVED submissions —
-- this is what powers the "community contributions" section of the
-- Treatments page.
create policy "knowledge_read_approved_public"
  on public.knowledge_submissions for select
  using (status = 'approved');

-- Admins can read everything, including pending and rejected, for the
-- moderation page.
create policy "knowledge_read_all_admin"
  on public.knowledge_submissions for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Any signed-in user can submit. The app's own routing already restricts
-- the Registar Saber page to técnico/admin accounts — the real safety
-- net against abuse is moderation (new rows start 'pending' and are
-- invisible to the public until approved), not the insert policy.
create policy "knowledge_insert_authenticated"
  on public.knowledge_submissions for insert
  with check (auth.role() = 'authenticated');

-- Only admins can approve/reject.
create policy "knowledge_update_admin"
  on public.knowledge_submissions for update
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));
