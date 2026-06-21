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

  // Données 6 dernières semaines (lundi→dimanche)
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // lundi = 0
  const thisMonday = new Date(now);
  thisMonday.setDate(thisMonday.getDate() - dow);
  thisMonday.setHours(0, 0, 0, 0);

  const weekly = Array.from({ length: 6 }, (_, i) => {
    const wStart = new Date(thisMonday);
    wStart.setDate(wStart.getDate() - (5 - i) * 7);
    const wEnd = new Date(wStart);
    wEnd.setDate(wEnd.getDate() + 7);

    let wCount = 0, wXp = 0;
    for (const d of debriefs) {
      const dDate = new Date(d.date + 'T12:00:00');
      if (dDate >= wStart && dDate < wEnd && ['done', 'modified'].includes(d.status)) {
        const session = SESSIONS[d.session_id];
        wXp += computeXp(session?.type ?? 'unknown', d.status, d.notes);
        wCount++;
      }
    }
    const label = `${wStart.getDate()}/${wStart.getMonth() + 1}`;
    return { label, count: wCount, xp: wXp };
  });

  return NextResponse.json({ total, count, weekly });
}
