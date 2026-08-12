# PRODUCT REQUIREMENT DOCUMENT (PRD)

**Product Name:** VeloForm
**Target Platforms:** Cross-Platform (Web, Android, iOS)
**Core Stack:** React Native / Expo (SDK 51+), TypeScript, Supabase (Postgres), Zustand, React Native Paper
**Document Version:** 2.3.0
**Change Summary (v2.2.1 → v2.3.0, R-037):** **Form pendaftaran user baru** dieksekusi — user baru setelah login Google langsung melihat halaman pendaftaran (nama, email, avatar **di-autofill dari Google**; tambahan: no. HP & jabatan opsional) sebelum memilih usaha. Kolom `phone`, `position`, `onboarded` ditambahkan di `logic.profiles` + aksi `completeProfile` + layar `RegistrationScreen` (i18n EN/ID).
**Change Summary (v1.2.0 → v2.0.0):** Backend SQLite → **Supabase** (2 skema), **Google Auth** saja (email login dihapus), **role-based access** (admin/operator/viewer), **multi-tenant per nama usaha**, **tema admin (AdminLTE)**, dan **multi-language (English US & Bahasa Indonesia)**.
**Change Summary (v2.0.0 → v2.1.0, R-035):** **SQLite dihapus total** — preferensi (`user_preferences`), AI provider (`ai_providers`), dan task queue (`task_queue`) kini juga di Supabase schema `logic`; `expo-sqlite` tidak lagi dipakai.
**Change Summary (v2.1.0 → v2.2.0, R-036):** **Rename nama skema** sesuai permintaan user — `usage` → **`logic`** (data penggunaan aplikasi) & `business` → **`bussiness`** (data bisnis) di seluruh migrasi, kode, dan dokumen. R-037 (form pendaftaran user baru) **dicatat, belum dieksekusi**.
**Change Summary (v2.2.0 → v2.2.1, R-038):** **Koreksi typo user** — `bussiness` dikoreksi kembali ke ejaan yang benar **`business`** (satu s) di seluruh migrasi, kode, dan dokumen. **Skema final: `logic` & `business`.**

---

## 1. Executive Summary & Product Vision

### 1.1 Vision
**VeloForm** adalah platform *AI-Driven Dynamic UI, Form Generator, & Workflow Engine* cross-platform yang memungkinkan pengguna membuat, menguji, dan merilis halaman **Master**, **Transaksi**, **Laporan (Report)**, serta **Custom Decision Workflow** secara instan. Aplikasi berjalan sebagai **panel admin** (gaya AdminLTE), **cloud-first via Supabase**, terisolasi **per nama usaha (multi-tenant)**, dan mendukung **multi-language**.

### 1.2 Core Value Proposition
- **Velocity (Kecepatan):** Mengubah instruksi teks menjadi antarmuka fungsional dan logika bisnis otomatis dalam hitungan detik.
- **Iterative Refinement Studio:** Live preview interaktif bersisian dengan percakapan AI (*chat refinement*) untuk penyempurnaan UI dan skema workflow.
- **Admin-Style UI (AdminLTE):** Tampilan aplikasi mengikuti pola umum aplikasi admin — sidebar gelap, dashboard statistik, kartu/kotak konten, header halaman.
- **Adaptive Theme Engine:** Dukungan pergantian tema visual (Light, Dark, dan Auto/System).
- **Multi-Language (i18n):** Semua label/teks aplikasi melalui sistem terjemahan; bahasa dipilih user di halaman Settings (sementara: **English (US)** & **Bahasa Indonesia**).
- **Event-Driven Workflow Engine:** Eksekusi otomatis logika bisnis berbasis trigger (Form Submit, Field Change, Cron Scheduler, atau Local Task Queue).
- **Multi-Provider AI Agnostic:** Fleksibel dikonfigurasi ke berbagai penyedia model LLM (OpenRouter, HuggingFace, OpenAI, Ollama, LiteLLM).
- **Cloud-First & Multi-Tenant:** Database Supabase (Postgres) dengan **2 skema terpisah**; data diisolasi **per nama usaha** via Row Level Security (RLS) — user usaha A tidak bisa melihat data usaha B.

---

## 2. Authentication, Roles & Multi-Tenancy (Module 6)

### 2.1 Authentication
- **Login Google saja** via Supabase Auth (keputusan user: **tidak punya domain/SMTP sendiri**, sehingga login email/password & konfirmasi email **dihapus**).
- Aplikasi berjalan **per-user login** — seluruh query dibatasi ke user yang sedang login (RLS).
- **Registrasi user baru (R-037):** begitu user baru login, aplikasi langsung menampilkan halaman pendaftaran (`RegistrationScreen`) untuk mendata informasi pengguna — **nama, email, dan avatar di-autofill dari akun Google** (dari `user_metadata`), plus kolom **No. HP** dan **Jabatan** (opsional). Data tersimpan di `logic.profiles` dan flag `onboarded = true`; setelah itu baru lanjut ke onboarding pemilihan nama usaha.

