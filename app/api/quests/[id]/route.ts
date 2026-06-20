import { NextRequest, NextResponse } from 'next/server';
import { toggleQuest } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { completed } = await request.json() as { completed: boolean };
  toggleQuest(params.id, completed);
  return NextResponse.json({ ok: true });
}
