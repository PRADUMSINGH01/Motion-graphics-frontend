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
    <main className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden font-poppins text-white bg-[#121013]">
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

        {/* Clean Modern H1 Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight font-sans drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
          Generate Studio-Grade Motion Graphics with AI
        </h1>

        {/* Subtitle in Poppins */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Describe any animation, kinetic title, or 3D scene. Our autonomous AI agent scripts, keyframes, rigs physics, and renders studio-grade motion assets in seconds.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 shadow-xl shadow-black/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <span>Start Creating for Free</span>
            <FiArrowRight className="w-4 h-4 text-slate-900" />
          </Link>

          <Link
            href="/workspace"
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
