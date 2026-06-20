'use client';
import { useAppState } from './AppStateProvider';
import MentalSpace from './MentalSpace';

export default function MentalClient() {
  const { state, today, updateMind } = useAppState();
  const todayData = state.days[today] ?? { date: today, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} };

  return (
    <>
      <div className="page-title-block">
        <h1>Mental</h1>
        <p>Ton espace pour faire le point — rien n&apos;est jugé, rien ne part ailleurs</p>
      </div>
      <MentalSpace mind={todayData.mind} days={state.days} onChange={updateMind} />
    </>
  );
}
