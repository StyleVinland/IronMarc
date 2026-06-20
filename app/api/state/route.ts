import { NextResponse } from 'next/server';
import { getFullState, resetAll } from '@/lib/db';

export function GET() {
  return NextResponse.json(getFullState());
}

export function DELETE() {
  resetAll();
  return NextResponse.json({ ok: true });
}
