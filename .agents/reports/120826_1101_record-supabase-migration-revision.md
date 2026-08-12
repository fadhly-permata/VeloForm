# Laporan: Catat Revisi Migrasi SQLite → Supabase + Google Auth

**Tanggal:** 12 Agustus 2026 · 11:01
**Task:** Record revisi baru (R-028) + kebutuhan (K-003, K-004) di tracker — tanpa eksekusi

---

## Konteks

User melihat error berulang saat inisialisasi database SQLite di web
(expo-sqlite/wa-sqlite/OPFS: `Error finalizing statement`, `file is not a
database` code 26, `unable to open database file` code 14). Keputusan user:
**ganti database ke Supabase**, pisahkan data ke **2 skema**, dan tambah
**login Google** supaya aplikasi berjalan sesuai user yang login.

Sesuai aturan (`.agents/RULES.md`): revisi baru **dicatat dulu, tidak
langsung dieksekusi**.

## Yang Dicatat

### `.agents/revisions.md`
- **R-028** (🔲 Baru) — Ganti database SQLite → Supabase dengan 2 skema +
  Google Auth login per-user.
- **K-003** (❌) — Supabase project + kredensial: `EXPO_PUBLIC_SUPABASE_URL`,
  `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-side).
- **K-004** (❌) — Google OAuth credentials (Client ID/Secret → di-set di
  dashboard Supabase Auth).

### `.agents/PLAN.md`
- Ditambah **Fase 6 — Migrasi Backend: SQLite → Supabase** (R-028) dengan
  rencana: skema `business` (form master/transaksi + report) & skema `usage`
  (preferensi, konfigurasi AI, telemetri), RLS per-user, Google OAuth via
  Supabase Auth, `@supabase/supabase-js`, langkah implementasi.

## Rencana Eksekusi (saat user memerintah)

1. Setup project Supabase + 2 skema (`business`, `usage`) + enable Google OAuth.
2. Pasang `@supabase/supabase-js`; buat `lib/supabase.ts` (client + auth store).
3. Tambah gate login Google; batasi semua query ke user yang login (RLS).
4. Migrasikan helper DB lama (preferences, AI provider) ke query Supabase.
5. Sesuaikan fase 3–5 (Studio, Runtime/Workflow, Data/Report) ke skema Supabase.

## Status

- ✅ Revisi & kebutuhan tercatat di tracker
- ✅ PLAN.md diperbarui
- 🔲 Eksekusi **belum** dilakukan (menunggu perintah user)
