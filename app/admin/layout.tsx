'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/lib/auth/client-session';
import AdminShell from '@/components/layout/AdminShell';
import { SessionData } from '@/types/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getClientSession();
    if (!s) {
      router.replace('/login');
    } else if (s.role !== 'administrador') {
      router.replace('/dashboard');
    } else {
      setSession(s);
    }
    setLoading(false);
  }, [router]);

  if (loading || !session) return null;

  return <AdminShell session={session}>{children}</AdminShell>;
}
