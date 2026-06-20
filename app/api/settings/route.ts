import { NextRequest, NextResponse } from 'next/server';
import { setSetting } from '@/lib/db';

export async function PATCH(request: NextRequest) {
  const body = await request.json() as Record<string, string>;
  for (const [key, value] of Object.entries(body)) setSetting(key, String(value));
  return NextResponse.json({ ok: true });
}
