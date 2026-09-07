import React, { useState } from "react";
import {
  Sliders,
  FileText,
  Sparkles,
  Image as ImageIcon,
  RotateCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Save,
  Code2,
  Plus,
  ArrowLeftRight
} from "lucide-react";
import { NotebookPage, ImportantPoint, FormulaItem, CodeBlockItem, DiagramItem } from "../types";
import { enhanceScannedImage } from "../utils/imageEnhancer";

interface PageEditorProps {
  page: NotebookPage;
  allPages: NotebookPage[];
  onUpdatePage: (updated: NotebookPage) => void;
  onDeletePage: (pageId: string) => void;
  onSelectPage: (pageId: string) => void;
}

type EditorTab = "split" | "original" | "enhanced" | "text" | "notes" | "visuals";

export const PageEditor: React.FC<PageEditorProps> = ({
  page,
  allPages,
  onUpdatePage,
  onDeletePage,
  onSelectPage,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>("split");
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 - 100%
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedTitle, setEditedTitle] = useState(page.notes.title || page.topic);
  const [editedSummary, setEditedSummary] = useState(page.notes.summary);
  const [editedOcrText, setEditedOcrText] = useState(page.extractedText);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Current page navigation
  const currentIndex = allPages.findIndex((p) => p.id === page.id);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  const handleRotate = async () => {
    const newRotation = (page.rotation + 90) % 360;
    setIsEnhancing(true);
    const newEnhanced = await enhanceScannedImage(page.originalImageUrl, {
      rotation: newRotation,
      contrast: 30,
      brightness: 12,
    });
    setIsEnhancing(false);

    onUpdatePage({
      ...page,
      rotation: newRotation,
      enhancedImageUrl: newEnhanced,
    });
  };

  const handleSaveNotes = () => {
    onUpdatePage({
      ...page,
      extractedText: editedOcrText,
      notes: {
        ...page.notes,
        title: editedTitle,
        summary: editedSummary,
      },
    });
    setIsEditingNotes(false);
  };

  const addImportantPoint = () => {
    const newPoint: ImportantPoint = {
      id: `pt_${Date.now()}`,
      text: "New key concept identified on this page.",
      importance: "MEDIUM",
    };
    onUpdatePage({
      ...page,
      notes: {
        ...page.notes,
        importantPoints: [...page.notes.importantPoints, newPoint],
      },
    });
  };

  const removeImportantPoint = (id: string) => {
    onUpdatePage({
      ...page,
      notes: {
        ...page.notes,
        importantPoints: page.notes.importantPoints.filter((p) => p.id !== id),
      },
    });
  };

  const downloadSvgDiagram = (diag: DiagramItem) => {
    if (!diag.svgContent) return;
    const blob = new Blob([diag.svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${diag.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Page Header & Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
            #{page.pageNumber}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                {page.notes.title || page.topic}
              </h2>
              <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded">
                {page.subject}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Source: {page.originalFileName}
            </p>
          </div>
        </div>

        {/* Page Paging & Quick Actions */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <button
            onClick={() => prevPage && onSelectPage(prevPage.id)}
            disabled={!prevPage}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 disabled:opacity-30 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-slate-600 px-2">
            {currentIndex + 1} / {allPages.length}
          </span>

          <button
            onClick={() => nextPage && onSelectPage(nextPage.id)}
            disabled={!nextPage}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 disabled:opacity-30 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            onClick={handleRotate}
            disabled={isEnhancing}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
            title="Rotate Page"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Rotate</span>
          </button>

          <button
            onClick={() => onDeletePage(page.id)}
            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg flex items-center space-x-1 border border-rose-200"
            title="Delete Page"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Confidence & Quality Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-500">Image Quality:</span>
          <span className="text-xs font-bold text-slate-800">{page.qualityScore}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-xs text-slate-500">Readability:</span>
          <span className="text-xs font-bold text-slate-800">{page.readabilityScore}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-slate-500">OCR Confidence:</span>
          <span className="text-xs font-bold text-slate-800">{page.ocrConfidence}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span className="text-xs text-slate-500">Subject Conf:</span>
          <span className="text-xs font-bold text-slate-800">{page.subjectConfidence}%</span>
        </div>
      </div>

      {/* Editor View Tab Selector */}
      <div className="border-b border-slate-200 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        {[
          { id: "split", label: "Before / After Comparison", icon: ArrowLeftRight },
          { id: "original", label: "Original Upload", icon: ImageIcon },
          { id: "enhanced", label: "Enhanced Page", icon: Sparkles },
          { id: "text", label: "Extracted Text (OCR)", icon: FileText },
          { id: "notes", label: "AI Structured Notes", icon: Edit2 },
          { id: "visuals", label: `Visuals & Diagrams (${page.notes.diagrams?.length || 0})`, icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EditorTab)}
              className={`flex items-center space-x-2 py-2.5 px-3.5 border-b-2 text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/40 rounded-t-lg"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Before / After Split Slider */}
      {activeTab === "split" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <span>Original Handwriting</span>
              <span className="text-slate-400">vs</span>
              <span className="text-indigo-600">AI Background & Contrast Enhanced</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              Split: {sliderPos}%
            </span>
          </div>

          {/* Interactive Split Container */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden select-none">
            {/* Enhanced Image (Background) */}
            <img
              src={page.enhancedImageUrl || page.originalImageUrl}
              alt="Enhanced"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Original Image (Clipped on Left side) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={page.originalImageUrl}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{
                  width: "100%",
                  maxWidth: "none",
                  minWidth: "100%",
                }}
              />
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                ORIGINAL UPLOAD
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              ENHANCED SCAN
            </div>

            {/* Split Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)] cursor-ew-resize flex items-center justify-center z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center -ml-3">
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Full width range overlay for easy dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
            />
          </div>

          <p className="text-center text-xs text-slate-400">
            ← Drag the slider horizontally to compare original raw handwriting with enhanced contrast scan →
          </p>
        </div>
      )}

      {/* TAB 2: Original Image */}
      {activeTab === "original" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center">
          <div className="max-w-2xl mx-auto bg-slate-950 rounded-xl p-4">
            <img
              src={page.originalImageUrl}
              alt="Original Upload"
              className="max-h-[70vh] mx-auto object-contain rounded"
            />
          </div>
          <p className="mt-4 text-xs text-slate-500 font-mono">
            Original unprocessed source image file preserved strictly as uploaded.
          </p>
        </div>
      )}

      {/* TAB 3: Enhanced Image */}
      {activeTab === "enhanced" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center">
          <div className="max-w-2xl mx-auto bg-slate-950 rounded-xl p-4">
            <img
              src={page.enhancedImageUrl}
              alt="Enhanced Scan"
              className="max-h-[70vh] mx-auto object-contain rounded"
            />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Adjusted contrast, leveled paper background, sharpened ink lines, and aligned rotation.
          </p>
        </div>
      )}

      {/* TAB 4: Extracted OCR Text */}
      {activeTab === "text" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Raw Extracted Handwriting (OCR)
            </h3>
            <span className="text-xs text-slate-500">
              Confidence: {page.ocrConfidence}%
            </span>
          </div>

          {page.extractedText.includes("[Text unclear") && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Unclear Ink Smear Detected:</strong> The system flagged
                smudged sections as "[Text unclear — please review original image]"
                rather than guessing.
              </span>
            </div>
          )}

          <textarea
            value={editedOcrText}
            onChange={(e) => setEditedOcrText(e.target.value)}
            rows={10}
            className="w-full p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save OCR Edits</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: AI Notes & Structured Content */}
      {activeTab === "notes" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Generated Structured Notes
              </h3>
              <p className="text-xs text-slate-500">
                Organized into headings, high-priority concepts, equations, and summaries.
              </p>
            </div>
            <button
              onClick={() => setIsEditingNotes(!isEditingNotes)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingNotes ? "Finish Editing" : "Edit Notes"}</span>
            </button>
          </div>

          {/* Title & Summary */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Page Title:
            </label>
            {isEditingNotes ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            ) : (
              <h1 className="text-xl font-extrabold text-slate-900">
                {page.notes.title || page.topic}
              </h1>
            )}

            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-4">
              Summary:
            </label>
            {isEditingNotes ? (
              <textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                rows={3}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-300 rounded-lg p-2.5 leading-relaxed"
              />
            ) : (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                {page.notes.summary}
              </p>
            )}
          </div>

          {/* Important Points */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Important Points ({page.notes.importantPoints.length})
              </h4>
              <button
                onClick={addImportantPoint}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-2">
              {page.notes.importantPoints.map((pt) => (
                <div
                  key={pt.id}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start space-x-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase shrink-0 mt-0.5 ${
                        pt.importance === "HIGH"
                          ? "bg-rose-100 text-rose-700"
                          : pt.importance === "MEDIUM"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {pt.importance}
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {pt.text}
                    </p>
                  </div>
                  <button
                    onClick={() => removeImportantPoint(pt.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas */}
          {page.notes.formulas.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Formulas & Mathematical Relations
              </h4>
              <div className="space-y-2">
                {page.notes.formulas.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-blue-50/40 border border-blue-200 rounded-xl"
                  >
                    <div className="font-mono text-xs font-bold text-blue-900">
                      {f.clean || f.original}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      {f.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code blocks */}
          {page.notes.codeBlocks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Code Blocks</span>
              </h4>
              {page.notes.codeBlocks.map((cb) => (
                <div
                  key={cb.id}
                  className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 mb-3"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 border-b border-slate-800 pb-1">
                    <span className="uppercase font-bold text-indigo-400">
                      {cb.language}
                    </span>
                    <span>{cb.explanation}</span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre leading-relaxed">
                    {cb.code}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {isEditingNotes && (
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={handleSaveNotes}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save All Page Changes</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Diagrams & Visuals */}
      {activeTab === "visuals" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Educational Diagrams & Visual Recreations
              </h3>
              <p className="text-xs text-slate-500">
                Vector illustrations generated from handwritten doodles and charts.
              </p>
            </div>
          </div>

          {page.notes.diagrams.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No diagrams detected on this page.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {page.notes.diagrams.map((diag) => (
                <div
                  key={diag.id}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        {diag.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded font-semibold">
                        {diag.type.toUpperCase()}
                      </span>
                    </div>

                    {diag.svgContent && (
                      <div
                        className="bg-white rounded-lg p-4 border border-slate-200 mb-3 flex items-center justify-center min-h-[160px]"
                        dangerouslySetInnerHTML={{ __html: diag.svgContent }}
                      />
                    )}

                    <p className="text-xs text-slate-600">{diag.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-medium">
                      AI-generated educational illustration
                    </span>
                    <button
                      onClick={() => downloadSvgDiagram(diag)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download SVG</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
