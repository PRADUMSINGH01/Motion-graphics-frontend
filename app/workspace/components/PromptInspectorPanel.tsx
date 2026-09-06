"use client";

import React, { useState } from "react";
import {
  FiZap,
  FiType,
  FiBox,
  FiDisc,
  FiActivity,
  FiSliders,
  FiX,
  FiArrowUpRight,
  FiClock,
  FiDroplet,
} from "react-icons/fi";
import { StylePreset, ColorPalette, MotionSpeed } from "../types";

interface PromptInspectorPanelProps {
  promptText: string;
  setPromptText: (text: string) => void;
  activeStyle: StylePreset;
  setActiveStyle: (style: StylePreset) => void;
  liveText: string;
  setLiveText: (text: string) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  motionSpeed: MotionSpeed;
  setMotionSpeed: (speed: MotionSpeed) => void;
  isGenerating: boolean;
  onGenerate: (e?: React.FormEvent) => void;
}

const STYLE_PRESETS_CONFIG: Array<{
  id: StylePreset;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "Kinetic Typography", label: "Kinetic Type", icon: FiType },
  { id: "3D Isometric", label: "3D Isometric", icon: FiBox },
  { id: "Logo Reveal", label: "Logo Reveal", icon: FiDisc },
  { id: "Abstract VFX", label: "Abstract VFX", icon: FiActivity },
  { id: "UI & Lottie", label: "UI & Lottie", icon: FiSliders },
];

const PALETTE_OPTIONS: Array<{
  id: ColorPalette;
  name: string;
  colorHex: string;
}> = [
  { id: "cyan", name: "Cyber Neon", colorHex: "#00f0ff" },
  { id: "purple", name: "Neon Violet", colorHex: "#c084fc" },
  { id: "amber", name: "Solar Amber", colorHex: "#fbbf24" },
  { id: "matrix", name: "Emerald Matrix", colorHex: "#34d399" },
  { id: "crimson", name: "Crimson Flame", colorHex: "#f87171" },
  { id: "blue", name: "Electric Blue", colorHex: "#60a5fa" },
];

export default function PromptInspectorPanel({
  promptText,
  setPromptText,
  activeStyle,
  setActiveStyle,
  liveText,
  setLiveText,
  colorPalette,
  setColorPalette,
  motionSpeed,
  setMotionSpeed,
  isGenerating,
  onGenerate,
}: PromptInspectorPanelProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-4xl space-y-3 select-none">
      {/* 1. TOP TOOLBAR: STYLE SELECTOR & STUDIO CONTROLS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-[#0a0d15]/85 p-2.5 rounded-2xl border border-white/[0.08] backdrop-blur-xl shadow-lg">
        {/* Style Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {STYLE_PRESETS_CONFIG.map((preset) => {
            const Icon = preset.icon;
            const isActive = activeStyle === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActiveStyle(preset.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-sm shadow-cyan-500/25"
                    : "bg-white/[0.03] text-slate-400 hover:text-white border-white/[0.06] hover:bg-white/[0.07]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Render Text Input + Color Palette Dots + Speed Toggle */}
        <div className="flex items-center gap-2 shrink-0 justify-between md:justify-end overflow-x-auto scrollbar-none pt-1 md:pt-0">
          {/* Live Rendered Text Field */}
          <div className="flex items-center bg-[#07080d] border border-white/[0.12] focus-within:border-cyan-400/70 rounded-xl px-2.5 py-1 gap-1.5 transition-all">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1">
              <FiType className="w-3 h-3" />
              <span>Text</span>
            </span>
            <input
              type="text"
              value={liveText}
              onChange={(e) => setLiveText(e.target.value)}
              placeholder="CUSTOM TEXT"
              maxLength={22}
              className="w-24 sm:w-28 bg-transparent text-xs font-bold text-white placeholder-slate-500 focus:outline-none uppercase font-mono tracking-wider"
              title="On-screen Rendered Text"
            />
          </div>

          {/* Color Palette Swatches */}
          <div
            className="flex items-center gap-1 bg-[#07080d] border border-white/[0.12] rounded-xl px-2 py-1"
            title="Theme Color Palette"
          >
            <FiDroplet className="w-3 h-3 text-slate-400 mr-0.5" />
            {PALETTE_OPTIONS.map((pal) => {
              const isSelected = colorPalette === pal.id;
              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => setColorPalette(pal.id)}
                  title={`${pal.name} Palette`}
                  className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer shrink-0 border ${
                    isSelected
                      ? "scale-125 ring-2 ring-white/70 shadow-sm"
                      : "opacity-60 hover:opacity-100 hover:scale-110 border-transparent"
                  }`}
                  style={{ backgroundColor: pal.colorHex }}
                />
              );
            })}
          </div>

          {/* Speed Toggle */}
          <div
            className="flex items-center bg-[#07080d] border border-white/[0.12] rounded-xl p-0.5"
            title="Animation Playback Speed"
          >
            <FiClock className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
            {([0.5, 1, 1.5] as MotionSpeed[]).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setMotionSpeed(spd)}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  motionSpeed === spd
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. BIGGER & CLEAN STUDIO PROMPT BOX */}
      <form
        onSubmit={onGenerate}
        className={`relative flex flex-col rounded-2xl bg-[#090b13]/95 backdrop-blur-2xl border transition-all duration-200 shadow-2xl p-4 sm:p-5 ${
          isFocused
            ? "border-cyan-400/80 shadow-[0_0_35px_rgba(0,240,255,0.22)]"
            : "border-white/[0.12] hover:border-white/[0.22]"
        }`}
      >
        {/* Main Spacious Textarea */}
        <div className="flex items-start gap-3.5">
          <div className="pt-1.5 text-cyan-400 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shadow-sm">
              <FiZap className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          <div className="flex-1 relative">
            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                // Standard AI input behavior: Enter submits, Shift+Enter makes newline
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onGenerate();
                }
              }}
              placeholder="Describe your motion graphic in natural language... What should animate, how it moves, lighting, colors, and camera motion."
              className="w-full min-h-[110px] bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none resize-y font-sans leading-relaxed py-1"
            />
          </div>

          {promptText && (
            <button
              type="button"
              onClick={() => setPromptText("")}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0 mt-1"
              title="Clear prompt"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Toolbar: Helper Text & Primary Generate Button */}
        <div className="flex items-center justify-between gap-3 pt-3.5 mt-2 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-[11px] font-mono">
              Enter ↵ to Synthesize • Shift+Enter for newline
            </span>
            {promptText.length > 0 && (
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                {promptText.length} chars
              </span>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isGenerating || !promptText.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all duration-200 active:scale-[0.98] shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <span>Generate Motion</span>
                <FiArrowUpRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
