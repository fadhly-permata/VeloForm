import * as SQLite from 'expo-sqlite';

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
];

// Business-data schema arrives with Phase 4/5 (WP-19, WP-20, WP-23).
const APP_MIGRATIONS: string[][] = [];

async function migrate(db: SQLite.SQLiteDatabase, migrations: string[][]): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  for (let v = current; v < migrations.length; v++) {
    await db.withExclusiveTransactionAsync(async (txn) => {
      for (const stmt of migrations[v]) {
        await txn.execAsync(stmt);
      }
    });
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
