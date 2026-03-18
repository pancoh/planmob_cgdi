import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAllPrefeituras } from '@/lib/db/queries';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.role !== 'administrador') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const prefeituras = await getAllPrefeituras();
  return NextResponse.json(prefeituras);
}
