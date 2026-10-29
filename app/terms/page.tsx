import React from "react";
import Link from "next/link";
import NotebookShell from "../components/landing/NotebookShell";
import {
  FiFileText,
  FiCheckCircle,
  FiShield,
  FiLock,
  FiCpu,
  FiClock,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

export const metadata = {
  title: "Terms & Conditions · byreel.in",
  description:
    "Terms and conditions governing the use of byreel AI autonomous animation generation services.",
};

export default function TermsPage() {
  return (
    <NotebookShell ariaLabel="byreel.in Terms & Conditions">
      <div className="mx-auto w-full max-w-4xl py-6 sm:py-10 px-4 sm:px-6 space-y-8 text-[#07142e]">
        {/* Page Header */}
        <div className="space-y-3 pb-6 border-b border-[rgba(7,20,46,0.18)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#c5ef26]/35 text-[#07142e] border border-[#07142e]/30">
            <FiFileText className="w-3.5 h-3.5 text-[#07142e]" />
            <span>LEGAL AGREEMENT &amp; TERMS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#07142e] m-0">
            Terms &amp; Conditions
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[rgba(7,20,46,0.7)] pt-1">
            <span className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-[#4d7c0f]" />
              Effective: September 4, 2026
            </span>
            <span>•</span>
            <span>Version 2.4</span>
            <span>•</span>
            <span className="text-[#4d7c0f] font-bold">Commercial Rights Included</span>
          </div>
        </div>

        {/* Key Highlights Summary Card */}
        <div className="p-5 sm:p-6 rounded-2xl border-1.5 border-[rgba(7,20,46,0.22)] bg-[rgba(255,253,248,0.85)] shadow-xs backdrop-blur-xs">
          <h2 className="text-xs font-mono font-bold text-[#07142e] uppercase tracking-wider mb-3 flex items-center gap-2">
            <FiShield className="w-4 h-4 text-[#4d7c0f]" />
            <span>Quick Summary of Your Rights</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[rgba(255,253,248,0.95)] border border-[rgba(7,20,46,0.16)] space-y-1">
              <span className="font-bold text-[#07142e] flex items-center gap-1.5">
                <FiCheckCircle className="w-3.5 h-3.5 text-[#4d7c0f]" />
                100% Output Ownership
              </span>
              <p className="text-[rgba(7,20,46,0.75)] leading-relaxed m-0">
                You own all generated motion graphics, keyframe data, SVG paths, and WebM/MP4 renders for unrestricted commercial use.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[rgba(255,253,248,0.95)] border border-[rgba(7,20,46,0.16)] space-y-1">
              <span className="font-bold text-[#07142e] flex items-center gap-1.5">
                <FiLock className="w-3.5 h-3.5 text-[#07142e]" />
                No Asset Training
              </span>
              <p className="text-[rgba(7,20,46,0.75)] leading-relaxed m-0">
                We do NOT train our proprietary models on your private creative prompts or client assets.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[rgba(255,253,248,0.95)] border border-[rgba(7,20,46,0.16)] space-y-1">
              <span className="font-bold text-[#07142e] flex items-center gap-1.5">
                <FiCpu className="w-3.5 h-3.5 text-[#4d7c0f]" />
                Compute Transparency
              </span>
              <p className="text-[rgba(7,20,46,0.75)] leading-relaxed m-0">
                Clear allocation of monthly GPU rendering credits with rollover guarantees and instant plan cancellations.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="space-y-8 text-[13.5px] leading-relaxed text-[rgba(7,20,46,0.85)]">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              1. Agreement to Terms
            </h2>
            <p className="m-0">
              These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Client&quot;, or &quot;You&quot;) and byreel.in (&quot;Company&quot;, &quot;byreel&quot;, &quot;we&quot;, &quot;us&quot;), governing your access to and usage of the byreel autonomous animation platform, website, AI rendering APIs, and related creative software services.
            </p>
            <p className="m-0">
              By creating an account, running generation prompts, reusing motion assets, or purchasing subscription credits, you affirm that you are at least 18 years of age and legally authorized to enter into this agreement.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              2. Description of Autonomous AI Agent Services
            </h2>
            <p className="m-0">
              byreel.in provides an interactive generative workspace where users supply natural language descriptions, vector specifications, and timing parameters. Our autonomous agents translate these inputs into procedural animation code, keyframed timeline data, SVG geometry, WebM/MP4 video streams, and interactive motion components.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              3. User Accounts and Security
            </h2>
            <p className="m-0">
              To access cloud rendering and asset history, you must register for an account. You are solely responsible for maintaining the confidentiality of your credentials and API tokens. Any activity conducted through your authenticated session is your legal responsibility.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              4. Intellectual Property &amp; Commercial Ownership
            </h2>
            <div className="space-y-2 pl-4 border-l-2 border-[#07142e]">
              <h3 className="text-xs font-bold text-[#07142e] m-0 uppercase tracking-wider">4.1 User Input Data</h3>
              <p className="m-0">
                You retain complete, unencumbered ownership of all text prompts, brand assets, logos, sketches, and audio tracks you provide to byreel.
              </p>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-[#84cc16]">
              <h3 className="text-xs font-bold text-[#07142e] m-0 uppercase tracking-wider">4.2 Generated Motion Output</h3>
              <p className="m-0">
                Subject to your active subscription or valid compute credit usage, <strong className="text-[#07142e]">byreel assigns to you 100% of all worldwide rights, title, and interest</strong> in the motion graphics rendered through your prompts. You are entitled to copy, broadcast, broadcast-license, sell, monetize, and distribute these renders without royalties or attribution.
              </p>
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-[rgba(7,20,46,0.3)]">
              <h3 className="text-xs font-bold text-[#07142e] m-0 uppercase tracking-wider">4.3 Platform Rights</h3>
              <p className="m-0">
                byreel retains ownership of the underlying software infrastructure, neural network architecture, proprietary shaders, canvas engine, user interface elements, and brand trademarks.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              5. GPU Compute Credits &amp; Subscriptions
            </h2>
            <p className="m-0">
              Subscriptions grant access to monthly GPU rendering allocations. Unused plan credits roll over for up to 60 days on active memberships.
            </p>
            <p className="m-0">
              All subscription charges are billed in advance on a recurring monthly or annual basis. You may cancel your subscription at any time via your account settings; cancellations take effect at the conclusion of the billing cycle.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              6. Acceptable Use Policy
            </h2>
            <p className="m-0">You agree not to use byreel to generate or disseminate:</p>
            <ul className="list-disc pl-5 space-y-1 text-[rgba(7,20,46,0.8)]">
              <li>Defamatory animations or deliberate disinformation;</li>
              <li>Content violating valid copyrights, trademarks, or trade secrets of third parties;</li>
              <li>Visuals promoting violent extremism, hate speech, or harassment;</li>
              <li>Automated bot attacks attempting to reverse-engineer our model APIs.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              7. Limitation of Liability
            </h2>
            <p className="m-0">
              To the maximum extent permitted by applicable law, byreel.in shall not be liable for indirect, incidental, punitive, or consequential damages resulting from loss of profits, data corruption, or business interruption arising from the use of our autonomous generative software.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#07142e] m-0">
              8. Contact &amp; Legal Inquiries
            </h2>
            <p className="m-0">
              If you have questions regarding these Terms or wish to serve legal notice, contact our team:
            </p>
            <div className="p-4 rounded-xl bg-[rgba(255,253,248,0.9)] border border-[rgba(7,20,46,0.2)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c5ef26]/30 text-[#07142e] flex items-center justify-center font-bold">
                  <FiMail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#07142e] block">Legal &amp; Operations</span>
                  <span className="text-xs font-mono text-[rgba(7,20,46,0.7)]">legal@byreel.in</span>
                </div>
              </div>
              <a
                href="mailto:legal@byreel.in"
                className="text-xs font-bold text-[#07142e] hover:underline"
              >
                Contact Legal
              </a>
            </div>
          </section>
        </div>

        {/* Footer Navigation Switcher */}
        <div className="pt-6 border-t border-[rgba(7,20,46,0.18)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[rgba(7,20,46,0.7)]">
          <span>Read related policies:</span>
          <div className="flex items-center gap-4">
            <Link href="/policy" className="text-[#07142e] font-bold hover:underline">
              Privacy Policy
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