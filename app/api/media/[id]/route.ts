import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getMediaRow, deleteMedia } from '@/lib/db';

const MEDIA_DIR = path.join(process.cwd(), 'storage', 'media');

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const row = getMediaRow(parseInt(params.id, 10));
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const filepath = path.join(MEDIA_DIR, row.filename);
  if (!existsSync(filepath)) return NextResponse.json({ error: 'File missing' }, { status: 404 });

  const buffer = await readFile(filepath);
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': row.mime_type,
      'Content-Disposition': `inline; filename="${row.original_name}"`,
      'Cache-Control': 'private, max-age=31536000',
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const filename = deleteMedia(parseInt(params.id, 10));
  if (!filename) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const filepath = path.join(MEDIA_DIR, filename);
  if (existsSync(filepath)) await unlink(filepath);

  return NextResponse.json({ ok: true });
}
