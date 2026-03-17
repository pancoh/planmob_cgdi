'use client';

import { Fragment } from 'react';
import { ActionItem } from '@/types/plano';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function ActionTable({
  label,
  actions,
  onChange,
  otherActions,
  onOtherChange,
}: {
  label: string;
  actions: ActionItem[];
  onChange: (actions: ActionItem[]) => void;
  otherActions: { theme: string; specification: string }[];
  onOtherChange: (actions: { theme: string; specification: string }[]) => void;
}) {
  function toggleAction(index: number) {
    const updated = [...actions];
    updated[index] = { ...updated[index], checked: !updated[index].checked };
    onChange(updated);
  }

  function updateAction(index: number, value: string) {
    const updated = [...actions];
    updated[index] = { ...updated[index], specification: value };
    onChange(updated);
  }

  function addOther() {
    onOtherChange([...otherActions, { theme: '', specification: '' }]);
  }

  function updateOther(index: number, field: string, value: string) {
    const updated = [...otherActions];
    updated[index] = { ...updated[index], [field]: value };
    onOtherChange(updated);
  }

  function removeOther(index: number) {
    onOtherChange(otherActions.filter((_, i) => i !== index));
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <table className="action-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th>Ação Estratégica</th>
            <th style={{ width: 60 }}></th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action, i) => (
            <Fragment key={action.theme}>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={action.checked}
                    onChange={() => toggleAction(i)}
                    style={{ width: 18, height: 18, accentColor: 'var(--primary-500)' }}
                  />
                </td>
                <td style={{ fontWeight: action.checked ? 600 : 400 }}>{action.theme}</td>
                <td>
                  {action.checked ? <ChevronDown size={16} color="var(--gray-400)" /> : <ChevronRight size={16} color="var(--gray-300)" />}
                </td>
              </tr>
              {action.checked && (
                <tr key={`${action.theme}-expand`} className="expand-row">
                  <td colSpan={3}>
                    <div className="expand-fields">
                      <div className="expand-field">
                        <label>Especificação</label>
                        <textarea
                          rows={2}
                          value={action.specification}
                          onChange={(e) => updateAction(i, e.target.value)}
                          placeholder="Descreva a ação estratégica..."
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {otherActions.map((oa, i) => (
            <tr key={`other-${i}`} className="expand-row">
              <td colSpan={3}>
                <div className="expand-fields">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>
                      Ação adicional {i + 1}
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
                      value={oa.theme}
                      onChange={(e) => updateOther(i, 'theme', e.target.value)}
                      placeholder="Nome da ação"
                    />
                  </div>
                  <div className="expand-field">
                    <label>Especificação</label>
                    <textarea
                      rows={2}
                      value={oa.specification}
                      onChange={(e) => updateOther(i, 'specification', e.target.value)}
                      placeholder="Descreva a ação..."
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={addOther}>
        + Adicionar ação
      </button>
    </div>
  );
}
