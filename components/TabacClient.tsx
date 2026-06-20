'use client';
import { useAppState } from './AppStateProvider';
import { computeStreak } from '@/lib/compute';
import CigCounter from './CigCounter';
import SmokeCalendar from './SmokeCalendar';
import ProgressCharts from './ProgressCharts';

export default function TabacClient() {
  const { state, today, addCig } = useAppState();
  const todayData = state.days[today] ?? { date: today, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} };
  const streak = computeStreak(state);

  return (
    <>
      <div className="page-title-block">
        <h1>Tabac</h1>
        <p>Sans jugement — juste de la clarté sur où tu en es</p>
      </div>
      <div className="two-col">
        <CigCounter todayCigs={todayData.cigs} freeStreak={streak} onAddCig={addCig} />
        <SmokeCalendar days={state.days} />
      </div>
      <ProgressCharts days={state.days} />
    </>
  );
}
