"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store";
import { DEFAULT_COLOR_CORRECTION, EXPORT_PRESETS } from "@/lib/utils";
import type { EffectType, AITaskType, MotionBrushStroke, ExportPlatform } from "@/types";
import { v4 as uuid } from "uuid";

const PANEL_TABS = [
  { key: "properties" as const, label: "Props" },
  { key: "effects" as const, label: "FX" },
  { key: "ai-tools" as const, label: "AI" },
  { key: "assets" as const, label: "Assets" },
  { key: "export" as const, label: "Export" },
  { key: "color" as const, label: "Color" },
];

const EFFECTS: { type: EffectType; label: string }[] = [
  { type: "blur", label: "Blur" }, { type: "sharpen", label: "Sharpen" },
  { type: "noise", label: "Noise" }, { type: "vignette", label: "Vignette" },
  { type: "chromatic-aberration", label: "Chromatic" }, { type: "glitch", label: "Glitch" },
  { type: "film-grain", label: "Film Grain" }, { type: "letterbox", label: "Letterbox" },
  { type: "speed-ramp", label: "Speed Ramp" }, { type: "reverse", label: "Reverse" },
  { type: "freeze-frame", label: "Freeze" }, { type: "green-screen", label: "Green Screen" },
  { type: "style-transfer", label: "Style Transfer" }, { type: "motion-brush", label: "Motion Brush" },
];

const AI_TASKS: { type: AITaskType; label: string; desc: string }[] = [
  { type: "generate-video", label: "Generate Video", desc: "Create video clips from text" },
  { type: "inpaint", label: "AI Inpaint", desc: "Remove or replace objects" },
  { type: "green-screen", label: "BG Removal", desc: "AI background removal" },
  { type: "style-transfer", label: "Style Transfer", desc: "Apply artistic styles" },
  { type: "auto-edit", label: "Auto Edit", desc: "AI-powered automatic cuts" },
  { type: "motion-brush", label: "Motion Brush", desc: "Paint motion onto objects" },
  { type: "audio-beat-sync", label: "Beat Sync", desc: "Sync cuts to music beats" },
  { type: "text-to-speech", label: "TTS", desc: "Generate voiceover" },
  { type: "scene-detection", label: "Scene Detect", desc: "Auto-detect scene changes" },
  { type: "object-tracking", label: "Track Objects", desc: "Follow objects in video" },
];

