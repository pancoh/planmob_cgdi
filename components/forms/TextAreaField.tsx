'use client';

export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea
        className="form-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
      {hint && <div className="form-hint">{hint}</div>}
    </div>
  );
}
