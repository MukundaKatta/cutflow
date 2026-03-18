"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/lib/store";

export function usePlayback() {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentTime = useEditorStore((s) => s.currentTime);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const project = useEditorStore((s) => s.project);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying || !project) return;

    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const newTime = currentTime + delta;
      if (newTime >= project.timeline.duration) {
        setCurrentTime(0);
        setIsPlaying(false);
        return;
      }

      setCurrentTime(newTime);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, project, currentTime, setCurrentTime, setIsPlaying]);

  return { isPlaying, currentTime };
}
