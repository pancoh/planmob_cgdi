'use client';

import { useState, useEffect } from 'react';
import { CHAPTERS } from '@/lib/constants/capitulos';
import { buildMinutaHtml } from '@/lib/domain/build-minuta';

export default function MinutaPreview({
  planoId,
  municipio,
  uf,
}: {
  planoId: string;
  municipio: string;
  uf: string;
}) {
  const [html, setHtml] = useState('');
  const [activeChapter, setActiveChapter] = useState('');

  useEffect(() => {
    setHtml(buildMinutaHtml(planoId, municipio, uf));
  }, [planoId, municipio, uf]);

  function regenerate() {
    setHtml(buildMinutaHtml(planoId, municipio, uf));
  }

  return (
    <div className="minuta-container">
      <nav className="minuta-toc">
        <div className="minuta-toc-title">Sumário</div>
        {CHAPTERS.map((ch) => (
          <a
            key={ch.slug}
            href={`#ch-${ch.slug}`}
            className={`minuta-toc-item ${activeChapter === ch.slug ? 'active' : ''}`}
            onClick={() => setActiveChapter(ch.slug)}
          >
            {ch.order}. {ch.shortTitle}
          </a>
        ))}
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={regenerate}>
            Atualizar Minuta
          </button>
        </div>
      </nav>
      <div className="minuta-document" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
