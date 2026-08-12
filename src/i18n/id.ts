import type { Messages } from './en';

/**
 * Bahasa Indonesia translations — VeloForm.
 * Must cover EXACTLY the same keys as `en.ts` (R-032).
 */
export const id: Messages = {
  // --- Navigasi ---
  'nav.dashboard': 'Dashboard',
  'nav.studio': 'Studio',
  'nav.workflow': 'Workflow',
  'nav.reports': 'Reports',
  'nav.settings': 'Settings',

  // --- Umum ---
  'common.loading': 'Memuat…',
  'common.save': 'Simpan',
  'common.cancel': 'Batal',

  // --- Tema ---
  'theme.title': 'Tema',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.auto': 'Auto',
  'theme.lightHint': 'Kontras tinggi untuk siang hari',
  'theme.darkHint': 'Mode gelap hemat daya',
  'theme.autoHint': 'Ikuti preferensi sistem',

  // --- Bahasa ---
  'language.title': 'Bahasa',
  'language.subtitle': 'Bahasa tampilan yang dipakai di seluruh aplikasi.',
  'language.english': 'English (US)',
  'language.indonesian': 'Bahasa Indonesia',
  'language.englishHint': 'Bahasa Inggris (Amerika Serikat)',
  'language.indonesianHint': 'Bahasa Indonesia (default)',

  // --- Auth ---
  'auth.title': 'Masuk ke aplikasi',
  'auth.subtitle': 'Login menggunakan akun Google. (Login email tidak tersedia.)',
  'auth.notConfigured':
    'Konfigurasi Supabase belum lengkap. Tambahkan EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY di Keys/API keys.',
  'auth.dbUnavailable':
    'Database Supabase belum disiapkan. Jalankan migrasi di supabase/migrations dan expose schema usage & business (Settings → API → Exposed schemas).',
  'auth.signInWithGoogle': 'Masuk dengan Google',
  'auth.loginFailed':
    'Gagal login: {error} — pastikan provider Google aktif di dashboard Supabase (Authentication → Providers → Google).',

  // --- Onboarding ---
  'onboard.title': 'Pilih Nama Usaha',
  'onboard.subtitle':
    'Data, desain form, dan laporan dikelompokkan per nama usaha. User dari usaha lain tidak bisa melihat data kamu.',
  'onboard.dbUnavailable':
    'Database Supabase belum disiapkan. Jalankan migrasi di supabase/migrations dan expose schema usage & business.',
  'onboard.createNew': 'Buat usaha baru',
  'onboard.businessNameLabel': 'Nama usaha / perusahaan',
  'onboard.createAndAdmin': 'Buat & jadikan admin',
  'onboard.orJoin': 'atau gabung usaha yang sudah ada',
  'onboard.noBusinesses': 'Belum ada usaha terdaftar.',
  'onboard.join': 'Gabung',
  'onboard.switchAccount': 'Ganti akun / Keluar',

  // --- Dashboard ---
  'dash.subtitle': 'Ringkasan status aplikasi dan akses cepat ke modul VeloForm',
  'dash.quickStart': 'Mulai Cepat',
  'dash.appStatus': 'Status Aplikasi',
  'dash.statAiActive': 'AI Provider Aktif',
  'dash.statSchemas': 'Skema Form',
  'dash.statReports': 'Laporan',
  'dash.noteManageSettings': 'Kelola di Settings',
  'dash.noteStudioPhase': 'Fase 3 — Studio generate',
  'dash.noteWorkflowPhase': 'Fase 4 — Runtime & workflow',
  'dash.noteReportsPhase': 'Fase 5 — Data bisnis',
  'dash.openStudio': 'Buka Studio',
  'dash.openWorkflow': 'Buka Workflow',
  'dash.openReports': 'Buka Reports',
  'dash.openSettings': 'Buka Settings',
  'dash.studioDesc': 'Generate Master, Transaction, Report & Workflow dari prompt teks.',
  'dash.workflowDesc': 'Atur trigger form, cron scheduler, dan alur keputusan bisnis.',
  'dash.reportsDesc': 'Lihat Master, Transactions, dan laporan data operasional.',
  'dash.settingsDesc': 'Kelola tema aplikasi, bahasa, dan konfigurasi AI provider.',
  'dash.statusVersion': 'Versi',
  'dash.statusTheme': 'Tema',
  'dash.statusAiProvider': 'AI Provider',
  'dash.statusDatabase': 'Database',
  'dash.statusLogin': 'Login',
  'dash.statusBusiness': 'Usaha',
  'dash.statusRole': 'Role',
  'dash.activeProviders': '{count} aktif',
  'dash.databaseValue': 'Supabase · 2 schema',

  // --- AI provider ---
  'ai.warningTitle': 'AI provider belum dikonfigurasi',
  'ai.warningBody': 'Atur dulu di Settings supaya fitur generate & workflow bisa dipakai.',
  'ai.active': 'Aktif',
  'ai.testConnection': 'Uji koneksi',
  'ai.activate': 'Aktifkan',
  'ai.testing': 'Menguji…',
  'ai.empty':
    'Belum ada provider AI. Tambahkan minimal satu provider (OpenRouter, OpenAI, dll.) supaya fitur generate bisa dipakai.',
  'ai.editProvider': 'Edit Provider',
  'ai.addProvider': 'Tambah Provider',
  'ai.providerType': 'Tipe Provider',
  'ai.name': 'Nama',
  'ai.baseUrl': 'Base URL',
  'ai.modelOptional': 'Model (opsional)',
  'ai.apiKey': 'API Key',
  'ai.apiKeyEdit': 'API Key (kosongkan jika tidak diubah)',
  'ai.makeActive': 'Jadikan provider aktif',
  'ai.requiredFields': 'Nama dan Base URL wajib diisi.',
  'ai.providerMeta': '{label} · {baseUrl}',
  'ai.providerMetaWithModel': '{label} · {baseUrl} · model: {model}',

  // --- Settings ---
  'settings.aiRestrictedTitle': 'AI Provider — Akses dibatasi',
  'settings.aiRestrictedText':
    'Hanya user dengan role {role} yang dapat mengubah konfigurasi AI provider (perintah modifikasi aplikasi via AI).',

  // --- Studio ---
  'studio.title': 'Generation Studio',
  'studio.description':
    'Generate Master Pages, Transactions, Reports & Decision Workflows dari prompt teks. Hadir di Fase 3.',
  'studio.roleNote':
    '🔒 Hanya user dengan role {role} yang dapat menggunakan perintah modifikasi aplikasi via AI provider.',

  // --- Workflow ---
  'workflow.title': 'Workflow Engine',
  'workflow.description':
    'Eksekusi logika bisnis otomatis: trigger form, cron scheduler, task queue & decision nodes. Hadir di Fase 4.',

  // --- Reports ---
  'reports.title': 'Reports & Data',
  'reports.description': 'Master, Transactions & laporan dari data operasional bisnis. Hadir di Fase 5.',
  'reports.subtitle': 'Data master, transaksi yang dikirim, dan laporan operasional.',

  // --- Workflow (Fase 4) ---
  'workflow.subtitle': 'Jalankan workflow keputusan pada data form dan pantau task queue lokal.',
  'workflow.savedTitle': 'Workflow Tersimpan',
  'workflow.empty': 'Belum ada workflow tersimpan.',
  'workflow.emptyHint': 'Buat di Studio (tipe Workflow), lalu simpan.',
  'workflow.taskQueue': 'Task Queue Lokal',
  'workflow.queueEmpty': 'Tidak ada task terjadwal.',
  'workflow.processNow': 'Proses sekarang',
  'workflow.runnerTitle': 'Runner Workflow',
  'workflow.noSelection': 'Pilih workflow di kiri untuk menjalankannya.',
  'workflow.run': 'Jalankan Workflow',
  'workflow.running': 'Menjalankan…',
  'workflow.executionLog': 'Log Eksekusi',
  'workflow.noLog': 'Jalankan workflow untuk melihat langkah eksekusinya di sini.',
  'workflow.noSteps': 'Workflow ini tidak memiliki langkah.',

  // --- Data / runtime (Fase 5) ---
  'data.dbNotReady': 'Database belum siap — jalankan migrasi Supabase (supabase/README.md) supaya fitur ini aktif.',
  'data.masterTitle': 'Skema Tersimpan (Master)',
  'data.masterEmpty': 'Belum ada skema tersimpan — buat dulu di Studio.',
  'data.transactionsTitle': 'Transaksi',
  'data.transactionsEmpty': 'Belum ada transaksi — buka skema dan isi formulirnya.',
  'data.reportTitle': 'Ringkasan Laporan',
  'data.reportEmpty': 'Kirim beberapa transaksi untuk melihat ringkasannya di sini.',
  'data.totalSchemas': 'Skema tersimpan',
  'data.totalTransactions': 'Total transaksi',
  'data.perForm': 'Per form',
  'data.formPreview': 'Preview Form',
  'data.fillFormTitle': 'Isi Form',
  'data.detailTitle': 'Detail Transaksi',
  'data.submit': 'Kirim',
  'data.submitting': 'Mengirim…',
  'data.submitted': 'Transaksi tersimpan',
  'data.noFields': 'Skema ini tidak memiliki field.',
  'runtime.required': 'Wajib diisi',

  // --- Studio (Fase 3) ---
  'studio.subtitle': 'Buat skema Master, Transaction, Report & Workflow dari prompt teks, dengan live preview dan penyempurnaan AI.',
  'studio.generatorTitle': 'Generator Skema',
  'studio.kind': 'Tipe Form',
  'studio.kindMaster': 'Master',
  'studio.kindTransaction': 'Transaction',
  'studio.kindReport': 'Report',
  'studio.kindWorkflow': 'Workflow',
  'studio.promptLabel': 'Prompt',
  'studio.promptPlaceholder':
    'Jelaskan yang kamu butuhkan, mis. “Faktur penjualan dengan nama pelanggan, tanggal, item beserta qty & harga, dan kolom diskon”…',
  'studio.generate': 'Generate',
  'studio.generating': 'Men-generate…',
  'studio.previewTitle': 'Live Preview',
  'studio.previewEmpty': 'Belum ada apa-apa. Tulis prompt lalu klik Generate — preview skema akan muncul di panel ini.',
  'studio.schemaGenerated': 'Skema dibuat',
  'studio.schemaUpdated': 'Skema diperbarui',
  'studio.chatTitle': 'Sempurnakan dengan AI',
  'studio.chatNoSchema': 'Generate skema dulu untuk mulai menyempurnakan.',
  'studio.chatPlaceholder':
    'Minta perubahan, mis. “Tambah kolom catatan dan buat nomor telepon opsional”…',
  'studio.send': 'Kirim',
  'studio.refining': 'Menyempurnakan…',
  'studio.save': 'Simpan Skema',
  'studio.saving': 'Menyimpan…',
  'studio.saved': 'Skema tersimpan',
  'studio.dbNotReady':
    'Database belum siap — jalankan migrasi Supabase (supabase/README.md) supaya skema bisa disimpan.',
  'studio.errNoProvider': 'Belum ada AI provider aktif. Atur dulu di Settings.',
  'studio.errNoKey': 'AI provider aktif tidak memiliki API key.',
  'studio.errHttp': 'Permintaan AI gagal (HTTP {status}).',
  'studio.errNetwork': 'Tidak dapat terhubung ke AI provider (network/CORS). Di aplikasi native biasanya berhasil.',
  'studio.errParse': 'Respons AI tidak bisa dibaca sebagai skema. Silakan coba lagi.',
  'studio.errEmpty': 'AI mengembalikan skema kosong. Silakan coba lagi.',
  'studio.errUnknown': 'Gagal: {message}',
  'studio.fieldsTitle': 'Field',
  'studio.workflowTrigger': 'Trigger',
  'studio.workflowActions': 'Aksi',
  'studio.fieldRequired': 'Wajib',
  'studio.typeText': 'Teks',
  'studio.typeNumber': 'Angka',
  'studio.typeTextarea': 'Area Teks',
  'studio.typeSelect': 'Pilihan',
  'studio.typeDate': 'Tanggal',
  'studio.typeBoolean': 'Ya / Tidak',
  'studio.typeEmail': 'Email',
  'studio.typeCurrency': 'Mata Uang',
};
