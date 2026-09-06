import React from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiDatabase,
  FiCpu,
  FiShield,
  FiLock,
  FiCheckCircle,
  FiRefreshCw,
  FiServer,
  FiFileText,
  FiLayers,
  FiMail,
} from "react-icons/fi";

export const metadata = {
  title: "Data Usage & AI Ethics - Animagent AI",
  description: "Our policy regarding AI model training, zero data retention, and proprietary asset protection for motion graphics.",
};

export default function DataUsagePage() {
  return (
    <div className="relative min-h-screen bg-[#090a0f] text-slate-300 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-900/10 via-cyan-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
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
        <div className="space-y-3 pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-400/20">
            <FiDatabase className="w-3.5 h-3.5" />
            <span>AI Model Transparency</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-comic">
            Data Usage & AI Training Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Zero Training on Customer Data
            </span>
            <span>•</span>
            <span className="text-slate-400">Effective: September 4, 2026</span>
            <span>•</span>
            <span className="text-purple-400 font-medium">Enterprise ZDR Available</span>
          </div>
        </div>

        {/* Executive Transparency Card */}
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#121319]/80 to-blue-950/30 border border-purple-500/20 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-comic">
                Our Non-Negotiable AI Pledge
              </h2>
              <p className="text-xs text-slate-400">
                Guaranteed commercial protection for motion designers and creative studios
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
            &quot;Animagent AI does <strong className="text-white">NOT</strong> use, train, fine-tune, or calibrate public foundational models on your private motion prompts, client vector files, brand guidelines, or custom keyframe curves. Your creative intellectual property belongs exclusively to you.&quot;
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Isolated GPU Memory</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Cache Purge</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>SOC2 Type II Aligned</span>
            </div>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white font-comic flex items-center gap-2">
              <FiCpu className="w-5 h-5 text-cyan-400" />
              <span>1. How Our Motion Foundation Models Are Trained</span>
            </h2>
            <p>
              Animagent&apos;s generative motion engines (including the Spider-Web Canvas Engine, Procedural Physics Simulator, and 3D Bezier Curve Synthesizer) are trained solely through:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-white">Procedural & Synthetic Mathematics:</strong> Millions of mathematically synthesized harmonic oscillations, Newtonian particle trajectories, spring-damper equations, and parametric spline curves.
              </li>
              <li>
                <strong className="text-white">Fully Licensed Open-Source Codebases:</strong> Permissively licensed graphics code (MIT, Apache 2.0, BSD) covering WebGL shaders, Three.js shaders, and SVG path specifications.
              </li>
              <li>
                <strong className="text-white">In-House Studio Animations:</strong> Bespoke motion graphics created directly by Animagent&apos;s salaried animators with 100% clean title and copyright clearance.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white font-comic flex items-center gap-2">
              <FiServer className="w-5 h-5 text-emerald-400" />
              <span>2. The Ephemeral GPU Execution Pipeline</span>
            </h2>
            <p>
              When you submit a motion generation prompt or trigger an animation compile:
            </p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Sandboxed Ingestion</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your prompt is transmitted via TLS 1.3 to an isolated container and evaluated by the agent inference cluster.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Rendering & Frame Encoding</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    The GPU cluster renders keyframes and compiles the WebM video or SVG code in volatile memory.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">VRAM Sanitize & Storage Lock</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    GPU memory is wiped with zeroes. The resulting file is encrypted at rest and served solely to your browser.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white font-comic flex items-center gap-2">
              <FiRefreshCw className="w-5 h-5 text-purple-400" />
              <span>3. Explore Showcase & The Reuse Engine</span>
            </h2>
            <p>
              On our <Link href="/explore" className="text-cyan-400 hover:underline">Explore Showcase</Link>, motion designers can browse curated animation loops and click the <strong className="text-white">&quot;Reuse&quot;</strong> button to copy prompts and customize parameters.
            </p>
            <p>
              Animations appearing in the Explore showcase are either created by our internal creative team or voluntarily published by creators who explicitly opted into community sharing under the Motion Open Creative License.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white font-comic flex items-center gap-2">
              <FiLock className="w-5 h-5 text-yellow-400" />
              <span>4. Enterprise Zero-Data-Retention (ZDR)</span>
            </h2>
            <p>
              For agencies, media conglomerates, and production companies operating under strict NDAs, we provide an <strong className="text-white">Enterprise Zero-Data-Retention (ZDR) guarantee</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>No prompt query logging;</li>
              <li>Render outputs stored in private, customer-managed AWS S3 or Google Cloud Storage buckets;</li>
              <li>Dedicated isolated GPU clusters with single-tenant VPC peering;</li>
              <li>Custom Enterprise Business Associate & DPA execution.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white font-comic flex items-center gap-2">
              <FiMail className="w-5 h-5 text-cyan-400" />
              <span>5. Inquiries & Custom AI Data Agreements</span>
            </h2>
            <p>
              If your corporate compliance team requires a customized Data Processing Addendum (DPA) or security architecture review:
            </p>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <FiDatabase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">AI Ethics & Security Team</span>
                  <span className="text-xs text-slate-400">ai-ethics@animagent.ai</span>
                </div>
              </div>
              <a
                href="mailto:ai-ethics@animagent.ai"
                className="text-xs font-medium text-purple-400 hover:text-purple-300 underline"
              >
                Request DPA
              </a>
            </div>
          </section>
        </div>

        {/* Footer Navigation Switcher */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>Read related policies:</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-white hover:text-cyan-400 underline">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/policy" className="text-white hover:text-cyan-400 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
