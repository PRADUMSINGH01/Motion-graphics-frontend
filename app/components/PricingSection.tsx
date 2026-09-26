"use client";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiZap, FiStar, FiTrendingUp, FiYoutube, FiAward, FiShield } from "react-icons/fi";
import { formatInr, MOTION_CREDIT_PRICE_INR } from "../lib/motionBilling";

const plans = [
  {
    name: "Starter",
    priceInr: 199,
    badge: null,
    tagline: "Perfect to start",
    description: "For YouTubers getting started with AI-powered motion graphics.",
    credits: 20,
    creditsLabel: "20 Motion Credits / mo",
    features: [
      "20 motion generations",
      "1080p MP4 exports",
      "Kinetic text, diagrams & explainers",
      "Standard render queue",
      "Commercial use license",
    ],
    notIncluded: ["4K exports", "Priority rendering", "Brand presets"],
    href: "/register?plan=starter",
    featured: false,
    accentColor: "var(--accent-tertiary)",
  },
  {
    name: "Creator",
    priceInr: 499,
    badge: "Most popular",
    tagline: "Best value",
    description: "For YouTubers creating polished motion graphics for videos every week.",
    credits: 60,
    creditsLabel: "60 Motion Credits / mo",
    features: [
      "60 motion generations",
      "1080p & 4K MP4 exports",
      "Advanced diagrams & explainer animations",
      "Priority render queue",
      "Brand colors, fonts & reusable styles",
      "Transparent WebM exports",
    ],
    notIncluded: [],
    href: "/register?plan=creator",
    featured: true,
    accentColor: "var(--accent-primary)",
  },
  {
    name: "Pro",
    priceInr: 799,
    badge: "Power users",
    tagline: "High volume",
    description: "For high-volume creators producing motion graphics across multiple videos.",
    credits: 100,
    creditsLabel: "100 Motion Credits / mo",
    features: [
      "100 motion generations",
      "4K MP4 exports",
      "Advanced motion graphics & data visualizations",
      "Priority rendering",
      "Reusable brand presets",
      "Multiple YouTube channels",
    ],
    notIncluded: [],
    href: "/register?plan=pro",
    featured: false,
    accentColor: "var(--accent-secondary)",
  },
] as const;

const socialProof = [
  { icon: <FiYoutube className="h-3.5 w-3.5" />, text: "10k+ YouTube creators" },
  { icon: <FiAward className="h-3.5 w-3.5" />, text: "Broadcast-quality output" },
  { icon: <FiShield className="h-3.5 w-3.5" />, text: "Commercial license included" },
  { icon: <FiZap className="h-3.5 w-3.5" />, text: "No render limits on queue" },
];

