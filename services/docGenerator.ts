
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, VerticalAlign, Footer, Header } from "docx";
import { ThesisData, Chapter, Reference } from "../types";

// --- CONSTANTS FOR UT STYLE ---
const FONT_FAMILY = "Times New Roman";
const FONT_SIZE_TEXT = 24; // 12pt (docx uses half-points)
const FONT_SIZE_TITLE = 28; // 14pt for Cover
const MARGINS = {
    top: "3cm",
    bottom: "3cm",
    left: "4cm", // 4cm Left margin
    right: "3cm"
};
const LINE_SPACING = 480; // ~2.0 spacing (240 * 2)
const TABLE_SPACING = 240; // 1.0 spacing for tables

// --- HELPER: Markdown Table Parser ---
const createTableFromMarkdown = (markdownTable: string): Table | null => {
  try {
    const lines = markdownTable.trim().split('\n');
    if (lines.length < 2) return null;

    const separatorIdx = lines.findIndex(line => /^\|?[\s\-:|]+\|?$/.test(line.trim()));
    if (separatorIdx === -1) {
        if (!lines[0].includes('|')) return null; 
    }

    let headerRowText = separatorIdx > 0 ? lines[separatorIdx - 1] : lines[0];
    let bodyRowsText = separatorIdx > 0 ? lines.slice(separatorIdx + 1) : lines.slice(1);

    const parseRow = (rowStr: string): string[] => {
        let clean = rowStr.trim();
        if (clean.startsWith('|')) clean = clean.substring(1);
        if (clean.endsWith('|')) clean = clean.substring(0, clean.length - 1);
        return clean.split('|').map(c => c.trim());
    };

    const docxRows: TableRow[] = [];

    // Header
    const headerCells = parseRow(headerRowText);
    docxRows.push(new TableRow({
        tableHeader: true,
        children: headerCells.map(text => new TableCell({
            children: [new Paragraph({
                children: [new TextRun({ text, bold: true, font: FONT_FAMILY, size: FONT_SIZE_TEXT })],
                alignment: AlignmentType.CENTER,
                spacing: { line: TABLE_SPACING }
            })],
            shading: { fill: "E5E7EB", type: ShadingType.CLEAR, color: "auto" },
            verticalAlign: VerticalAlign.CENTER,
            borders: {
                top: { style: BorderStyle.SINGLE, size: 2 },
                bottom: { style: BorderStyle.SINGLE, size: 2 },
                left: { style: BorderStyle.SINGLE, size: 2 },
                right: { style: BorderStyle.SINGLE, size: 2 },
            },
        }))
    }));

    // Body
    bodyRowsText.forEach(rowStr => {
        if (!rowStr.trim() || /^\|?[\s\-:|]+\|?$/.test(rowStr.trim())) return;
        const cells = parseRow(rowStr);
        docxRows.push(new TableRow({
            children: cells.map(text => new TableCell({
                children: [new Paragraph({ 
                    children: [new TextRun({ text, font: FONT_FAMILY, size: FONT_SIZE_TEXT })],
                    spacing: { line: TABLE_SPACING } 
                })],
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 2 },
                    bottom: { style: BorderStyle.SINGLE, size: 2 },
                    left: { style: BorderStyle.SINGLE, size: 2 },
                    right: { style: BorderStyle.SINGLE, size: 2 },
                },
            }))
        }));
    });

    return new Table({
      rows: docxRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    });
  } catch (e) {
    return null;
  }
};

