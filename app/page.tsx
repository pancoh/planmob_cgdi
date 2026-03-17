'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/lib/auth/client-session';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const session = getClientSession();
    if (session) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
