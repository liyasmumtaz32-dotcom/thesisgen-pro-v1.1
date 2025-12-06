
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { ThesisData, FileData, AppStatus, Chapter, Reference, GenerationState, ThesisConfig } from './types';
import { INITIAL_THESIS_DATA, PRELOADED_PROPOSAL_TEXT, PRELOADED_REFERENCES, INITIAL_CONFIG } from './constants';
import { GeminiService } from './services/gemini';
import { generateDocxBlob, generateSingleChapterDocx, generateRISBlob } from './services/docGenerator';

export default function App() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [thesisData, setThesisData] = useState<ThesisData>(INITIAL_THESIS_DATA);
  const [config, setConfig] = useState<ThesisConfig>(INITIAL_CONFIG);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  
  const [generationState, setGenerationState] = useState<GenerationState>({
    status: AppStatus.IDLE,
    progress: 0,
    logs: [],
    currentStep: 0,
    totalSteps: 0
  });

  // PRELOAD DATA EFFECT
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
     // 1. Preload Text
    if (PRELOADED_PROPOSAL_TEXT) {
      const encoder = new TextEncoder();
      const data = encoder.encode(PRELOADED_PROPOSAL_TEXT);
      let binary = '';
      for (let i = 0; i < data.byteLength; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const base64Data = window.btoa(binary);

      setFiles(prev => {
        // Avoid duplicates
        if (prev.some(f => f.name === "Proposal_Full_Text.txt")) return prev;
        return [
          {
            name: "Proposal_Full_Text.txt",
            type: "text/plain",
            data: base64Data
          }
        ];
      });
    }

    // 2. Preload References
    if (PRELOADED_REFERENCES.length > 0) {
      setReferences(PRELOADED_REFERENCES);
    }
  }

  const handleReset = () => {
     if (window.confirm("Are you sure you want to reset all data? This will clear generated chapters.")) {
        setThesisData(INITIAL_THESIS_DATA);
        setChapters([]);
        setReferences([]);
        setConfig(INITIAL_CONFIG);
        setGenerationState({
            status: AppStatus.IDLE,
            progress: 0,
            logs: [],
            currentStep: 0,
            totalSteps: 0
        });
        loadInitialData();
     }
  };

  const addLog = useCallback((msg: string) => {
    setGenerationState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs]
    }));
  }, []);

  const handleGenerate = async () => {
    // API Key is now handled by the service via environment variable
    const service = new GeminiService();
    
    setGenerationState({
      status: AppStatus.ANALYZING,
      progress: 5,
      logs: ["Starting generation process..."],
      currentStep: 1,
      totalSteps: 10 // Approximation
    });

    try {
      // 1. OUTLINE
      addLog("Analyzing proposal documents...");
      const outline = await service.generateOutline(thesisData, files);
      
      if (!outline || outline.length === 0) {
        throw new Error("Failed to generate a valid outline. Please check your documents and try again.");
      }

      setChapters(outline);
      setGenerationState(prev => ({ ...prev, status: AppStatus.GROUNDING, progress: 15 }));

      // 2. GROUNDING (Filter and Augment)
      addLog(`Filtering references (Year ${config.minYear}-${config.maxYear})...`);
      
      let filteredRefs = references.filter(ref => {
         // Attempt to extract year from title like "(2020)" or "2020"
         const yearMatch = ref.title.match(/\b(19|20)\d{2}\b/);
         if (yearMatch) {
             const year = parseInt(yearMatch[0]);
             return year >= config.minYear && year <= config.maxYear;
         }
         return true; 
      });

      // Re-apply stricter filter if years are explicitly found
      filteredRefs = references.filter(ref => {
         const yearMatch = ref.title.match(/\b(19|20)\d{2}\b/);
         if (yearMatch) {
             const year = parseInt(yearMatch[0]);
             return year >= config.minYear && year <= config.maxYear;
         }
         return true; // Keep items without explicit year in title string to be safe
      });
      
      // Limit count
      if (config.maxReferences > 0 && filteredRefs.length > config.maxReferences) {
          filteredRefs = filteredRefs.slice(0, config.maxReferences);
      }

      // Only search if we don't have enough references after filtering
      if (filteredRefs.length < 5) {
        addLog("Searching for additional recent references...");
        const foundRefs = await service.findReferences(thesisData, outline[0]?.title || thesisData.title);
        // Add new found refs (assuming AI returns recent ones)
        filteredRefs = [...filteredRefs, ...foundRefs];
      }
      
      // Final dedupe
      filteredRefs = Array.from(new Set(filteredRefs.map(r => r.title)))
        .map(title => filteredRefs.find(r => r.title === title)!);

      // Final slice just in case
      if (config.maxReferences > 0 && filteredRefs.length > config.maxReferences) {
        filteredRefs = filteredRefs.slice(0, config.maxReferences);
      }

      setReferences(filteredRefs);
      
      setGenerationState(prev => ({ ...prev, status: AppStatus.GENERATING, progress: 20 }));

      // 3. GENERATE CHAPTERS
      const newChapters = [...outline];
      const totalChapters = newChapters.length;
      
      for (let i = 0; i < totalChapters; i++) {
        const chapter = newChapters[i];
        
        // Update UI to show generating
        newChapters[i] = { 
            ...chapter, 
            isGenerating: true,
            completedSections: 0,
            totalSections: chapter.sub_chapters.length || 5
        };
        setChapters([...newChapters]);
        
        const content = await service.generateChapterContent(
          chapter, 
          thesisData, 
          filteredRefs, 
          files, 
          (completed, total) => {
              // Real-time update of section progress
              setChapters(prev => prev.map(c => 
                  c.chapter_number === chapter.chapter_number 
                  ? { ...c, completedSections: completed, totalSections: total }
                  : c
              ));
          }
        );
        
        // Update with content and mark complete
        newChapters[i] = { 
            ...chapter, 
            content, 
            isGenerating: false,
            completedSections: chapter.sub_chapters.length, // Ensure full completion visual
            totalSections: chapter.sub_chapters.length
        };
        setChapters([...newChapters]);

        // Update global progress
        const progressIncrement = 80 / totalChapters; // 80% of progress allocated to chapters
        setGenerationState(prev => ({
             ...prev, 
             progress: 20 + ((i + 1) * progressIncrement)
        }));
      }

      setGenerationState(prev => ({
        ...prev,
        status: AppStatus.COMPLETED,
        progress: 100
      }));

    } catch (error) {
      console.error(error);
      addLog("Error occurred: " + (error instanceof Error ? error.message : String(error)));
      setGenerationState(prev => ({ ...prev, status: AppStatus.ERROR }));
    }
  };

  const handleDownloadFull = async () => {
    try {
      const blob = await generateDocxBlob(thesisData, chapters, references);
      downloadBlob(blob, `Thesis_Full_${thesisData.studentName}.docx`);
    } catch (e) {
      console.error("Full Download failed", e);
      addLog("Failed to generate full DOCX file.");
    }
  };

  const handleDownloadChapter = async (chapter: Chapter) => {
    try {
      const blob = await generateSingleChapterDocx(thesisData, chapter);
      downloadBlob(blob, `Bab_${chapter.chapter_number}_${thesisData.studentName}.docx`);
    } catch (e) {
      console.error("Chapter Download failed", e);
      addLog(`Failed to generate DOCX for Chapter ${chapter.chapter_number}.`);
    }
  };

  const handleDownloadRIS = async () => {
    try {
        const blob = generateRISBlob(references);
        downloadBlob(blob, `References_${thesisData.studentName}.ris`);
    } catch (e) {
        console.error("RIS Download failed", e);
        addLog("Failed to generate RIS file.");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.replace(/\s+/g, '_');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar
        thesisData={thesisData}
        setThesisData={setThesisData}
        config={config}
        setConfig={setConfig}
        files={files}
        setFiles={setFiles}
        status={generationState.status}
        onGenerate={handleGenerate}
        onReset={handleReset}
      />
      
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50 relative">
         <ContentArea
            status={generationState.status}
            state={generationState}
            chapters={chapters}
            references={references}
            onDownload={handleDownloadFull}
            onDownloadChapter={handleDownloadChapter}
            onDownloadRIS={handleDownloadRIS}
         />
      </main>
    </div>
  );
}
