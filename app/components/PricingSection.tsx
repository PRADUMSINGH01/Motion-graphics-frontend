"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconCheck, IconShield, IconChevronDown } from "./Icons";

type BillingInterval = "monthly" | "annual";

interface PlanFeature {
  text: string;
  highlight?: boolean;
}

interface Plan {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  periodLabel: string;
  ctaText: string;
  ctaHref: string;
  popular?: boolean;
  features: PlanFeature[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "For individuals and creators exploring autonomous video generation.",
    priceMonthly: 0,
    priceAnnual: 0,
    periodLabel: "Free forever",
    ctaText: "Get Started Free",
    ctaHref: "/register",
    features: [
      { text: "10 video renders per month" },
      { text: "720p 60 FPS video export" },
      { text: "Autonomous natural language prompts" },
      { text: "Core kinetic typography engine" },
      { text: "Standard cloud rendering queue" },
      { text: "Community Slack support" },
    ],
  },
  {
    id: "pro",
    name: "Pro Studio",
    badge: "Most Popular",
    tagline: "For professional creators and motion designers needing broadcast quality.",
    priceMonthly: 20,
    priceAnnual: 16,
    periodLabel: "per editor / month",
    ctaText: "Upgrade to Pro",
    ctaHref: "/register?plan=pro",
    popular: true,
    features: [
      { text: "250 video renders per month", highlight: true },
      { text: "4K UHD 60 FPS lossless export", highlight: true },
      { text: "ProRes 4444 & transparent WebM", highlight: true },
      { text: "Priority GPU rendering cluster (3x faster)" },
      { text: "Custom brand fonts, colors & audio stems" },
      { text: "Full commercial usage rights" },
      { text: "Priority email & Discord support" },
    ],
  },
  {
    id: "team",
    name: "Team & Studio",
    tagline: "For creative teams, agencies, and high-volume automated pipelines.",
    priceMonthly: 80,
    priceAnnual: 64,
    periodLabel: "per team / month (5 seats)",
    ctaText: "Start Team Trial",
    ctaHref: "/register?plan=team",
    features: [
      { text: "1,000 video renders per month", highlight: true },
      { text: "Unlimited 4K 60 FPS exports", highlight: true },
      { text: "REST API & Webhook automation access", highlight: true },
      { text: "Dedicated GPU render instance" },
      { text: "Shared workspace & asset library" },
      { text: "Custom SSO & team permission controls" },
      { text: "Dedicated account manager & 99.9% SLA" },
    ],
  },
];

const COMPARISON_ROWS = [
  {
    category: "Video Generation & Rendering",
    features: [
      { name: "Monthly video renders", free: "10", pro: "250", team: "1,000" },
      { name: "Max resolution", free: "720p HD", pro: "4K UHD", team: "4K UHD" },
      { name: "Frame rate", free: "60 FPS", pro: "60 FPS", team: "60 FPS" },
      { name: "ProRes 4444 export", free: false, pro: true, team: true },
      { name: "Transparent alpha WebM", free: false, pro: true, team: true },
      { name: "GPU queue priority", free: "Standard", pro: "High Priority", team: "Dedicated Cluster" },
    ],
  },
  {
    category: "Workflow & Customization",
    features: [
      { name: "Autonomous prompt agent", free: true, pro: true, team: true },
      { name: "Custom brand typography", free: false, pro: true, team: true },
      { name: "Audio stems & music sync", free: "Basic", pro: "Advanced", team: "Advanced" },
      { name: "Watermark removal", free: true, pro: true, team: true },
      { name: "REST API & Webhooks", free: false, pro: false, team: true },
    ],
  },
  {
    category: "Collaboration & Support",
    features: [
      { name: "Team seats included", free: "1", pro: "1", team: "5 included" },
      { name: "Commercial rights", free: "Personal only", pro: "Full Commercial", team: "Full Commercial" },
      { name: "Support level", free: "Community", pro: "Priority Email", team: "Dedicated Manager" },
      { name: "Uptime SLA", free: false, pro: false, team: "99.9% SLA" },
    ],
  },
];

const FAQS = [
  {
    q: "How does the monthly render quota work?",
    a: "Every time our AI generates or re-renders an animation or export, it counts as 1 render. Draft previews and live timeline scrubber edits do not deduct from your render quota.",
  },
  {
    q: "Can I use generated videos commercially?",
    a: "Yes! Pro and Team plans include full commercial usage rights with zero attribution required. Videos can be published on YouTube, client broadcasts, social media ads, and TV.",
  },
  {
    q: "Can I upgrade, downgrade, or cancel at any time?",
    a: "Yes. You can change your plan or cancel with one click directly from your billing dashboard. If you cancel, your subscription remains active until the end of your billing cycle.",
  },
  {
    q: "What video formats are supported for export?",
    a: "Free exports standard MP4 at 720p 60FPS. Pro and Team export uncompressed ProRes 4444, transparent alpha-channel WebM, and pristine H.264/H.265 MP4 at up to 4K 60FPS.",
  },
  {
    q: "Do you offer custom enterprise pricing?",
    a: "Yes. For studios needing custom on-premise deployments, higher API limits, or volume rendering, reach out to our team at enterprise@byreel.ai.",
  },
];

