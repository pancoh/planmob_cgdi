'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChapterDefinition, StructuredChapterData, TextFreeData, ReviewChapterData, GoalItem, ActionItem } from '@/types/plano';
import TextAreaField from '@/components/forms/TextAreaField';
import CheckboxGroup from '@/components/forms/CheckboxGroup';
import GoalTable from '@/components/forms/GoalTable';
import ActionTable from '@/components/forms/ActionTable';
import RadioGroup from '@/components/forms/RadioGroup';
import TextField from '@/components/forms/TextField';
import AutosaveIndicator from '@/components/forms/AutosaveIndicator';

function getStorageKey(planoId: string, slug: string) {
  return `planmob:${planoId}:${slug}`;
}

function initStructuredData(chapter: ChapterDefinition): StructuredChapterData {
  return {
    diagnosis: '',
    objectives: { selected: [], other: '' },
    goals: (chapter.suggestedGoals || []).map((theme) => ({
      theme,
      checked: false,
      specification: '',
      quantity: '',
      deadline: '',
    })),
    goalsOther: [],
    actions: (chapter.suggestedActions || []).map((theme) => ({
      theme,
      checked: false,
      specification: '',
    })),
    actionsOther: [],
  };
}

function initReviewData(): ReviewChapterData {
  return {
    prazoAtualizacao: '',
    revisoesPeriodicasSim: false,
    avaliacaoSelected: [],
    avaliacaoOther: '',
    orgaoResponsavel: '',
    instrumentoNormativo: [],
  };
}

function initTextFreeData(chapter: ChapterDefinition): TextFreeData {
  const data: TextFreeData = {};
  (chapter.fields || []).forEach((f) => {
    data[f.key] = '';
  });
  return data;
}

