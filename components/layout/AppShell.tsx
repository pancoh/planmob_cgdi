'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SessionData } from '@/types/auth';
import { ROLES } from '@/lib/constants/perfis';
import { clearClientSession } from '@/lib/auth/client-session';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/planos', label: 'Planos', icon: FileText },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export default function AppShell({
  session,
  children,
}: {
  session: SessionData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    clearClientSession();
    router.push('/login');
  }

  const initials = session.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">PM</div>
            <div className="sidebar-brand-copy">
              <div className="sidebar-logo-text">PlanMob</div>
              <span className="sidebar-logo-sub">CGDI — Mobilidade Urbana</span>
            </div>
          </div>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setSidebarOpen(false)}
            style={{ display: 'none' }}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Menu</div>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${pathname.startsWith(item.href) ? 'active' : ''}`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </div>

          {session.role === 'administrador' && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">Administração</div>
              <Link
                href="/admin"
                className={`sidebar-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                <Settings size={20} />
                Painel Admin
              </Link>
            </div>
          )}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{session.name}</div>
            <div className="sidebar-user-role">{ROLES[session.role].label}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-icon btn-ghost" title="Sair" aria-label="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="main-header">
          <button
            className="btn btn-icon btn-ghost mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
            style={{ display: 'none' }}
          >
            <Menu size={20} />
          </button>
          <h1>
            {NAV_ITEMS.find((i) => pathname.startsWith(i.href))?.label ||
              (pathname.startsWith('/admin') ? 'Administração' : 'PlanMob')}
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {session.prefeituraName}
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
