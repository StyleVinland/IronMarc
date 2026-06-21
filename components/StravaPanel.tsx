'use client';
import { useEffect, useState } from 'react';

interface Activity {
  id: number;
  name: string;
  type: string;
  date: string;
  duration: number;
  distance: number;
  elevation: number;
  avgHr: number | null;
  avgSpeed: number;
}

interface StravaData {
  connected: boolean;
  athlete?: { name: string; avatar: string };
  activities?: Activity[];
  error?: string;
}

const SPORT_ICON: Record<string, string> = {
  Run:         '🏃',
  Ride:        '🚴',
  Swim:        '🏊',
  VirtualRide: '🚴',
  VirtualRun:  '🏃',
  Walk:        '🚶',
  Hike:        '🥾',
  Workout:     '💪',
  WeightTraining: '🏋️',
  Yoga:        '🧘',
};

function fmtDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`;
}

function fmtDistance(m: number, type: string) {
  if (m === 0) return null;
  if (type === 'Swim') return `${m} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

export default function StravaPanel() {
  const [data, setData] = useState<StravaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetch('/api/strava/activities')
      .then(r => r.json())
      .then((d: StravaData) => setData(d))
      .catch(() => setData({ connected: false }))
      .finally(() => setLoading(false));
  }, []);

  async function disconnect() {
    setDisconnecting(true);
    await fetch('/api/strava/disconnect', { method: 'DELETE' });
    setData({ connected: false });
    setDisconnecting(false);
  }

  if (loading) {
    return (
      <div className="strava-panel loading">
        <div className="strava-skeleton" />
      </div>
    );
  }

  if (!data?.connected) {
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
              Importe tes séances automatiquement · distance · durée · fréquence cardiaque
            </div>
          </div>
          <a href="/api/strava/connect" className="strava-connect-btn">
            Connecter
          </a>
        </div>
      </div>
    );
  }

  const activities = data.activities ?? [];

  return (
    <div className="strava-panel connected">
      {/* En-tête */}
      <div className="strava-head">
        <div className="strava-head-left">
          {data.athlete?.avatar && (
            <img src={data.athlete.avatar} alt="" className="strava-avatar" />
          )}
          <div>
            <div className="strava-head-name">{data.athlete?.name}</div>
            <div className="strava-head-sub">
              <svg className="strava-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0 3 13.828h4.17" />
              </svg>
              Strava · {activities.length} dernières séances
            </div>
          </div>
        </div>
        <button className="strava-disconnect" onClick={disconnect} disabled={disconnecting}>
          {disconnecting ? '…' : 'Déconnecter'}
        </button>
      </div>

      {/* Liste des activités */}
      {activities.length === 0 ? (
        <div className="strava-empty">Aucune activité enregistrée sur Strava pour l&apos;instant.</div>
      ) : (
        <div className="strava-activities">
          {activities.map(a => {
            const icon = SPORT_ICON[a.type] ?? '🏅';
            const dist = fmtDistance(a.distance, a.type);
            return (
              <div key={a.id} className="strava-activity">
                <div className="strava-act-icon">{icon}</div>
                <div className="strava-act-body">
                  <div className="strava-act-name">{a.name}</div>
                  <div className="strava-act-date">{fmtDate(a.date)}</div>
                </div>
                <div className="strava-act-stats">
                  <span className="strava-stat">{fmtDuration(a.duration)}</span>
                  {dist && <span className="strava-stat">{dist}</span>}
                  {a.avgHr && <span className="strava-stat strava-hr">❤ {a.avgHr}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
