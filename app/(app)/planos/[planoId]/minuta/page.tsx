import { PLAN_IDS } from '@/lib/constants/static-params';
import MinutaClient from './MinutaClient';

export function generateStaticParams() {
  return PLAN_IDS.map((planoId) => ({ planoId }));
}

export default function MinutaPage() {
  return <MinutaClient />;
}
