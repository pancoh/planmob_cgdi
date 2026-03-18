import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getPlanoById } from '@/lib/db/queries';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ planoId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planoId } = await params;
  const plan = await getPlanoById(planoId);

  if (!plan) {
    return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 });
  }

  // Non-admin can only access plans from their own prefeitura
  if (session.role !== 'administrador' && plan.prefeituraId !== session.prefeituraId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(plan);
}