// --- HELPER: Content Formatter ---
const formatChapterContent = (chapter: Chapter): (Paragraph | Table)[] => {
    const rawContent = chapter.content || "";
    const contentLines = rawContent.split('\n');
    const docElements: (Paragraph | Table)[] = [];
    let currentTableBuffer: string[] = [];

    // HEADERS
    docElements.push(
        new Paragraph({
            text: chapter.chapter_number === 6 ? "LAMPIRAN" : `BAB ${chapter.chapter_number}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240 },
        }),
        new Paragraph({
            text: chapter.title.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 480 },
        })
    );

    for (let i = 0; i < contentLines.length; i++) {
        let line = contentLines[i].trim();
        
        if (line.length === 0) {
            if (currentTableBuffer.length > 0) {
                 const table = createTableFromMarkdown(currentTableBuffer.join('\n'));
                 if (table) docElements.push(table);
                 currentTableBuffer = [];
            }
            continue; 
        }

        if (line.startsWith('|')) {
            currentTableBuffer.push(line);
            continue;
        } else if (currentTableBuffer.length > 0) {
             const table = createTableFromMarkdown(currentTableBuffer.join('\n'));
             if (table) docElements.push(table);
             currentTableBuffer = [];
        }

        // Sub-Chapters (A. JUDUL)
        if (/^[A-Z]\.\s/.test(line)) {
            docElements.push(new Paragraph({
                children: [new TextRun({ text: line, font: FONT_FAMILY, size: FONT_SIZE_TEXT, bold: true })],
                spacing: { before: 240, after: 120, line: LINE_SPACING },
                alignment: AlignmentType.LEFT
            }));
            continue;
        }

        // Sub-Sub-Chapters (1. Judul)
        if (/^\d+\.\s/.test(line) && line.length < 80) {
             docElements.push(new Paragraph({
                children: [new TextRun({ text: line, font: FONT_FAMILY, size: FONT_SIZE_TEXT, bold: true })],
                spacing: { before: 120, after: 0, line: LINE_SPACING },
                indent: { left: 720, hanging: 360 } 
            }));
            continue;
        }

        // Regular Text (Indent start of paragraph 5 spaces/approx 0.7cm)
        docElements.push(new Paragraph({
            children: [new TextRun({ text: line, font: FONT_FAMILY, size: FONT_SIZE_TEXT })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: LINE_SPACING, after: 0 },
            indent: { firstLine: 720 } // Indent first line of paragraph
        }));
    }

    if (currentTableBuffer.length > 0) {
        const table = createTableFromMarkdown(currentTableBuffer.join('\n'));
        if (table) docElements.push(table);
    }

    docElements.push(new Paragraph({ text: "", pageBreakBefore: true }));
    return docElements;
};

// --- HELPER: Title Page (UT Style) ---
const createTitlePage = (thesisData: ThesisData): Paragraph[] => {
    return [
        new Paragraph({
            children: [new TextRun({ text: "TUGAS AKHIR PROGRAM MAGISTER", font: FONT_FAMILY, size: FONT_SIZE_TITLE, bold: true })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 1200, after: 480 },
        }),
        new Paragraph({
            children: [new TextRun({ text: thesisData.title.toUpperCase(), font: FONT_FAMILY, size: FONT_SIZE_TITLE, bold: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
        }),
         new Paragraph({
            children: [new TextRun({ text: "Tujuan penyusunan TAPM sebagai salah satu syarat untuk memperoleh", font: FONT_FAMILY, size: FONT_SIZE_TEXT })],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [new TextRun({ text: "gelar Magister pada program studi " + thesisData.program, font: FONT_FAMILY, size: FONT_SIZE_TEXT })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
        }),
        // Logo Placeholder
        new Paragraph({
            children: [new TextRun({ text: "(LOGO UNIVERSITAS TERBUKA)", font: FONT_FAMILY, size: FONT_SIZE_TEXT, bold: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
        }),
        new Paragraph({
            children: [new TextRun({ text: "Disusun Oleh:", font: FONT_FAMILY, size: FONT_SIZE_TEXT })],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [new TextRun({ text: thesisData.studentName, font: FONT_FAMILY, size: FONT_SIZE_TEXT, bold: true })],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [new TextRun({ text: "NIM. " + thesisData.studentId, font: FONT_FAMILY, size: FONT_SIZE_TEXT })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
        }),
        new Paragraph({
            children: [new TextRun({ text: thesisData.faculty.toUpperCase(), font: FONT_FAMILY, size: FONT_SIZE_TITLE, bold: true })],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [new TextRun({ text: thesisData.university.toUpperCase(), font: FONT_FAMILY, size: FONT_SIZE_TITLE, bold: true })],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [new TextRun({ text: new Date().getFullYear().toString(), font: FONT_FAMILY, size: FONT_SIZE_TITLE, bold: true })],
            alignment: AlignmentType.CENTER,
            pageBreakBefore: false,
        }),
        new Paragraph({ text: "", pageBreakBefore: true }),
    ];
};

export const generateRISBlob = (references: Reference[]): Blob => {
    const risLines: string[] = [];
    references.forEach(ref => {
        const type = /press|publishing|pustaka|buk/i.test(ref.title) ? 'BOOK' : 'GEN';
        risLines.push(`TY  - ${type}`);
        risLines.push(`TI  - ${ref.title}`);
        const yearMatch = ref.title.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) risLines.push(`PY  - ${yearMatch[0]}`);
        if (ref.uri) risLines.push(`UR  - ${ref.uri}`);
        risLines.push('ER  - ');
        risLines.push('');
    });
    return new Blob([risLines.join('\n')], { type: 'application/x-research-info-systems' });
};

export const generateSingleChapterDocx = async (thesisData: ThesisData, chapter: Chapter): Promise<Blob> => {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: FONT_FAMILY, size: FONT_SIZE_TEXT },
                    paragraph: { spacing: { line: LINE_SPACING } }
                },
                heading1: { run: { font: FONT_FAMILY, size: FONT_SIZE_TITLE, bold: true, allCaps: true } },
                heading2: { run: { font: FONT_FAMILY, size: FONT_SIZE_TEXT, bold: true } },
                heading3: { run: { font: FONT_FAMILY, size: FONT_SIZE_TEXT, bold: true } }
            }
        },
        sections: [
            {
                properties: {
                    page: { margin: MARGINS },
                },
                children: [
                    ...formatChapterContent(chapter)
                ],
            },
        ],
    });
    return await Packer.toBlob(doc);
};

export const generateDocxBlob = async (thesisData: ThesisData, chapters: Chapter[], references: Reference[]): Promise<Blob> => {
  const sortedReferences = [...references].sort((a, b) => a.title.localeCompare(b.title));

  const doc = new Document({
    styles: {
            default: {
                document: {
                    run: { font: FONT_FAMILY, size: FONT_SIZE_TEXT },
                    paragraph: { spacing: { line: LINE_SPACING } }
                },
            }
    },
    sections: [
      {
        properties: {
          page: { margin: MARGINS },
        },
        headers: {
            default: new Header({
                children: [
                    new Paragraph({
                        children: [new TextRun({ children: ["Page ", "PAGE"] })],
                        alignment: AlignmentType.RIGHT, // Top Right as per Content Section guide
                    })
                ]
            })
        },
        children: [
          // 1. Title Page
          ...createTitlePage(thesisData),

          // 2. DAFTAR ISI Placeholder
          new Paragraph({
             text: "DAFTAR ISI",
             heading: HeadingLevel.HEADING_1,
             alignment: AlignmentType.CENTER,
             spacing: { after: 300 },
          }),
          new Paragraph({
             children: [
                new TextRun({
                    text: "(Halaman ini akan diisi otomatis oleh Microsoft Word. Klik Kanan > Update Field)",
                    italics: true,
                    size: 20
                })
             ],
             alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // 3. Chapters Content (Including Ch 6 Lampiran)
          ...chapters.flatMap(formatChapterContent),

          // 4. Bibliography
          new Paragraph({
            text: "DAFTAR PUSTAKA",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          ...sortedReferences.map(ref => {
            return new Paragraph({
                children: [new TextRun({ text: ref.title, font: FONT_FAMILY, size: FONT_SIZE_TEXT })],
                alignment: AlignmentType.LEFT,
                spacing: { line: 240, after: 240 }, // Single spacing for Bib
                indent: { hanging: 720 },
            });
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};
