import Link from "next/link";
import {
  IconArrowRight,
  IconSparkles,
  IconPlay,
  IconDownload,
  IconLayers,
  IconType,
  IconActivity,
  IconLayout,
} from "./Icons";

const LAYERS = [
  { name: "KineticTitle.tsx", meta: "spring · damping 14", icon: IconType, active: true },
  { name: "LightSweep.glsl", meta: "interpolate 0 → 30", icon: IconSparkles },
  { name: "GridMesh.tsx", meta: "3D perspective", icon: IconLayout },
  { name: "ImpactStem.wav", meta: "beat sync", icon: IconActivity },
];

const TRACKS = [
  { label: "KineticTitle", left: "4%", width: "46%", tone: "accent" },
  { label: "LightSweep shader", left: "16%", width: "58%", tone: "neutral" },
  { label: "ImpactStem.wav", left: "0%", width: "88%", tone: "success" },
] as const;

export default function MainSection() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40 pb-20 sm:pb-28">
      {/* Background: engineering grid faded towards the edges + soft accent wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid"
        style={{
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[420px] opacity-70"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 0%, var(--accent-soft), transparent 70%)",
        }}
      />

      <div className="relative container-page flex flex-col items-center text-center">
        <Link
          href="/product"
          style={{ animationDelay: "0ms" }}
          className="animate-fade-up group inline-flex items-center gap-2 h-7 pl-1 pr-3 rounded-full border border-line bg-surface/70 backdrop-blur text-[12.5px] text-fg-muted hover:text-fg hover:border-line-strong transition-colors"
        >
          <span className="badge badge-accent h-5 px-2 text-[11px]">New</span>
          <span>Motion Agent 2.0 is live</span>
          <IconArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <h1
          style={{ animationDelay: "70ms" }}
          className="animate-fade-up mt-6 max-w-4xl text-[2.6rem] leading-[1.05] sm:text-6xl md:text-[4.25rem] font-semibold tracking-[-0.045em] text-fg"
        >
          The AI agent for
          <br />
          <span className="text-gradient">motion graphics.</span>
        </h1>

        <p
          style={{ animationDelay: "140ms" }}
          className="animate-fade-up mt-6 max-w-[580px] text-base sm:text-lg leading-relaxed text-fg-muted"
        >
          Describe a scene in plain language. byreel writes the composition, animates it at 60 FPS
          and exports a broadcast-ready MP4 — no timeline wrangling required.
        </p>

        <div
          style={{ animationDelay: "210ms" }}
          className="animate-fade-up mt-9 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link href="/workspace" className="btn btn-lg btn-primary min-w-[170px]">
            Open Studio
            <IconArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/explore" className="btn btn-lg btn-secondary min-w-[170px]">
            Browse templates
          </Link>
        </div>

        <p
          style={{ animationDelay: "280ms" }}
          className="animate-fade-up mt-5 text-[13px] text-fg-subtle"
        >
          Free plan available · No credit card required
        </p>
      </div>

      {/* ── Product mockup ── */}
      <div className="animate-fade-up [animation-delay:350ms] relative container-page mt-16 sm:mt-20">
        <div className="relative rounded-2xl border border-line bg-surface shadow-elevated overflow-hidden text-left select-none">
          {/* Window chrome */}
          <div className="flex items-center justify-between gap-4 h-11 px-4 border-b border-line bg-canvas-subtle">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-fg/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-fg/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-fg/15" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono truncate">
                <span className="text-fg-subtle">launch-film /</span>
                <span className="text-fg">KineticLaunch.tsx</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex badge font-mono text-[11px]">3840 × 2160</span>
              <span className="hidden md:inline-flex badge font-mono text-[11px]">60 FPS</span>
              <span className="btn btn-sm btn-accent h-7 text-xs pointer-events-none">
                <IconDownload className="w-3.5 h-3.5" />
                Export
              </span>
            </div>
          </div>

          {/* Prompt strip */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-line text-xs">
            <IconSparkles className="w-4 h-4 text-accent shrink-0" />
            <span className="text-fg-muted truncate">
              Kinetic title for a product launch — staggered spring entrance, soft light sweep, cut on the bass drop.
            </span>
            <span className="hidden lg:inline-flex ml-auto shrink-0 items-center gap-1.5 text-success font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Rendered in 4.2s
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Layers panel */}
            <aside className="hidden lg:flex lg:col-span-3 flex-col border-r border-line p-3 text-xs">
              <div className="flex items-center justify-between px-1 pb-2.5 text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
                <span className="flex items-center gap-1.5">
                  <IconLayers className="w-3.5 h-3.5" />
                  Layers
                </span>
                <span className="font-mono normal-case tracking-normal">4</span>
              </div>
              <div className="flex flex-col gap-1">
                {LAYERS.map(({ name, meta, icon: Icon, active }) => (
                  <div
                    key={name}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border ${
                      active ? "bg-accent-soft border-accent/30" : "border-transparent hover:bg-fg/[0.04]"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        active ? "bg-accent-solid text-accent-fg" : "bg-surface-3 text-fg-muted"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[12px] font-medium truncate ${active ? "text-fg" : "text-fg-muted"}`}>
                        {name}
                      </span>
                      <span className="text-[10.5px] text-fg-subtle font-mono truncate">{meta}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-3">
                <div className="rounded-lg border border-line bg-canvas-subtle p-3 font-mono text-[10.5px] leading-relaxed text-fg-muted">
                  <div className="mb-1.5 flex justify-between text-fg-subtle">
                    <span>spring()</span>
                    <span className="text-accent">active</span>
                  </div>
                  damping: 14
                  <br />
                  stiffness: 110
                  <br />
                  mass: 0.7
                </div>
              </div>
            </aside>

            {/* Viewport + timeline */}
            <div className="lg:col-span-9 flex flex-col">
              {/* Video viewport — intentionally dark in both themes, like any editor canvas */}
              <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[400px] p-6 bg-[#0b0b0e] overflow-hidden group">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(61,115,245,0.22), transparent 70%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-5 sm:inset-8 rounded-md border border-dashed border-white/10 flex items-start justify-between p-2 text-[9px] font-mono text-white/25"
                >
                  <span>TITLE SAFE</span>
                  <span>16:9</span>
                </div>

                <div className="relative text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10px] font-mono text-white/70">
                    frame 246 · interpolate(0 → 1)
                  </span>
                  <h2 className="mt-4 text-4xl sm:text-6xl font-semibold leading-[0.95] tracking-[-0.045em] text-white">
                    Launch day.
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm font-mono text-white/55">Made with byreel · 60 FPS · H.264</p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-14 h-14 rounded-full bg-white/15 border border-white/25 backdrop-blur flex items-center justify-center text-white">
                    <IconPlay className="w-6 h-6 fill-white ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-line p-3 sm:p-4 space-y-2">
                <div className="flex items-center justify-between pb-1 text-[11px] font-mono text-fg-subtle">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-surface-3 text-fg flex items-center justify-center">
                      <IconPlay className="w-3 h-3 fill-current" />
                    </span>
                    <span className="text-fg">00:04:06</span>
                    <span>/ 00:15:00</span>
                  </div>
                  <span className="hidden sm:inline">Snap · Audio lock</span>
                </div>

                <div className="relative h-1 rounded-full bg-fg/10 overflow-hidden">
                  <div className="h-full w-[27%] bg-accent-solid" />
                </div>

                {TRACKS.map(({ label, left, width, tone }) => (
                  <div key={label} className="relative h-7 rounded-md bg-fg/[0.03] border border-line overflow-hidden">
                    <div
                      className={`absolute top-1 bottom-1 rounded px-2 flex items-center text-[10.5px] font-mono truncate border ${
                        tone === "accent"
                          ? "bg-accent-soft border-accent/40 text-accent"
                          : tone === "success"
                            ? "bg-success/10 border-success/35 text-success"
                            : "bg-fg/[0.06] border-line-strong text-fg-muted"
                      }`}
                      style={{ left, width }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
