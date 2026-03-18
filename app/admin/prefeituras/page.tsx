'use client';

import { useState, useEffect } from 'react';
import { Prefeitura } from '@/types/auth';

export default function PrefeiturasPage() {
  const [prefeituras, setPrefeituras] = useState<Prefeitura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/prefeituras')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar prefeituras');
        return res.json();
      })
      .then((data: Prefeitura[]) => {
        setPrefeituras(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Prefeituras</h2>

      {loading && (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando...
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
                <th>Município</th>
                <th>UF</th>
                <th>Código IBGE</th>
                <th>Status</th>
                <th>Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {prefeituras.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    Nenhuma prefeitura cadastrada
                  </td>
                </tr>
              ) : (
                prefeituras.map((pref) => (
                  <tr key={pref.id}>
                    <td style={{ fontWeight: 600 }}>{pref.name}</td>
                    <td>{pref.uf}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{pref.codigoIbge ?? '—'}</td>
                    <td>
                      <span className={`badge ${pref.active ? 'badge-green' : 'badge-red'}`}>
                        {pref.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(pref.createdAt).toLocaleDateString('pt-BR')}
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
