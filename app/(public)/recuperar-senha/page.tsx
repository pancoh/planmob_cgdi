import AuthShell from '@/components/auth/AuthShell';
import Link from 'next/link';

export default function RecuperarSenhaPage() {
  return (
    <AuthShell>
      <div className="auth-form-header">
        <h2>Recuperar Senha</h2>
        <p>Funcionalidade disponível em breve. Entre em contato com o administrador.</p>
      </div>
      <Link href="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
        Voltar ao login
      </Link>
    </AuthShell>
  );
}
