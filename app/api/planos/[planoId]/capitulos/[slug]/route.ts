import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getCapituloData, upsertCapituloData } from '@/lib/db/queries';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ planoId: string; slug: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planoId, slug } = await params;
  const data = await getCapituloData(planoId, slug);

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ planoId: string; slug: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planoId, slug } = await params;

  let body: { data?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.data) {
    return NextResponse.json({ error: 'Campo data é obrigatório' }, { status: 400 });
  }

  await upsertCapituloData(planoId, slug, body.data);

  return NextResponse.json({ ok: true });
}
