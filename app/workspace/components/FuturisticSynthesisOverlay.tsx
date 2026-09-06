"use client";

import React, { useEffect, useState } from "react";
import Logo from "../../components/Logo";

interface FuturisticSynthesisOverlayProps {
  generationStatus: string;
  generationProgress: number;
  promptText?: string;
  activeStyle?: string;
}

const TELEMETRY_PHASES = [
  "PARSING NATURAL LANGUAGE PROMPT",
  "SOLVING KINETIC SPRING DYNAMICS",
  "COMPUTING 60.0 FPS BEZIER SPLINES",
  "ALLOCATING CLOUD GPU SHADER NODES",
  "SYNTHESIZING CHROMATIC VECTORS",
];

export default function FuturisticSynthesisOverlay({
  generationStatus,
  generationProgress,
  promptText = "",
  activeStyle = "Kinetic Typography",
}: FuturisticSynthesisOverlayProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % TELEMETRY_PHASES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#05060b]/92 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 select-none overflow-hidden">
      {/* 1. Holographic Laser Scanline Sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="w-full h-12 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scanline" />
      </div>

      {/* 2. Cybernetic Grid Background & Corner Brackets */}
      <div className="absolute inset-4 pointer-events-none border border-white/[0.06] rounded-xl">
        <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/70">
          [SYS_SYNC: READY]
        </div>
        <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-500">
          MODE // {activeStyle.toUpperCase()}
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-500">
          FRAME // 60.0 FPS LOSSLESS
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-emerald-400/80 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>GPU CLUSTER ACTIVE</span>
        </div>
      </div>

      {/* 3. Central Quantum Radar & Orbital Rings */}
      <div className="relative flex items-center justify-center w-32 h-32 my-auto">
        {/* Outer rotating dashed ring with tick markers */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin-slow shadow-[0_0_20px_rgba(0,240,255,0.2)]" />

        {/* Middle counter-rotating gradient ring */}
        <div className="absolute inset-3 rounded-full border border-t-cyan-300 border-r-indigo-500 border-b-purple-500 border-l-transparent animate-spin-reverse-slow" />

        {/* Pulsing Quantum Center Node with Logo */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0a0d18] to-[#121626] border border-cyan-400/60 flex items-center justify-center animate-quantum-pulse shadow-xl">
          <Logo size={40} />
          {/* Inner pulsating core point */}
          <div className="absolute w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
        </div>

        {/* Orbiting Satellite Particle */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] -top-1 mx-auto" />
        </div>
      </div>

      {/* 4. Neural Waveform Frequency Bars */}
      <div className="flex items-center gap-1.5 h-6 mb-3">
        {[20, 45, 80, 60, 95, 70, 85, 40, 65, 30, 75, 50].map((h, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-cyan-500 to-indigo-400 rounded-full transition-all duration-300"
            style={{
              height: `${Math.max(6, Math.min(24, (h * (generationProgress || 50)) / 100))}px`,
              opacity: 0.4 + (i % 3) * 0.25,
            }}
          />
        ))}
      </div>

      {/* 5. Live Telemetry & Status Readout */}
      <div className="text-center space-y-2 max-w-md w-full px-4 z-10">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
            {TELEMETRY_PHASES[phaseIndex]}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
          {generationStatus || "Synthesizing 60 FPS procedural motion graphics..."}
        </p>

        {promptText && (
          <p className="text-[10px] font-mono text-slate-400 truncate max-w-xs mx-auto italic opacity-80">
            &ldquo;{promptText}&rdquo;
          </p>
        )}
      </div>

      {/* 6. Cybernetic High-Tech Progress Bar */}
      <div className="w-64 sm:w-80 mt-4 space-y-1.5 z-10">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">SYNTHESIS PROGRESS</span>
          <span className="text-cyan-400 font-bold">{Math.round(generationProgress)}%</span>
        </div>

        <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/[0.1] relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_12px_#00f0ff] relative"
            style={{ width: `${Math.max(5, generationProgress)}%` }}
          >
            {/* Spark beam on the leading edge */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[1px] rounded-full opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
}
