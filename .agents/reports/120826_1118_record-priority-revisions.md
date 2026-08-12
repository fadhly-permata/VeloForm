# Laporan: Catat Revisi Prioritas Baru (Tema Admin, Auth Lengkap, Multi-Tenant)

**Tanggal:** 12 Agustus 2026 · 11:18
**Task:** Mencatat 3 revisi baru (R-029, R-030, R-031) yang **diprioritaskan user untuk dijalankan paling awal** — tanpa eksekusi (sesuai aturan)

---

## Revisi Baru

| ID | Deskripsi | Urutan |
|----|-----------|--------|
| R-029 | **Desain ulang tema ala aplikasi admin (AdminLTE)** — layout sidebar, dashboard admin, visual panel admin | ⭐ #1 |
| R-030 | **Auth Supabase lengkap** — login Google + email (konfirmasi), user role (admin/operator/dll), **hanya admin** yang boleh pakai perintah modifikasi app via AI provider | ⭐ #2 |
| R-031 | **Multi-tenant per nama usaha** — user dikelompokkan per nama usaha/perusahaan; data desain form & data usaha A tidak boleh diakses usaha B | ⭐ #3 |

## Catatan penting (untuk eksekusi nanti)

1. **R-029 (tema admin)** — harus dijalankan sebelum pekerjaan UI lain; menggantikan tema eksisting (Light/Dark/Auto saat ini).
2. **R-030 (auth)** — butuh K-004 (Google OAuth) dan K-005 (email confirmation). Role: admin, operator, dll. Gate AI-modify → hanya admin.
3. **R-031 (multi-tenant)** — isolasi data antar usaha via RLS (Row Level Security) Supabase; kolom `business_id`/`tenant_id` di semua tabel.

## Yang Dicatat di Tracker & PLAN

- `.agents/revisions.md`: R-029, R-030, R-031 (🔲 Baru, ⭐ prioritas) + K-005 (email confirmation, ❌).
- `.agents/PLAN.md`: section **⭐ PRIORITAS BARU** (WP-21, WP-22, WP-23) dengan urutan R-029 → R-030 → R-031.

## Status

- ✅ Semua tercatat (belum dieksekusi)
- 🔲 Menunggu perintah user untuk mulai
