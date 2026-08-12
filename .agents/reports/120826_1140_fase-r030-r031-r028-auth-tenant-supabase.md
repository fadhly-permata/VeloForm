# Laporan: Fase R-030 + R-031 + R-028 — Auth Google, Multi-Tenant, Migrasi Supabase

**Tanggal:** 12 Agustus 2026 · 11:40
**Task:** Lanjutkan semua revisi dari awal sesuai urutan prioritas (R-029 ✅ sebelumnya) → R-030 (Auth Supabase), R-031 (Multi-tenant), R-028 (Migrasi Supabase)

---

## Yang Dilakukan

### R-030 — Auth Supabase (login Google saja + role + gate AI-modify) ✅ (kode)
- Pasang **`@supabase/supabase-js@2.112.3`**.
- **`src/lib/supabase.ts`** — client dari `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (default schema `usage`), helper redirect OAuth.
- **`src/store/authStore.ts`** — session, profil (role/business), `signInWithGoogle()` (OAuth redirect), `signOut()`, auto-create profil baru (role operator), deteksi DB belum siap (`dbUnavailable`).
- **`src/screens/AuthScreen.tsx`** — halaman login Google saja (login email tidak ada), ber-tema admin; tampil notice jika Supabase belum dikonfigurasi / DB belum migrasi.
- **`App.tsx`** — alur: splash loading → AuthScreen → Onboarding → AdminShell. Setiap init subsistem independen (kegagalan SQLite web tidak memblokir auth/tema/AI).
- **Gate AI-modify hanya admin**: Settings → bagian **AI Provider hanya tampil untuk admin** (non-admin lihat kartu "Akses dibatasi"); Studio menampilkan catatan role untuk non-admin.
- Topbar AdminShell: avatar user, chip nama usaha (desktop), tombol logout.

### R-031 — Multi-tenant per nama usaha ✅ (kode, aktif setelah migrasi)
- **`src/screens/OnboardingScreen.tsx`** — wajib pilih/buat nama usaha setelah login:
  - **Buat usaha baru** → trigger Supabase otomatis promosi jadi `admin`.
  - **Gabung usaha yang sudah ada** → role `operator`.
- Data usaha A vs B diisolasi via **RLS** (`business_id = current_business_id()` dari profil user login).
- Dashboard & topbar menampilkan usaha + role user yang sedang login.

### R-028 — Migrasi ke Supabase (2 schema) 🔄 (kode siap, menunggu eksekusi dashboard)
- **`supabase/migrations/20260812_0001_init_schemas.sql`**:
  - Schema **`usage`**: `profiles` (role+tenant), `user_preferences`, `ai_providers`, `app_events`.
  - Schema **`business`**: `businesses`, `form_masters`, `form_transactions`, `reports`, `workflows`.
  - RLS penuh: profil per-user, preferensi/AI per-user, **tenant isolation** untuk semua data bisnis.
  - Trigger promosi pembuat usaha → admin.
- **`supabase/README.md`** — langkah setup lengkap (jalankan SQL, expose schema, aktifkan Google provider).

## Verifikasi

- `bun run typecheck` ✅ (tsc --noEmit bersih).
- Preview Freebuff: restart + bundle web sukses (HTTP 200, ~5,4 MB, `supabase-js` ter-bundle).
- Alur: tanpa session → AuthScreen tampil (tanpa perlu DB). Login penuh menunggu setup dashboard (K-006).

## Kebutuhan dari User (tercatat: K-006)

1. **Jalankan migrasi** `supabase/migrations/20260812_0001_init_schemas.sql` di Supabase SQL Editor.
2. **Expose schema** `usage` & `business` (Settings → API → Exposed schemas).
3. **Aktifkan Google provider** (K-004): Google Cloud Console buat OAuth Client ID/Secret → isi di Supabase Authentication → Providers → Google; tambah Redirect URL aplikasi.

## Status & Lanjutan

- ✅ R-029 (sebelumnya), R-030 (kode), R-031 (kode)
- 🔄 R-028 menunggu migrasi dijalankan user
- 🔲 **Berikutnya (Fase 3–5)**: R-016 Studio dual-pane → R-017 AI chat refinement → R-018 generator skema → R-019 preview → R-020 runtime form → R-021 trigger → R-022 cron → R-023 workflow → R-024 CRUD master/transaksi → R-025 report — dieksekusi setelah database Supabase aktif.
