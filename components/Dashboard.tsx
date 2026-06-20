'use client';
import { useState, useCallback } from 'react';
import type { AppState, MindData } from '@/types';
import { QUESTS, DAILY, LEVELS, XP_PER_LEVEL } from '@/lib/constants';
import Hero from './Hero';
import StatsStrip from './StatsStrip';
import Affirmation from './Affirmation';
import ProgressCharts from './ProgressCharts';
import SmokeCalendar from './SmokeCalendar';
import MissionList from './MissionList';
import QuestList from './QuestList';
import CigCounter from './CigCounter';
import MediaGallery from './MediaGallery';
import MentalSpace from './MentalSpace';

function todayStr() { return new Date().toLocaleDateString('fr-CA'); }

function ensureDay(state: AppState, date: string): AppState {
  if (state.days[date]) return state;
  return {
    ...state,
    days: {
      ...state.days,
      [date]: { date, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} },
    },
  };
}

function computeXP(state: AppState) {
  let xp = 0;
  for (const d of Object.values(state.days)) {
    DAILY.forEach(t => { if (d.missions[t.id]) xp += t.xp; });
  }
  QUESTS.forEach(q => { if (state.quests[q.id]) xp += q.xp; });
  return xp;
}

function computeStreak(state: AppState) {
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

function checkpointPct(state: AppState) {
  const cps = QUESTS.filter(q => q.cp);
  const done = cps.filter(q => state.quests[q.id]).length;
  return Math.round((done / cps.length) * 100);
}

export default function Dashboard({ initialState }: { initialState: AppState }) {
  const [state, setState] = useState<AppState>(() => ensureDay(initialState, todayStr()));

  const today = todayStr();
  const todayData = state.days[today] ?? { date: today, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} };
  const xp = computeXP(state);
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const levelTitle = LEVELS[Math.min(level - 1, LEVELS.length - 1)];
  const streak = computeStreak(state);

  // ── Affirmation ──────────────────────────────────────────────
  const handleAff = useCallback((idx: number) => {
    setState(prev => ({ ...prev, affIdx: idx }));
    fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ affIdx: String(idx) }) });
  }, []);

  // ── Missions ─────────────────────────────────────────────────
  const handleMission = useCallback((id: string, completed: boolean) => {
    setState(prev => {
      const s = ensureDay(prev, today);
      return {
        ...s,
        days: {
          ...s.days,
          [today]: {
            ...s.days[today],
            missions: { ...s.days[today].missions, [id]: completed },
          },
        },
      };
    });
    fetch(`/api/days/${today}/missions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
  }, [today]);

  // ── Quests ───────────────────────────────────────────────────
  const handleQuest = useCallback((id: string, completed: boolean) => {
    setState(prev => ({ ...prev, quests: { ...prev.quests, [id]: completed } }));
    fetch(`/api/quests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
  }, []);

  // ── Cig counter ──────────────────────────────────────────────
  const handleAddCig = useCallback(() => {
    const next = (todayData.cigs ?? 0) + 1;
    setState(prev => {
      const s = ensureDay(prev, today);
      return { ...s, days: { ...s.days, [today]: { ...s.days[today], cigs: next } } };
    });
    fetch(`/api/days/${today}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cigs: next }),
    });
  }, [today, todayData.cigs]);

  // ── Mental space ─────────────────────────────────────────────
  const handleMind = useCallback((field: keyof MindData, value: MindData[keyof MindData]) => {
    setState(prev => {
      const s = ensureDay(prev, today);
      return {
        ...s,
        days: {
          ...s.days,
          [today]: { ...s.days[today], mind: { ...s.days[today].mind, [field]: value } },
        },
      };
    });
    // Debounced flush to API is handled by a useEffect (below), but for mood we flush immediately
    if (field === 'mood') {
      fetch(`/api/days/${today}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: value }),
      });
    }
  }, [today]);

  // Flush journal+grat on blur — we rely on MentalSpace textarea onChange → here → debounced
  // For simplicity we flush on every change (fine for personal app)
  const flushMind = useCallback((mind: MindData) => {
    fetch(`/api/days/${today}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journal: mind.journal, grat: mind.grat }),
    });
  }, [today]);

  // Wrap onChange so journal/grat changes also persist
  const handleMindWithFlush = useCallback((field: keyof MindData, value: MindData[keyof MindData]) => {
    handleMind(field, value);
    if (field === 'journal' || field === 'grat') {
      const next = { ...todayData.mind, [field]: value };
      flushMind(next);
    }
  }, [handleMind, flushMind, todayData.mind]);

  // ── Reset ────────────────────────────────────────────────────
  async function handleReset() {
    if (!confirm('Tout remettre à zéro ? Cette action efface toute ta progression.')) return;
    await fetch('/api/state', { method: 'DELETE' }).catch(() => {});
    window.location.reload();
  }

  return (
    <>
      <Hero checkpointPct={checkpointPct(state)} />
      <StatsStrip xp={xp} level={level} levelTitle={levelTitle} freeStreak={streak} />
      <Affirmation affIdx={state.affIdx} onNext={handleAff} />
      <ProgressCharts days={state.days} />
      <SmokeCalendar days={state.days} />
      <MissionList missions={todayData.missions} onToggle={handleMission} date={today} />
      <QuestList quests={state.quests} onToggle={handleQuest} />
      <CigCounter todayCigs={todayData.cigs} freeStreak={streak} onAddCig={handleAddCig} />
      <MediaGallery />
      <MentalSpace mind={todayData.mind} days={state.days} onChange={handleMindWithFlush} />

      <div className="foot">
        Tes données restent sur ce serveur, rien que pour toi.<br />
        <button className="btn-reset" onClick={handleReset}>Tout remettre à zéro</button>
      </div>
    </>
  );
}
