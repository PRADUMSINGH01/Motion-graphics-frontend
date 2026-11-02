"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiChevronDown,
  FiClock,
  FiDownload,
  FiFilm,
  FiLayers,
  FiPlay,
  FiX,
  FiZap,
} from "react-icons/fi";
import { API_BASE_URL as API_URL, api } from "../../../lib/api";
import type { User } from "../../../context/AuthContext";
import {
  type Chat,
  type ChatSettings,
  type Ratio,
  DEFAULT_SETTINGS,
  collectPending,
  collectVideos,
} from "../../lib/chatStore";
import type { SectionId } from "../../lib/sections";
import { formatDate } from "../../../lib/plans";
import { SHOWREEL, type ShowreelItem } from "../../../components/landing/showreel";
import ModelSelectorModal, { findModel, useModels, type EffortLevel } from "../ModelSelectorModal";
import "./overview.css";

interface OverviewProps {
  user: User;
  chats: Chat[];
  assetCount: number;
  onNavigate: (s: SectionId) => void;
  onOpenLaunch: (chatId: string) => void;
  onNewLaunch: (initialPrompt?: string, settings?: ChatSettings) => void;
  searchFilter?: string;
}

interface BackendVideoItem {
  id: string;
  jobId: string;
  title: string;
  prompt: string;
  status: string;
  videoUrl: string | null;
  previewUrl: string | null;
  createdAt: string;
  durationSec?: number;
}

interface Production {
  id: string;
  title: string;
  meta: string;
  duration: string;
  poster: string;
  videoUrl: string | null;
  status: "Rendered" | "Draft";
  chatId?: string;
}

const STARTERS = [
  {
    label: "Product launch",
    query:
      "A 20-second launch trailer for my app: the logo builds from ink strokes, three feature cards slide in, and it ends on a lime call-to-action.",
  },
  {
    label: "Kinetic type",
    query: "Kinetic typography for the line “ideas in motion”: words pop on the beat, then a diagonal wipe to the logo.",
  },
  {
    label: "B-roll cutaway",
    query: "A 10-second B-roll cutaway: pan across a printed article and sweep a lime highlighter over the key sentence.",
  },
  {
    label: "Data story",
    query: "An animated chart that climbs from 1,200 to 48,000 users with a counter, then reveals the headline number.",
  },
];

/** Showreel pieces used as one-click starting points. */
const TEMPLATE_IDS = ["launch-day", "ink-to-motion", "feature-bento", "kinetic-typography-reel", "liquid-chrome", "riso-print"];
const TEMPLATES = TEMPLATE_IDS.map((id) => SHOWREEL.find((r) => r.id === id)).filter(
  (r): r is ShowreelItem => Boolean(r)
);

/** Fallback productions shown before the user has rendered anything. */
const SAMPLE_IDS = ["pocket-studio", "make-it-move", "every-frame", "orbit"];

const RATIOS = ["16:9", "9:16", "1:1"] as const;

function greeting(date: Date) {
  const h = date.getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff)) return "";
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function reelVideo(id: string) {
  return `/showreel/video/${id}.mp4`;
}
function reelPoster(id: string) {
  return `/showreel/${id}.webp`;
}

