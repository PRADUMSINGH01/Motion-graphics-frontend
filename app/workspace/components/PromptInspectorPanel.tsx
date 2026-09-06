"use client";

import React, { useState } from "react";
import { FiZap, FiX, FiArrowUpRight } from "react-icons/fi";
import { StylePreset, ColorPalette, MotionSpeed } from "../types";

interface PromptInspectorPanelProps {
  promptText: string;
  setPromptText: (text: string) => void;
  activeStyle?: StylePreset;
  setActiveStyle?: (style: StylePreset) => void;
  liveText?: string;
  setLiveText?: (text: string) => void;
  colorPalette?: ColorPalette;
  setColorPalette?: (palette: ColorPalette) => void;
  motionSpeed?: MotionSpeed;
  setMotionSpeed?: (speed: MotionSpeed) => void;
  isGenerating: boolean;
  onGenerate: (e?: React.FormEvent) => void;
}

export default function PromptInspectorPanel({
  promptText,
  setPromptText,
  isGenerating,
  onGenerate,
}: PromptInspectorPanelProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-4xl select-none">
      {/* CLEAN & SPACIOUS STUDIO PROMPT BOX (NO EXTRA OPTIONS / NO COLOR OR TYPE CHIPS) */}
      <form
        onSubmit={onGenerate}
        className={`relative flex flex-col rounded-2xl bg-[#090b13]/95 backdrop-blur-2xl border transition-all duration-300 shadow-2xl p-4 sm:p-5 overflow-hidden ${
          isGenerating
            ? "border-cyan-400 shadow-[0_0_40px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400/50"
            : isFocused
            ? "border-cyan-400/80 shadow-[0_0_35px_rgba(0,240,255,0.22)]"
            : "border-white/[0.12] hover:border-white/[0.22]"
        }`}
      >
        {/* Animated laser shimmer beam while waiting for server response */}
        {isGenerating && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden z-20">
            <div className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer-laser" />
          </div>
        )}

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
                // Enter submits, Shift+Enter makes newline
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
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Clear Prompt"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Bar: Keyboard Hint + Generate Button */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.08] gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden sm:inline">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] border border-white/10">
                Enter ↵
              </kbd>{" "}
              to Generate •{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] border border-white/10">
                Shift+Enter
              </kbd>{" "}
              for newline
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
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-[0.98] shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isGenerating
                ? "bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 text-white shadow-[0_0_20px_#00f0ff] animate-pulse"
                : "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/25"
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="tracking-wide">Generating Motion...</span>
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
