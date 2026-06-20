import { NextRequest, NextResponse } from 'next/server';
import { toggleMission } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { date: string; id: string } }
) {
  const { completed } = await request.json() as { completed: boolean };
  toggleMission(params.date, params.id, completed);
  return NextResponse.json({ ok: true });
}