### 2.2 User Roles
| Role | Kemampuan |
|------|-----------|
| `admin` | Membuat usaha, mengelola AI provider (**perintah modifikasi aplikasi via AI hanya untuk admin**), mengelola role user |
| `operator` | Memakai aplikasi (isi form, lihat data usaha sendiri) |
| `viewer` | Hanya melihat |

- Default role user baru: `operator`.
- User yang **membuat usaha baru otomatis menjadi admin** usaha itu (trigger `business.set_creator_admin`).

### 2.3 Multi-Tenancy per Nama Usaha (R-031)
- User dikelompokkan berdasarkan **nama usaha/perusahaan** (flow: login Google → **form pendaftaran (R-037)** → onboarding: buat usaha baru → jadi admin, atau gabung usaha yang sudah ada).
- Data bisnis (desain form, transaksi, laporan, workflow) **terisolasi per `business_id`** via RLS — user dari usaha A **tidak boleh** membuka desain form & data usaha B.
- Preferensi & konfigurasi AI provider bersifat per-user.

---

## 3. Detailed Product Features & Modules

### Module 0: App Shell & Navigasi (AdminLTE-style)
- **Sidebar gelap** (desktop selalu tampil; mobile jadi slide-in drawer) dengan navigasi: **Dashboard, Studio, Workflow, Reports, Settings**.
- **Topbar** dengan judul halaman, switch tema cepat, badge nama usaha, avatar user, dan tombol logout.
- Tema visual panel admin (AdminLTE): sidebar gelap, primary biru, body abu terang, kartu putih dengan border tipis.

### Module 1: System Settings & Theme Engine
- **Theme Mode Switcher:** Light / Dark / Auto (System).
- **Dynamic Palette Propagation:** seluruh komponen (termasuk hasil generate AI) mengonsumsi token warna dari Theme Provider.
- **Theme Persistence:** tersimpan di `user_preferences` (key `theme_mode`).

### Module 2: AI Provider Configurator
- **Multi-provider:** OpenRouter, OpenAI, HuggingFace, Ollama (lokal), LiteLLM (proxy) — base URL + model per provider.
- **Enkripsi API key:** kredensial disimpan aman di perangkat (expo-secure-store), tidak plaintext.
- **Connectivity tester:** uji koneksi & validasi key ke provider terpilih.
- **Gate role:** hanya **admin** yang boleh mengubah konfigurasi AI provider; user lain melihat kartu "akses dibatasi".

### Module 3: VeloForm Generation Studio
- **Studio dual-pane:** prompt input + live preview bersisian.
- **AI chat refinement:** percakapan multi-turn untuk menyempurnakan UI & logika workflow.
- **Generator skema:** hasil generate menjadi skema Master / Transaction / Report / Workflow, disimpan ke database.
- **Theme-aware live preview:** render komponen dinamis mengikuti tema aktif.

### Module 4: Dynamic Runtime & Workflow Execution Engine
- **Runtime form dinamis:** render form/layar dari skema yang di-generate.
- **Trigger form callbacks:** eksekusi logika bisnis pada `ON_SUBMIT`, `ON_CHANGE`.
- **Task queue + scheduler in-app** (Supabase `logic.task_queue`) untuk job terjadwal/antrean; background OS (`expo-background-fetch`) menyusul (butuh test device).
- **Decision nodes & eksekusi workflow** + log eksekusi.

### Module 5: Data Bisnis & Laporan
- **CRUD Master & Transaction** (data operasional bisnis).
- **Report generator** — tampilkan/laporan dari data operasional (Master, Transactions, Reports).

### Module 6: Auth, Roles & Multi-Tenancy
- (Detail di §2.)

### Module 7: Multi-Language (i18n) (R-032)
- **Semua label/teks aplikasi wajib** melalui sistem terjemahan (`useI18n().t('kunci')`) — dilarang hardcode teks di komponen.
- **File bahasa terpisah per bahasa** di `src/i18n/` (`en.ts` = English US, `id.ts` = Bahasa Indonesia; `index.ts` = registry + hook).
- **Pemilihan bahasa** oleh user lewat halaman **Settings** (`LanguageSection`), tersimpan di `user_preferences` (key `language`).
- Menambah bahasa baru: buat file bahasa baru yang mengcover semua kunci (dijamin oleh typecheck), daftarkan di registry, tambahkan opsi di Settings.

---

## 4. Database Architecture — Supabase (Postgres)

