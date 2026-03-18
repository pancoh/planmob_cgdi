'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NovoPlanoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [anoReferencia, setAnoReferencia] = useState(new Date().getFullYear());
  const [orgao, setOrgao] = useState('');
  const [coordenador, setCoordenador] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/planos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          anoReferencia,
          orgaoResponsavel: orgao,
          coordenador,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Erro ao criar plano');
        setLoading(false);
        return;
      }

      router.push(`/planos/${data.id}`);
    } catch {
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <Link href="/planos" className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>
          <ArrowLeft size={14} /> Voltar
        </Link>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>Novo Plano de Mobilidade</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
          Preencha as informações básicas para criar um novo plano
        </p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-body">
          {error && (
            <div style={{
              background: 'var(--error-50)',
              border: '1px solid var(--error-100)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: 20,
              color: 'var(--error-500)',
              fontSize: 13,
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Título do Plano <span className="required">*</span>
              </label>
              <input
                id="title"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Plano de Mobilidade Urbana de [Município]"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="ano">
                  Ano de Referência <span className="required">*</span>
                </label>
                <input
                  id="ano"
                  type="number"
                  className="form-input"
                  value={anoReferencia}
                  onChange={(e) => setAnoReferencia(Number(e.target.value))}
                  min={2020}
                  max={2035}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="coordenador">
                  Coordenador <span className="required">*</span>
                </label>
                <input
                  id="coordenador"
                  className="form-input"
                  value={coordenador}
                  onChange={(e) => setCoordenador(e.target.value)}
                  placeholder="Nome do coordenador"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="orgao">
                Órgão Responsável <span className="required">*</span>
              </label>
              <input
                id="orgao"
                className="form-input"
                value={orgao}
                onChange={(e) => setOrgao(e.target.value)}
                placeholder="Ex: Secretaria Municipal de Infraestrutura"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <Link href="/planos" className="btn btn-secondary">Cancelar</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={18} /> {loading ? 'Criando...' : 'Criar Plano'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
