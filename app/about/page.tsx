import React from "react";
import Link from "next/link";
import BackButton from "../components/BackButton";
import ThemeToggle from "../components/ThemeToggle";
import {
  FiArrowLeft,
  FiInfo,
  FiShield,
  FiUsers,
  FiCpu,
  FiCheckCircle,
  FiArrowRight,
  FiGlobe,
} from "react-icons/fi";

export const metadata = {
  title: "About Us - Animagent AI",
  description: "Learn about the team and technology powering the world's most advanced autonomous motion graphics agent.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#090a0f] text-slate-700 dark:text-slate-300 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackUrl="/workspace" label="Back to Studio" />
          <ThemeToggle />
        </div>

        {/* Page Header */}
        <div className="space-y-3 pb-8 border-b border-black/10 dark:border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            <FiInfo className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white font-comic">
            Democratizing High-End Motion Design
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-poppins pt-1">
            Animagent AI was created to replace hours of manual keyframe manipulation with intelligent, procedural physics and autonomous animation intelligence.
          </p>
        </div>

        {/* Studio Stats */}
        <div className="my-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121319]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl text-center space-y-1 shadow-sm dark:shadow-none">
            <span className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white font-comic">60 FPS</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-poppins">Fluid Canvas Playback</span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121319]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl text-center space-y-1 shadow-sm dark:shadow-none">
            <span className="text-2xl sm:text-3xl font-bold text-cyan-700 dark:text-cyan-400 font-comic">4.8M+</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-poppins">Rendered Frames</span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121319]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl text-center space-y-1 shadow-sm dark:shadow-none">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 font-comic">100%</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-poppins">Commercial Ownership</span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121319]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl text-center space-y-1 shadow-sm dark:shadow-none">
            <span className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400 font-comic">Zero</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-poppins">Customer Data Training</span>
          </div>
        </div>

        {/* Narrative Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-comic flex items-center gap-2">
              <FiCpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Procedural Physics Meets Creative Direction</span>
            </h2>
            <p>
              Traditional motion design requires navigating dense timeline graphs, bezier handles, and render queues. We believe animators, art directors, and frontend engineers should communicate visual concepts through language, while autonomous agents calculate spring dynamics, fluid inertia, and lighting interactions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white font-comic flex items-center gap-2">
              <FiShield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Built on Ethical AI &amp; Creator Sovereignty</span>
            </h2>
            <p>
              We firmly reject the practice of training foundational models on non-consensual creator portfolios. Our algorithms are trained strictly on synthetic mathematical simulations, licensed open-source graphics routines, and in-house animation assets. When you build with Animagent, your output is legally unassailable and exclusively yours.
            </p>
          </section>

          {/* Connect Banner */}
          <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Explore our legal transparency commitments:
            </span>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/terms" className="text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 underline">
                Terms
              </Link>
              <span>•</span>
              <Link href="/policy" className="text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 underline">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/data-usage" className="text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 underline">
                Data Usage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