export default function ChapterEditor({
  chapter,
  planoId,
}: {
  chapter: ChapterDefinition;
  planoId: string;
}) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load data from localStorage
  const [data, setData] = useState<TextFreeData | StructuredChapterData | ReviewChapterData>(() => {
    if (typeof window === 'undefined') {
      if (chapter.type === 'structured') return initStructuredData(chapter);
      if (chapter.type === 'review') return initReviewData();
      return initTextFreeData(chapter);
    }
    const stored = localStorage.getItem(getStorageKey(planoId, chapter.slug));
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    if (chapter.type === 'structured') return initStructuredData(chapter);
    if (chapter.type === 'review') return initReviewData();
    return initTextFreeData(chapter);
  });

  const save = useCallback((newData: typeof data) => {
    setSaveStatus('saving');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(getStorageKey(planoId, chapter.slug), JSON.stringify(newData));
      setSaveStatus('saved');
    }, 800);
  }, [planoId, chapter.slug]);

  function updateData(newData: typeof data) {
    setData(newData);
    save(newData);
  }

  // Reset on chapter change
  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey(planoId, chapter.slug));
    if (stored) {
      try { setData(JSON.parse(stored)); return; } catch { /* ignore */ }
    }
    if (chapter.type === 'structured') setData(initStructuredData(chapter));
    else if (chapter.type === 'review') setData(initReviewData());
    else setData(initTextFreeData(chapter));
    setSaveStatus('idle');
  }, [chapter.slug, planoId, chapter]);

  // Text-free chapters (1-3)
  if (chapter.type === 'text-free') {
    const tfData = data as TextFreeData;
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>{chapter.title}</h2>
          <AutosaveIndicator status={saveStatus} />
        </div>
        {(chapter.fields || []).map((field) => (
          <TextAreaField
            key={field.key}
            label={field.label}
            value={tfData[field.key] || ''}
            onChange={(val) => updateData({ ...tfData, [field.key]: val })}
            rows={6}
          />
        ))}
      </div>
    );
  }

  // Review chapter (14)
  if (chapter.type === 'review') {
    const rvData = data as ReviewChapterData;
    const reviewFields = chapter.reviewFields || [];

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>{chapter.title}</h2>
          <AutosaveIndicator status={saveStatus} />
        </div>

        {reviewFields.map((field) => {
          if (field.type === 'number' || field.type === 'text') {
            return (
              <TextField
                key={field.key}
                label={field.label}
                value={String((rvData as Record<string, unknown>)[field.key] ?? '') || ''}
                onChange={(val) => updateData({ ...rvData, [field.key]: val })}
                type={field.type}
              />
            );
          }
          if (field.type === 'textarea') {
            return (
              <TextAreaField
                key={field.key}
                label={field.label}
                value={String((rvData as Record<string, unknown>)[field.key] ?? '') || ''}
                onChange={(val) => updateData({ ...rvData, [field.key]: val })}
              />
            );
          }
          if (field.type === 'radio') {
            return (
              <RadioGroup
                key={field.key}
                label={field.label}
                options={field.options || ['Sim', 'Não']}
                value={rvData.revisoesPeriodicasSim ? 'Sim' : 'Não'}
                onChange={(val) => updateData({ ...rvData, revisoesPeriodicasSim: val === 'Sim' })}
              />
            );
          }
          if (field.type === 'checkbox-group') {
            const selectedKey = field.key as 'avaliacaoSelected' | 'instrumentoNormativo';
            const otherKey = field.key === 'avaliacaoSelected' ? 'avaliacaoOther' : undefined;
            return (
              <CheckboxGroup
                key={field.key}
                label={field.label}
                options={field.options || []}
                selected={(rvData[selectedKey] as string[]) || []}
                onToggle={(opt) => {
                  const current = (rvData[selectedKey] as string[]) || [];
                  const updated = current.includes(opt)
                    ? current.filter((o) => o !== opt)
                    : [...current, opt];
                  updateData({ ...rvData, [selectedKey]: updated });
                }}
                otherValue={otherKey ? String((rvData as Record<string, unknown>)[otherKey] ?? '') : undefined}
                onOtherChange={otherKey ? (val) => updateData({ ...rvData, [otherKey]: val }) : undefined}
              />
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Structured chapters (4-13)
  const stData = data as StructuredChapterData;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>{chapter.title}</h2>
        <AutosaveIndicator status={saveStatus} />
      </div>

      {chapter.note && (
        <div className="chapter-section-note">{chapter.note}</div>
      )}

      <div className="chapter-section">
        <h3>Diagnóstico</h3>
        <TextAreaField
          label="Descreva a situação atual do município neste tema"
          value={stData.diagnosis}
          onChange={(val) => updateData({ ...stData, diagnosis: val })}
          rows={8}
          placeholder="Descreva o diagnóstico da situação atual..."
        />
      </div>

      <div className="chapter-section">
        <h3>Objetivos</h3>
        <CheckboxGroup
          label="Selecione os objetivos aplicáveis"
          options={chapter.objectives || []}
          selected={stData.objectives.selected}
          onToggle={(opt) => {
            const sel = stData.objectives.selected;
            const updated = sel.includes(opt) ? sel.filter((o) => o !== opt) : [...sel, opt];
            updateData({
              ...stData,
              objectives: { ...stData.objectives, selected: updated },
            });
          }}
          otherValue={stData.objectives.other}
          onOtherChange={(val) =>
            updateData({
              ...stData,
              objectives: { ...stData.objectives, other: val },
            })
          }
        />
      </div>

      <div className="chapter-section">
        <h3>Metas</h3>
        <GoalTable
          label="Selecione os temas de metas e preencha os detalhes"
          goals={stData.goals}
          onChange={(goals) => updateData({ ...stData, goals })}
          otherGoals={stData.goalsOther}
          onOtherChange={(goalsOther) => updateData({ ...stData, goalsOther })}
        />
      </div>

      <div className="chapter-section">
        <h3>Ações Estratégicas</h3>
        <ActionTable
          label="Selecione as ações estratégicas e especifique"
          actions={stData.actions}
          onChange={(actions) => updateData({ ...stData, actions })}
          otherActions={stData.actionsOther}
          onOtherChange={(actionsOther) => updateData({ ...stData, actionsOther })}
        />
      </div>
    </div>
  );
}
