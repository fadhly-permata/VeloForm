import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

/**
 * Local-first dual database architecture (see PRD):
 * - `system_metadata.db` — AI configs, preferences, generated UI schemas, workflows.
 * - `app_data.db`       — operational business data (Master, Transactions, Reports, Queue Logs).
 *
 * Each DB is a list of migrations: `migrations[i]` = SQL statements for version `i + 1`.
 * Applied via `PRAGMA user_version`.
 */

const SYSTEM_MIGRATIONS: string[][] = [
  // v1 — user preferences (PRD §3)
  [
    `CREATE TABLE IF NOT EXISTS user_preferences (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
  ],
  // v2 — AI provider configurations (PRD Module 2). API keys live in secure storage.
  [
    `CREATE TABLE IF NOT EXISTS ai_providers (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      base_url TEXT NOT NULL,
      model TEXT NOT NULL DEFAULT '',
      is_active INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
  ],
];

// Business-data schema arrives with Phase 4/5 (WP-19, WP-20, WP-23).
const APP_MIGRATIONS: string[][] = [];

async function migrate(db: SQLite.SQLiteDatabase, migrations: string[][]): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  for (let v = current; v < migrations.length; v++) {
    if (Platform.OS === 'web') {
      // expo-sqlite web (wa-sqlite) does not support transactions.
      for (const stmt of migrations[v]) {
        await db.execAsync(stmt);
      }
    } else {
      await db.withExclusiveTransactionAsync(async (txn) => {
        for (const stmt of migrations[v]) {
          await txn.execAsync(stmt);
        }
      });
    }
    await db.execAsync(`PRAGMA user_version = ${v + 1};`);
  }
}

async function openDatabase(name: string, migrations: string[][]): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(name);
  try {
    await db.execAsync('PRAGMA journal_mode = WAL;');
  } catch {
    // WAL is not available on every platform (e.g. some web builds) — non-fatal.
  }
  await migrate(db, migrations);
  return db;
}

let systemDbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let appDbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export interface Databases {
  systemDb: SQLite.SQLiteDatabase;
  appDb: SQLite.SQLiteDatabase;
}

/** Opens (once) and migrates both databases. Safe to call repeatedly. */
export function initDatabases(): Promise<Databases> {
  if (!systemDbPromise) {
    systemDbPromise = openDatabase('system_metadata.db', SYSTEM_MIGRATIONS);
  }
  if (!appDbPromise) {
    appDbPromise = openDatabase('app_data.db', APP_MIGRATIONS);
  }
  return Promise.all([systemDbPromise, appDbPromise]).then(([systemDb, appDb]) => ({
    systemDb,
    appDb,
  }));
}

/** Returns the system DB connection (for later phases). */
export function getSystemDb(): Promise<SQLite.SQLiteDatabase> {
  if (!systemDbPromise) {
    systemDbPromise = openDatabase('system_metadata.db', SYSTEM_MIGRATIONS);
  }
  return systemDbPromise;
}

// --- user_preferences helpers (WP-06) ---

export async function getPreference(key: string): Promise<string | null> {
  const db = await getSystemDb();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM user_preferences WHERE key = ?',
    key
  );
  return row?.value ?? null;
}

export async function setPreference(key: string, value: string): Promise<void> {
  const db = await getSystemDb();
  await db.runAsync(
    `INSERT INTO user_preferences (key, value, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    key,
    value
  );
}

// --- ai_providers helpers (WP-08) ---

export interface AiProviderRow {
  id: string;
  type: string;
  name: string;
  baseUrl: string;
  model: string;
  isActive: boolean;
}

interface DbAiProviderRow {
  id: string;
  type: string;
  name: string;
  base_url: string;
  model: string;
  is_active: number;
}

function mapProviderRow(row: DbAiProviderRow): AiProviderRow {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    baseUrl: row.base_url,
    model: row.model,
    isActive: row.is_active === 1,
  };
}

export async function getAiProviders(): Promise<AiProviderRow[]> {
  const db = await getSystemDb();
  const rows = await db.getAllAsync<DbAiProviderRow>(
    'SELECT id, type, name, base_url, model, is_active FROM ai_providers ORDER BY created_at ASC'
  );
  return rows.map(mapProviderRow);
}

export async function upsertAiProvider(row: AiProviderRow): Promise<void> {
  const db = await getSystemDb();
  await db.runAsync(
    `INSERT INTO ai_providers (id, type, name, base_url, model, is_active)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       type = excluded.type,
       name = excluded.name,
       base_url = excluded.base_url,
       model = excluded.model,
       is_active = excluded.is_active`,
    row.id,
    row.type,
    row.name,
    row.baseUrl,
    row.model,
    row.isActive ? 1 : 0
  );
}

export async function deleteAiProvider(id: string): Promise<void> {
  const db = await getSystemDb();
  await db.runAsync('DELETE FROM ai_providers WHERE id = ?', id);
}

export async function setActiveAiProvider(id: string): Promise<void> {
  const db = await getSystemDb();
  if (Platform.OS === 'web') {
    // expo-sqlite web (wa-sqlite) does not support transactions.
    await db.runAsync('UPDATE ai_providers SET is_active = 0');
    await db.runAsync('UPDATE ai_providers SET is_active = 1 WHERE id = ?', id);
    return;
  }
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync('UPDATE ai_providers SET is_active = 0');
    await txn.runAsync('UPDATE ai_providers SET is_active = 1 WHERE id = ?', id);
  });
}
