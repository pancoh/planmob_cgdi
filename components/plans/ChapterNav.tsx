'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CHAPTERS } from '@/lib/constants/capitulos';

export default function ChapterNav({ planoId }: { planoId: string }) {
  const pathname = usePathname();

  return (
    <nav className="chapter-nav">
      {CHAPTERS.map((ch) => {
        const href = `/planos/${planoId}/capitulos/${ch.slug}`;
        const isActive = pathname === href;
        return (
          <Link key={ch.slug} href={href} className={`chapter-nav-item ${isActive ? 'active' : ''}`}>
            {ch.shortTitle}
          </Link>
        );
      })}
    </nav>
  );
}
