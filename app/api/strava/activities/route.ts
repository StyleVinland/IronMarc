import { NextResponse } from 'next/server';
import { getStravaTokens, saveStravaTokens } from '@/lib/db';

async function refreshIfNeeded(tokens: NonNullable<ReturnType<typeof getStravaTokens>>) {
  const nowSec = Math.floor(Date.now() / 1000);
  if (tokens.expiresAt > nowSec + 300) return tokens.accessToken;

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type:    'refresh_token',
      refresh_token: tokens.refreshToken,
    }),
  });

  if (!res.ok) throw new Error('refresh_failed');

  const data = await res.json() as {
    access_token: string; refresh_token: string; expires_at: number;
  };

  saveStravaTokens({
    ...tokens,
    accessToken:  data.access_token,
    refreshToken: data.refresh_token,
    expiresAt:    data.expires_at,
  });

  return data.access_token;
}

export async function GET() {
  const tokens = getStravaTokens();
  if (!tokens) return NextResponse.json({ connected: false }, { status: 401 });

  let accessToken: string;
  try {
    accessToken = await refreshIfNeeded(tokens);
  } catch {
    return NextResponse.json({ connected: false, error: 'token_refresh_failed' }, { status: 401 });
  }

  const res = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=10',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return NextResponse.json({ connected: false, error: 'fetch_failed' }, { status: 502 });

  const raw = await res.json() as Array<{
    id: number; name: string; sport_type: string; start_date: string;
    elapsed_time: number; moving_time: number; distance: number;
    total_elevation_gain: number; average_heartrate?: number;
    average_speed: number;
  }>;

  const activities = raw.map(a => ({
    id:        a.id,
    name:      a.name,
    type:      a.sport_type,
    date:      a.start_date.slice(0, 10),
    duration:  a.moving_time,
    distance:  Math.round(a.distance),
    elevation: Math.round(a.total_elevation_gain),
    avgHr:     a.average_heartrate ? Math.round(a.average_heartrate) : null,
    avgSpeed:  Math.round(a.average_speed * 3.6 * 10) / 10,
  }));

  return NextResponse.json({
    connected: true,
    athlete: {
      name:   tokens.athleteName,
      avatar: tokens.athleteAvatar,
    },
    activities,
  });
}
