
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
    // Use the environment variable API Key
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Helper to repair truncated JSON arrays
  private tryParseJSON(text: string): any {
    // Remove Markdown code fences if present (e.g. ```json ... ```)
    let cleanText = text.replace(/```json\n?|```/g, '').trim();

    try {
      return JSON.parse(cleanText);
    } catch (e) {
      console.warn("JSON Parse failed, attempting repair...", e);
      
      // Check if it looks like an array start
      if (cleanText.startsWith('[')) {
        // Attempt to find the last valid closing object brace
        const lastBrace = cleanText.lastIndexOf('}');
        if (lastBrace !== -1) {
          // Close the array manually
          const repaired = cleanText.substring(0, lastBrace + 1) + ']';
          try {
            const result = JSON.parse(repaired);
            console.log("JSON repaired successfully.");
            return result;
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

  // Wrapper to handle 429 Rate Limit errors
  private async generateWithRetry(
    operation: () => Promise<any>,
    retries = 3,
    defaultDelay = 20000
  ): Promise<any> {
    try {
      return await operation();
    } catch (error: any) {
      // Check for 429 Resource Exhausted / Quota Exceeded
      if (retries > 0 && (error.status === 429 || error.code === 429 || error.message?.includes('429') || error.message?.includes('quota'))) {
        
        let waitTime = defaultDelay;
        
        // Try to extract exact wait time from error message like "retry in 57.90s"
        const match = error.message?.match(/retry in (\d+\.?\d*)s/);
        if (match && match[1]) {
           // Add 5 seconds buffer to be safe
           waitTime = Math.ceil(parseFloat(match[1]) * 1000) + 5000;
        }

        console.warn(`Rate limit hit. Waiting ${waitTime/1000}s before retry. Retries left: ${retries}`);
        await this.sleep(waitTime);
        
        // Retry with one less retry attempt
        return this.generateWithRetry(operation, retries - 1, defaultDelay * 1.5);
      }
      
      // Throw if not a 429 or no retries left
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
      Based on the Thesis Title: "${thesisData.title}" and the provided proposal documents, create a highly detailed Thesis Outline (Table of Contents).
      
      Structure Requirements:
      1. Create exactly 6 Chapters.
      2. Chapters 1-5: Pendahuluan, Tinjauan Pustaka, Metode, Hasil, Kesimpulan.
      3. **CHAPTER 6**: MUST be titled "LAMPIRAN" (Appendices).
         - It must include sub-chapters for: "Instrumen Penelitian (Kisi-kisi)", "Data Mentah (Rekapitulasi Skor)", "Dokumentasi Kegiatan", "Surat Izin Penelitian".
      
      Content Guidelines:
      - **CRITICAL**: Each Chapter (1-5) MUST have at least **5 to 7 sub-chapters**.
      - Each sub-chapter must include 3-4 specific talking points.
      - Chapter 3 MUST include specific section for "Instrumen Penelitian".
      - Chapter 4 MUST include specific sections for "Deskripsi Data" and "Pembahasan".

      IMPORTANT:
      - Keep titles CONCISE (max 15 words).
      - Do NOT include descriptions, ONLY titles.
      - Return ONLY the JSON array.
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
    const query = `Latest academic journals, books, and papers about "${thesisData.title}" specifically focusing on "${chapterTitle}" methodology and theory.`;
    
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
      
      // Deduplicate
      return Array.from(new Set(references.map(r => r.uri)))
        .map(uri => references.find(r => r.uri === uri)!);

    } catch (error) {
      console.warn("Reference search failed, proceeding without new references:", error);
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

    // Safely retrieve sub-chapters, defaulting to a basic structure if missing
    let subChapters = chapter.sub_chapters;
    if (!Array.isArray(subChapters) || subChapters.length === 0) {
      subChapters = [{
        sub_title: "Overview",
        sub_sub_chapters: ["Introduction", "Discussion", "Summary"]
      }];
    }

    const pageEstimate = CHAPTER_PAGE_ESTIMATES[chapter.chapter_number] || { min: 15, max: 20, desc: "General" };
    const avgPages = (pageEstimate.min + pageEstimate.max) / 2;
    const totalChapterWords = avgPages * WORDS_PER_PAGE;
    const wordsPerSection = Math.round(totalChapterWords / subChapters.length);
    
    if (onProgress) onProgress(0, subChapters.length);

    // Iterate through each sub-chapter
    for (const [index, subChapter] of subChapters.entries()) {
      // Convert index 0 -> A, 1 -> B, etc.
      const sectionLabel = String.fromCharCode(65 + index); // 65 is ASCII for 'A'
      
      // Format sub-sub-chapters as a numbered list for context
      const pointsList = subChapter.sub_sub_chapters?.map((pt, i) => `${i + 1}. ${pt}`).join("\n") || "General discussion";

      // --- CUSTOM INSTRUCTIONS FOR SPECIFIC CHAPTERS ---
      let specializedInstructions = "";

      if (chapter.chapter_number === 4) {
        specializedInstructions = `
        **CHAPTER 4 MANDATORY REQUIREMENTS (Quantitative Results):**
        1. **MARKDOWN TABLES**: You MUST generate Markdown tables to present the data.
           - Create a "Table of Descriptive Statistics" (Mean, Median, SD for Pretest & Posttest).
           - Create a "Table of Normality Test Results" (Shapiro-Wilk/Lilliefors with Sig. values).
           - Create a "Table of Hypothesis Test Results" (t-test / ANOVA with t-count vs t-table).
        2. **DIAGRAMS**: Since you cannot generate images, write a placeholder for diagrams.
           - Example: "[GAMBAR 4.1: Diagram Batang Perbandingan Skor Pretest dan Posttest]" followed by a text description of what the diagram shows.
        3. **FORMULAS**: You MUST include the mathematical formulas used for analysis in standard text or Unicode.
           - Example: Include the formula for the t-test (t = ...), Regression (Y = a + bX), etc.
        `;
      }

      if (chapter.chapter_number === 6 || chapter.title.toUpperCase().includes("LAMPIRAN")) {
        specializedInstructions = `
        **CHAPTER 6 (APPENDICES) MANDATORY REQUIREMENTS:**
        1. **INSTRUMENTS**: Create a detailed "Kisi-Kisi Instrumen Penelitian" as a Markdown Table with columns: No | Variabel | Indikator | No Item.
        2. **RAW DATA**: Create a "Rekapitulasi Data Skor Siswa" as a Markdown Table with dummy data for approx 15 students (Columns: No | Nama (Inisial) | Pretest | Posttest).
        3. **FORMAT**: Ensure these look like professional appendices.
        `;
      }

      const prompt = `
        You are writing Sub-Chapter ${sectionLabel} ("${subChapter.sub_title}") for Chapter ${chapter.chapter_number} (${chapter.title}) of the Thesis: "${thesisData.title}".

        **HIERARCHY & STRUCTURE INSTRUCTIONS**:
        1. This is Sub-Chapter **${sectionLabel}**.
        2. Inside this Sub-Chapter, you MUST cover the following Sub-Sub-Chapters (Points):
           ${pointsList}
        3. **FORMAT**: 
           - Start the text directly. Do NOT write the Sub-Chapter Title again (I will add it automatically).
           - Use **Numbered Sub-Headings** (e.g., "1. [Point Name]", "2. [Point Name]") to structure the text.
           - **CITATION**: Use in-text citations (Author, Year).

        ${specializedInstructions}

        **CONTENT REQUIREMENTS**:
        - Target Length: ~${wordsPerSection} words.
        - Style: Formal Indonesian academic language (Bahasa baku).
        - Depth: Be analytical, critical, and verbose.
        - References: Use the provided references where appropriate.

        References:
        ${referencesList}

        Prohibited: Do NOT use Markdown formatting like **, ##, *, _. **EXCEPTION**: You MUST use Markdown for Tables (| Col | Col |).
      `;

      try {
        if (index > 0) await this.sleep(4000);

        const response = await this.generateWithRetry(() => 
          this.ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: { parts: [...fileParts, { text: prompt }] },
            config: { temperature: 0.6, maxOutputTokens: 8192 }
          })
        );

        let sectionText = response.text || "";
        // We allow some markdown now for tables, so we only strip non-table markdown if needed, 
        // but broadly cleaning * and # is usually safe for academic text, EXCEPT inside tables.
        // Let's only strip bold/italic markers but keep table structure (| and -).
        sectionText = sectionText.replace(/(\*\*|__)/g, ''); // Remove bold
        sectionText = sectionText.replace(/(^|\s)(#+)(\s|$)/g, '$1$3'); // Remove heading hashes but keep text

        // Manually Construct the Heading Hierarchy in the Output String
        // Format: "A. TITLE" followed by content
        fullChapterContent += `\n\n${sectionLabel}. ${subChapter.sub_title.toUpperCase()}\n${sectionText}`;
        
      } catch (error) {
        console.error(`Error generating section ${subChapter.sub_title}:`, error);
        fullChapterContent += `\n\n${sectionLabel}. ${subChapter.sub_title} [Error generating content]\n`;
      } finally {
        if (onProgress) onProgress(index + 1, subChapters.length);
      }
    }

    // --- APPEND REFERENCES FOR THIS CHAPTER ---
    if (references.length > 0) {
        fullChapterContent += `\n\nDAFTAR REFERENSI BAB ${chapter.chapter_number}\n`;
        references.forEach((ref, idx) => {
             fullChapterContent += `${idx + 1}. ${ref.title}. Tersedia di: ${ref.uri}\n`;
        });
    }

    if (!fullChapterContent) return "Failed to generate content for this chapter.";
    return fullChapterContent;
  }
}
