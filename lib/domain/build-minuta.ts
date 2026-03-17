import { CHAPTERS } from '@/lib/constants/capitulos';
import { TextFreeData, StructuredChapterData, ReviewChapterData } from '@/types/plano';

function placeholder(text: string): string {
  return `<span class="minuta-placeholder">[${text}]</span>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />');
}

export function buildMinutaHtml(planoId: string, municipio: string, uf: string): string {
  const parts: string[] = [];

  parts.push(`<h1>PLANO DE MOBILIDADE URBANA</h1>`);
  parts.push(`<p style="text-align:center;font-size:16px;margin-bottom:32px;">Município de ${municipio} — ${uf}</p>`);

  for (const chapter of CHAPTERS) {
    const storageKey = `planmob:${planoId}:${chapter.slug}`;
    let raw: string | null = null;
    if (typeof window !== 'undefined') {
      raw = localStorage.getItem(storageKey);
    }

    parts.push(`<h2 id="ch-${chapter.slug}">${chapter.title}</h2>`);

    if (chapter.type === 'text-free') {
      if (!raw) {
        (chapter.fields || []).forEach((f) => {
          parts.push(`<h3>${f.label}</h3>`);
          parts.push(`<p>${placeholder('Não preenchido')}</p>`);
        });
        continue;
      }
      const data = JSON.parse(raw) as TextFreeData;
      (chapter.fields || []).forEach((f) => {
        parts.push(`<h3>${f.label}</h3>`);
        const val = data[f.key]?.trim();
        parts.push(`<p>${val ? escapeHtml(val) : placeholder('Não preenchido')}</p>`);
      });
      continue;
    }

    if (chapter.type === 'structured') {
      if (!raw) {
        parts.push(`<h3>Diagnóstico</h3><p>${placeholder('Não preenchido')}</p>`);
        parts.push(`<h3>Objetivos</h3><p>${placeholder('Nenhum objetivo selecionado')}</p>`);
        parts.push(`<h3>Metas</h3><p>${placeholder('Nenhuma meta definida')}</p>`);
        parts.push(`<h3>Ações Estratégicas</h3><p>${placeholder('Nenhuma ação definida')}</p>`);
        continue;
      }
      const data = JSON.parse(raw) as StructuredChapterData;

      // Diagnosis
      parts.push(`<h3>Diagnóstico</h3>`);
      parts.push(`<p>${data.diagnosis.trim() ? escapeHtml(data.diagnosis) : placeholder('Não preenchido')}</p>`);

      // Objectives
      parts.push(`<h3>Objetivos</h3>`);
      const allObj = [...data.objectives.selected];
      if (data.objectives.other.trim()) allObj.push(data.objectives.other.trim());
      if (allObj.length > 0) {
        parts.push(`<ol>${allObj.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ol>`);
      } else {
        parts.push(`<p>${placeholder('Nenhum objetivo selecionado')}</p>`);
      }

      // Goals
      parts.push(`<h3>Metas</h3>`);
      const checkedGoals = data.goals.filter((g) => g.checked);
      const allGoals = [...checkedGoals, ...data.goalsOther.filter((g) => g.theme.trim())];
      if (allGoals.length > 0) {
        parts.push(`<ol>`);
        for (const g of allGoals) {
          parts.push(`<li><strong>${escapeHtml('theme' in g ? g.theme : '')}</strong>`);
          const spec = g.specification?.trim();
          const qty = 'quantity' in g ? g.quantity?.trim() : '';
          const dl = 'deadline' in g ? g.deadline?.trim() : '';
          if (spec) parts.push(`<br />Especificação: ${escapeHtml(spec)}`);
          if (qty) parts.push(`<br />Quantidade: ${escapeHtml(qty)}`);
          if (dl) parts.push(`<br />Prazo: ${escapeHtml(dl)}`);
          parts.push(`</li>`);
        }
        parts.push(`</ol>`);
      } else {
        parts.push(`<p>${placeholder('Nenhuma meta definida')}</p>`);
      }

      // Actions
      parts.push(`<h3>Ações Estratégicas</h3>`);
      const checkedActions = data.actions.filter((a) => a.checked);
      const allActions = [...checkedActions, ...data.actionsOther.filter((a) => a.theme.trim())];
      if (allActions.length > 0) {
        parts.push(`<ol>`);
        for (const a of allActions) {
          parts.push(`<li><strong>${escapeHtml(a.theme)}</strong>`);
          if (a.specification?.trim()) {
            parts.push(`<br />Especificação: ${escapeHtml(a.specification)}`);
          }
          parts.push(`</li>`);
        }
        parts.push(`</ol>`);
      } else {
        parts.push(`<p>${placeholder('Nenhuma ação definida')}</p>`);
      }
      continue;
    }

    if (chapter.type === 'review') {
      if (!raw) {
        parts.push(`<p>${placeholder('Não preenchido')}</p>`);
        continue;
      }
      const data = JSON.parse(raw) as ReviewChapterData;

      parts.push(`<p><strong>Prazo para atualização:</strong> ${data.prazoAtualizacao ? `${data.prazoAtualizacao} anos` : placeholder('Não informado')}</p>`);
      parts.push(`<p><strong>Revisões periódicas:</strong> ${data.revisoesPeriodicasSim ? 'Sim' : 'Não'}</p>`);

      parts.push(`<h3>Instrumentos de Avaliação e Monitoramento</h3>`);
      const avItems = [...data.avaliacaoSelected];
      if (data.avaliacaoOther?.trim()) avItems.push(data.avaliacaoOther.trim());
      if (avItems.length > 0) {
        parts.push(`<ul>${avItems.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`);
      } else {
        parts.push(`<p>${placeholder('Nenhum instrumento selecionado')}</p>`);
      }

      parts.push(`<p><strong>Órgão responsável:</strong> ${data.orgaoResponsavel?.trim() ? escapeHtml(data.orgaoResponsavel) : placeholder('Não informado')}</p>`);

      parts.push(`<h3>Instrumento Normativo</h3>`);
      if (data.instrumentoNormativo.length > 0) {
        parts.push(`<ul>${data.instrumentoNormativo.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`);
      } else {
        parts.push(`<p>${placeholder('Não selecionado')}</p>`);
      }
    }
  }

  return parts.join('\n');
}
