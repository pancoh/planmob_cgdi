import { CHAPTERS } from '@/lib/constants/capitulos';
import { TextFreeData, StructuredChapterData, ReviewChapterData } from '@/types/plano';

type ProgressStatus = 'empty' | 'partial' | 'complete';

export function getChapterProgress(planoId: string, slug: string): ProgressStatus {
  if (typeof window === 'undefined') return 'empty';

  const raw = localStorage.getItem(`planmob:${planoId}:${slug}`);
  if (!raw) return 'empty';

  try {
    const data = JSON.parse(raw);
    const chapter = CHAPTERS.find((c) => c.slug === slug);
    if (!chapter) return 'empty';

    if (chapter.type === 'text-free') {
      const tf = data as TextFreeData;
      const fields = chapter.fields || [];
      const filled = fields.filter((f) => (tf[f.key] || '').trim().length > 0).length;
      if (filled === 0) return 'empty';
      if (filled === fields.length) return 'complete';
      return 'partial';
    }

    if (chapter.type === 'structured') {
      const st = data as StructuredChapterData;
      let score = 0;
      let total = 4;
      if (st.diagnosis.trim().length > 0) score++;
      if (st.objectives.selected.length > 0) score++;
      if (st.goals.some((g) => g.checked)) score++;
      if (st.actions.some((a) => a.checked)) score++;
      if (score === 0) return 'empty';
      if (score === total) return 'complete';
      return 'partial';
    }

    if (chapter.type === 'review') {
      const rv = data as ReviewChapterData;
      let score = 0;
      if (rv.prazoAtualizacao) score++;
      if (rv.avaliacaoSelected.length > 0) score++;
      if (rv.orgaoResponsavel.trim().length > 0) score++;
      if (rv.instrumentoNormativo.length > 0) score++;
      if (score === 0) return 'empty';
      if (score >= 3) return 'complete';
      return 'partial';
    }

    return 'empty';
  } catch {
    return 'empty';
  }
}

export function getAllProgress(planoId: string): Record<string, ProgressStatus> {
  const result: Record<string, ProgressStatus> = {};
  for (const ch of CHAPTERS) {
    result[ch.slug] = getChapterProgress(planoId, ch.slug);
  }
  return result;
}

export function getOverallProgressPercent(planoId: string): number {
  const progress = getAllProgress(planoId);
  const total = CHAPTERS.length;
  let score = 0;
  for (const ch of CHAPTERS) {
    const status = progress[ch.slug];
    if (status === 'complete') score += 1;
    else if (status === 'partial') score += 0.5;
  }
  return Math.round((score / total) * 100);
}
