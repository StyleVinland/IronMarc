'use client';
import { useState, useCallback } from 'react';
import type { AppState, MindData } from '@/types';
import { ensureDay, todayStr } from '@/lib/compute';
import MentalSpace from './MentalSpace';

export default function MentalClient({ initialState }: { initialState: AppState }) {
  const [state, setState] = useState<AppState>(() => ensureDay(initialState, todayStr()));

  const today = todayStr();
  const todayData = state.days[today] ?? {
    date: today, cigs: 0,
    mind: { mood: null, journal: '', grat: ['', '', ''] },
    missions: {},
  };

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
    if (field === 'mood') {
      fetch(`/api/days/${today}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: value }),
      });
    }
  }, [today]);

  const flushMind = useCallback((mind: MindData) => {
    fetch(`/api/days/${today}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journal: mind.journal, grat: mind.grat }),
    });
  }, [today]);

  const handleMindWithFlush = useCallback((field: keyof MindData, value: MindData[keyof MindData]) => {
    handleMind(field, value);
    if (field === 'journal' || field === 'grat') {
      const next = { ...todayData.mind, [field]: value };
      flushMind(next);
    }
  }, [handleMind, flushMind, todayData.mind]);

  return (
    <>
      <div className="page-title-block">
        <h1>Mental</h1>
        <p>Ton espace pour faire le point — rien n&apos;est jugé, rien ne part ailleurs</p>
      </div>
      <MentalSpace mind={todayData.mind} days={state.days} onChange={handleMindWithFlush} />
    </>
  );
}
