# Laporan: Simpan Kredensial Supabase ke `.env.local`

**Tanggal:** 12 Agustus 2026 · 11:02
**Task:** Simpan Supabase URL + publishable key user ke `.env.local`; perbarui kebutuhan K-003 di tracker

---

## Yang Dilakukan

1. Disimpan ke `.env.local` (via `freebuff-env set`, aman, tidak ter-commit):
   - `EXPO_PUBLIC_SUPABASE_URL` = `https://sgwirmypvpkduhpsnaip.supabase.co`
   - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_***` (redacted)
2. Verifikasi `.gitignore` sudah menutup `.env*.local` → tidak akan pernah masuk git.
3. Tracker diperbarui: **K-003 → 🔶 Sebagian** (URL + publishable key ✅; `SUPABASE_SERVICE_ROLE_KEY` masih kurang).

## Catatan K-003 — `SUPABASE_SERVICE_ROLE_KEY` dari mana?

Key ini **tidak diperlukan untuk app klien** (jangan pernah ditaruh di bundle
app — itu secret server-side). Kalau nanti benar-benar dibutuhkan (fungsi
server-side / migrasi data), caranya:

1. Buka dashboard Supabase → project `sgwirmypvpkduhpsnaip`
2. **Project Settings → API Keys** (atau *API / Keys*)
3. Buat key baru dengan role `service_role` (secret) → `sb_secret_...`

Untuk sekarang (client app + RLS), cukup `EXPO_PUBLIC_SUPABASE_URL` +
`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` yang sudah tersimpan.

## Status

- ✅ Kredensial klien tersimpan
- 🔲 Eksekusi R-028 (integrasi Supabase) belum dimulai — menunggu perintah user
