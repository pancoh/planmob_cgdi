import { PLAN_IDS } from '@/lib/constants/static-params';
import PlanRedirect from './PlanRedirect';

export function generateStaticParams() {
  return PLAN_IDS.map((planoId) => ({ planoId }));
}

export default function PlanPage() {
  return <PlanRedirect />;
}
