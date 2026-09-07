import React, { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Maximize2,
  Minimize2,
  Download,
  Eraser,
  PenTool,
  Square,
  Circle as CircleIcon,
  Trash2,
  Languages,
  BookOpen
} from "lucide-react";
import { Project, LearningMemory } from "../types";

interface VirtualClassroomProps {
  project: Project;
  onUpdateMemory: (updatedMemory: LearningMemory) => void;
  language: "English" | "Urdu" | "Mixed";
}

export const VirtualClassroom: React.FC<VirtualClassroomProps> = ({
  project,
  onUpdateMemory,
  language,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [reExplainStage, setReExplainStage] = useState(1); // 1 = Normal, 2 = Simple, 3 = Micro-steps, 4 = Analogy, 5 = Visual Diagram
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [boardTheme, setBoardTheme] = useState<"blackboard" | "whiteboard">("blackboard");
  const [activeTool, setActiveTool] = useState<"pen" | "eraser" | "arrow" | "rect">("pen");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [strokeSize, setStrokeSize] = useState(3);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "teacher" | "student"; text: string; time: string; stage?: number }>
  >([]);

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Lesson topics derived from current project
  const lessons = project.pages.map((p, idx) => ({
    id: `lesson_${idx}`,
    title: p.notes.title || p.topic,
    pageNumber: p.pageNumber,
    subject: p.subject,
    summary: p.notes.summary,
    concept: p.notes.importantPoints[0]?.text || "Foundational concepts for this topic.",
    explanations: {
      1: `Welcome! Today we are studying ${p.notes.title}. Specifically: ${
        p.notes.importantPoints[0]?.text || p.notes.summary
      }. Notice how this builds directly on our previous lessons.`,
      2: `Let's make this super simple: Imagine you have a library. ${
        p.notes.definitions[0]?.definition || p.notes.summary
      } In plain words, it's about keeping things organized so searching takes no time at all.`,
      3: `Let's break it down into 3 micro-steps:\n1. Check the current value.\n2. Compare it with your target.\n3. Move left if smaller, right if larger!`,
      4: `Real-World Analogy: Think of a dictionary or an old-fashioned telephone directory. When looking up 'Smith', you never read page 1; you flip right to the middle letter 'M' and divide your search in half!`,
      5: `Visual Demonstration: Look at the whiteboard! I've sketched a binary tree node diagram showing how data splits into two balanced branches.`,
    },
    urduExplanations: {
      1: `آج ہم پڑھ رہے ہیں: ${p.notes.title}۔ بنیادی نکتہ: ${
        p.notes.importantPoints[0]?.text || p.notes.summary
      }`,
      2: `آسان الفاظ میں سمجھیں: جیسے آپ لغت میں لفظ تلاش کرتے ہیں، بالکل اسی طرح معلومات کو دو حصوں میں بانٹ کر تلاش کیا جاتا ہے۔`,
      3: `مائیکرو اسٹیپس:\n١۔ موجودہ قیمت دیکھیں۔\n٢۔ موازنہ کریں۔\n٣۔ مطلوبہ سمت میں آگے بڑھیں۔`,
      4: `روزمرہ مثال: جیسے کتاب کی فہرست میں سیدھا متعلقہ باب پر جایا جاتا ہے۔`,
      5: `وائٹ بورڈ پر دیکھیں: یہ ڈایاگرام دکھاتا ہے کہ معلومات کس طرح شاخوں میں تقسیم ہوتی ہے۔`,
    },
  }));

  const activeLesson = lessons[currentStepIndex] || lessons[0];

  // Initialize teacher greeting
  useEffect(() => {
    if (lessons.length > 0 && chatMessages.length === 0) {
      const initialText =
        language === "Urdu"
          ? activeLesson.urduExplanations[1]
          : activeLesson.explanations[1];

      setChatMessages([
        {
          sender: "teacher",
          text: initialText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          stage: 1,
        },
      ]);
      drawInitialWhiteboardDiagram();
    }
  }, [currentStepIndex, language]);

  // Audio Speech Synthesis
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsVoiceSpeaking(true);
      utterance.onend = () => setIsVoiceSpeaking(false);
      utterance.onerror = () => setIsVoiceSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopVoice = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceSpeaking(false);
  };

  // Student understanding handlers
  const handleUnderstand = () => {
    stopVoice();
    const studentMsg = {
      sender: "student" as const,
      text: "👍 I understand this concept clearly!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update memory: add to strong areas
    const newStrong = Array.from(
      new Set([...project.memory.strongAreas, activeLesson.title])
    );
    const newScore = Math.min(100, project.memory.overallUnderstandingScore + 3);
    onUpdateMemory({
      ...project.memory,
      strongAreas: newStrong,
      overallUnderstandingScore: newScore,
    });

    if (currentStepIndex < lessons.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setReExplainStage(1);

      const teacherNext = {
        sender: "teacher" as const,
        text: `Excellent job! 🎉 Moving to step ${nextIdx + 1}: ${
          lessons[nextIdx].title
        }.\n\n${lessons[nextIdx].explanations[1]}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        stage: 1,
      };

      setChatMessages((prev) => [...prev, studentMsg, teacherNext]);
      speakText(teacherNext.text);
    } else {
      const finishMsg = {
        sender: "teacher" as const,
        text: "Outstanding! You have completed all lessons in this notebook chapter! Would you like to take a practice exam?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, studentMsg, finishMsg]);
      speakText(finishMsg.text);
    }
  };

  const handleDontUnderstand = () => {
    stopVoice();
    const nextStage = Math.min(5, reExplainStage + 1);
    setReExplainStage(nextStage);

    const studentMsg = {
      sender: "student" as const,
      text: "✋ I didn't quite get that. Could you explain it another way?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Log to weak areas
    const newWeak = Array.from(
      new Set([...project.memory.weakAreas, activeLesson.title])
    );
    onUpdateMemory({
      ...project.memory,
      weakAreas: newWeak,
    });

    const explanationMap: Record<number, string> =
      language === "Urdu"
        ? activeLesson.urduExplanations
        : activeLesson.explanations;

    const teacherResponse = {
      sender: "teacher" as const,
      text: explanationMap[nextStage as keyof typeof explanationMap] || explanationMap[1],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      stage: nextStage,
    };

    setChatMessages((prev) => [...prev, studentMsg, teacherResponse]);
    speakText(teacherResponse.text);

    if (nextStage === 5) {
      drawInitialWhiteboardDiagram();
    }
  };

  // Canvas Drawing Logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    isDrawingRef.current = true;
    lastPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentX, currentY);

    if (activeTool === "eraser") {
      ctx.strokeStyle = boardTheme === "blackboard" ? "#0f172a" : "#ffffff";
      ctx.lineWidth = strokeSize * 4;
    } else {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeSize;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPointRef.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = boardTheme === "blackboard" ? "#0f172a" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawInitialWhiteboardDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset board
    ctx.fillStyle = boardTheme === "blackboard" ? "#0f172a" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw educational diagram based on topic
    ctx.font = "bold 14px 'Fira Code', monospace";
    ctx.fillStyle = boardTheme === "blackboard" ? "#38bdf8" : "#0284c7";
    ctx.fillText(`TOPIC: ${activeLesson.title}`, 20, 30);

    // Draw tree or vector illustration
    ctx.strokeStyle = boardTheme === "blackboard" ? "#e2e8f0" : "#334155";
    ctx.lineWidth = 2;

    // Root
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 80, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = boardTheme === "blackboard" ? "#818cf8" : "#4f46e5";
    ctx.fillText("Root", canvas.width / 2 - 16, 85);

    // Branches
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 18, 95);
    ctx.lineTo(canvas.width / 2 - 80, 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + 18, 95);
    ctx.lineTo(canvas.width / 2 + 80, 150);
    ctx.stroke();

    // Children
    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 80, 170, 18, 0, Math.PI * 2);
    ctx.arc(canvas.width / 2 + 80, 170, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = boardTheme === "blackboard" ? "#34d399" : "#059669";
    ctx.fillText("Left < K", canvas.width / 2 - 110, 210);
    ctx.fillText("Right > K", canvas.width / 2 + 50, 210);
  };

  const downloadBoardImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `whiteboard_${activeLesson.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`;
    a.click();
  };

  const stageLabels: Record<number, string> = {
    1: "Stage 1: Normal Academic Lesson",
    2: "Stage 2: Everyday Plain Language",
    3: "Stage 3: Step-by-Step Micro-Steps",
    4: "Stage 4: Real-World Analogy",
    5: "Stage 5: Live Whiteboard Demonstration",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Classroom Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                AI Personal Classroom: {project.title}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                Interactive Tutor
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Lesson {currentStepIndex + 1} of {lessons.length}: {activeLesson.title}
            </p>
          </div>
        </div>

        {/* Voice & Understanding Meter */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              isVoiceSpeaking
                ? stopVoice()
                : speakText(chatMessages[chatMessages.length - 1]?.text || "")
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              isVoiceSpeaking
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {isVoiceSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isVoiceSpeaking ? "Stop Voice" : "Audio Tutor"}</span>
          </button>

          <div className="text-right pl-3 border-l border-slate-200">
            <span className="text-xs font-bold text-slate-900 block">
              Grip: {project.memory.overallUnderstandingScore}%
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">
              Adaptive Memory
            </span>
          </div>
        </div>
      </div>

      {/* Main Classroom Stage: Left Interactive Tutor Chat & Right Live Whiteboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Tutor Chat & Step Controls (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[620px]">
          {/* Chat Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                Tutor Dialogue ({stageLabels[reExplainStage]})
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              {language}
            </span>
          </div>

          {/* Dialogue Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "student" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "student"
                      ? "bg-indigo-600 text-white rounded-tr-xs"
                      : "bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-xs"
                  }`}
                >
                  {msg.stage && msg.stage > 1 && (
                    <span className="block text-[10px] font-bold text-amber-600 uppercase mb-1">
                      {stageLabels[msg.stage]}
                    </span>
                  )}
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.sender === "teacher" ? "AI Teacher" : "You"} • {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Teacher Interactive Prompt Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Understanding Checkpoint:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleUnderstand}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Understand!</span>
              </button>

              <button
                onClick={handleDontUnderstand}
                className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Explain Differently</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
              <span>Re-explain escalates 1 → 5 automatically</span>
              <span className="font-semibold text-slate-600">
                Level {reExplainStage} / 5
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Interactive Whiteboard & Blackboard (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[620px]">
          {/* Whiteboard Toolbar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBoardTheme("blackboard")}
                className={`px-2 py-1 text-xs font-bold rounded ${
                  boardTheme === "blackboard"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                Blackboard
              </button>
              <button
                onClick={() => setBoardTheme("whiteboard")}
                className={`px-2 py-1 text-xs font-bold rounded ${
                  boardTheme === "whiteboard"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                Whiteboard
              </button>
            </div>

            {/* Drawing Tools */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setActiveTool("pen")}
                className={`p-1.5 rounded ${
                  activeTool === "pen"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                }`}
                title="Pen"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTool("eraser")}
                className={`p-1.5 rounded ${
                  activeTool === "eraser"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                }`}
                title="Eraser"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>

              {/* Color chips */}
              {["#ffffff", "#facc15", "#38bdf8", "#4ade80", "#f87171"].map((c) => (
                <button
                  key={c}
                  onClick={() => setStrokeColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-4 h-4 rounded-full border border-slate-400 ${
                    strokeColor === c ? "ring-2 ring-indigo-500 scale-110" : ""
                  }`}
                />
              ))}

              <button
                onClick={clearBoard}
                className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 rounded"
                title="Clear Board"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={downloadBoardImage}
                className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded"
                title="Download Whiteboard Drawing"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive HTML5 Canvas */}
          <div className="flex-1 relative overflow-hidden bg-slate-900 cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={640}
              height={550}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full block"
            />
            <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-white/40 font-mono">
              Live Classroom Canvas • Sketch freely
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
