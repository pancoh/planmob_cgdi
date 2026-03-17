'use client';

import { useParams } from 'next/navigation';
import { Download, FileText } from 'lucide-react';
import MinutaPreview from '@/components/plans/MinutaPreview';
import { MOCK_PLANS } from '@/lib/mock-data';
import { CHAPTERS } from '@/lib/constants/capitulos';
import { buildMinutaHtml } from '@/lib/domain/build-minuta';

function collectChapterData(planoId: string): Record<string, string> {
  const data: Record<string, string> = {};
  for (const ch of CHAPTERS) {
    const raw = localStorage.getItem(`planmob:${planoId}:${ch.slug}`);
    if (raw) data[ch.slug] = raw;
  }
  return data;
}

export default function MinutaClient() {
  const params = useParams();
  const planoId = params.planoId as string;

  const plan = MOCK_PLANS.find((p) => p.id === planoId);
  const municipio = plan?.prefeituraName || 'Município';
  const uf = plan?.uf || 'UF';

  function handleExportPdf() {
    const html = buildMinutaHtml(planoId, municipio, uf);
    const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Minuta PlanMob — ${municipio}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'IBM Plex Sans', sans-serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; padding: 40px 60px; max-width: 900px; margin: 0 auto; }
    h1 { text-align: center; font-size: 22pt; color: #0f766e; margin-bottom: 8px; }
    h2 { font-size: 16pt; color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 4px; margin-top: 32px; margin-bottom: 12px; }
    h3 { font-size: 13pt; color: #334155; margin-top: 16px; margin-bottom: 8px; }
    p { margin-bottom: 10px; text-align: justify; }
    ol, ul { margin-left: 24px; margin-bottom: 12px; }
    li { margin-bottom: 4px; }
    .minuta-placeholder { color: #9ca3af; font-style: italic; }
    @media print { body { padding: 20px 40px; } }
  </style>
</head>
<body>
  ${html}
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(fullHtml);
      win.document.close();
    }
  }

  async function handleExportDocx() {
    const chapterDataMap = collectChapterData(planoId);
    const { buildDocxClient } = await import('@/lib/domain/export-docx-client');
    const blob = await buildDocxClient(chapterDataMap, municipio, uf);

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
