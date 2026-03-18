'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Upload, Trash2, Image, FileText } from 'lucide-react';
import { CHAPTERS } from '@/lib/constants/capitulos';
import { Attachment } from '@/types/plano';

type ApiAnexo = {
  id: string;
  plano_id: string;
  capitulo_slug: string;
  name: string;
  type: string;
  size: number;
  caption: string;
  storage_path: string;
  created_at: string;
  publicUrl: string | null;
};

function mapApiAnexo(a: ApiAnexo): Attachment {
  return {
    id: a.id,
    planoId: a.plano_id,
    capituloSlug: a.capitulo_slug,
    name: a.name,
    type: a.type,
    size: a.size,
    caption: a.caption,
    storagePath: a.storage_path,
    publicUrl: a.publicUrl ?? undefined,
    createdAt: a.created_at,
  };
}

export default function AnexosClient() {
  const params = useParams();
  const planoId = params.planoId as string;
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [filterChapter, setFilterChapter] = useState('all');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/planos/${planoId}/anexos`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar anexos');
        return res.json();
      })
      .then((data: ApiAnexo[]) => {
        setAttachments(data.map(mapApiAnexo));
      })
      .catch((err) => {
        console.error('[AnexosClient] failed to load anexos:', err);
      });
  }, [planoId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    const capituloSlug = filterChapter === 'all' ? 'apresentacao' : filterChapter;

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('capituloSlug', capituloSlug);
        formData.append('caption', '');

        const res = await fetch(`/api/planos/${planoId}/anexos`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const created: ApiAnexo = await res.json();
          setAttachments((prev) => [...prev, mapApiAnexo(created)]);
        } else {
          const data = await res.json();
          console.error('[AnexosClient] upload error:', data.error);
        }
      } catch (err) {
        console.error('[AnexosClient] upload failed:', err);
      }
    }

    setUploading(false);
    e.target.value = '';
  }

  async function removeAttachment(id: string) {
    try {
      const res = await fetch(`/api/planos/${planoId}/anexos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAttachments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('[AnexosClient] delete failed:', err);
    }
  }

  async function updateCaption(id: string, caption: string) {
    // Optimistic update
    setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, caption } : a)));

    try {
      await fetch(`/api/planos/${planoId}/anexos/${id}/caption`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });
    } catch (err) {
      console.error('[AnexosClient] caption update failed:', err);
    }
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
        <label className="btn btn-primary" style={{ cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
          <Upload size={18} /> {uploading ? 'Enviando...' : 'Adicionar Arquivo'}
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
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
                {att.type.startsWith('image/') && att.publicUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={att.publicUrl}
                    alt={att.caption || att.name}
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
