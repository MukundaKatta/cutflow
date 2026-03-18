"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Film,
  Undo2,
  Redo2,
  Save,
  Download,
  Share2,
  Settings,
  ChevronDown,
  Scissors,
  Magnet,
  Copy,
  Trash2,
  SplitSquareHorizontal,
} from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";

export default function EditorHeader() {
  const router = useRouter();
  const project = useEditorStore((s) => s.project);
  const currentTime = useEditorStore((s) => s.currentTime);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const undoStack = useEditorStore((s) => s.undoStack);
  const redoStack = useEditorStore((s) => s.redoStack);
  const snapEnabled = useEditorStore((s) => s.snapEnabled);
  const setSnapEnabled = useEditorStore((s) => s.setSnapEnabled);
  const rippleEnabled = useEditorStore((s) => s.rippleEnabled);
  const setRippleEnabled = useEditorStore((s) => s.setRippleEnabled);
  const selectedClipIds = useEditorStore((s) => s.selectedClipIds);
  const splitClip = useEditorStore((s) => s.splitClip);
  const duplicateClip = useEditorStore((s) => s.duplicateClip);
  const removeClip = useEditorStore((s) => s.removeClip);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const [showEditMenu, setShowEditMenu] = useState(false);

  if (!project) return null;

  return (
    <header className="h-12 flex items-center justify-between px-3 bg-cf-surface border-b border-cf-border flex-shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="cf-btn-icon"
          title="Back to projects"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 ml-1">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cf-accent to-purple-400 flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-white max-w-[200px] truncate">
            {project.name}
          </span>
          <span className="text-xs text-cf-text-dim">
            {project.settings.width}x{project.settings.height} | {project.settings.fps}fps
          </span>
        </div>

        <div className="w-px h-5 bg-cf-border mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="cf-btn-icon"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="cf-btn-icon"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 bg-cf-border mx-1" />

        <div className="relative">
          <button
            onClick={() => setShowEditMenu(!showEditMenu)}
            className="cf-btn-ghost text-xs gap-1"
          >
            Edit
            <ChevronDown className="w-3 h-3" />
          </button>

          {showEditMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowEditMenu(false)} />
              <div className="absolute top-full left-0 mt-1 z-50 cf-context-menu">
                <button
                  className="cf-context-menu-item"
                  onClick={() => {
                    selectedClipIds.forEach((id) => splitClip(id, currentTime));
                    setShowEditMenu(false);
                  }}
                  disabled={selectedClipIds.length === 0}
                >
                  <Scissors className="w-4 h-4" />
                  Split at Playhead
                  <span className="ml-auto text-xs text-cf-text-dim">Ctrl+B</span>
                </button>
                <button
                  className="cf-context-menu-item"
                  onClick={() => {
                    selectedClipIds.forEach((id) => duplicateClip(id));
                    setShowEditMenu(false);
                  }}
                  disabled={selectedClipIds.length === 0}
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                  <span className="ml-auto text-xs text-cf-text-dim">Ctrl+D</span>
                </button>
                <button
                  className="cf-context-menu-item text-cf-danger"
                  onClick={() => {
                    selectedClipIds.forEach((id) => removeClip(id));
                    setShowEditMenu(false);
                  }}
                  disabled={selectedClipIds.length === 0}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                  <span className="ml-auto text-xs text-cf-text-dim">Del</span>
                </button>
                <div className="cf-divider" />
                <button
                  className="cf-context-menu-item"
                  onClick={() => {
                    setSnapEnabled(!snapEnabled);
                    setShowEditMenu(false);
                  }}
                >
                  <Magnet className="w-4 h-4" />
                  Snap to Grid
                  {snapEnabled && <span className="ml-auto text-cf-accent text-xs">ON</span>}
                </button>
                <button
                  className="cf-context-menu-item"
                  onClick={() => {
                    setRippleEnabled(!rippleEnabled);
                    setShowEditMenu(false);
                  }}
                >
                  <SplitSquareHorizontal className="w-4 h-4" />
                  Ripple Edit
                  {rippleEnabled && <span className="ml-auto text-cf-accent text-xs">ON</span>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="font-mono text-sm text-cf-accent tabular-nums bg-cf-surface-2 px-3 py-1 rounded-md border border-cf-border">
          {formatTime(currentTime)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActivePanel("export")}
          className="cf-btn-secondary text-xs gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
        <button className="cf-btn-primary text-xs gap-1.5">
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
      </div>
    </header>
  );
}
