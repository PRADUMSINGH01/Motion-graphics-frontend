"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FiArrowRight,
  FiPlay,
  FiMoreHorizontal,
  FiX,
  FiDownload,
  FiZap,
  FiChevronDown,
} from "react-icons/fi";
import { API_BASE_URL as API_URL } from "../../../lib/api";
import type { User } from "../../../context/AuthContext";
import { type Chat, type ChatSettings, type Ratio, DEFAULT_SETTINGS } from "../../lib/chatStore";
import type { SectionId } from "../../lib/sections";
import ModelSelectorModal, { AVAILABLE_MODELS, type EffortLevel } from "../ModelSelectorModal";

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

export default function OverviewSection({
  user,
  chats,
  onNavigate,
  onOpenLaunch,
  onNewLaunch,
  searchFilter = "",
}: OverviewProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "RGBA">("16:9");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_SETTINGS.model || "glm-5.3-flash");
  const [selectedProvider, setSelectedProvider] = useState<string>(DEFAULT_SETTINGS.provider || "glm");
  const [selectedEffort, setSelectedEffort] = useState<EffortLevel>((DEFAULT_SETTINGS.effort as EffortLevel) || "high");
  const [showModelModal, setShowModelModal] = useState(false);
  const modelTriggerRef = useRef<HTMLButtonElement>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<"All" | "Rendered" | "Drafts">("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Live backend jobs fetched from http://localhost:8080/api/videos
  const [backendVideos, setBackendVideos] = useState<BackendVideoItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/videos`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (Array.isArray(data.videos)) {
          setBackendVideos(data.videos);
        }
      })
      .catch(() => {});
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
    src?: string;
  } | null>(null);

  const [previewProject, setPreviewProject] = useState<{
    id: string;
    title: string;
    timecode: string;
    thumbnail: string;
    videoUrl?: string | null;
    status: string;
  } | null>(null);

  // Plain-spoken scene starters for the 4 core formats
  const PROMPT_PILLS = [
    {
      code: "01",
      label: "Text Animation & Transitions",
      query:
        "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
    },
    {
      code: "02",
      label: "Product Launch Trailer",
      query:
        "Direct a multi-scene SaaS product launch trailer with isometric UI cards, +340% YoY telemetry bars, sub-8ms latency counter, and a bold CTA end-card.",
    },
    {
      code: "03",
      label: "Editorial B-Roll Cutaway",
      query:
        "Create a 10-second animated B-roll cutaway panning across an archival print clipping with an electric lime marker sweep and live telemetry chart.",
    },
    {
      code: "04",
      label: "Faceless Story & Captions",
      query:
        "Generate a complete faceless storytelling video with automated visual B-roll scenes, chapter progression, and synchronized word-by-word kinetic captions.",
    },
  ];

  // Featured 4 Core Templates
  const FEATURED_TEMPLATES = [
    {
      id: "tmpl-1",
      title: "Colorful Kinetic Text & Wipes",
      category: "Text Animation & Transitions",
      badge: "COLORFUL 60 FPS",
      duration: "15s",
      src: "/text-transition-cool.html",
      image: "/dashboard/template-sneaker.jpg",
      prompt:
        "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
    },
    {
      id: "tmpl-2",
      title: "SaaS 3.0 Flagship Launch Trailer",
      category: "Product Launch",
      badge: "SAAS MASTER",
      duration: "30s",
      src: "/saas-product-launch.html",
      image: "/dashboard/template-hiker.jpg",
      prompt:
        "Keynote SaaS product launch trailer with 3D glass telemetry dashboard, rising +340% YoY benchmark bars, sub-8ms latency counter, and bold CTA.",
    },
    {
      id: "tmpl-3",
      title: "Vox-Style Archival Highlight Cutaway",
      category: "Animated B-Rolls",
      badge: "EDITORIAL CLIP",
      duration: "12s",
      src: "/broll-data-cutaway.html",
      image: "/dashboard/template-data.jpg",
      prompt:
        "Vox-style documentary B-roll panning across an archival print clipping with an animated electric lime marker sweep and source citation.",
    },
    {
      id: "tmpl-4",
      title: "Faceless Story & Caption Engine",
      category: "Faceless Video",
      badge: "AUTO STORY",
      duration: "20s",
      src: "/faceless-story-reel.html",
      image: "/dashboard/template-portrait.jpg",
      prompt:
        "Generate a complete faceless storytelling video with automated visual B-roll scenes, chapter progression, and synchronized word-by-word kinetic captions.",
    },
  ];

  // Combine real rendered backend jobs with fallback static projects
  const STATIC_PROJECTS = [
    {
      id: "20261028143951-0d0cbd",
      title: "Editorial Opener — 60fps Master",
      timecode: "00:00:10:00",
      updatedText: "Rendered MP4 · 1920×1080 60fps",
      thumbnail: "/dashboard/project-launch.jpg",
      videoUrl: `${API_URL}/api/videos/20261028143951-0d0cbd/final.mp4`,
      status: "Rendered",
    },
    {
      id: "20261028135140-004911",
      title: "Kinetic Launch — 60fps Master",
      timecode: "00:00:10:00",
      updatedText: "Rendered MP4 · 1920×1080 60fps",
      thumbnail: "/dashboard/project-app.jpg",
      videoUrl: `${API_URL}/api/videos/20261028135140-004911/final.mp4`,
      status: "Rendered",
    },
    {
      id: "20261028125746-4dee95",
      title: "Motion Sequence — 60fps Master",
      timecode: "00:00:10:00",
      updatedText: "Rendered MP4 · 1920×1080 60fps",
      thumbnail: "/dashboard/project-explainer.jpg",
      videoUrl: `${API_URL}/api/videos/20261028125746-4dee95/final.mp4`,
      status: "Rendered",
    },
    {
      id: "20261028123534-3baf2c",
      title: "Studio Reel — 60fps Master",
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

  const currentModelObj =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt =
      prompt.trim() || "Editorial product launch sequence with kinetic typography and 60 FPS motion";
    onNewLaunch(finalPrompt, {
      ratio: (aspectRatio === "RGBA" ? "16:9" : aspectRatio) as Ratio,
      length: 15,
      provider: selectedProvider,
      model: selectedModel,
      effort: selectedEffort,
    });
  };

  const handleSelectTemplate = (t: (typeof FEATURED_TEMPLATES)[0]) => {
    setPrompt(t.prompt);
    setPreviewTemplate(t);
  };

  return (
    <div className="mx-auto w-full max-w-[1380px] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* =========================================================================
          1. HERO MOTION COMPOSER: Clean Transparent Notebook Card
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(7,20,46,0.12)] bg-[#fffefb] backdrop-blur-xs p-6 sm:p-7 shadow-xs">
        {/* Model Selector Modal */}
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

        {/* Top Eyebrow & Ratio Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[rgba(7,20,46,0.18)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#84cc16] shadow-[0_0_8px_#84cc16]" />
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#07142e] uppercase">
              TEXT &amp; TRANSITIONS · PRODUCT LAUNCH · ANIMATED B-ROLL · FACELESS VIDEO
            </span>
          </div>

          {/* Model & Aspect Ratio Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Model & Effort Selector Trigger */}
            <button
              ref={modelTriggerRef}
              type="button"
              onClick={() => setShowModelModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-[11px] border border-[rgba(7,20,46,0.12)] bg-[#fffefb] text-[#07142e] hover:border-[rgba(7,20,46,0.28)] hover:bg-white transition cursor-pointer shadow-2xs"
            >
              <FiZap size={11} className="text-[#84cc16]" />
              <span className="font-bold">{currentModelObj.name}</span>
              <span className="font-mono text-[9px] uppercase font-bold px-1 py-0.2 rounded bg-[rgba(7,20,46,0.08)]">
                {selectedEffort === "xhigh" ? "MAX" : selectedEffort.toUpperCase()}
              </span>
              <FiChevronDown size={11} />
            </button>

            {/* Aspect Ratio Selector Pills */}
            <div className="flex items-center gap-1">
              {(["16:9", "9:16", "RGBA"] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold transition cursor-pointer border ${
                    aspectRatio === ratio
                      ? "bg-[#07142e] text-[#faf8f2] border-[#07142e] shadow-2xs"
                      : "bg-[#fffefb] text-[rgba(7,20,46,0.7)] border-[rgba(7,20,46,0.12)] hover:text-[#07142e] hover:bg-white"
                  }`}
                >
                  {ratio === "RGBA" ? "RGBA Alpha" : ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Headline + Clean Prompt Form */}
        <div className="pt-5">
          <h1 className="text-[30px] sm:text-[38px] font-bold tracking-[-0.04em] text-[#07142e] leading-[1.08] m-0 text-balance">
            Direct your next{" "}
            <span className="db-highlight">
              motion sequence.
            </span>
          </h1>

          <p className="mt-1.5 text-[14px] text-[rgba(7,20,46,0.76)] leading-relaxed max-w-2xl m-0">
            Describe your scene, kinetic words, and camera movement. Byreel writes, animates, and exports broadcast-ready 60 FPS renders.
          </p>

          <form
            onSubmit={handleGenerate}
            className="mt-5 flex flex-col gap-2 rounded-xl border border-[rgba(7,20,46,0.16)] bg-[#fffefb] p-3 shadow-xs focus-within:border-[rgba(7,20,46,0.32)] focus-within:bg-white transition-all"
          >
            <div className="flex items-start gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#07142e] text-[#c5ef26] font-mono text-xs font-bold mt-0.5">
                &gt;_
              </span>
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='Describe your scene... (e.g. "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops and diagonal shutter wipes")'
                className="w-full resize-none bg-transparent text-[14px] sm:text-[14.5px] leading-relaxed text-[#07142e] placeholder-[rgba(7,20,46,0.48)] focus:outline-none font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(7,20,46,0.16)] pt-2.5 px-0.5">
              <span className="font-mono text-[11px] text-[rgba(7,20,46,0.65)] font-medium">
                Exports 1080p &amp; 4K 60fps .MP4 or transparent RGBA .WebM
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate("templates")}
                  className="px-3 py-1.5 rounded-lg border border-[rgba(7,20,46,0.12)] text-[12px] font-semibold text-[#07142e] hover:bg-white cursor-pointer transition"
                >
                  Templates
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#07142e] hover:bg-[#040c1c] px-4 text-[12.5px] font-bold text-[#faf8f2] border border-[#07142e] shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <span>Generate Video</span>
                  <FiArrowRight size={13} className="text-[#c5ef26]" />
                </button>
              </div>
            </div>
          </form>

          {/* 4 Format Starters */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-[10.5px] font-mono text-[rgba(7,20,46,0.6)] font-bold uppercase mr-1">
              STARTERS:
            </span>
            {PROMPT_PILLS.map((pill) => (
              <button
                key={pill.code}
                type="button"
                onClick={() => setPrompt(pill.query)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(7,20,46,0.12)] bg-[#fffefb] px-2.5 py-1 text-[11px] font-medium text-[#07142e] transition hover:border-[rgba(7,20,46,0.28)] hover:bg-white cursor-pointer"
              >
                <span className="font-mono text-[9.5px] text-[#4d7c0f] font-bold">
                  {pill.code}
                </span>
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. STARTING TEMPLATES (4 Core Formats)
         ========================================================================= */}
      <section>
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[18px] font-bold text-[#07142e] m-0">Starting templates</h2>
            <span className="font-mono text-[10px] uppercase bg-[#c5ef26]/30 border border-[#07142e]/30 text-[#07142e] font-bold px-2 py-0.5 rounded-full">
              60 FPS
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("templates")}
            className="flex items-center gap-1 text-[12.5px] font-mono font-medium text-[rgba(7,20,46,0.7)] transition hover:text-[#07142e] cursor-pointer"
          >
            <span>BROWSE ALL ({FEATURED_TEMPLATES.length})</span>
            <FiArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className="group cursor-pointer rounded-2xl border border-[rgba(7,20,46,0.12)] bg-[#fffefb] p-2.5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(7,20,46,0.28)] hover:bg-white hover:shadow-md backdrop-blur-xs flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#07142e]">
                <Image
                  src={template.image}
                  alt={template.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                {/* Top Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="rounded bg-[#07142e]/90 border border-white/20 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-[#c5ef26] backdrop-blur-xs">
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
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c5ef26] text-[#07142e] shadow-md">
                    <FiPlay size={15} className="ml-0.5 fill-[#07142e]" />
                  </span>
                </div>
              </div>
              <div className="pt-2.5 px-1">
                <p className="truncate text-[13px] font-bold text-[#07142e] m-0">
                  {template.title}
                </p>
                <p className="text-[11.5px] font-mono text-[rgba(7,20,46,0.65)] truncate m-0 mt-0.5">
                  {template.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3. RECENT PRODUCTIONS
         ========================================================================= */}
      <section>
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold text-[#07142e] m-0">Recent productions</h2>
            {/* Filter tabs */}
            <div className="flex items-center gap-1 rounded-full border border-[rgba(7,20,46,0.12)] bg-[#fffefb] p-0.5">
              {(["All", "Rendered", "Drafts"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveProjectTab(tab)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium transition cursor-pointer ${
                    activeProjectTab === tab
                      ? "bg-[#07142e] text-[#faf8f2] shadow-2xs"
                      : "text-[rgba(7,20,46,0.7)] hover:text-[#07142e] hover:bg-white"
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
            className="flex items-center gap-1 text-[12.5px] font-mono font-medium text-[rgba(7,20,46,0.7)] transition hover:text-[#07142e] cursor-pointer"
          >
            <span>ALL VIDEOS ({backendVideos.length || STATIC_PROJECTS.length})</span>
            <FiArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col rounded-2xl border border-[rgba(7,20,46,0.12)] bg-[#fffefb] p-2.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(7,20,46,0.28)] hover:bg-white hover:shadow-sm backdrop-blur-xs"
            >
              {/* Thumbnail / Video container */}
              <div
                onClick={() => setPreviewProject(project)}
                className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-[#07142e]"
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
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Status pill */}
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      project.status === "Rendered"
                        ? "bg-[#c5ef26] text-[#07142e]"
                        : "bg-white/80 text-[#07142e]"
                    }`}
                  >
                    {project.status === "Rendered" ? "60 FPS MP4" : "DRAFT"}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-2 right-2 z-10">
                  <span className="font-mono text-[9.5px] px-1.5 py-0.5 rounded bg-black/70 text-white font-medium">
                    {project.timecode}
                  </span>
                </div>

                {/* Play hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c5ef26] text-[#07142e] shadow-lg">
                    <FiPlay size={14} className="ml-0.5 fill-[#07142e]" />
                  </span>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="pt-2 px-1 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-[#07142e] m-0">
                    {project.title}
                  </p>
                  <p className="text-[11px] font-mono text-[rgba(7,20,46,0.65)] truncate m-0 mt-0.5">
                    {project.updatedText}
                  </p>
                </div>

                {/* Quick actions dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[rgba(7,20,46,0.65)] transition hover:bg-[rgba(7,20,46,0.08)] hover:text-[#07142e] cursor-pointer"
                  >
                    <FiMoreHorizontal size={14} />
                  </button>

                  {activeMenuId === project.id && (
                    <div className="absolute right-0 bottom-full mb-1 z-20 w-36 rounded-xl border border-[#07142e] bg-[#faf8f2] p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          setPreviewProject(project);
                        }}
                        className="flex w-full items-center px-3 py-1.5 text-left text-[12px] font-medium text-[#07142e] hover:bg-[rgba(7,20,46,0.06)] cursor-pointer"
                      >
                        Play Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onNewLaunch(project.title);
                        }}
                        className="flex w-full items-center px-3 py-1.5 text-left text-[12px] font-medium text-[#07142e] hover:bg-[rgba(7,20,46,0.06)] cursor-pointer"
                      >
                        Open in Studio
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
          INTERACTIVE MODAL: Template Preview & One-Click Generate
         ========================================================================= */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07142e]/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border-2 border-[#07142e] bg-[#faf8f2] p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewTemplate(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(7,20,46,0.08)] text-[#07142e] hover:bg-[rgba(7,20,46,0.18)] cursor-pointer"
            >
              <FiX size={16} />
            </button>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-[#07142e]">
              <Image
                src={previewTemplate.image}
                alt={previewTemplate.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c5ef26] text-[#07142e] shadow-lg">
                  <FiPlay size={22} className="ml-1 fill-[#07142e]" />
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#c5ef26]/35 border border-[#07142e]/30 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#07142e]">
                  {previewTemplate.category || "Motion Template"}
                </span>
                <span className="font-mono text-[11px] text-[rgba(7,20,46,0.7)]">
                  {previewTemplate.duration || "15s"} · 1920×1080 60FPS
                </span>
              </div>
              <h3 className="mt-1.5 text-[20px] font-bold text-[#07142e]">
                {previewTemplate.title}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-[rgba(7,20,46,0.75)]">
                {previewTemplate.prompt}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[rgba(7,20,46,0.15)] pt-4">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="rounded-xl border border-[rgba(7,20,46,0.12)] px-4 py-2 text-[13px] font-medium text-[#07142e] hover:bg-[rgba(7,20,46,0.06)] cursor-pointer"
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
                className="inline-flex items-center gap-2 rounded-xl bg-[#07142e] hover:bg-[#040c1c] px-5 py-2 text-[13px] font-bold text-[#faf8f2] shadow-xs cursor-pointer"
              >
                <span>Use Template</span>
                <FiArrowRight size={13} className="text-[#c5ef26]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL: Video Preview Player
         ========================================================================= */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07142e]/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-[#07142e] bg-[#faf8f2] p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewProject(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(7,20,46,0.08)] text-[#07142e] hover:bg-[rgba(7,20,46,0.18)] cursor-pointer"
            >
              <FiX size={16} />
            </button>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-[#07142e]">
              {previewProject.videoUrl ? (
                <video
                  src={previewProject.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (
                <Image
                  src={previewProject.thumbnail}
                  alt={previewProject.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[19px] font-bold text-[#07142e] m-0">
                    {previewProject.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-[12px] text-[rgba(7,20,46,0.7)]">
                    {previewProject.timecode} · 1080p 60FPS Master
                  </p>
                </div>

                {previewProject.videoUrl && (
                  <a
                    href={previewProject.videoUrl}
                    download
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(7,20,46,0.12)] text-[#07142e] hover:bg-[rgba(7,20,46,0.08)] cursor-pointer"
                    title="Download Master MP4"
                  >
                    <FiDownload size={15} />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[rgba(7,20,46,0.15)] pt-4">
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="rounded-xl border border-[rgba(7,20,46,0.12)] px-4 py-2 text-[13px] font-medium text-[#07142e] hover:bg-[rgba(7,20,46,0.06)] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const title = previewProject.title;
                  setPreviewProject(null);
                  onNewLaunch(title);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#07142e] hover:bg-[#040c1c] px-5 py-2 text-[13px] font-bold text-[#faf8f2] shadow-xs cursor-pointer"
              >
                <span>Edit in Studio</span>
                <FiArrowRight size={13} className="text-[#c5ef26]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
