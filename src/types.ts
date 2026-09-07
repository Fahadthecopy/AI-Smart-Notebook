export type SubjectType =
  | "Coding / Programming"
  | "Computer Science"
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "Engineering"
  | "History"
  | "Geography"
  | "English"
  | "Business"
  | "Economics"
  | "Literature"
  | "General Notes"
  | "Other";

export type ImportanceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ImportantPoint {
  id: string;
  text: string;
  importance: ImportanceLevel;
}

export interface DefinitionItem {
  id: string;
  term: string;
  definition: string;
}

export interface FormulaItem {
  id: string;
  original: string;
  clean: string;
  explanation: string;
}

export interface CodeBlockItem {
  id: string;
  language: string;
  code: string;
  explanation: string;
}

export interface DiagramItem {
  id: string;
  title: string;
  type: "flowchart" | "diagram" | "chart" | "geometry" | "schematic" | "timeline";
  description: string;
  svgContent?: string;
  isAiGenerated: boolean;
}

export interface PageNotes {
  title: string;
  topic: string;
  subtopics: string[];
  headings: string[];
  importantPoints: ImportantPoint[];
  definitions: DefinitionItem[];
  formulas: FormulaItem[];
  codeBlocks: CodeBlockItem[];
  diagrams: DiagramItem[];
  keyTakeaways: string[];
  summary: string;
}

export interface NotebookPage {
  id: string;
  pageNumber: number;
  originalFileName: string;
  originalImageUrl: string;
  enhancedImageUrl: string;
  rotation: number;
  qualityScore: number;
  readabilityScore: number;
  ocrConfidence: number;
  subjectConfidence: number;
  subject: SubjectType;
  topic: string;
  subtopics: string[];
  extractedText: string;
  notes: PageNotes;
  chapterIndex: number;
  isDuplicateOf?: number;
  status: "pending" | "processing" | "completed" | "error";
  errorMessage?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  pageIds: string[];
  importantPoints: ImportantPoint[];
  formulas: FormulaItem[];
  codeBlocks: CodeBlockItem[];
}

export type NotebookStyleTemplate =
  | "Student Notes"
  | "University Notes"
  | "Coding Notebook"
  | "Science Notebook"
  | "Mathematics Notebook"
  | "Engineering Notebook"
  | "Exam Preparation"
  | "Simple Notes"
  | "Premium Digital Notebook";

export interface QuizQuestion {
  id: string;
  type: "mcq" | "true_false" | "fill_blank" | "short";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  commonMistake?: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface LearningMemory {
  topicsStudied: string[];
  weakAreas: string[];
  strongAreas: string[];
  completedChapters: string[];
  overallUnderstandingScore: number;
  preferredLanguage: "English" | "Urdu" | "Mixed";
  totalQuizzesTaken: number;
  averageQuizScore: number;
  notesRevisedCount: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  subject: SubjectType;
  styleTemplate: NotebookStyleTemplate;
  pages: NotebookPage[];
  chapters: Chapter[];
  quizzes: QuizQuestion[];
  memory: LearningMemory;
}

export interface ProcessingProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
  currentStage: string;
  stagesCompleted: string[];
}
