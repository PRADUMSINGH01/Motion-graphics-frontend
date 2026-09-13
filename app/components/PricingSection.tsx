import Link from "next/link";
import { FiArrowRight, FiCheck, FiZap } from "react-icons/fi";
import { formatInr, MOTION_CREDIT_PRICE_INR } from "../lib/motionBilling";

const plans = [
  {
    name: "Starter",
    price: "$9",
    description: "For trying ideas and creating your first polished motion pieces.",
    credits: "20 Motion Credits included",
    features: ["20 standard motion generations", "1080p exports", "Kinetic typography and logo reveals", "Standard render queue"],
    href: "/register?plan=creator",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For creators who need a reliable motion workflow every week.",
    credits: "60 Motion Credits included",
    features: ["60 standard motion generations", "4K exports and transparent WebM", "Priority render queue", "Commercial use and brand controls"],
    href: "/register?plan=pro",
    featured: true,
  },
] as const;

export default function PricingSection() {
  return (
    <section id="pricing" className="border-y border-[var(--border-subtle)] bg-[var(--background)] px-5 py-20 text-[var(--text-primary)] sm:px-8 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">Simple pricing</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Start small. Scale when the work does.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
            Every plan includes Motion Credits for standard generations. Add more only when you need them.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex min-h-[440px] flex-col rounded-2xl border p-6 sm:p-7 ${
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
                <p className="mt-3 min-h-12 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">{plan.description}</p>
              </div>

              <div className="mt-7 border-y border-[var(--border-subtle)] py-5">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-[-0.05em]">{plan.price}</span>
                  <span className="mb-1.5 text-sm text-[var(--text-muted)]">/ month</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-glass)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                  <FiZap className="h-3.5 w-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                  {plan.credits}
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 leading-6">
                    <FiCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--accent-primary)]" aria-hidden="true" />
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
                Choose {plan.name}
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5 sm:grid-cols-[1.2fr_0.8fr] sm:items-center sm:p-6">
          <div>
            <p className="text-sm font-semibold">Need more generations?</p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">
              Top up one Motion Credit for each additional standard generation. Prompt length and the number of variations do not change the cost.
            </p>
          </div>
          <div className="sm:border-l sm:border-[var(--border-subtle)] sm:pl-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Extra credit</p>
            <p className="mt-1 text-3xl font-semibold tracking-[-0.04em]">{formatInr(MOTION_CREDIT_PRICE_INR)}</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">= one standard generation</p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          One Generate action creates one billable job. If it returns multiple visual variations, it still uses one Motion Credit.
        </p>
      </div>
    </section>
  );
}
