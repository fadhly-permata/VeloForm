# 🗺️ Rencana Kerja VeloForm (Work Breakdown)

> **Sumber:** `.agents/documentations/PRD.MD` (v1.2.0)
> **Status tiap paket kerja:** dilacak di `.agents/revisions.md` (semua dimulai `🔲 Baru` — dicatat dulu, dieksekusi saat diminta).
> **Konvensi:** `R-XXX` = ID revisi di tracker. `WP-XX` = kode paket kerja di dokumen ini.

---

## Urutan Eksekusi yang Disarankan

```
Fase 0 (Fondasi) → Fase 1 (Theme & Settings) → Fase 2 (AI Provider)
                → Fase 3 (Studio Generate) → Fase 4 (Runtime & Workflow)
                → Fase 5 (Data Bisnis & Laporan)
```

Fase 0 wajib lebih dulu (semua fase lain bergantung padanya).
Fase 1 dan 2 bisa dikerjakan paralel; Fase 3 butuh Fase 2; Fase 4 butuh Fase 3.

---

## Fase 0 — Fondasi (Foundation)

| Revisi | Paket | Deskripsi | Prioritas | Status |
|--------|-------|-----------|-----------|--------|
| R-006 | WP-01 | **App shell & navigasi** — struktur layar utama: Studio, Workflow, Reports, Settings (+ bottom tabs / sidebar responsif) | Tinggi | ✅ |
| R-007 | WP-02 | **Sistem tema (Light/Dark/Auto)** — ThemeProvider + `useColorScheme`, palet token warna (variabel), siap dipakai semua layar | Tinggi | ✅ |
| R-008 | WP-03 | **Dual SQLite** — setup `expo-sqlite` dua koneksi: `system_metadata.db` & `app_data.db`, + mekanisme migrasi skema | Tinggi | ✅ |
| R-009 | WP-04 | **State management (Zustand)** — store global: pengaturan (settings), tema aktif, konfigurasi AI, data runtime | Sedang | ✅ |

## Fase 1 — Module 1: System Settings & Theme Engine

| Revisi | Paket | Deskripsi | Prioritas | Status |
|--------|-------|-----------|-----------|--------|
| R-010 | WP-05 | **Halaman Settings** — UI pengaturan aplikasi, termasuk **theme mode switcher** (Light / Dark / Auto) | Tinggi | ✅ |
| R-011 | WP-06 | **Tabel `user_preferences`** di `system_metadata.db` (key/value + `updated_at`) + persistensi pilihan tema | Tinggi | ✅ |
| R-012 | WP-07 | **Dynamic Palette Propagation** — seluruh komponen (termasuk hasil generate AI) otomatis mengonsumsi token warna dari Theme Provider | Sedang | ✅ |

## Fase 2 — Module 2: AI Provider Configurator

| Revisi | Paket | Deskripsi | Prioritas | Status |
|--------|-------|-----------|-----------|--------|
| R-013 | WP-08 | **Konfigurasi multi-provider** — form kelola koneksi: OpenRouter, HuggingFace, OpenAI, Ollama, LiteLLM (base URL + model) | Tinggi | ✅ |
| R-014 | WP-09 | **Enkripsi API key** — penyimpanan aman kredensial di perangkat (tidak plaintext) | Tinggi | ✅ |
| R-015 | WP-10 | **Connectivity tester** — uji koneksi & validasi key ke provider terpilih | Sedang | ✅ |

## Fase 3 — Module 3: VeloForm Generation Studio

| Revisi | Paket | Deskripsi | Prioritas | Status |
|--------|-------|-----------|-----------|--------|
| R-016 | WP-11 | **Studio dual-pane** — layout prompt input + live preview bersisian | Tinggi | ✅ |
| R-017 | WP-12 | **AI chat refinement** — percakapan multi-turn untuk menyempurnakan UI & logika workflow | Tinggi | ✅ |
| R-018 | WP-13 | **Generator skema** — hasil generate jadi skema Master / Transaction / Report / Workflow, disimpan ke `business.form_masters` / `business.workflows` (Supabase) | Tinggi | ✅ |
| R-019 | WP-14 | **Theme-aware live preview** — render komponen dinamis mengikuti tema aktif (Light/Dark/Auto) | Sedang | ✅ |

## Fase 4 — Module 4: Dynamic Runtime & Workflow Execution Engine

