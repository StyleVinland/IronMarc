'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { polylineToSvgPath } from '@/lib/polyline';
import dynamic from 'next/dynamic';

const StravaDetailModal = dynamic(() => import('./StravaDetailModal'), { ssr: false });

interface Activity {
  id: number; name: string; type: string; date: string;
  duration: number; distance: number; elevation: number;
  avgHr: number | null; avgSpeed: number;
  photo: string | null; polyline: string | null;
}
interface StravaResponse {
  connected: boolean; hasMore?: boolean; page?: number;
  athlete?: { name: string; avatar: string };
  activities?: Activity[];
}

const TYPE_LABEL: Record<string, string> = {
  Run: 'Course', VirtualRun: 'Course', TrailRun: 'Trail',
  Ride: 'Vélo', VirtualRide: 'Vélo', EBikeRide: 'Vélo',
  Swim: 'Nage', WeightTraining: 'Musculation',
  Workout: 'Séance', Yoga: 'Yoga', Walk: 'Marche', Hike: 'Rando',
};
const TYPE_GRADIENT: Record<string, string> = {
  Run:           'linear-gradient(150deg,#ff6b35 0%,#c0392b 100%)',
  Ride:          'linear-gradient(150deg,#4fc3f7 0%,#0277bd 100%)',
  Swim:          'linear-gradient(150deg,#26c6da 0%,#00695c 100%)',
  WeightTraining:'linear-gradient(150deg,#ab47bc 0%,#6a1b9a 100%)',
  Workout:       'linear-gradient(150deg,#7e57c2 0%,#4527a0 100%)',
  Walk:          'linear-gradient(150deg,#66bb6a 0%,#2e7d32 100%)',
  Hike:          'linear-gradient(150deg,#8d6e63 0%,#4e342e 100%)',
  Yoga:          'linear-gradient(150deg,#f48fb1 0%,#880e4f 100%)',
};
const TYPE_ICON: Record<string, string> = {
  Run:'🏃', VirtualRun:'🏃', TrailRun:'🏔️',
  Ride:'🚴', VirtualRide:'🚴', EBikeRide:'⚡',
  Swim:'🏊', WeightTraining:'🏋️', Workout:'💪',
  Yoga:'🧘', Walk:'🚶', Hike:'🥾',
};

function getGradient(type: string) {
  return TYPE_GRADIENT[type] ?? TYPE_GRADIENT[type.replace('Virtual','').replace('EBike','')] ?? 'linear-gradient(150deg,#455a64 0%,#263238 100%)';
}

