'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, Building2, ArrowLeft, LogOut } from 'lucide-react';
import { SessionData } from '@/types/auth';
import { clearClientSession } from '@/lib/auth/client-session';

const ADMIN_NAV = [
  { href: '/admin', label: 'Visão Geral', icon: Building2 },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/prefeituras', label: 'Prefeituras', icon: Building2 },
];

export default function AdminShell({
  session,
  children,
}: {
  session: SessionData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearClientSession();
    router.push('/login');
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon" style={{ background: 'linear-gradient(135deg, var(--error-400), var(--accent-400))' }}>
              AD
            </div>
            <div className="sidebar-brand-copy">
              <div className="sidebar-logo-text">Admin</div>
              <span className="sidebar-logo-sub">PlanMob CGDI</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Administração</div>
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="sidebar-section">
            <Link href="/dashboard" className="sidebar-link">
              <ArrowLeft size={20} /> Voltar ao Sistema
            </Link>
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">AD</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{session.name}</div>
            <div className="sidebar-user-role">Administrador</div>
          </div>
          <button onClick={handleLogout} className="btn btn-icon btn-ghost" title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="main-header">
          <h1>Administração</h1>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
