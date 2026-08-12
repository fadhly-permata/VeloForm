# Laporan Proses — Tambah Aturan Commit & Push

- **Tanggal:** 2026-08-12
- **Waktu:** 09:50
- **Nama tugas:** add-commit-push-rule
- **Status:** ✅ Selesai
- **Revisi terkait:** R-003

---

## Yang dikerjakan

1. Menambahkan aturan baru di `.agents/RULES.md` (Aturan 6 — Commit & Push ke GitHub):
   - Setiap selesai perubahan (kode aplikasi & file kerja `.agents/`) **wajib commit & push**.
   - Commit **wajib memakai akun GitHub user sendiri**:
     `Fadhly Permata <8925077+fadhly-permata@users.noreply.github.com>`.
   - Dilarang commit dengan identitas lain; hanya commit file yang relevan.
2. Menambahkan command `commit & push` / `push sekarang` dan skill `delivery`
   di `.agents/COMMANDS.md`.
3. Verifikasi identitas git repo sudah sesuai akun user (tidak perlu diubah).

## File yang diubah

| File | Perubahan |
|------|-----------|
| `.agents/RULES.md` | Tambah Aturan 6 (Commit & Push + identitas akun user). |
| `.agents/COMMANDS.md` | Tambah bagian Git (Delivery) + skill delivery. |
| `.agents/revisions.md` | Tambah entri R-003 (✅ Selesai). |
| `.agents/reports/2026-08-12_09-50_add-commit-push-rule.md` | Laporan ini. |

## Hasil verifikasi

- `git config user.name` = `Fadhly Permata`, `git config user.email` = `8925077+fadhly-permata@users.noreply.github.com` — sudah sesuai akun user.
- Semua perubahan (scaffold Expo + aturan `.agents`) akan di-commit & push ke `origin` (github.com/fadhly-permata/VeloForm).

## Catatan / langkah lanjutan

- Mulai sekarang, setiap proses yang selesai langsung diakhiri dengan commit & push.
