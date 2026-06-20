'use client';
import { useState, useCallback } from 'react';
import type { AppState } from '@/types';
import { computeStreak, ensureDay, todayStr } from '@/lib/compute';
import CigCounter from './CigCounter';
import SmokeCalendar from './SmokeCalendar';
import ProgressCharts from './ProgressCharts';

export default function TabacClient({ initialState }: { initialState: AppState }) {
  const [state, setState] = useState<AppState>(() => ensureDay(initialState, todayStr()));

  const today = todayStr();
  const todayData = state.days[today] ?? {
    date: today, cigs: 0,
    mind: { mood: null, journal: '', grat: ['', '', ''] },
    missions: {},
  };
  const streak = computeStreak(state);

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

  return (
    <>
      <div className="page-title-block">
        <h1>Tabac</h1>
        <p>Sans jugement — juste de la clarté sur où tu en es</p>
      </div>
      <div className="two-col">
        <CigCounter todayCigs={todayData.cigs} freeStreak={streak} onAddCig={handleAddCig} />
        <SmokeCalendar days={state.days} />
      </div>
      <ProgressCharts days={state.days} />
    </>
  );
}
