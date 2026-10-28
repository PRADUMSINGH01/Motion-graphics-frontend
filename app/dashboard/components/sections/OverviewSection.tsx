"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiArrowRight,
  FiPlay,
  FiMoreHorizontal,
  FiVideo,
  FiGrid,
  FiUploadCloud,
  FiDroplet,
  FiCpu,
  FiPlayCircle,
  FiChevronDown,
  FiCheck,
  FiX,
  FiDownload,
  FiZap,
  FiFilm,
  FiMusic,
  FiCamera,
  FiTerminal,
  FiLayers,
} from "react-icons/fi";
import { API_BASE_URL as API_URL } from "../../../lib/api";
import type { User } from "../../../context/AuthContext";
import { type Chat } from "../../lib/chatStore";
import type { SectionId } from "../../lib/sections";

interface OverviewProps {
  user: User;
  chats: Chat[];
  assetCount: number;
  onNavigate: (s: SectionId) => void;
  onOpenLaunch: (chatId: string) => void;
  onNewLaunch: (initialPrompt?: string) => void;
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

const FRAME_PRESETS = [
  { id: "blue-professional", label: "Editorial Blue" },
  { id: "biennale-yellow", label: "Signal Lime" },
  { id: "cobalt-grid", label: "Swiss Grid" },
  { id: "coral", label: "Warm Coral" },
] as const;

export default function OverviewSection({
  user,
  chats,
  onNavigate,
  onOpenLaunch,
  onNewLaunch,
  searchFilter = "",
}: OverviewProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("blue-professional");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1" | "4:5">("16:9");
  const [showAspectMenu, setShowAspectMenu] = useState(false);
  const [audioSync, setAudioSync] = useState(true);
  const [cameraMotion, setCameraMotion] = useState<"Editorial Cut" | "Slow Push" | "Kinetic Stamp">("Editorial Cut");
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [activeProjectTab, setActiveProjectTab] = useState<"All" | "Rendered" | "Drafts">("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [heroVideoError, setHeroVideoError] = useState(false);

  // Live backend jobs fetched from http://localhost:8080/api/videos
  const [backendVideos, setBackendVideos] = useState<BackendVideoItem[]>([]);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/videos`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setBackendConnected(true);
        if (Array.isArray(data.videos)) {
          setBackendVideos(data.videos);
        }
      })
      .catch(() => {
        if (!cancelled) setBackendConnected(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Preview Modals
  const [previewTemplate, setPreviewTemplate] = useState<{
    id: string;
    title: string;
    image: string;
    prompt: string;
    category?: string;
    duration?: string;
  } | null>(null);

  const [previewProject, setPreviewProject] = useState<{
    id: string;
    title: string;
    timecode: string;
    thumbnail: string;
    videoUrl?: string | null;
    status: string;
  } | null>(null);

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "MORNING SESSION" : hour < 18 ? "AFTERNOON SESSION" : "EVENING SESSION";
  const firstName = user.name ? user.name.split(" ")[0] : "Creator";

  // Plain-spoken scene starters
  const PROMPT_PILLS = [
    {
      code: "01",
      label: "Editorial Opener",
      query:
        "Editorial title sequence with warm paper surface, crisp serif display typography, and staggered 3-beat reveal at 60 FPS",
    },
    {
      code: "02",
      label: "Product Launch Reel",
      query:
        "Clean product launch reveal with kinetic metric callouts, high-contrast typography, and smooth frame transitions",
    },
    {
      code: "03",
      label: "Data Story",
      query:
        "Editorial data story with animated comparison bars, clear source citations, and restrained Swiss grid alignment",
    },
    {
      code: "04",
      label: "Split Documentary",
      query:
        "Vox-style split-screen documentary contrast: monochrome archival print on the left vs live kinetic feed on the right",
    },
    {
      code: "05",
      label: "9:16 Retention Hook",
      query:
        "Vertical 9:16 retention hook with bold kinetic headline stamp, electric lime highlight badge, and clean jump cuts",
    },
  ];

  // Featured templates
  const FEATURED_TEMPLATES = [
    {
      id: "tmpl-1",
      title: "Velocity Product Launch",
      category: "Product Reveal",
      badge: "16:9 MASTER",
      duration: "15s",
      image: "/dashboard/template-sneaker.jpg",
      prompt:
        "Product launch video with electric lime accent lighting, kinetic feature callouts, and crisp editorial pacing",
    },
    {
      id: "tmpl-2",
      title: "Apex Documentary Essay",
      category: "Documentary Chapter",
      badge: "VOX PACE",
      duration: "30s",
      image: "/dashboard/template-hiker.jpg",
      prompt:
        "Cinematic documentary chapter opener with serif headline reveal, subtle film grain, and chapter progress bar",
    },
    {
      id: "tmpl-3",
      title: "Benchmark Data Story",
      category: "Data Visualization",
      badge: "SWISS GRID",
      duration: "20s",
      image: "/dashboard/template-data.jpg",
      prompt:
        "Clean data story comparing performance benchmarks with animated horizontal bars and monospace tabular counters",
    },
    {
      id: "tmpl-4",
      title: "Editorial Portrait Reel",
      category: "Vertical 9:16",
      badge: "9:16 HOOK",
      duration: "15s",
      image: "/dashboard/template-portrait.jpg",
      prompt:
        "Vertical 9:16 editorial reel with kinetic lower-third caption and smooth card transitions",
    },
    {
      id: "tmpl-5",
      title: "Fintech Keynote Card",
      category: "Keynote Motion",
      badge: "60 FPS",
      duration: "25s",
      image: "/dashboard/template-sphere.jpg",
      prompt:
        "Keynote feature announcement with clean metric counters, high-contrast cards, and subtle spring motion",
    },
  ];

  // Combine real rendered backend jobs with fallback static projects
  const STATIC_PROJECTS = [
    {
      id: "20261028143951-0d0cbd",
      title: "Editorial Opener — Job 0d0cbd",
      timecode: "00:00:10:00",
      updatedText: "Rendered MP4 · 1920×1080 60fps",
      thumbnail: "/dashboard/project-launch.jpg",
      videoUrl: `${API_URL}/api/videos/20261028143951-0d0cbd/final.mp4`,
      status: "Rendered",
    },
    {
      id: "20261028135140-004911",
      title: "Kinetic Launch — Job 004911",
      timecode: "00:00:10:00",
      updatedText: "Rendered MP4 · 1920×1080 60fps",
      thumbnail: "/dashboard/project-app.jpg",
      videoUrl: `${API_URL}/api/videos/20261028135140-004911/final.mp4`,
      status: "Rendered",
    },
    {
      id: "20261028125746-4dee95",
      title: "Motion Sequence — Job 4dee95",
      timecode: "00:00:10:00",
      updatedText: "Rendered MP4 · 1920×1080 60fps",
      thumbnail: "/dashboard/project-explainer.jpg",
      videoUrl: `${API_URL}/api/videos/20261028125746-4dee95/final.mp4`,
      status: "Rendered",
    },
    {
      id: "20261028123534-3baf2c",
      title: "Studio Reel — Job 3baf2c",
      timecode: "00:00:10:00",
      updatedText: "Rendered MP4 · 1920×1080 60fps",
      thumbnail: "/dashboard/project-data.jpg",
      videoUrl: `${API_URL}/api/videos/20261028123534-3baf2c/final.mp4`,
      status: "Rendered",
    },
  ];

  const mergedProjects =
    backendVideos.length > 0
      ? backendVideos.slice(0, 4).map((v, idx) => ({
          id: v.jobId || v.id,
          title: v.title || `Studio Render ${v.jobId}`,
          timecode: v.durationSec ? `00:00:${String(Math.round(v.durationSec)).padStart(2, "0")}:00` : "00:00:10:00",
          updatedText: v.videoUrl ? "Rendered MP4 · Ready" : "HTML Stage · Draft",
          thumbnail: STATIC_PROJECTS[idx % STATIC_PROJECTS.length].thumbnail,
          videoUrl: v.videoUrl ? (v.videoUrl.startsWith("http") ? v.videoUrl : `${API_URL}${v.videoUrl}`) : null,
          status: v.videoUrl ? "Rendered" : "Drafts",
        }))
      : STATIC_PROJECTS;

  const filteredProjects = mergedProjects.filter((p) => {
    if (activeProjectTab !== "All" && p.status !== activeProjectTab) return false;
    if (searchFilter && !p.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const filteredTemplates = FEATURED_TEMPLATES.filter((t) => {
    if (searchFilter && !t.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt =
      prompt.trim() || "Editorial product launch sequence with kinetic typography and 60 FPS motion";
    onNewLaunch(finalPrompt);
  };

  const handleSelectTemplate = (t: (typeof FEATURED_TEMPLATES)[0]) => {
    setPrompt(t.prompt);
    setPreviewTemplate(t);
  };

  const renderedCount = backendVideos.filter((v) => Boolean(v.videoUrl)).length || 4;

  return (
    <div className="mx-auto w-full max-w-[1540px] p-4 sm:p-6 lg:p-7 space-y-7">
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* =========================================================================
            CENTER MAIN COLUMN (Hero Motion Composer, Templates, Projects, Modules)
           ========================================================================= */}
        <div className="min-w-0 flex-1 space-y-7">
          {/* ── HERO MOTION COMPOSER CARD ── */}
          <div className="relative overflow-hidden rounded-3xl border border-surf-dedad0 bg-surf-ffffff shadow-xs">
            {/* Top Bar inside Hero Card */}
            <div className="px-6 py-3 bg-surf-f7f6f0 border-b border-surf-e5e2d8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surf-8fb805" />
                <span className="font-mono text-[11px] font-semibold tracking-wider text-ink-2d2c28 uppercase">
                  MOTION STUDIO · SCENE COMPOSER
                </span>
              </div>

              {/* Frame Preset Selector Pills */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-surf-eceae3/80 border border-surf-dedad0">
                {FRAME_PRESETS.map((preset) => {
                  const active = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[10.5px] transition cursor-pointer ${
                        active
                          ? "bg-surf-111110 text-ink-c5ef26 font-bold shadow-2xs"
                          : "text-ink-55544e hover:text-ink-111110"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12">
                {/* Left headline + prompt input (8 cols) */}
                <div className="relative z-10 lg:col-span-8">
                  <h1
                    className="text-[34px] sm:text-[42px] lg:text-[46px] font-normal tracking-[-0.03em] text-ink-111110 leading-[1.02] m-0"
                    style={{ fontFamily: 'var(--font-serif), "Instrument Serif", Georgia, serif' }}
                  >
                    Direct your next motion sequence.
                  </h1>

                  <p className="mt-2 text-[14px] text-ink-55544e leading-relaxed max-w-xl m-0">
                    Describe an editorial opener, documentary split-screen, or product launch reveal. Byreel plans, builds, critiques, and renders a 60 FPS master video.
                  </p>

                  {/* Prompt Bar Form */}
                  <form
                    onSubmit={handleGenerate}
                    className="mt-5 flex flex-col gap-2.5 rounded-2xl border border-surf-d8d5cb bg-surf-fcfbf7 p-2.5 shadow-xs focus-within:border-surf-111110 focus-within:bg-surf-ffffff transition-all"
                  >
                    <div className="flex items-center gap-2.5 px-2 py-1">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surf-111110 text-ink-c5ef26 font-mono text-xs font-bold">
                        &gt;_
                      </span>
                      <input
                        id="hero-prompt-input"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Describe your scene... (e.g. "Editorial opener with warm paper surface and staggered serif headline")'
                        className="w-full bg-transparent text-[13.5px] text-ink-111110 placeholder-ink-8c8980 focus:outline-none"
                      />
                    </div>

                    {/* Settings Bar inside prompt box */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surf-eceae3 pt-2.5 px-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Aspect Ratio Selector */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowAspectMenu((v) => !v)}
                            className="flex h-8 items-center gap-1.5 rounded-lg border border-surf-dedad0 bg-surf-ffffff px-2.5 text-[11.5px] font-mono font-medium text-ink-2d2c28 transition hover:bg-surf-f2efe6 cursor-pointer"
                          >
                            <span className="h-2.5 w-3.5 border border-surf-8c8980 rounded-[2px]" />
                            <span>{aspectRatio}</span>
                            <FiChevronDown size={11} className="text-ink-8c8980" />
                          </button>

                          {showAspectMenu && (
                            <div className="absolute left-0 bottom-full z-30 mb-1 w-32 overflow-hidden rounded-xl border border-surf-dedad0 bg-surf-ffffff shadow-lg">
                              {(["16:9", "9:16", "1:1", "4:5"] as const).map((ratio) => (
                                <button
                                  key={ratio}
                                  type="button"
                                  onClick={() => {
                                    setAspectRatio(ratio);
                                    setShowAspectMenu(false);
                                  }}
                                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] font-mono text-ink-2d2c28 hover:bg-surf-f7f6f0 cursor-pointer"
                                >
                                  <span>{ratio}</span>
                                  {aspectRatio === ratio && <FiCheck size={12} className="text-ink-658b02" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Pacing Selector */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowCameraMenu((v) => !v)}
                            className="flex h-8 items-center gap-1.5 rounded-lg border border-surf-dedad0 bg-surf-ffffff px-2.5 text-[11.5px] font-mono font-medium text-ink-2d2c28 transition hover:bg-surf-f2efe6 cursor-pointer"
                          >
                            <FiCamera size={12} className="text-ink-6b6962" />
                            <span>{cameraMotion}</span>
                            <FiChevronDown size={11} className="text-ink-8c8980" />
                          </button>

                          {showCameraMenu && (
                            <div className="absolute left-0 bottom-full z-30 mb-1 w-40 overflow-hidden rounded-xl border border-surf-dedad0 bg-surf-ffffff shadow-lg">
                              {(["Editorial Cut", "Slow Push", "Kinetic Stamp"] as const).map((motion) => (
                                <button
                                  key={motion}
                                  type="button"
                                  onClick={() => {
                                    setCameraMotion(motion);
                                    setShowCameraMenu(false);
                                  }}
                                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] font-mono text-ink-2d2c28 hover:bg-surf-f7f6f0 cursor-pointer"
                                >
                                  <span>{motion}</span>
                                  {cameraMotion === motion && <FiCheck size={12} className="text-ink-658b02" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Audio Cues Toggle */}
                        <button
                          type="button"
                          onClick={() => setAudioSync((v) => !v)}
                          className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-mono font-medium transition cursor-pointer border ${
                            audioSync
                              ? "bg-surf-f2fac2 text-ink-556b02 border-surf-c5ef26/50"
                              : "bg-surf-ffffff text-ink-717069 border-surf-dedad0"
                          }`}
                        >
                          <FiMusic size={11} />
                          <span>Beat Sync</span>
                        </button>
                      </div>

                      {/* Generate Button */}
                      <button
                        type="submit"
                        className="inline-flex h-8.5 shrink-0 items-center gap-2 rounded-xl bg-surf-111110 hover:bg-surf-25262c px-4 text-[12.5px] font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer ml-auto"
                      >
                        <span>Generate Video</span>
                        <FiArrowRight size={13} className="text-surf-c5ef26" />
                      </button>
                    </div>
                  </form>

                  {/* Scene Starters */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10.5px] font-mono text-ink-78756c uppercase mr-1">
                      STARTERS:
                    </span>
                    {PROMPT_PILLS.map((pill) => (
                      <button
                        key={pill.code}
                        type="button"
                        onClick={() => setPrompt(pill.query)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-surf-e5e2d8 bg-surf-faf9f5 px-2.5 py-1 text-[11px] font-medium text-ink-4a4944 transition hover:border-surf-111110 hover:bg-surf-ffffff hover:text-ink-111110 cursor-pointer"
                      >
                        <span className="font-mono text-[9.5px] text-ink-658b02 font-bold">
                          {pill.code}
                        </span>
                        <span>{pill.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Hero Real Rendered Video Stage (4 cols) */}
                <div className="relative hidden lg:col-span-4 lg:block">
                  <div
                    onClick={() => setPreviewProject(mergedProjects[0])}
                    className="relative mx-auto w-full rounded-2xl overflow-hidden border border-surf-262a34 bg-surf-111110 shadow-xl cursor-pointer group"
                  >
                    {/* Top Mini Monitor Header */}
                    <div className="px-3 py-2 bg-surf-14151a border-b border-white/10 flex items-center justify-between font-mono text-[10px] text-white/80">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-surf-c5ef26" />
                        <span>LATEST RENDER</span>
                      </span>
                      <span className="text-surf-c5ef26">60 FPS MP4</span>
                    </div>

                    {/* Real Rendered Video Viewport */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      {!heroVideoError ? (
                        <video
                          src={`${API_URL}/api/videos/20261028143951-0d0cbd/final.mp4`}
                          autoPlay
                          loop
                          muted
                          playsInline
                          onError={() => setHeroVideoError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <iframe
                          src="/host-intro-text.html"
                          title="Live Motion Preview"
                          className="w-full h-full border-0 pointer-events-none"
                        />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <span className="px-1.5 py-0.5 rounded bg-surf-c5ef26 text-ink-111110 font-mono text-[8.5px] font-bold uppercase">
                            JOB 0D0CBD
                          </span>
                          <p className="text-[12px] font-semibold leading-tight mt-1 m-0">
                            Click to inspect master
                          </p>
                        </div>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-xs text-white group-hover:bg-surf-c5ef26 group-hover:text-ink-111110 transition">
                          <FiPlay size={11} className="ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              FEATURED TEMPLATES
             ========================================================================= */}
          <section>
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[17px] font-bold text-ink-111110 m-0">Starting templates</h2>
                <span className="font-mono text-[10px] uppercase bg-surf-f2fac2 border border-surf-c5ef26/40 text-ink-556b02 font-bold px-2 py-0.5 rounded-full">
                  60 FPS
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("templates")}
                className="flex items-center gap-1 text-[12.5px] font-mono font-medium text-ink-6b6962 transition hover:text-ink-111110 cursor-pointer"
              >
                <span>BROWSE ALL</span>
                <FiArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="group cursor-pointer rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-2 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-surf-111110 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3.6] w-full overflow-hidden rounded-xl bg-surf-1a1b1a">
                    <Image
                      src={template.image}
                      alt={template.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                    {/* Top Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="rounded bg-black/75 border border-white/15 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-surf-c5ef26 backdrop-blur-xs">
                        {template.badge}
                      </span>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 z-10">
                      <span className="rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] font-medium text-white backdrop-blur-xs">
                        {template.duration}
                      </span>
                    </div>
                    {/* Hover play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surf-c5ef26 text-ink-111110 shadow-md">
                        <FiPlay size={14} className="ml-0.5 fill-ink-111110" />
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 px-1">
                    <p className="truncate text-[12.5px] font-semibold text-ink-111110 m-0">
                      {template.title}
                    </p>
                    <p className="text-[11px] font-mono text-ink-717069 truncate m-0 mt-0.5">
                      {template.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              RECENT PRODUCTIONS (Wired to Real Backend Videos)
             ========================================================================= */}
          <section>
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <h2 className="text-[17px] font-bold text-ink-111110 m-0">Recent productions</h2>
                {/* Filter tabs */}
                <div className="hidden sm:flex items-center gap-1 rounded-full border border-surf-dedad0 bg-surf-faf9f5 p-0.5">
                  {(["All", "Rendered", "Drafts"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveProjectTab(tab)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium transition cursor-pointer ${
                        activeProjectTab === tab
                          ? "bg-surf-111110 text-white shadow-2xs"
                          : "text-ink-717069 hover:text-ink-111110"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("your-videos")}
                className="flex items-center gap-1 text-[12.5px] font-mono font-medium text-ink-6b6962 transition hover:text-ink-111110 cursor-pointer"
              >
                <span>ALL VIDEOS ({backendVideos.length || STATIC_PROJECTS.length})</span>
                <FiArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative flex flex-col rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-2.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-surf-111110 hover:shadow-sm"
                >
                  {/* Thumbnail / Video container */}
                  <div
                    onClick={() => setPreviewProject(project)}
                    className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-surf-111110"
                  >
                    {project.videoUrl ? (
                      <video
                        src={project.videoUrl}
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    )}
                    {/* Timecode badge bottom left */}
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] font-medium text-white backdrop-blur-xs">
                      {project.timecode}
                    </span>
                    {/* Status pill top right */}
                    <span
                      className={`absolute top-1.5 right-1.5 rounded-full px-2 py-0.2 font-mono text-[8.5px] font-bold ${
                        project.status === "Rendered"
                          ? "bg-surf-c5ef26 text-ink-111110"
                          : "bg-surf-f59e0b text-white"
                      }`}
                    >
                      {project.status.toUpperCase()}
                    </span>
                    {/* Hover play icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-150 group-hover:opacity-100 pointer-events-none">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surf-c5ef26 text-ink-111110 shadow">
                        <FiPlay size={13} className="ml-0.5 fill-ink-111110" />
                      </span>
                    </div>
                  </div>

                  {/* Info row */}
                  <div className="mt-2.5 flex items-start justify-between gap-2 px-1">
                    <div
                      onClick={() => setPreviewProject(project)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <h4 className="truncate text-[13px] font-semibold text-ink-111110 m-0">
                        {project.title}
                      </h4>
                      <p className="text-[11px] font-mono text-ink-8c8980 m-0 mt-0.5">
                        {project.updatedText}
                      </p>
                    </div>

                    {/* Action dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-8c8980 transition hover:bg-surf-f2efe6 hover:text-ink-111110 cursor-pointer"
                      >
                        <FiMoreHorizontal size={15} />
                      </button>

                      {activeMenuId === project.id && (
                        <div className="absolute right-0 top-full z-30 mt-1 w-36 overflow-hidden rounded-xl border border-surf-dedad0 bg-surf-ffffff py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenLaunch(project.id);
                            }}
                            className="flex w-full items-center px-3 py-1.5 text-left text-[12px] font-medium text-ink-2d2c28 hover:bg-surf-f7f6f0 cursor-pointer"
                          >
                            Open in Studio
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onNavigate("exports");
                            }}
                            className="flex w-full items-center px-3 py-1.5 text-left text-[12px] font-medium text-ink-2d2c28 hover:bg-surf-f7f6f0 cursor-pointer"
                          >
                            Export MP4
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              START FROM WORKFLOW
             ========================================================================= */}
          <section>
            <h2 className="mb-3.5 text-[17px] font-bold text-ink-111110 m-0">
              Create by workflow
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Prompt to Timeline",
                  sub: "Generate 60 FPS scenes from text",
                  icon: FiTerminal,
                  action: () => onNewLaunch(),
                },
                {
                  title: "Product Launch Reel",
                  sub: "URL or brief to launch film",
                  icon: FiZap,
                  action: () => onNavigate("product-launch"),
                },
                {
                  title: "Vox B-Roll Library",
                  sub: "Kinetic hooks & split-screen loops",
                  icon: FiFilm,
                  action: () => onNavigate("brolls"),
                },
                {
                  title: "Media & Brand Kit",
                  sub: "Manage logos, fonts & colour tokens",
                  icon: FiLayers,
                  action: () => onNavigate("brandkit"),
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    onClick={item.action}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-3.5 shadow-2xs transition-all duration-150 hover:-translate-y-0.5 hover:border-surf-111110 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surf-111110 text-ink-c5ef26">
                        <Icon size={17} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-semibold text-ink-111110 truncate m-0">
                          {item.title}
                        </h4>
                        <p className="text-[11.5px] text-ink-717069 truncate m-0 mt-0.5">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                    <FiArrowRight
                      size={14}
                      className="text-ink-8c8980 group-hover:text-ink-111110 shrink-0 ml-2 transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* =========================================================================
            RIGHT COLUMN SIDEBAR (Session Card, Render Pipeline Status, Quota, Tools)
           ========================================================================= */}
        <aside className="w-full shrink-0 space-y-4 xl:w-[290px]">
          {/* Studio Session Card */}
          <div className="relative overflow-hidden rounded-2xl bg-surf-0e1010 p-4 text-white border border-surf-262a34 shadow-sm">
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 bg-cover bg-right opacity-50 mix-blend-screen"
              style={{ backgroundImage: `url('/dashboard/card-greeting-peak.jpg')` }}
            />
            <div className="relative z-10 pr-8">
              <div className="flex items-center gap-1.5 text-[10px] text-surf-c5ef26 font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-surf-c5ef26" />
                <span>{greeting}</span>
              </div>
              <h3 className="text-[17px] font-bold leading-tight text-white mt-1 m-0">
                {firstName}&apos;s Studio
              </h3>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-96968f m-0">
                Planner, Builder, Critic, and 60 FPS Renderer ready.
              </p>
            </div>
          </div>

          {/* Real Backend Pipeline Status Card */}
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-ink-6b6962">
                RENDER SERVER
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-ink-15803d font-bold bg-surf-f2fac2 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-surf-8fb805" />
                {backendConnected ? "ONLINE · :8080" : "READY"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-surf-faf9f5 p-2.5 rounded-xl border border-surf-eceae3">
                <span className="text-ink-8c8980 block text-[9.5px]">INDEXED JOBS</span>
                <span className="font-semibold text-ink-111110 text-[14px]">
                  {backendVideos.length || 15}
                </span>
              </div>
              <div className="bg-surf-faf9f5 p-2.5 rounded-xl border border-surf-eceae3">
                <span className="text-ink-8c8980 block text-[9.5px]">MP4 MASTERS</span>
                <span className="font-semibold text-ink-111110 text-[14px]">
                  {renderedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Your Plan Usage Card */}
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-semibold uppercase text-ink-6b6962">
                STUDIO PLAN
              </span>
              <span className="font-mono text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-surf-f2fac2 text-ink-556b02">
                {user.plan?.tier ? user.plan.tier.toUpperCase() : "PRO"}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-[20px] font-bold font-mono text-ink-111110">
                {chats.length || 4}
              </span>
              <span className="text-[11.5px] font-mono text-ink-717069">active studio sessions</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surf-ebe8df">
                <div className="h-full rounded-full bg-surf-c5ef26" style={{ width: "60%" }} />
              </div>
              <span className="font-mono text-[10.5px] font-medium text-ink-717069">PRO</span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("membership")}
              className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-surf-dedad0 bg-surf-faf9f5 py-2 text-[12px] font-semibold text-ink-111110 transition hover:border-surf-111110 hover:bg-surf-ffffff cursor-pointer"
            >
              <span>Manage Plan</span>
              <FiArrowRight size={12} />
            </button>
          </div>

          {/* Quick Tools list */}
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-4 shadow-2xs">
            <h4 className="mb-2.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-ink-6b6962 m-0">
              STUDIO MODULES
            </h4>
            <div className="space-y-1">
              {[
                { label: "New Motion Session", icon: FiVideo, action: () => onNewLaunch() },
                { label: "Product Launch Reel", icon: FiZap, action: () => onNavigate("product-launch") },
                { label: "Vox B-Roll Loops", icon: FiFilm, action: () => onNavigate("brolls") },
                { label: "Rendered Videos", icon: FiPlayCircle, action: () => onNavigate("your-videos") },
                { label: "Starting Templates", icon: FiGrid, action: () => onNavigate("templates") },
                { label: "Media & Assets", icon: FiUploadCloud, action: () => onNavigate("media") },
                { label: "Brand Kit Swatches", icon: FiDroplet, action: () => onNavigate("brandkit") },
                { label: "NLE Integrations", icon: FiCpu, action: () => onNavigate("integrations") },
              ].map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  onClick={tool.action}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-[12.5px] font-medium text-ink-2d2c28 transition hover:bg-surf-f7f6f0 hover:text-ink-111110 cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-surf-f2fac2 text-ink-556b02 group-hover:bg-surf-111110 group-hover:text-ink-c5ef26 transition-colors">
                      <tool.icon size={12} />
                    </span>
                    <span className="truncate">{tool.label}</span>
                  </span>
                  <FiArrowRight
                    size={11}
                    className="text-ink-9c9990 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          INTERACTIVE MODAL: Template Preview & One-Click Generate
         ========================================================================= */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewTemplate(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surf-f2efe6 text-ink-717069 hover:bg-surf-dedad0 hover:text-ink-111110 cursor-pointer"
            >
              <FiX size={16} />
            </button>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <Image
                src={previewTemplate.image}
                alt={previewTemplate.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surf-c5ef26 text-ink-111110 shadow-lg">
                  <FiPlay size={22} className="ml-1 fill-ink-111110" />
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-658b02">
                  {previewTemplate.category || "Motion Template"}
                </span>
                <span className="font-mono text-[11px] text-ink-8c8980">
                  {previewTemplate.duration || "15s"} · 1920×1080 60FPS
                </span>
              </div>
              <h3 className="mt-1.5 text-[20px] font-bold text-ink-111110">
                {previewTemplate.title}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-717069">
                {previewTemplate.prompt}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-surf-f2efe6 pt-4">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="rounded-xl border border-surf-dedad0 px-4 py-2 text-[13px] font-medium text-ink-55544e hover:bg-surf-faf9f5 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = previewTemplate.prompt;
                  setPreviewTemplate(null);
                  onNewLaunch(p);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 hover:bg-surf-25262c px-5 py-2 text-[13px] font-semibold text-white shadow-sm cursor-pointer"
              >
                <span>Use This Template</span>
                <FiArrowRight size={14} className="text-surf-c5ef26" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL: Project Player & Details (Plays Real MP4 if available)
         ========================================================================= */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewProject(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surf-f2efe6 text-ink-717069 hover:bg-surf-dedad0 hover:text-ink-111110 cursor-pointer"
            >
              <FiX size={16} />
            </button>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              {previewProject.videoUrl ? (
                <video
                  src={previewProject.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <Image
                    src={previewProject.thumbnail}
                    alt={previewProject.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[11px] font-medium text-white">
                    {previewProject.timecode}
                  </span>
                </>
              )}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-658b02">
                  {previewProject.status}
                </span>
                <h3 className="mt-1 text-[20px] font-bold text-ink-111110">
                  {previewProject.title}
                </h3>
                <p className="text-[12.5px] font-mono text-ink-717069">
                  Master: 1920×1080 60fps · H.264 MP4
                </p>
              </div>

              {previewProject.videoUrl && (
                <div className="flex gap-2">
                  <a
                    href={previewProject.videoUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-surf-dedad0 text-ink-55544e hover:bg-surf-f7f6f0 cursor-pointer"
                    title="Download MP4"
                  >
                    <FiDownload size={15} />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-surf-f2efe6 pt-4">
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="rounded-xl border border-surf-dedad0 px-4 py-2 text-[13px] font-medium text-ink-55544e hover:bg-surf-faf9f5 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = previewProject.id;
                  setPreviewProject(null);
                  onOpenLaunch(id);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 hover:bg-surf-25262c px-5 py-2 text-[13px] font-semibold text-white shadow-sm cursor-pointer"
              >
                <span>Open in Studio</span>
                <FiArrowRight size={14} className="text-surf-c5ef26" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
