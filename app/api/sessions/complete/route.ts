import { NextRequest, NextResponse } from 'next/server';
import { getSessionCompletion, saveSessionCompletion } from '@/lib/db';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return NextResponse.json(null);
  return NextResponse.json(getSessionCompletion(date) ?? null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  saveSessionCompletion({
    date: body.date,
    session_id: body.session_id,
    xp: body.xp ?? 0,
    pain_aine: body.pain_aine ?? 0,
    pain_tibia: body.pain_tibia ?? 0,
  });
  return NextResponse.json({ ok: true });
}
