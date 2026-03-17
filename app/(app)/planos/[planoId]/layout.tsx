'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import PlanSidebar from '@/components/plans/PlanSidebar';
import ChapterNav from '@/components/plans/ChapterNav';
import { useState, useEffect } from 'react';
import { FileText, Paperclip, Database, Download } from 'lucide-react';
import { CHAPTERS } from '@/lib/constants/capitulos';

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const planoId = params.planoId as string;
  const [progress, setProgress] = useState<Record<string, 'empty' | 'partial' | 'complete'>>({});

  useEffect(() => {
    function computeProgress() {
      const result: Record<string, 'empty' | 'partial' | 'complete'> = {};
      for (const ch of CHAPTERS) {
        const raw = localStorage.getItem(`planmob:${planoId}:${ch.slug}`);
        if (!raw) { result[ch.slug] = 'empty'; continue; }
        try {
          const data = JSON.parse(raw);
          if (ch.type === 'text-free') {
            const fields = ch.fields || [];
            const filled = fields.filter((f) => (data[f.key] || '').trim().length > 0).length;
            result[ch.slug] = filled === 0 ? 'empty' : filled === fields.length ? 'complete' : 'partial';
          } else if (ch.type === 'structured') {
            let score = 0;
            if (data.diagnosis?.trim().length > 0) score++;
            if (data.objectives?.selected?.length > 0) score++;
            if (data.goals?.some((g: { checked: boolean }) => g.checked)) score++;
            if (data.actions?.some((a: { checked: boolean }) => a.checked)) score++;
            result[ch.slug] = score === 0 ? 'empty' : score === 4 ? 'complete' : 'partial';
          } else if (ch.type === 'review') {
            let score = 0;
            if (data.prazoAtualizacao) score++;
            if (data.avaliacaoSelected?.length > 0) score++;
            if (data.orgaoResponsavel?.trim().length > 0) score++;
            if (data.instrumentoNormativo?.length > 0) score++;
            result[ch.slug] = score === 0 ? 'empty' : score >= 3 ? 'complete' : 'partial';
          } else {
            result[ch.slug] = 'empty';
          }
        } catch {
          result[ch.slug] = 'empty';
        }
      }
      setProgress(result);
    }

    computeProgress();
    const interval = setInterval(computeProgress, 3000);
    return () => clearInterval(interval);
  }, [planoId]);

  const pathname = usePathname();

  return (
    <div style={{ margin: '-32px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 32px',
        background: 'var(--surface-card)',
        borderBottom: '1px solid var(--border-soft)',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href={`/planos/${planoId}/capitulos/apresentacao`}
            className={`btn btn-sm ${pathname.includes('/capitulos/') ? 'btn-primary' : 'btn-ghost'}`}
          >
            <FileText size={15} /> Capítulos
          </Link>
          <Link
            href={`/planos/${planoId}/anexos`}
            className={`btn btn-sm ${pathname.endsWith('/anexos') ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Paperclip size={15} /> Anexos
          </Link>
          <Link
            href={`/planos/${planoId}/minuta`}
            className={`btn btn-sm ${pathname.endsWith('/minuta') ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Download size={15} /> Minuta
          </Link>
        </div>
        <Link
          href={`/planos/${planoId}/seed`}
          className={`btn btn-sm ${pathname.endsWith('/seed') ? 'btn-accent' : 'btn-ghost'}`}
          title="Preencher com dados de exemplo (Jaraguá-GO)"
        >
          <Database size={15} /> Dados Demo
        </Link>
      </div>
      <ChapterNav planoId={planoId} />
      <div className="plan-layout">
        <PlanSidebar planoId={planoId} progress={progress} />
        <div className="plan-content">
          {children}
        </div>
      </div>
    </div>
  );
}
