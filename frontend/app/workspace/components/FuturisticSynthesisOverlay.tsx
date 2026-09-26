"use client";

import React from "react";
import Logo from "../../components/Logo";

interface FuturisticSynthesisOverlayProps {
  generationStatus: string;
  generationProgress: number;
  promptText?: string;
  activeStyle?: string;
}

export default function FuturisticSynthesisOverlay({
  generationStatus,
  generationProgress,
  promptText = "",
  activeStyle = "Kinetic Typography",
}: FuturisticSynthesisOverlayProps) {
  return (
    <div className="absolute inset-0 bg-[#040509]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 select-none animate-fadeIn transition-all duration-300">
      {/* 1. Sleek Minimalist Spinner & Core */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-4">
        {/* Outer minimal rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        
        {/* Subtle glowing center orb with Logo */}
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm">
          <Logo size={24} />
        </div>
      </div>

      {/* 2. Minimalist Status & User Prompt */}
      <div className="text-center space-y-1.5 max-w-sm px-4">
        <p className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide">
          {generationStatus || "Generating motion graphic..."}
        </p>

        {promptText && (
          <p className="text-[11px] font-mono text-cyan-400/80 truncate max-w-xs mx-auto italic">
            &ldquo;{promptText}&rdquo;
          </p>
        )}
      </div>

      {/* 3. Minimal 2px Progress Gauge */}
      <div className="w-56 mt-4 space-y-1.5">
        <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
            style={{ width: `${Math.max(8, generationProgress)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="uppercase">{activeStyle}</span>
          <span className="text-cyan-400 font-semibold">{Math.round(generationProgress)}%</span>
        </div>
      </div>
    </div>
  );
}
