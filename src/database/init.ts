import { getDatabase } from "./sqlite/database";

export const initializeDatabase = async () => {
  const db = await getDatabase();

  await db.execAsync(`
  
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    lmp_date TEXT,
    calculated_due_date TEXT,
    trimester INTEGER,
    clinical_notes TEXT,
    consent_given INTEGER,
    updated_at TEXT,
    synced INTEGER
    );

 `);

 await db.execAsync(`
    CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY,
    name TEXT,
    dosage TEXT,
    frequency TEXT,
    updated_at TEXT,
    synced INTEGER
    );
 `);

 await db.execAsync(`
    CREATE TABLE IF NOT EXISTS education_modules (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT,
    category_id INTEGER,
    updated_at TEXT
    );
 `);

 await db.execAsync(`
    CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    updated_at TEXT
    );
 `);
};