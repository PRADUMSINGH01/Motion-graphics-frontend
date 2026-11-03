"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiCheck, FiDownload, FiLink, FiPlay, FiPlus, FiRefreshCw, FiSearch, FiX } from "react-icons/fi";
import { api, type PromptJob } from "../../../lib/api";
import { type Chat, formatLength, formatTokens, posterFor } from "../../lib/chatStore";

const RATIOS = ["All", "16:9", "9:16", "1:1"] as const;

interface Props {
  chats: Chat[];
  onOpenChat: (chatId: string) => void;
  onNewVideo: () => void;
}

function madeOn(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const downloadUrl = (url: string) => `${url}${url.includes("?") ? "&" : "?"}download=1`;

/** Every video the account has made, from the server: the same list on every device. */
export default function YourVideosSection({ chats, onOpenChat, onNewVideo }: Props) {
  const [jobs, setJobs] = useState<PromptJob[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [ratio, setRatio] = useState<(typeof RATIOS)[number]>("All");
  const [open, setOpen] = useState<PromptJob | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { jobs: list } = await api.prompt.list();
      setJobs(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your videos.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads once on open
    load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // A video's chat, when this browser still has it: "Open in Studio" continues that conversation.
  const chatFor = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of chats) for (const m of c.messages) if (m.promptId) map.set(m.promptId, c.id);
    return map;
  }, [chats]);

  const finished = (jobs ?? []).filter((j) => j.status === "done" && j.play?.length);
  const running = (jobs ?? []).filter((j) => j.status === "queued" || j.status === "running");
  const q = query.trim().toLowerCase();
  const shown = finished.filter(
    (j) => (ratio === "All" || j.ratio === ratio) && (!q || `${j.title ?? ""} ${j.prompt ?? ""}`.toLowerCase().includes(q))
  );

  const copyLink = async (j: PromptJob) => {
    try {
      await navigator.clipboard.writeText(j.play[0]);
      setCopied(j.promptId);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-ink-111110">Your videos</h1>
          <p className="mt-1 text-[13.5px] text-ink-717069">
            Everything you&apos;ve made, newest first. Links play anywhere; only you are given them.
          </p>
        </div>
        <button
          type="button"
          onClick={onNewVideo}
          className="flex h-10 shrink-0 items-center gap-1.5 self-start rounded-xl bg-surf-111110 px-4 text-[13px] font-semibold text-white transition hover:bg-surf-272725 sm:self-auto"
        >
          <FiPlus size={15} /> New video
        </button>
      </header>

      {running.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-surf-dedad0 bg-surf-ffffff px-4 py-3 text-[13px] text-ink-2d2c28">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#84cc16]" aria-hidden="true" />
          {running.length === 1 ? "1 video is being made" : `${running.length} videos are being made`}
          {running[0] && chatFor.get(running[0].promptId) && (
            <button type="button" onClick={() => onOpenChat(chatFor.get(running[0].promptId)!)} className="font-semibold underline underline-offset-2">
              Watch progress
            </button>
          )}
        </div>
      )}

      {finished.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <FiSearch size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-8c8980" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or prompt"
              aria-label="Search your videos"
              className="h-10 w-full rounded-xl border border-surf-dedad0 bg-surf-ffffff pl-9 pr-3 text-[13px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-surf-dedad0 bg-surf-ffffff p-1" role="radiogroup" aria-label="Frame">
            {RATIOS.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={ratio === r}
                onClick={() => setRatio(r)}
                className={`rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition ${ratio === r ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {error ? (
        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-8 text-center">
          <p className="text-[14px] text-ink-2d2c28">{error}</p>
          <button type="button" onClick={load} className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-surf-dedad0 px-4 py-2 text-[13px] font-medium">
            <FiRefreshCw size={14} /> Try again
          </button>
        </div>
      ) : jobs === null ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading your videos">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-surf-eceae3 bg-surf-ffffff">
              <div className="aspect-video bg-surf-f2efe6" />
              <div className="space-y-2 p-4">
                <div className="h-3.5 w-2/3 rounded bg-surf-f2efe6" />
                <div className="h-3 w-1/3 rounded bg-surf-f2efe6" />
              </div>
            </div>
          ))}
        </div>
      ) : finished.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surf-dedad0 bg-surf-ffffff px-6 py-14 text-center">
          <h2 className="text-[17px] font-semibold text-ink-111110">No videos yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-[13.5px] text-ink-717069">
            Describe a video in the Studio and it shows up here when it&apos;s ready, with a link to share and a download.
          </p>
          <button
            type="button"
            onClick={onNewVideo}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Make your first video <FiArrowRight size={14} />
          </button>
        </div>
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-[13.5px] text-ink-717069">No videos match. Try another search or frame.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((j) => (
            <li key={j.promptId} className="group overflow-hidden rounded-2xl border border-surf-dedad0 bg-surf-ffffff transition hover:border-surf-111110">
              <button type="button" onClick={() => setOpen(j)} className="relative block aspect-video w-full bg-[#0b0b0a]" aria-label={`Play ${j.title || "video"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={j.poster ?? posterFor(j.play[0])} alt="" loading="lazy" className="h-full w-full object-contain" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink-111110 shadow">
                    <FiPlay size={16} />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white">
                  {formatLength(j.durationS)}
                </span>
                {j.editOf && <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-medium text-ink-111110">Edit</span>}
              </button>
              <div className="p-4">
                <p className="truncate text-[14px] font-semibold text-ink-111110" title={j.title}>
                  {j.title || "Untitled video"}
                </p>
                <p className="mt-0.5 text-[12px] text-ink-8c8980">
                  {[madeOn(j.createdAt), j.ratio, j.creditsSettled && j.credits != null ? `${j.credits} ${j.credits === 1 ? "credit" : "credits"}` : null].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a href={downloadUrl(j.play[0])} className="inline-flex items-center gap-1.5 rounded-lg border border-surf-dedad0 px-2.5 py-1.5 text-[12px] font-medium text-ink-2d2c28 hover:border-surf-111110">
                    <FiDownload size={13} /> Download
                  </a>
                  <button type="button" onClick={() => copyLink(j)} className="inline-flex items-center gap-1.5 rounded-lg border border-surf-dedad0 px-2.5 py-1.5 text-[12px] font-medium text-ink-2d2c28 hover:border-surf-111110">
                    {copied === j.promptId ? <FiCheck size={13} /> : <FiLink size={13} />} {copied === j.promptId ? "Copied" : "Copy link"}
                  </button>
                  {chatFor.get(j.promptId) && (
                    <button type="button" onClick={() => onOpenChat(chatFor.get(j.promptId)!)} className="ml-auto text-[12px] font-medium text-ink-717069 hover:text-ink-111110">
                      Open in Studio
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(null)} role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={open.title || "Video"}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-surf-ffffff shadow-2xl"
          >
            <div className="flex min-h-0 flex-1 items-center justify-center bg-[#0b0b0a]">
              <video src={open.play[0]} poster={open.poster ?? posterFor(open.play[0])} controls autoPlay playsInline className="max-h-[60vh] w-full object-contain" />
            </div>
            <div className="space-y-3 overflow-y-auto p-5">
              <h2 className="pr-8 text-[17px] font-semibold text-ink-111110">{open.title || "Untitled video"}</h2>
              {open.prompt && <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink-2d2c28">{open.prompt}</p>}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-surf-f2efe6 pt-3 text-[12.5px] sm:grid-cols-4">
                {[
                  ["Length", formatLength(open.durationS)],
                  ["Frame", open.ratio ?? "—"],
                  ["Cost", open.creditsSettled && open.credits != null ? `${open.credits} ${open.credits === 1 ? "credit" : "credits"}` : "—"],
                  ["Model tokens", open.tokens?.total ? formatTokens(open.tokens.total) : "—"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-ink-8c8980">{k}</dt>
                    <dd className="m-0 font-medium tabular-nums text-ink-111110">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap justify-end gap-2 border-t border-surf-f2efe6 pt-3">
                <button type="button" onClick={() => copyLink(open)} className="inline-flex items-center gap-1.5 rounded-xl border border-surf-dedad0 px-3.5 py-2 text-[12.5px] font-medium">
                  {copied === open.promptId ? <FiCheck size={14} /> : <FiLink size={14} />} {copied === open.promptId ? "Copied" : "Copy link"}
                </button>
                <a href={downloadUrl(open.play[0])} className="inline-flex items-center gap-1.5 rounded-xl border border-surf-dedad0 px-3.5 py-2 text-[12.5px] font-medium">
                  <FiDownload size={14} /> Download
                </a>
                {chatFor.get(open.promptId) && (
                  <button
                    type="button"
                    onClick={() => {
                      const id = chatFor.get(open.promptId)!;
                      setOpen(null);
                      onOpenChat(id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 px-3.5 py-2 text-[12.5px] font-semibold text-white"
                  >
                    Change it in the Studio <FiArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-111110">
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
