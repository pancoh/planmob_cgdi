export type UserRole = 'administrador' | 'coordenador_municipal' | 'tecnico_editor' | 'revisor_leitura';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  prefeituraId: string;
  prefeituraName: string;
  active: boolean;
  createdAt: string;
};

export type SessionData = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  prefeituraId: string;
  prefeituraName: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Prefeitura = {
  id: string;
  name: string;
  uf: string;
  codigoIbge?: string;
  active: boolean;
  createdAt: string;
};
