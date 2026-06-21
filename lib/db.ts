import path from 'path';
import fs from 'fs';
import type { AppState, DayData, MediaItem, DebriefData } from '@/types';

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
  // eslint-disable-next-line no-var
  var _dbMigrated: boolean | undefined;
}

function migrate(db: NodeSqliteDb) {
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
    CREATE TABLE IF NOT EXISTS debriefs (
      date       TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'done',
      pain_aine  INTEGER NOT NULL DEFAULT 0,
      pain_tibia INTEGER NOT NULL DEFAULT 0,
      energy     INTEGER NOT NULL DEFAULT 3,
      difficulty INTEGER NOT NULL DEFAULT 3,
      notes      TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS session_completions (
      date         TEXT PRIMARY KEY,
      session_id   TEXT NOT NULL,
      xp           INTEGER NOT NULL DEFAULT 0,
      pain_aine    INTEGER NOT NULL DEFAULT 0,
      pain_tibia   INTEGER NOT NULL DEFAULT 0,
      validated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function openDb(): NodeSqliteDb {
  if (!global._db) {
    const dir = path.join(process.cwd(), 'storage');
    const mediaDir = path.join(dir, 'media');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

    const db = new DatabaseSync(path.join(dir, 'tracker.db'));
    db.exec('PRAGMA journal_mode = WAL;');
    global._db = db;
  }

  // Migrations run once per process, even après un hot-reload qui garde _db en cache
  if (!global._dbMigrated) {
    migrate(global._db);
    global._dbMigrated = true;
  }

  return global._db;
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

export function saveDebrief(date: string, data: Omit<DebriefData, 'date' | 'created_at'>) {
  openDb().prepare(`
    INSERT INTO debriefs (date, session_id, status, pain_aine, pain_tibia, energy, difficulty, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      session_id = excluded.session_id,
      status     = excluded.status,
      pain_aine  = excluded.pain_aine,
      pain_tibia = excluded.pain_tibia,
      energy     = excluded.energy,
      difficulty = excluded.difficulty,
      notes      = excluded.notes
  `).run(date, data.session_id, data.status, data.pain_aine, data.pain_tibia, data.energy, data.difficulty, data.notes);
}

export function getDebrief(date: string): DebriefData | undefined {
  const row = openDb().prepare('SELECT * FROM debriefs WHERE date = ?').get(date);
  if (!row) return undefined;
  return {
    date: row.date as string,
    session_id: row.session_id as string,
    status: row.status as string,
    pain_aine: Number(row.pain_aine),
    pain_tibia: Number(row.pain_tibia),
    energy: Number(row.energy),
    difficulty: Number(row.difficulty),
    notes: (row.notes as string) ?? '',
    created_at: row.created_at as string,
  };
}

export interface SessionCompletion {
  date: string; session_id: string; xp: number;
  pain_aine: number; pain_tibia: number; validated_at: string;
}

export function saveSessionCompletion(d: Omit<SessionCompletion, 'validated_at'>) {
  openDb().prepare(`
    INSERT INTO session_completions (date, session_id, xp, pain_aine, pain_tibia)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      session_id   = excluded.session_id,
      xp           = excluded.xp,
      pain_aine    = excluded.pain_aine,
      pain_tibia   = excluded.pain_tibia,
      validated_at = datetime('now')
  `).run(d.date, d.session_id, d.xp, d.pain_aine, d.pain_tibia);
}

export function getSessionCompletion(date: string): SessionCompletion | undefined {
  const r = openDb().prepare('SELECT * FROM session_completions WHERE date = ?').get(date);
  if (!r) return undefined;
  return { date: r.date as string, session_id: r.session_id as string, xp: Number(r.xp), pain_aine: Number(r.pain_aine), pain_tibia: Number(r.pain_tibia), validated_at: r.validated_at as string };
}

export function getAllSessionCompletions(): SessionCompletion[] {
  return openDb().prepare('SELECT * FROM session_completions ORDER BY date DESC').all().map(r => ({
    date: r.date as string, session_id: r.session_id as string, xp: Number(r.xp),
    pain_aine: Number(r.pain_aine), pain_tibia: Number(r.pain_tibia), validated_at: r.validated_at as string,
  }));
}

export function getAllDebriefs(): DebriefData[] {
  return openDb().prepare('SELECT * FROM debriefs ORDER BY date DESC').all().map(r => ({
    date: r.date as string,
    session_id: r.session_id as string,
    status: r.status as string,
    pain_aine: Number(r.pain_aine),
    pain_tibia: Number(r.pain_tibia),
    energy: Number(r.energy),
    difficulty: Number(r.difficulty),
    notes: (r.notes as string) ?? '',
    created_at: r.created_at as string,
  }));
}

export function getLastDebriefBySession(sessionId: string, beforeDate: string): DebriefData | undefined {
  const row = openDb().prepare(
    'SELECT * FROM debriefs WHERE session_id = ? AND date < ? ORDER BY date DESC LIMIT 1'
  ).get(sessionId, beforeDate);
  if (!row) return undefined;
  return {
    date: row.date as string,
    session_id: row.session_id as string,
    status: row.status as string,
    pain_aine: Number(row.pain_aine),
    pain_tibia: Number(row.pain_tibia),
    energy: Number(row.energy),
    difficulty: Number(row.difficulty),
    notes: (row.notes as string) ?? '',
    created_at: row.created_at as string,
  };
}

export function resetAll() {
  const db = openDb();
  db.exec('DELETE FROM days; DELETE FROM missions; DELETE FROM quests; DELETE FROM settings;');
}

/* ── STRAVA TOKENS ────────────────────────────────────────────────── */
export interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;   // unix timestamp seconds
  athleteId: number;
  athleteName: string;
  athleteAvatar: string;
}

export function getStravaTokens(): StravaTokens | null {
  const db = openDb();
  const get = (k: string) => (db.prepare("SELECT value FROM settings WHERE key = ?").get(k) as { value: string } | undefined)?.value;
  const accessToken = get('strava_access_token');
  const refreshToken = get('strava_refresh_token');
  const expiresAt = get('strava_expires_at');
  const athleteId = get('strava_athlete_id');
  const athleteName = get('strava_athlete_name');
  const athleteAvatar = get('strava_athlete_avatar');
  if (!accessToken || !refreshToken || !expiresAt || !athleteId) return null;
  return {
    accessToken,
    refreshToken,
    expiresAt: Number(expiresAt),
    athleteId: Number(athleteId),
    athleteName: athleteName ?? '',
    athleteAvatar: athleteAvatar ?? '',
  };
}

export function saveStravaTokens(t: StravaTokens) {
  const set = (k: string, v: string) => setSetting(k, v);
  set('strava_access_token',  t.accessToken);
  set('strava_refresh_token', t.refreshToken);
  set('strava_expires_at',    String(t.expiresAt));
  set('strava_athlete_id',    String(t.athleteId));
  set('strava_athlete_name',  t.athleteName);
  set('strava_athlete_avatar', t.athleteAvatar);
}

export function clearStravaTokens() {
  const db = openDb();
  const keys = ['strava_access_token','strava_refresh_token','strava_expires_at','strava_athlete_id','strava_athlete_name','strava_athlete_avatar'];
  const del = db.prepare("DELETE FROM settings WHERE key = ?");
  for (const k of keys) del.run(k);
}

export default openDb;
