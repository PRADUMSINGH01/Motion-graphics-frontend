"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiCheck, FiZap, FiArrowRight, FiStar } from "react-icons/fi";

export default function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);

  const tiers = [
    {
      name: "Creator",
      id: "creator",
      badge: null,
      priceMonthly: 29,
      priceAnnual: 22,
      description: "For freelance animators, content creators, and indie visual designers.",
      features: [
        "150 AI Motion Generations / month",
        "1080p 60FPS MP4 & WebM Export",
        "Full Lottie JSON & Web Vectors",
        "Kinetic 3D Typography & Logo Reveals",
        "Standard Cloud GPU Queue",
        "Commercial Usage Rights",
      ],
      ctaText: "Start 7-Day Free Trial",
      ctaHref: "/register?plan=creator",
      highlighted: false,
    },
    {
      name: "Studio Pro",
      id: "studio-pro",
      badge: "Most Popular",
      priceMonthly: 79,
      priceAnnual: 59,
      description: "For design agencies, motion studios, and production teams scaling output.",
      features: [
        "600 AI Motion Generations / month",
        "4K Lossless 60FPS Apple ProRes & MP4",
        "Editable After Effects (.aep) Project Export",
        "Priority High-Speed GPU Render Cluster",
        "Advanced 3D Camera Controls & Physics",
        "Custom Brand Color Palettes & Fonts",
        "Shared Team Workspace (Up to 5 Seats)",
      ],
      ctaText: "Get Studio Pro",
      ctaHref: "/register?plan=pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      id: "enterprise",
      badge: "Custom Scale",
      priceMonthly: 199,
      priceAnnual: 159,
      description: "For production houses, broadcast networks, and high-volume pipelines.",
      features: [
        "Unlimited Generations & Concurrent Renders",
        "Fine-Tuned AI Models on Your Brand Assets",
        "Headless API Access & Webhook Integrations",
        "Dedicated Private GPU Cluster (Zero Queue)",
        "Enterprise SLA & 99.9% Uptime Guarantee",
        "Dedicated Account Manager & 24/7 Support",
        "Custom Invoicing & SSO / SAML Security",
      ],
      ctaText: "Contact Sales",
      ctaHref: "/register?plan=enterprise",
      highlighted: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 font-poppins text-slate-100"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-5 backdrop-blur-md">
          <FiZap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Flexible Render Credits &amp; Subscriptions</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-comic drop-shadow-sm">
          Transparent Pricing for Studios &amp; Creators
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Produce broadcast-quality motion graphics with zero manual keyframing. Cancel or switch plans anytime.
        </p>

        {/* Billing Toggle (Monthly / Annual) */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white/[0.05] border border-white/15 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setAnnualBilling(false)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              !annualBilling
                ? "bg-white text-slate-900 shadow-md font-semibold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setAnnualBilling(true)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
              annualBilling
                ? "bg-white text-slate-900 shadow-md font-semibold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => {
          const price = annualBilling ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 ${
                tier.highlighted
                  ? "bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/10 lg:-translate-y-2"
                  : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] shadow-xl"
              }`}
            >
              {/* Highlight Ribbon */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30">
                    <FiStar className="w-3 h-3 fill-current" />
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-white font-comic">
                    {tier.name}
                  </h3>
                </div>

                <p className="text-sm text-slate-300 min-h-[40px] leading-relaxed">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="my-6 flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    ${price}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">
                    / month
                  </span>
                  {annualBilling && (
                    <span className="text-xs text-cyan-400 font-medium ml-2">
                      billed yearly
                    </span>
                  )}
                </div>

                {/* Feature List Divider */}
                <div className="w-full h-px bg-white/10 my-6" />

                {/* Feature Bullets */}
                <ul className="space-y-3.5 text-sm text-slate-200 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 p-0.5 rounded-full bg-cyan-400/20 text-cyan-300 shrink-0">
                        <FiCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div>
                <Link
                  href={tier.ctaHref}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                    tier.highlighted
                      ? "bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10"
                      : "bg-white/10 hover:bg-white/15 text-white border border-white/20"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise & Custom Inquiries Note */}
      <div className="mt-14 text-center">
        <p className="text-sm text-slate-400">
          Need a custom API quota or bespoke on-premise rendering?{" "}
          <Link
            href="/register?plan=custom"
            className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4"
          >
            Talk with our motion engineering team
          </Link>
        </p>
      </div>
    </section>
  );
}
