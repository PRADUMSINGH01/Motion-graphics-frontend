"use client";

import React, { useState, memo } from "react";
import Link from "next/link";
import {
  IconSparkles,
  IconZap,
  IconCode,
  IconBox,
  IconClipboard,
  IconLayout,
  IconSearch,
  IconCheck,
  IconArrowRight,
} from "./Icons";

export const BentoFeatures = memo(function BentoFeatures() {
  const [aiPrompt, setAiPrompt] = useState("Generate bouncy spring easing");
  const [activePreset, setActivePreset] = useState("Spring Physics");

  return (
    <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-canvas text-white overflow-hidden">
      {/* Subtle radial ambient background */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-15"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, #FF4D6D, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            <IconZap className="w-3.5 h-3.5" />
            Supercharged Capabilities
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
            style={{
              fontFamily: "var(--font-headline)",
              letterSpacing: "-0.03em",
            }}
          >
            Built for speed.
            <br />
            Designed for flow.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Stop switching tabs, digging through menus, and breaking focus.
            Access your tools, AI prompts, and motion assets in a split second.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large Featured AI Copilot (Col-span 2) */}
          <div className="md:col-span-2 relative rounded-3xl border border-white/10 bg-gradient-to-b from-surface to-canvas p-8 overflow-hidden group hover:border-white/20 transition-all shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-accent-solid/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="max-w-md mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#ec4899]/20 border border-[#ec4899]/30 flex items-center justify-center text-[#ec4899] mb-4 shadow-inner">
                  <IconSparkles className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Raycast AI Copilot
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Summon generative AI instantly anywhere in your operating system.
                  Generate keyframes, write shader algorithms, or debug complex scripts on the fly.
                </p>
              </div>

              {/* Interactive AI Preview Terminal */}
              <div className="w-full rounded-2xl bg-[#18181b]/90 border border-white/10 p-4 shadow-xl font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-zinc-400 font-sans font-medium text-[11px]">
                      AI Assistant • Claude 3.5 Sonnet
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Press ↵ to apply</span>
                </div>

                <div className="pt-3 space-y-2 text-zinc-300">
                  <div className="flex items-center gap-2 text-accent">
                    <span className="font-bold">›</span>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="bg-transparent border-none outline-none text-white w-full font-mono text-xs"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-zinc-400 space-y-1">
                    <div className="text-emerald-400 font-semibold text-[11px]">
                      // Generated Motion Interpolator
                    </div>
                    <p className="text-zinc-300">
                      const spring = Spring.bouncy({`{`} tension: 380, friction: 22 {`}`});
                    </p>
                    <p className="text-zinc-500">
                      // Zero overshoot, snappy 60 FPS physics curve applied.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 1,000+ Extensions Store (Col-span 1) */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-surface to-canvas p-8 overflow-hidden group hover:border-white/20 transition-all shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/20 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6] mb-4 shadow-inner">
                <IconBox className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                1,000+ Extensions
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Connect your favorite tools directly into your flow with community-crafted extensions.
              </p>
            </div>

            {/* Extension Pills */}
            <div className="flex flex-col gap-2.5">
              {[
                { name: "Figma Motion Bridge", installs: "92k", color: "bg-rose-500" },
                { name: "Blender Viewport Sync", installs: "54k", color: "bg-orange-500" },
                { name: "Lottie Exporter", installs: "128k", color: "bg-emerald-500" },
                { name: "Linear Issue Tracker", installs: "87k", color: "bg-indigo-500" },
              ].map((ext) => (
                <div
                  key={ext.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${ext.color}`} />
                    <span className="font-medium text-white">{ext.name}</span>
                  </div>
                  <span className="text-zinc-500 text-[11px]">{ext.installs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Window Management & Canvas Snapping */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-surface to-canvas p-8 overflow-hidden group hover:border-white/20 transition-all shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0284c7]/20 border border-[#0284c7]/30 flex items-center justify-center text-[#0284c7] mb-4 shadow-inner">
                <IconLayout className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Window Management
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Tile viewports, inspect split-screen renders, and organize workspaces in a single keystroke.
              </p>
            </div>

            {/* Visual Snap Grid */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-2 gap-2 h-36">
              <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-xs font-semibold">
                Left Half ⌥ ⌘ ←
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500 font-mono text-xs">
                Right Half ⌥ ⌘ →
              </div>
            </div>
          </div>

          {/* Card 4: Clipboard History */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-surface to-canvas p-8 overflow-hidden group hover:border-white/20 transition-all shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] mb-4 shadow-inner">
                <IconClipboard className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Clipboard History
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Never lose a copied snippet, color hex, SVG vector, or prompt. Fully searchable and encrypted.
              </p>
            </div>

            {/* Clipboard Stack */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white">
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-3 h-3 rounded-full bg-accent-solid" />
                  <span>#FF4D6D (Raycast Coral)</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-300">↵</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-400">
                <span className="font-mono truncate">cubic-bezier(0.16, 1, 0.3, 1)</span>
                <span className="text-[10px] text-zinc-500">2m ago</span>
              </div>
            </div>
          </div>

          {/* Card 5: Speed of Light Performance */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-surface to-canvas p-8 overflow-hidden group hover:border-white/20 transition-all shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] mb-4 shadow-inner">
                <IconZap className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Sub-Millisecond Speed
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Built natively for instantaneous response. Zero loading states, instant keystroke execution.
              </p>
            </div>

            {/* Metric Counter */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  &lt; 1<span className="text-accent">ms</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Execution Latency</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  60<span className="text-emerald-400">FPS</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Smooth Rendering</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default BentoFeatures;
