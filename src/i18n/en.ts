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
    'The Supabase database is not ready yet. Run the migration in supabase/migrations and expose the logic & bussiness schemas (Settings → API → Exposed schemas).',
  'auth.signInWithGoogle': 'Continue with Google',
  'auth.loginFailed':
    'Login failed: {error} — make sure the Google provider is enabled in the Supabase dashboard (Authentication → Providers → Google).',

  // --- Onboarding ---
  'onboard.title': 'Choose a Business Name',
  'onboard.subtitle':
    'Data, form designs, and reports are grouped by business name. Users from other businesses cannot see your data.',
  'onboard.dbUnavailable':
    'The Supabase database is not ready yet. Run the migration in supabase/migrations and expose the logic & bussiness schemas.',
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
  'reports.subtitle': 'Master data, submitted transactions, and operational reports.',

  // --- Workflow (Phase 4) ---
  'workflow.subtitle': 'Run saved decision workflows on form data and monitor the local task queue.',
  'workflow.savedTitle': 'Saved Workflows',
  'workflow.empty': 'No saved workflows yet.',
  'workflow.emptyHint': 'Create one in the Studio (type Workflow), then save it.',
  'workflow.taskQueue': 'Local Task Queue',
  'workflow.queueEmpty': 'No scheduled tasks.',
  'workflow.processNow': 'Process now',
  'workflow.runnerTitle': 'Workflow Runner',
  'workflow.noSelection': 'Select a workflow on the left to run it.',
  'workflow.run': 'Run Workflow',
  'workflow.running': 'Running…',
  'workflow.executionLog': 'Execution Log',
  'workflow.noLog': 'Run a workflow to see its execution steps here.',
  'workflow.noSteps': 'This workflow has no steps.',

  // --- Data / runtime (Phase 5) ---
  'data.dbNotReady': 'Database is not ready yet — run the Supabase migration (supabase/README.md) to enable this feature.',
  'data.masterTitle': 'Saved Schemas (Master)',
  'data.masterEmpty': 'No saved schemas yet — create one in the Studio.',
  'data.transactionsTitle': 'Transactions',
  'data.transactionsEmpty': 'No submitted transactions yet — open a schema and fill the form.',
  'data.reportTitle': 'Report Summary',
  'data.reportEmpty': 'Submit a few transactions to see a summary here.',
  'data.totalSchemas': 'Saved schemas',
  'data.totalTransactions': 'Total transactions',
  'data.perForm': 'Per form',
  'data.formPreview': 'Form Preview',
  'data.fillFormTitle': 'Fill Form',
  'data.detailTitle': 'Transaction Detail',
  'data.submit': 'Submit',
  'data.submitting': 'Submitting…',
  'data.submitted': 'Transaction saved',
  'data.noFields': 'No fields in this schema.',
  'runtime.required': 'Required',

  // --- Studio (Phase 3) ---
  'studio.subtitle': 'Create Master, Transaction, Report & Workflow schemas from text prompts, with live preview and AI refinement.',
  'studio.generatorTitle': 'Schema Generator',
  'studio.kind': 'Form Type',
  'studio.kindMaster': 'Master',
  'studio.kindTransaction': 'Transaction',
  'studio.kindReport': 'Report',
  'studio.kindWorkflow': 'Workflow',
  'studio.promptLabel': 'Prompt',
  'studio.promptPlaceholder':
    'Describe what you need, e.g. “Sales invoice with customer name, date, items with qty & price, and a discount field”…',
  'studio.generate': 'Generate',
  'studio.generating': 'Generating…',
  'studio.previewTitle': 'Live Preview',
  'studio.previewEmpty': 'Nothing here yet. Write a prompt and click Generate — the schema preview will appear in this panel.',
  'studio.schemaGenerated': 'Schema generated',
  'studio.schemaUpdated': 'Schema updated',
  'studio.chatTitle': 'Refine with AI',
  'studio.chatNoSchema': 'Generate a schema first to start refining.',
  'studio.chatPlaceholder':
    'Ask for changes, e.g. “Add a notes field and make the phone number optional”…',
  'studio.send': 'Send',
  'studio.refining': 'Refining…',
  'studio.save': 'Save Schema',
  'studio.saving': 'Saving…',
  'studio.saved': 'Schema saved',
  'studio.dbNotReady':
    'Database is not ready yet — run the Supabase migration (supabase/README.md) so schemas can be saved.',
  'studio.errNoProvider': 'No active AI provider. Configure one in Settings first.',
  'studio.errNoKey': 'The active AI provider has no API key.',
  'studio.errHttp': 'AI request failed (HTTP {status}).',
  'studio.errNetwork': 'Could not reach the AI provider (network/CORS). On native apps it usually works.',
  'studio.errParse': 'The AI response could not be read as a schema. Please try again.',
  'studio.errEmpty': 'The AI returned an empty schema. Please try again.',
  'studio.errUnknown': 'Failed: {message}',
  'studio.fieldsTitle': 'Fields',
  'studio.workflowTrigger': 'Trigger',
  'studio.workflowActions': 'Actions',
  'studio.fieldRequired': 'Required',
  'studio.typeText': 'Text',
  'studio.typeNumber': 'Number',
  'studio.typeTextarea': 'Text Area',
  'studio.typeSelect': 'Select',
  'studio.typeDate': 'Date',
  'studio.typeBoolean': 'Yes / No',
  'studio.typeEmail': 'Email',
  'studio.typeCurrency': 'Currency',
} as const;

/** Derived message shape — every language file must match these keys exactly. */
export type EnMessages = typeof en;

/** String-mapped message shape (values widened to `string`) used by other language files. */
export type Messages = { [K in keyof EnMessages]: string };

export type TranslationKey = keyof Messages;
