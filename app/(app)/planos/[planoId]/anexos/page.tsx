'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Upload, Trash2, Image, FileText } from 'lucide-react';
import { CHAPTERS } from '@/lib/constants/capitulos';
import { Attachment } from '@/types/plano';

function getAttachmentsKey(planoId: string) {
  return `planmob:${planoId}:attachments`;
}

export default function AnexosPage() {
  const params = useParams();
  const planoId = params.planoId as string;
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [filterChapter, setFilterChapter] = useState('all');

  useEffect(() => {
    const stored = localStorage.getItem(getAttachmentsKey(planoId));
    if (stored) {
      try { setAttachments(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, [planoId]);

  function saveAttachments(list: Attachment[]) {
    setAttachments(list);
    localStorage.setItem(getAttachmentsKey(planoId), JSON.stringify(list));
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          planoId,
          capituloSlug: filterChapter === 'all' ? 'apresentacao' : filterChapter,
          name: file.name,
          type: file.type,
          size: file.size,
          caption: '',
          dataUrl: reader.result as string,
          createdAt: new Date().toISOString(),
        };
        saveAttachments([...attachments, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  }

  function removeAttachment(id: string) {
    saveAttachments(attachments.filter((a) => a.id !== id));
  }

  function updateCaption(id: string, caption: string) {
    saveAttachments(attachments.map((a) => (a.id === id ? { ...a, caption } : a)));
  }

  const filtered = filterChapter === 'all'
    ? attachments
    : attachments.filter((a) => a.capituloSlug === filterChapter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>
          Anexos (Fotos, mapas, gráficos)
        </h2>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={18} /> Adicionar Arquivo
          <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <select
          className="form-select"
          style={{ maxWidth: 300 }}
          value={filterChapter}
          onChange={(e) => setFilterChapter(e.target.value)}
        >
          <option value="all">Todos os capítulos</option>
          {CHAPTERS.map((ch) => (
            <option key={ch.slug} value={ch.slug}>
              Cap. {ch.order} — {ch.shortTitle}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Image size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Nenhum anexo adicionado</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Use o botão acima para adicionar fotos, mapas ou gráficos
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((att) => (
            <div key={att.id} className="card">
              <div style={{ padding: 16, borderBottom: '1px solid var(--border-soft)' }}>
                {att.type.startsWith('image/') && att.dataUrl ? (
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <FileText size={40} color="var(--gray-300)" />
                  </div>
                )}
              </div>
              <div className="card-body" style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {att.name}
                </div>
                <input
                  className="form-input"
                  placeholder="Legenda do anexo..."
                  value={att.caption}
                  onChange={(e) => updateCaption(att.id, e.target.value)}
                  style={{ fontSize: 12, minHeight: 36 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {(att.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeAttachment(att.id)}
                    style={{ color: 'var(--error-500)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
