"use client";

import React, { useEffect, useState } from "react";
import { type PipelineStage, type Ratio, formatTokens } from "../lib/chatStore";
import { frameClass } from "./filmFrame";

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

const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

/**
 * A film being made, drawn in the frame it will play in (so the finished video takes its place without the
 * page moving). Progress is the pipeline's real step, not an estimate.
 */
export default function RenderLoader({ stages, activity, thought, ratio, startedAt, tokens, tokenDetails, logs, model, effort }: RenderLoaderProps) {
  const [seconds, setSeconds] = useState(0);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const tick = () => setSeconds(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const running = stages.findIndex((s) => s.state === "running");
  const current = running >= 0 ? running : stages.every((s) => s.state === "done") ? stages.length - 1 : 0;
  const stage = stages[current];
  const totalTokens = tokenDetails?.total ?? tokens;
  const now = thought || activity;

  return (
    <div className="space-y-2.5">
      <div
        className={`st-render relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#0b1730] p-4 text-white sm:p-5 ${frameClass(ratio)}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3 text-[12px] text-[#a3adbf]">
          <span>
            Step {current + 1} of {stages.length}
          </span>
          <span className="font-mono tabular-nums" aria-label={`Elapsed ${clock(seconds)}`}>
            {clock(seconds)}
          </span>
        </div>

        <div className="py-4">
          <p className="text-[19px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[22px]">{stage?.label ?? "Making your video"}</p>
          {now ? <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-[#a3adbf]">{now}</p> : null}
        </div>

        <div>
          <ol className="grid gap-1" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }} aria-label="Steps">
            {stages.map((s) => (
              <li key={s.id} className="min-w-0">
                <span
                  aria-hidden="true"
                  className={`block h-1 overflow-hidden rounded-full ${
                    s.state === "done" ? "bg-[var(--db-lime)]" : s.state === "running" ? "st-step-running bg-white/20" : "bg-white/12"
                  }`}
                />
                <span className="sr-only">
                  {s.label}: {s.state === "done" ? "done" : s.state === "running" ? "in progress" : "waiting"}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[12px] leading-snug text-[#a3adbf]">
            Videos usually take 5 to 20 minutes. You can leave this page; it keeps going.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-[var(--db-faint)]">
        {model ? (
          <span>
            {model}
            {effort ? `, ${effort} effort` : ""}
          </span>
        ) : null}
        {logs && logs.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowLog((v) => !v)}
            aria-expanded={showLog}
            className="font-medium text-[var(--db-muted)] underline underline-offset-2 hover:text-[var(--db-ink)] cursor-pointer"
          >
            {showLog ? "Hide build log" : "Show build log"}
          </button>
        ) : null}
      </div>

      {showLog && logs && logs.length > 0 ? (
        <div className="max-h-56 overflow-y-auto rounded-lg border border-[var(--db-rule)] bg-[var(--db-paper-2)] p-3 font-mono text-[11.5px] leading-relaxed text-[var(--db-muted)]">
          {totalTokens != null ? (
            <p className="mb-2 text-[var(--db-ink)]">
              {formatTokens(totalTokens)} model tokens so far
              {tokenDetails ? ` (${formatTokens(tokenDetails.input)} in, ${formatTokens(tokenDetails.output)} out)` : ""}
            </p>
          ) : null}
          {logs.slice(-40).map((l, i) => (
            <div key={i} className="flex gap-2">
              <span className="shrink-0 text-[var(--db-faint)]">{l.ts ? l.ts.slice(11, 19) : ""}</span>
              <span className="break-words">{l.line}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
