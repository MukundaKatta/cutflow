import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type {
  Project,
  Timeline,
  Track,
  Clip,
  Effect,
  Transition,
  TextOverlay,
  ColorCorrection,
  TimelineMarker,
  Asset,
  ToolMode,
  AITask,
  MediaType,
  MotionBrushStroke,
  BeatMarker,
} from "@/types";
import { DEFAULT_COLOR_CORRECTION, DEFAULT_TRANSFORM } from "./utils";

interface EditorState {
  project: Project | null;
  assets: Asset[];
  selectedClipIds: string[];
  selectedTrackId: string | null;
  currentTime: number;
  isPlaying: boolean;
  zoom: number;
  scrollX: number;
  toolMode: ToolMode;
  snapEnabled: boolean;
  rippleEnabled: boolean;
  showWaveforms: boolean;
  showThumbnails: boolean;
  aiTasks: AITask[];
  motionBrushStrokes: MotionBrushStroke[];
  beatMarkers: BeatMarker[];
  undoStack: Timeline[];
  redoStack: Timeline[];
  activePanel: "properties" | "effects" | "ai-tools" | "assets" | "export" | "color";
  previewScale: number;
  volume: number;

  setProject: (project: Project) => void;
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;

  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayback: () => void;
  setZoom: (zoom: number) => void;
  setScrollX: (scrollX: number) => void;
  setToolMode: (mode: ToolMode) => void;
  setSnapEnabled: (enabled: boolean) => void;
  setRippleEnabled: (enabled: boolean) => void;
  setShowWaveforms: (show: boolean) => void;
  setShowThumbnails: (show: boolean) => void;
  setActivePanel: (panel: EditorState["activePanel"]) => void;
  setPreviewScale: (scale: number) => void;
  setVolume: (vol: number) => void;

  addTrack: (type: MediaType, name?: string) => void;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  reorderTrack: (trackId: string, newIndex: number) => void;
  setSelectedTrackId: (id: string | null) => void;

  addClip: (trackId: string, clip: Partial<Clip>) => void;
  removeClip: (clipId: string) => void;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  moveClip: (clipId: string, trackId: string, startTime: number) => void;
  splitClip: (clipId: string, time: number) => void;
  duplicateClip: (clipId: string) => void;
  selectClip: (clipId: string, multi?: boolean) => void;
  deselectAll: () => void;
  getSelectedClips: () => Clip[];

  addEffect: (clipId: string, effect: Partial<Effect>) => void;
  removeEffect: (clipId: string, effectId: string) => void;
  updateEffect: (clipId: string, effectId: string, params: Record<string, number | string | boolean>) => void;

  addTransition: (clipId: string, transition: Partial<Transition>) => void;
  removeTransition: (clipId: string, transitionId: string) => void;

  setTextOverlay: (clipId: string, overlay: TextOverlay | null) => void;
  setColorCorrection: (clipId: string, correction: ColorCorrection | null) => void;

  addMarker: (marker: Partial<TimelineMarker>) => void;
  removeMarker: (markerId: string) => void;
  updateMarker: (markerId: string, updates: Partial<TimelineMarker>) => void;

  addAITask: (task: AITask) => void;
  updateAITask: (taskId: string, updates: Partial<AITask>) => void;
  removeAITask: (taskId: string) => void;

  addMotionBrushStroke: (stroke: MotionBrushStroke) => void;
  clearMotionBrushStrokes: () => void;

  setBeatMarkers: (markers: BeatMarker[]) => void;

  undo: () => void;
  redo: () => void;
  pushUndo: () => void;

  recalculateDuration: () => void;
}

