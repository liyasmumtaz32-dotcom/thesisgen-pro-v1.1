
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType, VerticalAlign, Footer, IParagraphOptions } from "docx";
import { ThesisData, Chapter, Reference } from "../types";

// --- HELPER: Markdown Table Parser ---
const createTableFromMarkdown = (markdownTable: string): Table | null => {
  try {
    const lines = markdownTable.trim().split('\n');
    if (lines.length < 2) return null;

    const separatorIdx = lines.findIndex(line => /^\|?[\s\-:|]+\|?$/.test(line.trim()));
    
    if (separatorIdx === -1) {
        if (!lines[0].includes('|')) return null; 
    }

    let headerRowText: string | null = null;
    let bodyRowsText: string[] = [];

    if (separatorIdx > 0) {
        headerRowText = lines[separatorIdx - 1];
        bodyRowsText = lines.slice(separatorIdx + 1);
    } else {
        headerRowText = lines[0];
        bodyRowsText = lines.slice(1);
    }

    const parseRow = (rowStr: string): string[] => {
        let clean = rowStr.trim();
        if (clean.startsWith('|')) clean = clean.substring(1);
        if (clean.endsWith('|')) clean = clean.substring(0, clean.length - 1);
        return clean.split('|').map(c => c.trim());
    };

    const docxRows: TableRow[] = [];

    if (headerRowText) {
        const headerCells = parseRow(headerRowText);
        docxRows.push(new TableRow({
            tableHeader: true,
            children: headerCells.map(text => new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({ text, bold: true })],
                    alignment: AlignmentType.CENTER
                })],
                shading: {
                    fill: "F3F4F6",
                    type: ShadingType.CLEAR,
                    color: "auto",
                },
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 120, bottom: 120, left: 120, right: 120 },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                },
            }))
        }));
    }

    bodyRowsText.forEach(rowStr => {
        if (!rowStr.trim() || /^\|?[\s\-:|]+\|?$/.test(rowStr.trim())) return;

        const cells = parseRow(rowStr);
        docxRows.push(new TableRow({
            children: cells.map(text => new TableCell({
                children: [new Paragraph({ text })],
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                },
            }))
        }));
    });

    return new Table({
      rows: docxRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
      }
    });
  } catch (e) {
    console.error("Failed to parse markdown table", e);
    return null;
  }
};