function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <IconCheck className={`w-4 h-4 mx-auto ${highlight ? "text-accent" : "text-fg"}`} />
    ) : (
      <span className="text-fg-subtle/60">—</span>
    );
  }
  return <>{value}</>;
}

export const PricingSection = memo(function PricingSection() {
  const [interval, setInterval] = useState<BillingInterval>("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isAnnual = interval === "annual";

  return (
    <section id="pricing" className="relative w-full py-24 sm:py-28 border-t border-line scroll-mt-16">
      <div className="container-page">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow mb-4">Pricing</span>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.04em] text-fg">
            Simple, predictable pricing.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl mx-auto">
            Start free. Upgrade when you need 4K output, higher render volume and team collaboration.
          </p>

          {/* Billing switch */}
          <div
            role="tablist"
            aria-label="Billing interval"
            className="mt-8 inline-flex items-center p-1 rounded-lg border border-line bg-surface-3/60"
          >
            {(["monthly", "annual"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={interval === value}
                onClick={() => setInterval(value)}
                className={`inline-flex items-center gap-2 h-8 px-3.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                  interval === value ? "bg-surface text-fg shadow-soft" : "text-fg-muted hover:text-fg"
                }`}
              >
                {value === "monthly" ? "Monthly" : "Annual"}
                {value === "annual" && <span className="text-[11px] font-semibold text-accent">−20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Plans ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch max-w-6xl mx-auto mb-24">
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl p-7 border bg-surface ${
                  plan.popular ? "border-accent/60 shadow-elevated ring-1 ring-accent/20" : "border-line shadow-soft"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-fg">{plan.name}</h3>
                  {plan.popular && <span className="badge badge-accent">{plan.badge}</span>}
                </div>

                <p className="text-sm text-fg-muted leading-relaxed mb-6 min-h-[44px]">{plan.tagline}</p>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-semibold tracking-[-0.045em] text-fg">${price}</span>
                  {price > 0 && <span className="text-sm text-fg-subtle">/ month</span>}
                </div>
                <p className="mt-1.5 mb-6 text-[13px] text-fg-subtle">
                  {price === 0
                    ? plan.periodLabel
                    : isAnnual
                      ? `${plan.periodLabel} · billed $${price * 12}/yr`
                      : `${plan.periodLabel} · billed monthly`}
                </p>

                <Link href={plan.ctaHref} className={`btn w-full mb-7 ${plan.popular ? "btn-accent" : "btn-secondary"}`}>
                  {plan.ctaText}
                  <IconArrowRight className="w-4 h-4" />
                </Link>

                <div className="border-t border-line pt-6">
                  <p className="text-[13px] font-medium text-fg mb-4">
                    {plan.id === "free" ? "What's included" : `Everything in ${plan.id === "pro" ? "Free" : "Pro"}, plus:`}
                  </p>
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <IconCheck
                          className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-accent" : "text-fg-subtle"}`}
                        />
                        <span className={feature.highlight ? "text-fg" : "text-fg-muted"}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Comparison table ── */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-fg">Compare plans</h3>
            <p className="mt-2 text-sm text-fg-muted">A detailed breakdown of what each tier includes.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[640px] text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="p-4 sm:px-6 font-medium text-fg-subtle w-2/5">Feature</th>
                  <th className="p-4 font-semibold text-fg text-center w-1/5">Free</th>
                  <th className="p-4 font-semibold text-accent text-center w-1/5 bg-accent-soft">Pro Studio</th>
                  <th className="p-4 font-semibold text-fg text-center w-1/5">Team &amp; Studio</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((group) => (
                  <React.Fragment key={group.category}>
                    <tr className="bg-canvas-subtle border-b border-line">
                      <td
                        colSpan={4}
                        className="py-2.5 px-4 sm:px-6 text-xs font-medium uppercase tracking-wider text-fg-subtle"
                      >
                        {group.category}
                      </td>
                    </tr>
                    {group.features.map((row) => (
                      <tr key={row.name} className="border-b border-line last:border-b-0">
                        <td className="p-4 sm:px-6 text-fg-muted">{row.name}</td>
                        <td className="p-4 text-center text-fg-muted">
                          <Cell value={row.free} />
                        </td>
                        <td className="p-4 text-center text-fg font-medium bg-accent-soft">
                          <Cell value={row.pro} highlight />
                        </td>
                        <td className="p-4 text-center text-fg font-medium">
                          <Cell value={row.team} />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-fg">
              Frequently asked questions
            </h3>
            <p className="mt-2 text-sm text-fg-muted">Everything you need to know about plans and billing.</p>
          </div>

          <div className="rounded-2xl border border-line bg-surface divide-y divide-line">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left text-[15px] font-medium text-fg cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <IconChevronDown
                      className={`w-4 h-4 text-fg-subtle shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 -mt-1 text-sm text-fg-muted leading-relaxed animate-fade-up">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-[13px] text-fg-subtle">
            <span className="inline-flex items-center gap-2">
              <IconShield className="w-3.5 h-3.5" />
              Cancel anytime
            </span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span>Commercial rights on paid plans</span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span>Secure checkout via Stripe</span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default PricingSection;
