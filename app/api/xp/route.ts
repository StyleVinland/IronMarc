import { NextResponse } from 'next/server';
import { getAllDebriefs } from '@/lib/db';
import { SESSIONS } from '@/lib/program';
import { computeXp } from '@/lib/xp';

export async function GET() {
  const debriefs = getAllDebriefs();
  let total = 0;
  let count = 0;
  for (const d of debriefs) {
    const session = SESSIONS[d.session_id];
    const xp = computeXp(session?.type ?? 'unknown', d.status, d.notes);
    total += xp;
    if (['done', 'modified'].includes(d.status)) count++;
  }
  return NextResponse.json({ total, count });
}
