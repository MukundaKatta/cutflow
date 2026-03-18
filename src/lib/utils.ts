import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 30);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
}

export function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 4) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2] + parts[3] / 30;
  }
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 30;
  }
  return 0;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
}

export function pixelsToSeconds(
  pixels: number,
  zoom: number,
  pixelsPerSecond: number = 100
): number {
  return pixels / (pixelsPerSecond * zoom);
}

export function secondsToPixels(
  seconds: number,
  zoom: number,
  pixelsPerSecond: number = 100
): number {
  return seconds * pixelsPerSecond * zoom;
}

export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export const EXPORT_PRESETS = [
  {
    id: "youtube-4k",
    name: "YouTube 4K",
    platform: "youtube" as const,
    width: 3840,
    height: 2160,
    fps: 60,
    bitrate: 45000000,
    codec: "h264",
    format: "mp4",
    maxDuration: null,
    maxFileSize: null,
    icon: "youtube",
  },
  {
    id: "youtube-1080p",
    name: "YouTube 1080p",
    platform: "youtube" as const,
    width: 1920,
    height: 1080,
    fps: 30,
    bitrate: 16000000,
    codec: "h264",
    format: "mp4",
    maxDuration: null,
    maxFileSize: null,
    icon: "youtube",
  },
  {
    id: "tiktok",
    name: "TikTok",
    platform: "tiktok" as const,
    width: 1080,
    height: 1920,
    fps: 30,
    bitrate: 8000000,
    codec: "h264",
    format: "mp4",
    maxDuration: 600,
    maxFileSize: 287700000,
    icon: "tiktok",
  },
  {
    id: "instagram-reels",
    name: "Instagram Reels",
    platform: "instagram-reels" as const,
    width: 1080,
    height: 1920,
    fps: 30,
    bitrate: 8000000,
    codec: "h264",
    format: "mp4",
    maxDuration: 90,
    maxFileSize: 250000000,
    icon: "instagram",
  },
  {
    id: "instagram-post",
    name: "Instagram Post",
    platform: "instagram-post" as const,
    width: 1080,
    height: 1080,
    fps: 30,
    bitrate: 8000000,
    codec: "h264",
    format: "mp4",
    maxDuration: 60,
    maxFileSize: 250000000,
    icon: "instagram",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    platform: "instagram-story" as const,
    width: 1080,
    height: 1920,
    fps: 30,
    bitrate: 8000000,
    codec: "h264",
    format: "mp4",
    maxDuration: 15,
    maxFileSize: 250000000,
    icon: "instagram",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    platform: "twitter" as const,
    width: 1920,
    height: 1080,
    fps: 30,
    bitrate: 12000000,
    codec: "h264",
    format: "mp4",
    maxDuration: 140,
    maxFileSize: 512000000,
    icon: "twitter",
  },
  {
    id: "facebook",
    name: "Facebook",
    platform: "facebook" as const,
    width: 1920,
    height: 1080,
    fps: 30,
    bitrate: 16000000,
    codec: "h264",
    format: "mp4",
    maxDuration: null,
    maxFileSize: 4000000000,
    icon: "facebook",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    platform: "linkedin" as const,
    width: 1920,
    height: 1080,
    fps: 30,
    bitrate: 12000000,
    codec: "h264",
    format: "mp4",
    maxDuration: 600,
    maxFileSize: 5000000000,
    icon: "linkedin",
  },
  {
    id: "twitch",
    name: "Twitch Clip",
    platform: "twitch" as const,
    width: 1920,
    height: 1080,
    fps: 60,
    bitrate: 6000000,
    codec: "h264",
    format: "mp4",
    maxDuration: 60,
    maxFileSize: null,
    icon: "twitch",
  },
  {
    id: "vimeo",
    name: "Vimeo",
    platform: "vimeo" as const,
    width: 1920,
    height: 1080,
    fps: 30,
    bitrate: 20000000,
    codec: "h264",
    format: "mp4",
    maxDuration: null,
    maxFileSize: null,
    icon: "vimeo",
  },
];

export const DEFAULT_COLOR_CORRECTION = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  vibrance: 0,
  hueShift: 0,
  lut: null,
};

export const DEFAULT_TRANSFORM = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  anchorX: 0.5,
  anchorY: 0.5,
};
