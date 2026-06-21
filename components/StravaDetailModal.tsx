'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { decodePolyline } from '@/lib/polyline';

interface DetailActivity {
  id: number; name: string; type: string; date: string;
  duration: number; distance: number; elevation: number;
  avgHr: number | null; maxHr: number | null; avgSpeed: number;
  calories: number | null; description: string | null;
  gear: { name: string; brand: string | null; model: string | null } | null;
  photos: string[]; polyline: string | null;
  startLat: number | null; startLng: number | null;
}

const TYPE_LABEL: Record<string, string> = {
  Run: 'Course', VirtualRun: 'Course', TrailRun: 'Trail',
  Ride: 'Vélo', VirtualRide: 'Vélo', EBikeRide: 'Vélo',
  Swim: 'Nage', WeightTraining: 'Musculation',
  Workout: 'Séance', Yoga: 'Yoga', Walk: 'Marche', Hike: 'Rando',
};
const TYPE_ICON: Record<string, string> = {
  Run: '🏃', VirtualRun: '🏃', TrailRun: '🏔️',
  Ride: '🚴', VirtualRide: '🚴', EBikeRide: '⚡',
  Swim: '🏊', WeightTraining: '🏋️', Workout: '💪',
  Yoga: '🧘', Walk: '🚶', Hike: '🥾',
};
const GEAR_ICON: Record<string, string> = {
  Run: '👟', TrailRun: '👟', Ride: '🚴', VirtualRide: '🚴',
  Swim: '🥽', WeightTraining: '🏋️',
};

function fmtDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
function fmtPace(sec: number, distM: number) {
  if (distM < 10) return null;
  const sPerKm = sec / (distM / 1000);
  return `${Math.floor(sPerKm / 60)}:${Math.round(sPerKm % 60).toString().padStart(2, '0')} /km`;
}
function fmtSwimPace(sec: number, distM: number) {
  if (distM < 10) return null;
  const s = sec / (distM / 100);
  return `${Math.floor(s / 60)}:${Math.round(s % 60).toString().padStart(2, '0')} /100m`;
}

