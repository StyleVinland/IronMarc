import { NextRequest, NextResponse } from 'next/server';
import { getDebrief, saveDebrief } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { date: string } }
) {
  const data = getDebrief(params.date);
  return NextResponse.json(data ?? null);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  const body = await request.json();
  saveDebrief(params.date, body);
  return NextResponse.json({ ok: true });
}
