'use client';
import { useState, useMemo } from 'react';
import { useAppState } from './AppStateProvider';
import { SESSIONS, PHASES, RACES, WEEK_DAYS, WEEK_DAY_LABELS, getCurrentWeek, getCurrentPhase, PROGRAM_START, DATE_OVERRIDES, computeRaceOverrides, RACE_COLORS, RACE_LABELS } from '@/lib/program';
import type { WeekDay, ProgramPhase } from '@/lib/program';
import MissionList from './MissionList';
import QuestList from './QuestList';
import DebriefPanel from './DebriefPanel';

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
  if (ALL_OVERRIDES[ds]) return ALL_OVERRIDES[ds];
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

// Fusion des surcharges : les courses auto-génèrent taper/récup, les manuelles ont la priorité
const ALL_OVERRIDES: Record<string, string> = { ...computeRaceOverrides(), ...DATE_OVERRIDES };

// Dates de course pour lookup rapide
const RACE_DATE_SET = new Set(RACES.map(r => r.date));

function countdown(dateStr: string): string {
  const now = new Date();
  const race = new Date(dateStr + 'T12:00:00');
  const diffDays = Math.round((race.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Passée';
  if (diffDays === 0) return "Aujourd'hui !";
  if (diffDays < 7) return `Dans ${diffDays} j`;
  if (diffDays < 60) return `Dans ${Math.round(diffDays / 7)} sem`;
  const months = Math.round(diffDays / 30);
  return `Dans ${months} mois`;
}

function fmtRaceDate(ds: string): string {
  const d = new Date(ds + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const PHASE_MILESTONES: Record<string, { label: string; color: string }> = {
  p2a: { label: '🏊 Super Sprint triathlon (~S22) — 400 m nage · 10 km vélo · 2,5 km course', color: '#6EC6D8' },
  p3a: { label: '🏊🚴 Sprint triathlon (~S52) — 750 m nage · 20 km vélo · 5 km course', color: '#88C49A' },
  p3b: { label: '🏊🚴🏃 Triathlon Olympique (~S70) — 1 500 m nage · 40 km vélo · 10 km course', color: '#CF8E42' },
  p4a: { label: '💪 Half-Ironman (~S88) — 1 900 m nage · 90 km vélo · 21 km course', color: '#C26060' },
  p4b: { label: '🏅 IRONMAN (~S104) — 3 800 m nage · 180 km vélo · 42,2 km course', color: '#CF8E42' },
};

export default function EntrainementClient() {
  const { state, today, toggleMission, toggleQuest } = useAppState();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(() => today);
  const [pain, setPain] = useState({ aine: 0, tibia: 0 });
  const [openPhaseId, setOpenPhaseId] = useState<string | null>(null);

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
          <button className="btn-ghost prog-nav-btn" onClick={() => handleWeekChange(-1)}>
            <span className="prog-nav-label-full">← Précédente</span>
            <span className="prog-nav-label-short">←</span>
          </button>
          <span className="prog-week-title">
            {displayedWeek > 0 ? <><strong>S{displayedWeek}</strong> · </> : null}
            {fmtWeekHeader(monday)}
          </span>
          <button className="btn-ghost prog-nav-btn" onClick={() => handleWeekChange(1)}>
            <span className="prog-nav-label-full">Suivante →</span>
            <span className="prog-nav-label-short">→</span>
          </button>
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
                className={`prog-day-cell${isToday ? ' today' : ''}${isSel ? ' open' : ''}${isPast && !isToday ? ' past' : ''}${RACE_DATE_SET.has(ds) ? ' race-day' : ''}`}
                style={{ '--session-color': sess.color } as React.CSSProperties}
                onClick={() => setSelectedDate(ds)}
              >
                {RACE_DATE_SET.has(ds) && (
                  <span className="prog-day-race-badge">🏅</span>
                )}
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

        {selSessionId !== 'rest' && (
          <DebriefPanel
            date={selectedDate}
            sessionId={selSessionId}
            sessionLabel={selSession.label}
          />
        )}
      </section>

      {/* ── COMPÉTITIONS ── */}
      <section>
        <div className="shead">
          <h2>Compétitions prévues</h2>
          <span className="hint">dates provisoires — à ajuster</span>
        </div>
        <div className="races-note">
          Ces dates sont des objectifs, pas des obligations. Si le corps dit non → on décale sans hésiter.
          Cherche les événements réels de ta région (fftri.fr, triathlons-annuaire.com).
        </div>
        <div className="races-list">
          {RACES.map(race => {
            const cd = countdown(race.date);
            const isPast = cd === 'Passée';
            const color = RACE_COLORS[race.type];
            return (
              <div key={race.date} className={`race-card${isPast ? ' past' : ''}`} style={{ '--race-color': color } as React.CSSProperties}>
                <div className="race-card-top">
                  <span className="race-type-badge" style={{ background: color + '22', color, borderColor: color + '55' }}>
                    {RACE_LABELS[race.type]}
                  </span>
                  <span className={`race-countdown${isPast ? ' past' : cd.startsWith('Dans') && parseInt(cd.split(' ')[1]) < 30 ? ' soon' : ''}`}>
                    {cd}
                  </span>
                  {race.optional && <span className="race-optional">facultatif</span>}
                </div>
                <div className="race-card-name">{race.label}</div>
                <div className="race-card-date">{fmtRaceDate(race.date)}</div>
                <div className="race-distances">{race.distances}</div>
                <div className="race-location">📍 {race.location}</div>
                <div className="race-note">{race.note}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FEUILLE DE ROUTE ── */}
      <section>
        <div className="shead"><h2>Feuille de route 2 ans</h2><span className="hint">9 phases</span></div>
        <div className="prog-roadmap">
          {PHASES.map(p => {
            const isCurrent = p.id === currentPhase.id;
            const isOpen = openPhaseId === p.id;
            const startDate = new Date(PROGRAM_START);
            startDate.setDate(startDate.getDate() + (p.weeks[0] - 1) * 7);
            const endDate = new Date(PROGRAM_START);
            endDate.setDate(endDate.getDate() + p.weeks[1] * 7 - 1);
            const fmtMonth = (d: Date) => d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            const milestone = PHASE_MILESTONES[p.id];
            return (
              <div key={p.id} className={`prog-roadmap-phase${isCurrent ? ' current' : ''}`}>
                <button
                  className="prog-roadmap-header"
                  onClick={() => setOpenPhaseId(isOpen ? null : p.id)}
                >
                  <div className="prog-roadmap-header-left">
                    <span className="prog-roadmap-weeks">S{p.weeks[0]}–{p.weeks[1]}</span>
                    <span className="prog-roadmap-period">{fmtMonth(startDate)} → {fmtMonth(endDate)}</span>
                  </div>
                  <div className="prog-roadmap-header-center">
                    <span className="prog-roadmap-name">{p.label}</span>
                    <span className="prog-roadmap-tagline">{p.tagline}</span>
                  </div>
                  <span className="prog-roadmap-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="prog-roadmap-details">
                    {milestone && (
                      <div className="prog-roadmap-milestone" style={{ borderColor: milestone.color, color: milestone.color }}>
                        {milestone.label}
                      </div>
                    )}
                    <div className="prog-roadmap-focus">
                      {p.focus.map((f, i) => <span key={i} className="prog-focus-tag">{f}</span>)}
                    </div>
                    <div className="prog-roadmap-week-template">
                      {WEEK_DAYS.map(day => {
                        const sid = p.template[day];
                        const sess = SESSIONS[sid];
                        return (
                          <div key={day} className="prog-template-day">
                            <span className="prog-template-day-name">{WEEK_DAY_LABELS[day]}</span>
                            <span className="prog-template-sess" style={{ color: sess.color }}>{sess.short}</span>
                            {sess.duration && <span className="prog-template-dur">{sess.duration}</span>}
                          </div>
                        );
                      })}
                    </div>
                    {p.notes.length > 0 && (
                      <div className="prog-roadmap-notes">
                        {p.notes.map((n, i) => <div key={i} className="prog-roadmap-note">— {n}</div>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MISSIONS + QUÊTES ── */}
      <div className="two-col" style={{ marginTop: 4 }}>
        <MissionList missions={todayData.missions} onToggle={toggleMission} date={today} />
        <QuestList quests={state.quests} onToggle={toggleQuest} />
      </div>
    </>
  );
}