export default function SidePanel() {
  const activePanel = useEditorStore((s) => s.activePanel);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const project = useEditorStore((s) => s.project);
  const selectedClipIds = useEditorStore((s) => s.selectedClipIds);
  const getSelectedClips = useEditorStore((s) => s.getSelectedClips);
  const updateClip = useEditorStore((s) => s.updateClip);
  const addEffect = useEditorStore((s) => s.addEffect);
  const removeEffect = useEditorStore((s) => s.removeEffect);
  const setColorCorrection = useEditorStore((s) => s.setColorCorrection);
  const addAITask = useEditorStore((s) => s.addAITask);
  const aiTasks = useEditorStore((s) => s.aiTasks);
  const assets = useEditorStore((s) => s.assets);

  const selectedClips = getSelectedClips();
  const clip = selectedClips.length === 1 ? selectedClips[0] : null;

  return (
    <div className="w-72 flex flex-col border-l border-cf-border bg-cf-surface flex-shrink-0">
      <div className="flex items-center gap-0.5 p-1 border-b border-cf-border bg-cf-surface-2 overflow-x-auto no-scrollbar">
        {PANEL_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActivePanel(t.key)}
            className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition ${
              activePanel === t.key ? "bg-cf-accent text-white" : "text-cf-text-muted hover:text-cf-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Properties */}
        {activePanel === "properties" && (
          <>
            {!clip ? (
              <p className="text-xs text-cf-text-dim text-center py-8">Select a clip to edit properties</p>
            ) : (
              <>
                <div>
                  <label className="cf-label">Name</label>
                  <input type="text" value={clip.name} onChange={(e) => updateClip(clip.id, { name: e.target.value })} className="cf-input" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="cf-label">Opacity</label><input type="range" min={0} max={1} step={0.05} value={clip.opacity} onChange={(e) => updateClip(clip.id, { opacity: parseFloat(e.target.value) })} className="cf-slider w-full" /></div>
                  <div><label className="cf-label">Volume</label><input type="range" min={0} max={2} step={0.05} value={clip.volume} onChange={(e) => updateClip(clip.id, { volume: parseFloat(e.target.value) })} className="cf-slider w-full" /></div>
                </div>
                <div>
                  <label className="cf-label">Speed</label>
                  <div className="flex gap-1">
                    {[0.25, 0.5, 1, 1.5, 2, 4].map((s) => (
                      <button key={s} onClick={() => updateClip(clip.id, { speed: s })} className={`flex-1 py-1 rounded text-[10px] ${clip.speed === s ? "bg-cf-accent text-white" : "bg-cf-surface-2 text-cf-text-muted"}`}>{s}x</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="cf-label">Blend Mode</label>
                  <select value={clip.blendMode} onChange={(e) => updateClip(clip.id, { blendMode: e.target.value as any })} className="cf-select">
                    {["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="cf-label">Transform</label>
                  <div className="grid grid-cols-2 gap-1">
                    <div><span className="text-[9px] text-cf-text-dim">X</span><input type="number" value={clip.transform.x} onChange={(e) => updateClip(clip.id, { transform: { ...clip.transform, x: parseFloat(e.target.value) || 0 } })} className="cf-input text-[10px]" /></div>
                    <div><span className="text-[9px] text-cf-text-dim">Y</span><input type="number" value={clip.transform.y} onChange={(e) => updateClip(clip.id, { transform: { ...clip.transform, y: parseFloat(e.target.value) || 0 } })} className="cf-input text-[10px]" /></div>
                    <div><span className="text-[9px] text-cf-text-dim">ScaleX</span><input type="number" value={clip.transform.scaleX} onChange={(e) => updateClip(clip.id, { transform: { ...clip.transform, scaleX: parseFloat(e.target.value) || 1 } })} className="cf-input text-[10px]" step={0.1} /></div>
                    <div><span className="text-[9px] text-cf-text-dim">Rot</span><input type="number" value={clip.transform.rotation} onChange={(e) => updateClip(clip.id, { transform: { ...clip.transform, rotation: parseFloat(e.target.value) || 0 } })} className="cf-input text-[10px]" /></div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Effects */}
        {activePanel === "effects" && (
          <>
            {clip && clip.effects.length > 0 && (
              <div>
                <label className="cf-label">Applied Effects</label>
                {clip.effects.map((eff) => (
                  <div key={eff.id} className="flex items-center justify-between py-1 px-2 rounded bg-cf-surface-2 mb-1">
                    <span className="text-xs text-cf-text">{eff.name}</span>
                    <button onClick={() => removeEffect(clip.id, eff.id)} className="text-cf-text-dim hover:text-cf-danger text-xs">x</button>
                  </div>
                ))}
              </div>
            )}
            <div>
              <label className="cf-label">Add Effect</label>
              <div className="grid grid-cols-2 gap-1">
                {EFFECTS.map((eff) => (
                  <button
                    key={eff.type}
                    onClick={() => clip && addEffect(clip.id, { type: eff.type, name: eff.label })}
                    disabled={!clip}
                    className="text-left p-2 rounded bg-cf-surface-2 hover:bg-cf-surface-3 text-[10px] text-cf-text-muted hover:text-cf-text transition disabled:opacity-30"
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* AI Tools */}
        {activePanel === "ai-tools" && (
          <div className="space-y-2">
            <label className="cf-label">AI Tools</label>
            {AI_TASKS.map((task) => (
              <button
                key={task.type}
                onClick={() => {
                  addAITask({
                    id: uuid(), type: task.type, status: "pending", progress: 0,
                    result: null, error: null, created_at: new Date().toISOString(), completed_at: null,
                  });
                }}
                className="w-full text-left p-2.5 rounded-lg bg-cf-surface-2 hover:bg-cf-surface-3 border border-cf-border transition"
              >
                <div className="text-xs font-medium text-cf-text">{task.label}</div>
                <div className="text-[10px] text-cf-text-dim">{task.desc}</div>
              </button>
            ))}
            {aiTasks.length > 0 && (
              <div>
                <label className="cf-label">Active Tasks</label>
                {aiTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-1 text-[10px]">
                    <span className="text-cf-text-muted">{t.type}</span>
                    <span className={t.status === "completed" ? "text-cf-success" : t.status === "failed" ? "text-cf-danger" : "text-cf-accent"}>{t.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assets */}
        {activePanel === "assets" && (
          <div>
            <label className="cf-label">Project Assets ({assets.length})</label>
            {assets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-cf-text-dim mb-2">No assets imported</p>
                <button className="cf-btn-primary text-xs">Import Media</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {assets.map((a) => (
                  <div key={a.id} className="rounded-lg bg-cf-surface-2 border border-cf-border p-1.5">
                    <div className="aspect-video bg-cf-surface-3 rounded flex items-center justify-center text-[9px] text-cf-text-dim">{a.type}</div>
                    <div className="text-[10px] text-cf-text truncate mt-1">{a.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Export */}
        {activePanel === "export" && (
          <div className="space-y-3">
            <label className="cf-label">Export Presets</label>
            <div className="space-y-1.5">
              {EXPORT_PRESETS.map((preset) => (
                <div key={preset.id} className="p-2.5 rounded-lg bg-cf-surface-2 border border-cf-border hover:border-cf-accent/30 cursor-pointer transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-cf-text">{preset.name}</span>
                    <span className="text-[9px] text-cf-text-dim">{preset.format}</span>
                  </div>
                  <div className="text-[10px] text-cf-text-dim mt-0.5">
                    {preset.width}x{preset.height} | {preset.fps}fps
                    {preset.maxDuration && ` | Max ${preset.maxDuration}s`}
                  </div>
                </div>
              ))}
            </div>
            <button className="cf-btn-primary w-full text-xs">Export Video</button>
          </div>
        )}

        {/* Color */}
        {activePanel === "color" && (
          <>
            {!clip ? (
              <p className="text-xs text-cf-text-dim text-center py-8">Select a clip to color correct</p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="cf-label mb-0">Color Correction</label>
                  <button onClick={() => setColorCorrection(clip.id, { ...DEFAULT_COLOR_CORRECTION })} className="text-[9px] text-cf-text-dim hover:text-cf-text">Reset</button>
                </div>
                {Object.entries(clip.colorCorrection || DEFAULT_COLOR_CORRECTION).filter(([k]) => k !== "lut").map(([key, val]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-cf-text-muted capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                      <span className="text-[9px] text-cf-text-dim">{typeof val === "number" ? val : 0}</span>
                    </div>
                    <input
                      type="range"
                      min={key === "hueShift" ? -180 : -100}
                      max={key === "hueShift" ? 180 : 100}
                      value={typeof val === "number" ? val : 0}
                      onChange={(e) => setColorCorrection(clip.id, { ...(clip.colorCorrection || DEFAULT_COLOR_CORRECTION), [key]: parseFloat(e.target.value) })}
                      className="cf-slider w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
