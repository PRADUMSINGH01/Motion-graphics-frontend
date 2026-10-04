"use client";

import React, { memo } from "react";
import Link from "next/link";
import { IconArrowUpRight } from "./Icons";

export const BlueprintSection = memo(function BlueprintSection() {
  return (
    <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-[#050508] text-white overflow-hidden border-t border-white/10 select-none">
      {/* ── TECHNICAL ENGINEERING GRID PATTERN (EXACT TO SCREENSHOT 5) ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center border border-white/10 rounded-3xl bg-canvas/85 backdrop-blur-xl p-8 sm:p-12 shadow-2xl overflow-hidden">
          
          {/* ── LEFT: TYPOGRAPHY (MOTION AGENT) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <h2
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.02] mb-8"
                style={{
                  fontFamily: "var(--font-headline)",
                  letterSpacing: "-0.04em",
                }}
              >
                Build motion<br />
                with pure<br />
                code.
              </h2>

              <p className="text-sm sm:text-base font-mono text-zinc-400 leading-relaxed max-w-sm">
                Our Motion Agent compiles procedural layers into broadcast-grade 60 FPS MP4 video.
                Build kinetic typography, 3D physics, and procedural motion programmatically.
              </p>
            </div>

            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white hover:text-white/80 transition-colors group cursor-pointer"
            >
              <span>Read the documentation</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>
          </div>

          {/* ── RIGHT: FIG_01 EXPLODED ISOMETRIC BLUEPRINT SCHEMATIC ── */}
          <div className="lg:col-span-7 relative min-h-[460px] flex items-center justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10">
            {/* Figure Label */}
            <div className="absolute top-0 left-0 lg:left-10 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
              FIG_01 • MOTION COMPOSITION ENGINE
            </div>

            {/* Isometric Exploded Schematic SVG & Layers */}
            <div className="relative w-full max-w-[500px] h-[380px] flex items-center justify-center">
              
              {/* Technical Callout Labels with Exact Lines */}
              {/* Callout: SPRING PHYSICS (Top Left) */}
              <div className="absolute top-12 left-2 text-[10px] font-mono text-zinc-400 tracking-wider">
                <span>SPRING PHYSICS</span>
                <div className="w-12 h-px bg-zinc-600 mt-1 origin-left rotate-[20deg]" />
              </div>

              {/* Callout: INTERPOLATE() (Top Right) */}
              <div className="absolute top-8 right-16 text-[10px] font-mono text-zinc-400 tracking-wider text-right">
                <span>INTERPOLATE()</span>
                <div className="w-10 h-px bg-zinc-600 mt-1 origin-right -rotate-[35deg] ml-auto" />
              </div>

              {/* Callout: SELECTED ITEM (Right Middle) */}
              <div className="absolute top-24 right-0 text-[10px] font-mono text-blue-400 tracking-wider text-right flex items-center gap-2">
                <span>ACTIVE COMPOSITION</span>
                <div className="w-8 h-px bg-blue-400" />
              </div>

              {/* Callout: REACT SEQUENCES (Bottom Center/Left) */}
              <div className="absolute bottom-10 left-16 text-[10px] font-mono text-zinc-400 tracking-wider">
                <div className="w-8 h-px bg-zinc-600 mb-1 origin-left -rotate-[45deg]" />
                <span>REACT SEQUENCES</span>
              </div>

              {/* ── 3D ISOMETRIC STACKED WIREFRAME LAYERS ── */}
              <div className="relative w-[360px] h-[260px] transform rotate-x-[55deg] -rotate-z-[30deg] scale-100 transition-transform duration-500 hover:scale-105">
                
                {/* 1. Base Chassis Layer */}
                <div className="absolute inset-0 rounded-2xl border border-zinc-700 bg-zinc-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.9)] translate-z-[0px]">
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[9px] font-mono text-zinc-500 border-t border-zinc-800 pt-2">
                    <span>↵ OPEN COMMAND</span>
                    <span>⌘ K ACTIONS</span>
                  </div>
                </div>

                {/* 2. Middle Layer: List Content Rows */}
                <div className="absolute inset-x-2 inset-y-3 rounded-xl border border-zinc-600/60 bg-[#121216]/80 p-3 space-y-2 translate-y-[-28px] shadow-2xl backdrop-blur-md">
                  <div className="h-4 rounded bg-white/5 border border-white/5 w-3/4" />
                  <div className="h-4 rounded bg-white/5 border border-white/5 w-1/2" />
                  <div className="h-4 rounded bg-white/5 border border-white/5 w-2/3" />
                </div>

                {/* 3. Glowing Blue Selected Item Layer (FIG_01 Highlight) */}
                <div className="absolute inset-x-4 top-12 h-8 rounded-lg bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 border border-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.7)] translate-y-[-56px] flex items-center px-3 justify-between z-20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                    <span className="text-[10px] font-mono font-bold text-black uppercase tracking-wider">Active Command</span>
                  </div>
                  <span className="text-[9px] font-mono text-black font-semibold">↵</span>
                </div>

                {/* 4. Top Layer: Search Bar Frame */}
                <div className="absolute inset-x-0 inset-y-0 rounded-2xl border-2 border-dashed border-zinc-500/80 bg-transparent translate-y-[-80px] pointer-events-none p-3 flex flex-col justify-start">
                  <div className="h-6 rounded-md border border-zinc-500/60 flex items-center px-2">
                    <span className="w-2 h-2 rounded-full border border-zinc-400 mr-2" />
                    <span className="text-[10px] font-mono text-zinc-400">Search commands...</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ── FIG_02 FOOTER SUB-CELL (MATCHES SCREENSHOT 5) ── */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-white/10 rounded-2xl bg-canvas/60 backdrop-blur-md p-6 flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono text-zinc-500">FIG_02</span>
              <span className="text-sm font-semibold text-white">Extensibility Architecture</span>
            </div>
            <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">↗</span>
          </div>

          <div className="border border-white/10 rounded-2xl bg-canvas/60 backdrop-blur-md p-6 flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono text-zinc-500">FIG_03</span>
              <span className="text-sm font-semibold text-white">Native Rust &amp; WebGL Runtime</span>
            </div>
            <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">↗</span>
          </div>
        </div>

      </div>
    </section>
  );
});

export default BlueprintSection;
