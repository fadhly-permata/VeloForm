# Laporan Proses — Perjelas Aturan Kebutuhan (Needs)

- **Tanggal:** 2026-08-12
- **Waktu:** 09:48
- **Nama tugas:** refine-needs-rule
- **Status:** ✅ Selesai
- **Revisi terkait:** R-002

---

## Yang dikerjakan

Memperjelas aturan *kebutuhan dicatat dulu* sesuai penjelasan user:

1. **Tujuan aturan kebutuhan** diperjelas: kalau asisten butuh API key, token,
   kredensial, atau informasi apa pun dari user, kebutuhan itu **dicatat dulu
   di tracker** sebagai **pengingat** supaya user tidak lupa menyediakannya.
2. **Kewajiban mengingatkan:** asisten wajib menyebutkan kembali kebutuhan yang
   belum terpenuhi (`❌`) ke user di akhir setiap proses terkait.
3. Daftar command `catat kebutuhan` diberi keterangan tujuan yang sama.

## File yang diubah

| File | Perubahan |
|------|-----------|
| `.agents/RULES.md` | Aturan 4 diperjelas: tujuan (pengingat), kewajiban menyebutkan kebutuhan yang belum terpenuhi ke user. |
| `.agents/COMMANDS.md` | Bagian Kebutuhan diberi catatan tujuan (pengingat agar user tidak lupa). |
| `.agents/revisions.md` | Tambah entri R-002 (✅ Selesai). |

## Hasil verifikasi

- Semua file `.agents/` terbaca dan konsisten (aturan, command, tracker, laporan).
- Tidak ada perubahan pada kode aplikasi.

## Catatan / langkah lanjutan

- Kebutuhan yang tercatat di tracker akan selalu saya sebutkan ulang ke user
  sampai terpenuhi.
