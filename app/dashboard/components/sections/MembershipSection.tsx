"use client";

import React, { useState } from "react";
import { FiCheck, FiArrowRight, FiZap } from "react-icons/fi";
import type { User } from "../../../context/AuthContext";

type Tier = "free" | "creator" | "pro" | "enterprise";

const TIERS: { id: Tier; name: string; priceMonthly: string; priceAnnual: string; blurb: string; features: string[] }[] = [
  {
    id: "free",
    name: "Free Plan",
    priceMonthly: "$0",
    priceAnnual: "$0",
    blurb: "Perfect for testing motion graphics prompts and drafts.",
    features: ["3 videos to start", "720p HD exports", "byreel watermark", "Community Discord support"],
  },
  {
    id: "creator",
    name: "Creator",
    priceMonthly: "$29",
    priceAnnual: "$24",
    blurb: "For solo designers, creators, and indie hackers.",
    features: ["40 renders / month", "1080p FHD, no watermark", "Brand Kit custom fonts & colors", "Priority GPU queue"],
  },
  {
    id: "pro",
    name: "Pro Studio",
    priceMonthly: "$99",
    priceAnnual: "$79",
    blurb: "For design agencies and hyper-growth marketing teams.",
    features: ["150 renders / month", "4K UHD 60fps exports", "Apple ProRes 422 HQ", "REST API & Webhooks access", "Dedicated rendering node"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    blurb: "For global brands with bespoke rendering requirements.",
    features: ["Unlimited renders", "Custom trained motion models", "SSO & SAML authentication", "SLA uptime guarantee", "Dedicated account engineer"],
  },
];

export default function MembershipSection({ user }: { user: User }) {
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const [activeTier, setActiveTier] = useState<Tier>((user.plan?.tier ?? "free") as Tier);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);

  const handleUpgrade = (tier: Tier) => {
    setActiveTier(tier);
    setUpgradeMessage(`Successfully switched to ${tier.toUpperCase()} plan!`);
    setTimeout(() => setUpgradeMessage(null), 3500);
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2">
          <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
            SUBSCRIPTION & TIERS
          </span>
        </div>
        <h1 className="mt-2 text-[32px] sm:text-[38px] font-bold text-ink-111110">
          Unlock Uncapped Rendering Power
        </h1>
        <p className="mt-2 text-[14px] text-ink-717069">
          Choose the right plan for your creative output. Upgrade or cancel anytime.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="mt-6 inline-flex items-center rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setInterval("monthly")}
            className={`rounded-xl px-4 py-1.5 text-[12.5px] font-semibold transition ${
              interval === "monthly" ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setInterval("annual")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-[12.5px] font-semibold transition ${
              interval === "annual" ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded-md bg-surf-c5ef26 px-1.5 py-0.2 font-mono text-[10px] text-ink-111110">
              -20%
            </span>
          </button>
        </div>
      </div>

      {upgradeMessage && (
        <div className="max-w-xl mx-auto rounded-2xl bg-surf-f2fac2 p-4 text-center text-[14px] font-medium text-ink-658b02">
          {upgradeMessage}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {TIERS.map((tier) => {
          const isCurrent = activeTier === tier.id;
          const isFeatured = tier.id === "pro";
          const price = interval === "annual" ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 ${
                isFeatured
                  ? "border-2 border-surf-111110 bg-surf-ffffff shadow-xl ring-2 ring-surf-c5ef26/30"
                  : "border border-surf-dedad0 bg-surf-ffffff shadow-2xs hover:border-surf-111110"
              }`}
            >
              {isFeatured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-surf-111110 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-c5ef26">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-[17px] font-bold text-ink-111110">{tier.name}</h3>
                <p className="mt-1 text-[12px] text-ink-717069 min-h-[36px]">{tier.blurb}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-[34px] font-bold text-ink-111110">{price}</span>
                  {tier.priceMonthly !== "Custom" && (
                    <span className="text-[12px] text-ink-8c8980">/ month</span>
                  )}
                </div>

                <div className="mt-6 border-t border-surf-f2efe6 pt-5 space-y-2.5">
                  <span className="font-mono text-[10.5px] font-semibold uppercase text-ink-8c8980">
                    Included Features:
                  </span>
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-[12.5px] text-ink-2d2c28">
                      <FiCheck size={14} className="text-ink-658b02 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-surf-f2efe6">
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => handleUpgrade(tier.id)}
                  className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition ${
                    isCurrent
                      ? "bg-surf-f2efe6 text-ink-717069 cursor-default"
                      : isFeatured
                      ? "bg-surf-111110 text-white hover:bg-surf-272725 shadow-xs"
                      : "border border-surf-dedad0 bg-surf-ffffff text-ink-111110 hover:bg-surf-faf9f5"
                  }`}
                >
                  {isCurrent ? "Current Plan" : "Upgrade to " + tier.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
