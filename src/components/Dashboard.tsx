import React from "react";
import {
  UploadCloud,
  BookOpen,
  Cpu,
  GraduationCap,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers
} from "lucide-react";
import { Project } from "../types";
import { NavTab } from "./Navbar";

interface DashboardProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  onNavigate: (tab: NavTab) => void;
  onNewProject: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onNavigate,
  onNewProject,
}) => {
  const totalPages = projects.reduce((acc, p) => acc + p.pages.length, 0);
  const processedPages = projects.reduce(
    (acc, p) => acc + p.pages.filter((pg) => pg.status === "completed").length,
    0
  );
  const totalDiagrams = projects.reduce(
    (acc, p) =>
      acc +
      p.pages.reduce((sub, pg) => sub + (pg.notes.diagrams?.length || 0), 0),
    0
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Handwritten Work → High-Quality Digital Textbook</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Transform Your Rough Notes into an Intelligent Digital Notebook
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed mb-6 max-w-2xl">
            Upload single photos, messy lecture scans, or up to 1,000+ handwritten
            pages. The AI automatically enhances contrast, transcribes handwriting,
            identifies subjects, structures chapters, draws diagrams, and acts as
            your interactive classroom tutor.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("upload")}
              className="inline-flex items-center space-x-2 bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              <span>Upload Work (1 - 1,000+ Pages)</span>
            </button>
            <button
              onClick={() => onNavigate("notebook")}
              className="inline-flex items-center space-x-2 bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-400/30 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read "{activeProject.title.slice(0, 24)}..."</span>
            </button>
            <button
              onClick={() => onNavigate("teacher")}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Teach Me This Chapter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {projects.length}
            </span>
            <span className="text-xs text-slate-500">Active Notebooks</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Organized by subject & chapter
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Scanned Pages
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{totalPages}</span>
            <span className="text-xs text-emerald-600 font-medium">
              {processedPages} Enhanced
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Preserving original files alongside
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Diagrams Created
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {totalDiagrams}
            </span>
            <span className="text-xs text-purple-600 font-medium">
              Vector & Schematic
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Recreated from rough sketches
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Understanding Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {activeProject.memory.overallUnderstandingScore}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              Verified by Quiz
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {activeProject.memory.strongAreas.length} mastered concepts
          </p>
        </div>
      </div>

      {/* Quick Action Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload card */}
        <div
          onClick={() => onNavigate("upload")}
          className="group relative bg-white hover:bg-indigo-50/40 p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Upload & Batch Scan
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Upload JPG, PNG, WEBP or PDFs. Batch process up to 1,000+ pages with
            automatic rotation, noise reduction, and subject detection.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
            <span>Start Uploading</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>

        {/* Read Notebook card */}
        <div
          onClick={() => onNavigate("notebook")}
          className="group relative bg-white hover:bg-blue-50/40 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Structured Digital Notebook
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Read your verified notes formatted with clean mathematical notation,
            syntax-highlighted code, definitions, and high-importance points.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>Open Current Textbook</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>

        {/* Interactive Classroom Teacher card */}
        <div
          onClick={() => onNavigate("teacher")}
          className="group relative bg-white hover:bg-emerald-50/40 p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            AI Personal Teacher & Whiteboard
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Interactive step-by-step classroom with hand-raising, 5-stage re-explain
            escalation, live blackboard/whiteboard sketching, and bilingual voice.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
            <span>Enter Virtual Classroom</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>

      {/* Active Project Overview & AI Learning Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Project Pages Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                  {activeProject.subject}
                </span>
                <span className="text-xs text-slate-400">
                  Style: {activeProject.styleTemplate}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {activeProject.title}
              </h2>
            </div>
            <button
              onClick={() => onNavigate("editor")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Edit Pages →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activeProject.pages.map((page) => (
              <div
                key={page.id}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 transition-colors cursor-pointer"
                onClick={() => onNavigate("editor")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-14 rounded border border-slate-300 overflow-hidden bg-slate-100 shrink-0 shadow-2xs">
                    <img
                      src={page.enhancedImageUrl || page.originalImageUrl}
                      alt={`Page ${page.pageNumber}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">
                        Page {page.pageNumber}: {page.notes.title || page.topic}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">
                        {page.ocrConfidence}% OCR Conf.
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {page.notes.summary || page.notes.headings.join(" • ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
                  <span>{page.notes.importantPoints.length} points</span>
                  <span>•</span>
                  <span>{page.notes.formulas.length} formulas</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>All original handwriting preserved untouched</span>
            </span>
            <button
              onClick={() => onNavigate("notebook")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View Full Notebook ({activeProject.pages.length} Pages)
            </button>
          </div>
        </div>

        {/* Right 1 Col: AI Memory & Exam Readiness */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Tutor Memory & Grip</span>
              </h3>
              <span className="text-xs font-semibold text-indigo-600">Active</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Remembers your strengths, weak concepts, and previous mistakes across
              sessions.
            </p>

            {/* Strong Areas */}
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1.5">
                ✓ Strong Concepts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.memory.strongAreas.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Weak Areas */}
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1.5">
                ⚠ Concepts Requiring Practice
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.memory.weakAreas.map((w, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-medium"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate("quiz")}
              className="w-full mt-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Practice Weak Topics in Exam Mode</span>
            </button>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
              Processing Reliability
            </h4>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero hallucination policy: [unclear text] markers</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Original files preserved with 100% fidelity</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>A4/Letter high-resolution PDF vector export</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
