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
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role) values (new.id, 'paciente');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- To promote someone to tecnico or admin, run manually:
-- update public.profiles set role = 'tecnico' where id = '<user-uuid>';
