"use client";

import React, { memo } from "react";
import { IconArrowRight } from "./Icons";

const CHANNELS = [
  {
    name: "Slack community",
    stat: "37k members",
    body: "Swap easing curves, procedural physics tricks and production workflows with motion designers shipping every day.",
    cta: "Join the community",
    href: "https://slack.com",
    icon: "slack",
  },
  {
    name: "X / Twitter",
    stat: "98k followers",
    body: "Release notes, new templates and behind-the-scenes looks at what the motion agent is learning next.",
    cta: "Follow updates",
    href: "https://twitter.com",
    icon: "x",
  },
] as const;

export const CommunitySection = memo(function CommunitySection() {
  return (
    <section className="relative w-full py-24 sm:py-28">
      <div className="container-page max-w-5xl">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="eyebrow mb-4">Community</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-fg">
            Learn alongside other creators.
          </h2>
          <p className="mt-4 text-[15px] text-fg-muted leading-relaxed">
            Motion designers, animators and marketers use byreel to ship video faster. Come see how they work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHANNELS.map((c) => (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group card card-interactive p-6 sm:p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg border border-line bg-surface-2 flex items-center justify-center">
                    {c.icon === "slack" ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.528 2.528 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
                                          <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
                                          <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
                                          <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.528 2.528 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E" />
                                        </svg>
                    ) : (
                      <svg className="w-4 h-4 fill-current text-fg" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                  </span>
                  <span className="text-base font-semibold text-fg">{c.name}</span>
                </div>
                <span className="text-xs font-mono text-fg-subtle">{c.stat}</span>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed mb-6">{c.body}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-fg group-hover:text-accent transition-colors">
                {c.cta}
                <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

export default CommunitySection;
