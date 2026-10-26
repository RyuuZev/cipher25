-- ============================================================
-- CIPHER — Database TI 2025
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor.
-- ============================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- ------------------------------------------------------------
-- Tabel
-- ------------------------------------------------------------
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  nim text unique not null check (nim ~ '^[0-9]{13}$'),
  nama text not null,
  prodi text not null default 'Teknologi Informasi',
  fakultas text not null default 'Teknik',
  angkatan integer not null default 2025,
  ttl text,
  motto text,
  instagram_url text,
  foto_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists students_nama_trgm_idx
  on public.students using gin (nama gin_trgm_ops);
create index if not exists students_nim_trgm_idx
  on public.students using gin (nim gin_trgm_ops);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Helper admin
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.students enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "students_admin_select" on public.students;
drop policy if exists "students_admin_insert" on public.students;
drop policy if exists "students_admin_update" on public.students;
drop policy if exists "students_admin_delete" on public.students;

create policy "students_admin_select" on public.students
  for select to authenticated
  using (public.is_admin());

create policy "students_admin_insert" on public.students
  for insert to authenticated
  with check (public.is_admin());

create policy "students_admin_update" on public.students
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "students_admin_delete" on public.students
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self" on public.admin_users
  for select to authenticated
  using (user_id = auth.uid());

-- Anon tidak boleh membaca tabel langsung (hanya lewat RPC pencarian).
revoke select on public.students from anon;
revoke all on public.admin_users from anon;

-- ------------------------------------------------------------
-- RPC publik: pencarian & profil
-- ------------------------------------------------------------
create or replace function public.search_students(q text)
returns setof public.students
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.students
  where length(trim(coalesce(q, ''))) >= 2
    and (
      nim ilike '%' || trim(q) || '%'
      or nama ilike '%' || trim(q) || '%'
    )
  order by nama
  limit 20;
$$;

create or replace function public.get_student(p_nim text)
returns setof public.students
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.students
  where nim = trim(p_nim)
  limit 1;
$$;

revoke all on function public.search_students(text) from public;
revoke all on function public.get_student(text) from public;
grant execute on function public.search_students(text) to authenticated;
grant execute on function public.get_student(text) to authenticated;

-- ------------------------------------------------------------
-- Trigger updated_at
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
  before update on public.students
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Storage bucket foto
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'foto',
  'foto',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "foto_public_read" on storage.objects;
drop policy if exists "foto_admin_insert" on storage.objects;
drop policy if exists "foto_admin_update" on storage.objects;
drop policy if exists "foto_admin_delete" on storage.objects;

create policy "foto_public_read" on storage.objects
  for select to public
  using (bucket_id = 'foto');

create policy "foto_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'foto' and public.is_admin());

create policy "foto_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'foto' and public.is_admin())
  with check (bucket_id = 'foto' and public.is_admin());

create policy "foto_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'foto' and public.is_admin());

-- ------------------------------------------------------------
-- Jadikan user sebagai admin (ganti email-nya).
-- Buat user dulu di Authentication > Users.
-- ------------------------------------------------------------
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'admin@example.com'
-- on conflict (user_id) do nothing;
