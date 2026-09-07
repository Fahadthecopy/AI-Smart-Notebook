import React, { useState } from "react";
import {
  FileDown,
  Printer,
  Check,
  Sparkles,
  Settings2,
  X,
  FileText
} from "lucide-react";
import { Project } from "../types";
import { generateNotebookPdf, PdfExportOptions } from "../utils/pdfGenerator";

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen) return null;

  const [options, setOptions] = useState<PdfExportOptions>({
    format: "a4",
    orientation: "portrait",
    quality: "High Quality",
    includeOriginalThumbnails: true,
    includeTableOfContents: true,
    includeQuizzes: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        generateNotebookPdf(project, options);
      } catch (err) {
        console.error("PDF generation failed:", err);
      } finally {
        setIsExporting(false);
        onClose();
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Export Digital Notebook PDF
              </h3>
              <p className="text-xs text-slate-500">
                Ready for printing, sharing, or submitting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="space-y-4 text-xs">
          {/* Page Format & Orientation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Paper Format:
              </label>
              <select
                value={options.format}
                onChange={(e) =>
                  setOptions({ ...options, format: e.target.value as "a4" | "letter" })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                <option value="a4">A4 (Standard Academic)</option>
                <option value="letter">Letter (US)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Orientation:
              </label>
              <select
                value={options.orientation}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    orientation: e.target.value as "portrait" | "landscape",
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          {/* Quality Mode */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Rendering Quality:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Standard", "High Quality", "Print Quality"] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setOptions({ ...options, quality: q })}
                  className={`py-2 px-2 text-center rounded-lg border font-semibold ${
                    options.quality === q
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeTableOfContents}
                onChange={(e) =>
                  setOptions({ ...options, includeTableOfContents: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-slate-700 font-medium">
                Include Table of Contents with chapter page index
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeQuizzes}
                onChange={(e) =>
                  setOptions({ ...options, includeQuizzes: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-slate-700 font-medium">
                Include Exam Mode & Formula Review section
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Direct Print</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 flex items-center space-x-1.5 transition-all"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? "Generating PDF..." : "Download PDF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
