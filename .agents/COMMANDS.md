# 🎮 Command / Skill — VeloForm (.agents)

Daftar perintah dan skill yang dipahami asisten di repo ini.
Semua command di bawah berfungsi lewat chat (bahasa Indonesia) dan catatannya
disimpan di folder `.agents/`.

---

## Revisi Aplikasi

| Perintah | Aksi |
|----------|------|
| `tambah revisi: <deskripsi>` | Mencatat revisi baru ke `.agents/revisions.md` (status `🔲 Baru`). **TIDAK langsung dikerjakan.** |
| `daftar revisi` / `lihat daftar revisi` | Menampilkan isi `.agents/revisions.md` lengkap dengan progres/status. |
| `mulai revisi R-XXX` / `kerjakan revisi R-XXX` | Menandai revisi `🔄 Sedang Dikerjakan`, lalu mengeksekusi isinya. |
| `selesai revisi R-XXX` | Menandai revisi `✅ Selesai` + membuat laporan di `.agents/reports/`. |
| `tunda revisi R-XXX` | Menandai revisi `⏸ Ditunda`. |
| `batalkan revisi R-XXX` | Menandai revisi `❌ Dibatalkan`. |

## Kebutuhan (Needs)

| Perintah | Aksi |
|----------|------|
| `catat kebutuhan: <kebutuhan>` | Menambah baris kebutuhan ke tabel *Kebutuhan* di `.agents/revisions.md` (status `❌`). |
| `kebutuhan` / `lihat kebutuhan` | Menampilkan daftar kebutuhan + status terpenuhi/belum. |

> **Tujuan tabel Kebutuhan:** sebagai **pengingat** kebutuhan yang harus dipenuhi
> user (API key, token, kredensial, dll) supaya tidak lupa. Kebutuhan yang
> belum terpenuhi (`❌`) selalu disebutkan lagi ke user di akhir proses terkait.

## Laporan

| Perintah | Aksi |
|----------|------|
| `buat laporan <nama_tugas>` | Menulis laporan `.agents/reports/{ddmmyy}_{hhmm}_{nama_tugas}.md`. Dilakukan otomatis di akhir setiap proses. |

---

## Git (Delivery)

| Perintah | Aksi |
|----------|------|
| `commit & push` / `push sekarang` | Commit semua perubahan yang sudah selesai & push ke GitHub (identitas commit = akun GitHub user sendiri). |

---

## Multi-Language (i18n)

| Perintah | Aksi |
|----------|------|
| `tambah bahasa: <kode>` | Menambah file bahasa baru di `src/i18n/<kode>.ts` (mengcover semua kunci dari `en.ts`), mendaftarkannya di `src/i18n/index.ts`, dan menambah opsi di `LanguageSection` (Settings). |
| `cek bahasa` / `cek i18n` | Memverifikasi semua file bahasa mengcover semua kunci (via `bun run typecheck` — tipe `Messages` diturunkan dari `en.ts`). |

> **Aturan:** semua label/teks aplikasi wajib via `useI18n().t()` — lihat `.agents/RULES.md` §6.

---

## Skill

- **skill: revisi** — workflow revisi: catat → (tunggu perintah eksekusi) → kerjakan → tandai selesai → laporan.
- **skill: laporan** — setiap proses kerja selalu ditutup dengan laporan di `.agents/reports/`.
- **skill: kebutuhan** — setiap kebutuhan dicatat dulu di tracker sebelum eksekusi bagian yang bergantung padanya.
- **skill: delivery** — setiap selesai perubahan, commit & push ke GitHub dengan akun user sendiri.
- **skill: i18n** — semua label/teks aplikasi wajib lewat sistem terjemahan (`src/i18n/`), bahasa dipilih di Settings, file bahasa per bahasa (`en`, `id`).
