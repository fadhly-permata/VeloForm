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

## Skill

- **skill: revisi** — workflow revisi: catat → (tunggu perintah eksekusi) → kerjakan → tandai selesai → laporan.
- **skill: laporan** — setiap proses kerja selalu ditutup dengan laporan di `.agents/reports/`.
- **skill: kebutuhan** — setiap kebutuhan dicatat dulu di tracker sebelum eksekusi bagian yang bergantung padanya.
- **skill: delivery** — setiap selesai perubahan, commit & push ke GitHub dengan akun user sendiri.
