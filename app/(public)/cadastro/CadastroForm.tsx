'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { Prefeitura } from '@/types/auth';

const ROLES = [
  { value: 'coordenador_municipal', label: 'Coordenador Municipal' },
  { value: 'tecnico_editor', label: 'Técnico Editor' },
  { value: 'revisor_leitura', label: 'Revisor (somente leitura)' },
  { value: 'administrador', label: 'Administrador' },
];

export default function CadastroForm() {
  const router = useRouter();
  const [prefeituras, setPrefeituras] = useState<Prefeitura[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    prefeituraId: '',
    role: 'coordenador_municipal',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/register')
      .then((r) => r.json())
      .then((data: Prefeitura[]) => setPrefeituras(data))
      .catch(() => {});
  }, []);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (!form.prefeituraId) {
      setError('Selecione uma prefeitura');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          prefeituraId: form.prefeituraId,
          role: form.role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? 'Erro ao criar conta');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{ color: 'var(--primary-600)', marginBottom: 8 }}>Cadastro realizado!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
          Sua conta foi criada e está <strong>aguardando validação</strong> pelo administrador.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Você receberá acesso assim que o administrador aprovar seu cadastro.
        </p>
        <a href="/login" style={{ display: 'inline-block', marginTop: 24, color: 'var(--primary-600)', fontSize: 13 }}>
          Voltar para o login
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="auth-form-header">
        <h2>Criar conta</h2>
        <p>Preencha os dados para acessar o sistema</p>
      </div>

      <form onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label className="form-label">Nome completo <span className="required">*</span></label>
          <input className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} required autoFocus />
        </div>

        <div className="form-group">
          <label className="form-label">E-mail <span className="required">*</span></label>
          <input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">Prefeitura <span className="required">*</span></label>
          <select className="form-select" value={form.prefeituraId} onChange={(e) => set('prefeituraId', e.target.value)} required>
            <option value="">Selecione...</option>
            {prefeituras.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {p.uf}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Perfil de acesso <span className="required">*</span></label>
          <select className="form-select" value={form.role} onChange={(e) => set('role', e.target.value)}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Senha <span className="required">*</span></label>
            <input type="password" className="form-input" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmar senha <span className="required">*</span></label>
            <input type="password" className="form-input" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
          <UserPlus size={18} />
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Já tem conta?{' '}
          <a href="/login" style={{ color: 'var(--primary-600)' }}>Entrar</a>
        </p>
      </form>
    </>
  );
}
