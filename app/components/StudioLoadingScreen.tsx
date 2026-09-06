"use client";

import React from "react";
import Logo from "./Logo";

interface StudioLoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export default function StudioLoadingScreen({
  message = "INITIALIZING ANIMAGENT STUDIO...",
  subMessage = "Allocating GPU Shaders & Neural Pipeline",
  fullScreen = true,
}: StudioLoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center select-none bg-[#08090e] text-slate-100 ${
        fullScreen ? "fixed inset-0 z-50 min-h-screen" : "w-full py-16"
      }`}
    >
      {/* Background ambient radial illumination */}
      <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-500/15 via-indigo-600/10 to-purple-600/15 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-6 z-10">
        {/* Holographic Quantum Orbital Halo */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin-slow" />

          {/* Inner counter-rotating ring */}
          <div className="absolute inset-2.5 rounded-full border border-indigo-400/50 border-t-cyan-300 border-b-purple-400 animate-spin-reverse-slow" />

          {/* Pulsing Quantum Center Orb */}
          <div className="relative w-14 h-14 rounded-2xl bg-[#0c0f1a] border border-cyan-400/50 flex items-center justify-center animate-quantum-pulse shadow-lg">
            <Logo size={36} />
          </div>

          {/* Micro satellite node */}
          <div className="absolute -top-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-ping" />
        </div>

        {/* Status Typography */}
        <div className="text-center space-y-2 max-w-sm px-4">
          <h3 className="text-xs sm:text-sm font-mono uppercase tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-indigo-300 font-bold">
            {message}
          </h3>
          <p className="text-[10px] sm:text-xs font-mono text-slate-500 tracking-wider">
            {subMessage}
          </p>
        </div>

        {/* High-Tech Shimmer Bar */}
        <div className="w-48 h-1 bg-white/[0.08] rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer-laser" />
        </div>

        {/* Live Technical Metadata Tag */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[9px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>60 FPS GPU PIPELINE ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
