import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const base     = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  if (!clientId) {
    return NextResponse.json({ error: 'STRAVA_CLIENT_ID non configuré' }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  `${base}/api/strava/callback`,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,activity:read_all',
  });

  return NextResponse.redirect(`https://www.strava.com/oauth/authorize?${params}`);
}
