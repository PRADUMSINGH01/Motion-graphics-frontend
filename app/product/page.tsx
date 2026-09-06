import React from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiBox,
  FiZap,
  FiCpu,
  FiRepeat,
  FiCompass,
  FiLayers,
  FiCode,
  FiCheckCircle,
  FiArrowRight,
  FiSliders,
  FiServer,
  FiShield,
  FiFilm,
  FiKey,
} from "react-icons/fi";

export const metadata = {
  title: "Product - Animagent Autonomous Motion AI",
  description: "Explore the complete Animagent product suite: autonomous animation generation, spider-web physics engine, and multi-format export pipeline.",
};

const productModules = [
  {
    icon: FiCpu,
    module: "Core Engine",
    title: "Autonomous Prompt-to-Motion Agent",
    badge: "v4.2 Neural",
    description:
      "Translates complex visual prompts into fully keyframed animation timelines, acceleration curves, and easing parameters without manual keyframe dragging.",
    specs: ["Natural Language AST Parser", "Procedural Physics Solver", "Automated Bezier Smoothing"],
  },
  {
    icon: FiLayers,
    module: "Interactive Graphics",
    title: "Spider-Net Physics & WebGL Canvas",
    badge: "60 FPS Real-Time",
    description:
      "Interactive 2D/3D canvas geometry powered by spring-damper equations, radial nodes, and mouse tension dynamics with zero dropped frames.",
    specs: ["Sub-millisecond latency", "Hardware-accelerated WebGL", "Interactive Tension Nodes"],
  },
  {
    icon: FiRepeat,
    module: "Template Ecosystem",
    title: "Instant 'Reuse' Motion Engine",
    badge: "Community Hub",
    description:
      "Inspect, fork, and remix curated motion loops from the Explore library. Instantly customize timing, colors, and camera motion in one click.",
    specs: ["1-Click Project Forking", "Shared Parameter Presets", "Open Creative License"],
  },
  {
    icon: FiCode,
    module: "Export Pipeline",
    title: "Lossless Multi-Format Code & Video Export",
    badge: "Production Ready",
    description:
      "Export ready-to-ship assets for web, mobile apps, or post-production timelines with full commercial rights.",
    specs: ["4K 60FPS WebM & MP4", "Lottie JSON & SVG Paths", "React Three Fiber JSX"],
  },
  {
    icon: FiSliders,
    module: "Studio Workspace",
    title: "Parametric Timeline & Curve Editor",
    badge: "Pro Controls",
    description:
      "Fine-tune momentum, gravitational pull, particle density, and layer hierarchy with high-precision web scrubbers.",
    specs: ["Non-destructive timeline", "Real-time shader tweaking", "Multi-resolution viewports"],
  },
  {
    icon: FiShield,
    module: "Enterprise Security",
    title: "Zero-Data-Retention (ZDR) Cloud",
    badge: "SOC2 Aligned",
    description:
      "Isolated GPU compute containers with automated memory wiping. We never train foundational models on your private creative prompts.",
    specs: ["Ephemeral VRAM Purge", "AES-256 At Rest", "Single-Tenant VPC Options"],
  },
];

