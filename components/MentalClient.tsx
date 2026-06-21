'use client';
import { useAppState } from './AppStateProvider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MentalSpace from './MentalSpace';

export default function MentalClient() {
  useScrollReveal();
  const { state, today, updateMind } = useAppState();
  const todayData = state.days[today] ?? { date: today, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} };

  return (
    <>
      <div className="page-title-block reveal">
        <h1>Mental</h1>
        <p>Ton espace pour faire le point — rien n&apos;est jugé, rien ne part ailleurs</p>
      </div>
      <div className="reveal reveal-d1">
        <MentalSpace mind={todayData.mind} days={state.days} onChange={updateMind} />
      </div>
    </>
  );
}
