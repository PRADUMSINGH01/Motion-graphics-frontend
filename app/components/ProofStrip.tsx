import React, { memo } from "react";

// Product facts rather than borrowed logos: every number here is backed by the render pipeline.
const FACTS = [
  { value: "60", unit: "FPS", label: "Frame-accurate playback" },
  { value: "4K", unit: "UHD", label: "Up to 3840 × 2160 export" },
  { value: "~5", unit: "sec", label: "Typical prompt-to-preview" },
  { value: "3", unit: "formats", label: "MP4 · ProRes 4444 · alpha WebM" },
];

export const ProofStrip = memo(function ProofStrip() {
  return (
    <section aria-label="Platform facts" className="relative w-full border-y border-line bg-canvas-subtle">
      <div className="container-page">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <div
              key={f.label}
              className={`py-8 sm:py-10 px-2 sm:px-6 flex flex-col items-center text-center border-line ${
                i % 2 === 1 ? "border-l" : ""
              } ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dt className="order-2 mt-1.5 text-[13px] text-fg-subtle">{f.label}</dt>
              <dd className="order-1 flex items-baseline gap-1 text-fg">
                <span className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em]">{f.value}</span>
                <span className="text-sm font-mono text-fg-muted">{f.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
});

export default ProofStrip;
