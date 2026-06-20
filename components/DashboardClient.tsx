'use client';
import { useAppState } from './AppStateProvider';
import { computeXP, computeLevel, computeLevelTitle, computeStreak, computeCheckpointPct } from '@/lib/compute';
import Hero from './Hero';
import StatsStrip from './StatsStrip';
import Affirmation from './Affirmation';
import ProgressCharts from './ProgressCharts';
import MissionList from './MissionList';
import QuestList from './QuestList';

export default function DashboardClient() {
  const { state, today, toggleMission, toggleQuest, nextAff } = useAppState();
  const todayData = state.days[today] ?? { date: today, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} };

  const xp = computeXP(state);
  const level = computeLevel(xp);
  const levelTitle = computeLevelTitle(level);
  const streak = computeStreak(state);

  return (
    <div className="dash-grid">
      <div className="dash-main">
        <Hero checkpointPct={computeCheckpointPct(state)} />
        <StatsStrip xp={xp} level={level} levelTitle={levelTitle} freeStreak={streak} />
        <MissionList missions={todayData.missions} onToggle={toggleMission} date={today} />
        <QuestList quests={state.quests} onToggle={toggleQuest} />
      </div>
      <div className="dash-aside">
        <Affirmation affIdx={state.affIdx} onNext={nextAff} />
        <ProgressCharts days={state.days} />
      </div>
    </div>
  );
}
