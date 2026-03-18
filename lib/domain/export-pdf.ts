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
    h1 { font-size: 22pt; text-align: center; margin-bottom: 8px; color: #0f766e; }
    h2 { font-size: 15pt; color: #0f766e; margin-top: 32px; border-bottom: 2px solid #0f766e; padding-bottom: 6px; }
    h3 { font-size: 13pt; margin-top: 18px; color: #374151; }
    ol, ul { margin: 8px 0; padding-left: 24px; }
    li { margin-bottom: 4px; }
    p { margin-bottom: 10px; text-align: justify; }

    /* Cover */
    .minuta-cover {
      text-align: center;
      padding: 80px 0 40px;
      border-bottom: 3px solid #0f766e;
      margin-bottom: 40px;
    }
    .minuta-cover h1 {
      font-size: 26pt;
      margin-bottom: 12px;
    }
    .minuta-subtitle {
      font-size: 16pt;
      color: #4b5563;
      margin-bottom: 0;
      text-align: center;
    }

    /* Table of Contents */
    .minuta-toc-page {
      margin-bottom: 40px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e5e7eb;
    }
    .minuta-toc-heading {
      font-size: 17pt;
      color: #0f766e;
      border-bottom: 2px solid #0f766e;
      padding-bottom: 6px;
      margin-bottom: 16px;
    }
    .minuta-toc-list {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }
    .minuta-toc-list li {
      padding: 6px 0;
      border-bottom: 1px dotted #d1d5db;
    }
    .minuta-toc-list li:last-child {
      border-bottom: none;
    }
    .minuta-toc-list a {
      text-decoration: none;
      color: #1f2937;
      font-size: 12pt;
    }
    .minuta-toc-list a:hover {
      color: #0f766e;
    }

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
      body { padding: 0; max-width: none; }
      .minuta-cover { page-break-after: always; padding: 200px 0 0; }
      .minuta-toc-page { page-break-after: always; }
      h2 { page-break-before: always; }
      h2:first-of-type { page-break-before: avoid; }
      .minuta-toc-list a { color: #1f2937; }
    }
  </style>
</head>
<body>
  ${minutaHtml}
</body>
</html>`;
}
