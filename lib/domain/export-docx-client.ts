import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
  TabStopPosition,
  TabStopType,
  PageBreak,
  ImageRun,
} from 'docx';
import { CHAPTERS } from '@/lib/constants/capitulos';
import {
  TextFreeData,
  StructuredChapterData,
  ReviewChapterData,
  Attachment,
} from '@/types/plano';

async function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const maxWidth = 500;
      const ratio = Math.min(maxWidth / img.naturalWidth, 1);
      resolve({ width: Math.round(img.naturalWidth * ratio), height: Math.round(img.naturalHeight * ratio) });
    };
    img.onerror = () => resolve({ width: 400, height: 300 });
    img.src = dataUrl;
  });
}

export async function buildDocxClient(
  planoId: string,
  chapterDataMap: Record<string, string>,
  municipio: string,
  uf: string
): Promise<Blob> {
  // Load attachments
  let attachments: Attachment[] = [];
  const rawAtts = localStorage.getItem(`planmob:${planoId}:attachments`);
  if (rawAtts) {
    try { attachments = JSON.parse(rawAtts); } catch { /* ignore */ }
  }
  const paragraphs: Paragraph[] = [];

  // Cover page
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 3000, after: 200 },
      children: [
        new TextRun({
          text: 'PLANO DE MOBILIDADE URBANA',
          bold: true,
          size: 44,
          font: 'IBM Plex Sans',
          color: '0f766e',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Município de ${municipio} — ${uf}`,
          size: 28,
          font: 'IBM Plex Sans',
          color: '4b5563',
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // Table of Contents
  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 300 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 2, color: '0f766e' },
      },
      children: [
        new TextRun({
          text: 'Sumário',
          bold: true,
          size: 28,
          color: '0f766e',
          font: 'IBM Plex Sans',
        }),
      ],
    })
  );

  for (const ch of CHAPTERS) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
            leader: 'dot' as const,
          },
        ],
        children: [
          new TextRun({
            text: ch.title,
            size: 22,
            font: 'IBM Plex Sans',
          }),
        ],
      })
    );
  }
  if (attachments.length > 0) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: 'Anexos', size: 22, font: 'IBM Plex Sans' })],
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      spacing: { before: 400 },
      children: [new PageBreak()],
    })
  );

  for (const chapter of CHAPTERS) {
    const raw = chapterDataMap[chapter.slug];

    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '0f766e' },
        },
        children: [
          new TextRun({
            text: chapter.title,
            bold: true,
            size: 28,
            color: '0f766e',
            font: 'IBM Plex Sans',
          }),
        ],
      })
    );

    if (chapter.type === 'text-free') {
      const data: TextFreeData = raw ? JSON.parse(raw) : {};
      for (const field of chapter.fields || []) {
        paragraphs.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: field.label, bold: true, size: 24, font: 'IBM Plex Sans' }),
            ],
          })
        );
        const val = data[field.key]?.trim();
        paragraphs.push(
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: val || '[Não preenchido]',
                italics: !val,
                size: 22,
                font: 'IBM Plex Sans',
              }),
            ],
          })
        );
      }
      continue;
    }

    if (chapter.type === 'structured') {
      const data: StructuredChapterData = raw
        ? JSON.parse(raw)
        : { diagnosis: '', objectives: { selected: [], other: '' }, goals: [], goalsOther: [], actions: [], actionsOther: [] };

      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: 'Diagnóstico', bold: true, size: 24, font: 'IBM Plex Sans' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: data.diagnosis.trim() || '[Não preenchido]',
              italics: !data.diagnosis.trim(),
              size: 22,
              font: 'IBM Plex Sans',
            }),
          ],
        })
      );

      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: 'Objetivos', bold: true, size: 24, font: 'IBM Plex Sans' })],
        })
      );
      const allObj = [...data.objectives.selected];
      if (data.objectives.other?.trim()) allObj.push(data.objectives.other.trim());
      if (allObj.length > 0) {
        allObj.forEach((obj) => {
          paragraphs.push(
            new Paragraph({
              numbering: { reference: 'default-numbering', level: 0 },
              spacing: { after: 80 },
              children: [new TextRun({ text: obj, size: 22, font: 'IBM Plex Sans' })],
            })
          );
        });
      } else {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: '[Nenhum objetivo selecionado]', italics: true, size: 22, font: 'IBM Plex Sans' })],
          })
        );
      }

      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: 'Metas', bold: true, size: 24, font: 'IBM Plex Sans' })],
        })
      );
      const checkedGoals = data.goals.filter((g) => g.checked);
      const allGoals = [...checkedGoals, ...data.goalsOther.filter((g) => g.theme.trim())];
      if (allGoals.length > 0) {
        allGoals.forEach((g) => {
          paragraphs.push(
            new Paragraph({
              numbering: { reference: 'default-numbering', level: 0 },
              spacing: { after: 40 },
              children: [new TextRun({ text: g.theme, bold: true, size: 22, font: 'IBM Plex Sans' })],
            })
          );
          if (g.specification?.trim()) {
            paragraphs.push(
              new Paragraph({
                indent: { left: 720 },
                children: [new TextRun({ text: `Especificação: ${g.specification}`, size: 22, font: 'IBM Plex Sans' })],
              })
            );
          }
          if ('quantity' in g && g.quantity?.trim()) {
            paragraphs.push(
              new Paragraph({
                indent: { left: 720 },
                children: [new TextRun({ text: `Quantidade: ${g.quantity}`, size: 22, font: 'IBM Plex Sans' })],
              })
            );
          }
          if ('deadline' in g && g.deadline?.trim()) {
            paragraphs.push(
              new Paragraph({
                indent: { left: 720 },
                spacing: { after: 100 },
                children: [new TextRun({ text: `Prazo: ${g.deadline}`, size: 22, font: 'IBM Plex Sans' })],
              })
            );
          }
        });
      } else {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: '[Nenhuma meta definida]', italics: true, size: 22, font: 'IBM Plex Sans' })],
          })
        );
      }

      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: 'Ações Estratégicas', bold: true, size: 24, font: 'IBM Plex Sans' })],
        })
      );
      const checkedActions = data.actions.filter((a) => a.checked);
      const allActions = [...checkedActions, ...data.actionsOther.filter((a) => a.theme.trim())];
      if (allActions.length > 0) {
        allActions.forEach((a) => {
          paragraphs.push(
            new Paragraph({
              numbering: { reference: 'default-numbering', level: 0 },
              spacing: { after: 40 },
              children: [new TextRun({ text: a.theme, bold: true, size: 22, font: 'IBM Plex Sans' })],
            })
          );
          if (a.specification?.trim()) {
            paragraphs.push(
              new Paragraph({
                indent: { left: 720 },
                spacing: { after: 100 },
                children: [new TextRun({ text: `Especificação: ${a.specification}`, size: 22, font: 'IBM Plex Sans' })],
              })
            );
          }
        });
      } else {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: '[Nenhuma ação definida]', italics: true, size: 22, font: 'IBM Plex Sans' })],
          })
        );
      }
      continue;
    }

    if (chapter.type === 'review') {
      const data: ReviewChapterData = raw
        ? JSON.parse(raw)
        : { prazoAtualizacao: '', revisoesPeriodicasSim: false, avaliacaoSelected: [], avaliacaoOther: '', orgaoResponsavel: '', instrumentoNormativo: [] };

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Prazo para atualização: ', bold: true, size: 22, font: 'IBM Plex Sans' }),
            new TextRun({ text: data.prazoAtualizacao ? `${data.prazoAtualizacao} anos` : '[Não informado]', size: 22, font: 'IBM Plex Sans', italics: !data.prazoAtualizacao }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'Revisões periódicas: ', bold: true, size: 22, font: 'IBM Plex Sans' }),
            new TextRun({ text: data.revisoesPeriodicasSim ? 'Sim' : 'Não', size: 22, font: 'IBM Plex Sans' }),
          ],
        })
      );

      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Instrumentos de Avaliação e Monitoramento', bold: true, size: 24, font: 'IBM Plex Sans' })],
        })
      );
      const avItems = [...data.avaliacaoSelected];
      if (data.avaliacaoOther?.trim()) avItems.push(data.avaliacaoOther.trim());
      avItems.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: item, size: 22, font: 'IBM Plex Sans' })],
          })
        );
      });

      paragraphs.push(
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({ text: 'Órgão responsável: ', bold: true, size: 22, font: 'IBM Plex Sans' }),
            new TextRun({ text: data.orgaoResponsavel?.trim() || '[Não informado]', size: 22, font: 'IBM Plex Sans', italics: !data.orgaoResponsavel?.trim() }),
          ],
        })
      );

      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200 },
          children: [new TextRun({ text: 'Instrumento Normativo', bold: true, size: 24, font: 'IBM Plex Sans' })],
        })
      );
      data.instrumentoNormativo.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: item, size: 22, font: 'IBM Plex Sans' })],
          })
        );
      });
    }
  }

  // Anexos section
  if (attachments.length > 0) {
    paragraphs.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '0f766e' } },
        children: [new TextRun({ text: 'Anexos', bold: true, size: 28, color: '0f766e', font: 'IBM Plex Sans' })],
      })
    );

    // Group by chapter
    const byChapter = new Map<string, Attachment[]>();
    for (const att of attachments) {
      const list = byChapter.get(att.capituloSlug) ?? [];
      list.push(att);
      byChapter.set(att.capituloSlug, list);
    }

    for (const [slug, atts] of byChapter.entries()) {
      const chapter = CHAPTERS.find((c) => c.slug === slug);
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
          children: [new TextRun({ text: chapter?.title ?? slug, bold: true, size: 24, font: 'IBM Plex Sans' })],
        })
      );

      for (const att of atts) {
        if (att.type.startsWith('image/') && att.dataUrl) {
          const base64 = att.dataUrl.split(',')[1];
          const ext = att.type.split('/')[1].replace('jpeg', 'jpg') as 'png' | 'jpg' | 'gif' | 'bmp';
          const dims = await getImageDimensions(att.dataUrl);
          paragraphs.push(
            new Paragraph({
              spacing: { before: 100, after: 60 },
              children: [
                new ImageRun({
                  data: base64,
                  transformation: { width: dims.width, height: dims.height },
                  type: ext === 'jpg' ? 'jpg' : ext,
                }),
              ],
            })
          );
          if (att.caption.trim()) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 200 },
                children: [new TextRun({ text: att.caption, italics: true, size: 20, font: 'IBM Plex Sans', color: '64748b' })],
              })
            );
          }
        } else {
          paragraphs.push(
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({ text: `Arquivo: ${att.name}`, bold: true, size: 22, font: 'IBM Plex Sans' }),
                ...(att.caption.trim() ? [new TextRun({ text: ` — ${att.caption}`, size: 22, font: 'IBM Plex Sans' })] : []),
              ],
            })
          );
        }
      }
    }
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            {
              level: 0,
              format: 'decimal' as const,
              text: '%1.',
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
