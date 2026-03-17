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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Mock: create plan in localStorage
    const newPlan = {
      id: `plan-${Date.now()}`,
      title,
      anoReferencia,
      orgaoResponsavel: orgao,
      coordenador,
      prefeituraId: 'pref-1',
      prefeituraName: 'Jaraguá',
      uf: 'GO',
      status: 'em_elaboracao' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('planmob:plans') || '[]');
    existing.push(newPlan);
    localStorage.setItem('planmob:plans', JSON.stringify(existing));

    router.push(`/planos/${newPlan.id}`);
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
              <button type="submit" className="btn btn-primary">
                <Save size={18} /> Criar Plano
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