/** Video that plays only while hovered: posters keep the grid light. */
function HoverVideo({ src, poster, label }: { src: string | null; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  return (
    <div
      className="ov-media"
      onMouseEnter={() => {
        if (!src) return;
        setArmed(true);
        requestAnimationFrame(() => ref.current?.play().catch(() => {}));
      }}
      onMouseLeave={() => {
        const v = ref.current;
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={label} loading="lazy" decoding="async" />
      {src && armed && <video ref={ref} src={src} muted loop playsInline preload="auto" aria-hidden="true" />}
    </div>
  );
}

export default function OverviewSection({
  user,
  chats,
  onNavigate,
  onOpenLaunch,
  onNewLaunch,
  searchFilter = "",
}: OverviewProps) {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState<Ratio>("16:9");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_SETTINGS.model || "glm-5.3-flash");
  const [selectedProvider, setSelectedProvider] = useState<string>(DEFAULT_SETTINGS.provider || "glm");
  const [selectedEffort, setSelectedEffort] = useState<EffortLevel>((DEFAULT_SETTINGS.effort as EffortLevel) || "high");
  const [showModelModal, setShowModelModal] = useState(false);
  const modelTriggerRef = useRef<HTMLButtonElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"All" | "Rendered" | "Draft">("All");
  const [backendVideos, setBackendVideos] = useState<BackendVideoItem[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<ShowreelItem | null>(null);
  const [previewProject, setPreviewProject] = useState<Production | null>(null);
  const [now] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;
    // Through the API client, which sends the session: the list is the signed-in user's films only.
    api.prompt
      .list()
      .then((data) => {
        if (cancelled || !Array.isArray(data.videos)) return;
        setBackendVideos(
          data.videos.map((j) => ({
            id: j.id,
            jobId: j.harnessJobId ?? j.promptId,
            title: j.title ?? "",
            prompt: j.prompt ?? "",
            status: j.status,
            videoUrl: j.play?.[0] ?? null,
            previewUrl: null,
            createdAt: j.createdAt ?? "",
            durationSec: j.durationS ?? undefined,
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!previewTemplate && !previewProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewTemplate(null);
        setPreviewProject(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewTemplate, previewProject]);

  /* ── Numbers for the stat tiles ── */
  const creditsUsed = user.usage?.credits?.used ?? 0;
  const creditsLimit = user.usage?.credits?.limit ?? 0;
  const creditsLeft = Math.max(0, creditsLimit - creditsUsed);
  const creditPct = creditsLimit > 0 ? Math.min(100, Math.round((creditsUsed / creditsLimit) * 100)) : 0;
  const library = useMemo(() => collectVideos(chats), [chats]);
  const pending = useMemo(() => collectPending(chats), [chats]);
  const rendersThisMonth = user.usage?.renders?.monthly ?? library.length;
  const lifetime = user.usage?.renders?.lifetime ?? library.length;
  const tier = user.plan?.tier ?? "free";
  const firstName = user.name?.split(" ")[0] || "there";

  /* ── Recent productions: backend renders, else local library, else samples ── */
  const productions: Production[] = useMemo(() => {
    if (backendVideos.length) {
      return backendVideos.slice(0, 8).map((v, i) => {
        const url = v.videoUrl ? (v.videoUrl.startsWith("http") ? v.videoUrl : `${API_URL}${v.videoUrl}`) : null;
        const sample = SAMPLE_IDS[i % SAMPLE_IDS.length];
        return {
          id: v.jobId || v.id,
          title: v.title || "Untitled render",
          meta: timeAgo(v.createdAt),
          duration: v.durationSec ? `0:${String(Math.round(v.durationSec)).padStart(2, "0")}` : "0:10",
          poster: v.previewUrl ? (v.previewUrl.startsWith("http") ? v.previewUrl : `${API_URL}${v.previewUrl}`) : reelPoster(sample),
          videoUrl: url,
          status: url ? "Rendered" : "Draft",
        };
      });
    }
    if (library.length) {
      return library.slice(0, 8).map((v, i) => ({
        id: v.id,
        title: v.title,
        meta: timeAgo(v.createdAt),
        duration: "0:15",
        poster: reelPoster(SAMPLE_IDS[i % SAMPLE_IDS.length]),
        videoUrl: null,
        status: "Rendered" as const,
        chatId: v.chatId,
      }));
    }
    return SAMPLE_IDS.map((id) => {
      const r = SHOWREEL.find((x) => x.id === id)!;
      return {
        id,
        title: r.title,
        meta: "Sample · 1080p",
        duration: "0:10",
        poster: reelPoster(id),
        videoUrl: reelVideo(id),
        status: "Rendered" as const,
      };
    });
  }, [backendVideos, library]);

  const q = searchFilter.trim().toLowerCase();
  const shownProductions = productions.filter(
    (p) => (tab === "All" || p.status === tab) && (!q || p.title.toLowerCase().includes(q))
  );
  const shownTemplates = TEMPLATES.filter((t) => !q || t.title.toLowerCase().includes(q) || t.prompt.toLowerCase().includes(q));

  const activity = useMemo(
    () =>
      [...chats]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5)
        .map((c) => {
          const running = c.messages.some((m) => m.isStreaming);
          const failed = c.messages.at(-1)?.isError;
          const done = c.messages.some((m) => m.preview);
          return {
            id: c.id,
            title: c.title,
            when: timeAgo(c.updatedAt),
            state: running ? "Rendering" : failed ? "Failed" : done ? "Ready" : "Draft",
          };
        }),
    [chats]
  );

  const models = useModels();
  const currentModel = findModel(models, selectedModel);

  const handleGenerate = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = prompt.trim();
    if (!text) {
      promptRef.current?.focus();
      return;
    }
    onNewLaunch(text, {
      ratio,
      length: 15,
      provider: selectedProvider,
      model: selectedModel,
      effort: selectedEffort,
    });
  };

  const stats = [
    {
      label: "Credits left",
      value: creditsLimit > 0 ? creditsLeft.toLocaleString() : "—",
      foot: creditsLimit > 0 ? `${creditsUsed} of ${creditsLimit} used this month` : "No active plan",
      meter: creditPct,
    },
    {
      label: "Renders this month",
      value: rendersThisMonth.toLocaleString(),
      foot: `${lifetime.toLocaleString()} all time`,
      icon: FiFilm,
    },
    {
      label: "Rendering now",
      value: String(pending.length),
      foot: pending.length ? "Live in the studio" : "Queue is clear",
      icon: FiClock,
      live: pending.length > 0,
    },
    {
      label: "Projects",
      value: String(chats.length),
      foot: `${library.length} finished video${library.length === 1 ? "" : "s"}`,
      icon: FiLayers,
    },
  ];

  return (
    <div className="ov">
      <ModelSelectorModal
        isOpen={showModelModal}
        onClose={() => setShowModelModal(false)}
        selectedModelId={selectedModel}
        selectedEffort={selectedEffort}
        onSelect={(model, effort) => {
          setSelectedModel(model.id);
          setSelectedProvider(model.provider);
          setSelectedEffort(effort);
        }}
        triggerRef={modelTriggerRef}
      />

      {/* ── Page header ── */}
      <header className="ov-head">
        <div>
          <p className="ov-date">
            {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="ov-title">
            {greeting(now)}, {firstName}.
          </h1>
        </div>
        <div className="ov-head-actions">
          <span className="ov-plan">
            <span className="ov-plan-dot" />
            {tier[0].toUpperCase() + tier.slice(1)} plan
          </span>
          <button type="button" className="ov-btn-ghost" onClick={() => onNavigate("billing")}>
            Upgrade
          </button>
        </div>
      </header>

      {/* ── Composer ── */}
      <section className="ov-composer" aria-label="Start a new video">
        <div className="ov-composer-copy">
          <h2>What should we make today?</h2>
          <p>Describe the scene in plain words. byreel storyboards, animates and renders it.</p>
        </div>
        <form onSubmit={handleGenerate} className="ov-prompt">
          <textarea
            ref={promptRef}
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
            placeholder="A launch trailer for my app, lime on navy, ending on the logo…"
            aria-label="Describe your video"
          />
          <div className="ov-prompt-bar">
            <div className="ov-prompt-tools">
              <button
                ref={modelTriggerRef}
                type="button"
                className="ov-tool"
                onClick={() => setShowModelModal(true)}
                aria-label={`Model: ${currentModel.name}`}
              >
                <FiZap size={12} />
                <span>{currentModel.name}</span>
                <span className="ov-tool-tag">{selectedEffort === "xhigh" ? "max" : selectedEffort}</span>
                <FiChevronDown size={12} />
              </button>
              <div className="ov-seg" role="radiogroup" aria-label="Aspect ratio">
                {RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={ratio === r}
                    className={ratio === r ? "is-on" : undefined}
                    onClick={() => setRatio(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="ov-btn-primary">
              Generate
              <kbd>⌘↵</kbd>
            </button>
          </div>
        </form>
        <div className="ov-starters">
          {STARTERS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setPrompt(s.query);
                promptRef.current?.focus();
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="ov-stats" aria-label="This month">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="ov-stat">
              <div className="ov-stat-top">
                <span>{s.label}</span>
                {s.live ? <span className="ov-live" aria-hidden="true" /> : Icon ? <Icon size={14} /> : null}
              </div>
              <p className="ov-stat-value">{s.value}</p>
              {typeof s.meter === "number" && (
                <div className="ov-meter" aria-hidden="true">
                  <span
                    style={{ width: `${s.meter}%` }}
                    className={s.meter >= 90 ? "is-danger" : s.meter >= 70 ? "is-warn" : undefined}
                  />
                </div>
              )}
              <p className="ov-stat-foot">{s.foot}</p>
            </div>
          );
        })}
      </section>

      {/* ── Recent work + rail ── */}
      <div className="ov-split">
        <section className="ov-panel">
          <div className="ov-panel-head">
            <h2>Recent productions</h2>
            <div className="ov-tabs" role="tablist">
              {(["All", "Rendered", "Draft"] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
                  {t}
                </button>
              ))}
            </div>
            <button type="button" className="ov-link" onClick={() => onNavigate("your-videos")}>
              View all <FiArrowRight size={13} />
            </button>
          </div>

          {shownProductions.length ? (
            <div className="ov-grid">
              {shownProductions.map((p) => (
                <article key={p.id} className="ov-card">
                  <button
                    type="button"
                    className="ov-card-open"
                    onClick={() => (p.chatId && !p.videoUrl ? onOpenLaunch(p.chatId) : setPreviewProject(p))}
                    aria-label={`Open ${p.title}`}
                  >
                    <HoverVideo src={p.videoUrl} poster={p.poster} label={p.title} />
                    <span className={`ov-badge ${p.status === "Rendered" ? "is-ok" : ""}`}>{p.status}</span>
                    <span className="ov-dur">{p.duration}</span>
                    <span className="ov-play" aria-hidden="true">
                      <FiPlay size={14} />
                    </span>
                  </button>
                  <div className="ov-card-body">
                    <p className="ov-card-title">{p.title}</p>
                    <p className="ov-card-meta">{p.meta}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="ov-empty">
              <p>Nothing here yet.</p>
              <button type="button" className="ov-btn-ghost" onClick={() => promptRef.current?.focus()}>
                Write your first prompt
              </button>
            </div>
          )}
        </section>

        <aside className="ov-rail">
          <section className="ov-panel ov-usage">
            <div className="ov-panel-head">
              <h2>Plan usage</h2>
            </div>
            <div className="ov-ring-row">
              <svg viewBox="0 0 44 44" className="ov-ring" aria-hidden="true">
                <circle cx="22" cy="22" r="18" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  className="ov-ring-fill"
                  strokeDasharray={`${(creditPct / 100) * 113.1} 113.1`}
                />
              </svg>
              <div>
                <p className="ov-ring-num">{creditPct}%</p>
                <p className="ov-ring-label">of monthly credits used</p>
              </div>
            </div>
            <dl className="ov-dl">
              <div>
                <dt>Credits used</dt>
                <dd>
                  {creditsUsed} / {creditsLimit || "—"}
                </dd>
              </div>
              <div>
                <dt>Renews</dt>
                <dd>{formatDate(user.usage?.credits?.periodEnd)}</dd>
              </div>
            </dl>
            <button type="button" className="ov-btn-primary ov-full" onClick={() => onNavigate("billing")}>
              Manage plan <FiArrowUpRight size={14} />
            </button>
          </section>

          <section className="ov-panel">
            <div className="ov-panel-head">
              <h2>Activity</h2>
            </div>
            {activity.length ? (
              <ul className="ov-feed">
                {activity.map((a) => (
                  <li key={a.id}>
                    <button type="button" onClick={() => onOpenLaunch(a.id)}>
                      <span className={`ov-dot is-${a.state.toLowerCase()}`} aria-hidden="true" />
                      <span className="ov-feed-title">{a.title}</span>
                      <span className="ov-feed-meta">
                        {a.state} · {a.when}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ov-muted">Your prompts and renders will show up here.</p>
            )}
          </section>
        </aside>
      </div>

      {/* ── Templates ── */}
      <section className="ov-panel ov-panel-flat">
        <div className="ov-panel-head">
          <h2>Start from a reel</h2>
          <button type="button" className="ov-link" onClick={() => onNavigate("templates")}>
            All templates <FiArrowRight size={13} />
          </button>
        </div>
        <div className="ov-grid ov-grid-3">
          {shownTemplates.map((t) => (
            <article key={t.id} className="ov-card">
              <button type="button" className="ov-card-open" onClick={() => setPreviewTemplate(t)} aria-label={`Preview ${t.title}`}>
                <HoverVideo src={reelVideo(t.id)} poster={reelPoster(t.id)} label={t.title} />
                <span className="ov-badge">{t.category}</span>
              </button>
              <div className="ov-card-body ov-card-row">
                <div className="min-w-0">
                  <p className="ov-card-title">{t.title}</p>
                  <p className="ov-card-meta">{t.prompt}</p>
                </div>
                <button type="button" className="ov-use" onClick={() => onNewLaunch(t.prompt)}>
                  Use
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Template preview ── */}
      {previewTemplate && (
        <div className="ov-modal" onClick={() => setPreviewTemplate(null)} role="presentation">
          <div className="ov-modal-card" role="dialog" aria-modal="true" aria-label={previewTemplate.title} onClick={(e) => e.stopPropagation()}>
            <div className="ov-modal-video">
              <video src={`/showreel/video/${previewTemplate.id}-720.mp4`} poster={reelPoster(previewTemplate.id)} autoPlay muted loop playsInline />
            </div>
            <div className="ov-modal-body">
              <span className="ov-badge is-static">{previewTemplate.category}</span>
              <h3>{previewTemplate.title}</h3>
              <p>{previewTemplate.prompt}</p>
            </div>
            <div className="ov-modal-foot">
              <button type="button" className="ov-btn-ghost" onClick={() => setPreviewTemplate(null)}>
                Close
              </button>
              <button
                type="button"
                className="ov-btn-primary"
                onClick={() => {
                  const p = previewTemplate.prompt;
                  setPreviewTemplate(null);
                  onNewLaunch(p);
                }}
              >
                Use this prompt <FiArrowRight size={14} />
              </button>
            </div>
            <button type="button" className="ov-modal-x" aria-label="Close" onClick={() => setPreviewTemplate(null)}>
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Production preview ── */}
      {previewProject && (
        <div className="ov-modal" onClick={() => setPreviewProject(null)} role="presentation">
          <div className="ov-modal-card" role="dialog" aria-modal="true" aria-label={previewProject.title} onClick={(e) => e.stopPropagation()}>
            <div className="ov-modal-video">
              {previewProject.videoUrl ? (
                <video src={previewProject.videoUrl} poster={previewProject.poster} controls autoPlay loop playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewProject.poster} alt={previewProject.title} />
              )}
            </div>
            <div className="ov-modal-body">
              <h3>{previewProject.title}</h3>
              <p>
                {previewProject.duration} · {previewProject.meta}
              </p>
            </div>
            <div className="ov-modal-foot">
              {previewProject.videoUrl && (
                <a className="ov-btn-ghost" href={previewProject.videoUrl} download>
                  <FiDownload size={14} /> Download
                </a>
              )}
              <button
                type="button"
                className="ov-btn-primary"
                onClick={() => {
                  const p = previewProject;
                  setPreviewProject(null);
                  if (p.chatId) onOpenLaunch(p.chatId);
                  else onNewLaunch(p.title);
                }}
              >
                Open in studio <FiArrowRight size={14} />
              </button>
            </div>
            <button type="button" className="ov-modal-x" aria-label="Close" onClick={() => setPreviewProject(null)}>
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
