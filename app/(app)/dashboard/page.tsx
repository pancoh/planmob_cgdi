import Link from 'next/link';
import { FileText, CheckCircle, Clock, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { MOCK_PLANS } from '@/lib/mock-data';
import StatusBadge from '@/components/plans/StatusBadge';

export default function DashboardPage() {
  const plans = MOCK_PLANS;
  const inProgress = plans.filter((p) => p.status === 'em_elaboracao' || p.status === 'rascunho').length;
  const completed = plans.filter((p) => p.status === 'concluido').length;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Visão geral dos planos de mobilidade
          </p>
        </div>
        <Link href="/planos/novo" className="btn btn-primary">
          <Plus size={18} />
          Novo Plano
        </Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon blue"><FileText size={22} /></div>
          <div className="kpi-value">{plans.length}</div>
          <div className="kpi-label">Total de planos</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-icon amber"><Clock size={22} /></div>
          <div className="kpi-value">{inProgress}</div>
          <div className="kpi-label">Em andamento</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-icon green"><CheckCircle size={22} /></div>
          <div className="kpi-value">{completed}</div>
          <div className="kpi-label">Concluídos</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-icon purple"><TrendingUp size={22} /></div>
          <div className="kpi-value">15%</div>
          <div className="kpi-label">Progresso médio</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Planos Recentes</h3>
          <Link href="/planos" className="btn btn-ghost btn-sm">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Plano</th>
                <th>Município</th>
                <th>Status</th>
                <th>Atualizado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td style={{ fontWeight: 600 }}>{plan.title}</td>
                  <td>{plan.prefeituraName}/{plan.uf}</td>
                  <td><StatusBadge status={plan.status} /></td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {new Date(plan.updatedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <Link href={`/planos/${plan.id}`} className="btn btn-ghost btn-sm">
                      {plan.status === 'rascunho' ? 'Editar' : 'Continuar'} <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
