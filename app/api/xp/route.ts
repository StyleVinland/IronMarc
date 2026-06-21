import { NextResponse } from 'next/server';
import { getAllSessionCompletions } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const completions = getAllSessionCompletions();
  const total = completions.reduce((s, c) => s + c.xp, 0);
  const count = completions.length;

  const now = new Date();
  const dow = (now.getDay() + 6) % 7;
  const thisMonday = new Date(now);
  thisMonday.setDate(thisMonday.getDate() - dow);
  thisMonday.setHours(0, 0, 0, 0);

  const weekly = Array.from({ length: 6 }, (_, i) => {
    const wStart = new Date(thisMonday);
    wStart.setDate(wStart.getDate() - (5 - i) * 7);
    const wEnd = new Date(wStart);
    wEnd.setDate(wEnd.getDate() + 7);
    let wCount = 0, wXp = 0;
    for (const c of completions) {
      const d = new Date(c.date + 'T12:00:00');
      if (d >= wStart && d < wEnd) { wCount++; wXp += c.xp; }
    }
    return { label: `${wStart.getDate()}/${wStart.getMonth() + 1}`, count: wCount, xp: wXp };
  });

  return NextResponse.json({ total, count, weekly }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
