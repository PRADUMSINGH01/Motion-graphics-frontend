"use client";

import React, { useState } from "react";
import {
  FiZap,
  FiType,
  FiBox,
  FiDisc,
  FiActivity,
  FiSliders,
  FiStar,
  FiX,
  FiArrowUpRight,
  FiShuffle,
  FiPlus,
} from "react-icons/fi";
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

const STYLE_PRESETS_CONFIG: Array<{
  id: StylePreset;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}> = [
  { id: "Kinetic Typography", label: "Kinetic Type", icon: FiType, accentColor: "cyan" },
  { id: "3D Isometric", label: "3D Isometric", icon: FiBox, accentColor: "indigo" },
  { id: "Logo Reveal", label: "Logo Reveal", icon: FiDisc, accentColor: "purple" },
  { id: "Abstract VFX", label: "Abstract VFX", icon: FiActivity, accentColor: "pink" },
  { id: "UI & Lottie", label: "UI & Lottie", icon: FiSliders, accentColor: "blue" },
];

const QUICK_MODIFIERS = [
  "chromatic cyan split",
  "spring-damper physics easing",
  "45° isometric camera orbit",
  "harmonic plasma turbulence",
  "high-voltage neon corona",
  "minimal Swiss typography",
];

const SURPRISE_INSPIRATIONS = [
  {
    style: "Kinetic Typography" as StylePreset,
    text: "HYPERDRIVE",
    prompt:
      "Kinetic typography sliding across staggered axes with glowing cyan edges, chromatic RGB trails, and spring-damper easing",
  },
  {
    style: "3D Isometric" as StylePreset,
    text: "DIMENSION",
    prompt:
      "Interlocking frosted glass cubes rotating synchronously on a 45-degree isometric gimbal with chromatic light dispersion",
  },
  {
    style: "Logo Reveal" as StylePreset,
    text: "QUANTUM",
    prompt:
      "Dual vector arcs rotating synchronously with high-voltage neon pulse, radial particle corona, and specular light wipe",
  },
  {
    style: "Abstract VFX" as StylePreset,
    text: "NEBULA",
    prompt:
      "Undulating plasma sphere with organic harmonic frequency, chromatic fluid distortion, and liquid surface turbulence",
  },
  {
    style: "UI & Lottie" as StylePreset,
    text: "SYNTHESIS",
    prompt:
      "Procedural UI audio frequency bars dancing with spring bounce, harmonic oscillation, and smooth damping curve",
  },
];

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
  const [isFocused, setIsFocused] = useState(false);

  // Quick prompt modifier appender
  const handleAddModifier = (modifier: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) {
      setPromptText(`With ${modifier}`);
    } else if (!trimmed.toLowerCase().includes(modifier.toLowerCase())) {
      setPromptText(`${trimmed}, with ${modifier}`);
    }
  };

  // Surprise Me / Randomize Prompt
  const handleSurpriseMe = () => {
    const randomItem =
      SURPRISE_INSPIRATIONS[Math.floor(Math.random() * SURPRISE_INSPIRATIONS.length)];
    setPromptText(randomItem.prompt);
    setActiveStyle(randomItem.style);
    setLiveText(randomItem.text);
  };

  // Enhance prompt with studio camera & physics tags
  const handleEnhancePrompt = () => {
    const enhancer = "60 FPS GPU-accelerated motion curves, spring-damper physics, and dynamic lighting";
    const trimmed = promptText.trim();
    if (!trimmed.includes(enhancer)) {
      setPromptText(trimmed ? `${trimmed} (${enhancer})` : enhancer);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-3 select-none">
      {/* 1. TOP DOCK: STYLE PRESET SELECTOR & ON-SCREEN TEXT INPUT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Style Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
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
                    ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/20"
                    : "bg-white/[0.03] text-slate-400 hover:text-white border-white/[0.08] hover:bg-white/[0.07]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live On-Screen Rendered Text Pill */}
        <div className="flex items-center bg-[#0d0f17] border border-white/[0.12] focus-within:border-cyan-400/60 rounded-xl px-2.5 py-1 shrink-0 gap-2">
          <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold tracking-wider flex items-center gap-1">
            <FiType className="w-3 h-3" />
            <span>Text</span>
          </span>
          <input
            type="text"
            value={liveText}
            onChange={(e) => setLiveText(e.target.value)}
            placeholder="VELOCITY"
            maxLength={18}
            className="w-24 sm:w-28 bg-transparent text-xs font-bold text-white placeholder-slate-500 focus:outline-none uppercase font-mono tracking-wider"
            title="Custom On-Screen Rendered Text"
          />
        </div>
      </div>

      {/* 2. CORE STUDIO COMMAND CONSOLE (Glassmorphic Multi-Line Box) */}
      <form
        onSubmit={onGenerate}
        className={`relative flex flex-col rounded-2xl bg-[#0a0c13]/95 backdrop-blur-2xl border transition-all duration-200 shadow-2xl p-3 ${
          isFocused
            ? "border-cyan-400/70 shadow-[0_0_24px_rgba(0,240,255,0.12)]"
            : "border-white/[0.12] hover:border-white/[0.2]"
        }`}
      >
        {/* Main Textarea & Actions */}
        <div className="flex items-start gap-3">
          <div className="pt-1 text-cyan-400 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
              <FiZap className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div className="flex-1 relative">
            <textarea
              rows={2}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  onGenerate();
                }
              }}
              placeholder="Describe your motion graphic, keyframe trajectory, camera orbit, or physics easing... (e.g. Kinetic typography sliding across staggered axes with chromatic neon cyan glow)"
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none font-sans leading-relaxed py-0.5"
            />
          </div>

          {promptText && (
            <button
              type="button"
              onClick={() => setPromptText("")}
              className="p-1 text-slate-500 hover:text-slate-300 rounded-md hover:bg-white/5 transition-colors cursor-pointer shrink-0 mt-0.5"
              title="Clear prompt"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Console Controls & Generate Button Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 mt-2 border-t border-white/[0.08]">
          {/* Left: Quick AI Prompt Enhancements & Surprise Me */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
              title="Randomize creative prompt, style, and text"
            >
              <FiShuffle className="w-3 h-3 text-cyan-400" />
              <span>Surprise Me</span>
            </button>

            <button
              type="button"
              onClick={handleEnhancePrompt}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-colors cursor-pointer"
              title="Append high-definition 60FPS physics and lighting parameters"
            >
              <FiStar className="w-3 h-3 text-purple-400" />
              <span>Enhance Prompt</span>
            </button>

            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline pl-1">
              Ctrl+Enter
            </span>
          </div>

          {/* Right: Primary Generate Button */}
          <button
            type="submit"
            disabled={isGenerating || !promptText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all duration-200 active:scale-[0.98] shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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

      {/* 3. QUICK MODIFIER CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-1 py-0.5">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold shrink-0 mr-1">
          Modifiers:
        </span>
        {QUICK_MODIFIERS.map((mod, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAddModifier(mod)}
            className="px-2.5 py-1 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-400/30 text-[11px] text-slate-400 hover:text-cyan-300 transition-all cursor-pointer shrink-0 flex items-center gap-1"
          >
            <FiPlus className="w-2.5 h-2.5 text-cyan-400/70" />
            <span>{mod}</span>
          </button>
        ))}
      </div>

      {/* 4. CURATED INSPIRATION PRESETS BAR */}
      <div className="flex items-center justify-between text-xs px-1 pt-0.5">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold shrink-0 mr-1">
            Templates:
          </span>
          {inspirationPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-400/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>{preset.icon}</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        <span className="text-[10px] font-mono text-slate-500 hidden md:inline shrink-0 pl-2">
          [Space] Play/Pause
        </span>
      </div>
    </div>
  );
}
