import { MOCK_PLANS } from '@/lib/mock-data';
import { CHAPTERS } from '@/lib/constants/capitulos';

export const PLAN_IDS = MOCK_PLANS.map((p) => p.id);
export const CHAPTER_SLUGS = CHAPTERS.map((c) => c.slug);
