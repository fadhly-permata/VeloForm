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
| R-006 | 2026-08-12 | WP-01 App shell & navigasi (Studio, Workflow, Reports, Settings) — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-007 | 2026-08-12 | WP-02 Sistem tema Light/Dark/Auto + palet token — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-008 | 2026-08-12 | WP-03 Dual SQLite (`system_metadata.db` & `app_data.db`) + migrasi — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-009 | 2026-08-12 | WP-04 State management Zustand (store global) — lihat `.agents/PLAN.md` | Sedang | 🔲 Baru | Breakdown PRD |
| R-010 | 2026-08-12 | WP-05 Halaman Settings + theme mode switcher — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-011 | 2026-08-12 | WP-06 Tabel `user_preferences` + persistensi tema — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-012 | 2026-08-12 | WP-07 Dynamic Palette Propagation — lihat `.agents/PLAN.md` | Sedang | 🔲 Baru | Breakdown PRD |
| R-013 | 2026-08-12 | WP-08 Konfigurasi multi-provider AI (OpenRouter/HuggingFace/OpenAI/Ollama/LiteLLM) — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-014 | 2026-08-12 | WP-09 Enkripsi API key — lihat `.agents/PLAN.md` | Tinggi | 🔲 Baru | Breakdown PRD |
| R-015 | 2026-08-12 | WP-10 Connectivity tester — lihat `.agents/PLAN.md` | Sedang | 🔲 Baru | Breakdown PRD |
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

---

## Kebutuhan (Needs)

> Setiap kebutuhan asisten dicatat di sini **sebelum** mengerjakan bagian yang bergantung padanya.

| ID | Tanggal | Kebutuhan | Terpenuhi | Catatan |
|----|---------|-----------|-----------|---------|
| — | — | *(contoh format)* API key AI provider (OpenRouter/OpenAI/HuggingFace) | ❌ | Isi lewat Keys/API keys di Freebuff, pakai prefix `EXPO_PUBLIC_` |
