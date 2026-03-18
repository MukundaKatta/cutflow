"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";

export default function PreviewPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const project = useEditorStore((s) => s.project);
  const currentTime = useEditorStore((s) => s.currentTime);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const togglePlayback = useEditorStore((s) => s.togglePlayback);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);
  const volume = useEditorStore((s) => s.volume);
  const setVolume = useEditorStore((s) => s.setVolume);
  const previewScale = useEditorStore((s) => s.previewScale);
  const setPreviewScale = useEditorStore((s) => s.setPreviewScale);
  const [isMuted, setIsMuted] = useState(false);

  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !project) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = project.settings;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = project.settings.background_color;
    ctx.fillRect(0, 0, width, height);

    const visibleTracks = project.timeline.tracks
      .filter((t) => t.visible)
      .reverse();

    for (const track of visibleTracks) {
      for (const clip of track.clips) {
        if (currentTime >= clip.startTime && currentTime <= clip.endTime) {
          const progress = (currentTime - clip.startTime) / (clip.endTime - clip.startTime);

          ctx.save();
          ctx.globalAlpha = clip.opacity;

          if (clip.type === "video" || clip.type === "image") {
            const clipColors: Record<string, string> = {
              "Intro Scene": "#1a1a3e",
              "Main Content": "#1e2a3e",
              "B-Roll Montage": "#1a2e1a",
              "Closing Shot": "#2e1a1a",
              "Overlay Graphics": "#1a1a2e",
            };
            ctx.fillStyle = clipColors[clip.name] || "#1a1a2e";
            ctx.fillRect(0, 0, width, height);

            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, "rgba(124, 58, 237, 0.1)");
            gradient.addColorStop(0.5, "rgba(124, 58, 237, 0.05)");
            gradient.addColorStop(1, "rgba(59, 130, 246, 0.1)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
            for (let i = 0; i < 5; i++) {
              const cx = (width * (i + 1)) / 6 + Math.sin(currentTime * 0.5 + i) * 50;
              const cy = height / 2 + Math.cos(currentTime * 0.3 + i * 2) * 100;
              const r = 100 + Math.sin(currentTime + i) * 30;
              ctx.beginPath();
              ctx.arc(cx, cy, r, 0, Math.PI * 2);
              ctx.fill();
            }

            if (clip.colorCorrection) {
              const cc = clip.colorCorrection;
              if (cc.brightness !== 0) {
                ctx.fillStyle = cc.brightness > 0
                  ? `rgba(255, 255, 255, ${Math.abs(cc.brightness) / 200})`
                  : `rgba(0, 0, 0, ${Math.abs(cc.brightness) / 200})`;
                ctx.fillRect(0, 0, width, height);
              }
            }

            for (const transition of clip.transitions) {
              if (transition.position === "in" && currentTime < clip.startTime + transition.duration) {
                const t = (currentTime - clip.startTime) / transition.duration;
                ctx.globalAlpha *= t;
              }
              if (transition.position === "out" && currentTime > clip.endTime - transition.duration) {
                const t = (clip.endTime - currentTime) / transition.duration;
                ctx.globalAlpha *= t;
              }
            }
          }

          if (clip.type === "text" && clip.textOverlay) {
            const txt = clip.textOverlay;
            const tx = width / 2 + clip.transform.x;
            const ty = height / 2 + clip.transform.y;

            ctx.font = `${txt.fontWeight} ${txt.fontSize}px ${txt.fontFamily}`;
            ctx.textAlign = txt.textAlign;
            ctx.textBaseline = "middle";

            let animAlpha = 1;
            let animOffsetY = 0;
            let animScale = 1;
            const animProgress = Math.min(1, (currentTime - clip.startTime) / 0.5);

            switch (txt.animation) {
              case "fade-in-word":
              case "fade-in-letter":
                animAlpha = animProgress;
                break;
              case "slide-up":
                animOffsetY = (1 - animProgress) * 50;
                break;
              case "slide-down":
                animOffsetY = (animProgress - 1) * 50;
                break;
              case "scale-in":
                animScale = 0.5 + animProgress * 0.5;
                animAlpha = animProgress;
                break;
              case "bounce":
                const bounce = Math.abs(Math.sin(animProgress * Math.PI * 3)) * (1 - animProgress) * 30;
                animOffsetY = -bounce;
                break;
              case "typewriter": {
                const charCount = Math.floor(animProgress * txt.content.length);
                const visibleText = txt.content.substring(0, charCount);
                ctx.save();
                ctx.globalAlpha = clip.opacity;

                if (txt.backgroundColor !== "transparent" && txt.backgroundOpacity > 0) {
                  const metrics = ctx.measureText(txt.content);
                  ctx.fillStyle = txt.backgroundColor;
                  ctx.globalAlpha = txt.backgroundOpacity;
                  ctx.fillRect(
                    tx - metrics.width / 2 - 10,
                    ty - txt.fontSize / 2 - 5,
                    metrics.width + 20,
                    txt.fontSize + 10
                  );
                  ctx.globalAlpha = clip.opacity;
                }

                if (txt.shadowBlur > 0) {
                  ctx.shadowColor = txt.shadowColor;
                  ctx.shadowBlur = txt.shadowBlur;
                  ctx.shadowOffsetX = txt.shadowOffsetX;
                  ctx.shadowOffsetY = txt.shadowOffsetY;
                }

                if (txt.strokeWidth > 0 && txt.strokeColor !== "transparent") {
                  ctx.strokeStyle = txt.strokeColor;
                  ctx.lineWidth = txt.strokeWidth;
                  ctx.strokeText(visibleText, tx, ty);
                }

                ctx.fillStyle = txt.color;
                ctx.fillText(visibleText, tx, ty);
                ctx.restore();
                continue;
              }
            }

            ctx.save();
            ctx.globalAlpha = clip.opacity * animAlpha;
            ctx.translate(tx, ty + animOffsetY);
            ctx.scale(animScale, animScale);

            if (txt.backgroundColor !== "transparent" && txt.backgroundOpacity > 0) {
              const metrics = ctx.measureText(txt.content);
              ctx.fillStyle = txt.backgroundColor;
              ctx.globalAlpha = txt.backgroundOpacity;
              ctx.fillRect(
                -metrics.width / 2 - 10,
                -txt.fontSize / 2 - 5,
                metrics.width + 20,
                txt.fontSize + 10
              );
              ctx.globalAlpha = clip.opacity * animAlpha;
            }

            if (txt.shadowBlur > 0) {
              ctx.shadowColor = txt.shadowColor;
              ctx.shadowBlur = txt.shadowBlur;
              ctx.shadowOffsetX = txt.shadowOffsetX;
              ctx.shadowOffsetY = txt.shadowOffsetY;
            }

            if (txt.strokeWidth > 0 && txt.strokeColor !== "transparent") {
              ctx.strokeStyle = txt.strokeColor;
              ctx.lineWidth = txt.strokeWidth;
              ctx.strokeText(txt.content, 0, 0);
            }

            ctx.fillStyle = txt.color;
            ctx.fillText(txt.content, 0, 0);
            ctx.restore();
          }

          ctx.restore();
        }
      }
    }

    const vignGrad = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.3,
      width / 2, height / 2, width * 0.7
    );
    vignGrad.addColorStop(0, "rgba(0,0,0,0)");
    vignGrad.addColorStop(1, "rgba(0,0,0,0.15)");
    ctx.fillStyle = vignGrad;
    ctx.fillRect(0, 0, width, height);
  }, [project, currentTime]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  if (!project) return null;

  const { width, height } = project.settings;

  return (
    <div className="flex-1 flex flex-col bg-cf-bg border-r border-cf-border">
      <div className="cf-panel-header">
        <span>Preview</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPreviewScale(Math.max(0.25, previewScale - 0.25))}
            className="cf-btn-icon"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-cf-text-dim w-10 text-center">
            {Math.round(previewScale * 100)}%
          </span>
          <button
            onClick={() => setPreviewScale(Math.min(2, previewScale + 0.25))}
            className="cf-btn-icon"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewScale(1)}
            className="cf-btn-icon"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-black/20"
      >
        <div
          className="relative bg-black rounded shadow-2xl overflow-hidden"
          style={{
            width: `${Math.min(width * previewScale * 0.4, 960)}px`,
            aspectRatio: `${width}/${height}`,
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ imageRendering: "auto" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-t border-cf-border bg-cf-surface">
        <button
          onClick={() => setCurrentTime(0)}
          className="cf-btn-icon"
          title="Go to Start"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlayback}
          className="w-8 h-8 rounded-full bg-cf-accent hover:bg-cf-accent-hover flex items-center justify-center transition-colors"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>

        <button
          onClick={() =>
            setCurrentTime(Math.min(currentTime + 5, project.timeline.duration))
          }
          className="cf-btn-icon"
          title="Skip Forward"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs font-mono text-cf-text-muted tabular-nums">
            {formatTime(currentTime)}
          </span>
          <span className="text-xs text-cf-text-dim">/</span>
          <span className="text-xs font-mono text-cf-text-dim tabular-nums">
            {formatTime(project.timeline.duration)}
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              setVolume(isMuted ? 1 : 0);
            }}
            className="cf-btn-icon"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (parseFloat(e.target.value) > 0) setIsMuted(false);
            }}
            className="cf-slider w-20"
          />
        </div>
      </div>
    </div>
  );
}
