import React from "react";
import Link from "next/link";
import BackButton from "../components/BackButton";
import ThemeToggle from "../components/ThemeToggle";
import {
  FiArrowLeft,
  FiFileText,
  FiCheckCircle,
  FiShield,
  FiCpu,
  FiLock,
  FiClock,
  FiAlertCircle,
  FiMail,
} from "react-icons/fi";

export const metadata = {
  title: "Terms & Conditions - Animagent AI",
  description: "Terms and conditions governing the use of Animagent AI autonomous animation generation services.",
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#090a0f] text-slate-700 dark:text-slate-300 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-900/10 via-cyan-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackUrl="/workspace" label="Back to Studio" />
          <ThemeToggle />
        </div>

        {/* Page Header */}
        <div className="space-y-3 pb-8 border-b border-black/10 dark:border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
            <FiFileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white font-comic">
            Terms &amp; Conditions
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Effective: September 4, 2026
            </span>
            <span>•</span>
            <span>Version 2.4</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Commercial Rights Included</span>
          </div>
        </div>

        {/* Key Highlights Summary Card */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121319]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white font-comic uppercase tracking-wider mb-3 flex items-center gap-2">
            <FiShield className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Quick Summary of Your Rights</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.06] space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                100% Output Ownership
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You own all generated motion graphics, keyframe data, SVG paths, and WebM/MP4 renders for unrestricted commercial use.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.06] space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FiLock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                No Asset Training
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We do NOT train our proprietary foundational models on your private creative prompts or client assets.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.06] space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FiCpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Compute Transparency
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Clear allocation of monthly GPU rendering credits with rollover guarantees and instant plan cancellations.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              1. Agreement to Terms
            </h2>
            <p>
              These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Client&quot;, or &quot;You&quot;) and Animagent AI Inc. (&quot;Company&quot;, &quot;Animagent&quot;, &quot;we&quot;, &quot;us&quot;), governing your access to and usage of the Animagent autonomous animation platform, website, AI rendering APIs, and related creative software services.
            </p>
            <p>
              By creating an account, running generation prompts, reusing motion assets, or purchasing subscription credits, you affirm that you are at least 18 years of age and legally authorized to enter into this agreement.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              2. Description of Autonomous AI Agent Services
            </h2>
            <p>
              Animagent AI provides an interactive generative workspace where users supply natural language descriptions, vector specifications, and timing parameters. Our autonomous agents translate these inputs into procedural animation code, keyframed timeline data, SVG geometry, WebM/MP4 video streams, and interactive React Three Fiber components.
            </p>
            <p>
              We continuously optimize our rendering cluster, model weights, and pipeline algorithms. Features may be updated, modified, or enhanced periodically to maintain state-of-the-art computational performance.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              3. User Accounts and Security
            </h2>
            <p>
              To access cloud rendering and asset history, you must register for an account. You are solely responsible for maintaining the confidentiality of your credentials and API tokens. Any activity conducted through your authenticated session is your legal responsibility. You agree to immediately notify Animagent if you detect any unauthorized account penetration.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              4. Intellectual Property &amp; Commercial Ownership
            </h2>
            <div className="space-y-2 pl-4 border-l-2 border-cyan-500/40">
              <h3 className="font-semibold text-slate-900 dark:text-white">4.1 User Input Data</h3>
              <p>
                You retain complete, unencumbered ownership of all text prompts, brand assets, logos, sketches, and audio tracks you provide to Animagent.
              </p>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-emerald-500/40">
              <h3 className="font-semibold text-slate-900 dark:text-white">4.2 Generated Motion Output</h3>
              <p>
                Subject to your active subscription or valid compute credit usage, <strong className="text-slate-950 dark:text-white">Animagent assigns to you 100% of all worldwide rights, title, and interest</strong> in the motion graphics rendered through your prompts. You are entitled to copy, broadcast, broadcast-license, sell, monetize, and distribute these renders without royalties or attribution.
              </p>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-purple-500/40">
              <h3 className="font-semibold text-slate-900 dark:text-white">4.3 Platform Rights</h3>
              <p>
                Animagent retains ownership of the underlying software infrastructure, neural network architecture, proprietary shaders, spider-web canvas engine, user interface elements, and brand trademarks.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              5. GPU Compute Credits &amp; Subscriptions
            </h2>
            <p>
              Subscriptions (Creator, Studio Pro, Enterprise) grant access to monthly GPU rendering allocations measured in Motion Compute Units (MCUs). Unused plan credits roll over for up to 60 days on active memberships.
            </p>
            <p>
              All subscription charges are billed in advance on a recurring monthly or annual basis. You may cancel your subscription at any time via your account settings; cancellations take effect at the conclusion of the billing cycle. We offer a 14-day refund window on initial annual plan purchases if fewer than 10% of included compute units have been rendered.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              6. Acceptable Use Policy &amp; Content Restrictions
            </h2>
            <p>
              You agree not to use Animagent to generate or disseminate:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Non-consensual deepfakes, defamatory animations, or deliberate disinformation;</li>
              <li>Content violating valid copyrights, trademarks, or trade secrets of third parties;</li>
              <li>Visuals promoting violent extremism, hate speech, or harassment;</li>
              <li>Automated bot attacks attempting to reverse-engineer our model APIs or overwhelm cluster nodes.</li>
            </ul>
            <p>
              Violations may result in instantaneous account termination and forfeiture of remaining compute balances without reimbursement.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              7. Service Level Agreement &amp; Cluster Uptime
            </h2>
            <p>
              We strive to maintain 99.9% cluster availability across our distributed cloud rendering nodes. In the event of unscheduled service interruption exceeding 4 hours, Studio Pro and Enterprise accounts may request compute credit compensation proportional to the downtime duration.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Animagent AI Inc. shall not be liable for indirect, incidental, punitive, or consequential damages resulting from loss of profits, data corruption, or business interruption arising from the use of our autonomous generative software.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white font-comic">
              9. Contact &amp; Legal Inquiries
            </h2>
            <p>
              If you have questions regarding these Terms or wish to serve legal notice, contact our counsel team:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <FiMail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">Legal Affairs Department</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">legal@animagent.ai</span>
                </div>
              </div>
              <a
                href="mailto:legal@animagent.ai"
                className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline"
              >
                Send Notice
              </a>
            </div>
          </section>
        </div>

        {/* Footer Navigation Switcher */}
        <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span>Read related policies:</span>
          <div className="flex items-center gap-4">
            <Link href="/policy" className="text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 underline">
              Privacy Policy
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
