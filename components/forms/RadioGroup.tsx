'use client';

export default function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
        {options.map((opt) => (
          <label key={opt} className="form-check">
            <input
              type="radio"
              name={label}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <span style={{ fontSize: 14 }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
