'use client';
import { useState, useCallback, useMemo } from 'react';
import type { AppState } from '@/types';
import { ensureDay, todayStr } from '@/lib/compute';
import { SESSIONS, PHASES, getCurrentWeek, getCurrentPhase, PROGRAM_START, DATE_OVERRIDES } from '@/lib/program';
import type { WeekDay, ProgramPhase } from '@/lib/program';
import MissionList from './MissionList';
import QuestList from './QuestList';

const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const DAY_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const DAY_MAP: Record<number, WeekDay> = { 0: 'dim', 1: 'lun', 2: 'mar', 3: 'mer', 4: 'jeu', 5: 'ven', 6: 'sam' };

function weekNum(date: Date): number {
  const start = new Date(PROGRAM_START);
  const diff = date.getTime() - start.getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
}

function phaseForDate(date: Date): ProgramPhase {
  const w = weekNum(date);
  return PHASES.find(p => w >= p.weeks[0] && w <= p.weeks[1]) ?? PHASES[PHASES.length - 1];
}

function sessionIdForDate(date: Date): string {
  const ds = dateStr(date);
  if (DATE_OVERRIDES[ds]) return DATE_OVERRIDES[ds];
  if (weekNum(date) < 1) return 'rest';
  const phase = phaseForDate(date);
  return phase.template[DAY_MAP[date.getDay()]] ?? 'rest';
}

