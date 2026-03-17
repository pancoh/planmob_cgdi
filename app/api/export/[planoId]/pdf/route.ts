import { NextRequest, NextResponse } from 'next/server';
import { CHAPTERS } from '@/lib/constants/capitulos';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planoId: string }> }
) {
  await params;
  const body = await request.json();
  const chapterData: Record<string, string> = body.chapterData || {};

  function esc(t: string) {
    return t ? t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>') : '';
  }
  function ph(t: string) {
    return `<span class="minuta-placeholder">[${t}]</span>`;
  }

  let content = '<h1>PLANO DE MOBILIDADE URBANA</h1>';
  content += '<p style="text-align:center;font-size:16px;margin-bottom:32px;">Documento gerado pelo sistema PlanMob CGDI</p>';

  for (const ch of CHAPTERS) {
    const raw = chapterData[ch.slug];
    content += `<h2>${ch.title}</h2>`;
    const data = raw ? JSON.parse(raw) : null;

    if (ch.type === 'text-free') {
      for (const f of ch.fields || []) {
        content += `<h3>${f.label}</h3>`;
        const v = data?.[f.key]?.trim?.() || '';
        content += `<p>${v ? esc(v) : ph('Não preenchido')}</p>`;
      }
    } else if (ch.type === 'structured') {
      content += '<h3>Diagnóstico</h3>';
      content += `<p>${data?.diagnosis?.trim() ? esc(data.diagnosis) : ph('Não preenchido')}</p>`;

      content += '<h3>Objetivos</h3>';
      const objs = [...(data?.objectives?.selected || [])];
      if (data?.objectives?.other?.trim()) objs.push(data.objectives.other);
      if (objs.length) {
        content += '<ol>' + objs.map((o: string) => `<li>${esc(o)}</li>`).join('') + '</ol>';
      } else {
        content += `<p>${ph('Nenhum objetivo selecionado')}</p>`;
      }

      content += '<h3>Metas</h3>';
      const goals = (data?.goals || []).filter((g: { checked: boolean }) => g.checked);
      const otherGoals = (data?.goalsOther || []).filter((g: { theme: string }) => g.theme?.trim());
      const allGoals = [...goals, ...otherGoals];
      if (allGoals.length) {
        content += '<ol>';
        for (const g of allGoals) {
          content += `<li><strong>${esc(g.theme)}</strong>`;
          if (g.specification?.trim()) content += `<br/>Especificação: ${esc(g.specification)}`;
          if (g.quantity?.trim()) content += `<br/>Quantidade: ${esc(g.quantity)}`;
          if (g.deadline?.trim()) content += `<br/>Prazo: ${esc(g.deadline)}`;
          content += '</li>';
        }
        content += '</ol>';
      } else {
        content += `<p>${ph('Nenhuma meta definida')}</p>`;
      }

      content += '<h3>Ações Estratégicas</h3>';
      const acts = (data?.actions || []).filter((a: { checked: boolean }) => a.checked);
      const otherActs = (data?.actionsOther || []).filter((a: { theme: string }) => a.theme?.trim());
      const allActs = [...acts, ...otherActs];
      if (allActs.length) {
        content += '<ol>';
        for (const a of allActs) {
          content += `<li><strong>${esc(a.theme)}</strong>`;
          if (a.specification?.trim()) content += `<br/>Especificação: ${esc(a.specification)}`;
          content += '</li>';
        }
        content += '</ol>';
      } else {
        content += `<p>${ph('Nenhuma ação definida')}</p>`;
      }
    } else if (ch.type === 'review') {
      if (!data) {
        content += `<p>${ph('Não preenchido')}</p>`;
        continue;
      }
      content += `<p><strong>Prazo para atualização:</strong> ${data.prazoAtualizacao ? data.prazoAtualizacao + ' anos' : ph('Não informado')}</p>`;
      content += `<p><strong>Revisões periódicas:</strong> ${data.revisoesPeriodicasSim ? 'Sim' : 'Não'}</p>`;

      content += '<h3>Instrumentos de Avaliação e Monitoramento</h3>';
      const av = [...(data.avaliacaoSelected || [])];
      if (data.avaliacaoOther?.trim()) av.push(data.avaliacaoOther);
      if (av.length) {
        content += '<ul>' + av.map((i: string) => `<li>${esc(i)}</li>`).join('') + '</ul>';
      }

      content += `<p><strong>Órgão responsável:</strong> ${data.orgaoResponsavel?.trim() ? esc(data.orgaoResponsavel) : ph('Não informado')}</p>`;

      content += '<h3>Instrumento Normativo</h3>';
      if (data.instrumentoNormativo?.length) {
        content += '<ul>' + data.instrumentoNormativo.map((i: string) => `<li>${esc(i)}</li>`).join('') + '</ul>';
      }
    }
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Minuta PlanMob — PDF</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 12pt;
      line-height: 1.8;
      color: #1f2937;
      max-width: 700px;
      margin: 0 auto;
      padding: 40px;
    }
    h1 { font-size: 20pt; text-align: center; margin-bottom: 8px; }
    h2 { font-size: 15pt; color: #0f766e; margin-top: 28px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    h3 { font-size: 13pt; margin-top: 16px; }
    ol, ul { margin: 8px 0; padding-left: 24px; }
    li { margin-bottom: 4px; }
    p { margin-bottom: 10px; text-align: justify; }
    .minuta-placeholder {
      background: #fff8e1;
      border: 1px dashed #d9aa1f;
      padding: 2px 6px;
      border-radius: 4px;
      font-style: italic;
      color: #8c6f00;
    }
    .print-bar {
      background: #0f766e;
      color: white;
      padding: 16px 24px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .print-bar button {
      background: white;
      color: #0f766e;
      border: none;
      padding: 10px 24px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }
    @media print {
      .print-bar { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span>Use Ctrl+P (ou Cmd+P) para salvar como PDF</span>
    <button onclick="window.print()">Imprimir / Salvar PDF</button>
  </div>
  ${content}
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
