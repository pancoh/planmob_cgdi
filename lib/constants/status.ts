import { PlanStatus } from '@/types/plano';

export type StatusConfig = {
  label: string;
  badgeClass: string;
  editable: boolean;
};

export const PLAN_STATUS: Record<PlanStatus, StatusConfig> = {
  rascunho: {
    label: 'Rascunho',
    badgeClass: 'badge-gray',
    editable: true,
  },
  em_elaboracao: {
    label: 'Em Elaboração',
    badgeClass: 'badge-blue',
    editable: true,
  },
  em_revisao: {
    label: 'Em Revisão',
    badgeClass: 'badge-amber',
    editable: false,
  },
  pronto_para_exportacao: {
    label: 'Pronto para Exportação',
    badgeClass: 'badge-green',
    editable: false,
  },
  concluido: {
    label: 'Concluído',
    badgeClass: 'badge-green',
    editable: false,
  },
};
