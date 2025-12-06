
import React from 'react';
import { AppStatus, Chapter, Reference, GenerationState } from '../types';
import { Download, CheckCircle, Loader2, BookOpen, Search, AlertCircle, FileText, Check, Circle, ArrowRight, FileJson } from 'lucide-react';

interface ContentAreaProps {
  status: AppStatus;
  state: GenerationState;
  chapters: Chapter[];
  references: Reference[];
  onDownload: () => void;
  onDownloadChapter: (chapter: Chapter) => void;
  onDownloadRIS: () => void;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  status,
  state,
  chapters,
  references,
  onDownload,
  onDownloadChapter,
  onDownloadRIS,
}) => {
  
  if (status === AppStatus.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500">
         <div className="bg-white p-6 rounded-full shadow-lg mb-6">
            <BookOpen size={48} className="text-primary-500" />
         </div>
         <h2 className="text-2xl font-bold text-slate-800 mb-2 font-serif">Welcome to ThesisGen Pro</h2>
         <p className="max-w-md mb-8">
            Upload your proposal draft (Chapter 1) and references to automatically generate a structured, cited, and formatted thesis draft.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl">
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <Search size={16} className="text-primary-500" /> Research
                </div>
                <p className="text-xs">AI analyzes your topic and finds credible references via Google Search.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <FileText size={16} className="text-primary-500" /> Draft
                </div>
                <p className="text-xs">Generates academic content for 5 standard chapters based on your context.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <Download size={16} className="text-primary-500" /> Export
                </div>
                <p className="text-xs">Download the result as a perfectly formatted Word (.docx) document.</p>
            </div>
         </div>
      </div>
    );
  }

  // --- PROCESSING STEPS VISUALIZATION ---
  const renderProcessingStep = () => {
     if (status === AppStatus.ANALYZING) {
         return (
             <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                 <div className="relative mb-4">
                     <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                     <div className="relative bg-white p-4 rounded-full shadow-sm border border-blue-100">
                        <FileText size={32} className="text-blue-500 animate-pulse" />
                     </div>
                 </div>
                 <h3 className="text-lg font-bold text-slate-800">Analyzing Proposal</h3>
                 <p className="text-sm">Reading document context and generating thesis outline...</p>
             </div>
         );
     }
     if (status === AppStatus.GROUNDING) {
         return (
             <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                 <div className="relative mb-4">
                     <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                     <div className="relative bg-white p-4 rounded-full shadow-sm border border-green-100">
                        <Search size={32} className="text-green-500 animate-pulse" />
                     </div>
                 </div>
                 <h3 className="text-lg font-bold text-slate-800">Grounding & Research</h3>
                 <p className="text-sm">Verifying references and searching for academic sources...</p>
             </div>
         );
     }
     return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      
      {/* GLOBAL STATUS HEADER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {status === AppStatus.COMPLETED ? <CheckCircle className="text-green-500" /> : <Loader2 className="animate-spin text-primary-500" />}
                {status === AppStatus.COMPLETED ? 'Thesis Generation Completed' : 'Generating Thesis...'}
            </h2>
            <span className="text-sm font-semibold text-primary-600">{Math.round(state.progress)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${state.progress}%` }}
            ></div>
        </div>
      </div>

      {/* Render Initial Steps (Analyzing/Grounding) */}
      {(status === AppStatus.ANALYZING || status === AppStatus.GROUNDING) && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            {renderProcessingStep()}
         </div>
      )}

      {/* REFERENCES SECTION */}
      {references.length > 0 && status !== AppStatus.ANALYZING && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary-500" /> 
                    {status === AppStatus.GROUNDING ? 'Finding References...' : `References Used (${references.length})`}
                </h3>
                {status !== AppStatus.GROUNDING && (
                    <button 
                        onClick={onDownloadRIS}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors border border-slate-200"
                        title="Download for Mendeley/Zotero"
                    >
                        <FileJson size={14} />
                        Download .RIS (Mendeley)
                    </button>
                )}
            </div>
            <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
                {references.map((ref, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2 list-none">
                        <span className="min-w-[20px] text-xs bg-slate-100 rounded-full h-5 w-5 flex items-center justify-center text-slate-500 flex-shrink-0">{idx + 1}</span>
                        <a href={ref.uri} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 hover:underline truncate">
                            {ref.title}
                        </a>
                    </li>
                ))}
            </div>
         </div>
      )}

      {/* CHAPTERS GENERATION LIST */}
      {(status === AppStatus.GENERATING || status === AppStatus.COMPLETED) && (
        <div className="space-y-4">
            <h3 className="text-md font-bold text-slate-800 px-1">Chapter Progression</h3>
            {chapters.map((chapter) => {
                const isCompleted = !!chapter.content;
                const isActive = chapter.isGenerating;
                const isPending = !isCompleted && !isActive;

                // For the active chapter, determine which section we are on
                const currentSectionIdx = chapter.completedSections || 0;
                
                return (
                    <div 
                        key={chapter.chapter_number} 
                        className={`
                            rounded-lg border transition-all duration-500 overflow-hidden
                            ${isActive ? 'bg-white border-primary-300 shadow-md ring-1 ring-primary-100' : ''}
                            ${isCompleted ? 'bg-white border-green-200 opacity-90' : ''}
                            ${isPending ? 'bg-slate-50 border-slate-200 opacity-60' : ''}
                        `}
                    >
                        {/* Chapter Header */}
                        <div className={`p-4 flex items-center justify-between ${isActive ? 'bg-primary-50/50' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                    ${isCompleted ? 'bg-green-100 text-green-600' : ''}
                                    ${isActive ? 'bg-primary-100 text-primary-600' : ''}
                                    ${isPending ? 'bg-slate-200 text-slate-500' : ''}
                                `}>
                                    {isCompleted ? <Check size={16} /> : chapter.chapter_number}
                                </div>
                                <div>
                                    <h4 className={`font-bold font-serif ${isPending ? 'text-slate-500' : 'text-slate-800'}`}>
                                        BAB {chapter.chapter_number}: {chapter.title}
                                    </h4>
                                    {isActive && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary-500 transition-all duration-300"
                                                    style={{ width: `${(currentSectionIdx / (chapter.totalSections || 1)) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-primary-600 font-medium">
                                                {currentSectionIdx} / {chapter.totalSections} sections
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {isActive && <Loader2 size={20} className="animate-spin text-primary-500" />}
                                {isCompleted && (
                                    <button 
                                        onClick={() => onDownloadChapter(chapter)}
                                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs rounded-md font-medium flex items-center gap-1.5 shadow-sm transition-all"
                                    >
                                        <Download size={14} />
                                        <span>Download Bab {chapter.chapter_number}</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Active Chapter Details: Sub-chapters List */}
                        {isActive && chapter.sub_chapters && (
                            <div className="border-t border-slate-100 bg-white p-4 animate-in slide-in-from-top-2 duration-300">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-3 tracking-wider">Generating Content Sections</p>
                                <div className="space-y-3">
                                    {chapter.sub_chapters.map((sub, idx) => {
                                        // Determine status of this specific section based on count
                                        const isSectionDone = idx < currentSectionIdx;
                                        const isSectionActive = idx === currentSectionIdx;
                                        
                                        return (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {isSectionDone ? (
                                                        <CheckCircle size={16} className="text-green-500" />
                                                    ) : isSectionActive ? (
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-primary-200 rounded-full animate-ping opacity-75"></div>
                                                            <div className="relative bg-white rounded-full">
                                                                <Circle size={16} className="text-primary-600 fill-primary-100" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Circle size={16} className="text-slate-300" />
                                                    )}
                                                </div>
                                                <span className={`text-sm ${isSectionActive ? 'text-primary-700 font-medium' : isSectionDone ? 'text-slate-600' : 'text-slate-400'}`}>
                                                    {sub.sub_title}
                                                </span>
                                                {isSectionActive && <span className="text-xs text-primary-400 animate-pulse ml-auto">Writing...</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        {/* Preview snippet for completed chapters */}
                        {isCompleted && chapter.content && (
                             <div className="bg-slate-50 p-4 border-t border-slate-100">
                                <p className="text-xs text-slate-500 line-clamp-2 italic">
                                    {chapter.content.replace(/\*\*/g, '').replace(/###/g, '').substring(0, 150)}...
                                </p>
                             </div>
                        )}
                    </div>
                );
            })}
        </div>
      )}

      {/* ERROR DISPLAY */}
      {status === AppStatus.ERROR && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle />
            <p>An error occurred during generation. Please check your API key and try again.</p>
        </div>
      )}

      {/* DOWNLOAD ALL BUTTON */}
      {status === AppStatus.COMPLETED && (
        <div className="sticky bottom-8 flex justify-center animate-bounce-in pb-8">
             <button
                onClick={onDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center gap-3 transform hover:scale-105 transition-all"
             >
                <Download size={20} />
                Download Full Thesis (All Chapters)
             </button>
        </div>
      )}
    </div>
  );
};
