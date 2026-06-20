import { NextRequest, NextResponse } from 'next/server';
import { getLastDebriefBySession } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id') ?? '';
  const before    = searchParams.get('before') ?? '';
  const data = getLastDebriefBySession(sessionId, before);
  return NextResponse.json(data ?? null);
}
