# Supabase Setup — VeloForm

Backend & database VeloForm memakai **Supabase** (Postgres). Dua schema:

| Schema | Isi | Contoh tabel |
|--------|-----|--------------|
| `usage`  | Data penggunaan aplikasi | `profiles` (user, role, tenant), `user_preferences`, `ai_providers`, `task_queue`, `app_events` |
| `business` | Data bisnis (terisolasi per usaha) | `businesses`, `form_masters`, `form_transactions`, `reports`, `workflows` |

> **R-035:** SQLite lokal sudah **dihapus** — preferensi, AI provider, dan task
> queue kini juga di Supabase (`usage`). API key AI provider tetap disimpan di
> secure storage perangkat (tidak di DB).

## Langkah Setup (sekali saja, di dashboard Supabase)

### 1. Jalankan migrasi

1. Buka [Supabase dashboard](https://supabase.com/dashboard) → project
   `sgwirmypvpkduhpsnaip`.
2. **SQL Editor** → New query → paste isi
   [`migrations/20260812_0001_init_schemas.sql`](migrations/20260812_0001_init_schemas.sql)
   → **Run**.
   - Membuat 2 schema + tabel + RLS (tenant isolation per usaha).
   - Trigger: user yang **membuat usaha baru otomatis jadi admin** usaha itu.

### 2. Expose schema ke API

**Settings → API → Exposed schemas** → tambahkan `usage` dan `business`.
(Tanpa ini, tabel tidak bisa diakses dari aplikasi.)

### 3. Aktifkan Google Auth (K-004)

1. **Google Cloud Console** → buat OAuth **Client ID** (tipe Web) →
   Authorized redirect URIs tambahkan:
   `https://sgwirmypvpkduhpsnaip.supabase.co/auth/v1/callback`
2. **Supabase → Authentication → Providers → Google** → aktifkan → isi
   **Client ID** dan **Client Secret**.
3. **Supabase → Authentication → URL Configuration → Redirect URLs** →
   tambahkan origin aplikasi (mis. URL preview/deploy).

> Login **email/password tidak dipakai** (keputusan user: tidak punya
> domain/SMTP sendiri) — cukup Google.

### 4. Env var aplikasi (sudah terisi di `.env.local`)

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

> `SUPABASE_SERVICE_ROLE_KEY` (secret, `sb_secret_…`) **tidak** diperlukan
> untuk aplikasi klien; hanya untuk operasi server-side/migrasi data nanti.

## Role

| Role | Kemampuan |
|------|-----------|
| `admin` | Membuat usaha, mengelola AI provider (perintah modifikasi via AI), mengelola role user |
| `operator` | Memakai aplikasi (isi form, lihat data usaha sendiri) |
| `viewer` | Hanya melihat |

- Default role user baru: `operator`.
- Membuat usaha baru → otomatis jadi `admin` (via trigger).
- Kelola role: tabel `usage.profiles` di dashboard (Table Editor).
