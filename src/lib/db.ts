import fs from "node:fs";
import path from "node:path";

interface SqliteStatement {
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
  run(...params: unknown[]): unknown;
}

interface SqliteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
}

const globalForDb = globalThis as unknown as {
  __weddingDb?: SqliteDatabase;
};

export function getDb(): SqliteDatabase {
  if (globalForDb.__weddingDb) {
    return globalForDb.__weddingDb;
  }

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "wedding.db");
  let db: SqliteDatabase;

  if (typeof process !== "undefined" && process.versions?.bun) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Database } = require("bun:sqlite") as typeof import("bun:sqlite");
    db = new Database(dbPath, { create: true }) as unknown as SqliteDatabase;
  } else {
    // Node.js 22.5+ built-in SQLite fallback for `next dev` on Windows
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite");
    db = new DatabaseSync(dbPath) as SqliteDatabase;
  }

  db.exec("PRAGMA journal_mode = WAL;");

  db.exec(`
    CREATE TABLE IF NOT EXISTS invitations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      guest_name TEXT NOT NULL,
      salutation TEXT NOT NULL DEFAULT 'Trân trọng kính mời',
      side TEXT NOT NULL DEFAULT 'both' CHECK(side IN ('bride', 'groom', 'both')),
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invitation_code TEXT DEFAULT '',
      name TEXT NOT NULL,
      attending TEXT NOT NULL CHECK(attending IN ('yes', 'no')),
      guests INTEGER NOT NULL DEFAULT 1,
      side TEXT NOT NULL DEFAULT 'both' CHECK(side IN ('bride', 'groom', 'both')),
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS wishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Migrate existing rsvps table if invitation_code column is missing
  const rsvpCols = db.prepare("PRAGMA table_info(rsvps)").all() as Array<{
    name: string;
  }>;
  if (!rsvpCols.some((c) => c.name === "invitation_code")) {
    db.exec("ALTER TABLE rsvps ADD COLUMN invitation_code TEXT DEFAULT ''");
  }

  const countRow = db
    .prepare("SELECT COUNT(*) as count FROM wishes")
    .get() as { count: number };

  if (countRow.count === 0) {
    const insertWish = db.prepare(
      "INSERT INTO wishes (name, message) VALUES (?, ?)"
    );
    insertWish.run(
      "Minh Thư",
      "Chúc Kim Anh và Tiến Đạt trăm năm hạnh phúc, luôn bình yên và rạng rỡ bên nhau."
    );
    insertWish.run(
      "Hoàng Nam",
      "Happy Wedding! Chúc hai bạn có một khởi đầu thật đẹp và trọn vẹn."
    );
  }

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__weddingDb = db;
  }

  return db;
}

export interface InvitationRecord {
  id: number;
  code: string;
  guest_name: string;
  salutation: string;
  side: "bride" | "groom" | "both";
  note: string;
  created_at: string;
}

export interface RsvpRecord {
  id: number;
  invitation_code: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  side: "bride" | "groom" | "both";
  note: string;
  created_at: string;
}

export interface WishRecord {
  id: number;
  name: string;
  message: string;
  created_at: string;
}
