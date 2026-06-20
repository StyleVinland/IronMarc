import { NextRequest, NextResponse } from 'next/server';
import { upsertDay } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  const body = await request.json();
  upsertDay(params.date, body);
  return NextResponse.json({ ok: true });
}
