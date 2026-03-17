import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/mock-data';
import { createSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  if (!user.active) {
    return NextResponse.json({ error: 'Usuário inativo' }, { status: 403 });
  }

  // Mock: accept any password for demo users
  // In production: compare with bcryptjs
  if (password.length < 3) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    prefeituraId: user.prefeituraId,
    prefeituraName: user.prefeituraName,
  });

  return NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
}
