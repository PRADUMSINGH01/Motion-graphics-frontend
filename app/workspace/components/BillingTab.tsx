"use client";

import React from "react";
import { FiCheck, FiCreditCard, FiFileText } from "react-icons/fi";
import { BillingInterval, PlanTier, PricingTier } from "../types";

interface BillingTabProps {
  billingInterval: BillingInterval;
  setBillingInterval: (interval: BillingInterval) => void;
  userPlan: PlanTier;
  pricingTiers: PricingTier[];
  isUpdatingPlan: boolean;
  selectedTierForUpdate: PlanTier | null;
  onSwitchPlan: (tier: PlanTier) => void;
  onDownloadReceipt: () => void;
}

export default function BillingTab({
  billingInterval,
  setBillingInterval,
  userPlan,
  pricingTiers,
  isUpdatingPlan,
  selectedTierForUpdate,
  onSwitchPlan,
  onDownloadReceipt,
}: BillingTabProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full my-auto py-2">
      {/* Header & Interval Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Plans &amp; Subscription Pricing
          </h2>
          <p className="text-xs text-slate-400">
            Switch compute capacity anytime. Changes take effect instantly.
          </p>
        </div>

        <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setBillingInterval("monthly")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              billingInterval === "monthly"
                ? "bg-white/15 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval("annual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              billingInterval === "annual"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual</span>
            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-cyan-400 text-slate-950 font-bold">
              SAVE 25%
            </span>
          </button>
        </div>
      </div>

      {/* 4 Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pricingTiers.map((tier) => {
          const isCurrent = tier.id === userPlan;
          const price = billingInterval === "annual" ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-200 ${
                tier.highlighted
                  ? "bg-[#10131d] border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/10"
                  : isCurrent
                  ? "bg-[#0d0f17] border-2 border-emerald-500/60"
                  : "bg-[#0d0f17] border border-white/[0.08]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{tier.name}</h3>
                  {isCurrent && (
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-mono uppercase bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Current
                    </span>
                  )}
                </div>

                <div className="pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white font-mono">
                      ${price}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      / mo
                    </span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {tier.features.slice(0, 4).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <FiCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.06]">
                {isCurrent ? (
                  <div className="w-full py-2 rounded-lg text-xs font-semibold bg-white/10 text-slate-300 text-center flex items-center justify-center gap-1.5">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Active Plan</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSwitchPlan(tier.id)}
                    disabled={isUpdatingPlan}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      tier.highlighted
                        ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-sm"
                        : "bg-white hover:bg-slate-200 text-slate-950"
                    } disabled:opacity-50`}
                  >
                    {isUpdatingPlan && selectedTierForUpdate === tier.id ? (
                      <span>Updating...</span>
                    ) : (
                      <span>Switch to {tier.name}</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Info & Invoices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <FiCreditCard className="text-cyan-400" />
              Payment Method
            </span>
            <span className="text-[10px] font-mono text-slate-500">None linked</span>
          </div>
          <div className="text-xs text-slate-400 flex justify-between pt-1 items-center">
            <span>{userPlan === "free" ? "Free Community Tier" : `${userPlan.toUpperCase()} Plan`}</span>
            <span className="text-slate-500 font-mono text-[11px]">{userPlan === "free" ? "No billing required" : "Via Stripe"}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <FiFileText className="text-cyan-400" />
              Recent Receipt
            </span>
            <span className="text-[10px] font-mono text-slate-500">0 Invoices</span>
          </div>
          <div className="text-xs text-slate-400 flex justify-between pt-1">
            <span>Invoice History</span>
            <span className="text-slate-500 font-mono text-[11px]">No charges yet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
