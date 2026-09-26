import Link from "next/link";
import { FiArrowRight, FiCheck, FiZap } from "react-icons/fi";
import { formatInr, MOTION_CREDIT_PRICE_INR } from "../lib/motionBilling";

const plans = [
  {
    name: "Starter",
    priceInr: 199,
    description:
      "For YouTubers getting started with AI-powered motion graphics.",
    credits: "20 Motion Credits included",
    features: [
      "20 motion generations",
      "1080p MP4 exports",
      "Kinetic text, diagrams and explainers",
      "Standard render queue",
      "Commercial use",
    ],
    href: "/register?plan=starter",
    featured: false,
  },
  {
    name: "Creator",
    priceInr: 499,
    description:
      "For YouTubers creating polished motion graphics for videos every week.",
    credits: "60 Motion Credits included",
    features: [
      "60 motion generations",
      "1080p & 4K MP4 exports",
      "Advanced diagrams and explainer animations",
      "Priority render queue",
      "Brand colors, fonts and reusable styles",
      "Transparent WebM exports",
    ],
    href: "/register?plan=creator",
    featured: true,
  },
  {
    name: "Pro",
    priceInr: 799,
    description:
      "For high-volume creators producing motion graphics across multiple videos.",
    credits: "100 Motion Credits included",
    features: [
      "100 motion generations",
      "4K MP4 exports",
      "Advanced motion graphics and data visualizations",
      "Priority rendering",
      "Reusable brand presets",
      "Multiple YouTube channels",
    ],
    href: "/register?plan=pro",
    featured: false,
  },
] as const;

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-y border-[var(--border-subtle)] bg-[var(--background)] px-5 py-20 text-[var(--text-primary)] sm:px-8 sm:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
            Pricing for creators
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Make more videos. Animate more ideas.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
            Every plan gives you Motion Credits for generating production-ready
            graphics for YouTube. Start small and upgrade when your content
            volume grows.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex min-h-[500px] flex-col rounded-2xl border p-6 sm:p-7 ${
                plan.featured
                  ? "border-[var(--accent-primary)] bg-[var(--surface-card)] shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
                  : "border-[var(--border-strong)] bg-[var(--surface-primary)]"
              }`}
            >
              {plan.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-[color:color-mix(in_srgb,var(--accent-primary)_18%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-primary)]">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-semibold">{plan.name}</h3>

                <p className="mt-3 min-h-[72px] max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                  {plan.description}
                </p>
              </div>

              <div className="mt-7 border-y border-[var(--border-subtle)] py-5">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-[-0.05em]">
                    {formatInr(plan.priceInr)}
                  </span>

                  <span className="mb-1.5 text-sm text-[var(--text-muted)]">
                    / month
                  </span>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-glass)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                  <FiZap
                    className="h-3.5 w-3.5 text-[var(--accent-primary)]"
                    aria-hidden="true"
                  />
                  {plan.credits}
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 leading-6">
                    <FiCheck
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--accent-primary)]"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                  plan.featured
                    ? "bg-[var(--text-primary)] text-[var(--background)]"
                    : "border border-[var(--border-strong)] bg-[var(--surface-glass)] text-[var(--text-primary)] hover:bg-[var(--surface-card)]"
                }`}
              >
                Start with {plan.name}
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-6 grid max-w-6xl gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5 sm:grid-cols-[1.2fr_0.8fr] sm:items-center sm:p-6">
          <div>
            <p className="text-sm font-semibold">
              Need more motion graphics this month?
            </p>

            <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">
              Buy additional Motion Credits whenever you need them. Your
              subscription stays the same and unused monthly credits remain
              separate from top-ups.
            </p>
          </div>

          <div className="sm:border-l sm:border-[var(--border-subtle)] sm:pl-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Extra credit
            </p>

            <p className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
              {formatInr(MOTION_CREDIT_PRICE_INR)}
            </p>

            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              One standard motion generation
            </p>
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-3xl text-center">
          <p className="text-xs leading-5 text-[var(--text-muted)]">
            One Generate action creates one billable motion job. Multiple
            visual variations generated inside that job still use one Motion
            Credit.
          </p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Built for YouTube explainers, coding videos, documentaries,
            education and commentary.
          </p>
        </div>
      </div>
    </section>
  );
}