**Keputusan (R-028/R-035):** seluruh penyimpanan berpindah dari SQLite lokal ke **Supabase** (error inisialisasi SQLite web — expo-sqlite/wa-sqlite/OPFS — berulang). **R-035: akses SQLite dihapus total** — preferensi, AI provider, dan task queue pindah ke schema `logic`; satu-satunya data di perangkat adalah **API key AI provider** (secure storage, WP-09). **R-036/R-038: nama skema final = `logic` & `business`.**

### 4.1 Schema `logic` — Data penggunaan aplikasi
| Tabel | Isi |
|-------|-----|
| `profiles` | Profil user: email, nama, avatar, no. HP, jabatan, flag **onboarded** (R-037), **role**, **business_id/business_name** (tenant) |
| `user_preferences` | Preferensi per-user: `theme_mode`, `language`, dll. (dari SQLite, R-035) |
| `ai_providers` | Konfigurasi AI provider per-user (dari SQLite, R-035; API key **tidak** disimpan di DB) |
| `task_queue` | Task queue per-user (dari SQLite `app_data.db`, R-035) |
| `app_events` | Telemetri / log penggunaan aplikasi |

### 4.2 Schema `business` — Data bisnis (terisolasi per usaha)
| Tabel | Isi |
|-------|-----|
| `businesses` | Daftar usaha/perusahaan (tenant) |
| `form_masters` | Struktur form Master/Transaction/Report yang di-generate (`schema_json`) |
| `form_transactions` | Data hasil submit form |
| `reports` | Definisi laporan |
| `workflows` | Definisi alur keputusan/otomasi |

### 4.3 Keamanan
- **Row Level Security (RLS) diaktifkan** di semua tabel.
- Query dibatasi ke `auth.uid()` dan `business_id` user (isolasi tenant).
- Migrasi: `supabase/migrations/20260812_0001_init_schemas.sql`.

---

## 5. Environment Variables & Setup

| Env var | Keterangan | Status |
|---------|-----------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | URL project Supabase | ✅ tersedia |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key klien | ✅ tersedia |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret server-side (opsional, jangan di-bundle) | 🔶 belum |
| Google OAuth Client ID/Secret | Di-set di dashboard Supabase (bukan di app) | ❌ belum |

**Setup dashboard Supabase (sekali):** (1) jalankan migrasi; (2) expose schema `logic` & `business` (Settings → API → Exposed schemas); (3) aktifkan Google provider + Redirect URL aplikasi. Detail: `supabase/README.md`.

---

## 6. Tech Stack

- **Core Framework:** React Native / Expo
- **Languages:** TypeScript
- **Theme & UI System:** React Native Paper + token palet custom (gaya AdminLTE)
- **State Management:** Zustand
- **Backend & Database:** Supabase (Postgres, 2 skema, RLS, Google Auth) — termasuk preferensi, AI provider, & task queue
- **Secure storage (perangkat):** expo-secure-store untuk API key AI provider (WP-09); SQLite **tidak dipakai** (R-035)
- **Background Tasks (fase 4):** scheduler in-app; expo-background-fetch menyusul (butuh test device)

---

## 7. Roadmap & Status

| Fase | Paket | Status |
|------|-------|--------|
| Fase 0 — Fondasi (shell, tema, Zustand) | WP-01..WP-04 | ✅ |
| Fase 1 — Settings & Theme Engine | WP-05..WP-07 | ✅ |
| Fase 2 — AI Provider Configurator | WP-08..WP-10 | ✅ |
| ⭐ Tema Admin (AdminLTE) | WP-21 (R-029) | ✅ |
| ⭐ Auth Supabase (Google + roles) | WP-22 (R-030) | ✅ (kode) — butuh setup dashboard (K-006) |
| ⭐ Multi-tenant per nama usaha | WP-23 (R-031) | ✅ (kode) — aktif setelah migrasi |
| Migrasi Supabase (2 skema) | R-028 | 🔄 — menunggu migrasi dijalankan |
| Multi-language (EN/ID) | R-032 | ✅ |
| Fase 3 — Generation Studio | WP-11..WP-14 | ✅ |
| Fase 4 — Runtime & Workflow | WP-15..WP-18 | ✅ (background OS menyusul) |
| Fase 5 — Data Bisnis & Laporan | WP-19..WP-20 | ✅ |
| Hapus SQLite — semua data ke Supabase | R-035 | ✅ |
| Rename skema DB (`usage`→`logic`, `business`→`bussiness`→`business`) | R-036/R-038 | ✅ |
| Form pendaftaran user baru (autofill Google) | R-037 | ✅ |

> Status terperinci per revisi: `.agents/revisions.md` & `.agents/PLAN.md`.