function Metrics({ a }: { a: DetailActivity }) {
  const isRun  = ['Run','VirtualRun','TrailRun'].includes(a.type);
  const isRide = ['Ride','VirtualRide','EBikeRide'].includes(a.type);
  const isSwim = a.type === 'Swim';

  const items: Array<{ label: string; value: string }> = [];
  if (isRun || isRide) {
    if (a.distance > 0) items.push({ label: 'Distance', value: `${(a.distance / 1000).toFixed(2)} km` });
    items.push({ label: 'Durée', value: fmtDuration(a.duration) });
    if (isRun && a.distance > 0) { const p = fmtPace(a.duration, a.distance); if (p) items.push({ label: 'Allure moy.', value: p }); }
    if (isRide && a.avgSpeed > 0) items.push({ label: 'Vitesse moy.', value: `${a.avgSpeed} km/h` });
    if (a.elevation > 0) items.push({ label: 'Dénivelé +', value: `${a.elevation} m` });
    if (a.avgHr) items.push({ label: 'FC moyenne', value: `${a.avgHr} bpm` });
    if (a.maxHr) items.push({ label: 'FC max', value: `${a.maxHr} bpm` });
    if (a.calories) items.push({ label: 'Calories', value: `${a.calories} kcal` });
  } else if (isSwim) {
    if (a.distance > 0) items.push({ label: 'Distance', value: `${a.distance} m` });
    items.push({ label: 'Durée', value: fmtDuration(a.duration) });
    if (a.distance > 0) { const p = fmtSwimPace(a.duration, a.distance); if (p) items.push({ label: 'Allure', value: p }); }
    if (a.calories) items.push({ label: 'Calories', value: `${a.calories} kcal` });
  } else {
    items.push({ label: 'Durée', value: fmtDuration(a.duration) });
    if (a.distance > 0) items.push({ label: 'Distance', value: `${(a.distance / 1000).toFixed(1)} km` });
    if (a.avgHr) items.push({ label: 'FC moyenne', value: `${a.avgHr} bpm` });
    if (a.calories) items.push({ label: 'Calories', value: `${a.calories} kcal` });
  }

  return (
    <div className="sdm-metrics">
      {items.map(m => (
        <div key={m.label} className="sdm-metric">
          <div className="sdm-metric-val">{m.value}</div>
          <div className="sdm-metric-lbl">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

function LeafletMap({ polyline }: { polyline: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let map: { remove: () => void } | null = null;

    import('leaflet').then(L => {
      const coords = decodePolyline(polyline) as [number, number][];
      if (coords.length === 0) return;

      map = L.map(el, { zoomControl: true, scrollWheelZoom: false });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map as Parameters<typeof L.tileLayer>[1] extends undefined ? never : never extends never ? never : typeof map);

      const route = L.polyline(coords, { color: '#FC4C02', weight: 4, opacity: 0.9 }).addTo(
        map as Parameters<typeof L.polyline>[1] extends undefined ? never : never extends never ? never : typeof map
      );

      // Start (green) + End (red)
      L.circleMarker(coords[0], { radius: 7, fillColor: '#30d158', fillOpacity: 1, color: '#fff', weight: 2 }).addTo(
        map as Parameters<typeof L.circleMarker>[1] extends undefined ? never : never extends never ? never : typeof map
      );
      L.circleMarker(coords[coords.length - 1], { radius: 7, fillColor: '#ff453a', fillOpacity: 1, color: '#fff', weight: 2 }).addTo(
        map as Parameters<typeof L.circleMarker>[1] extends undefined ? never : never extends never ? never : typeof map
      );

      (map as unknown as { fitBounds: (b: unknown, o: object) => void }).fitBounds(
        (route as unknown as { getBounds: () => unknown }).getBounds(),
        { padding: [24, 24] }
      );
    });

    return () => { if (map) map.remove(); };
  }, [polyline]);

  return <div ref={ref} className="sdm-map" />;
}

export default function StravaDetailModal({
  activityId,
  onClose,
}: {
  activityId: number;
  onClose: () => void;
}) {
  const [activity, setActivity] = useState<DetailActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    fetch(`/api/strava/activity/${activityId}`)
      .then(r => r.json())
      .then(setActivity)
      .finally(() => setLoading(false));
  }, [activityId]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const typeLabel = activity ? (TYPE_LABEL[activity.type] ?? activity.type) : '';
  const typeIcon  = activity ? (TYPE_ICON[activity.type] ?? '🏅') : '';
  const gearIcon  = activity ? (GEAR_ICON[activity.type] ?? '⚙️') : '';

  const modal = (
    <div className="sdm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sdm-panel">

        {/* Header */}
        <div className="sdm-header">
          {activity && (
            <>
              <span className="sdm-type-badge">
                <span>{typeIcon}</span>{typeLabel}
              </span>
              <div className="sdm-header-info">
                <div className="sdm-name">{activity.name}</div>
                <div className="sdm-date">{fmtDate(activity.date)}</div>
              </div>
            </>
          )}
          <button className="sdm-close" onClick={onClose}>✕</button>
        </div>

        <div className="sdm-body">
          {loading && <div className="sdm-loading">Chargement…</div>}

          {activity && (
            <>
              {/* Map */}
              {activity.polyline ? (
                <LeafletMap polyline={activity.polyline} />
              ) : (
                <div className="sdm-no-map">Pas de tracé GPS disponible</div>
              )}

              {/* Photos */}
              {activity.photos.length > 0 && (
                <div className="sdm-photos">
                  <div className="sdm-photo-main">
                    <img
                      src={activity.photos[photoIdx]}
                      alt=""
                      className="sdm-photo-img"
                    />
                    {activity.photos.length > 1 && (
                      <div className="sdm-photo-nav">
                        {activity.photos.map((_, i) => (
                          <button
                            key={i}
                            className={`sdm-photo-dot${i === photoIdx ? ' active' : ''}`}
                            onClick={() => setPhotoIdx(i)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Métriques */}
              <div className="sdm-section">
                <Metrics a={activity} />
              </div>

              {/* Description */}
              {activity.description && (
                <div className="sdm-section">
                  <div className="sdm-section-title">Description</div>
                  <div className="sdm-description">{activity.description}</div>
                </div>
              )}

              {/* Équipement */}
              {activity.gear && (
                <div className="sdm-section">
                  <div className="sdm-section-title">Équipement</div>
                  <div className="sdm-gear">
                    <span className="sdm-gear-icon">{gearIcon}</span>
                    <div>
                      <div className="sdm-gear-name">{activity.gear.name}</div>
                      {(activity.gear.brand || activity.gear.model) && (
                        <div className="sdm-gear-sub">
                          {[activity.gear.brand, activity.gear.model].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
