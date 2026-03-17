import { SessionData } from '@/types/auth';

const SESSION_KEY = 'planmob_session';

export function getClientSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function setClientSession(data: SessionData): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearClientSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
