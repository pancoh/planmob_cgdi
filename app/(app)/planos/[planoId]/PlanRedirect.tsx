'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PlanRedirect() {
  const router = useRouter();
  const params = useParams();
  const planoId = params.planoId as string;

  useEffect(() => {
    router.replace(`/planos/${planoId}/capitulos/apresentacao`);
  }, [router, planoId]);

  return null;
}
