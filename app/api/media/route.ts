import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { insertMedia, listMedia } from '@/lib/db';

const MEDIA_DIR = path.join(process.cwd(), 'storage', 'media');

export function GET() {
  return NextResponse.json(listMedia());
}

export async function POST(request: NextRequest) {
  if (!existsSync(MEDIA_DIR)) await mkdir(MEDIA_DIR, { recursive: true });

  const formData = await request.formData();
  const files = formData.getAll('files') as File[];
  const date = (formData.get('date') as string) || new Date().toLocaleDateString('fr-CA');
  const note = (formData.get('note') as string) || '';

  if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 });

  const inserted: number[] = [];
  for (const file of files) {
    const ext = file.name.split('.').pop() ?? 'bin';
    const filename = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(MEDIA_DIR, filename), buffer);
    const id = insertMedia({ date, filename, originalName: file.name, mimeType: file.type, note, size: file.size });
    inserted.push(id);
  }

  return NextResponse.json({ inserted });
}
