import { createServerClient } from './supabase';
import { Plan, PlanStatus } from '@/types/plano';
import { Prefeitura, User, UserRole } from '@/types/auth';

// ─── Usuários ─────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<{
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  prefeitura_id: string;
  active: boolean;
  prefeituraName: string;
  uf: string;
} | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, name, email, password_hash, role, prefeitura_id, active, prefeituras(name, uf)')
    .eq('email', email)
    .single();

  if (error || !data) return null;

  const pref = data.prefeituras as unknown as { name: string; uf: string } | null;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    password_hash: data.password_hash,
    role: data.role as UserRole,
    prefeitura_id: data.prefeitura_id,
    active: data.active,
    prefeituraName: pref?.name ?? '',
    uf: pref?.uf ?? '',
  };
}

// ─── Planos ───────────────────────────────────────────────────────────────────

type RawPlan = {
  id: string;
  title: string;
  ano_referencia: number;
  orgao_responsavel: string;
  coordenador: string;
  prefeitura_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  prefeituras: { name: string; uf: string } | null;
};

function mapPlan(item: RawPlan): Plan {
  return {
    id: item.id,
    title: item.title,
    anoReferencia: item.ano_referencia,
    orgaoResponsavel: item.orgao_responsavel,
    coordenador: item.coordenador,
    prefeituraId: item.prefeitura_id,
    prefeituraName: item.prefeituras?.name ?? '',
    uf: item.prefeituras?.uf ?? '',
    status: item.status as PlanStatus,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function getPlanosByPrefeitura(prefeituraId: string): Promise<Plan[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('planos')
    .select('*, prefeituras!inner(name, uf)')
    .eq('prefeitura_id', prefeituraId)
    .order('updated_at', { ascending: false });

  if (error || !data) return [];
  return (data as RawPlan[]).map(mapPlan);
}

export async function getAllPlanos(): Promise<Plan[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('planos')
    .select('*, prefeituras!inner(name, uf)')
    .order('updated_at', { ascending: false });

  if (error || !data) return [];
  return (data as RawPlan[]).map(mapPlan);
}

export async function getPlanoById(planoId: string): Promise<Plan | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('planos')
    .select('*, prefeituras!inner(name, uf)')
    .eq('id', planoId)
    .single();

  if (error || !data) return null;
  return mapPlan(data as RawPlan);
}

export async function createPlano(input: {
  title: string;
  ano_referencia: number;
  orgao_responsavel: string;
  coordenador: string;
  prefeitura_id: string;
}): Promise<Plan | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('planos')
    .insert({
      title: input.title,
      ano_referencia: input.ano_referencia,
      orgao_responsavel: input.orgao_responsavel,
      coordenador: input.coordenador,
      prefeitura_id: input.prefeitura_id,
      status: 'em_elaboracao',
    })
    .select('*, prefeituras!inner(name, uf)')
    .single();

  if (error || !data) return null;
  return mapPlan(data as RawPlan);
}

// ─── Capítulos ────────────────────────────────────────────────────────────────

export async function getCapituloData(
  planoId: string,
  slug: string,
): Promise<Record<string, unknown> | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('capitulos_data')
    .select('data')
    .eq('plano_id', planoId)
    .eq('capitulo_slug', slug)
    .single();

  if (error || !data) return null;
  return data.data as Record<string, unknown>;
}

export async function upsertCapituloData(
  planoId: string,
  slug: string,
  chapterData: Record<string, unknown>,
): Promise<void> {
  const supabase = createServerClient();
  await supabase
    .from('capitulos_data')
    .upsert(
      {
        plano_id: planoId,
        capitulo_slug: slug,
        data: chapterData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'plano_id,capitulo_slug' },
    );
}

export async function getAllCapitulosData(
  planoId: string,
): Promise<Record<string, Record<string, unknown>>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('capitulos_data')
    .select('capitulo_slug, data')
    .eq('plano_id', planoId);

  if (error || !data) return {};

  const result: Record<string, Record<string, unknown>> = {};
  for (const row of data) {
    result[row.capitulo_slug] = row.data as Record<string, unknown>;
  }
  return result;
}

// ─── Anexos ───────────────────────────────────────────────────────────────────

export type AnexoRecord = {
  id: string;
  plano_id: string;
  capitulo_slug: string;
  name: string;
  type: string;
  size: number;
  caption: string;
  storage_path: string;
  created_at: string;
};

export async function getAnexos(planoId: string): Promise<AnexoRecord[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('anexos')
    .select('*')
    .eq('plano_id', planoId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data as AnexoRecord[];
}

export async function createAnexo(input: {
  plano_id: string;
  capitulo_slug: string;
  name: string;
  type: string;
  size: number;
  caption: string;
  storage_path: string;
}): Promise<AnexoRecord | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('anexos')
    .insert(input)
    .select()
    .single();

  if (error || !data) return null;
  return data as AnexoRecord;
}

export async function deleteAnexo(id: string): Promise<void> {
  const supabase = createServerClient();
  await supabase.from('anexos').delete().eq('id', id);
}

export async function updateAnexoCaption(id: string, caption: string): Promise<void> {
  const supabase = createServerClient();
  await supabase.from('anexos').update({ caption }).eq('id', id);
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAllPrefeituras(): Promise<Prefeitura[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('prefeituras')
    .select('id, name, uf, codigo_ibge, active, created_at')
    .order('name');

  if (error || !data) return [];
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    uf: p.uf,
    codigoIbge: p.codigo_ibge ?? undefined,
    active: p.active,
    createdAt: p.created_at,
  }));
}

export async function getAllUsuarios(): Promise<{
  id: string; name: string; email: string; role: UserRole;
  prefeituraId: string; prefeituraName: string; active: boolean; createdAt: string;
}[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, name, email, role, prefeitura_id, active, created_at, prefeituras(name)')
    .order('name');

  if (error || !data) return [];
  return data.map((u) => {
    const pref = u.prefeituras as unknown as { name: string } | null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as UserRole,
      prefeituraId: u.prefeitura_id,
      prefeituraName: pref?.name ?? '',
      active: u.active,
      createdAt: u.created_at,
    };
  });
}

export async function getStatsAdmin(): Promise<{
  usuarios: number;
  prefeituras: number;
  planos: number;
}> {
  const supabase = createServerClient();
  const [u, p, pl] = await Promise.all([
    supabase.from('usuarios').select('id', { count: 'exact', head: true }),
    supabase.from('prefeituras').select('id', { count: 'exact', head: true }),
    supabase.from('planos').select('id', { count: 'exact', head: true }),
  ]);
  return {
    usuarios: u.count ?? 0,
    prefeituras: p.count ?? 0,
    planos: pl.count ?? 0,
  };
}
