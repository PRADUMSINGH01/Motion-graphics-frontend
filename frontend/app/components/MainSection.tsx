import Link from "next/link";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { FieldBackground } from "./MotionQuote";

const capabilities = [
  ["01", "Direct your scene", "Describe the visual, timing, and feeling in plain language."],
  ["02", "Shape every detail", "Refine the composition, keyframes, and output in one place."],
  ["03", "Ship the final cut", "Export production-ready motion without the hand-off overhead."],
] as const;

export default function MainSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-35" aria-hidden="true">
        <FieldBackground />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.13'/%3E%3C/svg%3E\"), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px), linear-gradient(var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "180px 180px, 96px 96px, 96px 96px",
          backgroundPosition: "0 0, center center, center center",
          maskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[min(860px,100vh)] max-w-7xl flex-col justify-center px-5 pb-16 pt-32 sm:px-8 lg:px-10 lg:pt-36">
        <div className="flex justify-center">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 inline-flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              <span className="h-px w-7 bg-[var(--accent-primary)]" />
              Motion, made deliberate
            </div>

            <h1 className="mx-auto max-w-xl text-5xl font-semibold tracking-[-0.055em] text-[var(--text-primary)] sm:text-6xl lg:text-[4.6rem] lg:leading-[0.98]">
              Give every idea a moving form.
            </h1>

            <p className="mx-auto mt-7 max-w-lg text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
              byreel turns a creative brief into precise motion graphics — from first direction to final render.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--text-primary)] px-5 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start creating
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/workspace"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-glass)] px-5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-card)]"
              >
                <FiPlay className="h-3.5 w-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                Open studio
              </Link>
            </div>

            <p className="mt-5 text-xs text-[var(--text-muted)]">
              Production-ready exports. No credit card required.
            </p>
          </div>

          
        </div>

        <div className="mt-16 grid border-t border-[var(--border-subtle)] pt-7 sm:grid-cols-3 sm:gap-8 lg:mt-20">
          {capabilities.map(([number, title, description]) => (
            <div key={number} className="flex gap-4 py-4 sm:py-0">
              <span className="font-mono text-xs text-[var(--accent-primary)]">{number}</span>
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
                <p className="mt-1.5 max-w-xs text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
