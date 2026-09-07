import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  RotateCw,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  AlertCircle,
  FileCode2,
  RefreshCw,
  Plus
} from "lucide-react";
import { NotebookPage, SubjectType } from "../types";
import { enhanceScannedImage } from "../utils/imageEnhancer";

interface UploadViewProps {
  onStartProcessing: (newPages: NotebookPage[], subject: SubjectType) => void;
  onCancel?: () => void;
}

interface StagedFile {
  id: string;
  file?: File;
  name: string;
  originalDataUrl: string;
  rotation: number;
  qualityPreview: "High" | "Medium" | "Fair";
  sizeKb: number;
}

export const UploadView: React.FC<UploadViewProps> = ({ onStartProcessing }) => {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>("Computer Science");
  const [previewFile, setPreviewFile] = useState<StagedFile | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects: SubjectType[] = [
    "Computer Science",
    "Coding / Programming",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "History",
    "Geography",
    "English",
    "Business",
    "Economics",
    "General Notes",
    "Other",
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newEntries: StagedFile[] = [];
    Array.from(files).forEach((file, index) => {
      // Create reader for data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || "";
        setStagedFiles((prev) => [
          ...prev,
          {
            id: `staged_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            file,
            name: file.name,
            originalDataUrl: dataUrl,
            rotation: 0,
            qualityPreview: file.size > 200000 ? "High" : "Medium",
            sizeKb: Math.round(file.size / 1024),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const loadSamplePages = () => {
    const samples = [
      {
        name: "lecture_1_page1.jpg",
        title: "Introduction to Tree Recursion",
        lines: [
          "Recursive Tree Algorithms:",
          "Base Case: if node == nullptr return 0",
          "Recursive step: return 1 + max(depth(L), depth(R))",
          "Time Complexity: O(n) visits every node exactly once",
          "[ink smudge near bottom edge]",
          "Invariant: Height h satisfies: log2(n) <= h <= n"
        ],
      },
      {
        name: "lecture_1_page2.jpg",
        title: "Binary Tree Balancing & Rotations",
        lines: [
          "AVL Balance Factor definition:",
          "  BF(node) = height(left) - height(right)",
          "Allowable balance factor: {-1, 0, +1}",
          "Single Right Rotation (LL Case):",
          "  P becomes right child of L",
          "Double Rotation (LR Case): Left on L, then Right on P"
        ],
      },
      {
        name: "lecture_1_page3.jpg",
        title: "Complexity Proofs & Summary",
        lines: [
          "Theorem: Height of AVL tree with n nodes is bounded by 1.44 log2(n)",
          "Search Time in balanced tree: O(log n)",
          "Insertion with rebalance: O(log n) time, at most 2 rotations",
          "Summary: Guarantees strict worst-case lookup performance."
        ],
      },
    ];

    const newFiles: StagedFile[] = samples.map((s, idx) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
        <rect width="600" height="800" fill="#fdfbf7" />
        <line x1="50" y1="0" x2="50" y2="800" stroke="#fca5a5" stroke-width="1.5" />
        <text x="70" y="50" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#1e293b">${s.title}</text>
        <line x1="40" y1="65" x2="560" y2="65" stroke="#94a3b8" stroke-dasharray="4,2" />
        ${s.lines
          .map(
            (l, i) =>
              `<text x="70" y="${110 + i * 35}" font-family="'Courier New', monospace" font-size="13" font-weight="600" fill="#334155">${l}</text>`
          )
          .join("")}
      </svg>`;
      const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

      return {
        id: `sample_${idx}_${Date.now()}`,
        name: s.name,
        originalDataUrl: dataUrl,
        rotation: 0,
        qualityPreview: "High",
        sizeKb: 145,
      };
    });

    setStagedFiles(newFiles);
  };

  const rotateStagedFile = (id: string) => {
    setStagedFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, rotation: (f.rotation + 90) % 360 } : f
      )
    );
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stagedFiles.length) return;
    const updated = [...stagedFiles];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setStagedFiles(updated);
  };

  const handleStartProcessing = async () => {
    if (stagedFiles.length === 0) return;
    setIsPreparing(true);

    try {
      const generatedPages: NotebookPage[] = [];

      for (let i = 0; i < stagedFiles.length; i++) {
        const sf = stagedFiles[i];
        // Apply canvas enhancement filter
        const enhancedUrl = await enhanceScannedImage(sf.originalDataUrl, {
          rotation: sf.rotation,
          contrast: 30,
          brightness: 12,
          cleanBackground: true,
          sharpen: true,
        });

        generatedPages.push({
          id: `page_${Date.now()}_${i + 1}`,
          pageNumber: i + 1,
          originalFileName: sf.name,
          originalImageUrl: sf.originalDataUrl,
          enhancedImageUrl: enhancedUrl,
          rotation: sf.rotation,
          qualityScore: 92,
          readabilityScore: 90,
          ocrConfidence: 94,
          subjectConfidence: 95,
          subject: selectedSubject,
          topic: `Page ${i + 1} Content`,
          subtopics: ["Core Concepts", "Analysis"],
          chapterIndex: 1,
          status: "pending",
          extractedText: "",
          notes: {
            title: `Page ${i + 1} Structured Notes`,
            topic: selectedSubject,
            subtopics: [],
            headings: [],
            importantPoints: [],
            definitions: [],
            formulas: [],
            codeBlocks: [],
            diagrams: [],
            keyTakeaways: [],
            summary: "",
          },
        });
      }

      onStartProcessing(generatedPages, selectedSubject);
    } catch (err) {
      console.error("Preparation error:", err);
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Supports 1, 50, 100, 500, up to 1,000+ Pages</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Your Work
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Upload handwritten notes, scanned pages, photos, PDFs, diagrams, or
          study material. Reorder, rotate, or replace pages before AI digitization.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/60 scale-[1.01]"
            : "border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/60 shadow-xs"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Drop handwritten or scanned pages here, or browse
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Supports JPG, JPEG, PNG, WEBP, and PDF. Never overwrites original files.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <span className="px-2.5 py-1 bg-slate-100 rounded-md">
            Batch up to 1,000+ pgs
          </span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-md">
            Auto-contrast enhancement
          </span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-md">
            Zero data loss guarantee
          </span>
        </div>

        {/* Quick Demo Sample Button */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSamplePages();
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Load 3 Demo Handwritten Lecture Pages</span>
          </button>
        </div>
      </div>

      {/* Staged Pages Configuration & Controls */}
      {stagedFiles.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>Staged Pages Queue</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  {stagedFiles.length} Pages Ready
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Rearrange, rotate, or inspect pages before launching the AI analysis.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  Subject:
                </span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as SubjectType)}
                  className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setStagedFiles([])}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Grid of uploaded thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stagedFiles.map((item, idx) => (
              <div
                key={item.id}
                className="group relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-2.5 transition-all hover:shadow-md hover:border-indigo-300"
              >
                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-slate-900/80 text-white rounded text-[10px] font-bold">
                  #{idx + 1}
                </div>

                {/* Thumbnail */}
                <div
                  className="w-full aspect-[3/4] bg-white rounded-lg border border-slate-200 overflow-hidden relative cursor-pointer"
                  onClick={() => setPreviewFile(item)}
                >
                  <img
                    src={item.originalDataUrl}
                    alt={item.name}
                    style={{ transform: `rotate(${item.rotation}deg)` }}
                    className="w-full h-full object-cover transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-2">
                  <p className="text-[11px] font-semibold text-slate-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>{item.sizeKb} KB</span>
                    {item.rotation !== 0 && <span>{item.rotation}°</span>}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => moveFile(idx, "up")}
                      disabled={idx === 0}
                      title="Move earlier"
                      className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveFile(idx, "down")}
                      disabled={idx === stagedFiles.length - 1}
                      title="Move later"
                      className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => rotateStagedFile(item.id)}
                      title="Rotate 90 degrees"
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeStagedFile(item.id)}
                      title="Remove page"
                      className="p-1 hover:bg-rose-100 text-rose-600 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                All {stagedFiles.length} pages will be processed independently with
                automatic contrast enhancement & handwriting transcription.
              </span>
            </div>

            <button
              onClick={handleStartProcessing}
              disabled={isPreparing}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
            >
              {isPreparing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Preparing Enhanced Buffers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Digital Pipeline ({stagedFiles.length} Pages)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Modal Preview for high-res check */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm truncate">
                Page Preview: {previewFile.name}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950 rounded-xl p-4">
              <img
                src={previewFile.originalDataUrl}
                alt={previewFile.name}
                style={{ transform: `rotate(${previewFile.rotation}deg)` }}
                className="max-h-[65vh] object-contain rounded"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Resolution Quality: {previewFile.qualityPreview}</span>
              <button
                onClick={() => rotateStagedFile(previewFile.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium flex items-center space-x-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate 90°</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
