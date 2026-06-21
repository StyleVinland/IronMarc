import { NextResponse } from 'next/server';
import { clearStravaTokens } from '@/lib/db';

export async function DELETE() {
  clearStravaTokens();
  return NextResponse.json({ ok: true });
}
