import { PLAN_IDS } from '@/lib/constants/static-params';
import SeedClient from './SeedClient';

export function generateStaticParams() {
  return PLAN_IDS.map((planoId) => ({ planoId }));
}

export default function SeedPage() {
  return <SeedClient />;
}
