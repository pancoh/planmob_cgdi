'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, FileText } from 'lucide-react';

type Stats = {
  usuarios: number;
  prefeituras: number;
  planos: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar estatísticas');
        return res.json();
      })
      .then((data: Stats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[AdminPage] stats error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Painel Administrativo</h2>

      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon blue"><Users size={22} /></div>
          <div className="kpi-value">{loading ? '—' : (stats?.usuarios ?? 0)}</div>
          <div className="kpi-label">Usuários cadastrados</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-icon green"><Building2 size={22} /></div>
          <div className="kpi-value">{loading ? '—' : (stats?.prefeituras ?? 0)}</div>
          <div className="kpi-label">Prefeituras</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-icon purple"><FileText size={22} /></div>
          <div className="kpi-value">{loading ? '—' : (stats?.planos ?? 0)}</div>
          <div className="kpi-label">Planos criados</div>
        </div>
      </div>
    </>
  );
}
