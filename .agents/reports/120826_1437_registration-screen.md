# Report — R-037: Halaman Pendaftaran User Baru (Autofill Google)

**Tanggal:** 2026-08-12 14:37
**Revisi:** R-037
**Status:** ✅ Selesai
**Commit:** *(dibuat setelah report ini)*

## Latar Belakang
Setelah login Google, user baru sebelumnya langsung dibawa ke onboarding pemilihan
nama usaha tanpa mendata informasi pengguna. Permintaan user: user baru langsung
melihat **halaman pendaftaran** (form mendata informasi pengguna), dan data yang
sudah tersedia dari Google (nama, email, avatar) **di-autofill**.

## Yang dikerjakan

### Database (migrasi Supabase)
`supabase/migrations/20260812_0001_init_schemas.sql` — tabel `logic.profiles`
ditambah 3 kolom:
- `phone text` — No. HP (opsional)
- `position text` — Jabatan/posisi (opsional)
- `onboarded boolean not null default false` — flag user baru selesai daftar

RLS `profiles_update_own` sudah mengizinkan self-service operator untuk
meng-update profilnya sendiri → `completeProfile` berfungsi tanpa perubahan policy.

### Store auth (`src/store/authStore.ts`)
- `Profile` ditambah field `phone`, `position`, `onboarded`.
- Aksi baru **`completeProfile({ full_name, phone, position })`**:
  - Mengambil avatar/email dari `user.user_metadata` Google (`picture`/`avatar_url`).
  - Update `logic.profiles`: email, full_name, avatar_url, phone, position,
    `onboarded = true`, updated_at.
  - Refresh profil → routing otomatis lanjut ke onboarding.

### Layar baru (`src/screens/RegistrationScreen.tsx`)
- **Autofill Google:** nama (dari `full_name`/`name` metadata), email, avatar
  (dari `picture`/`avatar_url`) — diambil dari `session.user.user_metadata`.
- Form: **Nama lengkap** (wajib, di-autofill), **Email** (read-only dari Google),
  **No. HP** (opsional), **Jabatan** (opsional).
- Avatar Google tampil (atau fallback inisial) + badge "dari Google".
- Tombol **Simpan & Lanjut** → `completeProfile`.
- Jika database belum siap (`dbUnavailable`) → notice `onboard.dbUnavailable`.
- Ada opsi **Ganti akun / Keluar** bila user salah akun.

### Routing (`App.tsx`)
Urutan routing baru:
1. `authStatus === 'loading'` → splash
2. `!session` → `AuthScreen`
3. **`profile && !profile.onboarded` → `RegistrationScreen`** (baru, R-037)
4. `!profile?.business_id` → `OnboardingScreen`
5. else → `AdminShell`

### i18n (R-032 compliance)
Kunci baru `reg.*` (EN + ID): `reg.title`, `reg.subtitle`, `reg.fromGoogle`,
`reg.fullName`, `reg.email`, `reg.phone`, `reg.position`, `reg.submit`.
File: `src/i18n/en.ts` & `src/i18n/id.ts`.

### Dokumen (aturan PRD-sync §8)
- `.agents/documentations/PRD.MD` → **v2.3.0** (summary R-037, §2.1 alur
  registrasi, §2.3 flow multi-tenant, tabel `profiles`, roadmap R-037 ✅;
  sekaligus memperbaiki referensi stale `usage.task_queue` → `logic.task_queue`).
- `.agents/PLAN.md` & `.agents/revisions.md` — status R-037 ✅.

## Verifikasi
- `bun run typecheck` (tsc --noEmit) ✅ lolos.
- Kunci i18n EN/ID konsisten (dijamin oleh type `Messages`).

## Catatan / Pengingat
- Setup dashboard Supabase (K-006) tetap diperlukan supaya alur penuh bisa diuji:
  jalankan migrasi (versi terbaru dengan kolom `phone`/`position`/`onboarded`),
  expose schema `logic` & `business`, aktifkan Google provider (K-004).
- Alur setelah registrasi: `RegistrationScreen` → `OnboardingScreen` (pilih/buat
  usaha) → `AdminShell`.
