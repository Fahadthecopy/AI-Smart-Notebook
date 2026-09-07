import React, { useState } from "react";
import {
  FolderKanban,
  PlusCircle,
  Copy,
  Trash2,
  Edit2,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Check,
  Download
} from "lucide-react";
import { Project, SubjectType, NotebookStyleTemplate } from "../types";

interface ProjectsViewProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  onCreateProject: (newProject: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (project: Project) => void;
  onRenameProject: (projectId: string, newTitle: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onRenameProject,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [isCreatingModal, setIsCreatingModal] = useState(false);

  // New Project Form
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState<SubjectType>("Computer Science");
  const [newStyle, setNewStyle] = useState<NotebookStyleTemplate>("Coding Notebook");

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const startRename = (p: Project) => {
    setEditingId(p.id);
    setEditTitleText(p.title);
  };

  const saveRename = (id: string) => {
    if (editTitleText.trim()) {
      onRenameProject(id, editTitleText.trim());
    }
    setEditingId(null);
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      title: newTitle.trim(),
      description: "Clean digital notebook transcriber workspace.",
      subject: newSubject,
      styleTemplate: newStyle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [],
      chapters: [],
      quizzes: [],
      memory: {
        topicsStudied: [],
        weakAreas: [],
        strongAreas: [],
        completedChapters: [],
        overallUnderstandingScore: 80,
        preferredLanguage: "English",
        totalQuizzesTaken: 0,
        averageQuizScore: 0,
        notesRevisedCount: 0,
      },
    };

    onCreateProject(newProj);
    setIsCreatingModal(false);
    setNewTitle("");
  };

  const exportProjectJson = (p: Project) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(p, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `${p.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_backup.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            <span>Notebook Projects Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize lectures, courses, and research notebooks separately.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter notebooks..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setIsCreatingModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => {
          const isActive = proj.id === activeProject.id;
          return (
            <div
              key={proj.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition-all ${
                isActive
                  ? "border-indigo-500 ring-2 ring-indigo-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-md">
                    {proj.subject}
                  </span>
                  {isActive && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                      Active
                    </span>
                  )}
                </div>

                {editingId === proj.id ? (
                  <div className="flex items-center space-x-1.5 mb-2">
                    <input
                      type="text"
                      value={editTitleText}
                      onChange={(e) => setEditTitleText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveRename(proj.id)}
                      className="flex-1 text-sm font-bold p-1 bg-slate-50 border border-slate-300 rounded"
                    />
                    <button
                      onClick={() => saveRename(proj.id)}
                      className="p-1 bg-indigo-600 text-white rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
                    {proj.title}
                  </h3>
                )}

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {proj.description || "No description provided."}
                </p>

                <div className="flex items-center space-x-3 text-xs text-slate-400 mb-4 font-medium">
                  <span>{proj.pages.length} Pages</span>
                  <span>•</span>
                  <span>{proj.chapters.length} Chapters</span>
                  <span>•</span>
                  <span>{proj.styleTemplate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectProject(proj)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-700 cursor-default"
                      : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {isActive ? "Currently Open" : "Open Notebook"}
                </button>

                <div className="flex items-center space-x-1 text-slate-400">
                  <button
                    onClick={() => startRename(proj)}
                    title="Rename"
                    className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDuplicateProject(proj)}
                    title="Duplicate Project"
                    className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => exportProjectJson(proj)}
                    title="Export JSON Backup"
                    className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      title="Delete Project"
                      className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Project Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              Create New Notebook Project
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Notebook Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic Chemistry II: Reaction Mechanisms"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Academic Subject:
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as SubjectType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Coding / Programming">Coding / Programming</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Engineering">Engineering</option>
                  <option value="History">History</option>
                  <option value="English">English</option>
                  <option value="General Notes">General Notes</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Layout & Design Style:
                </label>
                <select
                  value={newStyle}
                  onChange={(e) =>
                    setNewStyle(e.target.value as NotebookStyleTemplate)
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Student Notes">Student Notes</option>
                  <option value="University Notes">University Notes</option>
                  <option value="Coding Notebook">Coding Notebook</option>
                  <option value="Science Notebook">Science Notebook</option>
                  <option value="Mathematics Notebook">Mathematics Notebook</option>
                  <option value="Engineering Notebook">Engineering Notebook</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                  <option value="Premium Digital Notebook">Premium Digital Notebook</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsCreatingModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
