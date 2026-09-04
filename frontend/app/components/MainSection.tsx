"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiZap,
  FiPlay,
  FiLayers,
  FiFilm,
  FiCode,
  FiSliders,
} from "react-icons/fi";
import SpiderNetBackground from "./SpiderNetBackground";

const samplePrompts = [
  "Kinetic 3D Typography with neon glow",
  "Futuristic holographic logo reveal",
  "Micro-interaction Lottie for mobile UI",
  "Dynamic morphing social media transition",
];

export default function MainSection() {
  const [prompt, setPrompt] = useState(
    "Create a kinetic 3D typography intro with glowing cyber particles, camera pan, and smooth bounce easing"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <main className="relative w-full min-h-[95vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden font-poppins text-white bg-[#121013]">
      {/* Animated Spider Web Canvas Background */}
      <SpiderNetBackground />

      {/* Atmospheric depth gradients */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#121013]/60 via-transparent to-[#121013]"
        aria-hidden="true"
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center pointer-events-auto">
        {/* Release Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6 backdrop-blur-md shadow-xl hover:bg-white/15 transition-all">
          <FiZap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Animagent • Autonomous Motion AI Agent Live</span>
        </div>

        {/* H1 Headline in Comic Relief */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-tight font-comic drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
          Generate Studio-Grade Motion Graphics with AI
        </h1>

        {/* Subtitle in Poppins */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Describe any animation, kinetic title, or 3D scene. Our autonomous AI agent scripts, keyframes, rigs physics, and renders studio-grade motion assets in seconds.
        </p>

        {/* Interactive AI Prompt Playground Bar */}
        <div className="w-full max-w-2xl mt-9 p-2 rounded-2xl bg-black/65 border border-white/15 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <FiFilm className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your motion graphic concept..."
                className="w-full pl-10 pr-4 py-3 text-sm bg-transparent text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 shadow-md shadow-black/30 transition-all active:scale-[0.98] shrink-0 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Agent Keyframing...</span>
                </>
              ) : (
                <>
                  <FiZap className="w-4 h-4 text-slate-900" />
                  <span>Generate Motion</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2.5 px-2 border-t border-white/10 mt-2 text-left">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
              Try:
            </span>
            {samplePrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrompt(p)}
                className="text-[11px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-md transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 shadow-xl shadow-black/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <span>Start Creating for Free</span>
            <FiArrowRight className="w-4 h-4 text-slate-900" />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 backdrop-blur-md shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <FiPlay className="w-4 h-4 text-cyan-400" />
            <span>Open Studio Workspace</span>
          </Link>
        </div>

        {/* Feature Spec Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-white">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 shadow-sm">
            <FiFilm className="text-cyan-400 w-3.5 h-3.5" /> 4K 60FPS Lossless
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 shadow-sm">
            <FiLayers className="text-purple-400 w-3.5 h-3.5" /> Autonomous Keyframing &amp; Easing
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 shadow-sm">
            <FiCode className="text-pink-400 w-3.5 h-3.5" /> Export After Effects &amp; Lottie JSON
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 shadow-sm">
            <FiSliders className="text-blue-400 w-3.5 h-3.5" /> Full Layer Timeline Control
          </span>
        </div>
      </div>
    </main>
  );
}
