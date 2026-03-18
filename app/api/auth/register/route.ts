import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServerClient } from '@/lib/db/supabase';
import { getAllPrefeituras } from '@/lib/db/queries';

export async function GET() {
  const prefeituras = await getAllPrefeituras();
  return NextResponse.json(prefeituras);
}

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Servidor não configurado' }, { status: 503 });
  }

  let body: {
    name?: string;
    email?: string;
    password?: string;
    prefeituraId?: string;
    role?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { name, email, password, prefeituraId, role } = body;

  if (!name || !email || !password || !prefeituraId || !role) {
    return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Verificar se email já existe
  const { data: existing } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Este e-mail já está cadastrado' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from('usuarios').insert({
    name,
    email,
    password_hash: passwordHash,
    role,
    prefeitura_id: prefeituraId,
    active: false,
  });

  if (error) {
    console.error('[register]', error);
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
