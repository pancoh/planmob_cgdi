import { User, Prefeitura } from '@/types/auth';
import { Plan } from '@/types/plano';

export const MOCK_PREFEITURAS: Prefeitura[] = [
  {
    id: 'pref-1',
    name: 'Jaraguá',
    uf: 'GO',
    codigoIbge: '5211800',
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'pref-2',
    name: 'Itapuranga',
    uf: 'GO',
    codigoIbge: '5211305',
    active: true,
    createdAt: '2025-02-20T10:00:00Z',
  },
];

export const MOCK_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user-1',
    name: 'Admin Sistema',
    email: 'admin@planmob.gov.br',
    role: 'administrador',
    prefeituraId: 'pref-1',
    prefeituraName: 'Jaraguá',
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    passwordHash: '$2a$10$8K1p/a0dR1xqM8K3hF1J5O3Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', // admin123
  },
  {
    id: 'user-2',
    name: 'Maria Silva',
    email: 'coordenador@planmob.gov.br',
    role: 'coordenador_municipal',
    prefeituraId: 'pref-1',
    prefeituraName: 'Jaraguá',
    active: true,
    createdAt: '2025-01-20T10:00:00Z',
    passwordHash: '$2a$10$8K1p/a0dR1xqM8K3hF1J5O3Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', // coord123
  },
  {
    id: 'user-3',
    name: 'João Santos',
    email: 'tecnico@planmob.gov.br',
    role: 'tecnico_editor',
    prefeituraId: 'pref-1',
    prefeituraName: 'Jaraguá',
    active: true,
    createdAt: '2025-02-01T10:00:00Z',
    passwordHash: '$2a$10$8K1p/a0dR1xqM8K3hF1J5O3Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', // tecnico123
  },
  {
    id: 'user-4',
    name: 'Ana Oliveira',
    email: 'revisor@planmob.gov.br',
    role: 'revisor_leitura',
    prefeituraId: 'pref-2',
    prefeituraName: 'Itapuranga',
    active: true,
    createdAt: '2025-03-01T10:00:00Z',
    passwordHash: '$2a$10$8K1p/a0dR1xqM8K3hF1J5O3Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', // revisor123
  },
];

export const MOCK_PLANS: Plan[] = [
  {
    id: 'plan-1',
    title: 'Plano de Mobilidade Urbana de Jaraguá',
    anoReferencia: 2025,
    orgaoResponsavel: 'Secretaria Municipal de Infraestrutura e Mobilidade',
    coordenador: 'Maria Silva',
    prefeituraId: 'pref-1',
    prefeituraName: 'Jaraguá',
    uf: 'GO',
    status: 'em_elaboracao',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-06-15T14:30:00Z',
  },
  {
    id: 'plan-2',
    title: 'Plano de Mobilidade Urbana de Itapuranga',
    anoReferencia: 2025,
    orgaoResponsavel: 'Secretaria de Obras e Urbanismo',
    coordenador: 'Carlos Mendes',
    prefeituraId: 'pref-2',
    prefeituraName: 'Itapuranga',
    uf: 'GO',
    status: 'rascunho',
    createdAt: '2025-05-10T10:00:00Z',
    updatedAt: '2025-05-10T10:00:00Z',
  },
];

// For demo login — accept any password for mock users
export function findUserByEmail(email: string) {
  return MOCK_USERS.find((u) => u.email === email);
}
