import { PlanStatus } from '@/types/plano';
import { PLAN_STATUS } from '@/lib/constants/status';

export default function StatusBadge({ status }: { status: PlanStatus }) {
  const config = PLAN_STATUS[status];
  return <span className={`badge ${config.badgeClass}`}>{config.label}</span>;
}
