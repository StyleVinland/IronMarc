'use client';
import { useState, useEffect } from 'react';
import { useAppState } from './AppStateProvider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { computeXP, computeLevel, computeLevelTitle, computeStreak, computeCheckpointPct } from '@/lib/compute';
import { DAILY, QUESTS, XP_PER_LEVEL } from '@/lib/constants';
import { XP_PLAN_TARGET, fmtPct } from './Nav';
import HeroLanding from './HeroLanding';
import Affirmation from './Affirmation';
import ProgressCharts from './ProgressCharts';
import MissionList from './MissionList';
import QuestList from './QuestList';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ transition: 'transform .3s var(--ease-apple)', transform: open ? 'rotate(180deg)' : 'none' }}>
      <polyline points="5 8 10 13 15 8" />
    </svg>
  );
}

interface AccordProps {
  icon: string; title: string; badge: string;
  open: boolean; onToggle: () => void; children: React.ReactNode;
}

function Accord({ icon, title, badge, open, onToggle, children }: AccordProps) {
  return (
    <div className={`accord${open ? ' open' : ''}`}>
      <button className="accord-head" onClick={onToggle}>
        <span className="accord-icon">{icon}</span>
        <span className="accord-title">{title}</span>
        <span className="accord-badge">{badge}</span>
        <span className="accord-chevron"><ChevronIcon open={open} /></span>
      </button>
      {/* Smooth height via CSS grid trick — toujours rendu, jamais conditionnel */}
      <div className="accord-anim">
        <div className="accord-body">{children}</div>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  useScrollReveal();

  const { state, today, toggleMission, toggleQuest, nextAff } = useAppState();
  const todayData = state.days[today] ?? { date: today, cigs: 0, mind: { mood: null, journal: '', grat: ['', '', ''] }, missions: {} };

  const [sessionXp, setSessionXp] = useState(0);
  useEffect(() => {
    function load() {
      fetch('/api/xp', { cache: 'no-store' }).then(r => r.json()).then(d => setSessionXp(d.total ?? 0)).catch(() => {});
    }
    load();
    window.addEventListener('session-validated', load);
    return () => window.removeEventListener('session-validated', load);
  }, []);

  const habitXp    = computeXP(state);
  const xp         = habitXp + sessionXp;
  const level      = computeLevel(xp);
  const levelTitle = computeLevelTitle(level);
  const streak     = computeStreak(state);
  const phasePct   = computeCheckpointPct(state);
  const planPct    = fmtPct(xp);
  const planWidth  = Math.min(100, xp / XP_PLAN_TARGET * 100);
  const xpInLevel  = xp % XP_PER_LEVEL;
  const xpPct      = Math.round((xpInLevel / XP_PER_LEVEL) * 100);
  const mDone      = DAILY.filter(t => !!todayData.missions[t.id]).length;
  const mTotal     = DAILY.length;
  const qDone      = QUESTS.filter(q => !!state.quests[q.id]).length;
  const qTotal     = QUESTS.length;
  const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const [missionsOpen, setMissionsOpen] = useState(true);
  const [questsOpen,   setQuestsOpen]   = useState(false);

  return (
    <>
      <HeroLanding checkpointPct={phasePct} streak={streak} xp={xp} />

    <div className="bento">

      {/* En-tête journalier */}
      <div className="bento-header">
        <div className="bento-title">Aujourd&apos;hui</div>
        <div className="bento-date">{todayLabel}</div>
      </div>

      {/* 4 widgets — stagger cascade Apple */}
      <div className="metrics-grid">
        <div className="widget reveal">
          <div className="widget-cat" style={{ color: '#34C759' }}>🔥 Sans clope</div>
          <div className="widget-val">{streak}</div>
          <div className="widget-unit">jours consécutifs</div>
        </div>
        <div className="widget reveal reveal-d1">
          <div className="widget-cat" style={{ color: '#007AFF' }}>⚡ Niveau</div>
          <div className="widget-val">{level}</div>
          <div className="widget-unit">{levelTitle}</div>
          <div className="widget-sub">{xp} XP · Niv.{level + 1} dans {XP_PER_LEVEL - xpInLevel} XP</div>
          <div className="widget-bar">
            <div className="widget-bar-fill" style={{ width: `${xpPct}%`, background: '#007AFF' }} />
          </div>
        </div>
        <div className="widget reveal reveal-d2">
          <div className="widget-cat" style={{ color: '#FF9500' }}>📋 Missions</div>
          <div className="widget-val">
            {mDone}<span className="widget-val-of">/{mTotal}</span>
          </div>
          <div className="widget-unit">aujourd&apos;hui</div>
          <div className="widget-bar">
            <div className="widget-bar-fill" style={{ width: `${(mDone / mTotal) * 100}%`, background: '#FF9500' }} />
          </div>
        </div>
        <div className="widget reveal reveal-d3">
          <div className="widget-cat" style={{ color: '#AF52DE' }}>🏁 Plan 3 ans</div>
          <div className="widget-val">{planPct}</div>
          <div className="widget-unit">vers l&apos;Ironman</div>
          <div className="widget-bar">
            <div className="widget-bar-fill" style={{ width: `${planWidth}%`, background: '#AF52DE' }} />
          </div>
        </div>
      </div>

      <div className="reveal">
        <Affirmation affIdx={state.affIdx} onNext={nextAff} />
      </div>

      <div className="reveal">
        <Accord
          icon="📋"
          title="Missions du jour"
          badge={`${mDone}/${mTotal}`}
          open={missionsOpen}
          onToggle={() => setMissionsOpen(o => !o)}
        >
          <MissionList missions={todayData.missions} onToggle={toggleMission} date={today} />
        </Accord>
      </div>

      <div className="reveal reveal-d1">
        <Accord
          icon="🏅"
          title="Quêtes secondaires"
          badge={`${qDone}/${qTotal}`}
          open={questsOpen}
          onToggle={() => setQuestsOpen(o => !o)}
        >
          <QuestList quests={state.quests} onToggle={toggleQuest} />
        </Accord>
      </div>

      <div className="reveal">
        <ProgressCharts days={state.days} />
      </div>

    </div>
    </>
  );
}
