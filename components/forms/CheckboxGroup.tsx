'use client';

export default function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  otherValue,
  onOtherChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        {options.map((opt) => (
          <label key={opt} className="form-check">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
            />
            <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>{opt}</span>
          </label>
        ))}
        {onOtherChange !== undefined && (
          <div style={{ marginTop: 4 }}>
            <label className="form-check" style={{ marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={(otherValue || '').length > 0}
                onChange={() => {
                  if (otherValue && otherValue.length > 0) {
                    onOtherChange('');
                  }
                }}
                readOnly={!otherValue}
              />
              <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>Outro(s)</span>
            </label>
            <input
              className="form-input"
              style={{ marginLeft: 26, width: 'calc(100% - 26px)' }}
              placeholder="Especifique..."
              value={otherValue || ''}
              onChange={(e) => onOtherChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
