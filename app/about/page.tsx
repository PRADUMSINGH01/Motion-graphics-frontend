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
  title: "About us",
  description: "Learn about the team and technology powering the world's most advanced autonomous motion graphics agent.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-canvas text-fg-muted font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackUrl="/workspace" label="Back to Studio" />
          <ThemeToggle />
        </div>

        {/* Page Header */}
        <div className="space-y-3 pb-8 border-b border-line">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-accent border border-blue-500/20">
            <FiInfo className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-fg font-comic">
            Democratizing High-End Motion Design
          </h1>

          <p className="text-sm sm:text-base text-fg-muted leading-relaxed font-poppins pt-1">
            byreel AI was created to replace hours of manual keyframe manipulation with intelligent, procedural physics and autonomous animation intelligence.
          </p>
        </div>

        {/* Studio Stats */}
        <div className="my-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-surface border border-line backdrop-blur-xl text-center space-y-1 shadow-sm dark:shadow-none">
            <span className="text-2xl sm:text-3xl font-bold text-fg font-comic">60 FPS</span>
            <span className="text-[11px] text-fg-muted block font-poppins">Fluid Canvas Playback</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-line backdrop-blur-xl text-center space-y-1 shadow-sm dark:shadow-none">
            <span className="text-2xl sm:text-3xl font-bold text-accent font-comic">4.8M+</span>
            <span className="text-[11px] text-fg-muted block font-poppins">Rendered Frames</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-line backdrop-blur-xl text-center space-y-1 shadow-sm dark:shadow-none">
            <span className="text-2xl sm:text-3xl font-bold text-success font-comic">100%</span>
            <span className="text-[11px] text-fg-muted block font-poppins">Commercial Ownership</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-line backdrop-blur-xl text-center space-y-1 shadow-sm dark:shadow-none">
            <span className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400 font-comic">Zero</span>
            <span className="text-[11px] text-fg-muted block font-poppins">Customer Data Training</span>
          </div>
        </div>

        {/* Narrative Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-fg-muted">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-fg font-comic flex items-center gap-2">
              <FiCpu className="w-5 h-5 text-accent" />
              <span>Procedural Physics Meets Creative Direction</span>
            </h2>
            <p>
              Traditional motion design requires navigating dense timeline graphs, bezier handles, and render queues. We believe animators, art directors, and frontend engineers should communicate visual concepts through language, while autonomous agents calculate spring dynamics, fluid inertia, and lighting interactions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-fg font-comic flex items-center gap-2">
              <FiShield className="w-5 h-5 text-success" />
              <span>Built on Ethical AI &amp; Creator Sovereignty</span>
            </h2>
            <p>
              We firmly reject the practice of training foundational models on non-consensual creator portfolios. Our algorithms are trained strictly on synthetic mathematical simulations, licensed open-source graphics routines, and in-house animation assets. When you build with byreel, your output is legally unassailable and exclusively yours.
            </p>
          </section>

          {/* Connect Banner */}
          <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-fg-muted">
              Explore our legal transparency commitments:
            </span>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/terms" className="text-fg hover:text-accent underline">
                Terms
              </Link>
              <span>•</span>
              <Link href="/policy" className="text-fg hover:text-accent underline">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/data-usage" className="text-fg hover:text-accent underline">
                Data Usage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
