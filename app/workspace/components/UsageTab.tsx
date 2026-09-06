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
  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full my-auto py-2">
      {/* Status Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-[#13151f] to-indigo-950/20 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Tier: {userPlan}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Cycle: Sep 01 – Oct 01, 2026
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Workspace Compute Quotas
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Next reset in 24 days</span>
        </div>
      </div>

      {/* 4 Core Usage Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Generations */}
        <div className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FiZap className="w-3.5 h-3.5 text-cyan-400" />
              Generations
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {genPercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-white font-mono">
              {genUsed}{" "}
              <span className="text-[11px] text-slate-500 font-normal font-sans">
                / {genLimit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full shadow-[0_0_6px_#00f0ff]"
                style={{ width: `${genPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Daily: 3 / 50</span>
            <span>Left: {Math.max(0, genLimit - genUsed)}</span>
          </div>
        </div>

        {/* 2. 4K ProRes Renders */}
        <div className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FiLayers className="w-3.5 h-3.5 text-purple-400" />
              4K Renders
            </span>
            <span className="text-xs font-mono font-bold text-purple-300">
              {rendersPercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-white font-mono">
              {rendersUsed}{" "}
              <span className="text-[11px] text-slate-500 font-normal font-sans">
                / {rendersLimit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 rounded-full shadow-[0_0_6px_#a855f7]"
                style={{ width: `${rendersPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>60 FPS ProRes</span>
            <span>Left: {Math.max(0, rendersLimit - rendersUsed)}</span>
          </div>
        </div>

        {/* 3. API Calls */}
        <div className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FiKey className="w-3.5 h-3.5 text-emerald-400" />
              API Calls
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {apiPercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-white font-mono">
              {apiUsed.toLocaleString()}{" "}
              <span className="text-[11px] text-slate-500 font-normal font-sans">
                / {apiLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full shadow-[0_0_6px_#10b981]"
                style={{ width: `${apiPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Rate: 60 req/min</span>
            <span>Left: {(apiLimit - apiUsed).toLocaleString()}</span>
          </div>
        </div>

        {/* 4. Cloud Storage */}
        <div className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FiDatabase className="w-3.5 h-3.5 text-amber-400" />
              Storage
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {storagePercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-white font-mono">
              {storageUsedGB}{" "}
              <span className="text-[11px] text-slate-500 font-normal font-sans">
                / {storageLimitGB} GB
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full shadow-[0_0_6px_#f59e0b]"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Render Cache</span>
            <span>Available: {(storageLimitGB - parseFloat(storageUsedGB)).toFixed(1)} GB</span>
          </div>
        </div>
      </div>

      {/* Instant Credit Top-Ups */}
      <div className="p-5 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FiTrendingUp className="text-cyan-400" />
            Instant On-Demand Credit Top-Ups
          </h3>
          {extraCredits > 0 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              +{extraCredits} Credits Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">+100 Runs</div>
              <span className="text-[10px] font-mono text-cyan-400">$9 USD</span>
            </div>
            <button
              type="button"
              onClick={() => onTopUpCredits(100, "$9")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>+500 Runs</span>
                <span className="px-1 rounded text-[8px] font-mono bg-cyan-400 text-slate-950 font-bold">PRO</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">$39 USD</span>
            </div>
            <button
              type="button"
              onClick={() => onTopUpCredits(500, "$39")}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">+1,500 Runs</div>
              <span className="text-[10px] font-mono text-purple-300">$99 USD</span>
            </div>
            <button
              type="button"
              onClick={() => onTopUpCredits(1500, "$99")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
