# PRODUCT REQUIREMENT DOCUMENT (PRD)

**Product Name:** VeloForm  
**Target Platforms:** Cross-Platform (Web, Android, iOS)  
**Core Stack:** React Native for Web / Expo, TypeScript, Dual SQLite Engine  
**Document Version:** 1.2.0 (Added Theme Engine: Dark / Light / Auto System)  

---

## 1. Executive Summary & Product Vision

### 1.1 Vision
**VeloForm** adalah platform *AI-Driven Dynamic UI, Form Generator, & Workflow Engine* cross-platform yang memungkinkan pengguna membuat, menguji, dan merilis halaman **Master**, **Transaksi**, **Laporan (Report)**, serta **Custom Decision Workflow** secara instan dengan antarmuka adaptif (**Light, Dark, & System Auto Theme**).

### 1.2 Core Value Proposition
* **Velocity (Kecepatan):** Mengubah instruksi teks menjadi antarmuka fungsional dan logika bisnis otomatis dalam hitungan detik.
* **Iterative Refinement Studio:** Live preview interaktif bersisian dengan percakapan AI (*chat refinement*) untuk penyempurnaan UI dan skema workflow.
* **Adaptive Theme Engine:** Dukungan pergantian tema visual secara presisi (Light Mode, Dark Mode, dan Auto/System Following).
* **Event-Driven Workflow Engine:** Eksekusi otomatis logika bisnis berbasis trigger (Form Submit, Field Change, Cron Scheduler, atau Local Task Queue).
* **Multi-Provider AI Agnostic:** Fleksibel dikonfigurasi ke berbagai penyedia model LLM (OpenRouter, HuggingFace, OpenAI, dll.).
* **Local-First & Isolated Data Persistence:** Pemisahan tegas antara *system metadata* dan *business data* menggunakan **dua database SQLite terpisah**.

---

## 2. Detailed Product Features & Modules

### Module 1: System Settings & Theme Engine (NEW)
* **Theme Mode Switcher:** User dapat memilih salah satu dari 3 opsi tema:
  1. **Light Theme:** Kontras tinggi untuk penggunaan siang hari / ruangan terang.
  2. **Dark Theme:** Mode gelap hemat daya dan nyaman untuk mata di kondisi redup.
  3. **Auto / System Default:** Mengikuti konfigurasi preferensi OS bawaan perangkat (Android, iOS, atau Browser).
* **Dynamic Palette Propagation:** Seluruh komponen antarmuka (termasuk komponen UI dinamis hasil *generate* AI) secara otomatis mengonsumsi variabel token warna dari Theme Provider.
* **Theme Persistence:** Pilihan mode tema disimpan secara permanen di tabel `user_preferences` pada `system_metadata.db`.

### Module 2: AI Provider Configurator
*(Multi-Provider Support, API Key Encryption, Connectivity Tester)*

### Module 3: VeloForm Generation Studio (UI, Theme-Aware Preview & Workflow Chat)
* **Theme-Aware Live Preview:** Sandbox Live Preview merender komponen secara instan sesuai tema aktif yang sedang dipilih pengguna.
* **Contextual Refinement:** Chat multi-turn untuk penyesuaian UI & logika workflow.

### Module 4: Dynamic Runtime & Workflow Execution Engine
*(Trigger Sources: Form Callbacks, Cron Scheduler, Local Task Queue, Decision Nodes)*

---

## 3. Database Schema Update (`system_metadata.db`)

#### Table: `user_preferences` (NEW)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `key` | TEXT | PRIMARY KEY | Identifikasi pengaturan (contoh: `theme_mode`) |
| `value` | TEXT | NOT NULL | Opsi pilihan: `light`, `dark`, `auto` |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp pembaruan |
