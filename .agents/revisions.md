# 📋 Daftar Revisi & Kebutuhan — VeloForm

> **Aturan:** penambahan revisi **tidak langsung dieksekusi**. Eksekusi hanya
> dilakukan saat user memerintahkannya secara eksplisit (lihat `.agents/RULES.md`).

---

## Status

`🔲 Baru` · `🔄 Sedang Dikerjakan` · `✅ Selesai` · `⏸ Ditunda` · `❌ Dibatalkan`

---

## Revisi Aplikasi

| ID | Tanggal | Deskripsi | Prioritas | Status | Catatan |
|----|---------|-----------|-----------|--------|---------|
| R-001 | 2026-08-12 | Buat aturan main: struktur `.agents`, workflow revisi, laporan proses, catat kebutuhan | Tinggi | ✅ Selesai | Diminta langsung oleh user ("kita buatin dulu aturan main") — laporan: `.agents/reports/120826_0946_setup-agent-rules.md` |
| R-002 | 2026-08-12 | Perjelas aturan kebutuhan: catat dulu API key/token/kredensial di tracker sebagai pengingat supaya user tidak lupa menyediakannya | Tinggi | ✅ Selesai | Diminta langsung oleh user — laporan: `.agents/reports/120826_0948_refine-needs-rule.md` |
| R-003 | 2026-08-12 | Tambah aturan: selalu commit & push ke GitHub setiap selesai perubahan, dengan akun GitHub user sendiri | Tinggi | ✅ Selesai | Diminta langsung oleh user — laporan: `.agents/reports/120826_0950_add-commit-push-rule.md` |
| R-004 | 2026-08-12 | Ganti format filename laporan menjadi `{ddmmyy}_{hhmm}_{task_name}.md` | Rendah | ✅ Selesai | Diminta langsung oleh user — laporan: `.agents/reports/120826_0953_change-report-filename-format.md` |
| R-005 | 2026-08-12 | Hapus atribusi Codebuff (trailer Co-Authored-By) dari history git & force-push; tambah aturan dilarang atribusi selain user | Tinggi | ✅ Selesai | Diminta langsung oleh user — laporan: `.agents/reports/120826_0955_remove-codebuff-attribution.md` |
| R-006 | 2026-08-12 | WP-01 App shell & navigasi (Studio, Workflow, Reports, Settings) — lihat `.agents/PLAN.md` | Tinggi | ✅ Selesai | Fase 0 — laporan: `.agents/reports/120826_1010_fase0-foundation.md` |
| R-007 | 2026-08-12 | WP-02 Sistem tema Light/Dark/Auto + palet token — lihat `.agents/PLAN.md` | Tinggi | ✅ Selesai | Fase 0 — laporan: `.agents/reports/120826_1010_fase0-foundation.md` |
| R-008 | 2026-08-12 | WP-03 Dual SQLite (`system_metadata.db` & `app_data.db`) + migrasi — lihat `.agents/PLAN.md` | Tinggi | ✅ Selesai | Fase 0 — laporan: `.agents/reports/120826_1010_fase0-foundation.md` |
| R-009 | 2026-08-12 | WP-04 State management Zustand (store global) — lihat `.agents/PLAN.md` | Sedang | ✅ Selesai | Fase 0 — laporan: `.agents/reports/120826_1010_fase0-foundation.md` |
| R-010 | 2026-08-12 | WP-05 Halaman Settings + theme mode switcher — lihat `.agents/PLAN.md` | Tinggi | ✅ Selesai | Fase 1 — laporan: `.agents/reports/120826_1034_fase1-fase2-settings-ai.md` |
| R-011 | 2026-08-12 | WP-06 Tabel `user_preferences` + persistensi tema — lihat `.agents/PLAN.md` | Tinggi | ✅ Selesai | Fase 1 — laporan: `.agents/reports/120826_1034_fase1-fase2-settings-ai.md` |
| R-012 | 2026-08-12 | WP-07 Dynamic Palette Propagation — lihat `.agents/PLAN.md` | Sedang | ✅ Selesai | Fase 1 — laporan: `.agents/reports/120826_1034_fase1-fase2-settings-ai.md` |
| R-013 | 2026-08-12 | WP-08 Konfigurasi multi-provider AI (OpenRouter/HuggingFace/OpenAI/Ollama/LiteLLM) — lihat `.agents/PLAN.md` | Tinggi | ✅ Selesai | Fase 2 — laporan: `.agents/reports/120826_1034_fase1-fase2-settings-ai.md` |
| R-014 | 2026-08-12 | WP-09 Enkripsi API key — lihat `.agents/PLAN.md` | Tinggi | ✅ Selesai | Fase 2 — laporan: `.agents/reports/120826_1034_fase1-fase2-settings-ai.md` |
| R-015 | 2026-08-12 | WP-10 Connectivity tester — lihat `.agents/PLAN.md` | Sedang | ✅ Selesai | Fase 2 — laporan: `.agents/reports/120826_1034_fase1-fase2-settings-ai.md` |
| R-016 | 2026-08-12 | WP-11 Studio dual-pane (prompt + live preview) — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-017 | 2026-08-12 | WP-12 AI chat refinement loop — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-018 | 2026-08-12 | WP-13 Generator skema (Master/Transaction/Report/Workflow) — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-019 | 2026-08-12 | WP-14 Theme-aware live preview — lihat `.agents/PLAN.md` | Sedang | 🔲 Baru | Breakdown PRD |
| R-020 | 2026-08-12 | WP-15 Runtime form dinamis — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-021 | 2026-08-12 | WP-16 Trigger form callbacks (ON_SUBMIT/ON_CHANGE) — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-022 | 2026-08-12 | WP-17 Cron scheduler + local task queue — lihat `.agents/PLAN.md` | Sedang | 🔲 Baru | Breakdown PRD |
| R-023 | 2026-08-12 | WP-18 Decision nodes & eksekusi workflow + queue logs — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-024 | 2026-08-12 | WP-19 CRUD Master & Transaction di `app_data.db` — lihat `.agents/PLAN.md` | Sedang | 🔲 Baru | Breakdown PRD |
| R-025 | 2026-08-12 | WP-20 Report generator — lihat `.agents/PLAN.md` | Rendah | 🔲 Baru | Breakdown PRD |
| R-026 | 2026-08-12 | Hilangkan nama kontributor "codebuff-team Codebuff" yang masih muncul di panel kontributor GitHub (history sudah bersih — kemungkinan cache GitHub; pantau sampai refresh) | Sedang | ⏸ Ditunda | Menunggu cache kontributor GitHub refresh (±24-48 jam) — laporan: `.agents/reports/120826_1018_record-codebuff-contributor.md` |
| R-027 | 2026-08-12 | Fix icon/image tidak tampil di web (kotak kosong) — CORS origin proxy di Metro + fix transaksi SQLite web | Tinggi | ✅ Selesai | Dilaporkan user — laporan: `.agents/reports/120826_1042_fix-icons-cors-webdb.md` |
| R-028 | 2026-08-12 | Ganti database SQLite → **Supabase** (2 skema terpisah: form/master/transaksi & report; data penggunaan aplikasi) + **Google Auth login** (aplikasi berjalan per-user login) | Tinggi | 🔄 Sedang Dikerjakan | Migrasi SQL (2 schema + RLS) sudah dibuat di `supabase/migrations/` + client supabase terpasang — **menunggu user jalankan migrasi & expose schema** (lihat `supabase/README.md`) — laporan: `.agents/reports/120826_1140_fase-r030-r031-r028-auth-tenant-supabase.md` |
| R-029 | 2026-08-12 | **Desain ulang tema aplikasi ala aplikasi admin (seperti AdminLTE)** — sidebar layout, tampilan dashboard admin, gaya visual panel admin | Tinggi | ✅ Selesai | ⭐ PRIORITAS #1 — laporan: `.agents/reports/120826_1130_fase-r029-admin-theme.md` |
| R-030 | 2026-08-12 | **Auth Supabase**: login **Google** saja (login email **dihapus** karena user **tidak** punya domain/SMTP sendiri — 11:27), **user role** (admin/operator/dll), **hanya admin yang boleh pakai perintah modifikasi aplikasi via AI provider** | Tinggi | ✅ Selesai (kode) | ⭐ PRIORITAS #2 — kode selesai: login Google, role, gate AI-modify admin; **butuh setup dashboard**: jalankan migrasi + aktifkan Google provider (K-004) — laporan: `.agents/reports/120826_1140_fase-r030-r031-r028-auth-tenant-supabase.md` |
| R-031 | 2026-08-12 | **Multi-tenant per nama usaha** — user dikelompokkan berdasarkan nama usaha/perusahaan; data (desain form & data) user dari usaha A **tidak boleh** diakses user dari usaha B | Tinggi | ✅ Selesai (kode) | ⭐ PRIORITAS #3 — kode selesai: onboarding nama usaha + RLS tenant isolation; **aktif setelah migrasi dijalankan** — laporan: `.agents/reports/120826_1140_fase-r030-r031-r028-auth-tenant-supabase.md` |
| R-032 | 2026-08-12 | **Multi-language (i18n)** — semua label/teks/UI aplikasi wajib melalui sistem terjemahan; file bahasa **terpisah per bahasa** (sementara: **English (US)** & **Bahasa Indonesia**); pemilihan bahasa oleh user lewat **halaman Settings**, tersimpan di `user_preferences` | Tinggi | ✅ Selesai | Diminta langsung oleh user — aturan: `.agents/RULES.md` §7; file bahasa: `src/i18n/en.ts` & `src/i18n/id.ts`; pemilih bahasa di Settings — laporan: `.agents/reports/120826_1334_multilanguage-i18n-and-prd-update.md` |
| R-033 | 2026-08-12 | **Update dokumen PRD.MD** — sinkronkan PRD dengan semua revisi yang pernah diminta (Supabase 2 skema, Google auth, role admin/operator/viewer, multi-tenant, tema AdminLTE, multi-language, dll) | Sedang | ✅ Selesai | Diminta langsung oleh user — PRD v2.0.0 di `.agents/documentations/PRD.MD` — laporan: `.agents/reports/120826_1334_multilanguage-i18n-and-prd-update.md` |

