"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useEditorStore } from "@/lib/store";
import { useKeyboardShortcuts } from "@/hooks/useKeyboard";
import { usePlayback } from "@/hooks/usePlayback";
import EditorHeader from "@/components/editor/EditorHeader";
import PreviewPanel from "@/components/editor/PreviewPanel";
import TimelinePanel from "@/components/timeline/TimelinePanel";
import ToolbarPanel from "@/components/toolbar/ToolbarPanel";
import SidePanel from "@/components/panels/SidePanel";
import type { Project } from "@/types";

function createDemoProject(id: string): Project {
  const videoTrack1Id = uuid();
  const videoTrack2Id = uuid();
  const audioTrack1Id = uuid();
  const audioTrack2Id = uuid();
  const textTrackId = uuid();

  return {
    id,
    name: "Demo Project",
    description: "A sample project to explore CutFlow",
    thumbnail_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "demo",
    settings: {
      width: 1920,
      height: 1080,
      fps: 30,
      background_color: "#000000",
      aspect_ratio: "16:9",
    },
    timeline: {
      duration: 60,
      tracks: [
        {
          id: videoTrack1Id,
          name: "Video 1",
          type: "video",
          clips: [
            {
              id: uuid(),
              trackId: videoTrack1Id,
              type: "video",
              name: "Intro Scene",
              startTime: 0,
              endTime: 8,
              sourceStart: 0,
              sourceEnd: 8,
              asset_id: null,
              thumbnail_url: null,
              effects: [],
              transitions: [{ id: uuid(), type: "fade", duration: 0.5, position: "in", easing: "ease-in-out" }],
              opacity: 1,
              volume: 1,
              speed: 1,
              blendMode: "normal",
              transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: null,
              colorCorrection: null,
            },
            {
              id: uuid(),
              trackId: videoTrack1Id,
              type: "video",
              name: "Main Content",
              startTime: 8,
              endTime: 25,
              sourceStart: 0,
              sourceEnd: 17,
              asset_id: null,
              thumbnail_url: null,
              effects: [{ id: uuid(), type: "film-grain", name: "Film Grain", enabled: true, parameters: { intensity: 0.3, size: 1.5 } }],
              transitions: [{ id: uuid(), type: "dissolve", duration: 0.8, position: "in", easing: "ease-in-out" }],
              opacity: 1,
              volume: 1,
              speed: 1,
              blendMode: "normal",
              transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: null,
              colorCorrection: { brightness: 5, contrast: 10, saturation: -5, temperature: 15, tint: 0, highlights: -10, shadows: 5, whites: 0, blacks: -5, vibrance: 10, hueShift: 0, lut: null },
            },
            {
              id: uuid(),
              trackId: videoTrack1Id,
              type: "video",
              name: "B-Roll Montage",
              startTime: 25,
              endTime: 40,
              sourceStart: 0,
              sourceEnd: 15,
              asset_id: null,
              thumbnail_url: null,
              effects: [],
              transitions: [],
              opacity: 1,
              volume: 1,
              speed: 1,
              blendMode: "normal",
              transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: null,
              colorCorrection: null,
            },
            {
              id: uuid(),
              trackId: videoTrack1Id,
              type: "video",
              name: "Closing Shot",
              startTime: 40,
              endTime: 50,
              sourceStart: 0,
              sourceEnd: 10,
              asset_id: null,
              thumbnail_url: null,
              effects: [],
              transitions: [{ id: uuid(), type: "fade", duration: 1, position: "out", easing: "ease-out" }],
              opacity: 1,
              volume: 1,
              speed: 1,
              blendMode: "normal",
              transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: null,
              colorCorrection: null,
            },
          ],
          locked: false,
          visible: true,
          muted: false,
          volume: 1,
          height: 80,
        },
        {
          id: videoTrack2Id,
          name: "Video 2",
          type: "video",
          clips: [
            {
              id: uuid(),
              trackId: videoTrack2Id,
              type: "video",
              name: "Overlay Graphics",
              startTime: 10,
              endTime: 22,
              sourceStart: 0,
              sourceEnd: 12,
              asset_id: null,
              thumbnail_url: null,
              effects: [],
              transitions: [],
              opacity: 0.8,
              volume: 0,
              speed: 1,
              blendMode: "screen",
              transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: null,
              colorCorrection: null,
            },
          ],
          locked: false,
          visible: true,
          muted: false,
          volume: 1,
          height: 80,
        },
        {
          id: textTrackId,
          name: "Text",
          type: "text",
          clips: [
            {
              id: uuid(),
              trackId: textTrackId,
              type: "text",
              name: "Title Card",
              startTime: 1,
              endTime: 7,
              sourceStart: 0,
              sourceEnd: 6,
              asset_id: null,
              thumbnail_url: null,
              effects: [],
              transitions: [],
              opacity: 1,
              volume: 0,
              speed: 1,
              blendMode: "normal",
              transform: { x: 0, y: -100, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: {
                content: "CUTFLOW",
                fontFamily: "Inter",
                fontSize: 72,
                fontWeight: 800,
                color: "#ffffff",
                backgroundColor: "transparent",
                backgroundOpacity: 0,
                textAlign: "center",
                animation: "scale-in",
                strokeColor: "#7c3aed",
                strokeWidth: 2,
                shadowColor: "#000000",
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                letterSpacing: 8,
                lineHeight: 1.2,
              },
              colorCorrection: null,
            },
            {
              id: uuid(),
              trackId: textTrackId,
              type: "text",
              name: "Subtitle",
              startTime: 26,
              endTime: 35,
              sourceStart: 0,
              sourceEnd: 9,
              asset_id: null,
              thumbnail_url: null,
              effects: [],
              transitions: [],
              opacity: 1,
              volume: 0,
              speed: 1,
              blendMode: "normal",
              transform: { x: 0, y: 200, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: {
                content: "AI-Powered Editing",
                fontFamily: "Inter",
                fontSize: 36,
                fontWeight: 500,
                color: "#e8e8f0",
                backgroundColor: "#000000",
                backgroundOpacity: 0.5,
                textAlign: "center",
                animation: "typewriter",
                strokeColor: "transparent",
                strokeWidth: 0,
                shadowColor: "#000000",
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 2,
                letterSpacing: 2,
                lineHeight: 1.4,
              },
              colorCorrection: null,
            },
          ],
          locked: false,
          visible: true,
          muted: false,
          volume: 0,
          height: 50,
        },
        {
          id: audioTrack1Id,
          name: "Audio 1",
          type: "audio",
          clips: [
            {
              id: uuid(),
              trackId: audioTrack1Id,
              type: "audio",
              name: "Background Music",
              startTime: 0,
              endTime: 50,
              sourceStart: 0,
              sourceEnd: 50,
              asset_id: null,
              thumbnail_url: null,
              effects: [],
              transitions: [
                { id: uuid(), type: "fade", duration: 2, position: "in", easing: "ease-in" },
                { id: uuid(), type: "fade", duration: 3, position: "out", easing: "ease-out" },
              ],
              opacity: 1,
              volume: 0.7,
              speed: 1,
              blendMode: "normal",
              transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: null,
              colorCorrection: null,
            },
          ],
          locked: false,
          visible: true,
          muted: false,
          volume: 0.8,
          height: 60,
        },
        {
          id: audioTrack2Id,
          name: "Audio 2",
          type: "audio",
          clips: [
            {
              id: uuid(),
              trackId: audioTrack2Id,
              type: "audio",
              name: "Voiceover",
              startTime: 8,
              endTime: 38,
              sourceStart: 0,
              sourceEnd: 30,
              asset_id: null,
              thumbnail_url: null,
              effects: [],
              transitions: [],
              opacity: 1,
              volume: 1,
              speed: 1,
              blendMode: "normal",
              transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, anchorX: 0.5, anchorY: 0.5 },
              textOverlay: null,
              colorCorrection: null,
            },
          ],
          locked: false,
          visible: true,
          muted: false,
          volume: 1,
          height: 60,
        },
      ],
      markers: [
        { id: uuid(), time: 0, label: "Start", color: "#10b981", type: "marker" },
        { id: uuid(), time: 8, label: "Main Section", color: "#7c3aed", type: "marker" },
        { id: uuid(), time: 25, label: "B-Roll", color: "#f59e0b", type: "marker" },
        { id: uuid(), time: 40, label: "Outro", color: "#ef4444", type: "marker" },
      ],
    },
  };
}

export default function EditorPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const setProject = useEditorStore((s) => s.setProject);
  const project = useEditorStore((s) => s.project);
  const [loading, setLoading] = useState(true);

  useKeyboardShortcuts();
  usePlayback();

  useEffect(() => {
    const stored = localStorage.getItem(`cutflow-project-${projectId}`);
    if (stored) {
      try {
        setProject(JSON.parse(stored));
      } catch {
        setProject(createDemoProject(projectId));
      }
    } else {
      setProject(createDemoProject(projectId));
    }
    setLoading(false);
  }, [projectId, setProject]);

  useEffect(() => {
    if (project) {
      localStorage.setItem(`cutflow-project-${projectId}`, JSON.stringify(project));
    }
  }, [project, projectId]);

  if (loading || !project) {
    return (
      <div className="h-screen flex items-center justify-center bg-cf-bg">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cf-accent to-purple-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-cf-text-muted text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-cf-bg overflow-hidden select-none">
      <EditorHeader />
      <div className="flex-1 flex overflow-hidden">
        <ToolbarPanel />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <PreviewPanel />
            <SidePanel />
          </div>
          <TimelinePanel />
        </div>
      </div>
    </div>
  );
}
