import React, { memo } from "react";
import { IconSparkles, IconCode, IconActivity, IconType, IconLayers, IconSliders } from "./Icons";

const FEATURES = [
  {
    icon: IconSparkles,
    title: "Direct in plain language",
    body: "Brief it like a teammate. The agent turns intent — pacing, mood, emphasis — into concrete motion decisions.",
  },
  {
    icon: IconCode,
    title: "Real compositions, not clips",
    body: "Every video is a code composition you can open, inspect and version. Nothing is a black-box render.",
  },
  {
    icon: IconActivity,
    title: "Beat-synced editing",
    body: "Drop in a track and cuts, punches and reveals snap to the music automatically.",
  },
  {
    icon: IconType,
    title: "Kinetic typography",
    body: "Spring-driven type, masked reveals and per-letter staggers tuned to feel hand-animated.",
  },
  {
    icon: IconLayers,
    title: "Brand kits",
    body: "Lock your fonts, colours and logo once. Every render stays on-brand without re-prompting.",
  },
  {
    icon: IconSliders,
    title: "Iterate by conversation",
    body: "“Slower intro.” “Bigger on the drop.” Each revision keeps history, so you can always step back.",
  },
];

export const FeatureGrid = memo(function FeatureGrid() {
  return (
    <section id="features" className="relative w-full py-24 sm:py-28 border-t border-line scroll-mt-16">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow mb-4">Features</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-fg">
            A motion designer that never sleeps.
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-fg-muted leading-relaxed">
            Studio-grade craft without the studio overhead — built for teams that ship video every week.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-line overflow-hidden bg-line gap-px">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-surface p-6 sm:p-7">
              <span className="w-9 h-9 rounded-lg bg-accent-soft text-accent border border-accent/25 flex items-center justify-center mb-5">
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <h3 className="text-base font-semibold tracking-[-0.015em] text-fg">{title}</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

export default FeatureGrid;
