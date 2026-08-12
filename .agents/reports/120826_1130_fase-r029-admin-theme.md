# Laporan: Fase R-029 — Tema Aplikasi Ala Admin (AdminLTE)

**Tanggal:** 12 Agustus 2026 · 11:30
**Task:** Desain ulang tema aplikasi menjadi panel admin bergaya AdminLTE (sidebar, dashboard admin, visual panel) — ⭐ prioritas #1 user

---

## Yang Dilakukan

### 1. Palet AdminLTE (`src/theme/index.ts`)
- Warna dirombak ke gaya panel admin: primary biru `#2563eb`, body abu terang (`#f1f5f9`), kartu putih border tipis, sidebar gelap (`#343a40` light / `#24292f` dark).
- Token baru: `sidebar`, `sidebarText`, `sidebarMuted`, `sidebarActiveBg`, `sidebarAccent`.

### 2. Admin Shell (`src/components/admin/AdminShell.tsx`) — baru
- **Sidebar gelap** (lebar 250px): brand "VeloForm", menu Dashboard/Studio/Workflow/Reports/Settings dengan ikon, item aktif disorot + border aksen, footer versi.
- **Topbar**: judul halaman aktif, tombol menu (hamburger) di layar sempit, chip tema yang bisa diklik untuk ganti Light/Dark/Auto dengan cepat.
- **Responsif**: sidebar selalu tampil di layar lebar (web ≥ 900px); di HP menjadi **drawer geser** dengan backdrop gelap.
- Navigasi antar section via `useUiStore` (bukan bottom-tab navigator lagi).

### 3. Dashboard Admin (`src/screens/DashboardScreen.tsx`) — baru
- Content header ala AdminLTE.
- **4 small-box stat**: AI Provider Aktif (data nyata dari store), Skema Form (Fase 3), Workflow (Fase 4), Laporan (Fase 5).
- Kartu **"Mulai Cepat"** (shortcut ke Studio/Workflow/Reports/Settings) dan **"Status Aplikasi"** (versi, tema, AI provider, DB, login, roadmap Supabase).

### 4. Rewiring
- `App.tsx`: `NavigationContainer` + `RootTabs` (bottom tabs) diganti `AdminShell`.
- `src/components/AiProviderWarning.tsx`: link "Settings" sekarang via `useUiStore` (tidak butuh react-navigation).
- `src/navigation/RootTabs.tsx` dihapus (tidak terpakai lagi).
- `src/store/uiStore.ts`: section baru `dashboard` (default).
- Reuse komponen `AdminCard` (box) & `StatCard` (small-box) yang sudah dibuat sebelumnya.

### 5. Bonus ikut ter-commit (pekerjaan sesi sebelumnya yang belum ter-commit)
- `src/db/db.ts`: migrasi pakai tabel `schema_migrations` (PRAGMA user_version gagal di web) + auto-recovery DB korup (error code 26).
- `src/store/aiStore.ts`: seed provider OpenRouter dari `EXPO_PUBLIC_OPENROUTER_API_KEY` untuk testing.
- `.gitignore`: tutup `.env` / `.env*.local` (secret tidak pernah ter-commit).

## Verifikasi

- `bun run typecheck` ✅ (tsc --noEmit tanpa error).
- Preview Freebuff: status 200, aplikasi bundel & berjalan ("Running application main").
  - Warning `[db] ... unable to open database file` di web = masalah expo-sqlite web yang sudah diketahui → akan diselesaikan R-028 (migrasi Supabase).

## Status

- ✅ R-029 selesai (dasar tema & shell admin dipakai semua layar berikutnya)
- 🔲 Berikutnya: R-030 (Auth Supabase — Google saja, role user, gate AI-modify admin)
