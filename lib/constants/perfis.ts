import { UserRole } from '@/types/auth';

export type RoleConfig = {
  label: string;
  description: string;
  permissions: string[];
};

export const ROLES: Record<UserRole, RoleConfig> = {
  administrador: {
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: ['manage_users', 'manage_prefeituras', 'manage_plans', 'edit_chapters', 'view_minuta', 'export', 'review'],
  },
  coordenador_municipal: {
    label: 'Coordenador Municipal',
    description: 'Cria e gerencia planos, envia para revisão e exporta',
    permissions: ['manage_plans', 'edit_chapters', 'view_minuta', 'export', 'review'],
  },
  tecnico_editor: {
    label: 'Técnico Editor',
    description: 'Edita capítulos e gerencia anexos',
    permissions: ['edit_chapters', 'view_minuta'],
  },
  revisor_leitura: {
    label: 'Revisor (Leitura)',
    description: 'Visualiza minuta sem editar',
    permissions: ['view_minuta'],
  },
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLES[role].permissions.includes(permission);
}
