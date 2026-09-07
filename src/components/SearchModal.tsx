import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Zap,
  Code2,
  FileText,
  ArrowRight,
  X
} from "lucide-react";
import { Project, NotebookPage } from "../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onNavigateToPage: (pageId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  project,
  onNavigateToPage,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState("");

  const results: Array<{
    page: NotebookPage;
    matchType: "topic" | "formula" | "code" | "text" | "point";
    snippet: string;
  }> = [];

  if (query.trim()) {
    const q = query.toLowerCase();

    project.pages.forEach((page) => {
      if (
        page.notes.title.toLowerCase().includes(q) ||
        page.topic.toLowerCase().includes(q)
      ) {
        results.push({
          page,
          matchType: "topic",
          snippet: page.notes.title || page.topic,
        });
      }

      page.notes.importantPoints.forEach((pt) => {
        if (pt.text.toLowerCase().includes(q)) {
          results.push({
            page,
            matchType: "point",
            snippet: pt.text,
          });
        }
      });

      page.notes.formulas.forEach((f) => {
        if (
          f.clean.toLowerCase().includes(q) ||
          f.original.toLowerCase().includes(q) ||
          f.explanation.toLowerCase().includes(q)
        ) {
          results.push({
            page,
            matchType: "formula",
            snippet: `${f.clean} — ${f.explanation}`,
          });
        }
      });

      page.notes.codeBlocks.forEach((cb) => {
        if (
          cb.code.toLowerCase().includes(q) ||
          cb.language.toLowerCase().includes(q)
        ) {
          results.push({
            page,
            matchType: "code",
            snippet: `${cb.language.toUpperCase()}: ${cb.code.slice(0, 70)}...`,
          });
        }
      });

      if (page.extractedText.toLowerCase().includes(q)) {
        const idx = page.extractedText.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 30);
        const end = Math.min(page.extractedText.length, idx + 60);
        results.push({
          page,
          matchType: "text",
          snippet: `"...${page.extractedText.slice(start, end)}..."`,
        });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-20 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search words, formulas, code, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 space-y-1">
          {query.trim() && results.length === 0 && (
            <div className="text-center py-10 text-xs text-slate-400">
              No matching terms found in "{project.title}".
            </div>
          )}

          {!query.trim() && (
            <div className="text-center py-8 text-xs text-slate-400">
              Type any keyword, equation (e.g. "BST", "log n", "traversal"), or topic to jump instantly.
            </div>
          )}

          {results.slice(0, 15).map((res, i) => (
            <div
              key={i}
              onClick={() => {
                onNavigateToPage(res.page.id);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl hover:bg-indigo-50/50 cursor-pointer flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 flex items-center justify-center shrink-0">
                  {res.matchType === "formula" ? (
                    <Zap className="w-3.5 h-3.5" />
                  ) : res.matchType === "code" ? (
                    <Code2 className="w-3.5 h-3.5" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                      Page {res.page.pageNumber} • {res.matchType}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {res.page.notes.title || res.page.topic}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-mono">
                    {res.snippet}
                  </p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
