"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Film,
  Plus,
  Folder,
  Clock,
  Sparkles,
  Trash2,
  MoreVertical,
  Search,
  Grid3X3,
  List,
  Settings,
} from "lucide-react";
import { v4 as uuid } from "uuid";
import type { Project } from "@/types";

const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-1",
    name: "Brand Commercial 2024",
    description: "30-second spot for social media campaign",
    thumbnail_url: null,
    created_at: "2024-09-14T10:30:00Z",
    updated_at: "2024-09-14T15:45:00Z",
    user_id: "demo",
    settings: { width: 1920, height: 1080, fps: 30, background_color: "#000000", aspect_ratio: "16:9" },
    timeline: { duration: 30, tracks: [], markers: [] },
  },
  {
    id: "demo-2",
    name: "YouTube Tutorial Ep.12",
    description: "How to color grade cinematic footage",
    thumbnail_url: null,
    created_at: "2024-09-12T08:00:00Z",
    updated_at: "2024-09-13T22:15:00Z",
    user_id: "demo",
    settings: { width: 1920, height: 1080, fps: 30, background_color: "#000000", aspect_ratio: "16:9" },
    timeline: { duration: 600, tracks: [], markers: [] },
  },
  {
    id: "demo-3",
    name: "TikTok Series — Cooking",
    description: "Quick recipe compilations vertical format",
    thumbnail_url: null,
    created_at: "2024-09-10T14:20:00Z",
    updated_at: "2024-09-11T09:30:00Z",
    user_id: "demo",
    settings: { width: 1080, height: 1920, fps: 30, background_color: "#000000", aspect_ratio: "9:16" },
    timeline: { duration: 60, tracks: [], markers: [] },
  },
];

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function createProject(name: string, width: number, height: number, fps: number) {
    const project: Project = {
      id: uuid(),
      name,
      description: "",
      thumbnail_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "demo",
      settings: {
        width,
        height,
        fps,
        background_color: "#000000",
        aspect_ratio: `${width}:${height}`,
      },
      timeline: {
        duration: 60,
        tracks: [
          { id: uuid(), name: "Video 1", type: "video", clips: [], locked: false, visible: true, muted: false, volume: 1, height: 80 },
          { id: uuid(), name: "Video 2", type: "video", clips: [], locked: false, visible: true, muted: false, volume: 1, height: 80 },
          { id: uuid(), name: "Audio 1", type: "audio", clips: [], locked: false, visible: true, muted: false, volume: 1, height: 60 },
          { id: uuid(), name: "Audio 2", type: "audio", clips: [], locked: false, visible: true, muted: false, volume: 1, height: 60 },
          { id: uuid(), name: "Text", type: "text", clips: [], locked: false, visible: true, muted: false, volume: 1, height: 50 },
        ],
        markers: [],
      },
    };
    setProjects((prev) => [project, ...prev]);
    router.push(`/editor/${project.id}`);
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-cf-bg">
      <header className="border-b border-cf-border bg-cf-surface/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cf-accent to-purple-400 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">CutFlow</h1>
              <p className="text-xs text-cf-text-muted">AI-Powered Video Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="cf-btn-ghost">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cf-accent to-pink-500 flex items-center justify-center text-xs font-bold text-white">
              CF
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="text-cf-text-muted mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="cf-btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cf-text-dim" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cf-input pl-10"
            />
          </div>
          <div className="flex items-center gap-1 bg-cf-surface-2 rounded-md p-0.5 border border-cf-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-cf-surface-3 text-white" : "text-cf-text-muted hover:text-cf-text"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-cf-surface-3 text-white" : "text-cf-text-muted hover:text-cf-text"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="group aspect-video rounded-xl border-2 border-dashed border-cf-border hover:border-cf-accent/50 bg-cf-surface/50 flex flex-col items-center justify-center gap-3 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-cf-surface-2 group-hover:bg-cf-accent/20 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-cf-text-muted group-hover:text-cf-accent" />
              </div>
              <span className="text-sm text-cf-text-muted group-hover:text-cf-text">
                Create New Project
              </span>
            </button>

            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-xl overflow-hidden border border-cf-border hover:border-cf-accent/30 bg-cf-surface transition-all cursor-pointer"
                onClick={() => router.push(`/editor/${project.id}`)}
              >
                <div className="aspect-video bg-gradient-to-br from-cf-surface-2 to-cf-surface-3 flex items-center justify-center">
                  <Film className="w-10 h-10 text-cf-text-dim" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="p-1.5 rounded-md bg-cf-bg/80 hover:bg-cf-danger/20 text-cf-text-muted hover:text-cf-danger transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-white truncate">{project.name}</h3>
                  <p className="text-xs text-cf-text-muted mt-0.5 truncate">{project.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-cf-text-dim">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                    <span>{project.settings.width}x{project.settings.height}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-cf-border hover:border-cf-accent/30 bg-cf-surface cursor-pointer transition-all"
                onClick={() => router.push(`/editor/${project.id}`)}
              >
                <div className="w-20 h-12 rounded bg-gradient-to-br from-cf-surface-2 to-cf-surface-3 flex items-center justify-center flex-shrink-0">
                  <Film className="w-5 h-5 text-cf-text-dim" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-white truncate">{project.name}</h3>
                  <p className="text-xs text-cf-text-muted truncate">{project.description}</p>
                </div>
                <div className="text-xs text-cf-text-dim">{project.settings.width}x{project.settings.height}</div>
                <div className="text-xs text-cf-text-dim">{new Date(project.updated_at).toLocaleDateString()}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(project.id);
                  }}
                  className="cf-btn-icon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreate={createProject}
        />
      )}
    </div>
  );
}

function NewProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, width: number, height: number, fps: number) => void;
}) {
  const [name, setName] = useState("");
  const [preset, setPreset] = useState("1080p");

  const presets: Record<string, { width: number; height: number; fps: number; label: string }> = {
    "4k": { width: 3840, height: 2160, fps: 30, label: "4K UHD (3840x2160)" },
    "1080p": { width: 1920, height: 1080, fps: 30, label: "Full HD (1920x1080)" },
    "720p": { width: 1280, height: 720, fps: 30, label: "HD (1280x720)" },
    "vertical-1080": { width: 1080, height: 1920, fps: 30, label: "Vertical HD (1080x1920)" },
    "square": { width: 1080, height: 1080, fps: 30, label: "Square (1080x1080)" },
    "cinematic": { width: 2560, height: 1080, fps: 24, label: "Cinematic 21:9 (2560x1080)" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-cf-surface border border-cf-border rounded-xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cf-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cf-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">New Project</h2>
              <p className="text-xs text-cf-text-muted">Set up your video project</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="cf-label">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Video"
                className="cf-input"
                autoFocus
              />
            </div>

            <div>
              <label className="cf-label">Resolution Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(presets).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setPreset(key)}
                    className={`text-left p-2.5 rounded-lg border text-sm transition-all ${
                      preset === key
                        ? "border-cf-accent bg-cf-accent/10 text-white"
                        : "border-cf-border bg-cf-surface-2 text-cf-text-muted hover:border-cf-border-hover"
                    }`}
                  >
                    <div className="font-medium text-xs">{p.label}</div>
                    <div className="text-xs text-cf-text-dim mt-0.5">{p.fps}fps</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button onClick={onClose} className="cf-btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={() => {
                const p = presets[preset];
                onCreate(name || "Untitled Project", p.width, p.height, p.fps);
                onClose();
              }}
              className="cf-btn-primary flex-1"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
