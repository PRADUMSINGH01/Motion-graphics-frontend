"use client";

import React from "react";
import {
  FiZap,
  FiLayers,
  FiKey,
  FiDatabase,
  FiTrendingUp,
} from "react-icons/fi";
import { PlanTier } from "../types";
import { formatInr, MOTION_CREDIT_PRICE_INR } from "../../lib/motionBilling";

interface UsageTabProps {
  userPlan: PlanTier;
  genPercent: number;
  genUsed: number;
  genLimit: number;
  rendersPercent: number;
  rendersUsed: number;
  rendersLimit: number;
  apiPercent: number;
  apiUsed: number;
  apiLimit: number;
  storagePercent: number;
  storageUsedGB: string;
  storageLimitGB: number;
  extraCredits: number;
  onTopUpCredits: (amount: number, price: string) => void;
}

export default function UsageTab({
  userPlan,
  genPercent,
  genUsed,
  genLimit,
  rendersPercent,
  rendersUsed,
  rendersLimit,
  apiPercent,
  apiUsed,
  apiLimit,
  storagePercent,
  storageUsedGB,
  storageLimitGB,
  extraCredits,
  onTopUpCredits,
}: UsageTabProps) {
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "short" });
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonth = nextMonthDate.toLocaleString("default", { month: "short" });
  const year = now.getFullYear();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInMonth - now.getDate());

  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full my-auto py-2">
      {/* Status Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-100/60 via-white to-indigo-100/50 dark:from-cyan-950/30 dark:via-surface dark:to-indigo-950/20 border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-accent-soft text-accent font-bold border border-cyan-500/30">
              Tier: {userPlan}
            </span>
            <span className="text-xs text-fg-muted font-mono">
              Cycle: {currentMonth} 01 – {nextMonth} 01, {year}
            </span>
          </div>
          <h2 className="text-xl font-bold text-fg tracking-tight">
            Workspace Compute Quotas
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-success font-mono font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>Next reset in {daysLeft} days</span>
        </div>
      </div>

      {/* 4 Core Usage Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Generations */}
        <div className="p-4 rounded-xl bg-surface border border-line shadow-xs dark:shadow-none space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
              <FiZap className="w-3.5 h-3.5 text-accent" />
              Generations
            </span>
            <span className="text-xs font-mono font-bold text-accent">
              {genPercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-fg font-mono">
              {genUsed}{" "}
              <span className="text-[11px] text-slate-500 font-normal font-sans">
                / {genLimit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-fg/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-solid rounded-full"
                style={{ width: `${genPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-fg-muted pt-0.5">
            <span>Used: {genUsed}</span>
            <span>Left: {Math.max(0, genLimit - genUsed)}</span>
          </div>
        </div>

        {/* 2. 4K ProRes Renders */}
        <div className="p-4 rounded-xl bg-surface border border-line shadow-xs dark:shadow-none space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
              <FiLayers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              4K Renders
            </span>
            <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
              {rendersPercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-fg font-mono">
              {rendersUsed}{" "}
              <span className="text-[11px] text-slate-500 font-normal font-sans">
                / {rendersLimit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-fg/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 dark:bg-purple-400 rounded-full"
                style={{ width: `${rendersPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-fg-muted pt-0.5">
            <span>60 FPS ProRes</span>
            <span>Left: {Math.max(0, rendersLimit - rendersUsed)}</span>
          </div>
        </div>

        {/* 3. API Calls */}
        <div className="p-4 rounded-xl bg-surface border border-line shadow-xs dark:shadow-none space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
              <FiKey className="w-3.5 h-3.5 text-success" />
              API Calls
            </span>
            <span className="text-xs font-mono font-bold text-success">
              {apiPercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-fg font-mono">
              {apiUsed.toLocaleString()}{" "}
              <span className="text-[11px] text-slate-500 font-normal font-sans">
                / {apiLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 bg-fg/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: `${apiPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-fg-muted pt-0.5">
            <span>Rate: 60 req/min</span>
            <span>Left: {(apiLimit - apiUsed).toLocaleString()}</span>
          </div>
        </div>

        {/* 4. Cloud Storage */}
        <div className="p-4 rounded-xl bg-surface border border-line shadow-xs dark:shadow-none space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
              <FiDatabase className="w-3.5 h-3.5 text-warning" />
              Storage
            </span>
            <span className="text-xs font-mono font-bold text-warning">
              {storagePercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-fg font-mono">
              {storageUsedGB}{" "}
              <span className="text-[11px] text-slate-500 font-normal font-sans">
                / {storageLimitGB} GB
              </span>
            </div>
            <div className="w-full h-1.5 bg-fg/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-fg-muted pt-0.5">
            <span>Render Cache</span>
            <span>Available: {(storageLimitGB - parseFloat(storageUsedGB)).toFixed(1)} GB</span>
          </div>
        </div>
      </div>

      {/* Instant Credit Top-Ups */}
      <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-fg flex items-center gap-2">
            <FiTrendingUp className="text-accent" />
            Motion Credit Top-Ups
          </h3>
          {extraCredits > 0 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-accent-soft text-accent border border-cyan-500/30">
              +{extraCredits} Credits Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[10, 50, 100].map((credits) => {
            const price = formatInr(credits * MOTION_CREDIT_PRICE_INR);
            const isRecommended = credits === 50;

            return (
              <div
                key={credits}
                className={`flex items-center justify-between rounded-xl border p-3 ${
                  isRecommended
                    ? "border-cyan-400/40 bg-cyan-50 dark:border-cyan-500/30 dark:bg-cyan-950/20"
                    : "border-black/[0.06] bg-slate-50 dark:border-white/[0.06] dark:bg-white/[0.02]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-fg">
                    <span>+{credits} Credits</span>
                    {isRecommended && (
                      <span className="rounded bg-cyan-500 px-1 text-[8px] font-mono font-bold text-black">POPULAR</span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-accent">{price}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onTopUpCredits(credits, price)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    isRecommended
                      ? "bg-cyan-500 text-black shadow-xs hover:bg-cyan-400"
                      : "bg-black/5 text-slate-800 hover:bg-fg/10 dark:text-white dark:hover:bg-white/20"
                  }`}
                >
                  View price
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
