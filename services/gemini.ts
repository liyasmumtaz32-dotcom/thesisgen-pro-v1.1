
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ThesisData, Chapter, Reference, FileData } from "../types";
import { CHAPTER_PAGE_ESTIMATES, WORDS_PER_PAGE } from "../constants";

// Schema for Thesis Outline
const outlineSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      chapter_number: { type: Type.INTEGER },
      title: { type: Type.STRING },
      sub_chapters: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sub_title: { type: Type.STRING },
            sub_sub_chapters: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    }
  }
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private tryParseJSON(text: string): any {
    let cleanText = text.replace(/```json\n?|```/g, '').trim();
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      console.warn("JSON Parse failed, attempting repair...", e);
      if (cleanText.startsWith('[')) {
        const lastBrace = cleanText.lastIndexOf('}');
        if (lastBrace !== -1) {
          const repaired = cleanText.substring(0, lastBrace + 1) + ']';
          try {
            return JSON.parse(repaired);
          } catch (e2) {
            console.error("JSON repair failed:", e2);
          }
        }
      }
      throw new Error("Failed to parse AI response. The response might be truncated or invalid.");
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async generateWithRetry(
    operation: () => Promise<any>,
    retries = 3,
    defaultDelay = 20000
  ): Promise<any> {
    try {
      return await operation();
    } catch (error: any) {
      if (retries > 0 && (error.status === 429 || error.code === 429 || error.message?.includes('429') || error.message?.includes('quota'))) {
        let waitTime = defaultDelay;
        const match = error.message?.match(/retry in (\d+\.?\d*)s/);
        if (match && match[1]) {
           waitTime = Math.ceil(parseFloat(match[1]) * 1000) + 5000;
        }
        console.warn(`Rate limit hit. Waiting ${waitTime/1000}s before retry. Retries left: ${retries}`);
        await this.sleep(waitTime);
        return this.generateWithRetry(operation, retries - 1, defaultDelay * 1.5);
      }
      throw error;
    }
  }

  async generateOutline(thesisData: ThesisData, files: FileData[]): Promise<Chapter[]> {
    const fileParts = files.map(f => ({
      inlineData: {
        mimeType: f.type,
        data: f.data
      }
    }));

    const prompt = `
      Based on the Thesis Title: "${thesisData.title}" and the provided documents, create a strict Thesis Outline following **Universitas Terbuka (UT) Guidebook PTAP5406**.
      
      Structure Requirements (Exactly 6 items in the array):
      1. **BAB 1**: PENDAHULUAN (Subchapters: Latar Belakang, Identifikasi Masalah, Pembatasan Masalah, Rumusan Masalah, Tujuan Penelitian, Manfaat Penelitian).
      2. **BAB 2**: KAJIAN PUSTAKA, KERANGKA BERPIKIR, DAN HIPOTESIS (Subchapters: Kajian Teori [Variabel X1, X2, Y], Penelitian Terdahulu, Kerangka Berpikir, Hipotesis).
      3. **BAB 3**: METODE PENELITIAN (Subchapters: Jenis dan Desain, Tempat/Waktu, Populasi/Sampel, Definisi Operasional, Instrumen Penelitian [Validitas/Reliabilitas], Teknik Pengumpulan Data, Teknik Analisis Data).
      4. **BAB 4**: HASIL DAN PEMBAHASAN (Subchapters: Deskripsi Data, Uji Prasyarat Analisis [Normalitas/Homogenitas], Pengujian Hipotesis, Pembahasan).
      5. **BAB 5**: KESIMPULAN DAN SARAN (Subchapters: Kesimpulan, Saran).
      6. **BAB 6**: LAMPIRAN (Subchapters: Kisi-kisi Instrumen, Instrumen Penelitian, Data Mentah [Tabulasi], Output Analisis Data, Dokumentasi).

      IMPORTANT:
      - Return ONLY the JSON array matching the schema.
    `;

    try {
      const response = await this.generateWithRetry(() => 
        this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
            parts: [...fileParts, { text: prompt }]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: outlineSchema,
            temperature: 0.3,
            maxOutputTokens: 8192,
          }
        })
      );

      const text = response.text || "[]";
      return this.tryParseJSON(text) as Chapter[];
    } catch (error) {
      console.error("Outline generation error:", error);
      throw error;
    }
  }

  async findReferences(thesisData: ThesisData, chapterTitle: string): Promise<Reference[]> {
    const query = `Latest academic journals, books, and papers about "${thesisData.title}" specifically focusing on "${chapterTitle}". Universitas Terbuka format.`;
    
    try {
      const response = await this.generateWithRetry(() =>
        this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: query,
          config: {
            tools: [{ googleSearch: {} }]
          }
        })
      );

      const references: Reference[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) {
            references.push({
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        });
      }
      return Array.from(new Set(references.map(r => r.uri)))
        .map(uri => references.find(r => r.uri === uri)!);
    } catch (error) {
      console.warn("Reference search failed:", error);
      return [];
    }
  }

  async generateChapterContent(
    chapter: Chapter,
    thesisData: ThesisData,
    references: Reference[],
    files: FileData[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<string> {
    const fileParts = files.map(f => ({
      inlineData: {
        mimeType: f.type,
        data: f.data
      }
    }));

    const referencesList = references.map(r => `- ${r.title} (${r.uri})`).join('\n');
    let fullChapterContent = "";

    let subChapters = chapter.sub_chapters;
    if (!Array.isArray(subChapters) || subChapters.length === 0) {
      subChapters = [{ sub_title: "General", sub_sub_chapters: [] }];
    }
    
    if (onProgress) onProgress(0, subChapters.length);

    for (const [index, subChapter] of subChapters.entries()) {
      const sectionLabel = String.fromCharCode(65 + index); // A, B, C...

      let specializedInstructions = "";

      // --- INSTRUCTIONS FOR CHAPTER 3 (METHOD) ---
      if (chapter.chapter_number === 3) {
         specializedInstructions = `
         **CHAPTER 3 REQUIREMENTS (Metode Penelitian):**
         - Include a Markdown Table for "Definisi Operasional Variabel" (Columns: Variabel, Konsep, Indikator, Skala).
         - Include formulas for Sampling (e.g. Slovin) if applicable.
         - Mention Validity and Reliability testing formulas (e.g., Pearson Product Moment, Cronbach Alpha) using standard text/unicode formulas.
         `;
      }

      // --- INSTRUCTIONS FOR CHAPTER 4 (RESULTS) ---
      if (chapter.chapter_number === 4) {
        specializedInstructions = `
        **CHAPTER 4 MANDATORY REQUIREMENTS (Hasil dan Pembahasan):**
        1. **STATISTICAL TABLES**: You MUST generate Markdown tables for:
           - "Tabel Statistik Deskriptif" (Mean, Median, Mode, SD, Min, Max).
           - "Tabel Uji Normalitas" (Kolmogorov-Smirnov/Shapiro-Wilk result).
           - "Tabel Uji Homogenitas".
           - "Tabel Uji Hipotesis" (t-test or ANOVA results).
        2. **FORMULAS**: Include the mathematical formulas used.
           - Example: "Rumus Regresi Linier Sederhana: Y = a + bX"
           - Example: "Rumus Uji-t: t = (M1 - M2) / ..."
        3. **DIAGRAM PLACEHOLDERS**: Insert text like "[GAMBAR 4.1: Histogram Sebaran Data Pretest]" and describe it.
        `;
      }

      // --- INSTRUCTIONS FOR CHAPTER 6 (APPENDICES) ---
      if (chapter.chapter_number === 6 || chapter.title.toUpperCase().includes("LAMPIRAN")) {
        specializedInstructions = `
        **CHAPTER 6 (LAMPIRAN) MANDATORY CONTENT:**
        1. **Lampiran 1: Kisi-Kisi Instrumen**. Create a Markdown Table (Variabel | Indikator | No Item | Jumlah).
        2. **Lampiran 2: Instrumen Penelitian**. Create sample Questionnaire items or Observation Checklists.
        3. **Lampiran 3: Tabulasi Data Mentah**. Create a Markdown Table (No | Nama/Kode | Skor Pretest | Skor Posttest) for at least 15 students (Dummy Data).
        4. **Lampiran 4: Hasil Output SPSS**. Create tables mimicking SPSS output for Validity, Reliability, and Regression.
        5. **Format**: Use clear headings "Lampiran 1", "Lampiran 2", etc.
        `;
      }

      const prompt = `
        You are writing Sub-Chapter ${sectionLabel} ("${subChapter.sub_title}") for Chapter ${chapter.chapter_number} (${chapter.title}) of the Thesis: "${thesisData.title}".
        This MUST follow the **Universitas Terbuka (UT)** academic style.

        **STRUCTURE**:
        1. Sub-Chapter: **${sectionLabel}. ${subChapter.sub_title}**.
        2. Content: Cover the specific points: ${subChapter.sub_sub_chapters?.join(", ")}.
        3. **Formatting**:
           - Use **Numbered Sub-Headings** (1., 2., 3.) for details.
           - **Tables**: Use Markdown tables (| Col | Col |) for ALL data presentation.
        
        ${specializedInstructions}

        **STYLE**:
        - Formal Indonesian (Bahasa Baku).
        - No Markdown bold/italic in body text (plain text preferred for DOCX conversion), EXCEPT for Tables.
        - Paragraphs should be indented (simulated by structure).

        References to use:
        ${referencesList}
      `;

      try {
        if (index > 0) await this.sleep(4000); // Rate limit spacing

        const response = await this.generateWithRetry(() => 
          this.ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: { parts: [...fileParts, { text: prompt }] },
            config: { temperature: 0.5, maxOutputTokens: 8192 }
          })
        );

        let sectionText = response.text || "";
        // Clean up bolding that might break docx flow, but keep tables
        sectionText = sectionText.replace(/(\*\*|__)(.*?)\1/g, '$2'); 

        fullChapterContent += `\n\n${sectionLabel}. ${subChapter.sub_title.toUpperCase()}\n${sectionText}`;
        
      } catch (error) {
        console.error(`Error generating section ${subChapter.sub_title}:`, error);
        fullChapterContent += `\n\n${sectionLabel}. ${subChapter.sub_title} [Error generating content]\n`;
      } finally {
        if (onProgress) onProgress(index + 1, subChapters.length);
      }
    }

    // Add references at end of chapter if not Appendices
    if (references.length > 0 && chapter.chapter_number < 6) {
        fullChapterContent += `\n\nDAFTAR REFERENSI BAB ${chapter.chapter_number}\n`;
        references.forEach((ref, idx) => {
             fullChapterContent += `${idx + 1}. ${ref.title}\n`;
        });
    }

    return fullChapterContent;
  }
}
