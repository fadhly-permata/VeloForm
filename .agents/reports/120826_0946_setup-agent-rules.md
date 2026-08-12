# Laporan Proses — Setup Aturan Main (.agents)

- **Tanggal:** 2026-08-12
- **Waktu:** 09:46
- **Nama tugas:** setup-agent-rules
- **Status:** ✅ Selesai
- **Revisi terkait:** R-001

---

## Yang dikerjakan

1. Membuat aturan main (rules of the game) untuk cara kerja asisten di repo VeloForm:
   - Semua commands/skills/rules/scripts/hooks disimpan di folder `.agents/`.
   - Workflow revisi: tambah revisi = catat dulu, **tidak langsung dieksekusi**.
   - Setiap proses kerja wajib menghasilkan laporan di `.agents/reports/` dengan format `{date}_{time}_{task_name}.md`.
   - Setiap kebutuhan asisten dicatat dulu di daftar revisi/kebutuhan sebelum eksekusi.
2. Membuat tracker revisi & kebutuhan (`.agents/revisions.md`) dengan entri awal R-001.

## File yang dibuat

| File | Keterangan |
|------|------------|
| `.agents/RULES.md` | Aturan main (sumber kebenaran). |
| `.agents/COMMANDS.md` | Daftar command/skill yang tersedia. |
| `.agents/revisions.md` | Tracker revisi aplikasi + kebutuhan (needs). |
| `.agents/reports/2026-08-12_09-46_setup-agent-rules.md` | Laporan ini. |

## Hasil verifikasi

- Struktur `.agents/` dicek: `RULES.md`, `COMMANDS.md`, `revisions.md`, `reports/`, dan `documentations/PRD.MD` sudah ada.
- Tidak ada perubahan pada kode aplikasi (Expo scaffold) pada proses ini.

## Catatan / langkah lanjutan

- Mulai sekarang, setiap proses kerja akan selalu ditutup dengan laporan di folder ini.
- Opsional: tambahkan `AGENTS.md` di root yang menunjuk ke `.agents/RULES.md` agar aturan otomatis terbaca oleh agent di sesi berikutnya (menunggu keputusan user).
