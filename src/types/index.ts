export type MediaType = "video" | "audio" | "image" | "text" | "effect";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn";

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  settings: ProjectSettings;
  timeline: Timeline;
}

export interface ProjectSettings {
  width: number;
  height: number;
  fps: number;
  background_color: string;
  aspect_ratio: string;
}

export interface Timeline {
  duration: number;
  tracks: Track[];
  markers: TimelineMarker[];
}

export interface Track {
  id: string;
  name: string;
  type: MediaType;
  clips: Clip[];
  locked: boolean;
  visible: boolean;
  muted: boolean;
  volume: number;
  height: number;
}

export interface Clip {
  id: string;
  trackId: string;
  type: MediaType;
  name: string;
  startTime: number;
  endTime: number;
  sourceStart: number;
  sourceEnd: number;
  asset_id: string | null;
  thumbnail_url: string | null;
  effects: Effect[];
  transitions: Transition[];
  opacity: number;
  volume: number;
  speed: number;
  blendMode: BlendMode;
  transform: Transform;
  textOverlay: TextOverlay | null;
  colorCorrection: ColorCorrection | null;
}

export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  anchorX: number;
  anchorY: number;
}

export interface Effect {
  id: string;
  type: EffectType;
  name: string;
  enabled: boolean;
  parameters: Record<string, number | string | boolean>;
}

export type EffectType =
  | "blur"
  | "sharpen"
  | "noise"
  | "vignette"
  | "chromatic-aberration"
  | "glitch"
  | "film-grain"
  | "letterbox"
  | "speed-ramp"
  | "reverse"
  | "freeze-frame"
  | "green-screen"
  | "inpaint"
  | "style-transfer"
  | "motion-brush";

export interface Transition {
  id: string;
  type: TransitionType;
  duration: number;
  position: "in" | "out";
  easing: string;
}

export type TransitionType =
  | "fade"
  | "dissolve"
  | "wipe-left"
  | "wipe-right"
  | "wipe-up"
  | "wipe-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out"
  | "blur-transition"
  | "glitch-transition";

export interface TextOverlay {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  textAlign: "left" | "center" | "right";
  animation: KineticTextAnimation;
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  letterSpacing: number;
  lineHeight: number;
}

export type KineticTextAnimation =
  | "none"
  | "typewriter"
  | "fade-in-word"
  | "fade-in-letter"
  | "slide-up"
  | "slide-down"
  | "bounce"
  | "scale-in"
  | "wave"
  | "glitch"
  | "neon-flicker"
  | "shake"
  | "rotate-in";

export interface ColorCorrection {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  vibrance: number;
  hueShift: number;
  lut: string | null;
}

export interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  color: string;
  type: "marker" | "beat" | "cut-point";
}

export interface Asset {
  id: string;
  project_id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnail_url: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  file_size: number;
  mime_type: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface ExportPreset {
  id: string;
  name: string;
  platform: ExportPlatform;
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  codec: string;
  format: string;
  maxDuration: number | null;
  maxFileSize: number | null;
  icon: string;
}

export type ExportPlatform =
  | "custom"
  | "youtube"
  | "tiktok"
  | "instagram-reels"
  | "instagram-post"
  | "instagram-story"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "twitch"
  | "vimeo";

export interface AITask {
  id: string;
  type: AITaskType;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  result: unknown;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

export type AITaskType =
  | "generate-video"
  | "inpaint"
  | "green-screen"
  | "style-transfer"
  | "auto-edit"
  | "motion-brush"
  | "audio-beat-sync"
  | "text-to-speech"
  | "scene-detection"
  | "object-tracking";

export interface MotionBrushStroke {
  id: string;
  points: { x: number; y: number; pressure: number }[];
  direction: { x: number; y: number };
  magnitude: number;
  frameStart: number;
  frameEnd: number;
}

export interface BeatMarker {
  time: number;
  strength: number;
  type: "downbeat" | "beat" | "offbeat";
}

export type ToolMode =
  | "select"
  | "cut"
  | "trim"
  | "slip"
  | "text"
  | "draw"
  | "motion-brush"
  | "inpaint"
  | "crop"
  | "pan";
