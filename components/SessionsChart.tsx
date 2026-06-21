'use client';
import { useEffect, useRef, useState } from 'react';

interface WeekData { label: string; count: number; xp: number; }

function themeColors() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    C_TEXT: dark ? '#636366' : '#8E8E93',
    C_GRID: dark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.12)',
  };
}

function drawBars(canvas: HTMLCanvasElement, labels: string[], vals: number[], xpVals: number[], forcedMax: number) {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  if (W < 10) return;
  const H = 150;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  const { C_TEXT, C_GRID } = themeColors();
  const pad = { t: 12, r: 8, b: 26, l: 30 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const n = vals.length;
  const yMax = forcedMax || Math.max(...vals, 1);

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = C_GRID; ctx.lineWidth = 1;
  ctx.font = '10px Inter, -apple-system, sans-serif'; ctx.fillStyle = C_TEXT; ctx.textAlign = 'right';
  [0, 0.5, 1].forEach(p => {
    const y = pad.t + iH * (1 - p);
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    ctx.fillText(String(Math.round(yMax * p)), pad.l - 4, y + 4);
  });

  const slot = iW / n, bW = slot * 0.55;
  vals.forEach((v, i) => {
    const bH = (v / yMax) * iH;
    const x = pad.l + i * slot + (slot - bW) / 2;
    const y = pad.t + iH - bH;
    if (bH > 0) {
      const r2 = Math.min(4, bW / 2, bH);
      ctx.fillStyle = '#34C759';
      ctx.beginPath();
      ctx.moveTo(x + r2, y); ctx.lineTo(x + bW - r2, y);
      ctx.arcTo(x + bW, y, x + bW, y + r2, r2); ctx.lineTo(x + bW, y + bH);
      ctx.lineTo(x, y + bH); ctx.arcTo(x, y, x + r2, y, r2);
      ctx.closePath(); ctx.fill();
    }
    // XP label au-dessus de la barre
    if (xpVals[i] > 0) {
      ctx.fillStyle = '#C8920A';
      ctx.font = '8px Inter, -apple-system, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(`+${xpVals[i]}`, x + bW / 2, Math.max(y - 3, pad.t + 8));
    }
    ctx.fillStyle = C_TEXT;
    ctx.font = '9px Inter, -apple-system, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + bW / 2, H - 4);
  });
}

export default function SessionsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [weekly, setWeekly] = useState<WeekData[]>([]);
  const [total, setTotal]   = useState(0);
  const [count, setCount]   = useState(0);

  useEffect(() => {
    fetch('/api/xp').then(r => r.json()).then(d => {
      setWeekly(d.weekly ?? []);
      setTotal(d.total ?? 0);
      setCount(d.count ?? 0);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!canvasRef.current || weekly.length === 0) return;
    function draw() {
      if (!canvasRef.current) return;
      drawBars(
        canvasRef.current,
        weekly.map(w => w.label),
        weekly.map(w => w.count),
        weekly.map(w => w.xp),
        7,
      );
    }
    draw();
    const obs = new MutationObserver(draw);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, [weekly]);

  return (
    <section className="sessions-chart-section">
      <div className="shead">
        <h2>Séances validées</h2>
        <span className="hint">6 dernières semaines</span>
      </div>
      <div className="charts-grid charts-grid-single">
        <div className="chart-card">
          <div className="chart-title-row">
            <div className="chart-title">Séances / semaine</div>
            {count > 0 && (
              <div className="sessions-chart-totals">
                <span className="sessions-chart-count">{count} séance{count > 1 ? 's' : ''}</span>
                <span className="sessions-chart-xp">⚡ {total} XP</span>
              </div>
            )}
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: '#34C759' }} />séances validées</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#C8920A' }} />XP gagné</span>
          </div>
          <canvas className="chart-canvas" ref={canvasRef} aria-label="Graphique séances par semaine" />
          {count === 0 && (
            <div className="sessions-chart-empty">Valide ta première séance pour voir apparaître ton graphique.</div>
          )}
        </div>
      </div>
    </section>
  );
}
