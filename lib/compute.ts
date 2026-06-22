import type { AppState } from '@/types';
import { DAILY, DAILY_BONUS, QUESTS, LEVELS, XP_PER_LEVEL } from './constants';

export function computeXP(state: AppState): number {
  let xp = 0;
  for (const d of Object.values(state.days)) {
    DAILY.forEach(t => { if (d.missions[t.id]) xp += t.xp; });
    if (DAILY.every(t => d.missions[t.id])) xp += DAILY_BONUS;
  }
  QUESTS.forEach(q => { if (state.quests[q.id]) xp += q.xp; });
  return xp;
}

export function computeLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function computeLevelTitle(level: number): string {
  return LEVELS[Math.min(level - 1, LEVELS.length - 1)];
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
