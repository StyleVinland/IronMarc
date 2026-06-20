import path from 'path';
import fs from 'fs';
import type { AppState, DayData, MediaItem } from '@/types';

// node:sqlite is built into Node.js 22+ — no native compilation needed
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DatabaseSync } = require('node:sqlite') as {
  DatabaseSync: new (location: string) => NodeSqliteDb;
};

type SqlVal = null | number | bigint | string | Uint8Array;
type SqlRow = Record<string, SqlVal>;

interface PreparedStmt {
  run(...args: unknown[]): { lastInsertRowid: number | bigint; changes: number };
  get(...args: unknown[]): SqlRow | undefined;
  all(...args: unknown[]): SqlRow[];
}
interface NodeSqliteDb {
  exec(sql: string): void;
  prepare(sql: string): PreparedStmt;
  close(): void;
}

declare global {
  // eslint-disable-next-line no-var
  var _db: NodeSqliteDb | undefined;
}

function openDb(): NodeSqliteDb {
  if (global._db) return global._db;

  const dir = path.join(process.cwd(), 'storage');
  const mediaDir = path.join(dir, 'media');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  const db = new DatabaseSync(path.join(dir, 'tracker.db'));

  db.exec('PRAGMA journal_mode = WAL;');
  db.exec(`
    CREATE TABLE IF NOT EXISTS days (
      date       TEXT PRIMARY KEY,
      cigs       INTEGER NOT NULL DEFAULT 0,
      mood       INTEGER,
      journal    TEXT NOT NULL DEFAULT '',
      grat1      TEXT NOT NULL DEFAULT '',
      grat2      TEXT NOT NULL DEFAULT '',
      grat3      TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS missions (
      date       TEXT NOT NULL,
      mission_id TEXT NOT NULL,
      PRIMARY KEY (date, mission_id)
    );
    CREATE TABLE IF NOT EXISTS quests (
      quest_id     TEXT PRIMARY KEY,
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS media (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      date          TEXT NOT NULL,
      filename      TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type     TEXT NOT NULL,
      note          TEXT NOT NULL DEFAULT '',
      size          INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  global._db = db;
  return db;
}

export function getFullState(): AppState {
  const db = openDb();
  const dayRows = db.prepare('SELECT * FROM days').all();
  const missionRows = db.prepare('SELECT date, mission_id FROM missions').all();
  const questRows = db.prepare('SELECT quest_id FROM quests').all();
  const setting = db.prepare("SELECT value FROM settings WHERE key = 'affIdx'").get();

  const days: Record<string, DayData> = {};
  for (const r of dayRows) {
    const date = r.date as string;
    days[date] = {
      date,
      cigs: Number(r.cigs ?? 0),
      mind: {
        mood: r.mood != null ? Number(r.mood) : null,
        journal: (r.journal as string) ?? '',
        grat: [(r.grat1 as string) ?? '', (r.grat2 as string) ?? '', (r.grat3 as string) ?? ''],
      },
      missions: {},
    };
  }
  for (const r of missionRows) {
    const date = r.date as string;
    if (!days[date]) {
      days[date] = { date, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} };
    }
    days[date].missions[r.mission_id as string] = true;
  }

  const quests: Record<string, boolean> = {};
  for (const r of questRows) quests[r.quest_id as string] = true;

  return { days, quests, affIdx: setting ? Number(setting.value) : 0 };
}

export function upsertDay(
  date: string,
  fields: Partial<{ cigs: number; mood: number | null; journal: string; grat: [string, string, string] }>
) {
  openDb().prepare(`
    INSERT INTO days (date, cigs, mood, journal, grat1, grat2, grat3)
    VALUES (@date, IFNULL(@cigs, 0), @mood, IFNULL(@journal, ''), IFNULL(@grat1, ''), IFNULL(@grat2, ''), IFNULL(@grat3, ''))
    ON CONFLICT(date) DO UPDATE SET
      cigs       = CASE WHEN @cigs IS NOT NULL    THEN @cigs    ELSE cigs    END,
      mood       = CASE WHEN @mood IS NOT NULL     THEN @mood    ELSE mood    END,
      journal    = CASE WHEN @journal IS NOT NULL  THEN @journal ELSE journal END,
      grat1      = CASE WHEN @grat1 IS NOT NULL    THEN @grat1   ELSE grat1   END,
      grat2      = CASE WHEN @grat2 IS NOT NULL    THEN @grat2   ELSE grat2   END,
      grat3      = CASE WHEN @grat3 IS NOT NULL    THEN @grat3   ELSE grat3   END,
      updated_at = datetime('now')
  `).run({
    date,
    cigs:    fields.cigs    != null ? fields.cigs    : null,
    mood:    fields.mood    != null ? fields.mood    : null,
    journal: fields.journal != null ? fields.journal : null,
    grat1:   fields.grat?.[0] != null ? fields.grat[0] : null,
    grat2:   fields.grat?.[1] != null ? fields.grat[1] : null,
    grat3:   fields.grat?.[2] != null ? fields.grat[2] : null,
  });
}

export function toggleMission(date: string, missionId: string, completed: boolean) {
  const db = openDb();
  db.prepare('INSERT OR IGNORE INTO days (date) VALUES (?)').run(date);
  if (completed) {
    db.prepare('INSERT OR IGNORE INTO missions (date, mission_id) VALUES (?, ?)').run(date, missionId);
  } else {
    db.prepare('DELETE FROM missions WHERE date = ? AND mission_id = ?').run(date, missionId);
  }
}

export function toggleQuest(questId: string, completed: boolean) {
  const db = openDb();
  if (completed) {
    db.prepare('INSERT OR IGNORE INTO quests (quest_id) VALUES (?)').run(questId);
  } else {
    db.prepare('DELETE FROM quests WHERE quest_id = ?').run(questId);
  }
}

export function setSetting(key: string, value: string) {
  openDb().prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
  ).run(key, value, value);
}

export function listMedia(): MediaItem[] {
  return openDb().prepare('SELECT * FROM media ORDER BY date DESC, id DESC').all().map(r => ({
    id: Number(r.id),
    date: r.date as string,
    originalName: r.original_name as string,
    mimeType: r.mime_type as string,
    note: (r.note as string) ?? '',
    size: Number(r.size ?? 0),
    createdAt: r.created_at as string,
  }));
}

export function insertMedia(fields: {
  date: string; filename: string; originalName: string;
  mimeType: string; note: string; size: number;
}): number {
  const res = openDb().prepare(`
    INSERT INTO media (date, filename, original_name, mime_type, note, size)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(fields.date, fields.filename, fields.originalName, fields.mimeType, fields.note, fields.size);
  return Number(res.lastInsertRowid);
}

export function getMediaRow(id: number) {
  const row = openDb().prepare('SELECT filename, mime_type, original_name FROM media WHERE id = ?').get(id);
  if (!row) return undefined;
  return { filename: row.filename as string, mime_type: row.mime_type as string, original_name: row.original_name as string };
}

export function deleteMedia(id: number): string | undefined {
  const db = openDb();
  const row = db.prepare('SELECT filename FROM media WHERE id = ?').get(id);
  if (!row) return undefined;
  db.prepare('DELETE FROM media WHERE id = ?').run(id);
  return row.filename as string;
}

export function resetAll() {
  const db = openDb();
  db.exec('DELETE FROM days; DELETE FROM missions; DELETE FROM quests; DELETE FROM settings;');
}

export default openDb;
