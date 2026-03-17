import { Users, Building2, FileText } from 'lucide-react';
import { MOCK_USERS, MOCK_PREFEITURAS, MOCK_PLANS } from '@/lib/mock-data';

export default function AdminPage() {
  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Painel Administrativo</h2>

      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon blue"><Users size={22} /></div>
          <div className="kpi-value">{MOCK_USERS.length}</div>
          <div className="kpi-label">Usuários cadastrados</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-icon green"><Building2 size={22} /></div>
          <div className="kpi-value">{MOCK_PREFEITURAS.length}</div>
          <div className="kpi-label">Prefeituras</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-icon purple"><FileText size={22} /></div>
          <div className="kpi-value">{MOCK_PLANS.length}</div>
          <div className="kpi-label">Planos criados</div>
        </div>
      </div>
    </>
  );
}
