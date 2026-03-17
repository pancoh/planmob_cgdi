import { MapPin, FileText, BarChart3 } from 'lucide-react';

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <h1>PlanMob CGDI</h1>
          <p>
            Sistema para elaboração de Planos de Mobilidade Urbana, conforme Art. 24
            da Lei nº 12.587/2012 — Política Nacional de Mobilidade Urbana.
          </p>
          <div className="auth-hero-cards">
            <div className="auth-hero-card">
              <MapPin size={20} style={{ marginBottom: 8, opacity: 0.8 }} />
              <h3>14 Capítulos</h3>
              <p>Formulário guiado baseado na metodologia oficial</p>
            </div>
            <div className="auth-hero-card">
              <FileText size={20} style={{ marginBottom: 8, opacity: 0.8 }} />
              <h3>Minuta Automática</h3>
              <p>Consolidação em tempo real do plano</p>
            </div>
            <div className="auth-hero-card">
              <BarChart3 size={20} style={{ marginBottom: 8, opacity: 0.8 }} />
              <h3>PDF e Word</h3>
              <p>Exportação formatada pronta para aprovação</p>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-form-side">
        {children}
      </div>
    </div>
  );
}
