'use client';
import { useState } from 'react';
import { COACH } from '@/lib/constants';

interface Props {
  todayCigs: number;
  freeStreak: number;
  onAddCig: () => void;
}

export default function CigCounter({ todayCigs, freeStreak, onAddCig }: Props) {
  const [coach, setCoach] = useState('');
  const [show, setShow] = useState(false);

  function handleAdd() {
    onAddCig();
    const msg = COACH[Math.floor(Math.random() * COACH.length)];
    setShow(false);
    setTimeout(() => { setCoach(msg); setShow(true); }, 20);
  }

  return (
    <section>
      <div className="shead"><h2>Le compteur clope</h2><span className="hint">sans jugement</span></div>
      <div className="cig-card">
        <div className="cig-top">
          <div>
            <div className="cig-n">{todayCigs}</div>
            <div className="cig-k">aujourd&apos;hui</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="cig-free-n">{freeStreak}</div>
            <div className="cig-k">jours sans</div>
          </div>
        </div>
        <button className="btn-warn" onClick={handleAdd}>J&apos;ai fumé · +1</button>
        {show && <div className="coach-msg show">{coach}</div>}
      </div>
    </section>
  );
}
