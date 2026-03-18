import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createServerClient } from '@/lib/db/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'administrador') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  if (typeof body.active !== 'boolean') {
    return NextResponse.json({ error: 'Campo "active" obrigatório' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from('usuarios')
    .update({ active: body.active })
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
