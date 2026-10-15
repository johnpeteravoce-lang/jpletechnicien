-- À exécuter une fois dans Supabase > SQL Editor
create table if not exists public.notes (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.notes enable row level security;
create policy "lire ses notes"      on public.notes for select using (auth.uid() = user_id);
create policy "ajouter ses notes"   on public.notes for insert with check (auth.uid() = user_id);
create policy "supprimer ses notes" on public.notes for delete using (auth.uid() = user_id);
