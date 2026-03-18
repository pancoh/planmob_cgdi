import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAllPlanos, getPlanosByPrefeitura, createPlano } from '@/lib/db/queries';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const plans =
    session.role === 'administrador'
      ? await getAllPlanos()
      : await getPlanosByPrefeitura(session.prefeituraId);

  return NextResponse.json(plans);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    title?: string;
    anoReferencia?: number;
    orgaoResponsavel?: string;
    coordenador?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { title, anoReferencia, orgaoResponsavel, coordenador } = body;

  if (!title || !anoReferencia || !orgaoResponsavel || !coordenador) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
  }

  const plan = await createPlano({
    title,
    ano_referencia: anoReferencia,
    orgao_responsavel: orgaoResponsavel,
    coordenador,
    prefeitura_id: session.prefeituraId,
  });

  if (!plan) {
    return NextResponse.json({ error: 'Erro ao criar plano' }, { status: 500 });
  }

  return NextResponse.json(plan, { status: 201 });
}
