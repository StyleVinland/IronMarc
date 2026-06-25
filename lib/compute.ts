import type { AppState } from '@/types';
import { DAILY, DAILY_BONUS, QUESTS, LEVELS, BASE_XP_LEVEL } from './constants';

export function computeXP(state: AppState): number {
  let xp = 0;
  for (const d of Object.values(state.days)) {
    DAILY.forEach(t => { if (d.missions[t.id]) xp += t.xp; });
    if (DAILY.every(t => d.missions[t.id])) xp += DAILY_BONUS;
  }
  QUESTS.forEach(q => { if (state.quests[q.id]) xp += q.xp; });
  return xp;
}

// XP cumulés pour atteindre le DÉBUT du level N (level 1 = 0 XP)
export function xpToReachLevel(n: number): number {
  return BASE_XP_LEVEL * (n - 1) * n / 2;
}

// Level courant depuis XP total (formule quadratique)
export function computeLevel(xp: number): number {
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + 8 * xp / BASE_XP_LEVEL)) / 2));
}

// XP gagnés DANS le level courant (0 … xpForLevel-1)
export function computeXpInLevel(xp: number): number {
  return xp - xpToReachLevel(computeLevel(xp));
}

// Coût total du level courant (XP pour passer du level N au level N+1)
export function computeXpForLevel(level: number): number {
  return BASE_XP_LEVEL * level;
}

export function computeLevelTitle(level: number): string {
  const idx = Math.min(Math.floor((level - 1) / 5), LEVELS.length - 1);
  return LEVELS[idx];
}

// Progression temporelle vers l'Ironman (0-100, 2 décimales)
const IRONMAN_START = new Date('2026-06-21').getTime(); // jour réel de départ (XP = 0)
const IRONMAN_DATE  = new Date('2029-06-30').getTime();
export function computeIronmanPct(): number {
  const elapsed = Date.now() - IRONMAN_START;
  const total   = IRONMAN_DATE - IRONMAN_START;
  return Math.min(100, Math.max(0, elapsed / total * 100));
}

export function computeStreak(state: AppState): number {
  let n = 0;
  const dt = new Date();
  for (let i = 0; i < 400; i++) {
    const key = dt.toLocaleDateString('fr-CA');
    const rec = state.days[key];
    if (i === 0) { if (rec && rec.cigs > 0) break; n++; }
    else { if (!rec) break; if (rec.cigs > 0) break; n++; }
    dt.setDate(dt.getDate() - 1);
  }
  return n;
}

export function computeCheckpointPct(state: AppState): number {
  const cps = QUESTS.filter(q => q.cp);
  const done = cps.filter(q => state.quests[q.id]).length;
  return Math.round((done / cps.length) * 100);
}

export function todayStr(): string {
  return new Date().toLocaleDateString('fr-CA');
}

export function ensureDay(state: AppState, date: string): AppState {
  if (state.days[date]) return state;
  return {
    ...state,
    days: {
      ...state.days,
      [date]: { date, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''], mindDone: false }, missions: {} },
    },
  };
}
