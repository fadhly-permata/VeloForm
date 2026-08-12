-- ============================================================================
-- VeloForm — Inisialisasi schema Supabase (R-028, R-030, R-031)
-- ----------------------------------------------------------------------------
-- Cara pakai:
--   1. Dashboard Supabase → SQL Editor → New query → paste seluruh file → Run.
--   2. Settings → API → Exposed schemas → tambahkan `logic` dan `business`.
--   3. Authentication → Providers → Google → aktifkan + isi Client ID/Secret
--      (K-004) & Redirect URL aplikasi.
--
-- Skema:
--   logic    → data penggunaan aplikasi: profil user (role + tenant),
--              preferensi, AI provider, task queue, telemetri.
--              (R-035: menggantikan SQLite lokal — semua data aplikasi di sini.)
--   business → data bisnis: Master/Transaction/Report + Workflow.
--              Terisolasi per nama usaha (business_id) via RLS (R-031).
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Schema `logic`
-- ---------------------------------------------------------------------------
create schema if not exists logic;

-- Profil user: role (admin/operator/viewer) + kelompok usaha (tenant).
create table logic.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  full_name     text,
  avatar_url    text,
  phone         text,
  position      text,
  -- R-037: user baru harus menyelesaikan form pendaftaran sebelum masuk.
  onboarded     boolean not null default false,
  role          text not null default 'operator'
                check (role in ('admin', 'operator', 'viewer')),
  business_id   uuid,
  business_name text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Preferensi per-user (mis. tema aplikasi).
create table logic.user_preferences (
  user_id    uuid not null references auth.users (id) on delete cascade,
  pref_key   text not null,
  pref_value text,
  updated_at timestamptz not null default now(),
  primary key (user_id, pref_key)
);

-- Konfigurasi AI provider per-user (API key TIDAK disimpan di sini — WP-09:
-- key aman di perangkat via expo-secure-store).
create table logic.ai_providers (
  id         text primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  type       text not null,
  name       text not null,
  base_url   text not null,
  model      text,
  is_active  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Telemetri / log penggunaan aplikasi.
create table logic.app_events (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users (id) on delete set null,
  business_id uuid,
  event       text not null,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

-- Task queue per-user (R-022/R-035 — menggantikan SQLite app_data.db).
create table logic.task_queue (
  id         text primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  payload    jsonb not null default '{}'::jsonb,
  run_at     timestamptz not null default now(),
  status     text not null default 'pending' check (status in ('pending', 'done', 'error')),
  result     text,
  created_at timestamptz not null default now(),
  ran_at     timestamptz
);

-- ---------------------------------------------------------------------------
-- Schema `business`
-- ---------------------------------------------------------------------------
create schema if not exists business;

-- Daftar usaha/perusahaan (tenant).
create table business.businesses (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Struktur form (Master/Transaction/Report) yang di-generate.
create table business.form_masters (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references business.businesses (id) on delete cascade,
  name        text not null,
  kind        text not null check (kind in ('master', 'transaction', 'report')),
  schema_json jsonb not null default '{}'::jsonb,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Data transaksi hasil submit form.
create table business.form_transactions (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references business.businesses (id) on delete cascade,
  form_id     uuid not null references business.form_masters (id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Laporan (view/kumpulan data).
create table business.reports (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references business.businesses (id) on delete cascade,
  form_id     uuid not null references business.form_masters (id) on delete cascade,
  title       text not null,
  filter      jsonb not null default '{}'::jsonb,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Workflow (alur keputusan / otomasi bisnis).
create table business.workflows (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references business.businesses (id) on delete cascade,
  name        text not null,
  definition  jsonb not null default '{}'::jsonb,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper: business_id milik user yang sedang login
-- ---------------------------------------------------------------------------
create or replace function logic.current_business_id()
returns uuid
language sql
stable
security definer
as $$
  select business_id from logic.profiles where id = auth.uid();
$$;

-- Promosi otomatis: user yang membuat usaha baru menjadi admin usaha itu.
create or replace function business.set_creator_admin()
returns trigger
language plpgsql
security definer
as $$
begin
  update logic.profiles
     set role          = 'admin',
         business_id   = new.id,
         business_name = new.name,
         updated_at    = now()
   where id = new.created_by;
  return new;
end;
$$;

create trigger trg_set_creator_admin
  after insert on business.businesses
  for each row execute function business.set_creator_admin();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table logic.profiles           enable row level security;
alter table logic.user_preferences   enable row level security;
alter table logic.ai_providers       enable row level security;
alter table logic.app_events         enable row level security;
alter table logic.task_queue         enable row level security;
alter table business.businesses      enable row level security;
alter table business.form_masters    enable row level security;
alter table business.form_transactions enable row level security;
alter table business.reports         enable row level security;
alter table business.workflows       enable row level security;

-- logic.profiles: user hanya mengelola profilnya sendiri.
-- Role boleh diubah ke 'operator' oleh siapa pun (self-service), selain itu
-- hanya admin yang boleh mengubahnya.
create policy "profiles_select_own" on logic.profiles
  for select using (id = auth.uid());

create policy "profiles_insert_own" on logic.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on logic.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and (
      role = 'operator'
      or exists (
        select 1 from logic.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    )
  );

-- logic.user_preferences: per-user.
create policy "prefs_own" on logic.user_preferences
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- logic.ai_providers: per-user.
create policy "providers_own" on logic.ai_providers
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- logic.app_events: insert event sendiri; lihat event sesuai tenant.
create policy "events_insert_own" on logic.app_events
  for insert with check (auth.uid() = user_id);

create policy "events_select_tenant" on logic.app_events
  for select using (
    business_id = logic.current_business_id() or user_id = auth.uid()
  );

-- logic.task_queue: per-user.
create policy "task_queue_own" on logic.task_queue
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- business.businesses: semua user login boleh lihat (untuk join), hanya
-- pembuatnya yang boleh ubah.
create policy "businesses_select_all" on business.businesses
  for select to authenticated using (true);

create policy "businesses_insert_auth" on business.businesses
  for insert to authenticated with check (auth.uid() is not null);

create policy "businesses_update_owner" on business.businesses
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

-- TENANT ISOLATION (R-031): data bisnis hanya bisa dibaca/ditulis oleh user
-- yang business_id-nya sama (A ≠ B).
create policy "forms_tenant" on business.form_masters
  for all using (business_id = logic.current_business_id())
             with check (business_id = logic.current_business_id());

create policy "transactions_tenant" on business.form_transactions
  for all using (business_id = logic.current_business_id())
             with check (business_id = logic.current_business_id());

create policy "reports_tenant" on business.reports
  for all using (business_id = logic.current_business_id())
             with check (business_id = logic.current_business_id());

create policy "workflows_tenant" on business.workflows
  for all using (business_id = logic.current_business_id())
             with check (business_id = logic.current_business_id());

-- ---------------------------------------------------------------------------
-- Grant akses ke role `authenticated` (user yang sudah login)
-- ---------------------------------------------------------------------------
grant usage on schema usage, business to authenticated;

grant all on logic.profiles, logic.user_preferences, logic.ai_providers,
  logic.app_events, business.businesses, business.form_masters,
  business.form_transactions, business.reports, business.workflows
  to authenticated;