| Revisi | Paket | Deskripsi | Prioritas | Status |
|--------|-------|-----------|-----------|--------|
| R-020 | WP-15 | **Runtime form dinamis** — render form/layar dari skema yang di-generate | Tinggi | 🔲 |
| R-021 | WP-16 | **Trigger form callbacks** — eksekusi logika bisnis pada `ON_SUBMIT`, `ON_CHANGE` | Tinggi | 🔲 |
| R-022 | WP-17 | **Cron scheduler + local task queue** — `expo-task-manager` & `expo-background-fetch` untuk job terjadwal/antrean | Sedang | 🔲 |
| R-023 | WP-18 | **Decision nodes & eksekusi workflow** — alur keputusan + eksekusi + catat queue logs ke `app_data.db` | Tinggi | 🔲 |

## Fase 5 — Data Bisnis & Laporan

| Revisi | Paket | Deskripsi | Prioritas | Status |
|--------|-------|-----------|-----------|--------|
| R-024 | WP-19 | **CRUD Master & Transaction** — data operasional bisnis di `app_data.db` | Sedang | 🔲 |
| R-025 | WP-20 | **Report generator** — tampilkan/laporan dari data operasional (per PRD: Master, Transactions, Reports) | Rendah | 🔲 |

---

## Fase 6 — Migrasi Backend: SQLite → Supabase (R-028, 🔲 Baru)

---

## ⭐ PRIORITAS BARU (dijalankan paling awal — diprioritaskan user, 12 Agu 11:18)

| Revisi | Paket | Deskripsi | Prioritas | Status |
|--------|-------|-----------|-----------|--------|
| R-029 | WP-21 | **Desain ulang tema ala admin (AdminLTE)** — layout sidebar, dashboard admin, visual panel admin; menggantikan tema eksisting | Tinggi | ✅ |
| R-030 | WP-22 | **Auth Supabase** — login **Google** saja (login email dihapus karena user tidak punya domain/SMTP sendiri — 11:27), user role (admin/operator/dll), gate AI-modify hanya untuk admin | Tinggi | ✅ (kode) — menunggu setup dashboard (K-006) |
| R-031 | WP-23 | **Multi-tenant per nama usaha** — grouping user per nama usaha; isolasi data & desain form antar usaha (A ≠ B) via RLS | Tinggi | ✅ (kode) — aktif setelah migrasi |
| R-032 | — | **Multi-language (i18n)** — semua label/teks lewat sistem terjemahan; file bahasa per bahasa (`en.ts`, `id.ts`); pemilih bahasa di Settings (`user_preferences.language`) | Tinggi | ✅ |
| R-033 | — | **Update PRD.MD** ke v2.0.0 sesuai semua revisi (Supabase, Google auth, roles, multi-tenant, AdminLTE, i18n) | Sedang | ✅ |

**Urutan:** R-029 → R-030 → R-031 (lalu lanjut R-028 & fase 3–5).

> **Alasan:** error inisialisasi SQLite web (expo-sqlite/wa-sqlite/OPFS) berulang.
> **Keputusan user:** ganti database ke **Supabase** (Postgres), 2 skema, + login Google.

| Area | Rencana |
|------|---------|
| **Skema `business`** | Struktur form Master/Transaction + Report (data bisnis) — RLS per-user |
| **Skema `usage`** | Data penggunaan aplikasi (preferensi user, konfigurasi AI provider, telemetri/usage) — RLS per-user |
| **Auth** | Google OAuth via Supabase Auth; seluruh query dibatasi ke user yang login (RLS) |
| **Dep** | `@supabase/supabase-js` menggantikan `expo-sqlite` untuk data cloud; SQLite lokal opsional untuk offline cache |
| **Env** | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-side) — lihat K-003/K-004 |

**Langkah:** (1) setup project Supabase + skema + Google OAuth → (2) client `lib/supabase.ts` + store auth Zustand → (3) gate login (Google) di App → (4) migrasikan helper DB (preferences, AI provider) ke query Supabase → (5) sesuaikan fase 3–5 ke skema Supabase.

---

## Ketergantungan Antar Paket

| Paket | Butuh paket sebelumnya |
|-------|------------------------|
| WP-05..WP-23 | WP-01..WP-04 (Fondasi) |
| WP-11..WP-14 (Studio) | WP-08..WP-10 (AI Provider) |
| WP-15..WP-18 (Runtime/Workflow) | WP-13 (Generator skema) |
| WP-19..WP-20 (Data) | WP-03 (SQLite) & WP-15 (Runtime) |

---

## Catatan

- Detail teknis tiap paket akan dirinci saat paket mulai dikerjakan (sesuai skill: revisi — catat → eksekusi → laporan).
- Kebutuhan yang muncul (API key, library, keputusan user) dicatat di tabel *Kebutuhan* `.agents/revisions.md`.
