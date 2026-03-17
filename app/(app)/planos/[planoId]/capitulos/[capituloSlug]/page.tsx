'use client';

import { useParams } from 'next/navigation';
import { getChapterBySlug } from '@/lib/constants/capitulos';
import ChapterEditor from '@/components/plans/ChapterEditor';

export default function CapituloPage() {
  const params = useParams();
  const planoId = params.planoId as string;
  const slug = params.capituloSlug as string;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: 'var(--error-500)' }}>Capítulo não encontrado</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          O capítulo &quot;{slug}&quot; não existe.
        </p>
      </div>
    );
  }

  return <ChapterEditor chapter={chapter} planoId={planoId} />;
}
