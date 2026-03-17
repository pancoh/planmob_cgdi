export function buildPdfHtml(minutaHtml: string, municipio: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Plano de Mobilidade Urbana — ${municipio}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 12pt;
      line-height: 1.8;
      color: #1f2937;
      max-width: 700px;
      margin: 0 auto;
      padding: 40px;
    }
    h1 { font-size: 20pt; text-align: center; margin-bottom: 8px; }
    h2 { font-size: 15pt; color: #0f766e; margin-top: 28px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    h3 { font-size: 13pt; margin-top: 16px; }
    ol, ul { margin: 8px 0; padding-left: 24px; }
    li { margin-bottom: 4px; }
    p { margin-bottom: 10px; text-align: justify; }
    .minuta-placeholder {
      background: #fff8e1;
      border: 1px dashed #d9aa1f;
      padding: 2px 6px;
      border-radius: 4px;
      font-style: italic;
      color: #8c6f00;
      font-size: 11pt;
    }
    @media print {
      body { padding: 0; }
      h2 { page-break-before: auto; }
    }
  </style>
</head>
<body>
  ${minutaHtml}
</body>
</html>`;
}
