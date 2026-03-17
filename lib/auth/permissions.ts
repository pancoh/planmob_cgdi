import { UserRole } from '@/types/auth';
import { PlanStatus } from '@/types/plano';
import { hasPermission } from '@/lib/constants/perfis';

export function canEditPlan(role: UserRole, status: PlanStatus): boolean {
  if (!hasPermission(role, 'edit_chapters')) return false;
  return status === 'rascunho' || status === 'em_elaboracao';
}

export function canExportPlan(role: UserRole): boolean {
  return hasPermission(role, 'export');
}

export function canManagePlans(role: UserRole): boolean {
  return hasPermission(role, 'manage_plans');
}

export function canAccessAdmin(role: UserRole): boolean {
  return role === 'administrador';
}
