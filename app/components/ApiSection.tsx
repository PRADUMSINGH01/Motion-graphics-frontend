"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconCheck, IconClipboard, IconTerminal } from "./Icons";

const SNIPPET = `curl -X POST https://api.byreel.ai/api/prompt \\
  -H "x-api-key: $BYREEL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "15s product teaser, kinetic title, cut on the drop",
    "template": "aggressive-zoom-flashcuts"
  }'`;

const POINTS = [
  "Generate videos from your own product, CMS or pipeline",
  "Scoped API keys with per-key usage tracking",
  "Same agent and render quality as the Studio",
];

export const ApiSection = memo(function ApiSection() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  return (
    <section id="developers" className="relative w-full py-24 sm:py-28 border-t border-line scroll-mt-16">
      <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <span className="eyebrow mb-4">Developers</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-fg">
            Motion graphics, one API call away.
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-fg-muted leading-relaxed">
            Personalised intros, release videos, social variants at scale — send a prompt, get a rendered
            composition back.
          </p>
          <ul className="mt-6 space-y-2.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-fg-muted">
                <IconCheck className="w-4 h-4 mt-0.5 text-success shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/api-keys" className="btn btn-primary">
              Get an API key
              <IconArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing#pricing" className="btn btn-ghost">
              See API plans
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <div className="rounded-xl border border-line bg-[#0b0b0e] shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between h-10 px-4 border-b border-white/10">
              <span className="flex items-center gap-2 text-xs font-mono text-white/60">
                <IconTerminal className="w-3.5 h-3.5" />
                Terminal
              </span>
              <button
                type="button"
                onClick={copy}
                className="flex items-center gap-1.5 h-7 px-2 rounded-md text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Copy code"
              >
                {copied ? <IconCheck className="w-3.5 h-3.5" /> : <IconClipboard className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="p-5 text-[12.5px] leading-relaxed font-mono text-white/80 overflow-x-auto">
              <code>{SNIPPET}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ApiSection;
