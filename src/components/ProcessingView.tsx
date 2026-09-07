import React from "react";
import {
  CheckCircle2,
  Loader2,
  Circle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  FileCheck2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { NotebookPage, SubjectType } from "../types";

interface ProcessingViewProps {
  pages: NotebookPage[];
  currentIndex: number;
  isProcessing: boolean;
  onRetryPage: (pageId: string) => void;
  onSkipPage: (pageId: string) => void;
  onFinish: () => void;
  subject: SubjectType;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  pages,
  currentIndex,
  isProcessing,
  onRetryPage,
  onSkipPage,
  onFinish,
  subject,
}) => {
  const total = pages.length;
  const completedCount = pages.filter((p) => p.status === "completed").length;
  const errorCount = pages.filter((p) => p.status === "error").length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const currentPage = pages[currentIndex] || pages[0];

  const pipelineStages = [
    { id: "upload", label: "Upload & File Scan", done: true },
    { id: "enhance", label: "Image Enhancement & Contrast Straightening", done: progressPercent > 10 },
    { id: "ocr", label: "Handwriting Recognition & Text Extraction", done: progressPercent > 25 },
    { id: "subject", label: `Subject Classification (${subject})`, done: progressPercent > 40 },
    { id: "analysis", label: "Content Analysis & Topic Detection", done: progressPercent > 60 },
    { id: "points", label: "Important Points & Formula Parsing", done: progressPercent > 75 },
    { id: "visuals", label: "Diagram & Visual Recreation", done: progressPercent > 90 },
    { id: "notebook", label: "Digital Notebook Organization & PDF Pre-render", done: progressPercent === 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Progress Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 mb-2">
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Transformation in Progress</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pipeline Completed</span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Processing Page {Math.min(currentIndex + 1, total)} / {total}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Analyzing handwriting, extracting formulas, removing scanner noise, and structuring notes.
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-indigo-600">
              {progressPercent}%
            </span>
            <span className="block text-xs text-slate-400 font-medium">
              {completedCount} of {total} Pages Done
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action button if all done */}
        {!isProcessing && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>All pages successfully structured and organized!</span>
            </span>
            <button
              onClick={onFinish}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105"
            >
              <span>Open Digital Notebook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Two Column Layout: Stages & Current Page Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Pipeline Stages Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Automated AI Pipeline Stages</span>
          </h3>

          <div className="space-y-3.5">
            {pipelineStages.map((stg, idx) => (
              <div
                key={stg.id}
                className="flex items-center space-x-3 text-xs"
              >
                {stg.done ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : isProcessing && idx === Math.floor((progressPercent / 100) * pipelineStages.length) ? (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center shrink-0">
                    <Circle className="w-3 h-3" />
                  </div>
                )}
                <span
                  className={`font-medium ${
                    stg.done
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {stg.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Page Real-time Card */}
        {currentPage && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700">
                  Current: Page {currentPage.pageNumber}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-mono rounded">
                  {currentPage.originalFileName}
                </span>
              </div>

              <div className="w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center">
                <img
                  src={currentPage.enhancedImageUrl || currentPage.originalImageUrl}
                  alt="Processing preview"
                  className="max-h-full object-contain"
                />
                {currentPage.status === "processing" && (
                  <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
                    <span>Extracting handwriting...</span>
                  </div>
                )}
              </div>

              {currentPage.notes.title && (
                <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-xl p-3 text-xs">
                  <span className="font-bold text-indigo-900 block truncate">
                    Detected: {currentPage.notes.title}
                  </span>
                  <p className="text-indigo-700/80 text-[11px] mt-0.5 line-clamp-2">
                    {currentPage.notes.summary || "Structured lecture notes generated."}
                  </p>
                </div>
              )}
            </div>

            {/* Error or single page controls if needed */}
            {currentPage.status === "error" && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Page could not be fully processed.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRetryPage(currentPage.id)}
                    className="px-2 py-1 bg-white text-rose-700 font-bold border border-rose-300 rounded hover:bg-rose-100 flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                  <button
                    onClick={() => onSkipPage(currentPage.id)}
                    className="px-2 py-1 bg-slate-100 text-slate-600 font-medium rounded hover:bg-slate-200"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pages Queue Mini Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Pages Pipeline Queue ({pages.length} Pages)
        </h4>
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-thin">
          {pages.map((p, idx) => (
            <div
              key={p.id}
              className={`w-14 shrink-0 rounded-lg border p-1 text-center transition-all ${
                p.status === "completed"
                  ? "border-emerald-300 bg-emerald-50/50"
                  : p.status === "processing"
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                  : "border-slate-200 bg-slate-50 opacity-60"
              }`}
            >
              <div className="w-full aspect-[3/4] bg-slate-200 rounded overflow-hidden mb-1">
                <img
                  src={p.enhancedImageUrl || p.originalImageUrl}
                  alt={`P${p.pageNumber}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-700 block">
                P.{p.pageNumber}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
