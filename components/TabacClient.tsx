'use client';
import { useAppState } from './AppStateProvider';
import { computeStreak } from '@/lib/compute';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import CigCounter from './CigCounter';
import SmokeCalendar from './SmokeCalendar';
import ProgressCharts from './ProgressCharts';

export default function TabacClient() {
  useScrollReveal();
  const { state, today, addCig, removeCig } = useAppState();
  const todayData = state.days[today] ?? { date: today, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} };
  const streak = computeStreak(state);

  return (
    <>
      <div className="page-title-block reveal">
        <h1>Tabac</h1>
        <p>Sans jugement — juste de la clarté sur où tu en es</p>
      </div>
      <div className="two-col reveal reveal-d1">
        <CigCounter
          todayCigs={todayData.cigs}
          freeStreak={streak}
          onAddCig={addCig}
          onRemoveCig={removeCig}
        />
        <SmokeCalendar days={state.days} />
      </div>
      <div className="reveal reveal-d2">
        <ProgressCharts days={state.days} />
      </div>
    </>
  );
}
