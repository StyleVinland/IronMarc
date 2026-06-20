'use client';
import { useEffect, useRef, useState } from 'react';
import { MOODS } from '@/lib/constants';
import type { MindData, DayData } from '@/types';

interface Props {
  mind: MindData;
  days: Record<string, DayData>;
  onChange: (field: keyof MindData, value: MindData[keyof MindData]) => void;
}

const C_TEXT = '#7A7975';
const C_GRID = 'rgba(45,44,41,0.5)';

function drawMoodChart(canvas: HTMLCanvasElement, days: Record<string, DayData>) {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  if (W < 10) return;
  const H = 88;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  const pad = { t: 6, r: 8, b: 22, l: 22 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;

  const labels: string[] = [], vals: (number | null)[] = [];
  const dt0 = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(dt0); d.setDate(d.getDate() - i);
    const k = d.toLocaleDateString('fr-CA');
    labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
    vals.push(days[k]?.mind?.mood ?? null);
  }
  const n = labels.length;

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = C_GRID; ctx.lineWidth = 1;
  [1, 2, 3, 4, 5].forEach(v => {
    const y = pad.t + iH - ((v - 1) / 4) * iH;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    ctx.fillStyle = C_TEXT; ctx.font = '9px Barlow, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(String(v), pad.l - 3, y + 3);
  });

  const pts = vals.map((v, i) => {
    if (v === null) return null;
    return { x: pad.l + (n < 2 ? iW / 2 : i / (n - 1) * iW), y: pad.t + iH - ((v - 1) / 4) * iH };
  }).filter(Boolean) as { x: number; y: number }[];

  if (pts.length >= 2) {
    ctx.beginPath(); ctx.moveTo(pts[0].x, pad.t + iH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, pad.t + iH);
    ctx.closePath(); ctx.fillStyle = '#E8E5DC10'; ctx.fill();

    ctx.strokeStyle = '#E8E5DC'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();
  }
  pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = '#CF8E42'; ctx.fill(); });

  labels.forEach((l, i) => {
    if (n <= 8 || i % 2 === 0 || i === n - 1) {
      const x = pad.l + (n < 2 ? iW / 2 : i / (n - 1) * iW);
      ctx.fillStyle = C_TEXT; ctx.font = '8px Barlow, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(l, x, H - 4);
    }
  });
}

export default function MentalSpace({ mind, days, onChange }: Props) {
  const moodRef = useRef<HTMLCanvasElement>(null);
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState<'Inspire…' | 'Retiens…' | 'Expire…'>('Inspire…');
  const [scale, setScale] = useState(0.8);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (moodRef.current) drawMoodChart(moodRef.current, days);
  }, [days]);

  function clearTimers() { timerRef.current.forEach(clearTimeout); timerRef.current = []; }

  function cycle() {
    setPhase('Inspire…'); setScale(1.5);
    timerRef.current.push(setTimeout(() => {
      setPhase('Retiens…');
      timerRef.current.push(setTimeout(() => {
        setPhase('Expire…'); setScale(0.8);
        timerRef.current.push(setTimeout(() => {
          setBreathing(prev => { if (prev) cycle(); return prev; });
        }, 6000));
      }, 1000));
    }, 4000));
  }

  function toggleBreath() {
    if (breathing) { clearTimers(); setBreathing(false); setScale(0.8); setPhase('Inspire…'); }
    else { setBreathing(true); cycle(); }
  }

  useEffect(() => () => clearTimers(), []);

  return (
    <section>
      <div className="shead"><h2>Espace tête</h2><span className="hint">santé mentale</span></div>
      <div className="mind-card">
        <p className="mind-lead">
          Ton coin à toi pour faire le point. Rien n&apos;est jugé, rien ne part ailleurs.
          Bouger le corps, c&apos;est la moitié du chemin — l&apos;autre moitié, c&apos;est ici.
        </p>

        <div className="mblock">
          <h3>Comment je me sens, là&nbsp;?</h3>
          <div className="moods">
            {MOODS.map(o => (
              <button
                key={o.v}
                className={`mood-btn${mind.mood === o.v ? ' sel' : ''}`}
                onClick={() => onChange('mood', mind.mood === o.v ? null : o.v)}
                aria-label={o.l}
                style={mind.mood === o.v ? { borderColor: o.color } : undefined}
              >
                <span className="mood-dot" style={{ background: o.color }} />
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div className="mblock">
          <div className="mood-chart-wrap">
            <div className="mood-chart-title">Humeur sur 14 jours</div>
            <canvas className="chart-mood" ref={moodRef} aria-label="Graphique humeur" />
          </div>
        </div>

        <div className="mblock">
          <h3>Vider mon sac</h3>
          <p className="jhint">Qu&apos;est-ce qui pèse aujourd&apos;hui&nbsp;? Et une chose, même minuscule, qui a tenu bon&nbsp;?</p>
          <textarea
            className="jbox"
            placeholder="Écris ce qui vient…"
            value={mind.journal}
            onChange={e => onChange('journal', e.target.value)}
          />
        </div>

        <div className="mblock">
          <h3>3 petites victoires / gratitudes du jour</h3>
          <div className="grat">
            {([0, 1, 2] as const).map(i => (
              <input
                key={i}
                className="gin"
                placeholder={`${i + 1} —`}
                value={mind.grat[i]}
                onChange={e => {
                  const g = [...mind.grat] as [string, string, string];
                  g[i] = e.target.value;
                  onChange('grat', g);
                }}
              />
            ))}
          </div>
        </div>

        <div className="mblock breathe-wrap">
          <h3 style={{ marginBottom: 12 }}>Se poser une minute</h3>
          <button className="btn-breathe" onClick={toggleBreath}>
            {breathing ? 'Arrêter' : 'Respiration guidée'}
          </button>
          {breathing && (
            <div className="breathe-panel on">
              <div className="bcircle" style={{ transform: `scale(${scale})`, transition: phase === 'Expire…' ? 'transform 6s ease' : 'transform 4s ease' }} />
              <div className="blabel">{phase}</div>
            </div>
          )}
        </div>

        <div className="support">
          <h3>Une journée trop lourde&nbsp;?</h3>
          <p>Tu n&apos;as pas à la porter seul. En parler — à un proche, à un médecin — soulage vraiment, et ce n&apos;est pas une faiblesse. Si les pensées deviennent sombres, appelle, même juste pour être écouté&nbsp;:</p>
          <div className="support-links">
            <a className="support-link" href="tel:3114">3114 — prévention du suicide</a>
            <a className="support-link" href="tel:112">112 — urgences</a>
          </div>
          <p className="support-src">Le 3114 (France) est gratuit, confidentiel et ouvert 24&nbsp;h/24. Adapte ces numéros à ton pays.</p>
        </div>
      </div>
    </section>
  );
}
