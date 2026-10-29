"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiRefreshCw, FiDownload, FiRotateCw, FiTerminal, FiInbox } from "react-icons/fi";
import { api, type PromptJob } from "../../../lib/api";

type Status = "queued" | "running" | "done" | "failed";

const STATUS_TAG: Record<Status, { label: string; className: string }> = {
  queued: { label: "Queued", className: "db-tag" },
  running: { label: "Running", className: "db-tag db-tag-accent" },
  done: { label: "Done", className: "db-tag db-tag-ok" },
  failed: { label: "Failed", className: "db-tag db-tag-danger" },
};

function statusOf(j: Pick<PromptJob, "status">) {
  return STATUS_TAG[(j.status as Status) in STATUS_TAG ? (j.status as Status) : "queued"];
}

function relativeTime(iso?: string | null) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** "[builder] tool: write_file ..." -> role tag styled separately from the rest of the line. */
function splitRole(line: string): [string | null, string] {
  const m = /^\[(\w+)\]\s*(.*)$/.exec(line);
  return m ? [m[1], m[2]] : [null, line];
}

/** Live console for a render job: every planner/builder/critic/fixer event, plus the finished video. */
export default function AgentConsoleSection() {
  const [jobs, setJobs] = useState<PromptJob[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<PromptJob | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const logBoxRef = useRef<HTMLDivElement>(null);
  const hasAutoSelected = useRef(false);

  const refreshList = useCallback(async () => {
    try {
      const { jobs: list } = await api.prompt.list();
      const sorted = [...list].sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime()
      );
      setJobs(sorted);
      setLoadError(null);
      if (!hasAutoSelected.current && sorted.length > 0) {
        hasAutoSelected.current = true;
        const running = sorted.find((j) => j.status === "running" || j.status === "queued");
        setSelectedId((running ?? sorted[0]).promptId);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not reach the backend.");
    }
  }, []);

  useEffect(() => {
    refreshList();
    const id = setInterval(refreshList, 5000);
    return () => clearInterval(id);
  }, [refreshList]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let stopped = false;
    const poll = async () => {
      try {
        const { job } = await api.prompt.status(selectedId);
        if (!stopped) setDetail(job);
      } catch {
        // Keep showing the last known detail; refreshList() surfaces connectivity issues.
      }
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [selectedId]);

  useEffect(() => {
    if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
  }, [detail?.logs?.length]);

  const retry = async () => {
    if (!detail) return;
    setRetrying(true);
    try {
      await api.prompt.retry(detail.promptId);
    } catch {
      // The next poll will reflect whatever state the backend settles on.
    } finally {
      setRetrying(false);
    }
  };

  const status = detail ? statusOf(detail) : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
      <header className="db-rise mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="db-eyebrow mb-2">Agent Console</p>
          <h1 className="db-serif text-[38px] leading-[1] tracking-[-0.02em] sm:text-[48px]">Watch it think</h1>
          <p className="mt-2 max-w-xl text-[14.5px] text-[var(--db-muted)]">
            Every planner, builder, critic and fixer step as it happens — then the finished render.
          </p>
        </div>
        <button type="button" onClick={refreshList} className="db-btn-ghost">
          <FiRefreshCw size={13} /> Refresh
        </button>
      </header>

      {loadError && (
        <p className="db-rise mb-5 rounded-lg border-l-2 border-[var(--ink-dc2626)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[13px] text-[var(--ink-b91c1c)]">
          {loadError}
        </p>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* Job list */}
        <aside className="db-card db-card-pad lg:w-[300px] lg:shrink-0">
          <p className="db-label mb-3">
            {jobs.length} render{jobs.length === 1 ? "" : "s"}
          </p>

          {jobs.length === 0 && !loadError ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--db-rule)] py-10 text-center">
              <FiInbox size={22} className="text-[var(--db-faint)]" />
              <p className="mt-2 text-[13px] text-[var(--db-muted)]">No renders yet</p>
            </div>
          ) : (
            <ul className="max-h-[50vh] space-y-1 overflow-y-auto lg:max-h-[calc(100vh-300px)]">
              {jobs.map((j) => {
                const s = statusOf(j);
                const isActive = j.promptId === selectedId;
                return (
                  <li key={j.promptId}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(j.promptId)}
                      className={`flex w-full flex-col gap-1.5 rounded-lg px-3 py-2.5 text-left transition ${
                        isActive
                          ? "bg-[var(--db-paper)] shadow-[inset_3px_0_0_var(--db-lime)]"
                          : "hover:bg-[var(--db-paper)]"
                      }`}
                    >
                      <span className="truncate text-[13px] font-medium text-[var(--db-ink)]">
                        {j.title || j.prompt || j.promptId}
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className={s.className}>
                          {j.status === "running" && <span className="db-live-dot" />}
                          {s.label}
                        </span>
                        <span className="db-label shrink-0">{relativeTime(j.updatedAt || j.createdAt)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* Detail */}
        <section className="min-w-0 flex-1 space-y-4">
          {!detail ? (
            <div className="db-card flex min-h-[260px] items-center justify-center text-center text-[13.5px] text-[var(--db-muted)]">
              Select a render to see its live agent log.
            </div>
          ) : (
            <>
              <div className="db-card db-card-pad flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[16px] font-semibold text-[var(--db-ink)]">
                    {detail.title || detail.prompt}
                  </h2>
                  <p className="db-label mt-1">
                    {detail.ratio || "16:9"} · {detail.durationS ?? "?"}s · {detail.promptId}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {status && (
                    <span className={status.className}>
                      {detail.status === "running" && <span className="db-live-dot" />}
                      {status.label}
                    </span>
                  )}
                  {detail.tokens?.total != null && <span className="db-tag">{detail.tokens.total.toLocaleString()} tok</span>}
                  {detail.status === "failed" && detail.canRetry && (
                    <button type="button" onClick={retry} disabled={retrying} className="db-btn-ghost">
                      <FiRotateCw size={12} className={retrying ? "animate-spin" : ""} /> {retrying ? "Retrying" : "Retry"}
                    </button>
                  )}
                </div>
              </div>

              {detail.activity && detail.status !== "done" && (
                <p className="rounded-lg border-l-2 border-[var(--db-accent)] bg-[rgba(197,239,38,0.1)] px-3 py-2 text-[13px] text-[var(--db-ink-2)]">
                  {detail.activity}
                </p>
              )}
              {detail.status === "failed" && detail.error && (
                <p className="rounded-lg border-l-2 border-[var(--ink-dc2626)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[13px] text-[var(--ink-b91c1c)]">
                  {detail.error}
                </p>
              )}

              {/* Terminal */}
              <div className="db-terminal relative overflow-hidden rounded-2xl">
                {detail.status === "running" && <div className="db-scanline" />}
                <div className="relative z-10 flex items-center gap-2 border-b border-[rgba(252,251,247,0.08)] px-4 py-2.5">
                  <FiTerminal size={12} className="text-[rgba(252,251,247,0.52)]" />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[rgba(252,251,247,0.52)]">
                    Agent trace
                  </span>
                  {detail.status === "running" && (
                    <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--db-lime)]">
                      <span className="db-live-dot" /> Live
                    </span>
                  )}
                </div>
                <div
                  ref={logBoxRef}
                  className="relative z-10 max-h-[360px] overflow-y-auto px-4 py-3 font-mono text-[12px] leading-relaxed"
                >
                  {detail.logs && detail.logs.length > 0 ? (
                    detail.logs.map((l, i) => {
                      const [role, rest] = splitRole(l.line);
                      return (
                        <div key={i} className="flex gap-2.5 py-0.5">
                          <span className="shrink-0 text-[rgba(252,251,247,0.52)]">
                            {new Date(l.ts).toLocaleTimeString()}
                          </span>
                          <span className="whitespace-pre-wrap break-words">
                            {role && <span className="text-[var(--db-lime)]">[{role}] </span>}
                            <span className="text-[rgba(252,251,247,0.85)]">{rest}</span>
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[rgba(252,251,247,0.52)]">
                      No live trace for this render — it finished in an earlier server session. Last known state:{" "}
                      {detail.stage ?? "unknown"}.
                    </p>
                  )}
                </div>
              </div>

              {/* Result */}
              {detail.status === "done" && detail.play?.[0] && (
                <div className="db-card db-card-pad">
                  <div className="flex items-center justify-between gap-3">
                    <p className="db-eyebrow">Result</p>
                    <a
                      href={`${detail.play[0]}${detail.play[0].includes("?") ? "&" : "?"}download=1`}
                      className="db-btn"
                    >
                      <FiDownload size={13} className="text-[var(--db-lime)]" /> Download
                    </a>
                  </div>
                  <video
                    key={detail.play[0]}
                    controls
                    src={detail.play[0]}
                    className="mt-3 w-full rounded-xl bg-[var(--db-ink)]"
                    style={{ maxHeight: 480 }}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
