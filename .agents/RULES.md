# ⚙️ Aturan Main — VeloForm (.agents)

Dokumen ini adalah sumber kebenaran cara kerja asisten (Buffy) di repository ini.
**Setiap aturan WAJIB diikuti** setiap kali mengerjakan proses apa pun di proyek ini.

---

## 1. Semua Artefak Kerja Disimpan di `.agents/`

Semua commands, skills, rules, scripts, hooks, dokumentasi, dan catatan kerja
asisten **WAJIB disimpan di dalam folder `.agents/`**.

Struktur yang dipakai:

```
.agents/
├── RULES.md              ← aturan main (file ini)
├── COMMANDS.md           ← daftar command / skill yang tersedia
├── revisions.md          ← tracker revisi aplikasi & kebutuhan (needs)
├── reports/              ← laporan setiap proses kerja ({date}_{time}_{task}.md)
├── scripts/              ← script/hook milik asisten (dibuat jika diperlukan)
└── documentations/       ← dokumentasi produk (PRD, dll)
```

---

## 2. Workflow Revisi — Catat Dulu, Jangan Langsung Eksekusi

- User boleh memerintahkan: `tambah revisi: <deskripsi>`.
- Saat menerima perintah **tambah revisi**, asisten **HANYA mencatat** revisi
  ke `.agents/revisions.md` dengan status `🔲 Baru`.
- **JANGAN langsung mengerjakan** isi revisi tersebut, **kecuali** user secara
  eksplisit memerintahkan eksekusinya (misal: `kerjakan revisi R-XXX`).
- Setiap perubahan status revisi **selalu dicatat** di kolom Status tracker.
- Progres revisi yang sudah/belum dikerjakan selalu terlihat di tracker.

---

## 3. Laporan untuk Setiap Proses

- Setiap proses/pekerjaan yang dikerjakan **WAJIB menghasilkan laporan** di
  folder `.agents/reports/`.
- Format nama file: `{date}_{time}_{task_name}.md`
  - `date` = `YYYY-MM-DD`, `time` = `HH-MM`, `task_name` = nama tugas (huruf kecil, pakai `-`).
  - Contoh: `2026-08-12_09-46_setup-agent-rules.md`
- Isi minimal laporan:
  1. Tanggal & waktu
  2. Nama tugas / deskripsi singkat
  3. Yang dikerjakan
  4. File yang dibuat/diubah
  5. Hasil verifikasi
  6. Catatan / langkah lanjutan

---

## 4. Kebutuhan Dicatat Dulu (Needs-First)

- **Tujuan:** supaya kebutuhan seperti **API key, token, kredensial, dan
  informasi dari user** tidak terlupakan — dicatat dulu sebagai **pengingat**, karena user bisa lupa menyediakannya.
- Setiap kali asisten **punya kebutuhan** (API key, token, library baru,
  keputusan user, akses/izin, informasi tambahan, dll), **CATAT DULU**
  kebutuhan tersebut di tabel *Kebutuhan* pada `.agents/revisions.md`
  **sebelum** mengerjakan bagian yang bergantung pada kebutuhan itu.
- Kebutuhan yang belum terpenuhi ditandai `❌`, yang sudah terpenuhi `✅`.
- Jika ada kebutuhan yang belum terpenuhi, asisten **WAJIB menyebutkannya lagi
  ke user sebagai pengingat** di akhir setiap proses terkait — jangan biarkan
  kebutuhan itu hilang dari perhatian.
- Jika kebutuhan belum terpenuhi dan menghalangi pekerjaan, berhenti dan minta
  ke user — jangan meneruskan dengan asumsi.

---

## 5. Bahasa & Komunikasi

- Komunikasi mengikuti bahasa yang dipakai user (default: Bahasa Indonesia).
- Jawaban singkat dan langsung ke inti.

---

## 6. Commit & Push ke GitHub

- **Setiap selesai melakukan perubahan** (terutama perubahan kode aplikasi,
  termasuk juga file kerja di `.agents/`), **WAJIB commit & push ke GitHub** —
  jangan biarkan perubahan menggantung tanpa di-push.
- Commit **WAJIB memakai akun GitHub user sendiri**:
  - `user.name` = `Fadhly Permata`
  - `user.email` = `8925077+fadhly-permata@users.noreply.github.com`
- Jangan pernah commit dengan identitas orang lain / identitas generik.
  Jika identitas git tidak sesuai akun user, tanya user dulu sebelum commit.
- Hanya commit file yang relevan dengan pekerjaan yang sedang dikerjakan
  (jangan menyeret file di luar lingkup tanpa izin).
