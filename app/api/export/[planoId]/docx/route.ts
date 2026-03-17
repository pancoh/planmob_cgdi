import { NextRequest, NextResponse } from 'next/server';
import { buildDocx } from '@/lib/domain/export-docx';
import { MOCK_PLANS } from '@/lib/mock-data';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planoId: string }> }
) {
  const { planoId } = await params;

  const plan = MOCK_PLANS.find((p) => p.id === planoId);
  const municipio = plan?.prefeituraName || 'Município';
  const uf = plan?.uf || 'UF';

  // Receive chapter data from client (since localStorage is client-side)
  const body = await request.json();
  const chapterDataMap: Record<string, string> = body.chapterData || {};

  const buffer = await buildDocx(chapterDataMap, municipio, uf);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="Minuta_PlanMob_${municipio.replace(/\s+/g, '_')}.docx"`,
    },
  });
}

// Also handle GET for simple navigation
export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ planoId: string }> }
) {
  const { planoId } = await ctx.params;

  // Return an HTML page that collects localStorage data and POSTs it
  const html = `<!DOCTYPE html>
<html><head><title>Exportar DOCX</title>
<style>
body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
.msg { text-align: center; }
</style>
</head><body>
<div class="msg">
  <p>Gerando documento Word...</p>
</div>
<script>
  const planoId = ${JSON.stringify(planoId)};
  const chapters = ['apresentacao','historico','caracterizacao','transporte-coletivo','circulacao-viaria','infraestruturas','modos-nao-motorizados','acessibilidade','integracao-modal','polos-geradores','areas-vulneraveis','seguranca-viaria','logistica-urbana','revisao-atualizacao'];
  const chapterData = {};
  for (const slug of chapters) {
    const raw = localStorage.getItem('planmob:'+planoId+':'+slug);
    if (raw) chapterData[slug] = raw;
  }
  fetch('/api/export/'+planoId+'/docx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterData })
  })
  .then(r => r.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Minuta_PlanMob.docx';
    a.click();
    document.querySelector('.msg').innerHTML = '<p>Download iniciado! Você pode fechar esta aba.</p>';
  })
  .catch(err => {
    document.querySelector('.msg').innerHTML = '<p style="color:red">Erro: '+err.message+'</p>';
  });
</script>
</body></html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
