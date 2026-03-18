"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useEditorStore } from "@/lib/store";
import { formatTime, secondsToPixels, pixelsToSeconds, getContrastColor } from "@/lib/utils";

const TRACK_COLORS: Record<string, string> = {
  video: "#7c3aed", audio: "#10b981", image: "#3b82f6", text: "#f59e0b", effect: "#ec4899",
};

export default function TimelinePanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const project = useEditorStore((s) => s.project);
  const currentTime = useEditorStore((s) => s.currentTime);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const scrollX = useEditorStore((s) => s.scrollX);
  const setScrollX = useEditorStore((s) => s.setScrollX);
  const selectedClipIds = useEditorStore((s) => s.selectedClipIds);
  const selectClip = useEditorStore((s) => s.selectClip);
  const toolMode = useEditorStore((s) => s.toolMode);
  const splitClip = useEditorStore((s) => s.splitClip);
  const showWaveforms = useEditorStore((s) => s.showWaveforms);
  const showThumbnails = useEditorStore((s) => s.showThumbnails);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  const PPS = 100;

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !project) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollX - 120;
    const time = pixelsToSeconds(x, zoom, PPS);
    setCurrentTime(Math.max(0, Math.min(time, project.timeline.duration)));
  }, [project, scrollX, zoom, setCurrentTime]);

  const handleClipClick = useCallback((e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    if (toolMode === "cut") {
      splitClip(clipId, currentTime);
    } else {
      selectClip(clipId, e.shiftKey);
    }
  }, [toolMode, splitClip, currentTime, selectClip]);

  if (!project) return null;

  const playheadX = secondsToPixels(currentTime, zoom, PPS) + 120 - scrollX;
  const timelineWidth = secondsToPixels(project.timeline.duration, zoom, PPS);

  return (
    <div className="h-[280px] flex flex-col border-t border-cf-border bg-cf-surface flex-shrink-0">
      {/* Ruler */}
      <div className="h-6 flex items-end border-b border-cf-border relative overflow-hidden" onClick={handleTimelineClick}>
        <div className="w-[120px] flex-shrink-0 bg-cf-surface-2" />
        <div className="flex-1 relative" style={{ minWidth: timelineWidth }}>
          {Array.from({ length: Math.ceil(project.timeline.duration) + 1 }).map((_, i) => {
            const x = secondsToPixels(i, zoom, PPS) - scrollX;
            if (x < -50 || x > 2000) return null;
            return (
              <div key={i} className="absolute bottom-0" style={{ left: `${x}px` }}>
                <div className="w-px h-3 bg-cf-border" />
                <span className="text-[9px] text-cf-text-dim absolute -translate-x-1/2 bottom-3">
                  {i < 60 ? `${i}s` : `${Math.floor(i / 60)}:${(i % 60).toString().padStart(2, "0")}`}
                </span>
              </div>
            );
          })}
          {/* Markers */}
          {project.timeline.markers.map((m) => {
            const x = secondsToPixels(m.time, zoom, PPS) - scrollX;
            return (
              <div key={m.id} className="absolute bottom-0" style={{ left: `${x}px` }}>
                <div className="w-2 h-2 -translate-x-1/2" style={{ backgroundColor: m.color, clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracks */}
      <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative" onClick={handleTimelineClick}>
        {project.timeline.tracks.map((track) => (
          <div key={track.id} className="flex border-b border-cf-border" style={{ height: `${track.height}px` }}>
            {/* Track header */}
            <div className="w-[120px] flex-shrink-0 flex items-center gap-2 px-2 bg-cf-surface-2 border-r border-cf-border">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TRACK_COLORS[track.type] || "#888" }} />
              <span className="text-[10px] text-cf-text-muted truncate flex-1">{track.name}</span>
              <div className="flex gap-0.5">
                {track.locked && <span className="text-[9px] text-cf-text-dim">L</span>}
                {track.muted && <span className="text-[9px] text-cf-text-dim">M</span>}
                {!track.visible && <span className="text-[9px] text-cf-text-dim">H</span>}
              </div>
            </div>

            {/* Track clips */}
            <div className="flex-1 relative" style={{ minWidth: timelineWidth }}>
              {track.clips.map((clip) => {
                const clipLeft = secondsToPixels(clip.startTime, zoom, PPS) - scrollX;
                const clipWidth = secondsToPixels(clip.endTime - clip.startTime, zoom, PPS);
                const isSelected = selectedClipIds.includes(clip.id);
                const color = TRACK_COLORS[clip.type] || "#888";

                return (
                  <div
                    key={clip.id}
                    className={`cf-track-clip ${isSelected ? "cf-track-clip-selected" : ""}`}
                    style={{
                      left: `${clipLeft}px`,
                      width: `${Math.max(clipWidth, 4)}px`,
                      backgroundColor: `${color}20`,
                      borderColor: isSelected ? color : "transparent",
                    }}
                    onClick={(e) => handleClipClick(e, clip.id)}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: color }} />

                    <div className="px-1.5 py-0.5 flex items-center justify-between">
                      <span className="text-[9px] text-white/70 truncate">{clip.name}</span>
                      {clip.speed !== 1 && <span className="text-[8px] text-white/30">{clip.speed}x</span>}
                    </div>

                    {clip.type === "audio" && showWaveforms && (
                      <div className="absolute bottom-1 left-1 right-1 h-4 flex items-center gap-px">
                        {Array.from({ length: Math.min(Math.floor(clipWidth / 3), 60) }).map((_, i) => (
                          <div key={i} className="w-px rounded-full bg-white/20" style={{ height: `${20 + Math.sin(i * 0.5) * 60 + Math.random() * 20}%` }} />
                        ))}
                      </div>
                    )}

                    {clip.type === "text" && clip.textOverlay && (
                      <div className="px-1.5 text-[8px] text-white/40 truncate">{clip.textOverlay.content}</div>
                    )}

                    {clip.transitions.map((tr) => (
                      <div
                        key={tr.id}
                        className={`absolute top-0 bottom-0 w-4 bg-white/10 ${tr.position === "in" ? "left-0 rounded-l" : "right-0 rounded-r"}`}
                      />
                    ))}

                    {clip.effects.length > 0 && (
                      <div className="absolute bottom-0.5 right-1 flex gap-0.5">
                        {clip.effects.slice(0, 3).map((eff) => (
                          <div key={eff.id} className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Playhead */}
      <div
        className="absolute top-0 bottom-0 w-px bg-cf-accent z-20 pointer-events-none"
        style={{ left: `${playheadX}px` }}
      >
        <div className="w-3 h-3 -translate-x-1.5 bg-cf-accent" style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
      </div>

      {/* Bottom controls */}
      <div className="h-7 flex items-center justify-between px-3 border-t border-cf-border bg-cf-surface-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-cf-text-dim">Zoom</span>
          <input
            type="range"
            min="0.2"
            max="5"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="cf-slider w-24"
          />
          <span className="text-[10px] text-cf-text-dim w-8">{Math.round(zoom * 100)}%</span>
        </div>
        <span className="text-[10px] text-cf-text-dim">
          {project.timeline.tracks.length} tracks | {project.timeline.tracks.reduce((s, t) => s + t.clips.length, 0)} clips
        </span>
      </div>
    </div>
  );
}
