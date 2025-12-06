
import React, { useCallback, useRef } from 'react';
import { ThesisData, FileData, AppStatus, ThesisConfig } from '../types';
import { Upload, Camera, FileText, Trash2, Settings, RotateCcw } from 'lucide-react';
import { CHAPTER_PAGE_ESTIMATES, APPENDICES_PAGE_ESTIMATE } from '../constants';

interface SidebarProps {
  thesisData: ThesisData;
  setThesisData: (data: ThesisData) => void;
  config: ThesisConfig;
  setConfig: (config: ThesisConfig) => void;
  files: FileData[];
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  status: AppStatus;
  onGenerate: () => void;
  onReset: () => void;
}

// Helper to encode text to base64 properly handling unicode
const textToBase64 = (text: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  let binary = '';
  const len = data.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return window.btoa(binary);
};

export const Sidebar: React.FC<SidebarProps> = ({
  thesisData,
  setThesisData,
  config,
  setConfig,
  files,
  setFiles,
  status,
  onGenerate,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThesisData({ ...thesisData, [name]: value });
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: parseInt(value) || 0 });
  };

  const processFile = useCallback((file: File) => {
    // SPECIAL HANDLING FOR DOCX
    // Gemini doesn't support application/vnd.openxmlformats-officedocument.wordprocessingml.document natively
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            try {
                // @ts-ignore - mammoth is loaded via script tag in index.html
                if (window.mammoth) {
                    // @ts-ignore
                    const result = await window.mammoth.extractRawText({ arrayBuffer });
                    const text = result.value;
                    const base64Data = textToBase64(text);
                    
                    const newFile: FileData = {
                        name: file.name,
                        type: 'text/plain', // Convert mime type to text/plain for Gemini
                        data: base64Data
                    };
                    setFiles((prev) => [...prev, newFile]);
                } else {
                    console.error("Mammoth library not loaded");
                    alert("DOCX parser not ready. Please refresh or use PDF/Text.");
                }
            } catch (err) {
                console.error("Failed to parse DOCX", err);
                alert("Failed to parse DOCX file. Please try converting to PDF or Text.");
            }
        };
        reader.readAsArrayBuffer(file);
        return;
    }

    // STANDARD HANDLING (PDF, Image, Text)
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Raw = e.target?.result as string;
      // Remove data URL prefix for Gemini API
      const base64Data = base64Raw.split(',')[1]; 
      
      const newFile: FileData = {
        name: file.name,
        type: file.type,
        data: base64Data
      };
      
      setFiles((prev) => [...prev, newFile]);
    };
    reader.readAsDataURL(file);
  }, [setFiles]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(processFile);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const isGenerating = status !== AppStatus.IDLE && status !== AppStatus.COMPLETED && status !== AppStatus.ERROR;

  // Calculate estimated totals
  const totalMinPages = Object.values(CHAPTER_PAGE_ESTIMATES).reduce((acc, curr) => acc + curr.min, 0) + APPENDICES_PAGE_ESTIMATE.min;
  const totalMaxPages = Object.values(CHAPTER_PAGE_ESTIMATES).reduce((acc, curr) => acc + curr.max, 0) + APPENDICES_PAGE_ESTIMATE.max;

  return (
    <div className="w-full md:w-96 bg-white border-r border-slate-200 h-screen overflow-y-auto flex-shrink-0 sticky top-0 shadow-lg z-20">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
                <FileText size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 font-serif">ThesisGen Pro</h1>
        </div>

        {/* THESIS DETAILS */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Thesis Information</h2>
          <div className="grid gap-3">
             <div>
                <label className="block text-xs text-slate-500 mb-1">Thesis Title</label>
                <input
                    type="text"
                    name="title"
                    value={thesisData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded text-sm"
                    disabled={isGenerating}
                />
             </div>
             <div>
                <label className="block text-xs text-slate-500 mb-1">Student Name</label>
                <input
                    type="text"
                    name="studentName"
                    value={thesisData.studentName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded text-sm"
                    disabled={isGenerating}
                />
             </div>
             <div className="grid grid-cols-2 gap-2">
                 <div>
                    <label className="block text-xs text-slate-500 mb-1">ID (NIM)</label>
                    <input
                        type="text"
                        name="studentId"
                        value={thesisData.studentId}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                        disabled={isGenerating}
                    />
                 </div>
                 <div>
                    <label className="block text-xs text-slate-500 mb-1">Program</label>
                    <input
                        type="text"
                        name="program"
                        value={thesisData.program}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-slate-300 rounded text-sm"
                        disabled={isGenerating}
                    />
                 </div>
             </div>
             <div>
                <label className="block text-xs text-slate-500 mb-1">Faculty</label>
                <input
                    type="text"
                    name="faculty"
                    value={thesisData.faculty}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded text-sm"
                    disabled={isGenerating}
                />
             </div>
             <div>
                <label className="block text-xs text-slate-500 mb-1">University</label>
                <input
                    type="text"
                    name="university"
                    value={thesisData.university}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded text-sm"
                    disabled={isGenerating}
                />
             </div>
          </div>
        </div>

        {/* CONFIGURATION */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                 <Settings size={16} className="text-slate-600" />
                 <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Configuration</h2>
            </div>
            
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-3">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-1">Ref Start Year</label>
                        <input
                            type="number"
                            name="minYear"
                            value={config.minYear}
                            onChange={handleConfigChange}
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                            disabled={isGenerating}
                        />
                    </div>
                    <div className="flex-1">
                         <label className="block text-xs text-slate-500 mb-1">Ref End Year</label>
                        <input
                            type="number"
                            name="maxYear"
                            value={config.maxYear}
                            onChange={handleConfigChange}
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                            disabled={isGenerating}
                        />
                    </div>
                </div>
                 <div>
                     <label className="block text-xs text-slate-500 mb-1">Max References</label>
                    <input
                        type="number"
                        name="maxReferences"
                        value={config.maxReferences}
                        onChange={handleConfigChange}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs"
                        disabled={isGenerating}
                    />
                </div>
            </div>

            {/* Page Estimation Table */}
            <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <h3 className="text-xs font-bold text-blue-800 mb-2">Target Page Counts</h3>
                <div className="space-y-1">
                    {Object.entries(CHAPTER_PAGE_ESTIMATES).map(([num, data]) => (
                        <div key={num} className="flex justify-between text-xs">
                             <span className="text-blue-700">Bab {num} ({data.desc})</span>
                             <span className="font-mono text-blue-900 font-semibold">{data.min}-{data.max} pg</span>
                        </div>
                    ))}
                    <div className="flex justify-between text-xs items-start pt-1">
                         <span className="text-blue-700 w-2/3">{APPENDICES_PAGE_ESTIMATE.desc}</span>
                         <span className="font-mono text-blue-900 font-semibold">{APPENDICES_PAGE_ESTIMATE.min}-{APPENDICES_PAGE_ESTIMATE.max} pg</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200 flex justify-between text-xs font-bold text-blue-900">
                        <span>Total Estimate</span>
                        <span>{totalMinPages} - {totalMaxPages} Pages</span>
                    </div>
                </div>
            </div>
        </div>

        {/* FILES */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Resources</h2>
          
          <div className="flex gap-2">
             <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded text-sm font-medium transition disabled:opacity-50"
             >
                <Upload size={16} /> Upload Files
             </button>
             <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={isGenerating}
                className="flex-none w-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition disabled:opacity-50"
             >
                <Camera size={16} />
             </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.txt,.md,image/*"
            multiple
            onChange={handleFileUpload}
          />
          <input
            type="file"
            ref={cameraInputRef}
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
          />

          {files.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                    <span className="truncate max-w-[180px] text-slate-600" title={file.name}>{file.name}</span>
                    <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={14} />
                    </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTION */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <button
            onClick={onGenerate}
            disabled={isGenerating || files.length === 0}
            className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition-all flex items-center justify-center gap-2
              ${isGenerating 
                ? 'bg-slate-400 cursor-not-allowed' 
                : (files.length === 0) 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg active:transform active:scale-95'
              }`}
          >
            {isGenerating ? 'Generating...' : 'Start Generation'}
          </button>
          
          <button
             onClick={onReset}
             disabled={isGenerating}
             className="w-full py-2 rounded-lg text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
             <RotateCcw size={14} /> Reset Application
          </button>

          {(files.length === 0) && <p className="text-xs text-red-500 mt-2 text-center">At least one file (Proposal) is required.</p>}
        </div>

      </div>
    </div>
  );
};