function CreditBar({ credits, accentColor }: { credits: number; accentColor: string }) {
  const max = 100;
  const pct = Math.round((credits / max) * 100);
  return (
    <div className="mt-3">
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "color-mix(in srgb, var(--border-strong) 60%, transparent)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accentColor}, color-mix(in srgb, ${accentColor} 60%, var(--accent-secondary)))`,
          }}
        >
          {/* Shimmer effect on bar */}
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ animation: "shimmerLaser 2.4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative border-y border-[var(--border-subtle)] bg-[var(--background)] px-5 py-24 text-[var(--text-primary)] sm:px-8 sm:py-32 lg:px-10 overflow-hidden"
    >
      {/* Background glow accents */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-[0.07]"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 0%, var(--accent-primary), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[400px] opacity-[0.05]"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 100% 100%, var(--accent-secondary), transparent 70%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: "linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-6xl relative">

        {/* ── Section header ── */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-glass)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-primary)] backdrop-blur-sm"
            style={{ boxShadow: "0 0 16px color-mix(in srgb, var(--accent-primary) 12%, transparent)" }}
          >
            <FiZap className="h-3 w-3" aria-hidden="true" />
            Pricing for creators
          </div>

          <h2
            className="mt-4 font-bold tracking-[-0.05em] text-[var(--text-primary)]"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.5rem)",
              lineHeight: "0.95",
              fontFamily: "var(--font-headline)",
            }}
          >
            Make more videos.{" "}
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Animate more ideas.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
            Every plan gives you Motion Credits for generating production-ready graphics for YouTube.
            Start small and upgrade when your content volume grows.
          </p>

          {/* Social proof strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {socialProof.map((item, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-subtle)",
                  background: "color-mix(in srgb, var(--accent-primary) 4%, transparent)",
                }}
              >
                <span style={{ color: "var(--accent-primary)" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Pricing cards ── */}
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="relative flex flex-col rounded-2xl transition-all duration-500 hover:-translate-y-2 group"
              style={{
                padding: plan.featured ? "2px" : "1px",
                background: plan.featured
                  ? `linear-gradient(135deg, ${plan.accentColor}, var(--accent-secondary), var(--accent-tertiary))`
                  : "var(--border-strong)",
                boxShadow: plan.featured
                  ? `0 32px 80px color-mix(in srgb, var(--accent-primary) 28%, transparent), 0 8px 32px rgba(0,0,0,0.25)`
                  : "0 4px 20px rgba(0,0,0,0.14)",
              }}
            >
              {/* Most popular label above featured card */}
              {plan.featured && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-[0.18em] whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                    color: "var(--background)",
                    boxShadow: "0 4px 16px color-mix(in srgb, var(--accent-primary) 40%, transparent)",
                  }}
                >
                  <FiStar className="h-2.5 w-2.5" />
                  Most popular
                </div>
              )}

              {/* Inner card */}
              <div
                className="relative flex flex-col flex-1 rounded-[calc(1rem-1px)] overflow-hidden"
                style={{
                  background: plan.featured
                    ? "var(--surface-card)"
                    : "var(--surface-primary)",
                  minHeight: 580,
                }}
              >
                {/* Glow overlay inside featured card */}
                {plan.featured && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    aria-hidden="true"
                    style={{
                      background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${plan.accentColor}, transparent)`,
                    }}
                  />
                )}

                {/* Top section */}
                <div className="relative p-7 pb-0">
                  {/* Badge (non-featured) */}
                  {plan.badge && !plan.featured && (
                    <div className="absolute right-5 top-5 flex items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                        style={{
                          background: "color-mix(in srgb, var(--accent-secondary) 15%, transparent)",
                          color: "var(--accent-secondary)",
                          border: "1px solid color-mix(in srgb, var(--accent-secondary) 30%, transparent)",
                        }}
                      >
                        {plan.name === "Pro" && <FiTrendingUp className="h-2.5 w-2.5" />}
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name & tagline */}
                  <div className="mb-5">
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5"
                      style={{ color: plan.accentColor, fontFamily: "var(--font-headline)" }}
                    >
                      {plan.tagline}
                    </p>
                    <h3
                      className="text-2xl font-bold tracking-[-0.03em] text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-headline)" }}
                    >
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] max-w-[220px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price block */}
                  <div
                    className="rounded-xl p-4 mb-6 relative overflow-hidden"
                    style={{
                      background: plan.featured
                        ? `color-mix(in srgb, ${plan.accentColor} 8%, var(--surface-glass))`
                        : "color-mix(in srgb, var(--border-subtle) 50%, transparent)",
                      border: plan.featured
                        ? `1px solid color-mix(in srgb, ${plan.accentColor} 20%, transparent)`
                        : "none",
                    }}
                  >
                    <div className="flex items-end gap-1.5">
                      <span
                        className="font-bold tracking-[-0.05em] leading-none"
                        style={{
                          fontSize: "clamp(2.2rem, 5vw, 2.8rem)",
                          backgroundImage: `linear-gradient(135deg, var(--text-primary) 30%, ${plan.accentColor})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {formatInr(plan.priceInr)}
                      </span>
                      <span className="mb-1.5 text-xs text-[var(--text-muted)] font-medium">/ month</span>
                    </div>

                    {/* Credits label */}
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <FiZap className="h-3 w-3 flex-shrink-0" style={{ color: plan.accentColor }} aria-hidden="true" />
                      <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.1em]">
                        {plan.creditsLabel}
                      </span>
                    </div>

                    {/* Credits bar */}
                    <CreditBar credits={plan.credits} accentColor={plan.accentColor} />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="mx-7 h-px"
                  style={{
                    background: plan.featured
                      ? `linear-gradient(90deg, transparent, color-mix(in srgb, ${plan.accentColor} 40%, transparent), transparent)`
                      : "var(--border-subtle)",
                  }}
                />

                {/* Features */}
                <div className="flex-1 p-7 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] mb-3">
                    What&apos;s included
                  </p>
                  <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 leading-6">
                        <span
                          className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: `color-mix(in srgb, ${plan.accentColor} 18%, transparent)`,
                            width: "18px",
                            height: "18px",
                          }}
                        >
                          <FiCheck className="h-2.5 w-2.5" style={{ color: plan.accentColor }} aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="p-7 pt-0">
                  <Link
                    href={plan.href}
                    className="group/btn relative w-full inline-flex min-h-[50px] items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                    style={
                      plan.featured
                        ? {
                            background: `linear-gradient(135deg, ${plan.accentColor} 0%, color-mix(in srgb, ${plan.accentColor} 75%, var(--accent-secondary)) 100%)`,
                            color: "var(--background)",
                            boxShadow: `0 4px 20px color-mix(in srgb, ${plan.accentColor} 38%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)`,
                            letterSpacing: "0.01em",
                          }
                        : {
                            border: "1px solid var(--border-strong)",
                            background: "var(--surface-glass)",
                            color: "var(--text-primary)",
                            letterSpacing: "0.01em",
                          }
                    }
                  >
                    <span className="relative z-10">Start with {plan.name}</span>
                    <FiArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
                    {plan.featured && (
                      <span
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover/btn:translate-x-full transition-transform duration-700"
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {/* Micro trust text */}
                  <p className="mt-2.5 text-center text-[10px] text-[var(--text-muted)]">
                    No credit card required &nbsp;·&nbsp; Cancel anytime
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Add-on credits block ── */}
        <div
          className="mx-auto mt-8 max-w-6xl rounded-2xl overflow-hidden"
          style={{
            border: "1px solid var(--border-subtle)",
            background: "var(--surface-primary)",
          }}
        >
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, transparent, var(--accent-primary), var(--accent-secondary), transparent)",
            }}
          />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between p-6 sm:p-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FiZap className="h-4 w-4" style={{ color: "var(--accent-primary)" }} />
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--accent-primary)" }}
                >
                  Top-up anytime
                </p>
              </div>
              <p className="text-base font-bold tracking-[-0.02em] text-[var(--text-primary)]" style={{ fontFamily: "var(--font-headline)" }}>
                Need more motion graphics this month?
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
                Buy additional Motion Credits whenever you need them. Your subscription stays the same
                and unused monthly credits remain separate from top-ups.
              </p>
            </div>

            <div
              className="flex items-center gap-6 rounded-xl px-6 py-4 shrink-0"
              style={{
                border: "1px solid var(--border-subtle)",
                background: "color-mix(in srgb, var(--accent-primary) 5%, transparent)",
              }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Per credit</p>
                <p
                  className="mt-1 font-bold tracking-[-0.04em]"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    backgroundImage: "linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {formatInr(MOTION_CREDIT_PRICE_INR)}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">One motion generation</p>
              </div>
              <Link
                href="/register"
                className="group inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                  color: "var(--background)",
                  boxShadow: "0 2px 12px color-mix(in srgb, var(--accent-primary) 35%, transparent)",
                }}
              >
                Buy now
                <FiArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Fine print ── */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-xs leading-5 text-[var(--text-muted)] max-w-xl">
            One Generate action creates one billable motion job. Multiple visual variations generated
            inside that job still use one Motion Credit.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="inline-block h-1 w-1 rounded-full bg-[var(--accent-tertiary)]" />
            Built for YouTube explainers, coding videos, documentaries, education and commentary.
            <span className="inline-block h-1 w-1 rounded-full bg-[var(--accent-tertiary)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

