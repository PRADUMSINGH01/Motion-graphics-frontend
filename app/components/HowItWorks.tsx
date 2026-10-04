import React, { memo } from "react";
import { IconSparkles, IconCode, IconDownload, IconCheck } from "./Icons";

const STEPS = [
  {
    n: "01",
    icon: IconSparkles,
    title: "Describe the shot",
    body: "Write what you want the way you'd brief a motion designer — mood, pacing, copy, brand colours. Drop in a reference or start from a template.",
  },
  {
    n: "02",
    icon: IconCode,
    title: "The agent builds it",
    body: "byreel plans the beats, writes a real code composition, tunes the easing and syncs cuts to your audio. You watch it render live.",
  },
  {
    n: "03",
    icon: IconDownload,
    title: "Refine and export",
    body: "Ask for changes in plain language — “slower intro”, “punchier on the drop” — then export a broadcast-ready file in the format you need.",
  },
];

function PromptVisual() {
  return (
    <div className="rounded-lg border border-line bg-canvas-subtle p-3 text-[12px] leading-relaxed text-fg-muted">
      <span className="text-fg">Bold title card for our Series A.</span> Dark background, one accent colour,
      words land on the beat
      <span className="inline-block w-[2px] h-3.5 align-[-2px] ml-0.5 bg-accent animate-pulse" />
    </div>
  );
}

function BuildVisual() {
  const rows = [
    { label: "Plan 4 beats · 6.0s", done: true },
    { label: "Compose TitleCard.tsx", done: true },
    { label: "Sync cuts to 120 BPM", done: false },
  ];
  return (
    <ul className="rounded-lg border border-line bg-canvas-subtle p-3 space-y-1.5 font-mono text-[11.5px]">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center gap-2">
          {r.done ? (
            <IconCheck className="w-3.5 h-3.5 text-success shrink-0" />
          ) : (
            <span className="w-3.5 h-3.5 shrink-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          )}
          <span className={r.done ? "text-fg-muted" : "text-fg"}>{r.label}</span>
        </li>
      ))}
    </ul>
  );
}

function ExportVisual() {
  const formats = [
    { label: "MP4 · H.264", meta: "1080p", active: true },
    { label: "ProRes 4444", meta: "4K" },
    { label: "WebM · alpha", meta: "4K" },
  ];
  return (
    <div className="rounded-lg border border-line bg-canvas-subtle p-1.5 space-y-1 text-[12px]">
      {formats.map((f) => (
        <div
          key={f.label}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md ${
            f.active ? "bg-accent-soft text-fg border border-accent/30" : "text-fg-muted border border-transparent"
          }`}
        >
          <span>{f.label}</span>
          <span className="font-mono text-[11px] text-fg-subtle">{f.meta}</span>
        </div>
      ))}
    </div>
  );
}

const VISUALS = [PromptVisual, BuildVisual, ExportVisual];

export const HowItWorks = memo(function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-24 sm:py-28 scroll-mt-16">
      <div className="container-page">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow mb-4">How it works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-fg">
            From brief to final cut
            <br className="hidden sm:block" /> in three steps.
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-fg-muted leading-relaxed max-w-xl">
            No keyframes, no plugin hunting, no render-queue babysitting. You direct; the agent does the
            frame-by-frame work.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map(({ n, icon: Icon, title, body }, i) => {
            const Visual = VISUALS[i];
            return (
              <li key={n} className="card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <span className="w-9 h-9 rounded-lg border border-line bg-surface-2 flex items-center justify-center text-fg">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="font-mono text-xs text-fg-subtle">{n}</span>
                </div>
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-fg">{title}</h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed mb-6">{body}</p>
                <div className="mt-auto" aria-hidden="true">
                  <Visual />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
});

export default HowItWorks;
