import { NextRequest, NextResponse } from 'next/server';
import { saveStravaTokens } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code  = searchParams.get('code');
  const error = searchParams.get('error');
  const base  = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  if (error || !code) {
    return NextResponse.redirect(`${base}/entrainement?strava=denied`);
  }

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    return NextResponse.redirect(`${base}/entrainement?strava=error`);
  }

  const data = await res.json() as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    athlete: { id: number; firstname: string; lastname: string; profile_medium: string };
  };

  saveStravaTokens({
    accessToken:   data.access_token,
    refreshToken:  data.refresh_token,
    expiresAt:     data.expires_at,
    athleteId:     data.athlete.id,
    athleteName:   `${data.athlete.firstname} ${data.athlete.lastname}`,
    athleteAvatar: data.athlete.profile_medium ?? '',
  });

  return NextResponse.redirect(`${base}/entrainement?strava=connected`);
}
