# Laporan — Multi-Language (i18n) + Update PRD (R-032, R-033)

- **Tanggal & waktu:** 12 Agustus 2026, 13:34
- **Task:** Implementasi sistem multi-language (English US & Bahasa Indonesia) + sinkronisasi dokumen PRD dengan semua revisi.

---

## 1. Yang Dikerjakan

### R-032 — Multi-Language (i18n)
1. **Aturan** (`.agents/RULES.md` §6): semua label/teks/UI string wajib lewat
   `useI18n().t()`, file bahasa terpisah per bahasa di `src/i18n/`, bahasa
   dipilih user di halaman Settings, tersimpan di `user_preferences`.
2. **Command/skill** (`.agents/COMMANDS.md`): perintah `tambah bahasa: <kode>`
   & `cek bahasa`, plus skill `i18n`.
3. **Infrastruktur i18n:**
   - `src/i18n/en.ts` — English (US); **source of truth** untuk kumpulan kunci
     (tipe `Messages`/`TranslationKey` diturunkan dari file ini).
   - `src/i18n/id.ts` — Bahasa Indonesia (kunci identik, dijamin typecheck).
   - `src/i18n/index.ts` — registry `translations`, `translate()`, hook
     `useI18n()`, `LANGUAGE_OPTIONS`, `THEME_LABEL_KEYS`.
4. **State & persistensi:** `src/store/settingsStore.ts` — field `language`
   (+ `setLanguage`/`loadLanguage`), tersimpan di `user_preferences` (key
   `language`), dimuat saat init di `App.tsx`.
5. **UI Settings:** komponen baru `src/components/settings/LanguageSection.tsx`
   (radio English (US) / Bahasa Indonesia), dipasang di `SettingsScreen`.
6. **Penerjemahan semua layar/komponen** (label, hint, tombol, deskripsi,
   peringatan): AuthScreen, OnboardingScreen, DashboardScreen, SettingsScreen,
   StudioScreen, WorkflowScreen, ReportsScreen, AdminShell (sidebar + topbar),
   ThemeSection, AiProviderSection, AiProviderWarning, LanguageSection.

### R-033 — Update PRD
- `.agents/documentations/PRD.MD` ditulis ulang ke **v2.0.0**:
  - Arsitektur baru: Supabase 2 skema (`usage` & `business`), Google Auth,
    role admin/operator/viewer, multi-tenant per nama usaha, tema AdminLTE,
    multi-language EN/ID, roadmap & status fase, env vars & setup dashboard.

## 2. File yang Dibuat/Diubah

**Dibuat:**
- `src/i18n/en.ts`, `src/i18n/id.ts`, `src/i18n/index.ts`
- `src/components/settings/LanguageSection.tsx`
- `.agents/reports/120826_1334_multilanguage-i18n-and-prd-update.md` (ini)

**Diubah:**
- `src/store/settingsStore.ts` (state bahasa + persistensi)
- `App.tsx` (loadLanguage saat init)
- `src/screens/{Auth,Onboarding,Dashboard,Settings,Studio,Workflow,Reports}Screen.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/components/settings/{ThemeSection,AiProviderSection}.tsx`
- `src/components/AiProviderWarning.tsx`
- `.agents/RULES.md`, `.agents/COMMANDS.md`, `.agents/revisions.md`,
  `.agents/PLAN.md`, `.agents/documentations/PRD.MD`

## 3. Hasil Verifikasi

- `bun run typecheck` (`tsc --noEmit`) **lolos** — sekaligus memverifikasi
  `id.ts` mengcover semua kunci `en.ts` (tipe `Messages`).

## 4. Catatan / Langkah Lanjutan

- **Pesan dari service layer** (hasil `testProviderConnection` di
  `src/services/ai.ts`, error store seperti "Nama usaha wajib diisi.") belum
  di-i18n-kan (tercatat sebagai K-007) — di luar scope aturan i18n komponen UI.
- **Kebutuhan belum terpenuhi (pengingat):**
  - K-006: setup dashboard Supabase (jalankan migrasi, expose schema
    `usage` & `business`, aktifkan Google provider) — belum; tanpanya
    R-028/030/031 belum berfungsi penuh.
  - K-004: Google OAuth Client ID/Secret di dashboard Supabase.
  - K-003: `SUPABASE_SERVICE_ROLE_KEY` (secret server-side) belum disediakan.
- Bahasa baru berikutnya: buat file di `src/i18n/` + daftarkan di registry +
  tambahkan opsi di `LanguageSection`.
