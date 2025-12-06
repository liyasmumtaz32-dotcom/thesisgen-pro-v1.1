
export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GROUNDING = 'GROUNDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ThesisData {
  title: string;
  studentName: string;
  studentId: string;
  university: string;
  faculty: string;
  program: string;
}

export interface ThesisConfig {
  minYear: number;
  maxYear: number;
  maxReferences: number;
}

export interface Chapter {
  chapter_number: number;
  title: string;
  sub_chapters: SubChapter[];
  content?: string;
  isGenerating?: boolean;
  completedSections?: number;
  totalSections?: number;
}

export interface SubChapter {
  sub_title: string;
  sub_sub_chapters: string[];
}

export interface Reference {
  title: string;
  uri: string;
}

export interface FileData {
  name: string;
  type: string;
  data: string; // Base64
}

export interface GenerationState {
  status: AppStatus;
  progress: number;
  logs: string[];
  currentStep: number;
  totalSteps: number;
}
