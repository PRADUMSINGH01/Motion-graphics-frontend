"use client";

import React from "react";
import { FiZap, FiArrowUpRight } from "react-icons/fi";
import { StylePreset, InspirationPreset } from "../types";

interface PromptInspectorPanelProps {
  promptText: string;
  setPromptText: (text: string) => void;
  activeStyle: StylePreset;
  setActiveStyle: (style: StylePreset) => void;
  liveText: string;
  setLiveText: (text: string) => void;
  isGenerating: boolean;
  onGenerate: (e?: React.FormEvent) => void;
  inspirationPresets: InspirationPreset[];
  onSelectPreset: (preset: InspirationPreset) => void;
}

export default function PromptInspectorPanel({
  promptText,
  setPromptText,
  activeStyle,
  setActiveStyle,
  liveText,
  setLiveText,
  isGenerating,
  onGenerate,
  inspirationPresets,
  onSelectPreset,
}: PromptInspectorPanelProps) {
  return (
    <div className="w-full max-w-3xl space-y-2.5">
      <form
        onSubmit={onGenerate}
        className="relative flex items-center bg-[#0d0f17] border border-white/[0.14] focus-within:border-cyan-400/80 rounded-2xl shadow-xl p-1.5 transition-all gap-2"
      >
        <div className="pl-2.5 text-cyan-400 shrink-0">
          <FiZap className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Describe the motion graphic you want to generate..."
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none py-1.5 px-1 font-sans"
        />

        {/* Integrated Style Preset Selector */}
        <div className="shrink-0 hidden sm:block">
          <select
            value={activeStyle}
            onChange={(e) => setActiveStyle(e.target.value as StylePreset)}
            className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer"
          >
            <option value="Kinetic Typography" className="bg-[#12141d] text-white">
              Kinetic Typography
            </option>
            <option value="3D Isometric" className="bg-[#12141d] text-white">
              3D Isometric
            </option>
            <option value="Logo Reveal" className="bg-[#12141d] text-white">
              Logo Reveal
            </option>
            <option value="Abstract VFX" className="bg-[#12141d] text-white">
              Abstract VFX
            </option>
            <option value="UI & Lottie" className="bg-[#12141d] text-white">
              UI &amp; Lottie
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold transition-all shadow-sm active:scale-[0.98] shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Rendering...</span>
            </>
          ) : (
            <>
              <span>Generate</span>
              <FiArrowUpRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Single-Row Inspiration Presets & Spacebar Hint */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold shrink-0 mr-1">
            Presets:
          </span>
          {inspirationPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-400/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span>{preset.icon}</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        <span className="text-[10px] font-mono text-slate-500 hidden md:inline shrink-0 pl-2">
          [Space] Play / Pause
        </span>
      </div>
    </div>
  );
}
