import Link from "next/link";
import { FiArrowRight, FiPlay } from "react-icons/fi";

const capabilities = [
  ["01", "Direct your scene", "Describe the visual, timing, and feeling in plain language."],
  ["02", "Shape every detail", "Refine the composition, keyframes, and output in one place."],
  ["03", "Ship the final cut", "Export production-ready motion without the hand-off overhead."],
] as const;

export default function MainSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.13'/%3E%3C/svg%3E\"), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px), linear-gradient(var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "180px 180px, 96px 96px, 96px 96px",
          backgroundPosition: "0 0, center center, center center",
          maskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[min(860px,100vh)] max-w-7xl flex-col justify-center px-5 pb-16 pt-32 sm:px-8 lg:px-10 lg:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              <span className="h-px w-7 bg-[var(--accent-primary)]" />
              Motion, made deliberate
            </div>

            <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.055em] text-[var(--text-primary)] sm:text-6xl lg:text-[4.6rem] lg:leading-[0.98]">
              Give every idea a moving form.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
              Animagent turns a creative brief into precise motion graphics — from first direction to final render.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
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

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute -inset-4 border border-[var(--border-subtle)]" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface-card)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-5">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
                  <span className="text-xs font-medium text-[var(--text-secondary)]">New composition</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">00:08:24</span>
              </div>

              <div className="mt-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Direction</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">
                  A quiet title sequence. Paper texture, slow pacing, and a precise final reveal.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-[58px_1fr] gap-3">
                <div className="space-y-3 pt-1.5 font-mono text-[10px] text-[var(--text-muted)]">
                  <p>00:00</p>
                  <p>00:03</p>
                  <p>00:06</p>
                </div>
                <div className="space-y-3">
                  <div className="h-7 rounded-md bg-[color:color-mix(in_srgb,var(--accent-primary)_28%,transparent)]" />
                  <div className="ml-[18%] h-7 w-[72%] rounded-md bg-[color:color-mix(in_srgb,var(--accent-secondary)_34%,transparent)]" />
                  <div className="ml-[42%] h-7 w-[46%] rounded-md bg-[color:color-mix(in_srgb,var(--accent-tertiary)_36%,transparent)]" />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
                <div className="flex -space-x-1.5" aria-hidden="true">
                  <span className="h-5 w-5 rounded-full border-2 border-[var(--surface-card)] bg-[var(--accent-primary)]" />
                  <span className="h-5 w-5 rounded-full border-2 border-[var(--surface-card)] bg-[var(--accent-secondary)]" />
                  <span className="h-5 w-5 rounded-full border-2 border-[var(--surface-card)] bg-[var(--accent-tertiary)]" />
                </div>
                <span className="text-xs font-medium text-[var(--text-secondary)]">Ready to render</span>
              </div>
            </div>
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
