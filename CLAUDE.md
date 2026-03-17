# PlanMob CGDI

Sistema web para auxiliar prefeituras na elaboração de minutas de Planos de Mobilidade Urbana.

## Stack

- **Framework**: Next.js 16+ (App Router) com TypeScript
- **Estilo**: CSS puro com CSS Custom Properties (sem Tailwind), seguindo design system do `pemob_cgdi`
- **Banco de dados**: Supabase (PostgreSQL)
- **Autenticação**: Cookie HTTP-only com bcryptjs
- **Ícones**: Lucide React
- **Tipografia**: IBM Plex Sans (Google Fonts)
- **PDF**: Geração server-side

## Referências

- **Identidade visual**: `/Users/ramson/projetos-dev/pemob_cgdi/app/globals.css` (design tokens, componentes CSS)
- **Spec técnica**: `/Users/ramson/projetos-dev/planmob_cgdi/PLANO_SISTEMA_MINUTA_MOBILIDADE.md`
- **MVP anterior**: `/Users/ramson/projetos-dev/planmob_cgdi/` (Next.js + TypeScript, mock data)

## Convenções

- Componentes server-first; client components apenas quando necessário interação
- Capítulos renderizados via schema/template, não JSX hardcoded
- Toda geração de minuta passa por função única de consolidação
- Autosave no editor com indicador visual
- Idioma do código: inglês para variáveis/funções, português para conteúdo e labels

## Estrutura do projeto

```
app/
  (public)/          # Login, recuperar senha
  (app)/             # Área autenticada da prefeitura
  admin/             # Painel administrativo
  api/               # API routes
components/          # UI reutilizável
lib/
  auth/              # Sessão, permissões
  db/                # Cliente Supabase, queries
  domain/            # Regras de negócio (minuta, progresso, validação)
  constants/         # Perfis, status, capítulos
styles/              # tokens.css, globals.css
types/               # TypeScript types
supabase/            # Migrations e seeds
```

## Comandos

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Linting
```