function fmtDuration(sec: number) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h${m.toString().padStart(2,'0')}` : `${m}min`;
}
function fmtPace(sec: number, distM: number) {
  if (distM < 10) return null;
  const s = sec / (distM / 1000);
  return `${Math.floor(s/60)}:${Math.round(s%60).toString().padStart(2,'0')}/km`;
}
function fmtSwimPace(sec: number, distM: number) {
  if (distM < 10) return null;
  const s = sec / (distM / 100);
  return `${Math.floor(s/60)}:${Math.round(s%60).toString().padStart(2,'0')}/100m`;
}
function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
}

function CardMetrics({ a }: { a: Activity }) {
  const isRun  = ['Run','VirtualRun','TrailRun'].includes(a.type);
  const isRide = ['Ride','VirtualRide','EBikeRide'].includes(a.type);
  const isSwim = a.type === 'Swim';
  const items: Array<{ val: string; lbl: string }> = [];

  if (isRun || isRide) {
    if (a.distance > 0) items.push({ val: `${(a.distance/1000).toFixed(2)} km`, lbl: 'Distance' });
    items.push({ val: fmtDuration(a.duration), lbl: 'Durée' });
    if (isRun && a.distance > 0) { const p = fmtPace(a.duration, a.distance); if (p) items.push({ val: p, lbl: 'Allure' }); }
    if (isRide && a.avgSpeed > 0) items.push({ val: `${a.avgSpeed} km/h`, lbl: 'Vitesse' });
    if (a.elevation > 0) items.push({ val: `+${a.elevation} m`, lbl: 'Dénivelé' });
    if (a.avgHr) items.push({ val: `${a.avgHr} bpm`, lbl: 'FC moy' });
  } else if (isSwim) {
    if (a.distance > 0) items.push({ val: `${a.distance} m`, lbl: 'Distance' });
    items.push({ val: fmtDuration(a.duration), lbl: 'Durée' });
    if (a.distance > 0) { const p = fmtSwimPace(a.duration, a.distance); if (p) items.push({ val: p, lbl: 'Allure' }); }
  } else {
    items.push({ val: fmtDuration(a.duration), lbl: 'Durée' });
    if (a.distance > 0) items.push({ val: `${(a.distance/1000).toFixed(1)} km`, lbl: 'Distance' });
    if (a.avgHr) items.push({ val: `${a.avgHr} bpm`, lbl: 'FC' });
  }

  return (
    <div className="sc-metrics">
      {items.slice(0,4).map(m => (
        <div key={m.lbl} className="sc-metric">
          <div className="sc-metric-val">{m.val}</div>
          <div className="sc-metric-lbl">{m.lbl}</div>
        </div>
      ))}
    </div>
  );
}

function ActivityCard({ a, onClick }: { a: Activity; onClick: () => void }) {
  const svgPath = !a.photo && a.polyline ? polylineToSvgPath(a.polyline, 260, 148) : null;
  const icon = TYPE_ICON[a.type] ?? '🏅';
  const label = TYPE_LABEL[a.type] ?? a.type;

  return (
    <div className="sc-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div
        className="sc-card-header"
        style={a.photo
          ? { backgroundImage: `url(${a.photo})` }
          : { background: getGradient(a.type) }
        }
      >
        {svgPath && (
          <svg viewBox="0 0 260 148" className="sc-route-svg" aria-hidden>
            <path d={svgPath} fill="none" stroke="rgba(255,255,255,0.75)"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <div className="sc-card-header-overlay" />
        <div className="sc-card-header-bottom">
          <span className="sc-type-badge"><span>{icon}</span>{label}</span>
          <span className="sc-card-date">{fmtDate(a.date)}</span>
        </div>
      </div>
      <div className="sc-card-body">
        <div className="sc-card-name">{a.name}</div>
        <CardMetrics a={a} />
        <div className="sc-card-cta">Voir détails →</div>
      </div>
    </div>
  );
}

export default function StravaPanel() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [athlete, setAthlete] = useState<{ name: string; avatar: string } | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
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
    const amount = card ? card.offsetWidth + 14 : 274;
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

  if (connected === null) {
    return <div className="strava-panel loading"><div className="strava-skeleton" /></div>;
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
            <div className="strava-connect-sub">Toutes tes séances · allure · FC · tracé GPS · photos · équipement</div>
          </div>
          <a href="/api/strava/connect" className="strava-connect-btn">Connecter</a>
        </div>
      </div>
    );
  }

  return (
    <>
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
                {activities.length} séance{activities.length > 1 ? 's' : ''}{hasMore ? '+' : ''} · clique pour les détails
              </div>
            </div>
          </div>
          <button className="strava-disconnect" onClick={disconnect} disabled={disconnecting}>
            {disconnecting ? '…' : 'Déconnecter'}
          </button>
        </div>

        {/* Carousel */}
        <div className="sc-carousel-wrap">
          <div className="sc-scroll" ref={scrollRef}>
            {activities.map(a => (
              <ActivityCard key={a.id} a={a} onClick={() => setSelectedId(a.id)} />
            ))}
            {hasMore && (
              <div className="sc-load-more-card">
                <button className="sc-load-more-btn" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? '…' : 'Charger\nplus'}
                </button>
              </div>
            )}
          </div>

          {/* Flèches bas droite */}
          <div className="sc-footer">
            <div className="sc-nav-pills">
              <button
                className={`sc-nav-btn${canLeft ? '' : ' disabled'}`}
                onClick={() => scroll('left')}
                disabled={!canLeft}
                aria-label="Précédent"
              >‹</button>
              <button
                className={`sc-nav-btn${canRight ? '' : ' disabled'}`}
                onClick={() => scroll('right')}
                disabled={!canRight}
                aria-label="Suivant"
              >›</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal détail */}
      {selectedId !== null && (
        <StravaDetailModal
          activityId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
