-- Prefeituras
create table if not exists prefeituras (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  uf          char(2) not null,
  codigo_ibge text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Usuários
create table if not exists usuarios (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text unique not null,
  password_hash text not null,
  role          text not null check (role in ('administrador','coordenador_municipal','tecnico_editor','revisor_leitura')),
  prefeitura_id uuid references prefeituras(id) on delete set null,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Planos de Mobilidade
create table if not exists planos (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  ano_referencia    int,
  orgao_responsavel text,
  coordenador       text,
  prefeitura_id     uuid references prefeituras(id) on delete cascade,
  status            text not null default 'rascunho'
                      check (status in ('rascunho','em_elaboracao','em_revisao','pronto_para_exportacao','concluido')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Dados dos capítulos (um registro por capítulo por plano)
create table if not exists capitulos_data (
  id            uuid primary key default gen_random_uuid(),
  plano_id      uuid not null references planos(id) on delete cascade,
  capitulo_slug text not null,
  data          jsonb not null default '{}',
  updated_at    timestamptz not null default now(),
  unique(plano_id, capitulo_slug)
);

-- Anexos (metadados; arquivo fica no Storage)
create table if not exists anexos (
  id            uuid primary key default gen_random_uuid(),
  plano_id      uuid not null references planos(id) on delete cascade,
  capitulo_slug text not null,
  name          text not null,
  type          text not null,
  size          int,
  caption       text not null default '',
  storage_path  text not null,
  created_at    timestamptz not null default now()
);

-- Atualiza updated_at automaticamente nos planos
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger planos_updated_at
  before update on planos
  for each row execute procedure update_updated_at();

create trigger capitulos_data_updated_at
  before update on capitulos_data
  for each row execute procedure update_updated_at();
