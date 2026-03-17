import { redirect } from 'next/navigation';

export default async function PlanPage({ params }: { params: Promise<{ planoId: string }> }) {
  const { planoId } = await params;
  redirect(`/planos/${planoId}/capitulos/apresentacao`);
}
