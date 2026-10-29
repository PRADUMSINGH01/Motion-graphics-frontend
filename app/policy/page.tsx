import React from "react";
import Link from "next/link";
import NotebookShell from "../components/landing/NotebookShell";
import {
  FiShield,
  FiLock,
  FiEyeOff,
  FiDatabase,
  FiClock,
  FiMail,
  FiServer,
  FiArrowRight,
} from "react-icons/fi";

export const metadata = {
  title: "Privacy Policy · byreel.in",
  description:
    "Learn how byreel AI safeguards your personal information, generation prompts, and rendered motion graphics.",
};

export default function PolicyPage() {
  return (
    <NotebookShell ariaLabel="byreel.in Privacy Policy">
      <div className="mx-auto w-full max-w-4xl py-6 sm:py-10 px-4 sm:px-6 space-y-8 text-[#07142e]">
        {/* Page Header */}
        <div className="space-y-3 pb-6 border-b border-[rgba(7,20,46,0.18)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#c5ef26]/35 text-[#07142e] border border-[#07142e]/30">
            <FiShield className="w-3.5 h-3.5 text-[#07142e]" />
            <span>DATA PROTECTION &amp; PRIVACY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#07142e] m-0">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[rgba(7,20,46,0.7)] pt-1">
            <span className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-[#4d7c0f]" />
              Effective: September 4, 2026
            </span>
            <span>•</span>
            <span>GDPR &amp; CCPA Compliant</span>
            <span>•</span>
            <span className="text-[#4d7c0f] font-bold">Zero Data Brokering</span>
          </div>
        </div>

        {/* Privacy Commitments Card */}
        <div className="p-5 sm:p-6 rounded-2xl border-1.5 border-[rgba(7,20,46,0.22)] bg-[rgba(255,253,248,0.85)] shadow-xs backdrop-blur-xs">
          <h2 className="text-xs font-mono font-bold text-[#07142e] uppercase tracking-wider mb-3 flex items-center gap-2">
            <FiLock className="w-4 h-4 text-[#4d7c0f]" />
            <span>Core Privacy Pillars</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[rgba(255,253,248,0.95)] border border-[rgba(7,20,46,0.16)] space-y-1">
              <span className="font-bold text-[#07142e] flex items-center gap-1.5">
                <FiEyeOff className="w-3.5 h-3.5 text-[#dc2626]" />
                Never Sold or Rented
              </span>
              <p className="text-[rgba(7,20,46,0.75)] leading-relaxed m-0">
                We never sell, monetize, or broker your personal information, prompt logs, or animations to data brokers.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[rgba(255,253,248,0.95)] border border-[rgba(7,20,46,0.16)] space-y-1">
              <span className="font-bold text-[#07142e] flex items-center gap-1.5">
                <FiServer className="w-3.5 h-3.5 text-[#07142e]" />
                AES-256 Storage
              </span>
              <p className="text-[rgba(7,20,46,0.75)] leading-relaxed m-0">
                All cloud timeline states and rendered video outputs are encrypted at rest with military-grade AES-256.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[rgba(255,253,248,0.95)] border border-[rgba(7,20,46,0.16)] space-y-1">
              <span className="font-bold text-[#07142e] flex items-center gap-1.5">
                <FiDatabase className="w-3.5 h-3.5 text-[#4d7c0f]" />
                One-Click Data Purge
              </span>
              <p className="text-[rgba(7,20,46,0.75)] leading-relaxed m-0">
                You maintain complete authority to request an immediate, irreversible wipe of your workspace records.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8 text-[13.5px] leading-relaxed text-[rgba(7,20,46,0.85)]">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              1. Overview &amp; Commitment
            </h2>
            <p className="m-0">
              At byreel.in, we consider creative confidentiality foundational to our software. This Privacy Policy details how we collect, store, process, and safeguard information when you interact with our web applications, AI prompt agents, rendering APIs, and support channels.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              2. Data We Collect
            </h2>
            <p className="m-0">We collect only the information necessary to fulfill autonomous animation generation:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[rgba(7,20,46,0.8)]">
              <li>
                <strong className="text-[#07142e]">Account Identification:</strong> When registering, we store your name, business email address, hashed password, and billing profile via PCI-DSS compliant payment gateways (Stripe).
              </li>
              <li>
                <strong className="text-[#07142e]">Creative Inputs &amp; Motion Prompts:</strong> Text descriptions, color hex codes, timing cues, and vector paths submitted to our agent workspace.
              </li>
              <li>
                <strong className="text-[#07142e]">Render Outputs &amp; Project Files:</strong> Compiled MP4 video files, transparent RGBA WebM, Remotion templates, and canvas state caches.
              </li>
              <li>
                <strong className="text-[#07142e]">Performance Telemetry:</strong> Anonymized WebGL FPS metrics, GPU compilation latency, and crash stack traces to maintain cluster stability.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              3. Strict Prompt &amp; Animation Privacy
            </h2>
            <p className="m-0">
              Your creative prompts, brand palettes, and resulting motion graphics are <strong className="text-[#07142e]">strictly confidential by default</strong>. They are accessible only to your authenticated account session.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              4. Cookies &amp; Session Storage
            </h2>
            <p className="m-0">
              We utilize essential local storage and security session cookies strictly to keep you authenticated, preserve your workspace layout preferences, and maintain playback settings. We do not deploy third-party advertising tracking pixels.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              5. Trusted Infrastructure Sub-processors
            </h2>
            <p className="m-0">
              To deliver ultra-low latency 60FPS motion generation, we collaborate with enterprise-grade infrastructure providers operating under strict Data Processing Agreements (DPAs):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[rgba(255,253,248,0.85)] border border-[rgba(7,20,46,0.18)]">
                <h3 className="text-xs font-bold text-[#07142e] m-0">GPU Cloud Clusters</h3>
                <p className="text-[11.5px] text-[rgba(7,20,46,0.7)] mt-1 m-0">
                  Isolated compute instances with ephemeral container execution.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[rgba(255,253,248,0.85)] border border-[rgba(7,20,46,0.18)]">
                <h3 className="text-xs font-bold text-[#07142e] m-0">Payment Processing</h3>
                <p className="text-[11.5px] text-[rgba(7,20,46,0.7)] mt-1 m-0">
                  Stripe Inc. handles all credit card transactions under PCI-DSS Level 1 certification.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              6. Your International Privacy Rights (GDPR &amp; CCPA)
            </h2>
            <p className="m-0">Regardless of your geographical location, byreel.in extends comprehensive data rights:</p>
            <ul className="list-disc pl-5 space-y-1 text-[rgba(7,20,46,0.8)]">
              <li><strong className="text-[#07142e]">Right of Access:</strong> Request a complete JSON export of all stored prompts and project metadata.</li>
              <li><strong className="text-[#07142e]">Right to Rectification:</strong> Update inaccurate account or billing details immediately in settings.</li>
              <li><strong className="text-[#07142e]">Right to Erasure (&quot;Be Forgotten&quot;):</strong> Request irreversible deletion of your account and all rendered media.</li>
              <li><strong className="text-[#07142e]">Right to Object:</strong> Restrict telemetry and diagnostic data transmission.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              7. Data Protection Officer &amp; Requests
            </h2>
            <p className="m-0">
              For privacy inquiries, GDPR Data Subject Access Requests (DSAR), or CCPA disclosure requests, contact our compliance officer:
            </p>
            <div className="p-4 rounded-xl bg-[rgba(255,253,248,0.9)] border border-[rgba(7,20,46,0.2)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c5ef26]/30 text-[#07142e] flex items-center justify-center font-bold">
                  <FiMail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#07142e] block">Data Protection Office</span>
                  <span className="text-xs font-mono text-[rgba(7,20,46,0.7)]">privacy@byreel.in</span>
                </div>
              </div>
              <a
                href="mailto:privacy@byreel.in"
                className="text-xs font-bold text-[#07142e] hover:underline"
              >
                Submit Request
              </a>
            </div>
          </section>
        </div>

        {/* Footer Navigation Switcher */}
        <div className="pt-6 border-t border-[rgba(7,20,46,0.18)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[rgba(7,20,46,0.7)]">
          <span>Read related policies:</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[#07142e] font-bold hover:underline">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/templates" className="text-[#07142e] font-bold hover:underline">
              Studio Templates
            </Link>
          </div>
        </div>
      </div>
    </NotebookShell>
  );
}