import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import AdminShell from '@/components/layout/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.role !== 'administrador') redirect('/dashboard');

  return <AdminShell session={session}>{children}</AdminShell>;
}
