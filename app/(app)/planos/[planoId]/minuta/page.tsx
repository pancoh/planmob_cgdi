'use client';

import { useParams } from 'next/navigation';
import { Download, FileText } from 'lucide-react';
import MinutaPreview from '@/components/plans/MinutaPreview';
import { MOCK_PLANS } from '@/lib/mock-data';
import { CHAPTERS } from '@/lib/constants/capitulos';

function collectChapterData(planoId: string): Record<string, string> {
  const data: Record<string, string> = {};
  for (const ch of CHAPTERS) {
    const raw = localStorage.getItem(`planmob:${planoId}:${ch.slug}`);
    if (raw) data[ch.slug] = raw;
  }
  return data;
}

export default function MinutaPage() {
  const params = useParams();
  const planoId = params.planoId as string;

  const plan = MOCK_PLANS.find((p) => p.id === planoId);
  const municipio = plan?.prefeituraName || 'Município';
  const uf = plan?.uf || 'UF';

  async function handleExportPdf() {
    const chapterData = collectChapterData(planoId);
    const res = await fetch(`/api/export/${planoId}/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterData }),
    });
    const html = await res.text();
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  async function handleExportDocx() {
    const chapterData = collectChapterData(planoId);
    const res = await fetch(`/api/export/${planoId}/docx`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterData }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Minuta_PlanMob_${municipio.replace(/\s+/g, '_')}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>
          Minuta do Plano de Mobilidade
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportPdf}>
            <Download size={16} /> PDF
          </button>
          <button className="btn btn-accent btn-sm" onClick={handleExportDocx}>
            <FileText size={16} /> Word
          </button>
        </div>
      </div>
      <MinutaPreview planoId={planoId} municipio={municipio} uf={uf} />
    </div>
  );
}
