'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CHAPTERS } from '@/lib/constants/capitulos';

type ChapterProgress = Record<string, 'empty' | 'partial' | 'complete'>;

export default function PlanSidebar({
  planoId,
  progress,
}: {
  planoId: string;
  progress: ChapterProgress;
}) {
  const pathname = usePathname();

  return (
    <aside className="plan-sidebar">
      <div className="plan-sidebar-title">Capítulos</div>
      {CHAPTERS.map((ch) => {
        const href = `/planos/${planoId}/capitulos/${ch.slug}`;
        const isActive = pathname === href;
        const status = progress[ch.slug] || 'empty';

        return (
          <Link key={ch.slug} href={href} className={`chapter-item ${isActive ? 'active' : ''}`}>
            <span className={`chapter-dot ${status}`} />
            <span className="chapter-number">{ch.order}.</span>
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ch.shortTitle}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
