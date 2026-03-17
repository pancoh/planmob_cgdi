import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import { MOCK_PLANS } from '@/lib/mock-data';
import StatusBadge from '@/components/plans/StatusBadge';

export default function PlanosPage() {
  const plans = MOCK_PLANS;

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
            {plans.map((plan) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
