import React from "react";
import {
  BookOpen,
  FolderKanban,
  UploadCloud,
  Cpu,
  Edit3,
  MessageSquareText,
  GraduationCap,
  FileDown,
  Sparkles,
  Search,
  Languages,
  Mic,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { Project } from "../types";

export type NavTab =
  | "dashboard"
  | "projects"
  | "upload"
  | "processing"
  | "notebook"
  | "editor"
  | "ask"
  | "teacher"
  | "quiz"
  | "export";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  projects: Project[];
  activeProject: Project;
  onSelectProject: (proj: Project) => void;
  onNewProject: () => void;
  onOpenSearch: () => void;
  language: "English" | "Urdu" | "Mixed";
  onLanguageChange: (lang: "English" | "Urdu" | "Mixed") => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  projects,
  activeProject,
  onSelectProject,
  onNewProject,
  onOpenSearch,
  language,
  onLanguageChange,
  isVoiceActive,
  onToggleVoice,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BookOpen },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "upload", label: "Upload Work", icon: UploadCloud },
    { id: "processing", label: "AI Pipeline", icon: Cpu },
    { id: "notebook", label: "Notebook", icon: BookOpen },
    { id: "editor", label: "Page Editor", icon: Edit3 },
    { id: "ask", label: "Ask Notebook", icon: MessageSquareText },
    { id: "teacher", label: "AI Teacher", icon: GraduationCap },
    { id: "quiz", label: "Exam & Quiz", icon: HelpCircle },
    { id: "export", label: "PDF Export", icon: FileDown },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand & Project Selector */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onSelectTab("dashboard")}
            className="flex items-center space-x-2 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">
                  AI SMART NOTEBOOK
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Handwriting → Digital Textbook
              </p>
            </div>
          </button>

          {/* Active Project Dropdown */}
          <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-200 space-x-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project:
            </span>
            <select
              value={activeProject.id}
              onChange={(e) => {
                const found = projects.find((p) => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 hover:bg-slate-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.pages.length} pgs)
                </option>
              ))}
            </select>
            <button
              onClick={onNewProject}
              title="Create New Notebook Project"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Global Search & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Search notebook...</span>
            <kbd className="hidden sm:inline-block bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Languages className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) =>
                onLanguageChange(e.target.value as "English" | "Urdu" | "Mixed")
              }
              className="text-xs pl-7 pr-2 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu (اردو)</option>
              <option value="Mixed">English + Urdu</option>
            </select>
          </div>

          {/* Voice Command Button */}
          <button
            onClick={onToggleVoice}
            title={isVoiceActive ? "Voice listening active" : "Enable voice commands"}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isVoiceActive
                ? "bg-rose-500 text-white shadow-md shadow-rose-200 animate-pulse"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isVoiceActive ? "Listening..." : "Voice"}
            </span>
          </button>

          {/* Quick PDF button */}
          <button
            onClick={() => onSelectTab("export")}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-indigo-200 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 border-t border-slate-100 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-indigo-600" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
                {item.id === "upload" && (
                  <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
                    1000+
                  </span>
                )}
                {item.id === "notebook" && (
                  <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full text-[10px]">
                    {activeProject.pages.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
