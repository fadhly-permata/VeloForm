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
| R-001 | 2026-08-12 | Buat aturan main: struktur `.agents`, workflow revisi, laporan proses, catat kebutuhan | Tinggi | ✅ Selesai | Diminta langsung oleh user ("kita buatin dulu aturan main") — laporan: `.agents/reports/2026-08-12_09-46_setup-agent-rules.md` |
| R-002 | 2026-08-12 | Perjelas aturan kebutuhan: catat dulu API key/token/kredensial di tracker sebagai pengingat supaya user tidak lupa menyediakannya | Tinggi | ✅ Selesai | Diminta langsung oleh user — laporan: `.agents/reports/2026-08-12_09-48_refine-needs-rule.md` |
| R-003 | 2026-08-12 | Tambah aturan: selalu commit & push ke GitHub setiap selesai perubahan, dengan akun GitHub user sendiri | Tinggi | ✅ Selesai | Diminta langsung oleh user — laporan: `.agents/reports/2026-08-12_09-50_add-commit-push-rule.md` |

---

## Kebutuhan (Needs)

> Setiap kebutuhan asisten dicatat di sini **sebelum** mengerjakan bagian yang bergantung padanya.

| ID | Tanggal | Kebutuhan | Terpenuhi | Catatan |
|----|---------|-----------|-----------|---------|
| — | — | *(contoh format)* API key AI provider (OpenRouter/OpenAI/HuggingFace) | ❌ | Isi lewat Keys/API keys di Freebuff, pakai prefix `EXPO_PUBLIC_` |
