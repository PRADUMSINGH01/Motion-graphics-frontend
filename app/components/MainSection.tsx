"use client";

import React from "react";
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

export default function MainSection() {
  return (
    <main className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden font-poppins text-slate-900 dark:text-white bg-slate-50 dark:bg-[#121013] transition-colors duration-300">
      {/* Animated Spider Web Canvas Background */}
      <SpiderNetBackground />

      {/* Atmospheric depth gradients */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-50/60 via-transparent to-slate-50 dark:from-[#121013]/60 dark:via-transparent dark:to-[#121013] transition-colors duration-300"
        aria-hidden="true"
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center pointer-events-auto">
        {/* Release Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-800 dark:text-white text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-black/[0.03] dark:shadow-xl hover:bg-black/[0.08] dark:hover:bg-white/15 transition-all">
          <FiZap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Animagent • Autonomous Motion AI Agent Live</span>
        </div>

        {/* Clean Modern H1 Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-4xl leading-tight font-sans drop-shadow-xs dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
          Generate Studio-Grade Motion Graphics with AI
        </h1>

        {/* Subtitle in Poppins */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl font-normal leading-relaxed drop-shadow-none dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Describe any animation, kinetic title, or 3D scene. Our autonomous AI agent scripts, keyframes, rigs physics, and renders studio-grade motion assets in seconds.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:text-slate-900 dark:bg-white dark:hover:bg-slate-100 shadow-xl shadow-slate-950/15 dark:shadow-black/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <span>Start Creating for Free</span>
            <FiArrowRight className="w-4 h-4 text-white dark:text-slate-900" />
          </Link>

          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-white bg-black/[0.04] dark:bg-white/5 hover:bg-black/[0.08] dark:hover:bg-white/10 border border-black/10 dark:border-white/15 hover:border-black/20 dark:hover:border-white/30 backdrop-blur-md shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <FiPlay className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Open Studio Workspace</span>
          </Link>
        </div>

        {/* Feature Spec Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700 dark:text-white">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
            <FiFilm className="text-cyan-600 dark:text-cyan-400 w-3.5 h-3.5" /> 4K 60FPS Lossless
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
            <FiLayers className="text-purple-600 dark:text-purple-400 w-3.5 h-3.5" /> Autonomous Keyframing &amp; Easing
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
            <FiCode className="text-pink-600 dark:text-pink-400 w-3.5 h-3.5" /> Export After Effects &amp; Lottie JSON
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
            <FiSliders className="text-blue-600 dark:text-blue-400 w-3.5 h-3.5" /> Full Layer Timeline Control
          </span>
        </div>
      </div>
    </main>
  );
}
