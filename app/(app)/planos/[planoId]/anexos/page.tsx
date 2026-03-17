import { PLAN_IDS } from '@/lib/constants/static-params';
import AnexosClient from './AnexosClient';

export function generateStaticParams() {
  return PLAN_IDS.map((planoId) => ({ planoId }));
}

export default function AnexosPage() {
  return <AnexosClient />;
}
