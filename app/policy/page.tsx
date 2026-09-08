import React from "react";
import Link from "next/link";
import BackButton from "../components/BackButton";
import ThemeToggle from "../components/ThemeToggle";
import {
  FiArrowLeft,
  FiShield,
  FiLock,
  FiEyeOff,
  FiDatabase,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiServer,
} from "react-icons/fi";

export const metadata = {
  title: "Privacy Policy - Animagent AI",
  description: "Learn how Animagent AI safeguards your personal information, generation prompts, and rendered motion graphics.",
};

export default function PolicyPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#090a0f] text-slate-700 dark:text-slate-300 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-900/10 via-cyan-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackUrl="/workspace" label="Back to Studio" />
          <ThemeToggle />
        </div>

        {/* Page Header */}
        <div className="space-y-3 pb-8 border-b border-black/10 dark:border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <FiShield className="w-3.5 h-3.5" />
            <span>Data Protection &amp; Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white font-comic">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Effective: September 4, 2026
            </span>
            <span>•</span>
            <span>GDPR &amp; CCPA Compliant</span>
            <span>•</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">Zero Data Brokering</span>
          </div>
        </div>

        {/* Privacy Commitments Card */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121319]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white font-comic uppercase tracking-wider mb-3 flex items-center gap-2">
            <FiLock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Core Privacy Pillars</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.06] space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FiEyeOff className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                Never Sold or Rented
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We never sell, monetize, or broker your personal information, prompt logs, or animations to data brokers.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.06] space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FiServer className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                AES-256 Storage
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                All cloud timeline states and rendered video outputs are encrypted at rest with military-grade AES-256.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.06] space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FiDatabase className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                One-Click Data Purge
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You maintain complete authority to request an immediate, irreversible wipe of your workspace records.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              1. Overview &amp; Commitment
            </h2>
            <p>
              At Animagent AI, we consider creative confidentiality foundational to our software. This Privacy Policy details how we collect, store, process, and safeguard information when you interact with our web applications, AI prompt agents, rendering APIs, and support channels.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              2. Data We Collect
            </h2>
            <p>We collect only the information necessary to fulfill autonomous animation generation:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-950 dark:text-white">Account Identification:</strong> When registering, we store your name, business email address, hashed password, and billing profile via PCI-DSS compliant payment gateways (Stripe).
              </li>
              <li>
                <strong className="text-slate-950 dark:text-white">Creative Inputs &amp; Motion Prompts:</strong> Text descriptions, color hex codes, timing cues, and vector paths submitted to our agent workspace.
              </li>
              <li>
                <strong className="text-slate-950 dark:text-white">Render Outputs &amp; Project Files:</strong> Compiled WebM video files, Lottie JSON, React Three Fiber JSX snippets, and canvas state caches.
              </li>
              <li>
                <strong className="text-slate-950 dark:text-white">Performance Telemetry:</strong> Anonymized WebGL FPS metrics, GPU compilation latency, and crash stack traces to maintain cluster stability.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              3. Strict Prompt &amp; Animation Privacy
            </h2>
            <p>
              Your creative prompts, brand palettes, and resulting motion graphics are <strong className="text-slate-950 dark:text-white">strictly confidential by default</strong>. They are accessible only to your authenticated account session.
            </p>
            <p>
              Only if you explicitly click the &quot;Share to Explore Community&quot; button will your selected animation loop and prompt be indexed publicly for other creators to preview and reuse.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              4. Cookies &amp; Session Storage
            </h2>
            <p>
              We utilize essential local storage and security session cookies strictly to keep you authenticated, preserve your workspace layout preferences, and maintain playback settings. We do not deploy third-party cross-site advertising tracking pixels.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              5. Trusted Infrastructure Sub-processors
            </h2>
            <p>
              To deliver ultra-low latency 60FPS motion generation, we collaborate with enterprise-grade infrastructure providers operating under strict Data Processing Agreements (DPAs):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.06]">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white font-comic">GPU Cloud Clusters</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  AWS &amp; GCP isolated compute instances with ephemeral container execution.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.06]">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white font-comic">Payment Processing</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Stripe Inc. handles all credit card transactions under PCI-DSS Level 1 certification.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              6. Your International Privacy Rights (GDPR &amp; CCPA)
            </h2>
            <p>
              Regardless of your geographical location, Animagent AI extends comprehensive data rights:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-950 dark:text-white">Right of Access:</strong> Request a complete JSON export of all stored prompts and project metadata.</li>
              <li><strong className="text-slate-950 dark:text-white">Right to Rectification:</strong> Update inaccurate account or billing details immediately in settings.</li>
              <li><strong className="text-slate-950 dark:text-white">Right to Erasure (&quot;Be Forgotten&quot;):</strong> Request the irreversible deletion of your account and all rendered media.</li>
              <li><strong className="text-slate-950 dark:text-white">Right to Object:</strong> Restrict telemetry and diagnostic data transmission.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              7. Data Protection Officer &amp; Requests
            </h2>
            <p>
              For privacy inquiries, GDPR Data Subject Access Requests (DSAR), or CCPA disclosure requests, contact our compliance officer:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FiMail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">Data Protection Office</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">privacy@animagent.ai</span>
                </div>
              </div>
              <a
                href="mailto:privacy@animagent.ai"
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline"
              >
                Submit Request
              </a>
            </div>
          </section>
        </div>

        {/* Footer Navigation Switcher */}
        <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span>Read related policies:</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 underline">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/data-usage" className="text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 underline">
              Data Usage &amp; AI Training Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
