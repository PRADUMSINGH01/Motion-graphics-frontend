"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { type PipelineStage, type Ratio, formatTokens } from "../lib/chatStore";

interface RenderLoaderProps {
  stages: PipelineStage[];
  activity?: string;
  ratio: Ratio;
  startedAt: string;
  /** Model tokens used so far. */
  tokens?: number;
}

export default function RenderLoader({ stages, activity, ratio, startedAt, tokens }: RenderLoaderProps) {
  const [seconds, setSeconds] = useState(0);

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

  return (
    <div className="w-full flex justify-start my-2">
      {/* ── Minimalist Cinema Loading Frame ── */}
      <div
        className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surf-0c0d12 border border-white/10 shadow-2xl text-white select-none ${
          isVertical
            ? "w-[260px] sm:w-[280px] aspect-[9/16]"
            : isSquare
            ? "w-[300px] sm:w-[340px] aspect-square"
            : "w-full max-w-lg aspect-[16/9]"
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surf-c5ef26 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-surf-c5ef26" />
            </span>
            <span className="font-mono text-[10.5px] font-semibold tracking-wider text-ink-c5ef26">GENERATING</span>
          </div>
          <span className="font-mono text-[10.5px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
            {ratio}
          </span>
        </div>

        {/* Centerpiece: Clean Orbital Loader */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto">
          <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
            {/* Outer spinning ring */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-surf-c5ef26/30 animate-spin"
              style={{ animationDuration: "12s" }}
            />
            {/* Counter rotating accent */}
            <div
              className="absolute inset-1.5 rounded-full border-t border-r border-surf-c5ef26/60"
              style={{ animation: "spin 6s linear infinite reverse" }}
            />
            {/* Center Byreel Mark */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/15 backdrop-blur-sm shadow-lg">
              <div className="relative h-7 w-7">
                <Image
                  src="/byreel-mark.png"
                  alt="Byreel"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_0_8px_rgba(197,239,38,0.6)]"
                  sizes="28px"
                />
              </div>
            </div>
          </div>

          <h4 className="mt-3 text-[13px] sm:text-[14px] font-semibold text-white/95">
            {currentStage?.label || "Rendering Video..."}
          </h4>
          {activity && (
            <p className="mt-0.5 text-[11px] text-white/50 max-w-[220px] truncate">
              {activity}
            </p>
          )}
        </div>

        {/* Bottom Progress Bar */}
        <div className="relative z-10 p-3.5 space-y-1.5 bg-gradient-to-t from-black/80 to-transparent">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-surf-c5ef26 transition-all duration-300 shadow-[0_0_8px_var(--surf-c5ef26)]"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[10.5px] text-white/50">
            <span>
              {formatTimer(seconds)}
              {tokens ? <span className="text-white/40"> · {formatTokens(tokens)}</span> : null}
            </span>
            <span className="font-semibold text-white/80">{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
