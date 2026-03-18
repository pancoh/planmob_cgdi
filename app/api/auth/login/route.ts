import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/db/queries';
import { createSession } from '@/lib/auth/session';
import { SessionData } from '@/types/auth';

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Servidor não configurado: variáveis SUPABASE ausentes no .env.local' }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
  }

  let user;
  try {
    user = await getUserByEmail(email);
  } catch (err) {
    console.error('[login] DB error:', err);
    return NextResponse.json({ error: 'Erro ao consultar banco de dados' }, { status: 500 });
  }

  if (!user || !user.active) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  const sessionData: SessionData = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    prefeituraId: user.prefeitura_id,
    prefeituraName: user.prefeituraName,
  };

  await createSession(sessionData);

  return NextResponse.json({ user: sessionData });
}
