'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { setClientSession } from '@/lib/auth/client-session';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? 'Credenciais inválidas');
        setLoading(false);
        return;
      }

      setClientSession(data.user);
      router.push('/dashboard');
    } catch {
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  }

  return (
    <>
      <div className="auth-form-header">
        <h2>Acesse sua conta</h2>
        <p>Entre com suas credenciais para acessar o sistema</p>
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
          <label className="form-label" htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="seu@email.gov.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Senha <span className="required">*</span>
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <a href="/recuperar-senha" style={{ fontSize: 13 }}>Esqueceu a senha?</a>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
          <LogIn size={18} />
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Não tem conta?{' '}
          <a href="/cadastro" style={{ color: 'var(--primary-600)' }}>Criar conta</a>
        </p>

      </form>
    </>
  );
}
