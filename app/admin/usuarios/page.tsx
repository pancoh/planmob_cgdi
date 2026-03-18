'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ROLES } from '@/lib/constants/perfis';
import { UserRole } from '@/types/auth';

type UsuarioRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  prefeituraId: string;
  prefeituraName: string;
  active: boolean;
  createdAt: string;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  function load() {
    fetch('/api/admin/usuarios')
      .then(async (res) => {
        if (!res.ok) throw new Error('Erro ao carregar usuários');
        return res.json();
      })
      .then((data: UsuarioRow[]) => { setUsuarios(data); setLoading(false); })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(user: UsuarioRow) {
    setUpdating(user.id);
    await fetch(`/api/admin/usuarios/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active }),
    });
    setUpdating(null);
    load();
  }

  const pendentes = usuarios.filter((u) => !u.active);
  const ativos = usuarios.filter((u) => u.active);

  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Usuários</h2>

      {loading && (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando...</div>
      )}
      {error && (
        <div style={{ background: 'var(--error-50)', border: '1px solid var(--error-100)', borderRadius: 'var(--radius-md)', padding: '12px 16px', color: 'var(--error-500)', fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {pendentes.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--warning-600)' }}>
                  Aguardando validação ({pendentes.length})
                </h3>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Perfil</th>
                      <th>Prefeitura</th>
                      <th>Cadastro</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendentes.map((user) => (
                      <tr key={user.id} style={{ background: 'var(--warning-50)' }}>
                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span className="badge badge-blue">{ROLES[user.role]?.label ?? user.role}</span></td>
                        <td>{user.prefeituraName}</td>
                        <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => toggleActive(user)}
                            disabled={updating === user.id}
                          >
                            <CheckCircle size={14} />
                            {updating === user.id ? 'Ativando...' : 'Ativar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Usuários ativos ({ativos.length})
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Perfil</th>
                    <th>Prefeitura</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ativos.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                        Nenhum usuário ativo
                      </td>
                    </tr>
                  ) : (
                    ativos.map((user) => (
                      <tr key={user.id}>
                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span className="badge badge-blue">{ROLES[user.role]?.label ?? user.role}</span></td>
                        <td>{user.prefeituraName}</td>
                        <td><span className="badge badge-green">Ativo</span></td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--error-500)' }}
                            onClick={() => toggleActive(user)}
                            disabled={updating === user.id}
                          >
                            <XCircle size={14} />
                            {updating === user.id ? '...' : 'Desativar'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
