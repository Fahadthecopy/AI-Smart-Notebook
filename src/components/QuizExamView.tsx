import React, { useState } from "react";
import {
  HelpCircle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Award,
  RotateCcw,
  Zap,
  Bookmark,
  Layers,
  ArrowRight
} from "lucide-react";
import { Project, QuizQuestion, LearningMemory } from "../types";

interface QuizExamViewProps {
  project: Project;
  onUpdateMemory: (updatedMemory: LearningMemory) => void;
}

type ModeTab = "quiz" | "formula_sheet" | "revision_sheet" | "important_topics";

export const QuizExamView: React.FC<QuizExamViewProps> = ({
  project,
  onUpdateMemory,
}) => {
  const [activeTab, setActiveTab] = useState<ModeTab>("quiz");
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(project.quizzes);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [isGenerating, setIsGenerating] = useState(false);

  // Collect all formulas across all pages
  const allFormulas = project.pages.flatMap((p) => p.notes.formulas);
  // Collect all HIGH importance points
  const highPriorityPoints = project.pages.flatMap((p) =>
    p.notes.importantPoints.filter((ip) => ip.importance === "HIGH")
  );

  const handleSelectOption = (questionId: string, option: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    let correctCount = 0;

    quizzes.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected && selected.toLowerCase() === q.correctAnswer.toLowerCase()) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / quizzes.length) * 100);
    const newTotalQuizzes = project.memory.totalQuizzesTaken + 1;
    const newAverage = Math.round(
      (project.memory.averageQuizScore * project.memory.totalQuizzesTaken + scorePercent) /
        newTotalQuizzes
    );

    onUpdateMemory({
      ...project.memory,
      totalQuizzesTaken: newTotalQuizzes,
      averageQuizScore: newAverage,
      overallUnderstandingScore: Math.round(
        (project.memory.overallUnderstandingScore + scorePercent) / 2
      ),
    });
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  const handleGenerateNewQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: project.title,
          difficulty: selectedDifficulty,
          pageContents: project.pages.map((p) => p.extractedText).join("\n"),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          setQuizzes(data.questions);
          setUserAnswers({});
          setSubmitted(false);
        }
      }
    } catch (err) {
      console.warn("Using local quiz set:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Exam Hub Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {[
            { id: "quiz", label: "Practice Quiz & Exam", icon: HelpCircle },
            { id: "formula_sheet", label: `Formula Sheet (${allFormulas.length})`, icon: Zap },
            { id: "important_topics", label: `Key Points (${highPriorityPoints.length})`, icon: Bookmark },
            { id: "revision_sheet", label: "One-Page Revision Sheet", icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ModeTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Generate quiz button */}
        {activeTab === "quiz" && (
          <div className="flex items-center space-x-2">
            <select
              value={selectedDifficulty}
              onChange={(e) =>
                setSelectedDifficulty(e.target.value as "Easy" | "Medium" | "Hard")
              }
              className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard Exam</option>
            </select>
            <button
              onClick={handleGenerateNewQuiz}
              disabled={isGenerating}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? "Generating..." : "Regenerate Quiz"}</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. QUIZ & EXAM MODE */}
      {activeTab === "quiz" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Exam Preparation Test: {project.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Questions automatically generated from your uploaded notes and formulas.
              </p>
            </div>
            {submitted && (
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                  Score:{" "}
                  {
                    quizzes.filter(
                      (q) =>
                        userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()
                    ).length
                  }{" "}
                  / {quizzes.length}
                </div>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retake</span>
                </button>
              </div>
            )}
          </div>

          {/* Question Cards */}
          <div className="space-y-5">
            {quizzes.map((q, idx) => {
              const selected = userAnswers[q.id];
              const isCorrect =
                submitted && selected?.toLowerCase() === q.correctAnswer.toLowerCase();
              const isWrong =
                submitted && selected && selected.toLowerCase() !== q.correctAnswer.toLowerCase();

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                    submitted
                      ? isCorrect
                        ? "border-emerald-300 bg-emerald-50/20"
                        : "border-rose-300 bg-rose-50/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {q.type.replace("_", " ")}
                      </span>
                    </div>

                    {submitted && (
                      <div className="flex items-center space-x-1 text-xs font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-600 flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center space-x-1">
                            <XCircle className="w-4 h-4" />
                            <span>Incorrect</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selected === opt;
                      const isAnswer = submitted && opt.toLowerCase() === q.correctAnswer.toLowerCase();

                      return (
                        <button
                          key={oIdx}
                          disabled={submitted}
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                            isOptionSelected
                              ? submitted
                                ? isCorrect
                                  ? "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold"
                                  : "bg-rose-100 border-rose-400 text-rose-950 font-bold"
                                : "bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-xs"
                              : isAnswer
                              ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation box after submission */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Explanation: </strong>
                        {q.explanation}
                      </p>
                      {q.commonMistake && isWrong && (
                        <p className="text-rose-700 text-[11px]">
                          <strong>Common Misconception: </strong>
                          {q.commonMistake}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          {!submitted && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                Grade My Exam & Update Memory
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. FORMULA SHEET */}
      {activeTab === "formula_sheet" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Comprehensive Formula Sheet</span>
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated mathematical expressions, complexity bounds, and laws from all pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allFormulas.map((f, i) => (
              <div
                key={f.id || i}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-2xs"
              >
                <div className="font-mono text-sm font-bold text-indigo-900 bg-white p-2.5 rounded-lg border border-slate-200">
                  {f.clean || f.original}
                </div>
                <p className="text-xs text-slate-600">{f.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. KEY IMPORTANT POINTS */}
      {activeTab === "important_topics" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-rose-500" />
              <span>Highest Priority Exam Concepts</span>
            </h2>
            <p className="text-xs text-slate-500">
              High-yield points guaranteed to test core understanding.
            </p>
          </div>

          <div className="space-y-3">
            {highPriorityPoints.map((pt) => (
              <div
                key={pt.id}
                className="p-3.5 bg-rose-50/40 border border-rose-200 rounded-xl flex items-start space-x-3"
              >
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded uppercase shrink-0 mt-0.5">
                  HIGH
                </span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {pt.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ONE-PAGE REVISION SHEET */}
      {activeTab === "revision_sheet" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                One-Page Exam Cram Sheet
              </h2>
              <p className="text-xs text-slate-500">
                Ultra-dense summary designed for rapid 5-minute pre-test revision.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg"
            >
              Print Quick Sheet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            {project.pages.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
              >
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>
                    Page {p.pageNumber}: {p.notes.title || p.topic}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p.subject}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-3">
                  {p.notes.summary || p.extractedText.slice(0, 150)}
                </p>
                {p.notes.importantPoints[0] && (
                  <div className="text-slate-700 bg-white p-2 rounded border border-slate-200 text-[11px] font-medium">
                    • {p.notes.importantPoints[0].text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
