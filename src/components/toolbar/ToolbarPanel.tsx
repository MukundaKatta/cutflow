"use client";

import { useEditorStore } from "@/lib/store";
import type { ToolMode } from "@/types";

const TOOLS: { mode: ToolMode; label: string; shortcut: string; icon: string }[] = [
  { mode: "select", label: "Select", shortcut: "V", icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" },
  { mode: "cut", label: "Cut", shortcut: "C", icon: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" },
  { mode: "trim", label: "Trim", shortcut: "R", icon: "M4 6h16M4 12h16M4 18h7" },
  { mode: "slip", label: "Slip", shortcut: "S", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  { mode: "text", label: "Text", shortcut: "T", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { mode: "motion-brush", label: "Motion", shortcut: "B", icon: "M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" },
  { mode: "inpaint", label: "Inpaint", shortcut: "I", icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" },
  { mode: "crop", label: "Crop", shortcut: "", icon: "M4 16V4m0 0h12M4 4l7.586 7.586m4.828 4.828L20 20M14 14l6 6" },
];

export default function ToolbarPanel() {
  const toolMode = useEditorStore((s) => s.toolMode);
  const setToolMode = useEditorStore((s) => s.setToolMode);

  return (
    <div className="w-10 flex flex-col items-center py-2 gap-1 bg-cf-surface-2 border-r border-cf-border flex-shrink-0">
      {TOOLS.map((tool) => (
        <button
          key={tool.mode}
          onClick={() => setToolMode(tool.mode)}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors group relative ${
            toolMode === tool.mode
              ? "bg-cf-accent text-white"
              : "text-cf-text-muted hover:text-cf-text hover:bg-cf-surface-3"
          }`}
          title={`${tool.label} (${tool.shortcut})`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
          </svg>

          <div className="cf-tooltip left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap">
            {tool.label}
            {tool.shortcut && <span className="text-cf-text-dim ml-1">({tool.shortcut})</span>}
          </div>
        </button>
      ))}

      <div className="cf-divider w-6 my-1" />

      <button
        onClick={() => useEditorStore.getState().setActivePanel("ai-tools")}
        className="w-8 h-8 rounded-md flex items-center justify-center text-cf-text-muted hover:text-cf-accent hover:bg-cf-surface-3 transition-colors group relative"
        title="AI Tools"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
        <div className="cf-tooltip left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap">AI Tools</div>
      </button>
    </div>
  );
}
