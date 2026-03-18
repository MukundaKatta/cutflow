"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/lib/store";

export function useKeyboardShortcuts() {
  const store = useEditorStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const mod = e.metaKey || e.ctrlKey;

      if (e.key === " ") {
        e.preventDefault();
        store.togglePlayback();
        return;
      }

      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        store.undo();
        return;
      }

      if (mod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        store.redo();
        return;
      }

      if (mod && e.key === "y") {
        e.preventDefault();
        store.redo();
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const clips = store.selectedClipIds;
        if (clips.length > 0) {
          e.preventDefault();
          clips.forEach((id) => store.removeClip(id));
        }
        return;
      }

      if (e.key === "v" && !mod) {
        store.setToolMode("select");
        return;
      }

      if (e.key === "c" && !mod) {
        store.setToolMode("cut");
        return;
      }

      if (e.key === "t" && !mod) {
        store.setToolMode("text");
        return;
      }

      if (e.key === "b" && !mod) {
        store.setToolMode("motion-brush");
        return;
      }

      if (e.key === "r" && !mod) {
        store.setToolMode("trim");
        return;
      }

      if (e.key === "s" && !mod) {
        store.setToolMode("slip");
        return;
      }

      if (e.key === "n" && !mod) {
        store.setSnapEnabled(!store.snapEnabled);
        return;
      }

      if (mod && e.key === "d") {
        e.preventDefault();
        const clips = store.selectedClipIds;
        if (clips.length > 0) {
          clips.forEach((id) => store.duplicateClip(id));
        }
        return;
      }

      if (mod && e.key === "b") {
        e.preventDefault();
        const clips = store.selectedClipIds;
        if (clips.length > 0) {
          clips.forEach((id) => store.splitClip(id, store.currentTime));
        }
        return;
      }

      if (e.key === "m" && !mod) {
        store.addMarker({ time: store.currentTime });
        return;
      }

      if (e.key === "Escape") {
        store.deselectAll();
        store.setToolMode("select");
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 1 / 30;
        store.setCurrentTime(store.currentTime - step);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 1 / 30;
        store.setCurrentTime(store.currentTime + step);
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        store.setCurrentTime(0);
        return;
      }

      if (e.key === "End" && store.project) {
        e.preventDefault();
        store.setCurrentTime(store.project.timeline.duration);
        return;
      }

      if (e.key === "=" || e.key === "+") {
        store.setZoom(store.zoom * 1.2);
        return;
      }

      if (e.key === "-") {
        store.setZoom(store.zoom / 1.2);
        return;
      }

      if (e.key === "0" && mod) {
        e.preventDefault();
        store.setZoom(1);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [store]);
}
