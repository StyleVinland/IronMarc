'use client';
import { useState, useCallback } from 'react';
import type { AppState } from '@/types';
import {
  computeXP, computeLevel, computeLevelTitle,
  computeStreak, computeCheckpointPct, ensureDay, todayStr,
} from '@/lib/compute';
import Hero from './Hero';
import StatsStrip from './StatsStrip';
import Affirmation from './Affirmation';
import ProgressCharts from './ProgressCharts';
import MissionList from './MissionList';

export default function DashboardClient({ initialState }: { initialState: AppState }) {
  const [state, setState] = useState<AppState>(() => ensureDay(initialState, todayStr()));

  const today = todayStr();
  const todayData = state.days[today] ?? {
    date: today, cigs: 0,
    mind: { mood: null, journal: '', grat: ['', '', ''] },
    missions: {},
  };

  const xp = computeXP(state);
  const level = computeLevel(xp);
  const levelTitle = computeLevelTitle(level);
  const streak = computeStreak(state);

  const handleAff = useCallback((idx: number) => {
    setState(prev => ({ ...prev, affIdx: idx }));
    fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ affIdx: String(idx) }),
    });
  }, []);

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

  return (
    <div className="dash-grid">
      <div className="dash-main">
        <Hero checkpointPct={computeCheckpointPct(state)} />
        <StatsStrip xp={xp} level={level} levelTitle={levelTitle} freeStreak={streak} />
        <MissionList missions={todayData.missions} onToggle={handleMission} date={today} />
      </div>
      <div className="dash-aside">
        <Affirmation affIdx={state.affIdx} onNext={handleAff} />
        <ProgressCharts days={state.days} />
      </div>
    </div>
  );
}
