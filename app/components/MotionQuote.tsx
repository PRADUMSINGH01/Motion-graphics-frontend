export default function MotionQuote() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--surface-primary)] px-5 py-20 text-[var(--text-primary)] sm:px-8 sm:py-24 lg:px-10">
      <style>{`
        @keyframes reel-slide {
          0%, 16% { transform: translateX(-17%); opacity: 0; }
          30%, 70% { transform: translateX(0); opacity: 1; }
          84%, 100% { transform: translateX(17%); opacity: 0; }
        }
        @keyframes reel-line {
          0% { transform: translateX(-110%); }
          48%, 100% { transform: translateX(110%); }
        }
        @keyframes reel-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reel-pulse {
          0%, 100% { transform: scale(0.82); opacity: 0.35; }
          50% { transform: scale(1); opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reel-slide, .reel-line, .reel-orbit, .reel-pulse { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Motion direction / 01
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Motion graphics with a point of view.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[var(--text-secondary)] sm:text-right">
            A clean preview of the timing, type, and composition Animagent builds from a single brief.
          </p>
        </div>

        <figure className="relative min-h-[390px] overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[#10130f] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.24)] sm:min-h-[520px] sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(241,234,223,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(241,234,223,0.06) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />

          <div className="relative flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-[#b8b5a8]">
            <span>Animagent motion system</span>
            <span>16:9 · 60 FPS</span>
          </div>

          <div className="relative mx-auto mt-6 flex h-[280px] max-w-4xl items-center justify-center overflow-hidden border-y border-[#eee8dc]/10 sm:mt-10 sm:h-[350px]">
            <div className="reel-orbit absolute h-52 w-52 rounded-full border border-[#cf795d]/35 sm:h-72 sm:w-72" style={{ animation: "reel-orbit 18s linear infinite" }} aria-hidden="true">
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#cf795d]" />
            </div>
            <div className="reel-orbit absolute h-36 w-72 rounded-[50%] border border-[#9caf7f]/30 sm:h-48 sm:w-[420px]" style={{ animation: "reel-orbit 12s linear infinite reverse" }} aria-hidden="true" />
            <div className="reel-pulse absolute h-24 w-24 rounded-full bg-[#a4778c]/20 blur-2xl sm:h-36 sm:w-36" style={{ animation: "reel-pulse 3.2s ease-in-out infinite" }} aria-hidden="true" />

            <div className="relative overflow-hidden px-3 text-center">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#cf795d]">A composed reveal</p>
              <div className="overflow-hidden">
                <p className="reel-slide whitespace-nowrap text-[clamp(3.6rem,11vw,9.5rem)] font-semibold leading-[0.78] tracking-[-0.09em] text-[#eee8dc]" style={{ animation: "reel-slide 6.5s cubic-bezier(0.65,0,0.35,1) infinite" }}>
                  FRAME
                </p>
              </div>
              <div className="mt-4 h-px overflow-hidden bg-[#eee8dc]/15">
                <div className="reel-line h-full w-2/5 bg-[#cf795d]" style={{ animation: "reel-line 3.5s cubic-bezier(0.65,0,0.35,1) infinite" }} />
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 border-t border-[#eee8dc]/10 pt-5 text-xs text-[#b8b5a8] sm:mt-8 sm:grid-cols-3">
            <div className="flex items-center gap-3"><span className="font-mono text-[#cf795d]">01</span><span>Editorial kinetic type</span></div>
            <div className="flex items-center gap-3"><span className="font-mono text-[#cf795d]">02</span><span>Layered spatial timing</span></div>
            <div className="flex items-center gap-3"><span className="font-mono text-[#cf795d]">03</span><span>Texture-led art direction</span></div>
          </div>
        </figure>

        <div className="mt-10 overflow-hidden border-y border-[var(--border-subtle)] py-5 sm:mt-12 sm:py-6">
          <div className="reel-slide flex w-max items-center gap-6 whitespace-nowrap" style={{ animation: "reel-slide 7s cubic-bezier(0.65,0,0.35,1) infinite" }} aria-hidden="true">
            <span className="text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.07em] text-[var(--text-primary)]">MAKE</span>
            <span className="text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.07em] text-[var(--accent-primary)]">EVERY</span>
            <span className="text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.07em] text-[var(--text-primary)]">FRAME</span>
            <span className="text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.07em] text-[var(--text-secondary)]">MATTER.</span>
          </div>
          <p className="sr-only">Make every frame matter.</p>
        </div>
      </div>
    </section>
  );
}
