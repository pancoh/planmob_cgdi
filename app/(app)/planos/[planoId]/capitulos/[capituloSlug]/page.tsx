import { PLAN_IDS, CHAPTER_SLUGS } from '@/lib/constants/static-params';
import CapituloClient from './CapituloClient';

export function generateStaticParams() {
  const params = [];
  for (const planoId of PLAN_IDS) {
    for (const capituloSlug of CHAPTER_SLUGS) {
      params.push({ planoId, capituloSlug });
    }
  }
  return params;
}

export default function CapituloPage() {
  return <CapituloClient />;
}
