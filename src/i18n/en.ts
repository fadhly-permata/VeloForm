/**
 * English (US) translations — VeloForm.
 *
 * R-032: this file is the SOURCE OF TRUTH for the translation key set
 * (`Messages` / `TranslationKey` types are derived from it). Every other
 * language file must cover exactly the same keys.
 */
export const en = {
  // --- Navigation ---
  'nav.dashboard': 'Dashboard',
  'nav.studio': 'Studio',
  'nav.workflow': 'Workflow',
  'nav.reports': 'Reports',
  'nav.settings': 'Settings',

  // --- Common ---
  'common.loading': 'Loading…',
  'common.save': 'Save',
  'common.cancel': 'Cancel',

  // --- Theme ---
  'theme.title': 'Theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.auto': 'Auto',
  'theme.lightHint': 'High contrast for daylight use',
  'theme.darkHint': 'Power-saving dark mode',
  'theme.autoHint': 'Follow the system preference',

  // --- Language ---
  'language.title': 'Language',
  'language.subtitle': 'Display language used across the whole application.',
  'language.english': 'English (US)',
  'language.indonesian': 'Bahasa Indonesia',
  'language.englishHint': 'Default English (United States)',
  'language.indonesianHint': 'Bahasa Indonesia (default)',

  // --- Auth ---
  'auth.title': 'Sign in to the app',
  'auth.subtitle': 'Sign in with your Google account. (Email login is not available.)',
  'auth.notConfigured':
    'Supabase is not fully configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Keys/API keys.',
  'auth.dbUnavailable':
    'The Supabase database is not ready yet. Run the migration in supabase/migrations and expose the usage & business schemas (Settings → API → Exposed schemas).',
  'auth.signInWithGoogle': 'Continue with Google',
  'auth.loginFailed':
    'Login failed: {error} — make sure the Google provider is enabled in the Supabase dashboard (Authentication → Providers → Google).',

  // --- Onboarding ---
  'onboard.title': 'Choose a Business Name',
  'onboard.subtitle':
    'Data, form designs, and reports are grouped by business name. Users from other businesses cannot see your data.',
  'onboard.dbUnavailable':
    'The Supabase database is not ready yet. Run the migration in supabase/migrations and expose the usage & business schemas.',
  'onboard.createNew': 'Create a new business',
  'onboard.businessNameLabel': 'Business / company name',
  'onboard.createAndAdmin': 'Create & become admin',
  'onboard.orJoin': 'or join an existing business',
  'onboard.noBusinesses': 'No registered businesses yet.',
  'onboard.join': 'Join',
  'onboard.switchAccount': 'Switch account / Sign out',

  // --- Dashboard ---
  'dash.subtitle': 'Application status summary and quick access to VeloForm modules',
  'dash.quickStart': 'Quick Start',
  'dash.appStatus': 'Application Status',
  'dash.statAiActive': 'Active AI Providers',
  'dash.statSchemas': 'Form Schemas',
  'dash.statReports': 'Reports',
  'dash.noteManageSettings': 'Manage in Settings',
  'dash.noteStudioPhase': 'Phase 3 — Studio generate',
  'dash.noteWorkflowPhase': 'Phase 4 — Runtime & workflow',
  'dash.noteReportsPhase': 'Phase 5 — Business data',
  'dash.openStudio': 'Open Studio',
  'dash.openWorkflow': 'Open Workflow',
  'dash.openReports': 'Open Reports',
  'dash.openSettings': 'Open Settings',
  'dash.studioDesc': 'Generate Master, Transaction, Report & Workflow from text prompts.',
  'dash.workflowDesc': 'Set up form triggers, cron schedulers, and business decision flows.',
  'dash.reportsDesc': 'View Master, Transactions, and operational data reports.',
  'dash.settingsDesc': 'Manage app theme, language, and AI provider configuration.',
  'dash.statusVersion': 'Version',
  'dash.statusTheme': 'Theme',
  'dash.statusAiProvider': 'AI Provider',
  'dash.statusDatabase': 'Database',
  'dash.statusLogin': 'Login',
  'dash.statusBusiness': 'Business',
  'dash.statusRole': 'Role',
  'dash.activeProviders': '{count} active',
  'dash.databaseValue': 'Supabase · 2 schemas',

  // --- AI provider ---
  'ai.warningTitle': 'AI provider is not configured yet',
  'ai.warningBody': 'Set it up in Settings first so the generate & workflow features can be used.',
  'ai.active': 'Active',
  'ai.testConnection': 'Test connection',
  'ai.activate': 'Activate',
  'ai.testing': 'Testing…',
  'ai.empty':
    'No AI provider yet. Add at least one provider (OpenRouter, OpenAI, etc.) so the generate feature can be used.',
  'ai.editProvider': 'Edit Provider',
  'ai.addProvider': 'Add Provider',
  'ai.providerType': 'Provider Type',
  'ai.name': 'Name',
  'ai.baseUrl': 'Base URL',
  'ai.modelOptional': 'Model (optional)',
  'ai.apiKey': 'API Key',
  'ai.apiKeyEdit': 'API Key (leave empty to keep the current key)',
  'ai.makeActive': 'Set as active provider',
  'ai.requiredFields': 'Name and Base URL are required.',
  'ai.providerMeta': '{label} · {baseUrl}',
  'ai.providerMetaWithModel': '{label} · {baseUrl} · model: {model}',

  // --- Settings ---
  'settings.aiRestrictedTitle': 'AI Provider — restricted access',
  'settings.aiRestrictedText':
    'Only users with the {role} role can change the AI provider configuration (app modification commands via AI).',

  // --- Studio ---
  'studio.title': 'Generation Studio',
  'studio.description':
    'Generate Master Pages, Transactions, Reports & Decision Workflows from text prompts. Arrives in Phase 3.',
  'studio.roleNote': '🔒 Only users with the {role} role can use app modification commands via the AI provider.',

  // --- Workflow ---
  'workflow.title': 'Workflow Engine',
  'workflow.description':
    'Automated business logic execution: form triggers, cron scheduler, task queue & decision nodes. Arrives in Phase 4.',

  // --- Reports ---
  'reports.title': 'Reports & Data',
  'reports.description': 'Master, Transactions & reports from operational business data. Arrives in Phase 5.',
} as const;

/** Derived message shape — every language file must match these keys exactly. */
export type EnMessages = typeof en;

/** String-mapped message shape (values widened to `string`) used by other language files. */
export type Messages = { [K in keyof EnMessages]: string };

export type TranslationKey = keyof Messages;
