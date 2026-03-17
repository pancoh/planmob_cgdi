'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/lib/auth/client-session';
import AppShell from '@/components/layout/AppShell';
import { SessionData } from '@/types/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getClientSession();
    if (!s) {
      router.replace('/login');
    } else {
      setSession(s);
    }
    setLoading(false);
  }, [router]);

  if (loading || !session) return null;

  return <AppShell session={session}>{children}</AppShell>;
}