export default function ProductPage() {
  return (
    <div className="relative min-h-screen bg-[#090a0f] text-slate-300 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-900/15 via-blue-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md px-3.5 py-1.5 rounded-xl"
          >
            <FiArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back to Studio</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-400/25">
            <FiBox className="w-3.5 h-3.5" />
            <span>Animagent Product Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-comic">
            The Autonomous Motion Graphics Platform
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-poppins">
            Animagent connects generative AI prompt intelligence with real-time procedural physics, giving creative teams the power to produce broadcast-grade animations in seconds.
          </p>
        </div>

        {/* Interactive Product Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {productModules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative p-6 rounded-3xl bg-[#0e0f14]/90 border border-white/10 hover:border-cyan-400/40 backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 space-y-4"
              >
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-cyan-400 group-hover:text-white group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-full bg-white/[0.06] text-cyan-300 border border-white/10">
                    {item.badge}
                  </span>
                </div>

                {/* Module Details */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    {item.module}
                  </span>
                  <h3 className="text-lg font-bold text-white font-comic group-hover:text-cyan-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-poppins pt-1">
                    {item.description}
                  </p>
                </div>

                {/* Specs Pill List */}
                <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
                  {item.specs.map((spec) => (
                    <div key={spec} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <FiCheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Workflow Steps */}
        <div className="my-16 p-8 rounded-3xl bg-[#0e0f14]/90 border border-white/10 backdrop-blur-2xl space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              Workflow Architecture
            </span>
            <h3 className="text-2xl font-bold text-white font-comic">
              From Thought to 60FPS Render in 3 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold">
                01
              </span>
              <h4 className="text-sm font-bold text-white font-comic">Prompt & Parameter Input</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide natural language descriptions, hex palettes, or upload vector SVGs to establish your animation brief.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 font-mono text-xs flex items-center justify-center font-bold">
                02
              </span>
              <h4 className="text-sm font-bold text-white font-comic">Autonomous Agent Keyframing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Animagent calculates spring physics, harmonic damping, and timing curves with interactive 60FPS live preview.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs flex items-center justify-center font-bold">
                03
              </span>
              <h4 className="text-sm font-bold text-white font-comic">Lossless Multi-Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download 4K WebM/MP4, Lottie JSON code, or fork directly into team workspaces with 100% commercial ownership.
              </p>
            </div>
          </div>
        </div>

        {/* Developer API & Incoming Agent Labs Section */}
        <div className="my-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Developer API & Token Access Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0e0f14]/95 via-[#11131a]/90 to-[#0e1620]/90 border border-emerald-500/20 backdrop-blur-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <FiKey className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                REST & SDK v1
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                Developer Platform
              </span>
              <h3 className="text-2xl font-bold text-white font-comic">
                Animagent Developer API & Tokens
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-poppins leading-relaxed">
                Automate kinetic renders, batch process dynamic SVG paths, and generate custom motion loops via our high-speed REST endpoints and streaming Node/Python SDKs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-white/10">
                <span>cURL Request</span>
                <span className="text-emerald-400">POST /v1/motion/synthesize</span>
              </div>
              <p className="text-slate-400 truncate">
                curl -H <span className="text-emerald-300">&quot;Authorization: Bearer am_live_...&quot;</span> https://api.animagent.ai/v1/...
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/api-keys"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <span>Manage API Keys</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/api-keys"
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Read Documentation →
              </Link>
            </div>
          </div>

          {/* Incoming Agent Labs Roadmap */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0e0f14]/95 via-[#14121a]/90 to-[#180e20]/90 border border-purple-500/20 backdrop-blur-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-400">
                <FiCpu className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Incoming Projects
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-semibold">
                Autonomous Labs
              </span>
              <h3 className="text-2xl font-bold text-white font-comic">
                Next-Gen Agent Ecosystem
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-poppins leading-relaxed">
                We are expanding the Animagent neural suite beyond 2D motion with specialized domain agents currently in active R&D.
              </p>
            </div>

            <div className="space-y-3">
              {/* Agent 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                  <FiLayers className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white font-comic">Vector Morph Agent</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">Coming Q4</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Autonomous kinetic SVG path morphing, brand logo fluid transitions, and parametric bezier tweening.
                  </p>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <FiSliders className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white font-comic">3D Physics Rig Agent</span>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">Private Alpha</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Real-time spider-web collision solver, multi-body spring networks, and inertial cloth simulation.
                  </p>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0">
                  <FiFilm className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white font-comic">Voice2Motion Agent</span>
                    <span className="text-[10px] font-mono text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded">In Dev</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Microphone and audio stem synchronization with kinetic subtitle rendering and audio-reactive ripples.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Conversion Banner */}
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#121319]/90 to-blue-950/40 border border-cyan-500/20 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-comic">
              Ready to create autonomous motion graphics?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-poppins">
              Start your 7-day free trial on Animagent or explore pre-rendered motion loops.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-lg"
            >
              <span>Get Started Free</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
            >
              <span>Explore Library</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
