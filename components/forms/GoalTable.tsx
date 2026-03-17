'use client';

import { Fragment } from 'react';
import { GoalItem } from '@/types/plano';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function GoalTable({
  label,
  goals,
  onChange,
  otherGoals,
  onOtherChange,
}: {
  label: string;
  goals: GoalItem[];
  onChange: (goals: GoalItem[]) => void;
  otherGoals: { theme: string; specification: string; quantity: string; deadline: string }[];
  onOtherChange: (goals: { theme: string; specification: string; quantity: string; deadline: string }[]) => void;
}) {
  function toggleGoal(index: number) {
    const updated = [...goals];
    updated[index] = { ...updated[index], checked: !updated[index].checked };
    onChange(updated);
  }

  function updateGoal(index: number, field: keyof GoalItem, value: string) {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function addOther() {
    onOtherChange([...otherGoals, { theme: '', specification: '', quantity: '', deadline: '' }]);
  }

  function updateOther(index: number, field: string, value: string) {
    const updated = [...otherGoals];
    updated[index] = { ...updated[index], [field]: value };
    onOtherChange(updated);
  }

  function removeOther(index: number) {
    onOtherChange(otherGoals.filter((_, i) => i !== index));
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <table className="goal-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th>Tema</th>
            <th style={{ width: 60 }}></th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal, i) => (
            <Fragment key={goal.theme}>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={goal.checked}
                    onChange={() => toggleGoal(i)}
                    style={{ width: 18, height: 18, accentColor: 'var(--primary-500)' }}
                  />
                </td>
                <td style={{ fontWeight: goal.checked ? 600 : 400 }}>{goal.theme}</td>
                <td>
                  {goal.checked ? <ChevronDown size={16} color="var(--gray-400)" /> : <ChevronRight size={16} color="var(--gray-300)" />}
                </td>
              </tr>
              {goal.checked && (
                <tr key={`${goal.theme}-expand`} className="expand-row">
                  <td colSpan={3}>
                    <div className="expand-fields">
                      <div className="expand-field">
                        <label>Especificação</label>
                        <textarea
                          rows={2}
                          value={goal.specification}
                          onChange={(e) => updateGoal(i, 'specification', e.target.value)}
                          placeholder="Descreva a meta..."
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="expand-field">
                          <label>Quantidade</label>
                          <input
                            value={goal.quantity}
                            onChange={(e) => updateGoal(i, 'quantity', e.target.value)}
                            placeholder="Ex: 10 km, 5 unidades..."
                          />
                        </div>
                        <div className="expand-field">
                          <label>Prazo</label>
                          <input
                            value={goal.deadline}
                            onChange={(e) => updateGoal(i, 'deadline', e.target.value)}
                            placeholder="Ex: Curto prazo (2 anos)"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {otherGoals.map((og, i) => (
            <tr key={`other-${i}`} className="expand-row">
              <td colSpan={3}>
                <div className="expand-fields">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>
                      Meta adicional {i + 1}
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => removeOther(i)}
                      style={{ color: 'var(--error-500)' }}
                    >
                      Remover
                    </button>
                  </div>
                  <div className="expand-field">
                    <label>Tema</label>
                    <input
                      value={og.theme}
                      onChange={(e) => updateOther(i, 'theme', e.target.value)}
                      placeholder="Nome da meta"
                    />
                  </div>
                  <div className="expand-field">
                    <label>Especificação</label>
                    <textarea
                      rows={2}
                      value={og.specification}
                      onChange={(e) => updateOther(i, 'specification', e.target.value)}
                      placeholder="Descreva a meta..."
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="expand-field">
                      <label>Quantidade</label>
                      <input
                        value={og.quantity}
                        onChange={(e) => updateOther(i, 'quantity', e.target.value)}
                        placeholder="Ex: 10 km"
                      />
                    </div>
                    <div className="expand-field">
                      <label>Prazo</label>
                      <input
                        value={og.deadline}
                        onChange={(e) => updateOther(i, 'deadline', e.target.value)}
                        placeholder="Ex: Curto prazo"
                      />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={addOther}>
        + Adicionar meta
      </button>
    </div>
  );
}
