'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/plans/StatusBadge';
import { Plan } from '@/types/plano';

export default function PlanosPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/planos')
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Erro ${res.status} ao carregar planos`);
        }
        return res.json();
      })
      .then((data: Plan[]) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>Planos de Mobilidade</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Gerencie os planos de mobilidade urbana
          </p>
        </div>
        <Link href="/planos/novo" className="btn btn-primary">
          <Plus size={18} />
          Novo Plano
        </Link>
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando planos...
        </div>
      )}

      {error && (
        <div style={{
          background: 'var(--error-50)',
          border: '1px solid var(--error-100)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          color: 'var(--error-500)',
          fontSize: 13,
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Plano</th>
                <th>Município / UF</th>
                <th>Ano Ref.</th>
                <th>Coordenador</th>
                <th>Status</th>
                <th>Atualização</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    Nenhum plano encontrado
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id}>
                    <td style={{ fontWeight: 600 }}>{plan.title}</td>
                    <td>{plan.prefeituraName}/{plan.uf}</td>
                    <td>{plan.anoReferencia}</td>
                    <td>{plan.coordenador}</td>
                    <td><StatusBadge status={plan.status} /></td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(plan.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <Link href={`/planos/${plan.id}`} className="btn btn-ghost btn-sm">
                        Abrir <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
