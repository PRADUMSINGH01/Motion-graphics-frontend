"use client";
import Link from "next/link";
import { FiArrowRight, FiPlay, FiDownload, FiCode, FiZap, FiLayers } from "react-icons/fi";
import { FieldBackground } from "./MotionQuote";
import { useEffect, useRef, useState } from "react";

/* ── Typewriter ── */
function TypewriterBadge() {
  const textRef = useRef<HTMLSpanElement>(null);
  const phrases = [
    "Motion, made deliberate",
    "Ideas that move",
    "Animate anything",
    "Your creative AI studio",
  ];
  useEffect(() => {
    const state = { idx: 0, char: 0, deleting: false };
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = phrases[state.idx];
      if (!textRef.current) return;
      if (!state.deleting) {
        textRef.current.textContent = current.slice(0, state.char + 1);
        state.char++;
        if (state.char === current.length) {
          state.deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
      } else {
        textRef.current.textContent = current.slice(0, state.char - 1);
        state.char--;
        if (state.char === 0) {
          state.deleting = false;
          state.idx = (state.idx + 1) % phrases.length;
        }
      }
      timer = setTimeout(tick, state.deleting ? 42 : 68);
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <span ref={textRef} className="inline-block min-w-[1ch]">
      Motion, made deliberate
    </span>
  );
}

/* ── Animated counter ── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(ease * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Stats ── */
const stats = [
  { value: 60, suffix: "FPS", label: "Broadcast Quality" },
  { value: 10, suffix: "x", label: "Faster Workflow" },
  { value: 4, suffix: "K", label: "Max Resolution" },
];

/* ── Ticker items ── */
const scrollItems = [
  { icon: <FiCode className="h-3.5 w-3.5" />, text: "HTML Export" },
  { icon: <FiLayers className="h-3.5 w-3.5" />, text: "CSS Animations" },
  { icon: <FiZap className="h-3.5 w-3.5" />, text: "JS Motion" },
  { icon: <FiDownload className="h-3.5 w-3.5" />, text: "MP4 · WebM · SVG" },
  { icon: <FiPlay className="h-3.5 w-3.5" />, text: "4K Render" },
  { icon: <FiCode className="h-3.5 w-3.5" />, text: "Transparent Overlays" },
  { icon: <FiLayers className="h-3.5 w-3.5" />, text: "Brand Presets" },
  { icon: <FiZap className="h-3.5 w-3.5" />, text: "AI Keyframes" },
  { icon: <FiDownload className="h-3.5 w-3.5" />, text: "Commercial License" },
  { icon: <FiPlay className="h-3.5 w-3.5" />, text: "No Hand-off Needed" },
];

/* ── Infinite scroll ticker ── */
function ScrollTicker() {
  const doubled = [...scrollItems, ...scrollItems];
  return (
    <div
      className="relative w-full overflow-hidden py-3.5 border-y"
      style={{
        borderColor: "var(--border-subtle)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="flex gap-5 w-max"
        style={{ animation: "scrollTicker 34s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.14em] whitespace-nowrap"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--border-subtle)",
              background: "color-mix(in srgb, var(--accent-primary) 5%, transparent)",
            }}
          >
            <span style={{ color: "var(--accent-primary)" }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Export format pills ── */
const exportFormats = ["MP4", "WebM", "SVG", "HTML + CSS", "JS Scroll", "GIF", "Transparent PNG"];

/* ── Capabilities ── */
const capabilities = [
  {
    number: "01",
    icon: "⚡",
    title: "Direct your scene",
    description: "Describe the visual, timing, and feeling in plain language. byreel translates intent into precise keyframes.",
  },
  {
    number: "02",
    icon: "◈",
    title: "Shape every detail",
    description: "Refine composition, physics, and brand colors with granular controls — all in one unified studio.",
  },
  {
    number: "03",
    icon: "▶",
    title: "Ship the final cut",
    description: "Export production-ready MP4, WebM, or HTML · CSS · JS scrolls — drop straight into your YouTube workflow.",
  },
] as const;

export default function MainSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      {/* Animated field background — untouched */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-35" aria-hidden="true">
        <FieldBackground />
      </div>
      {/* Noise + grid overlay — untouched */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.13'/%3E%3C/svg%3E\"), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px), linear-gradient(var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "180px 180px, 96px 96px, 96px 96px",
          backgroundPosition: "0 0, center center, center center",
          maskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
        }}
      />
      {/* Accent glow orb */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] z-0 opacity-25"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 55% at 50% 0%, var(--accent-primary), transparent 70%)" }}
      />
      {/* Side accent glows */}
      <div
        className="pointer-events-none absolute top-1/4 -left-24 w-[360px] h-[360px] z-0 opacity-[0.08]"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, var(--accent-secondary), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-24 w-[320px] h-[320px] z-0 opacity-[0.08]"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, var(--accent-tertiary), transparent 70%)" }}
      />

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 mx-auto flex min-h-[min(900px,100vh)] max-w-7xl flex-col justify-center px-5 pb-16 pt-32 sm:px-8 lg:px-10 lg:pt-36">
        <div className="mx-auto max-w-4xl text-center">

          {/* Animated badge */}
          <div
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-glass)] px-4 py-1.5 backdrop-blur-sm"
            style={{ boxShadow: "0 0 20px color-mix(in srgb, var(--accent-primary) 18%, transparent)" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              <TypewriterBadge />
            </span>
          </div>

          {/* ── PREMIUM HEADLINE ── */}
          <h1
            className="mx-auto max-w-4xl font-bold text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(3rem, 9vw, 6.2rem)",
              lineHeight: "0.92",
              letterSpacing: "-0.06em",
              fontFamily: "var(--font-headline)",
            }}
          >
            Give every{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 55%, var(--accent-tertiary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              idea
            </span>
            {" "}a{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 200,
                letterSpacing: "-0.02em",
              }}
            >
              moving
            </em>{" "}
            form.
          </h1>

          {/* Sub-label */}
          <p
            className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "var(--accent-tertiary)" }}
          >
            AI Motion Graphics Studio &nbsp;·&nbsp; Built for YouTube Creators
          </p>

          {/* Subheadline */}
          <p
            className="mx-auto mt-7 max-w-2xl text-[var(--text-secondary)]"
            style={{ fontSize: "clamp(1rem, 2vw, 1.18rem)", lineHeight: "1.78" }}
          >
            byreel turns a creative brief into{" "}
            <strong className="font-semibold text-[var(--text-primary)]">precise motion graphics</strong>
            {" "}— from first direction to{" "}
            <strong className="font-semibold text-[var(--text-primary)]">final render</strong>.
            Export as{" "}
            <strong className="font-semibold text-[var(--text-primary)]">HTML · CSS · JS</strong>
            {" "}scrolls so YouTubers drop it straight into their workflow.
          </p>

          {/* Export format pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {exportFormats.map((fmt) => (
              <span
                key={fmt}
                className="inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-200 hover:scale-105"
                style={{
                  color: "var(--accent-primary)",
                  background: "color-mix(in srgb, var(--accent-primary) 10%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent-primary) 22%, transparent)",
                }}
              >
                {fmt}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group relative inline-flex min-h-[52px] items-center justify-center gap-2.5 overflow-hidden rounded-xl px-8 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, var(--accent-primary) 0%, color-mix(in srgb, var(--accent-primary) 75%, var(--accent-secondary)) 100%)",
                color: "var(--background)",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--accent-primary) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)",
                letterSpacing: "0.01em",
              }}
            >
              <span className="relative z-10">Start creating free</span>
              <FiArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />
            </Link>

            <Link
              href="/workspace"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-glass)] px-8 text-sm font-semibold text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--surface-card)] hover:border-[var(--accent-primary)] hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: "color-mix(in srgb, var(--accent-primary) 20%, transparent)" }}
              >
                <FiPlay className="h-3 w-3 text-[var(--accent-primary)]" aria-hidden="true" />
              </span>
              Open studio
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-5 text-xs text-[var(--text-muted)]">
            Production-ready exports &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Cancel anytime
          </p>

          {/* ── Animated Stats ── */}
          <div className="mt-14 flex items-center justify-center gap-10 sm:gap-20">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <p
                  className="font-bold tabular-nums tracking-[-0.04em] transition-transform duration-300 group-hover:scale-105"
                  style={{
                    fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                    backgroundImage: "linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <div
                  className="mx-auto mt-1.5 h-px w-8 transition-all duration-500 group-hover:w-16"
                  style={{ background: "linear-gradient(90deg, transparent, var(--accent-primary), transparent)" }}
                />
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Infinite scroll ticker ── */}
      <div className="relative z-10">
        <ScrollTicker />
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--text-muted)]">
            How it works
          </span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>

        <div className="grid sm:grid-cols-3 gap-0 sm:gap-8 lg:gap-12">
          {capabilities.map(({ number, icon, title, description }) => (
            <div
              key={number}
              className="group relative flex flex-col gap-4 py-8 sm:py-6 border-t border-[var(--border-subtle)] sm:border-t-0 first:border-t-0 transition-all duration-300"
            >
              {/* Hover accent top-line */}
              <div
                className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))" }}
              />

              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-primary)]">
                  {number}
                </span>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-base transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    color: "var(--accent-primary)",
                    background: "color-mix(in srgb, var(--accent-primary) 12%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent-primary) 25%, transparent)",
                  }}
                >
                  {icon}
                </span>
              </div>

              <div>
                <h2
                  className="text-base font-bold tracking-[-0.02em] text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  {title}
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-7 text-[var(--text-secondary)]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline keyframes for scroll ticker */}
      <style>{`
        @keyframes scrollTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
