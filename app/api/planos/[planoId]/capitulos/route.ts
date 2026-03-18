import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAllCapitulosData } from '@/lib/db/queries';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ planoId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planoId } = await params;
  const data = await getAllCapitulosData(planoId);

  return NextResponse.json(data);
}
