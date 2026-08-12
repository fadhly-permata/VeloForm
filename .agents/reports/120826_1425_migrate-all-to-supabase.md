# Laporan — Migrasi Total ke Supabase (R-035)

- **Tanggal & waktu:** 12 Agustus 2026, 14:25
- **Task:** Hapus semua akses SQLite — preferensi, AI provider, dan task queue pindah ke Supabase; sinkronkan dokumen (PRD, PLAN, revisions, README).

---

## 1. Yang Dikerjakan

### Kode
1. **Preferensi user** → Supabase `usage.user_preferences`
   - Baru: `src/services/preferences.ts` (`getPreference`/`setPreference` per auth user; sebelum login tidak ada persistensi).
   - `src/store/settingsStore.ts` pindah import dari `../db/db` ke `../services/preferences`.
2. **AI provider** → Supabase `usage.ai_providers`
   - Baru: `src/services/aiRepo.ts` (get/upsert/delete/setActive, di-scope per user; API key tetap di secure storage — WP-09).
   - `src/store/aiStore.ts` pindah import; `loadProviders` hanya sentuh DB saat login, kalau belum login/DB belum siap → fallback env (R-034 tetap jalan).
3. **Task queue** → Supabase `usage.task_queue`
   - `src/services/queue.ts` ditulis ulang (schedule/process/list via Supabase, RLS per-user). `startQueueScheduler` tetap di `App.tsx`.
4. **App.tsx** — `initDatabases()` dihapus; tambah reload preferensi & AI provider setelah login (`useEffect` pada `session`).
5. **Hapus SQLite:** `src/db/db.ts` (dan folder `src/db/`) dihapus; `expo-sqlite` dihapus dari `package.json`/`bun.lock` (`bun remove`); `metro.config.js` disederhanakan (blok wasm untuk expo-sqlite dihapus); **plugin `expo-sqlite` dihapus dari `app.json`** (tinggal `expo-secure-store`).

> **Fix penting:** setelah `bun remove expo-sqlite`, preview gagal start dengan `PluginError: Failed to resolve plugin for module "expo-sqlite"` karena `app.json` masih mencantumkan plugin-nya. Plugin tersebut dihapus dari `app.json` → preview sukses start & bundle (R-035 rampung).
6. **Migrasi Supabase** diperbarui: tabel `usage.task_queue` + RLS `task_queue_own` (per-user) ditambahkan ke `supabase/migrations/20260812_0001_init_schemas.sql`.

### Dokumen
- **PRD.MD** → v2.1.0: SQLite dihapus total (R-035); `task_queue` masuk schema `usage`; tech stack & roadmap diperbarui.
- **PLAN.md**: R-008 (dual SQLite → digantikan), R-022 (queue → Supabase), R-035 ditambahkan.
- **revisions.md**: R-035 dicatat.
- **README.md** (root): "Dual SQLite Architecture" → "Cloud-First Supabase Architecture".
- **supabase/README.md**: tabel `usage` + catatan R-035.

## 2. File yang Dibuat/Diubah

**Dibuat:** `src/services/preferences.ts`, `src/services/aiRepo.ts`, laporan ini.

**Diubah:** `src/services/queue.ts` (rewrite), `src/store/settingsStore.ts`, `src/store/aiStore.ts`, `App.tsx`, `metro.config.js`, `package.json`/`bun.lock` (hapus expo-sqlite), `supabase/migrations/20260812_0001_init_schemas.sql`, `supabase/README.md`, `.agents/documentations/PRD.MD`, `.agents/PLAN.md`, `.agents/revisions.md`, `README.md`, `src/storage/secureStorage.ts` (komentar).

**Dihapus:** `src/db/db.ts`, folder `src/db/`, plugin `expo-sqlite` dari `app.json`.

## 3. Hasil Verifikasi

- `bun run typecheck` (`tsc --noEmit`) ✅ lolos.
- `rg` untuk `expo-sqlite` / `db/db` / `initDatabases` / `getAppDb` di `src/` → **tidak ada match** (kode bersih).
- **Preview** (`freebuff-preview restart`) ✅ ready & listening; `Web Bundled` sukses, app boot tanpa error SQLite (sisa warning DevTools libglib & style props deprecated — non-fatal).
- Satu-satunya data di perangkat kini: **API key AI provider** (secure storage).

## 4. Catatan / Langkah Lanjutan

- **Pengingat kebutuhan belum terpenuhi:** K-006 (jalankan migrasi terbaru + expose schema `usage` & `business` + Google provider), K-004 (Google OAuth Client ID/Secret).
- Migrasi `20260812_0001_init_schemas.sql` harus dijalankan **ulang** (berisi tabel baru `usage.task_queue`).
- Background OS (expo-background-fetch) tetap menunggu test device.
