export type PlanStatus = 'rascunho' | 'em_elaboracao' | 'em_revisao' | 'pronto_para_exportacao' | 'concluido';

export type Plan = {
  id: string;
  title: string;
  anoReferencia: number;
  orgaoResponsavel: string;
  coordenador: string;
  prefeituraId: string;
  prefeituraName: string;
  uf: string;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
};

export type ChapterType = 'text-free' | 'structured' | 'review';

export type ChapterField = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'boolean' | 'checkbox-group' | 'radio';
  options?: string[];
};

export type ChapterDefinition = {
  slug: string;
  order: number;
  title: string;
  shortTitle: string;
  type: ChapterType;
  note?: string;
  fields?: ChapterField[];
  objectives?: string[];
  suggestedGoals?: string[];
  suggestedActions?: string[];
  reviewFields?: ChapterField[];
};

// Data stored per chapter
export type TextFreeData = {
  [fieldKey: string]: string;
};

export type ObjectiveData = {
  selected: string[];
  other: string;
};

export type GoalItem = {
  theme: string;
  checked: boolean;
  specification: string;
  quantity: string;
  deadline: string;
};

export type ActionItem = {
  theme: string;
  checked: boolean;
  specification: string;
};

export type StructuredChapterData = {
  diagnosis: string;
  objectives: ObjectiveData;
  goals: GoalItem[];
  goalsOther: { theme: string; specification: string; quantity: string; deadline: string }[];
  actions: ActionItem[];
  actionsOther: { theme: string; specification: string }[];
};

export type ReviewChapterData = {
  prazoAtualizacao: string;
  revisoesPeriodicasSim: boolean;
  avaliacaoSelected: string[];
  avaliacaoOther: string;
  orgaoResponsavel: string;
  instrumentoNormativo: string[];
};

export type ChapterData = TextFreeData | StructuredChapterData | ReviewChapterData;

export type Attachment = {
  id: string;
  planoId: string;
  capituloSlug: string;
  name: string;
  type: string;
  size: number;
  caption: string;
  dataUrl?: string;
  publicUrl?: string;
  storagePath?: string;
  createdAt: string;
};