---

## Kebutuhan (Needs)

> Setiap kebutuhan asisten dicatat di sini **sebelum** mengerjakan bagian yang bergantung padanya.

| ID | Tanggal | Kebutuhan | Terpenuhi | Catatan |
|----|---------|-----------|-----------|---------|
| — | — | *(contoh format)* API key AI provider (OpenRouter/OpenAI/HuggingFace) | ❌ | Isi lewat Keys/API keys di Freebuff, pakai prefix `EXPO_PUBLIC_` |
| K-003 | 2026-08-12 | **Supabase project + kredensial** — `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` (+ `SUPABASE_SERVICE_ROLE_KEY` untuk operasi server-side, jangan di bundle) | 🔶 Sebagian | URL + publishable key ✅ diterima user (11:02); `SUPABASE_SERVICE_ROLE_KEY` belum — perlu dibuat dari dashboard (lihat catatan) |
| K-004 | 2026-08-12 | **Google OAuth credentials** — Client ID/Secret untuk Supabase Auth provider Google | ❌ | Di-set dari dashboard Google Cloud Console → Supabase Auth providers; Client ID diset di Supabase, bukan di app |
| K-005 | 2026-08-12 | **Email confirmation** — SMTP/custom domain untuk konfirmasi email saat signup | ❌ Dibatalkan | **Dibatalkan 11:27** — login email dihapus dari R-030 (user tidak punya domain/SMTP sendiri) |
| K-006 | 2026-08-12 | **Setup dashboard Supabase** (kode sudah siap, tinggal eksekusi manual di dashboard) — (1) jalankan `supabase/migrations/20260812_0001_init_schemas.sql` di SQL Editor; (2) expose schema `usage` & `business` (Settings → API → Exposed schemas); (3) aktifkan Google provider + Redirect URL aplikasi | ❌ | Langkah detail: `supabase/README.md`. Tanpa ini: login Google & data tenant belum berfungsi (R-028/030/031) |
| K-007 | 2026-08-12 | **Penerjemahan pesan dinamis dari service layer** (mis. hasil `testProviderConnection` di `src/services/ai.ts` & error store seperti "Nama usaha wajib diisi.") — sementara belum di-i18n-kan karena keluar dari komponen UI; dicatat sebagai pengingat untuk ditangani saat refactor berikutnya | 🔶 Sebagian | Di luar scope R-032 (aturan i18n berlaku untuk label/teks di komponen UI); lihat laporan R-032 |
