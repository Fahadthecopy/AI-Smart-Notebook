import React, { useState } from "react";
import {
  BookOpen,
  Bookmark,
  FileDown,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Palette,
  Eye,
  ChevronRight,
  ListOrdered
} from "lucide-react";
import { Project, NotebookStyleTemplate, NotebookPage } from "../types";

interface NotebookViewProps {
  project: Project;
  onUpdateStyle: (style: NotebookStyleTemplate) => void;
  onOpenPdfExport: () => void;
  onOpenPageEditor: (pageId: string) => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  project,
  onUpdateStyle,
  onOpenPdfExport,
  onOpenPageEditor,
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | "all">("all");
  const [originalModalPage, setOriginalModalPage] = useState<NotebookPage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const styles: NotebookStyleTemplate[] = [
    "Student Notes",
    "University Notes",
    "Coding Notebook",
    "Science Notebook",
    "Mathematics Notebook",
    "Engineering Notebook",
    "Exam Preparation",
    "Simple Notes",
    "Premium Digital Notebook",
  ];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredPages = project.pages.filter((page) => {
    if (searchTerm.trim() === "") return true;
    const term = searchTerm.toLowerCase();
    return (
      page.notes.title.toLowerCase().includes(term) ||
      page.extractedText.toLowerCase().includes(term) ||
      page.notes.summary.toLowerCase().includes(term) ||
      page.notes.importantPoints.some((p) => p.text.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Toolbar: Style Selector, Chapter Filter, Search & PDF */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Style Selector */}
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700">Notebook Style:</span>
          <select
            value={project.styleTemplate}
            onChange={(e) => onUpdateStyle(e.target.value as NotebookStyleTemplate)}
            className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            {styles.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search notebook notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Export PDF Button */}
        <button
          onClick={onOpenPdfExport}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-indigo-200 flex items-center space-x-1.5 transition-all"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Formatted PDF</span>
        </button>
      </div>

      {/* 1. COVER PAGE SECTION */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden border border-slate-800 text-center">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{project.styleTemplate.toUpperCase()}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-indigo-200/90 font-medium">
            {project.subject} • Transcribed & Structured from Handwritten Source Material
          </p>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 uppercase text-[10px] font-bold">
                Pages Transcribed
              </span>
              <span className="text-white font-bold text-sm">
                {project.pages.length} Pages
              </span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase text-[10px] font-bold">
                Chapters
              </span>
              <span className="text-white font-bold text-sm">
                {project.chapters.length} Modules
              </span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase text-[10px] font-bold">
                Created Date
              </span>
              <span className="text-white font-bold text-sm">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABLE OF CONTENTS */}
      {project.chapters.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2 mb-4">
            <ListOrdered className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Table of Contents</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {project.chapters.map((chap) => (
              <div
                key={chap.id}
                onClick={() =>
                  setSelectedChapterId(
                    selectedChapterId === chap.id ? "all" : chap.id
                  )
                }
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-indigo-600 block">
                    Chapter {chap.number}
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {chap.title}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">{chap.summary}</p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
                  <span>{chap.pageIds.length} pages</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PAGES RENDER STREAM */}
      <div className="space-y-10">
        {filteredPages.map((page) => (
          <article
            key={page.id}
            id={`page-${page.pageNumber}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Page Header Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  {page.pageNumber}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {page.notes.title || page.topic}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Topic: {page.notes.subtopics.join(" • ") || page.subject}
                  </span>
                </div>
              </div>

              {/* Verify Against Original Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setOriginalModalPage(page)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Verify Original Page</span>
                </button>
                <button
                  onClick={() => onOpenPageEditor(page.id)}
                  className="px-2.5 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Edit Page
                </button>
              </div>
            </div>

            {/* Page Body Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Important Points */}
              {page.notes.importantPoints.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Core Conceptual Highlights:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {page.notes.importantPoints.map((pt) => (
                      <div
                        key={pt.id}
                        className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                      >
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase mt-0.5 shrink-0 ${
                            pt.importance === "HIGH"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : pt.importance === "MEDIUM"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {pt.importance}
                        </span>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                          {pt.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Definitions */}
              {page.notes.definitions.length > 0 && (
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 space-y-2">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                    Key Terminology & Definitions:
                  </span>
                  {page.notes.definitions.map((def) => (
                    <div key={def.id} className="text-xs text-slate-700">
                      <strong className="text-indigo-950 font-bold">
                        {def.term}:{" "}
                      </strong>
                      <span>{def.definition}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulas & Equations */}
              {page.notes.formulas.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Mathematical Formulations:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {page.notes.formulas.map((f) => (
                      <div
                        key={f.id}
                        className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl"
                      >
                        <div className="font-mono text-xs font-bold text-blue-900 bg-white p-2 rounded border border-blue-100 inline-block shadow-2xs">
                          {f.clean || f.original}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-2">
                          {f.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagrams & Visuals */}
              {page.notes.diagrams.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Educational Visuals & Flowcharts:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {page.notes.diagrams.map((d) => (
                      <div
                        key={d.id}
                        className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-center"
                      >
                        <span className="text-xs font-bold text-slate-800 block mb-2">
                          {d.title}
                        </span>
                        {d.svgContent && (
                          <div
                            className="bg-white p-4 rounded-lg border border-slate-200 mb-2 flex items-center justify-center"
                            dangerouslySetInnerHTML={{ __html: d.svgContent }}
                          />
                        )}
                        <p className="text-[11px] text-slate-500">{d.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Blocks */}
              {page.notes.codeBlocks.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Source Code & Algorithms:
                  </span>
                  {page.notes.codeBlocks.map((cb) => (
                    <div
                      key={cb.id}
                      className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-xs font-mono shadow-sm"
                    >
                      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
                        <span className="uppercase font-bold text-indigo-400">
                          {cb.language}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="hidden sm:inline">{cb.explanation}</span>
                          <button
                            onClick={() => handleCopyCode(cb.id, cb.code)}
                            className="flex items-center space-x-1 text-slate-300 hover:text-white"
                          >
                            {copiedCodeId === cb.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-slate-200 overflow-x-auto leading-relaxed">
                        {cb.code}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Page Summary */}
              {page.notes.summary && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <span className="font-extrabold uppercase tracking-wider block mb-1 text-emerald-800">
                    Chapter Summary:
                  </span>
                  <p className="leading-relaxed font-medium">{page.notes.summary}</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Verify Original Modal */}
      {originalModalPage && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Original Handwritten Source — Page #{originalModalPage.pageNumber}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {originalModalPage.originalFileName}
                </p>
              </div>
              <button
                onClick={() => setOriginalModalPage(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 rounded-xl p-4 flex items-center justify-center">
              <img
                src={originalModalPage.originalImageUrl}
                alt="Original handwritten scan"
                className="max-h-[68vh] object-contain rounded shadow-lg"
              />
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                Readability: {originalModalPage.readabilityScore}% • OCR Confidence:{" "}
                {originalModalPage.ocrConfidence}%
              </span>
              <button
                onClick={() => {
                  onOpenPageEditor(originalModalPage.id);
                  setOriginalModalPage(null);
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                Open in Full Page Editor →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
