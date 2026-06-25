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

const IcFlame = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2c0 0-5.5 4.5-5.5 9a5.5 5.5 0 0 0 11 0c0-2.5-1.5-5-3-6.5-.8 2-2.5 2.5-2.5 2.5S10 5 10 2z" />
  </svg>
);
const IcZap = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 2 7 11 11 11 7 18" />
  </svg>
);
const IcCheck = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="2.5" />
    <polyline points="7 10 9 12 13 8" />
  </svg>
);
const IcTarget = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="3" /><circle cx="10" cy="10" r="0.5" fill="currentColor" />
  </svg>
);
const IcList = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="14" x2="12" y2="14" />
  </svg>
);
const IcTrophy = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3h6v5a3 3 0 0 1-6 0V3z" /><path d="M4 3h3v3a1.5 1.5 0 0 1-3 0V3z" /><path d="M13 3h3v3a1.5 1.5 0 0 1-3 0V3z" />
    <line x1="10" y1="11" x2="10" y2="15" /><line x1="7" y1="17" x2="13" y2="17" />
  </svg>
);

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
  icon: React.ReactNode; title: string; badge: string;
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

  const [clock, setClock] = useState('');
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
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
        <div className="bento-date">
          {todayLabel}
          {clock && <span className="bento-clock">{clock}</span>}
        </div>
      </div>

      {/* 4 widgets — stagger cascade Apple */}
      <div className="metrics-grid">
        <div className="widget reveal">
          <div className="widget-cat" style={{ color: 'var(--tide)' }}><IcFlame /> Sans clope</div>
          <div className="widget-val">{streak}</div>
          <div className="widget-unit">jours consécutifs</div>
        </div>
        <div className="widget reveal reveal-d1">
          <div className="widget-cat" style={{ color: 'var(--dawn)' }}><IcZap /> Niveau</div>
          <div className="widget-val">{level}</div>
          <div className="widget-unit">{levelTitle}</div>
          <div className="widget-sub">{xp} XP · Niv.{level + 1} dans {XP_PER_LEVEL - xpInLevel} XP</div>
          <div className="widget-bar">
            <div className="widget-bar-fill" style={{ width: `${xpPct}%`, background: 'var(--dawn)' }} />
          </div>
        </div>
        <div className="widget reveal reveal-d2">
          <div className="widget-cat" style={{ color: 'var(--dawn)' }}><IcCheck /> Missions</div>
          <div className="widget-val">
            {mDone}<span className="widget-val-of">/{mTotal}</span>
          </div>
          <div className="widget-unit">aujourd&apos;hui</div>
          <div className="widget-bar">
            <div className="widget-bar-fill" style={{ width: `${(mDone / mTotal) * 100}%`, background: 'var(--dawn)' }} />
          </div>
        </div>
        <div className="widget reveal reveal-d3">
          <div className="widget-cat" style={{ color: 'var(--dawn)' }}><IcTarget /> Plan 3 ans</div>
          <div className="widget-val">{planPct}</div>
          <div className="widget-unit">vers l&apos;Ironman</div>
          <div className="widget-bar">
            <div className="widget-bar-fill" style={{ width: `${planWidth}%`, background: 'var(--dawn)' }} />
          </div>
          <div className="widget-sub" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {(xp / XP_PLAN_TARGET * 100).toFixed(2)} %
          </div>
        </div>
      </div>

      <div className="reveal">
        <Affirmation affIdx={state.affIdx} onNext={nextAff} />
      </div>

      <div className="reveal">
        <Accord
          icon={<IcList />}
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
          icon={<IcTrophy />}
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
