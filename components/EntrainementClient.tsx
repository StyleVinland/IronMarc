'use client';
import { useState, useCallback } from 'react';
import type { AppState } from '@/types';
import { ensureDay, todayStr } from '@/lib/compute';
import {
  SESSIONS, PHASES, getCurrentWeek, getCurrentPhase, getTodaySession,
  WEEK_DAYS, WEEK_DAY_LABELS,
} from '@/lib/program';
import MissionList from './MissionList';
import QuestList from './QuestList';

export default function EntrainementClient({ initialState }: { initialState: AppState }) {
  const [state, setState] = useState<AppState>(() => ensureDay(initialState, todayStr()));
  const [openSession, setOpenSession] = useState<string | null>(null);
  const [pain, setPain] = useState({ aine: 0, tibia: 0 });

  const today = todayStr();
  const todayData = state.days[today] ?? {
    date: today, cigs: 0,
    mind: { mood: null, journal: '', grat: ['', '', ''] },
    missions: {},
  };

  const currentWeek = getCurrentWeek();
  const currentPhase = getCurrentPhase(currentWeek);
  const todaySessionId = getTodaySession(currentPhase);
  const todaySession = SESSIONS[todaySessionId];

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

  const handleQuest = useCallback((id: string, completed: boolean) => {
    setState(prev => ({ ...prev, quests: { ...prev.quests, [id]: completed } }));
    fetch(`/api/quests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
  }, []);

  const painHigh = pain.aine > 4 || pain.tibia > 4;

  return (
    <>
      <div className="page-title-block">
        <h1>Entraînement</h1>
        <p>Programme complet pubalgie + périostites → Ironman en 2 ans</p>
      </div>

      {/* ── PHASE ACTUELLE ──────────────────────────────────────── */}
      <div className="prog-phase-banner">
        <div className="prog-phase-left">
          <div className="prog-phase-week">Semaine {currentWeek}</div>
          <div className="prog-phase-label">{currentPhase.label}</div>
          <div className="prog-phase-tagline">{currentPhase.tagline}</div>
        </div>
        <div className="prog-phase-focus">
          {currentPhase.focus.map((f, i) => (
            <span key={i} className="prog-focus-tag">{f}</span>
          ))}
        </div>
      </div>

      {/* ── CALENDRIER SEMAINE ──────────────────────────────────── */}
      <section className="prog-week-section">
        <div className="shead"><h2>Semaine type</h2><span className="hint">{currentPhase.id.toUpperCase()}</span></div>
        <div className="prog-week-grid">
          {WEEK_DAYS.map(d => {
            const sessionId = currentPhase.template[d];
            const session = SESSIONS[sessionId];
            const isToday = d === (['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'][new Date().getDay()]);
            return (
              <button
                key={d}
                className={`prog-day-cell${isToday ? ' today' : ''}${openSession === sessionId ? ' open' : ''}`}
                style={{ '--session-color': session.color } as React.CSSProperties}
                onClick={() => setOpenSession(prev => prev === sessionId ? null : sessionId)}
              >
                <span className="prog-day-name">{WEEK_DAY_LABELS[d]}</span>
                <span className="prog-day-session">{session.short}</span>
                <span className="prog-day-dur">{session.duration || '—'}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── SÉANCE DU JOUR ──────────────────────────────────────── */}
      <section>
        <div className="shead">
          <h2>Séance du jour</h2>
          <span className="hint" style={{ color: todaySession.color }}>{todaySession.label}</span>
        </div>

        {/* Alerte douleur haute */}
        {painHigh && (
          <div className="prog-pain-alert">
            Douleur {'>'} 4/10 — repose-toi aujourd&apos;hui. Ce n&apos;est pas un échec, c&apos;est de l&apos;intelligence.
          </div>
        )}

        {/* Check douleur (avant les séances de renfo / run) */}
        {todaySession.painCheck && !painHigh && (
          <div className="prog-pain-check">
            <div className="prog-pain-title">Check douleur avant de commencer</div>
            <div className="prog-pain-row">
              <label className="prog-pain-label">Aine / pubis</label>
              <div className="prog-pain-scale">
                {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                  <button
                    key={v}
                    className={`prog-pain-btn${pain.aine === v ? ' sel' : ''}${v > 4 ? ' danger' : ''}`}
                    onClick={() => setPain(p => ({ ...p, aine: v }))}
                  >{v}</button>
                ))}
              </div>
            </div>
            <div className="prog-pain-row">
              <label className="prog-pain-label">Tibia</label>
              <div className="prog-pain-scale">
                {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                  <button
                    key={v}
                    className={`prog-pain-btn${pain.tibia === v ? ' sel' : ''}${v > 4 ? ' danger' : ''}`}
                    onClick={() => setPain(p => ({ ...p, tibia: v }))}
                  >{v}</button>
                ))}
              </div>
            </div>
            <div className="prog-pain-rule">≤ 4/10 = vert → faire la séance · {'>'} 4/10 = stop · Courbatures légères = normales</div>
          </div>
        )}

        <div className="prog-session-card" style={{ '--session-color': todaySession.color } as React.CSSProperties}>
          <div className="prog-session-header">
            <div>
              <div className="prog-session-label">{todaySession.label}</div>
              <div className="prog-session-desc">{todaySession.desc}</div>
            </div>
            {todaySession.duration && (
              <div className="prog-session-dur">{todaySession.duration}</div>
            )}
          </div>

          {todaySession.exercises.length > 0 && (
            <div className="prog-exercise-list">
              {todaySession.exercises.map((ex, i) => (
                <div key={i} className={`prog-exercise${ex.required ? ' required' : ''}${ex.warning ? ' warning' : ''}`}>
                  <div className="prog-ex-name">{ex.name}</div>
                  <div className="prog-ex-detail">{ex.detail}</div>
                  {ex.sets && <div className="prog-ex-sets">{ex.sets}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes de phase */}
        {currentPhase.notes.length > 0 && (
          <div className="prog-notes">
            {currentPhase.notes.map((n, i) => (
              <div key={i} className="prog-note">— {n}</div>
            ))}
          </div>
        )}
      </section>

      {/* ── DÉTAIL SESSION OUVERTE (depuis calendrier) ────────── */}
      {openSession && openSession !== todaySessionId && SESSIONS[openSession] && (
        <section>
          <div className="shead">
            <h2>Détail : {SESSIONS[openSession].label}</h2>
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setOpenSession(null)}>Fermer</button>
          </div>
          <div className="prog-session-card" style={{ '--session-color': SESSIONS[openSession].color } as React.CSSProperties}>
            <div className="prog-session-header">
              <div className="prog-session-desc">{SESSIONS[openSession].desc}</div>
              {SESSIONS[openSession].duration && <div className="prog-session-dur">{SESSIONS[openSession].duration}</div>}
            </div>
            <div className="prog-exercise-list">
              {SESSIONS[openSession].exercises.map((ex, i) => (
                <div key={i} className={`prog-exercise${ex.required ? ' required' : ''}${ex.warning ? ' warning' : ''}`}>
                  <div className="prog-ex-name">{ex.name}</div>
                  <div className="prog-ex-detail">{ex.detail}</div>
                  {ex.sets && <div className="prog-ex-sets">{ex.sets}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TOUTES LES PHASES (accordéon) ────────────────────── */}
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

      {/* ── MISSIONS + QUÊTES ─────────────────────────────────── */}
      <div className="two-col" style={{ marginTop: 4 }}>
        <MissionList missions={todayData.missions} onToggle={handleMission} date={today} />
        <QuestList quests={state.quests} onToggle={handleQuest} />
      </div>
    </>
  );
}
