import { NextRequest, NextResponse } from 'next/server';
import { getStravaTokens, saveStravaTokens } from '@/lib/db';

async function refreshIfNeeded(tokens: NonNullable<ReturnType<typeof getStravaTokens>>) {
  const nowSec = Math.floor(Date.now() / 1000);
  if (tokens.expiresAt > nowSec + 300) return tokens.accessToken;
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: process.env.STRAVA_CLIENT_ID, client_secret: process.env.STRAVA_CLIENT_SECRET, grant_type: 'refresh_token', refresh_token: tokens.refreshToken }),
  });
  if (!res.ok) throw new Error('refresh_failed');
  const data = await res.json() as { access_token: string; refresh_token: string; expires_at: number };
  saveStravaTokens({ ...tokens, accessToken: data.access_token, refreshToken: data.refresh_token, expiresAt: data.expires_at });
  return data.access_token;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tokens = getStravaTokens();
  if (!tokens) return NextResponse.json({ error: 'not_connected' }, { status: 401 });

  let accessToken: string;
  try { accessToken = await refreshIfNeeded(tokens); }
  catch { return NextResponse.json({ error: 'token_refresh_failed' }, { status: 401 }); }

  const [actRes, photosRes] = await Promise.all([
    fetch(`https://www.strava.com/api/v3/activities/${params.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    fetch(`https://www.strava.com/api/v3/activities/${params.id}/photos?size=600`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  if (!actRes.ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const act = await actRes.json() as {
    id: number; name: string; sport_type: string; start_date: string;
    moving_time: number; elapsed_time: number; distance: number;
    total_elevation_gain: number; average_heartrate?: number; max_heartrate?: number;
    average_speed: number; max_speed?: number; average_watts?: number;
    description?: string;
    gear?: { id: string; name: string; brand_name?: string; model_name?: string };
    map: { polyline?: string; summary_polyline?: string };
    start_latlng?: [number, number];
    calories?: number;
  };

  // Fetch gear details if available
  let gear: { name: string; brand: string | null; model: string | null } | null = null;
  if (act.gear?.id && act.gear.id !== 'none' && act.gear.id !== '') {
    try {
      const gearRes = await fetch(`https://www.strava.com/api/v3/gear/${act.gear.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (gearRes.ok) {
        const g = await gearRes.json() as { name: string; brand_name?: string; model_name?: string };
        gear = { name: act.gear.name || g.name, brand: g.brand_name ?? null, model: g.model_name ?? null };
      }
    } catch {}
    if (!gear && act.gear.name) gear = { name: act.gear.name, brand: null, model: null };
  }

  // Photos
  let photos: string[] = [];
  if (photosRes.ok) {
    const raw = await photosRes.json() as Array<{ urls: Record<string, string> }>;
    photos = raw.map(p => p.urls?.['600'] ?? p.urls?.['256'] ?? '').filter(Boolean);
  }

  return NextResponse.json({
    id: act.id,
    name: act.name,
    type: act.sport_type,
    date: act.start_date.slice(0, 10),
    duration: act.moving_time,
    distance: Math.round(act.distance),
    elevation: Math.round(act.total_elevation_gain),
    avgHr:   act.average_heartrate ? Math.round(act.average_heartrate) : null,
    maxHr:   act.max_heartrate     ? Math.round(act.max_heartrate)     : null,
    avgSpeed: Math.round(act.average_speed * 3.6 * 10) / 10,
    calories: act.calories ?? null,
    description: act.description?.trim() || null,
    gear,
    photos,
    polyline: act.map?.polyline ?? act.map?.summary_polyline ?? null,
    startLat: act.start_latlng?.[0] ?? null,
    startLng: act.start_latlng?.[1] ?? null,
  });
}