function findClipInTimeline(
  timeline: Timeline,
  clipId: string
): { clip: Clip; track: Track; trackIndex: number; clipIndex: number } | null {
  for (let ti = 0; ti < timeline.tracks.length; ti++) {
    const track = timeline.tracks[ti];
    for (let ci = 0; ci < track.clips.length; ci++) {
      if (track.clips[ci].id === clipId) {
        return { clip: track.clips[ci], track, trackIndex: ti, clipIndex: ci };
      }
    }
  }
  return null;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  assets: [],
  selectedClipIds: [],
  selectedTrackId: null,
  currentTime: 0,
  isPlaying: false,
  zoom: 1,
  scrollX: 0,
  toolMode: "select",
  snapEnabled: true,
  rippleEnabled: false,
  showWaveforms: true,
  showThumbnails: true,
  aiTasks: [],
  motionBrushStrokes: [],
  beatMarkers: [],
  undoStack: [],
  redoStack: [],
  activePanel: "properties",
  previewScale: 1,
  volume: 1,

  setProject: (project) => set({ project }),
  setAssets: (assets) => set({ assets }),
  addAsset: (asset) => set((s) => ({ assets: [...s.assets, asset] })),
  removeAsset: (id) => set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),

  setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlayback: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  setScrollX: (scrollX) => set({ scrollX: Math.max(0, scrollX) }),
  setToolMode: (mode) => set({ toolMode: mode }),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  setRippleEnabled: (enabled) => set({ rippleEnabled: enabled }),
  setShowWaveforms: (show) => set({ showWaveforms: show }),
  setShowThumbnails: (show) => set({ showThumbnails: show }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setPreviewScale: (scale) => set({ previewScale: scale }),
  setVolume: (vol) => set({ volume: Math.max(0, Math.min(1, vol)) }),

  addTrack: (type, name) => {
    const state = get();
    if (!state.project) return;
    const trackNames = { video: "Video", audio: "Audio", image: "Image", text: "Text", effect: "Effect" };
    const trackCount = state.project.timeline.tracks.filter((t) => t.type === type).length;
    const newTrack: Track = {
      id: uuid(),
      name: name || `${trackNames[type]} ${trackCount + 1}`,
      type,
      clips: [],
      locked: false,
      visible: true,
      muted: false,
      volume: 1,
      height: type === "audio" ? 60 : 80,
    };
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: [...state.project.timeline.tracks, newTrack],
        },
      },
    });
  },

  removeTrack: (trackId) => {
    const state = get();
    if (!state.project) return;
    get().pushUndo();
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.filter((t) => t.id !== trackId),
        },
      },
    });
  },

  updateTrack: (trackId, updates) => {
    const state = get();
    if (!state.project) return;
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) =>
            t.id === trackId ? { ...t, ...updates } : t
          ),
        },
      },
    });
  },

  reorderTrack: (trackId, newIndex) => {
    const state = get();
    if (!state.project) return;
    const tracks = [...state.project.timeline.tracks];
    const oldIndex = tracks.findIndex((t) => t.id === trackId);
    if (oldIndex === -1) return;
    const [track] = tracks.splice(oldIndex, 1);
    tracks.splice(newIndex, 0, track);
    set({
      project: {
        ...state.project,
        timeline: { ...state.project.timeline, tracks },
      },
    });
  },

  setSelectedTrackId: (id) => set({ selectedTrackId: id }),

  addClip: (trackId, clipData) => {
    const state = get();
    if (!state.project) return;
    get().pushUndo();
    const clip: Clip = {
      id: uuid(),
      trackId,
      type: clipData.type || "video",
      name: clipData.name || "Untitled Clip",
      startTime: clipData.startTime || 0,
      endTime: clipData.endTime || 5,
      sourceStart: clipData.sourceStart || 0,
      sourceEnd: clipData.sourceEnd || 5,
      asset_id: clipData.asset_id || null,
      thumbnail_url: clipData.thumbnail_url || null,
      effects: clipData.effects || [],
      transitions: clipData.transitions || [],
      opacity: clipData.opacity ?? 1,
      volume: clipData.volume ?? 1,
      speed: clipData.speed ?? 1,
      blendMode: clipData.blendMode || "normal",
      transform: clipData.transform || { ...DEFAULT_TRANSFORM },
      textOverlay: clipData.textOverlay || null,
      colorCorrection: clipData.colorCorrection || null,
    };
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) =>
            t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
          ),
        },
      },
    });
    get().recalculateDuration();
  },

  removeClip: (clipId) => {
    const state = get();
    if (!state.project) return;
    get().pushUndo();
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) => ({
            ...t,
            clips: t.clips.filter((c) => c.id !== clipId),
          })),
        },
      },
      selectedClipIds: state.selectedClipIds.filter((id) => id !== clipId),
    });
    get().recalculateDuration();
  },

  updateClip: (clipId, updates) => {
    const state = get();
    if (!state.project) return;
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) => ({
            ...t,
            clips: t.clips.map((c) => (c.id === clipId ? { ...c, ...updates } : c)),
          })),
        },
      },
    });
  },

  moveClip: (clipId, trackId, startTime) => {
    const state = get();
    if (!state.project) return;
    get().pushUndo();
    const found = findClipInTimeline(state.project.timeline, clipId);
    if (!found) return;
    const duration = found.clip.endTime - found.clip.startTime;
    const movedClip = {
      ...found.clip,
      trackId,
      startTime,
      endTime: startTime + duration,
    };
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) => {
            let clips = t.clips.filter((c) => c.id !== clipId);
            if (t.id === trackId) {
              clips = [...clips, movedClip];
            }
            return { ...t, clips };
          }),
        },
      },
    });
    get().recalculateDuration();
  },

  splitClip: (clipId, time) => {
    const state = get();
    if (!state.project) return;
    const found = findClipInTimeline(state.project.timeline, clipId);
    if (!found) return;
    if (time <= found.clip.startTime || time >= found.clip.endTime) return;
    get().pushUndo();
    const sourceOffset = time - found.clip.startTime;
    const clip1: Clip = {
      ...found.clip,
      endTime: time,
      sourceEnd: found.clip.sourceStart + sourceOffset,
    };
    const clip2: Clip = {
      ...found.clip,
      id: uuid(),
      startTime: time,
      sourceStart: found.clip.sourceStart + sourceOffset,
      transitions: [],
    };
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) =>
            t.id === found.track.id
              ? {
                  ...t,
                  clips: t.clips.flatMap((c) => (c.id === clipId ? [clip1, clip2] : [c])),
                }
              : t
          ),
        },
      },
    });
  },

  duplicateClip: (clipId) => {
    const state = get();
    if (!state.project) return;
    const found = findClipInTimeline(state.project.timeline, clipId);
    if (!found) return;
    get().pushUndo();
    const duration = found.clip.endTime - found.clip.startTime;
    const newClip: Clip = {
      ...found.clip,
      id: uuid(),
      startTime: found.clip.endTime,
      endTime: found.clip.endTime + duration,
      name: `${found.clip.name} (copy)`,
    };
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) =>
            t.id === found.track.id ? { ...t, clips: [...t.clips, newClip] } : t
          ),
        },
      },
    });
    get().recalculateDuration();
  },

  selectClip: (clipId, multi) => {
    set((s) => ({
      selectedClipIds: multi
        ? s.selectedClipIds.includes(clipId)
          ? s.selectedClipIds.filter((id) => id !== clipId)
          : [...s.selectedClipIds, clipId]
        : [clipId],
    }));
  },

  deselectAll: () => set({ selectedClipIds: [] }),

  getSelectedClips: () => {
    const state = get();
    if (!state.project) return [];
    const clips: Clip[] = [];
    for (const track of state.project.timeline.tracks) {
      for (const clip of track.clips) {
        if (state.selectedClipIds.includes(clip.id)) {
          clips.push(clip);
        }
      }
    }
    return clips;
  },

  addEffect: (clipId, effectData) => {
    const state = get();
    if (!state.project) return;
    get().pushUndo();
    const effect: Effect = {
      id: uuid(),
      type: effectData.type || "blur",
      name: effectData.name || "Effect",
      enabled: effectData.enabled ?? true,
      parameters: effectData.parameters || {},
    };
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) => ({
            ...t,
            clips: t.clips.map((c) =>
              c.id === clipId ? { ...c, effects: [...c.effects, effect] } : c
            ),
          })),
        },
      },
    });
  },

  removeEffect: (clipId, effectId) => {
    const state = get();
    if (!state.project) return;
    get().pushUndo();
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) => ({
            ...t,
            clips: t.clips.map((c) =>
              c.id === clipId
                ? { ...c, effects: c.effects.filter((e) => e.id !== effectId) }
                : c
            ),
          })),
        },
      },
    });
  },

  updateEffect: (clipId, effectId, params) => {
    const state = get();
    if (!state.project) return;
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) => ({
            ...t,
            clips: t.clips.map((c) =>
              c.id === clipId
                ? {
                    ...c,
                    effects: c.effects.map((e) =>
                      e.id === effectId ? { ...e, parameters: { ...e.parameters, ...params } } : e
                    ),
                  }
                : c
            ),
          })),
        },
      },
    });
  },

  addTransition: (clipId, transData) => {
    const state = get();
    if (!state.project) return;
    get().pushUndo();
    const transition: Transition = {
      id: uuid(),
      type: transData.type || "fade",
      duration: transData.duration || 0.5,
      position: transData.position || "in",
      easing: transData.easing || "ease-in-out",
    };
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) => ({
            ...t,
            clips: t.clips.map((c) =>
              c.id === clipId
                ? { ...c, transitions: [...c.transitions, transition] }
                : c
            ),
          })),
        },
      },
    });
  },

  removeTransition: (clipId, transitionId) => {
    const state = get();
    if (!state.project) return;
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          tracks: state.project.timeline.tracks.map((t) => ({
            ...t,
            clips: t.clips.map((c) =>
              c.id === clipId
                ? { ...c, transitions: c.transitions.filter((tr) => tr.id !== transitionId) }
                : c
            ),
          })),
        },
      },
    });
  },

  setTextOverlay: (clipId, overlay) => {
    get().pushUndo();
    get().updateClip(clipId, { textOverlay: overlay });
  },

  setColorCorrection: (clipId, correction) => {
    get().updateClip(clipId, { colorCorrection: correction || { ...DEFAULT_COLOR_CORRECTION } });
  },

  addMarker: (markerData) => {
    const state = get();
    if (!state.project) return;
    const marker: TimelineMarker = {
      id: uuid(),
      time: markerData.time || state.currentTime,
      label: markerData.label || "Marker",
      color: markerData.color || "#7c3aed",
      type: markerData.type || "marker",
    };
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          markers: [...state.project.timeline.markers, marker],
        },
      },
    });
  },

  removeMarker: (markerId) => {
    const state = get();
    if (!state.project) return;
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          markers: state.project.timeline.markers.filter((m) => m.id !== markerId),
        },
      },
    });
  },

  updateMarker: (markerId, updates) => {
    const state = get();
    if (!state.project) return;
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          markers: state.project.timeline.markers.map((m) =>
            m.id === markerId ? { ...m, ...updates } : m
          ),
        },
      },
    });
  },

  addAITask: (task) => set((s) => ({ aiTasks: [...s.aiTasks, task] })),
  updateAITask: (taskId, updates) =>
    set((s) => ({
      aiTasks: s.aiTasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    })),
  removeAITask: (taskId) =>
    set((s) => ({ aiTasks: s.aiTasks.filter((t) => t.id !== taskId) })),

  addMotionBrushStroke: (stroke) =>
    set((s) => ({ motionBrushStrokes: [...s.motionBrushStrokes, stroke] })),
  clearMotionBrushStrokes: () => set({ motionBrushStrokes: [] }),

  setBeatMarkers: (markers) => set({ beatMarkers: markers }),

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0 || !state.project) return;
    const prev = state.undoStack[state.undoStack.length - 1];
    set({
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, state.project.timeline],
      project: { ...state.project, timeline: prev },
    });
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0 || !state.project) return;
    const next = state.redoStack[state.redoStack.length - 1];
    set({
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, state.project.timeline],
      project: { ...state.project, timeline: next },
    });
  },

  pushUndo: () => {
    const state = get();
    if (!state.project) return;
    set({
      undoStack: [...state.undoStack.slice(-49), state.project.timeline],
      redoStack: [],
    });
  },

  recalculateDuration: () => {
    const state = get();
    if (!state.project) return;
    let maxEnd = 0;
    for (const track of state.project.timeline.tracks) {
      for (const clip of track.clips) {
        if (clip.endTime > maxEnd) maxEnd = clip.endTime;
      }
    }
    set({
      project: {
        ...state.project,
        timeline: {
          ...state.project.timeline,
          duration: Math.max(maxEnd + 5, 30),
        },
      },
    });
  },
}));
