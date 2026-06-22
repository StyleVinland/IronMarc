'use client';
import { useState } from 'react';
import { DAILY, DAILY_BONUS } from '@/lib/constants';

interface Props {
  missions: Record<string, boolean>;
  onToggle: (id: string, next: boolean) => void;
  date: string;
}

const CHECK_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#0a242c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const MOB_ROUTINE = [
  { name: 'Psoas & fléchisseur de hanche', detail: 'Genou au sol, bascule le bassin vers l\'avant — sens l\'étirement à l\'avant de la hanche. Doux.', dur: '45 s / côté', tag: 'Pubalgie' },
  { name: 'Mollet & tendon d\'Achille', detail: 'Talon bien ancré au sol, jambe tendue contre un mur ou une marche. Ne force pas.', dur: '45 s / côté', tag: 'Périostite' },
  { name: 'Ischio-jambiers', detail: 'Debout, pose le talon sur une chaise ou un banc, incline le buste vers l\'avant, dos droit.', dur: '45 s / côté', tag: '' },
  { name: 'Pigeon (rotateur hanche)', detail: 'Jambe avant pliée à 90° au sol, jambe arrière tendue. Aide à protéger l\'aine et la pubalgie.', dur: '60 s / côté', tag: 'Pubalgie' },
  { name: 'Ouverture poitrine & épaules', detail: 'Bras en croix, main contre un mur ou un encadrement de porte, rotation douce du buste.', dur: '45 s / côté', tag: 'Natation' },
  { name: 'Rotations thoraciques', detail: 'Assis en tailleur, main derrière la nuque, rotation lente gauche-droite. Déverrouille le dos après le vélo.', dur: '30 s / côté', tag: '' },
];

export default function MissionList({ missions, onToggle }: Props) {
  const [mobOpen, setMobOpen] = useState(false);
  const dl = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <section>
      <div className="shead"><h2>Missions du jour</h2><span className="hint">{dl}</span></div>
      <div className="item-list">
        {DAILY.map(t => {
          const done = !!missions[t.id];
          const isMob = t.id === 'mob';
          return (
            <div key={t.id}>
              <div
                className={`item${done ? ' done' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => onToggle(t.id, !done)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(t.id, !done); } }}
              >
                <div className="item-box">{CHECK_SVG}</div>
                <div className="item-txt">{t.txt}</div>
                {isMob && (
                  <button
                    className="mob-expand-btn"
                    onClick={e => { e.stopPropagation(); setMobOpen(o => !o); }}
                    aria-label="Voir la séance"
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points={mobOpen ? '5 13 10 8 15 13' : '5 8 10 13 15 8'} />
                    </svg>
                  </button>
                )}
                <div className="item-xp">+{t.xp}</div>
              </div>

              {isMob && mobOpen && (
                <div className="mob-routine">
                  <div className="mob-routine-title">Séance mobilité — 10 min après le sport</div>
                  {MOB_ROUTINE.map((ex, i) => (
                    <div key={i} className="mob-ex">
                      <div className="mob-ex-top">
                        <span className="mob-ex-name">{ex.name}</span>
                        <span className="mob-ex-dur">{ex.dur}</span>
                      </div>
                      <div className="mob-ex-detail">{ex.detail}</div>
                      {ex.tag && <span className="mob-ex-tag">{ex.tag}</span>}
                    </div>
                  ))}
                  <div className="mob-routine-note">Respire lentement. Si une zone tire trop fort, recule.</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bonus journée parfaite */}
      {(() => {
        const allDone = DAILY.every(t => !!missions[t.id]);
        const remaining = DAILY.filter(t => !missions[t.id]).length;
        return (
          <div className={`daily-bonus${allDone ? ' done' : ''}`}>
            {allDone ? (
              <>
                <span className="daily-bonus-icon">⚡</span>
                <span className="daily-bonus-txt">Journée parfaite — Bonus <strong>+{DAILY_BONUS} XP</strong> gagné !</span>
              </>
            ) : (
              <>
                <span className="daily-bonus-icon">🎯</span>
                <span className="daily-bonus-txt">
                  {remaining === 1 ? 'Plus qu\'une mission' : `${remaining} missions restantes`} → Bonus <strong>+{DAILY_BONUS} XP</strong>
                </span>
              </>
            )}
          </div>
        );
      })()}

      {!DAILY.every(t => !!missions[t.id]) && (
        <p style={{ fontSize: 12.5, marginTop: 9, color: '#3C3C43', fontStyle: 'italic', padding: '0 4px 2px' }}>
          Le repos fait partie de l&apos;entraînement. Un jour off, c&apos;est une mission réussie, pas une mission ratée.
        </p>
      )}
    </section>
  );
}
