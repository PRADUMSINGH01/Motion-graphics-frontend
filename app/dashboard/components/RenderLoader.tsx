"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { type PipelineStage, type Ratio, formatTokens } from "../lib/chatStore";

interface RenderLoaderProps {
  stages: PipelineStage[];
  activity?: string;
  thought?: string;
  ratio: Ratio;
  startedAt: string;
  /** Model tokens used so far. */
  tokens?: number;
  tokenDetails?: {
    total: number;
    input: number;
    cachedInput?: number;
    output: number;
  };
  logs?: Array<{ ts: string; line: string }>;
  provider?: string;
  model?: string;
  effort?: string;
}

export default function RenderLoader({
  stages,
  activity,
  thought,
  ratio,
  startedAt,
  tokens,
  tokenDetails,
  logs,
  provider,
  model,
  effort,
}: RenderLoaderProps) {
  const [seconds, setSeconds] = useState(0);
  const [showLogs, setShowLogs] = useState(true);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const interval = setInterval(() => {
      setSeconds(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const activeIndex = stages.findIndex((s) => s.state === "running");
  const currentIdx = activeIndex >= 0 ? activeIndex : stages.every((s) => s.state === "done") ? stages.length - 1 : 0;
  const currentStage = stages[currentIdx];

  // Derive agent role from activity or current stage
  const currentAgentRole =
    activity?.match(/^\[(.*?)\]/)?.[1] ||
    (currentStage?.id === "planning"
      ? "planner"
      : currentStage?.id === "building"
      ? "builder"
      : currentStage?.id === "reviewing"
      ? "critic"
      : currentStage?.id === "rendering"
      ? "renderer"
      : "agent");

  // Dynamic progress percentage
  const weights = [15, 32, 52, 72, 88, 98];
  const percent = Math.min(99, Math.max(10, weights[currentIdx] ?? 50));

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isVertical = ratio === "9:16";
  const isSquare = ratio === "1:1";

  const totalTokens = tokenDetails?.total ?? tokens;

  return (
    <div className="w-full flex justify-start my-2">
      {/* ── Cinema Loading Frame ── */}
      <div
        className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#07142e] border border-[rgba(255,255,255,0.15)] shadow-2xl text-white select-none transition-all ${
          isVertical
            ? "w-[280px] sm:w-[320px] min-h-[480px]"
            : isSquare
            ? "w-[320px] sm:w-[380px] min-h-[380px]"
            : "w-full max-w-xl min-h-[340px]"
        }`}
      >
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 animate-pulse"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(197, 239, 38, 0.3) 0%, transparent 70%)",
            animationDuration: "3s",
          }}
        />

        {/* Top Minimal Bar */}
        <div className="relative z-10 flex items-center justify-between p-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5ef26] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5ef26]" />
            </span>
            <span className="font-mono text-[10.5px] font-semibold tracking-wider text-[#c5ef26] uppercase">
              {currentAgentRole} Active
            </span>
            {model && (
              <span className="hidden sm:inline-block font-mono text-[9.5px] text-white/70 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                {model} {effort ? `· ${effort}` : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {totalTokens != null && (
              <span className="font-mono text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                ⚡ {formatTokens(totalTokens)}
              </span>
            )}
            <span className="font-mono text-[10.5px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
              {ratio}
            </span>
          </div>
        </div>

        {/* Centerpiece: Clean Orbital Loader */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto py-2">
          <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
            {/* Outer spinning ring */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-[#c5ef26]/30 animate-spin"
              style={{ animationDuration: "12s" }}
            />
            {/* Counter rotating accent */}
            <div
              className="absolute inset-1.5 rounded-full border-t border-r border-[#c5ef26]/60"
              style={{ animation: "spin 6s linear infinite reverse" }}
            />
            {/* Center Byreel Mark */}
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white/5 border border-white/15 backdrop-blur-sm shadow-lg">
              <div className="relative h-6 w-6">
                <Image
                  src="/byreel-mark.png"
                  alt="Byreel"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_0_8px_rgba(197,239,38,0.6)]"
                  sizes="24px"
                />
              </div>
            </div>
          </div>

          <h4 className="mt-2.5 text-[13px] sm:text-[14px] font-semibold text-white/95">
            {currentStage?.label || "Rendering Video..."}
          </h4>
        </div>

        {/* Live Agent Thinking Terminal */}
        <div className="relative z-10 px-3.5 pb-2">
          <div className="rounded-xl bg-black/60 border border-white/15 p-2.5 backdrop-blur-md shadow-inner text-left">
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c5ef26]" />
                <span className="font-mono text-[9.5px] font-semibold tracking-wider text-[#c5ef26] uppercase">
                  Agent Thought Stream
                </span>
              </div>
              {tokenDetails && (
                <span className="font-mono text-[9px] text-white/50">
                  {formatTokens(tokenDetails.input)} in · {formatTokens(tokenDetails.output)} out
                </span>
              )}
            </div>

            {/* Current Active Thought / Action */}
            <div className="font-mono text-[11px] text-white/90 leading-snug flex items-start gap-1.5">
              <span className="text-[#c5ef26] font-bold shrink-0">›</span>
              <p className="min-w-0 flex-1 break-words">
                {thought || activity || "Synthesizing layout and visual timing..."}
                <span className="inline-block w-1.5 h-3 bg-[#c5ef26] animate-pulse ml-1 align-middle" />
              </p>
            </div>

            {/* Live Agent Trajectory Stream (last 3 events) */}
            {logs && logs.length > 0 && showLogs && (
              <div className="mt-2 space-y-1 max-h-16 overflow-y-auto font-mono text-[9px] text-white/45 border-t border-white/5 pt-1.5">
                {logs.slice(-3).map((log, i) => (
                  <div key={i} className="truncate flex items-center gap-1.5">
                    <span className="text-white/25 shrink-0">{log.ts ? log.ts.slice(11, 19) : ""}</span>
                    <span className="text-white/70 truncate">{log.line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Progress Bar & Token Metrics */}
        <div className="relative z-10 p-3.5 pt-1 space-y-1.5 bg-gradient-to-t from-black/80 to-transparent">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#c5ef26] transition-all duration-300 shadow-[0_0_10px_rgba(197,239,38,0.6)]"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] text-white/50">
            <span>
              {formatTimer(seconds)}
              {totalTokens != null ? (
                <span className="text-white/40"> · {formatTokens(totalTokens)}</span>
              ) : null}
            </span>
            <span className="font-semibold text-white/80">{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
