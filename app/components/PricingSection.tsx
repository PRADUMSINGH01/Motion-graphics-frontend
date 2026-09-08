
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiCheck,
  FiZap,
  FiArrowRight,
  FiStar,
  FiUsers,
} from "react-icons/fi";

type PricingTier = {
  name: string;
  id: string;
  badge?: string;
  description: string;
  monthly: number;
  annual: number;
  credits: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
  trial?: boolean;
};

export default function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);

  const tiers: PricingTier[] = [
    {
      name: "Creator",
      id: "creator",
      description:
        "For creators and freelancers who want professional motion graphics without After Effects.",
      monthly: 15,
      annual: 12,
      credits: "200 credits / month",
      features: [
        "200 AI motion credits",
        "1080p 60FPS exports",
        "No watermark",
        "MP4, WebM & GIF export",
        "Lottie JSON export",
        "Commercial usage rights",
        "Standard GPU queue",
      ],
      ctaText: "Start Creating",
      ctaHref: "/register?plan=creator",
    },

    {
      name: "Pro",
      id: "pro",
      badge: "Most Popular",
      description:
        "For professional creators producing high-quality motion graphics every week.",
      monthly: 39,
      annual: 29,
      credits: "750 credits / month",
      features: [
        "750 AI motion credits",
        "4K 60FPS export",
        "Transparent WebM",
        "ProRes export",
        "Advanced GSAP & PixiJS controls",
        "Custom fonts & brand colors",
        "Priority GPU rendering",
        "Commercial usage rights",
      ],
      ctaText: "Start 14-Day Free Trial",
      ctaHref: "/register?plan=pro&trial=14",
      highlighted: true,
      trial: true,
    },

    {
      name: "Studio",
      id: "studio",
      badge: "For Teams",
      description:
        "For agencies and production teams creating motion graphics at scale.",
      monthly: 79,
      annual: 59,
      credits: "2,000 credits / month",
      features: [
        "2,000 AI motion credits",
        "Everything in Pro",
        "Fast GPU rendering",
        "Team workspace",
        "Up to 5 seats",
        "Shared asset library",
        "Batch rendering",
        "Team brand kits",
        "API access",
      ],
      ctaText: "Start Studio",
      ctaHref: "/register?plan=studio",
    },
  ];

  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden py-28 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
        <div className="absolute left-1/4 top-[45%] h-[300px] w-[300px] rounded-full bg-blue-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-cyan-300 backdrop-blur-xl">
            <FiZap className="h-3.5 w-3.5" />
            Simple, flexible pricing
          </div>

          <h2 className="font-sans text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Create motion.
            <span className="block bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 dark:from-cyan-300 dark:via-sky-400 dark:to-blue-500 bg-clip-text text-transparent">
              Not keyframes.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Generate professional motion graphics in minutes with AI.
            Start with a 14-day Pro trial and upgrade when you need more.
          </p>

          {/* Billing Toggle */}
          <div className="mt-9 inline-flex items-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] p-1.5 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setAnnualBilling(false)}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                !annualBilling
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-lg"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setAnnualBilling(true)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                annualBilling
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-lg"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              Annual

              <span className="rounded-full bg-cyan-500/15 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:gap-7">
          {tiers.map((tier) => {
            const price = annualBilling ? tier.annual : tier.monthly;

            return (
              <div
                key={tier.id}
                className={`group relative flex flex-col rounded-3xl border p-7 transition-all duration-300 sm:p-8 ${
                  tier.highlighted
                    ? "border-cyan-500/50 bg-gradient-to-b from-cyan-50/80 via-white to-white dark:from-cyan-400/[0.09] dark:via-white/[0.045] dark:to-white/[0.02] shadow-xl shadow-cyan-500/10 dark:shadow-[0_0_70px_rgba(34,211,238,0.10)] md:-translate-y-3"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.025] hover:-translate-y-1 hover:border-black/20 dark:hover:border-white/20 hover:bg-slate-50/50 dark:hover:bg-white/[0.045] shadow-lg shadow-black/[0.02] dark:shadow-none"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-bold shadow-lg ${
                        tier.highlighted
                          ? "border border-cyan-400/30 bg-cyan-500 dark:bg-cyan-300 text-white dark:text-slate-950 shadow-cyan-500/20"
                          : "border border-black/10 dark:border-white/15 bg-slate-900 text-white dark:bg-white/10 dark:text-white backdrop-blur-xl"
                      }`}
                    >
                      {tier.highlighted ? (
                        <FiStar className="h-3 w-3 fill-current" />
                      ) : (
                        <FiUsers className="h-3 w-3" />
                      )}

                      {tier.badge}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                      {tier.name}
                    </h3>
                  </div>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mt-7">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                        ${price}
                      </span>

                      <span className="pb-1.5 text-sm text-slate-500">
                        /mo
                      </span>
                    </div>

                    {annualBilling && (
                      <p className="mt-2 text-xs text-slate-500">
                        Billed annually
                      </p>
                    )}
                  </div>

                  {/* Credits */}
                  <div
                    className={`mt-6 flex items-center gap-2 rounded-xl border px-3.5 py-3 ${
                      tier.highlighted
                        ? "border-cyan-400/30 bg-cyan-50 dark:border-cyan-400/20 dark:bg-cyan-400/[0.07]"
                        : "border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03]"
                    }`}
                  >
                    <FiZap
                      className={`h-4 w-4 shrink-0 ${
                        tier.highlighted
                          ? "text-cyan-600 dark:text-cyan-300"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    />

                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {tier.credits}
                    </span>
                  </div>

                  {/* Trial Highlight */}
                  {tier.trial && (
                    <div className="mt-3 rounded-xl border border-cyan-400/30 bg-cyan-500/10 dark:border-cyan-400/20 dark:bg-cyan-400/[0.05] px-3.5 py-2.5 text-center">
                      <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                        14 days free · No charge today
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="my-7 h-px w-full bg-black/10 dark:bg-white/10" />

                {/* Features */}
                <div className="flex-1">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Includes
                  </p>

                  <ul className="space-y-3.5">
                    {tier.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            tier.highlighted
                              ? "bg-cyan-500/15 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300"
                              : "bg-black/[0.05] dark:bg-white/[0.06] text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <FiCheck className="h-3 w-3" />
                        </span>

                        <span className="leading-5">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-8">
                  <Link
                    href={tier.ctaHref}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all ${
                      tier.highlighted
                        ? "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-xl shadow-slate-950/15 dark:shadow-white/10"
                        : "border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-white/[0.06] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/[0.11]"
                    }`}
                  >
                    {tier.ctaText}

                    <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Row */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-500">
            <FiCheck className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            14-day Pro trial
          </div>

          <div className="hidden h-4 w-px bg-black/10 dark:bg-white/10 sm:block" />

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-500">
            <FiCheck className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            Cancel anytime
          </div>

          <div className="hidden h-4 w-px bg-black/10 dark:bg-white/10 sm:block" />

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-500">
            <FiCheck className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            Commercial rights on paid plans
          </div>
        </div>

        {/* Enterprise */}
        <div className="mt-10 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.025] px-6 py-5 text-center sm:flex sm:items-center sm:justify-between sm:text-left shadow-sm dark:shadow-none">
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">
              Need more rendering power?
            </p>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-500">
              Custom credits, dedicated GPU capacity, API access and SSO.
            </p>
          </div>

          <Link
            href="/register"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-200 sm:mt-0"
          >
            Talk to our team
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Comparison */}
        <div className="mt-8 text-center">
          <Link
            href="/billing"
            className="text-xs font-medium text-slate-500 underline decoration-black/10 dark:decoration-white/10 underline-offset-4 transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            Compare all features and credit usage
          </Link>
        </div>
      </div>
    </section>
  );
}

