import React, { memo } from "react";
import Link from "next/link";
import { IconArrowRight } from "./Icons";

export const PreFooterCTA = memo(function PreFooterCTA() {
  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid"
        style={{
          maskImage: "radial-gradient(ellipse 60% 70% at 50% 100%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 100%, black 20%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-[900px] h-[360px]"
        style={{ background: "radial-gradient(ellipse 50% 60% at 50% 100%, var(--accent-soft), transparent 70%)" }}
      />

      <div className="relative container-page max-w-3xl text-center flex flex-col items-center">
        <span className="eyebrow mb-5">Get started</span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.045em] leading-[1.05] text-fg">
          Your next video is
          <br />
          one prompt away.
        </h2>
        <p className="mt-6 text-base sm:text-lg text-fg-muted max-w-xl leading-relaxed">
          Free for individuals. Collaborative workspaces, brand kits and API access when your team is ready.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/register" className="btn btn-lg btn-primary min-w-[180px]">
            Start for free
            <IconArrowRight className="w-4 h-4" />
          </Link>
          <a href="mailto:support@byreel.ai?subject=byreel%20for%20teams" className="btn btn-lg btn-secondary min-w-[180px]">
            Talk to sales
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-fg-subtle">
          <span>Runs in the browser</span>
          <span aria-hidden="true">·</span>
          <span>No install needed</span>
          <span aria-hidden="true">·</span>
          <span>REST API</span>
        </div>
      </div>
    </section>
  );
});

export default PreFooterCTA;
