'use client';

export default function AutosaveIndicator({ status }: { status: 'idle' | 'saving' | 'saved' }) {
  if (status === 'idle') return null;

  return (
    <span className={`autosave-indicator ${status}`}>
      <span className="autosave-dot" />
      {status === 'saving' ? 'Salvando...' : 'Salvo'}
    </span>
  );
}
