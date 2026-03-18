import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAnexos, createAnexo, deleteAnexo } from '@/lib/db/queries';
import { createServerClient } from '@/lib/db/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ planoId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planoId } = await params;
  const anexos = await getAnexos(planoId);

  const supabase = createServerClient();
  const anexosWithUrls = await Promise.all(
    anexos.map(async (anexo) => {
      const { data } = await supabase.storage
        .from('anexos')
        .createSignedUrl(anexo.storage_path, 60 * 60 * 24 * 365);
      return { ...anexo, publicUrl: data?.signedUrl ?? null };
    }),
  );

  return NextResponse.json(anexosWithUrls);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planoId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planoId } = await params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const capituloSlug = formData.get('capituloSlug') as string | null;
  const caption = (formData.get('caption') as string | null) ?? '';

  if (!file || !capituloSlug) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
  }

  const filename = file.name;
  const storagePath = `${planoId}/${Date.now()}_${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = createServerClient();
  const { error: uploadError } = await supabase.storage
    .from('anexos')
    .upload(storagePath, buffer, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: 'Erro no upload: ' + uploadError.message }, { status: 500 });
  }

  const record = await createAnexo({
    plano_id: planoId,
    capitulo_slug: capituloSlug,
    name: filename,
    type: file.type,
    size: file.size,
    caption,
    storage_path: storagePath,
  });

  if (!record) {
    return NextResponse.json({ error: 'Erro ao salvar metadata do anexo' }, { status: 500 });
  }

  const { data: signedData } = await supabase.storage
    .from('anexos')
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

  return NextResponse.json({ ...record, publicUrl: signedData?.signedUrl ?? null }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ planoId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await params; // ensure params resolved (planoId available if needed)

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 });
  }

  // Fetch the record to get storage_path before deletion
  const supabase = createServerClient();

  // Get the anexo record directly
  const { data: anexo } = await supabase
    .from('anexos')
    .select('storage_path')
    .eq('id', body.id)
    .single();

  if (anexo?.storage_path) {
    await supabase.storage.from('anexos').remove([anexo.storage_path]);
  }

  await deleteAnexo(body.id);

  return NextResponse.json({ ok: true });
}
