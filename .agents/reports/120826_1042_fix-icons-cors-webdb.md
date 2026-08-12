# Laporan Proses — Fix Icon Tidak Tampil (CORS) + SQLite Web

- **Tanggal:** 2026-08-12
- **Waktu:** 10:42
- **Nama tugas:** fix-icons-cors-webdb
- **Status:** ✅ Selesai
- **Revisi terkait:** R-027 (✅ Selesai)

---

## Gejala

- Semua icon aplikasi tampil sebagai **kotak kosong** di preview web.
- Log preview menunjukkan: `Error: Unauthorized request from https://8081-...daytonaproxy01.net`
  (berulang) dan `App init failed: withExclusiveTransactionAsync is not supported on web`.

## Akar masalah

1. **Icon/font (CORS):** Font icon (`Ionicons.ttf`) dimuat via URL relatif
   `/assets/...`, tapi browser mengirim header `Origin` (wajib untuk fetch font).
   Proxy meneruskan request dengan `Host: localhost:8081` sementara `Origin`
   adalah domain proxy → CorsMiddleware Expo menolak (origin tidak ada di
   allowlist) → font gagal dimuat → icon jadi kotak kosong.
   - Dibuktikan dengan curl: tanpa `Origin` → `200` (389KB); dengan `Origin`
     proxy → `500`.
2. **SQLite web:** `withExclusiveTransactionAsync` tidak didukung expo-sqlite
   web (wa-sqlite) → migrasi DB gagal di web (non-fatal, tapi DB tidak aktif).

## Perbaikan

1. **`app.json`** → `expo.extra.router.origin` = URL preview (proxy). Expo CLI
   membaca ini dan menambah host-nya ke allowlist CORS dev server.
   - Verifikasi ulang: request font dengan `Origin` proxy → **200** (389KB) +
   `Access-Control-Allow-Origin` dikembalikan.
2. **`src/db/db.ts`** → jalur `Platform.OS === 'web'` di `migrate()` dan
   `setActiveAiProvider()`: eksekusi statement langsung (tanpa transaksi) di
   web; native tetap pakai transaksi eksklusif.

## File yang diubah

| File | Perubahan |
|------|-----------|
| `app.json` | `extra.router.origin` = URL preview. |
| `src/db/db.ts` | Branch web untuk migrasi & set active provider. |
| `.agents/revisions.md` | Tambah R-027 (✅). |

## Hasil verifikasi

- `bun tsc --noEmit` → lolos.
- Font dengan `Origin` proxy → HTTP 200 + `Access-Control-Allow-Origin` ✅.
- Preview restart OK.

## Catatan / langkah lanjutan

- `extra.router.origin` berisi URL proxy workspace ini — jika URL preview
  berubah, nilai ini perlu disesuaikan.
- Verifikasi visual akhir: user membuka preview (icon harus tampil, DB aktif).
