'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { findUserByEmail } from '@/lib/mock-data';
import { setClientSession } from '@/lib/auth/client-session';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = findUserByEmail(email);
    if (!user) {
      setError('Credenciais inválidas');
      setLoading(false);
      return;
    }
    if (!user.active) {
      setError('Usuário inativo');
      setLoading(false);
      return;
    }
    if (password.length < 3) {
      setError('Credenciais inválidas');
      setLoading(false);
      return;
    }

    setClientSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      prefeituraId: user.prefeituraId,
      prefeituraName: user.prefeituraName,
    });

    router.push('/dashboard');
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

        <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <strong>Credenciais demo:</strong><br />
          admin@planmob.gov.br / qualquer senha<br />
          coordenador@planmob.gov.br / qualquer senha<br />
          tecnico@planmob.gov.br / qualquer senha
        </div>
      </form>
    </>
  );
}
