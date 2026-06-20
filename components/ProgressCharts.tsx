'use client';
import { useEffect, useRef } from 'react';
import type { DayData } from '@/types';

interface Props {
  days: Record<string, DayData>;
}

const C_TEXT = '#7A7975';
const C_GRID = 'rgba(45,44,41,0.5)';

function todayStr() {
  return new Date().toLocaleDateString('fr-CA');
}

function prepCtx(canvas: HTMLCanvasElement, h: number) {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  if (W < 10) return null;
  canvas.width = W * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  return { ctx, W, H: h };
}

function linReg(vals: number[]) {
  const n = vals.length;
  if (n < 2) return vals.slice();
  let sx = 0, sy = 0, sxy = 0, sx2 = 0;
  for (let i = 0; i < n; i++) { sx += i; sy += vals[i]; sxy += i * vals[i]; sx2 += i * i; }
  const den = n * sx2 - sx * sx;
  if (!den) return vals.map(() => sy / n);
  const m = (n * sxy - sx * sy) / den, b = (sy - m * sx) / n;
  return vals.map((_, i) => Math.max(0, m * i + b));
}

function drawBars(
  canvas: HTMLCanvasElement,
  labels: string[],
  vals: number[],
  barCol: string,
  trendCol: string | null,
  forcedMax: number,
  H: number
) {
  const r = prepCtx(canvas, H);
  if (!r) return;
  const { ctx, W } = r;
  const pad = { t: 12, r: 8, b: 26, l: 30 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const n = vals.length;
  const yMax = forcedMax || Math.max(...vals, 1);

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = C_GRID; ctx.lineWidth = 1;
  ctx.font = '10px Barlow, sans-serif'; ctx.fillStyle = C_TEXT; ctx.textAlign = 'right';
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
      ctx.fillStyle = barCol;
      ctx.beginPath();
      ctx.moveTo(x + r2, y); ctx.lineTo(x + bW - r2, y);
      ctx.arcTo(x + bW, y, x + bW, y + r2, r2); ctx.lineTo(x + bW, y + bH);
      ctx.lineTo(x, y + bH); ctx.arcTo(x, y, x + r2, y, r2);
      ctx.closePath(); ctx.fill();
    }
    if (n <= 8 || i % 2 === 0 || i === n - 1) {
      ctx.fillStyle = C_TEXT; ctx.font = '9px Barlow, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + bW / 2, H - 4);
    }
  });

  if (trendCol && n >= 2) {
    const tr = linReg(vals);
    ctx.strokeStyle = trendCol; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    tr.forEach((v, i) => {
      const x = pad.l + i * slot + slot / 2;
      const y = pad.t + iH - (v / yMax) * iH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke(); ctx.setLineDash([]);
  }
}

export default function ProgressCharts({ days }: Props) {
  const cigRef = useRef<HTMLCanvasElement>(null);
  const sesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const dt0 = new Date();
    const cigL: string[] = [], cigV: number[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(dt0); d.setDate(d.getDate() - i);
      const k = d.toLocaleDateString('fr-CA');
      cigL.push(`${d.getDate()}/${d.getMonth() + 1}`);
      cigV.push(days[k]?.cigs ?? 0);
    }
    if (cigRef.current) drawBars(cigRef.current, cigL, cigV, '#BD5A48', '#CF8E4288', Math.max(...cigV, 5), 150);

    const sesL: string[] = [], sesV: number[] = [];
    const now = new Date();
    const dow = (now.getDay() + 6) % 7;
    const ws0 = new Date(now); ws0.setDate(ws0.getDate() - dow);
    for (let w = 5; w >= 0; w--) {
      const ws = new Date(ws0); ws.setDate(ws.getDate() - w * 7);
      let s = 0;
      for (let d = 0; d < 7; d++) {
        const wd = new Date(ws); wd.setDate(wd.getDate() + d);
        if (wd > now) break;
        if (days[wd.toLocaleDateString('fr-CA')]?.missions?.move) s++;
      }
      sesL.push(`S${6 - w}`); sesV.push(s);
    }
    if (sesRef.current) drawBars(sesRef.current, sesL, sesV, '#E8E5DC', null, 7, 150);
  }, [days]);

  return (
    <section>
      <div className="shead"><h2>Progression</h2><span className="hint">14 derniers jours</span></div>
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Cigarettes / jour</div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: '#BD5A48' }} />cigarettes</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#CF8E42', opacity: .7 }} />tendance</span>
          </div>
          <canvas className="chart-canvas" ref={cigRef} aria-label="Graphique cigarettes par jour" />
        </div>
        <div className="chart-card">
          <div className="chart-title">Séances / semaine</div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: '#E8E5DC' }} />jours actifs</span>
          </div>
          <canvas className="chart-canvas" ref={sesRef} aria-label="Graphique séances par semaine" />
        </div>
      </div>
    </section>
  );
}
