"use client";

import { useState, useCallback, useRef } from "react";

interface DragState {
  isDragging: boolean;
  dragType: string | null;
  dragData: unknown;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export function useDragDrop() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    dragData: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const stateRef = useRef(dragState);
  stateRef.current = dragState;

  const startDrag = useCallback(
    (e: React.MouseEvent, type: string, data: unknown) => {
      setDragState({
        isDragging: true,
        dragType: type,
        dragData: data,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });

      const handleMouseMove = (ev: MouseEvent) => {
        setDragState((s) => ({
          ...s,
          currentX: ev.clientX,
          currentY: ev.clientY,
        }));
      };

      const handleMouseUp = () => {
        setDragState((s) => ({
          ...s,
          isDragging: false,
          dragType: null,
          dragData: null,
        }));
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    []
  );

  return {
    ...dragState,
    startDrag,
    deltaX: dragState.currentX - dragState.startX,
    deltaY: dragState.currentY - dragState.startY,
  };
}
