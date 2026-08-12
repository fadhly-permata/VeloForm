# Laporan — Rename Skema Database `usage`→`logic` & `business`→`bussiness` (R-036)

- **Tanggal & waktu:** 12 Agustus 2026, 14:29
- **Task:** Rename nama skema Supabase sesuai permintaan user — `usage` → `logic` (data penggunaan aplikasi) & `business` → `bussiness` (data bisnis) di seluruh migrasi, kode, dan dokumen; tambahkan aturan "PRD selalu inline dengan aplikasi"; catat revisi baru R-037 (form pendaftaran user baru) **tanpa eksekusi** (perintah "Tambah revisi" = catat dulu, RULES §2).

---

## 1. Yang Dikerjakan

### Kode & Database
1. **Migrasi SQL** (`supabase/migrations/20260812_0001_init_schemas.sql`)
   - `create schema if not exists usage` → `logic`; `create schema if not exists business` → `bussiness`.
   - Semua prefix tabel/fungsi/policy/RLS: `usage.` → `logic.`, `business.` → `bussiness.`
     (termasuk `logic.profiles`, `logic.user_preferences`, `logic.ai_providers`, `logic.task_queue`,
     `bussiness.businesses`, `bussiness.form_masters`, `bussiness.form_transactions`, `bussiness.reports`,
     `bussiness.workflows`, fungsi `bussiness.set_creator_admin()`, `logic.current_business_id()`, trigger & policies).
   - Kolom `business_id`/`business_name` dan tabel `businesses` **tidak** diubah (bukan nama skema).
2. **Kode aplikasi**
   - `src/lib/supabase.ts` — default schema `'usage'` → `'logic'` + komentar.
   - `src/store/authStore.ts` — `.schema('business')` → `.schema('bussiness')` (×2) + komentar trigger.
   - `src/store/studioStore.ts` — `.schema('business')` → `.schema('bussiness')` (×2).
   - `src/services/dataRepo.ts` — `.schema('business')` → `.schema('bussiness')` (×7) + komentar.
   - `src/services/aiRepo.ts`, `src/services/preferences.ts`, `src/services/queue.ts` — komentar `usage.*` → `logic.*`.
   - i18n (`en.ts`/`id.ts`) — pesan `auth.dbUnavailable` & `onboard.dbUnavailable`: "schema usage & business" → "schema logic & bussiness".

### Dokumen
- **PRD.MD → v2.2.0** (R-036): nama skema `logic` & `bussiness` di seluruh dokumen; roadmap + R-036 ✅; R-037 ditandai 🔲 Baru (dicatat, belum dieksekusi).
- **README.md** (root) & **supabase/README.md** — nama skema `logic` & `bussiness` (termasuk langkah expose schema & tabel `logic.profiles`).
- **.agents/RULES.md** — aturan baru **§8**: PRD wajib diperbarui agar selalu inline dengan aplikasi pada setiap revisi (commit/push geser ke §9).
- **.agents/revisions.md** — R-036 (rename, ✅), R-037 (form pendaftaran user baru + autofill Google, 🔲 Baru — dicatat dulu), K-006 diperbarui dengan nama skema baru.
- **.agents/PLAN.md** — R-036/R-037 tercatat; tabel skema → `bussiness`/`logic`.

## 2. File yang Dibuat/Diubah

**Diubah:** `supabase/migrations/20260812_0001_init_schemas.sql`, `src/lib/supabase.ts`, `src/store/authStore.ts`, `src/store/studioStore.ts`, `src/services/dataRepo.ts`, `src/services/aiRepo.ts`, `src/services/preferences.ts`, `src/services/queue.ts`, `src/i18n/en.ts`, `src/i18n/id.ts`, `.agents/documentations/PRD.MD`, `.agents/RULES.md`, `.agents/revisions.md`, `.agents/PLAN.md`, `README.md`, `supabase/README.md`.

**Dibuat:** laporan ini.

## 3. Hasil Verifikasi

- `bun run typecheck` (`tsc --noEmit`) ✅ lolos.
- `grep -rn "schema('usage')\|schema('business')\|schema: 'usage'" src/` → **tidak ada match** (kode bersih; semua `bussiness`/`logic`).

## 4. Catatan / Langkah Lanjutan

- **Ejaan `bussiness`** (dua s) mengikuti persis permintaan user. Kalau ternyata ingin `business` (satu s), cukup ganti global — bilang saja.
- **K-006** tetap belum terpenuhi: jalankan migrasi terbaru di SQL Editor, expose schema `logic` & `bussiness` (Settings → API → Exposed schemas), aktifkan Google provider.
- **R-037 (form pendaftaran user baru, autofill Google)** — dicatat di tracker, **belum dieksekusi** (menunggu perintah "kerjakan").
