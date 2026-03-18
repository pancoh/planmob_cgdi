import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { updateAnexoCaption } from '@/lib/db/queries';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ planoId: string; anexoId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { anexoId } = await params;

  let body: { caption?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.caption === undefined) {
    return NextResponse.json({ error: 'caption é obrigatório' }, { status: 400 });
  }

  await updateAnexoCaption(anexoId, body.caption);

  return NextResponse.json({ ok: true });
}