// --- HELPER: Content Formatter ---
const formatChapterContent = (chapter: Chapter): (Paragraph | Table)[] => {
    const rawContent = chapter.content || "";
    // Split by single newline to check every line for formatting
    const contentLines = rawContent.split('\n');

    const docElements: (Paragraph | Table)[] = [];
    let currentTableBuffer: string[] = [];

    // Process lines
    for (let i = 0; i < contentLines.length; i++) {
        let line = contentLines[i].trim();
        
        if (line.length === 0) {
            // If we have a table buffer, process it
            if (currentTableBuffer.length > 0) {
                 const table = createTableFromMarkdown(currentTableBuffer.join('\n'));
                 if (table) docElements.push(table);
                 currentTableBuffer = [];
            }
            continue; 
        }

        // Table Detection
        if (line.startsWith('|')) {
            currentTableBuffer.push(line);
            continue;
        } else if (currentTableBuffer.length > 0) {
             // End of table block
             const table = createTableFromMarkdown(currentTableBuffer.join('\n'));
             if (table) docElements.push(table);
             currentTableBuffer = [];
        }

        // --- HEADING LOGIC ---
        
        // Level 2: Sub-Chapter (e.g., "A. LATAR BELAKANG")
        // Logic: Starts with Single Letter + Dot + Space
        if (/^[A-Z]\.\s/.test(line)) {
            docElements.push(new Paragraph({
                text: line,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 240, after: 120 },
                alignment: AlignmentType.LEFT
            }));
            continue;
        }

        // Level 3: Sub-Sub-Chapter (e.g., "1. Identifikasi Masalah")
        // Logic: Starts with Number + Dot + Space, and length is reasonably short (likely a title)
        if (/^\d+\.\s/.test(line) && line.length < 100) {
             docElements.push(new Paragraph({
                text: line,
                heading: HeadingLevel.HEADING_3, // Or just bold text
                spacing: { before: 120, after: 60 },
                indent: { left: 720, hanging: 360 } // Indent for hierarchy
            }));
            continue;
        }

        // Level 3 (Alternative): Numbered List in text (Longer text)
        // Logic: Starts with Number + Dot + Space, but long -> likely content list
        if (/^\d+\.\s/.test(line) && line.length >= 100) {
            const [num, ...rest] = line.split('.');
            const textContent = rest.join('.').trim();
            
            docElements.push(new Paragraph({
               children: [
                   new TextRun({ text: num + ". ", bold: true }),
                   new TextRun({ text: textContent })
               ],
               alignment: AlignmentType.JUSTIFIED,
               spacing: { line: 360, after: 120 },
               indent: { left: 720, hanging: 360 }
            }));
            continue;
        }
        
        // Reference Header Detection (Added for styling reference section in chapter)
        if (line.startsWith("DAFTAR REFERENSI BAB")) {
             docElements.push(new Paragraph({
                text: line,
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.LEFT,
                spacing: { before: 400, after: 200 },
             }));
             continue;
        }

        // Standard Paragraph
        docElements.push(new Paragraph({
            text: line,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 120 }, // 1.5 line spacing
        }));
    }

    // Flush remaining table buffer
    if (currentTableBuffer.length > 0) {
        const table = createTableFromMarkdown(currentTableBuffer.join('\n'));
        if (table) docElements.push(table);
    }

    return [
        new Paragraph({
            text: `BAB ${chapter.chapter_number}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            text: chapter.title.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
        }),
        ...docElements,
        new Paragraph({
            text: "",
            pageBreakBefore: true,
        }),
    ];
};

// --- HELPER: Title Page ---
const createTitlePage = (thesisData: ThesisData): Paragraph[] => {
    return [
        new Paragraph({
            text: "HALAMAN JUDUL",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: thesisData.title.toUpperCase(),
                    bold: true,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
        }),
        new Paragraph({
            text: "Disusun Sebagai Syarat Kelulusan Oleh:",
            alignment: AlignmentType.CENTER,
            spacing: { before: 500, after: 100 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: `${thesisData.studentName} (${thesisData.studentId})`,
                    bold: true,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 500 },
        }),
        new Paragraph({
            text: thesisData.program.toUpperCase(),
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            text: thesisData.faculty.toUpperCase(),
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: thesisData.university.toUpperCase(),
                    bold: true,
                }),
            ],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            text: new Date().getFullYear().toString(),
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            pageBreakBefore: false, // Ensure title page content stays together
        }),
        new Paragraph({
            text: "",
            pageBreakBefore: true,
        }),
    ];
};

// --- EXPORT: Generate RIS File (Research Information Systems) ---
export const generateRISBlob = (references: Reference[]): Blob => {
    const risLines: string[] = [];

    references.forEach(ref => {
        // Basic RIS format
        // TY - Type (GEN = Generic, JOUR = Journal, BOOK = Book)
        // TI - Title
        // UR - URL
        // ER - End of Record
        
        // Simple heuristic: if it has common book publisher names, treat as book, else generic
        const type = /press|publishing|pustaka|buk/i.test(ref.title) ? 'BOOK' : 'GEN';
        
        risLines.push(`TY  - ${type}`);
        risLines.push(`TI  - ${ref.title}`);
        
        // Try to extract year if possible
        const yearMatch = ref.title.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
            risLines.push(`PY  - ${yearMatch[0]}`);
        }
        
        if (ref.uri) {
            risLines.push(`UR  - ${ref.uri}`);
        }
        
        risLines.push('ER  - ');
        risLines.push(''); // Empty line between records
    });

    return new Blob([risLines.join('\n')], { type: 'application/x-research-info-systems' });
};

// --- EXPORT: Generate Single Chapter DOCX ---
export const generateSingleChapterDocx = async (thesisData: ThesisData, chapter: Chapter): Promise<Blob> => {
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: { margin: { top: "3cm", bottom: "3cm", left: "4cm", right: "4cm" } },
                },
                children: [
                    ...createTitlePage(thesisData), // Optional: Keep title page for context
                    ...formatChapterContent(chapter)
                ],
            },
        ],
    });
    return await Packer.toBlob(doc);
};

// --- EXPORT: Generate Full Thesis DOCX ---
export const generateDocxBlob = async (thesisData: ThesisData, chapters: Chapter[], references: Reference[]): Promise<Blob> => {
  const sortedReferences = [...references].sort((a, b) => a.title.localeCompare(b.title));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: "3cm", bottom: "3cm", left: "4cm", right: "4cm" } },
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ children: ["Page ", "PAGE", " of ", "NUMPAGES"] })],
                    }),
                ],
            }),
        },
        children: [
          // 1. Title Page
          ...createTitlePage(thesisData),

          // 2. TOC Placeholder
          new Paragraph({
             text: "DAFTAR ISI",
             heading: HeadingLevel.HEADING_1,
             alignment: AlignmentType.CENTER,
             spacing: { after: 300 },
          }),
          new Paragraph({
             children: [
                new TextRun({
                    text: "(Table of Contents will be auto-generated in Word. Right-click here and select 'Update Field')",
                    italics: true,
                })
             ],
             alignment: AlignmentType.CENTER,
          }),
          ...chapters.map(c => new Paragraph({
             text: `BAB ${c.chapter_number} ${c.title.toUpperCase()}`,
             tabStops: [{ type: "right", position: 9000, leader: "dot" }],
             children: [new TextRun({ text: "\t" })] 
          })),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // 3. Chapters Content
          ...chapters.flatMap(formatChapterContent),

          // 4. Bibliography
          new Paragraph({
            text: "DAFTAR PUSTAKA",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          ...sortedReferences.map(ref => {
            let citationText = ref.title;
            const isUrl = ref.uri.startsWith('http');
            if (isUrl && !citationText.includes(ref.uri) && citationText.length < 100) {
                 citationText += `. Tersedia di: ${ref.uri}`;
            }
            return new Paragraph({
                text: citationText,
                alignment: AlignmentType.LEFT,
                spacing: { after: 120 },
                indent: { hanging: 720 },
            });
          }),
          
          // Note: Appendices (Lampiran) are now expected to be generated as Chapter 6 in the chapters array,
          // so no hardcoded section is needed here.
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};
