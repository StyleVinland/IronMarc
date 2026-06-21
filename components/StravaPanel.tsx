'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface Activity {
  id: number; name: string; type: string; date: string;
  duration: number; distance: number; elevation: number;
  avgHr: number | null; avgSpeed: number; photo: string | null;
}
interface StravaResponse {
  connected: boolean; hasMore?: boolean; page?: number;
  athlete?: { name: string; avatar: string };
  activities?: Activity[];
}

/* ── helpers ───────────────────────────────────────────────── */
const TYPE_LABEL: Record<string, string> = {
  Run: 'Course', VirtualRun: 'Course', TrailRun: 'Trail',
  Ride: 'Vélo', VirtualRide: 'Vélo', EBikeRide: 'Vélo',
  Swim: 'Nage', WeightTraining: 'Musculation',
  Workout: 'Séance', Yoga: 'Yoga', Walk: 'Marche', Hike: 'Rando',
};
const TYPE_GRADIENT: Record<string, string> = {
  Run:      'linear-gradient(150deg,#ff6b35 0%,#c0392b 100%)',
  Ride:     'linear-gradient(150deg,#4fc3f7 0%,#0277bd 100%)',
  Swim:     'linear-gradient(150deg,#26c6da 0%,#00695c 100%)',
  WeightTraining: 'linear-gradient(150deg,#ab47bc 0%,#6a1b9a 100%)',
  Workout:  'linear-gradient(150deg,#7e57c2 0%,#4527a0 100%)',
  Walk:     'linear-gradient(150deg,#66bb6a 0%,#2e7d32 100%)',
  Hike:     'linear-gradient(150deg,#8d6e63 0%,#4e342e 100%)',
  Yoga:     'linear-gradient(150deg,#f48fb1 0%,#880e4f 100%)',
};
const TYPE_ICON: Record<string, string> = {
  Run: '🏃', VirtualRun: '🏃', TrailRun: '🏔️',
  Ride: '🚴', VirtualRide: '🚴', EBikeRide: '⚡',
  Swim: '🏊', WeightTraining: '🏋️', Workout: '💪',
  Yoga: '🧘', Walk: '🚶', Hike: '🥾',
};

function gradient(type: string) {
  const base = type.replace('Virtual', '').replace('EBike', '');
  return TYPE_GRADIENT[type] ?? TYPE_GRADIENT[base] ?? 'linear-gradient(150deg,#455a64 0%,#263238 100%)';
}
function label(type: string) {
  return TYPE_LABEL[type] ?? type;
}
function icon(type: string) {
  return TYPE_ICON[type] ?? '🏅';
}

function fmtDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function fmtPace(sec: number, distM: number): string | null {
  if (distM < 10) return null;
  const secPerKm = sec / (distM / 1000);
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function fmtSwimPace(sec: number, distM: number): string | null {
  if (distM < 10) return null;
  const secPer100 = sec / (distM / 100);
  const m = Math.floor(secPer100 / 60);
  const s = Math.round(secPer100 % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

/* ── Metrics by type ────────────────────────────────────────── */
function ActivityMetrics({ a }: { a: Activity }) {
  const isRun  = ['Run','VirtualRun','TrailRun'].includes(a.type);
  const isRide = ['Ride','VirtualRide','EBikeRide'].includes(a.type);
  const isSwim = a.type === 'Swim';

  const metrics: Array<{ label: string; value: string }> = [];

  if (isRun || isRide) {
    if (a.distance > 0)
      metrics.push({ label: 'Distance', value: `${(a.distance / 1000).toFixed(2)} km` });
    metrics.push({ label: 'Durée', value: fmtDuration(a.duration) });
    if (isRun && a.distance > 0) {
      const pace = fmtPace(a.duration, a.distance);
      if (pace) metrics.push({ label: 'Allure', value: `${pace} /km` });
    }
    if (isRide && a.avgSpeed > 0)
      metrics.push({ label: 'Vitesse', value: `${a.avgSpeed} km/h` });
    if (a.elevation > 0)
      metrics.push({ label: 'Dénivelé', value: `+${a.elevation} m` });
    if (a.avgHr)
      metrics.push({ label: 'FC moy', value: `${a.avgHr} bpm` });
  } else if (isSwim) {
    if (a.distance > 0)
      metrics.push({ label: 'Distance', value: `${a.distance} m` });
    metrics.push({ label: 'Durée', value: fmtDuration(a.duration) });
    if (a.distance > 0) {
      const pace = fmtSwimPace(a.duration, a.distance);
      if (pace) metrics.push({ label: 'Allure', value: `${pace} /100m` });
    }
  } else {
    metrics.push({ label: 'Durée', value: fmtDuration(a.duration) });
    if (a.distance > 0)
      metrics.push({ label: 'Distance', value: `${(a.distance / 1000).toFixed(1)} km` });
    if (a.avgHr)
      metrics.push({ label: 'FC moy', value: `${a.avgHr} bpm` });
  }

  return (
    <div className="sc-metrics">
      {metrics.map(m => (
        <div key={m.label} className="sc-metric">
          <div className="sc-metric-val">{m.value}</div>
          <div className="sc-metric-lbl">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Card ───────────────────────────────────────────────────── */
function ActivityCard({ a }: { a: Activity }) {
  return (
    <div className="sc-card">
      <div
        className="sc-card-header"
        style={a.photo
          ? { backgroundImage: `url(${a.photo})` }
          : { background: gradient(a.type) }
        }
      >
        <div className="sc-card-header-overlay" />
        <span className="sc-type-badge">
          <span className="sc-type-icon">{icon(a.type)}</span>
          {label(a.type)}
        </span>
      </div>
      <div className="sc-card-body">
        <div className="sc-card-name">{a.name}</div>
        <div className="sc-card-date">{fmtDate(a.date)}</div>
        <ActivityMetrics a={a} />
      </div>
    </div>
  );
}

/* ── Main panel ─────────────────────────────────────────────── */
export default function StravaPanel() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [athlete, setAthlete] = useState<{ name: string; avatar: string } | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  async function load(p: number, append = false) {
    const r = await fetch(`/api/strava/activities?page=${p}`);
    const data: StravaResponse = await r.json();
    if (!data.connected) { setConnected(false); return; }
    setConnected(true);
    if (data.athlete) setAthlete(data.athlete);
    setActivities(prev => append ? [...prev, ...(data.activities ?? [])] : (data.activities ?? []));
    setHasMore(data.hasMore ?? false);
    setPage(p);
  }

  useEffect(() => { load(1).catch(() => setConnected(false)); }, []);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect(); };
  }, [activities]);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('.sc-card') as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    await load(page + 1, true);
    setLoadingMore(false);
  }

  async function disconnect() {
    setDisconnecting(true);
    await fetch('/api/strava/disconnect', { method: 'DELETE' });
    setConnected(false);
    setDisconnecting(false);
  }

  /* États */
  if (connected === null) {
    return (
      <div className="strava-panel loading">
        <div className="strava-skeleton" />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="strava-panel disconnected">
        <div className="strava-connect-inner">
          <div className="strava-logo-wrap">
            <svg className="strava-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0 3 13.828h4.17" />
            </svg>
          </div>
          <div className="strava-connect-text">
            <div className="strava-connect-title">Connecter Strava</div>
            <div className="strava-connect-sub">
              Importe toutes tes séances · distance · allure · fréquence cardiaque · photos
            </div>
          </div>
          <a href="/api/strava/connect" className="strava-connect-btn">Connecter</a>
        </div>
      </div>
    );
  }

  return (
    <div className="strava-panel connected">
      {/* En-tête */}
      <div className="strava-head">
        <div className="strava-head-left">
          {athlete?.avatar && <img src={athlete.avatar} alt="" className="strava-avatar" />}
          <div>
            <div className="strava-head-name">{athlete?.name}</div>
            <div className="strava-head-sub">
              <svg className="strava-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0 3 13.828h4.17" />
              </svg>
              {activities.length} séance{activities.length > 1 ? 's' : ''}
              {hasMore ? '+' : ''} · plus récente en premier
            </div>
          </div>
        </div>
        <button className="strava-disconnect" onClick={disconnect} disabled={disconnecting}>
          {disconnecting ? '…' : 'Déconnecter'}
        </button>
      </div>

      {/* Carousel */}
      <div className="sc-carousel-wrap">
        <button
          className={`sc-arrow sc-arrow-left${canLeft ? '' : ' hidden'}`}
          onClick={() => scroll('left')}
          aria-label="Précédent"
        >‹</button>

        <div className="sc-scroll" ref={scrollRef}>
          {activities.map(a => <ActivityCard key={a.id} a={a} />)}

          {hasMore && (
            <div className="sc-load-more-card">
              <button className="sc-load-more-btn" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? '…' : 'Charger plus'}
              </button>
            </div>
          )}
        </div>

        <button
          className={`sc-arrow sc-arrow-right${canRight ? '' : ' hidden'}`}
          onClick={() => scroll('right')}
          aria-label="Suivant"
        >›</button>
      </div>
    </div>
  );
}
