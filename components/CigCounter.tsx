'use client';
import { useState, useEffect, useRef } from 'react';
import { COACH } from '@/lib/constants';

interface Props {
  todayCigs: number;
  freeStreak: number;
  onAddCig: () => void;
  onRemoveCig: () => void;
}

export default function CigCounter({ todayCigs, freeStreak, onAddCig, onRemoveCig }: Props) {
  const [coach, setCoach] = useState('');
  const [showCoach, setShowCoach] = useState(false);
  const [hit, setHit] = useState(false);
  const prevRef = useRef(todayCigs);

  useEffect(() => {
    if (todayCigs !== prevRef.current) {
      setHit(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHit(true));
      });
      const t = setTimeout(() => setHit(false), 700);
      prevRef.current = todayCigs;
      return () => clearTimeout(t);
    }
  }, [todayCigs]);

  function handleAdd() {
    onAddCig();
    const msg = COACH[Math.floor(Math.random() * COACH.length)];
    setShowCoach(false);
    setTimeout(() => { setCoach(msg); setShowCoach(true); }, 20);
  }

  const isClean = todayCigs === 0;

  return (
    <div className={`cig-card${isClean ? ' clean' : ' smoked'}`}>

      {/* Glow orb décoratif */}
      <div className="cig-glow" aria-hidden />

      {/* Top — statut + bouton annuler */}
      <div className="cig-top-row">
        <div className="cig-state-badge">
          {isClean ? '🚭 Journée propre' : '🚬 Fumeur du jour'}
        </div>
        {todayCigs > 0 && (
          <button className="cig-undo" onClick={onRemoveCig} title="Corriger le dernier ajout">
            − 1
          </button>
        )}
      </div>

      {/* Centre — grand nombre animé */}
      <div className="cig-center">
        <div className={`cig-num${hit ? ' hit' : ''}`}>{todayCigs}</div>
        <div className="cig-unit">cigarettes aujourd&apos;hui</div>
      </div>

      {/* Streak sans tabac */}
      <div className="cig-streak">
        <span className="cig-streak-fire">🔥</span>
        <div className="cig-streak-content">
          <span className="cig-streak-n">{freeStreak}</span>
          <span className="cig-streak-k">jours sans tabac</span>
        </div>
      </div>

      {/* Bouton principal */}
      <button className="cig-add-btn" onClick={handleAdd}>
        <span className="cig-add-plus">+</span>
        J&apos;ai fumé une cigarette
      </button>

      {/* Message coach */}
      {showCoach && (
        <div className="cig-coach">
          <span className="cig-coach-icon">💬</span>
          <span>{coach}</span>
        </div>
      )}
    </div>
  );
}