function mondayOfWeek(offset: number): Date {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7;
  const d = new Date(now);
  d.setDate(d.getDate() - dow + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateStr(d: Date): string {
  return d.toLocaleDateString('fr-CA');
}

function fmtWeekHeader(monday: Date): string {
  const sun = new Date(monday);
  sun.setDate(sun.getDate() + 6);
  if (monday.getMonth() === sun.getMonth()) {
    return `${monday.getDate()} – ${sun.getDate()} ${MONTHS_FR[sun.getMonth()]} ${sun.getFullYear()}`;
  }
  return `${monday.getDate()} ${MONTHS_FR[monday.getMonth()]} – ${sun.getDate()} ${MONTHS_FR[sun.getMonth()]} ${sun.getFullYear()}`;
}

function fmtDayLong(d: Date): string {
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]}`;
}

export default function EntrainementClient({ initialState }: { initialState: AppState }) {
  const [state, setState] = useState<AppState>(() => ensureDay(initialState, todayStr()));
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(() => todayStr());
  const [pain, setPain] = useState({ aine: 0, tibia: 0 });

  const today = todayStr();
  const todayData = state.days[today] ?? {
    date: today, cigs: 0,
    mind: { mood: null, journal: '', grat: ['', '', ''] },
    missions: {},
  };

  const currentWeek = getCurrentWeek();
  const currentPhase = getCurrentPhase(currentWeek);

  const monday = useMemo(() => mondayOfWeek(weekOffset), [weekOffset]);

  const weekDates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    }),
  [monday]);

  const displayedWeek = weekNum(monday);
  const displayedPhase = phaseForDate(monday);

  const selDateObj = new Date(selectedDate + 'T12:00:00');
  const selSessionId = sessionIdForDate(selDateObj);
  const selSession = SESSIONS[selSessionId];
  const isSelToday = selectedDate === today;

  const painHigh = pain.aine > 4 || pain.tibia > 4;

  function handleWeekChange(delta: number) {
    const newOffset = weekOffset + delta;
    setWeekOffset(newOffset);
    const mon = mondayOfWeek(newOffset);
    const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
    const todayD = new Date(today + 'T12:00:00');
    setSelectedDate(todayD >= mon && todayD <= sun ? today : dateStr(mon));
  }

  const handleMission = useCallback((id: string, completed: boolean) => {
    setState(prev => {
      const s = ensureDay(prev, today);
      return { ...s, days: { ...s.days, [today]: { ...s.days[today], missions: { ...s.days[today].missions, [id]: completed } } } };
    });
    fetch(`/api/days/${today}/missions/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
  }, [today]);

  const handleQuest = useCallback((id: string, completed: boolean) => {
    setState(prev => ({ ...prev, quests: { ...prev.quests, [id]: completed } }));
    fetch(`/api/quests/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
  }, []);

  return (
    <>
      <div className="page-title-block">
        <h1>Entraînement</h1>
        <p>Programme complet pubalgie + périostites → Ironman en 2 ans</p>
      </div>

      {/* ── PHASE ACTUELLE ── */}
      <div className="prog-phase-banner">
        <div className="prog-phase-left">
          <div className="prog-phase-week">Semaine {currentWeek}</div>
          <div className="prog-phase-label">{currentPhase.label}</div>
          <div className="prog-phase-tagline">{currentPhase.tagline}</div>
        </div>
        <div className="prog-phase-focus">
          {currentPhase.focus.map((f, i) => <span key={i} className="prog-focus-tag">{f}</span>)}
        </div>
      </div>

      {/* ── CALENDRIER PAR DATES ── */}
      <section className="prog-week-section">
        <div className="prog-week-nav">
          <button className="btn-ghost prog-nav-btn" onClick={() => handleWeekChange(-1)}>← Précédente</button>
          <span className="prog-week-title">
            {displayedWeek > 0 ? <><strong>S{displayedWeek}</strong> · </> : null}
            {fmtWeekHeader(monday)}
          </span>
          <button className="btn-ghost prog-nav-btn" onClick={() => handleWeekChange(1)}>Suivante →</button>
        </div>

        <div className="prog-week-grid">
          {weekDates.map(date => {
            const ds = dateStr(date);
            const sid = sessionIdForDate(date);
            const sess = SESSIONS[sid];
            const isToday = ds === today;
            const isPast = ds < today;
            const isSel = ds === selectedDate;
            return (
              <button
                key={ds}
                className={`prog-day-cell${isToday ? ' today' : ''}${isSel ? ' open' : ''}${isPast && !isToday ? ' past' : ''}`}
                style={{ '--session-color': sess.color } as React.CSSProperties}
                onClick={() => setSelectedDate(ds)}
              >
                <span className="prog-day-name">{DAY_SHORT[date.getDay()]}</span>
                <span className="prog-day-date-num">{date.getDate()}/{date.getMonth() + 1}</span>
                <span className="prog-day-session">{sess.short}</span>
                <span className="prog-day-dur">{sess.duration || '—'}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── SÉANCE DU JOUR SÉLECTIONNÉ ── */}
      <section>
        <div className="shead">
          <h2>{isSelToday ? "Aujourd'hui" : fmtDayLong(selDateObj)}</h2>
          <span className="hint" style={{ color: selSession.color }}>{selSession.label}</span>
        </div>

        {isSelToday && painHigh && (
          <div className="prog-pain-alert">
            Douleur &gt; 4/10 — repose-toi aujourd&apos;hui. Ce n&apos;est pas un échec, c&apos;est de l&apos;intelligence.
          </div>
        )}

        {isSelToday && selSession.painCheck && !painHigh && (
          <div className="prog-pain-check">
            <div className="prog-pain-title">Check douleur avant de commencer</div>
            {(['aine', 'tibia'] as const).map(zone => (
              <div key={zone} className="prog-pain-row">
                <label className="prog-pain-label">{zone === 'aine' ? 'Aine / pubis' : 'Tibia'}</label>
                <div className="prog-pain-scale">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                    <button key={v}
                      className={`prog-pain-btn${pain[zone] === v ? ' sel' : ''}${v > 4 ? ' danger' : ''}`}
                      onClick={() => setPain(p => ({ ...p, [zone]: v }))}>{v}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className="prog-pain-rule">≤ 4/10 = vert → faire la séance · &gt; 4/10 = stop · Courbatures légères = normales</div>
          </div>
        )}

        <div className="prog-session-card" style={{ '--session-color': selSession.color } as React.CSSProperties}>
          <div className="prog-session-header">
            <div>
              <div className="prog-session-label">{selSession.label}</div>
              <div className="prog-session-desc">{selSession.desc}</div>
            </div>
            {selSession.duration && <div className="prog-session-dur">{selSession.duration}</div>}
          </div>
          {selSession.exercises.length > 0 && (
            <div className="prog-exercise-list">
              {selSession.exercises.map((ex, i) => (
                <div key={i} className={`prog-exercise${ex.required ? ' required' : ''}${ex.warning ? ' warning' : ''}`}>
                  <div className="prog-ex-name">{ex.name}</div>
                  <div className="prog-ex-detail">{ex.detail}</div>
                  {ex.sets && <div className="prog-ex-sets">{ex.sets}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {displayedPhase.notes.length > 0 && (
          <div className="prog-notes">
            {displayedPhase.notes.map((n, i) => <div key={i} className="prog-note">— {n}</div>)}
          </div>
        )}
      </section>

      {/* ── FEUILLE DE ROUTE ── */}
      <section>
        <div className="shead"><h2>Feuille de route 2 ans</h2><span className="hint">6 phases</span></div>
        <div className="prog-roadmap">
          {PHASES.map(p => (
            <div key={p.id} className={`prog-roadmap-phase${p.id === currentPhase.id ? ' current' : ''}`}>
              <div className="prog-roadmap-label">
                <span className="prog-roadmap-weeks">S{p.weeks[0]}–{p.weeks[1]}</span>
                <span className="prog-roadmap-name">{p.label}</span>
              </div>
              <div className="prog-roadmap-tagline">{p.tagline}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSIONS + QUÊTES ── */}
      <div className="two-col" style={{ marginTop: 4 }}>
        <MissionList missions={todayData.missions} onToggle={handleMission} date={today} />
        <QuestList quests={state.quests} onToggle={handleQuest} />
      </div>
    </>
  );
}
