"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FiPlay,
  FiSearch,
  FiArrowRight,
  FiCheck,
  FiCopy,
  FiSliders,
  FiLayers,
  FiClock,
  FiZap,
  FiServer,
  FiSmartphone,
  FiActivity,
  FiGrid,
  FiExternalLink,
  FiX,
  FiFilm,
  FiType,
} from "react-icons/fi";
import { IconSparkles } from "../../../components/Icons";

interface TemplatesSectionProps {
  onSelectTemplate: (prompt: string) => void;
}

export type TemplateCategory =
  | "All reels"
  | "Text & Transitions"
  | "Product launch"
  | "Animated B-rolls"
  | "Faceless video"
  | "Vertical 9:16 shorts";

export type AspectFilter = "All" | "16:9" | "9:16";

export interface SceneBeat {
  time: string;
  text: string;
}

export interface LiveStudioTemplate {
  id: string;
  src: string;
  category: Exclude<TemplateCategory, "All reels">;
  pillarNumber: "01" | "02" | "03" | "04" | null;
  title: string;
  shortLabel: string;
  ratio: "16:9" | "9:16";
  duration: string;
  nleReady: string;
  prompt: string;
  beats: SceneBeat[];
}

export const TEMPLATES: LiveStudioTemplate[] = [
  {
    id: "text-transition-cool",
    src: "/text-transition-cool.html",
    category: "Text & Transitions",
    pillarNumber: "01",
    title: "Colorful Kinetic Text & Wipe Transitions",
    shortLabel: "01 · Text & Transitions",
    ratio: "16:9",
    duration: "15s · 60fps",
    nleReady: "16:9 & RGBA Alpha",
    prompt:
      "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
    beats: [
      { time: "00:00–00:03", text: "Colorful kinetic word chips pop with spring physics" },
      { time: "00:03–00:06", text: "Multi-color diagonal shutter wipe & iris portal reveal" },
      { time: "00:06–00:09", text: "Counter-sliding full-spectrum kinetic ribbons" },
    ],
  },
  {
    id: "saas-product-launch",
    src: "/saas-product-launch.html",
    category: "Product launch",
    pillarNumber: "02",
    title: "SaaS 3.0 Flagship Launch Trailer",
    shortLabel: "02 · Product Launch",
    ratio: "16:9",
    duration: "30s · 60fps",
    nleReady: "4K MP4 & WebM",
    prompt:
      "Keynote SaaS product launch trailer with 3D glass telemetry dashboard, rising +340% YoY benchmark bars, sub-8ms latency counter, and bold CTA.",
    beats: [
      { time: "00:00–00:08", text: "Keynote headline reveal over perspective grid" },
      { time: "00:08–00:20", text: "Isometric glass UI & rising +340% YoY telemetry bars" },
      { time: "00:20–00:30", text: "7.4ms latency proof & deploy CTA lockup" },
    ],
  },
  {
    id: "broll-data-cutaway",
    src: "/broll-data-cutaway.html",
    category: "Animated B-rolls",
    pillarNumber: "03",
    title: "Vox-Style Archival Highlight Cutaway",
    shortLabel: "03 · Animated B-Roll",
    ratio: "16:9",
    duration: "12s · 60fps",
    nleReady: "Premiere & DaVinci",
    prompt:
      "Vox-style documentary B-roll panning across an archival print clipping with an animated electric lime marker sweep and source citation.",
    beats: [
      { time: "00:00–00:03", text: "Smooth camera pan onto archival newspaper clipping" },
      { time: "00:03–00:08", text: "Electric lime marker sweep across key quote" },
      { time: "00:08–00:12", text: "Source masthead & exhibit citation stamp" },
    ],
  },
  {
    id: "faceless-story-reel",
    src: "/faceless-story-reel.html",
    category: "Faceless video",
    pillarNumber: "04",
    title: "Faceless Channel Story & Caption Engine",
    shortLabel: "04 · Faceless Video",
    ratio: "9:16",
    duration: "20s · 60fps",
    nleReady: "YouTube & Reels",
    prompt:
      "Generate a complete faceless storytelling video with automated visual B-roll scenes, chapter progression, and synchronized word-by-word kinetic captions.",
    beats: [
      { time: "00:00–00:05", text: "Chapter 01 visual hook & retention graph reveal" },
      { time: "00:05–00:13", text: "Automated scene B-roll nodes & telemetry proof" },
      { time: "00:13–00:20", text: "Synchronized voiceover wave & word-by-word captions" },
    ],
  },
  {
    id: "split-screen-attention",
    src: "/split-screen-attention.html",
    category: "Animated B-rolls",
    pillarNumber: null,
    title: "Attention Split Documentary B-Roll",
    shortLabel: "Attention Split",
    ratio: "16:9",
    duration: "20s · 60fps",
    nleReady: "YouTube Essays",
    prompt:
      "Split-screen documentary B-roll contrasting monochrome analog deep work on the left against a saturated high-velocity social feed on the right.",
    beats: [
      { time: "00:00–00:06", text: "Monochrome film-grain reader scene establishes" },
      { time: "00:06–00:14", text: "Center divider splits to saturated mobile feed" },
      { time: "00:14–00:20", text: "Dual-stage contrast caption reveal" },
    ],
  },
  {
    id: "neon-host-neuron",
    src: "/neon-host-neuron.html",
    category: "Animated B-rolls",
    pillarNumber: null,
    title: "3D Neon Callout → Neural Synapse Cutaway",
    shortLabel: "Neon → Neuron",
    ratio: "16:9",
    duration: "15s · 60fps",
    nleReady: "MP4 & WebM",
    prompt:
      "3D perspective neon callout card beside the speaker that transitions into a glowing synaptic neuron firing across the axon.",
    beats: [
      { time: "00:00–00:05", text: "3D neon callout box pops in beside speaker" },
      { time: "00:05–00:10", text: "Camera zooms into neural dendrite network" },
      { time: "00:10–00:15", text: "Glowing impulse travels axon with particle burst" },
    ],
  },
  {
    id: "aggressive-zoom-flashcuts",
    src: "/aggressive-zoom-flashcuts.html",
    category: "Vertical 9:16 shorts",
    pillarNumber: null,
    title: "Flash-Cut Zoom & Beat Montage",
    shortLabel: "Flash-Cut Zoom",
    ratio: "9:16",
    duration: "15s · 60fps",
    nleReady: "Reels & Shorts",
    prompt:
      "Aggressive camera zoom punches with high-contrast flash cuts, scanline texture, and bold impact labels on every beat.",
    beats: [
      { time: "00:00–00:04", text: "Rapid camera push-in with keylight shift" },
      { time: "00:04–00:10", text: "Beat-synced full-frame graphic flash cuts" },
      { time: "00:10–00:15", text: "Scanline overlay & timecode lockup" },
    ],
  },
  {
    id: "host-intro-text",
    src: "/host-intro-text.html",
    category: "Text & Transitions",
    pillarNumber: null,
    title: "Bold Kinetic Creator Intro",
    shortLabel: "Creator Intro",
    ratio: "16:9",
    duration: "10s · 60fps",
    nleReady: "16:9 & 9:16",
    prompt:
      "Low-key creator silhouette with lens-glint eyes and giant stacked kinetic typography slamming into frame with subtle camera shake.",
    beats: [
      { time: "00:00–00:03", text: "Low-key studio silhouette & eye lens glint" },
      { time: "00:03–00:07", text: "Heavy stacked title cards slam into place" },
      { time: "00:07–00:10", text: "Camera micro-shake & vignette settle" },
    ],
  },
  {
    id: "feed-scroll-macro",
    src: "/feed-scroll-macro.html",
    category: "Vertical 9:16 shorts",
    pillarNumber: null,
    title: "Macro POV — Thumb Scrolling Feed",
    shortLabel: "Macro Feed Scroll",
    ratio: "9:16",
    duration: "15s · 60fps",
    nleReady: "9:16 Vertical",
    prompt:
      "Handheld macro POV shot of a smartphone feed scrolling rapidly with jump-cut flashes and kinetic retention hooks.",
    beats: [
      { time: "00:00–00:04", text: "Jump-cut flash into macro phone viewport" },
      { time: "00:04–00:11", text: "Rapid thumb-scroll feed cards with camera shake" },
      { time: "00:11–00:15", text: "Pattern-interrupt hook card freeze" },
    ],
  },
  {
    id: "flash-cut-broadcast",
    src: "/flash-cut-broadcast.html",
    category: "Text & Transitions",
    pillarNumber: null,
    title: "Broadcast Lower-Third & Flash Cut",
    shortLabel: "Broadcast Cut",
    ratio: "16:9",
    duration: "15s · 60fps",
    nleReady: "Broadcast 60fps",
    prompt:
      "Skewed broadcast news lower-third title bar over studio lighting followed by rapid full-screen editorial flash cuts.",
    beats: [
      { time: "00:00–00:05", text: "Studio keylight & skewed lower-third bar slide" },
      { time: "00:05–00:11", text: "Rapid full-frame editorial cutaways" },
      { time: "00:11–00:15", text: "Return to host stage with sub-caption" },
    ],
  },
  {
    id: "phone-toss-clock",
    src: "/phone-toss-clock.html",
    category: "Vertical 9:16 shorts",
    pillarNumber: null,
    title: "Phone Toss → Ticking Clock Hook",
    shortLabel: "Phone Toss Hook",
    ratio: "9:16",
    duration: "12s · 60fps",
    nleReady: "Reels, Shorts & X",
    prompt:
      "A smartphone gets tossed out of frame with motion blur, hard-cutting to a high-contrast ticking analog clock.",
    beats: [
      { time: "00:00–00:04", text: "Lockscreen time glow & hand grip" },
      { time: "00:04–00:07", text: "Phone tossed upward with impact flash cut" },
      { time: "00:07–00:12", text: "High-contrast analog clock second-hand tick" },
    ],
  },
  {
    id: "host-dark-text",
    src: "/host-dark-text.html",
    category: "Product launch",
    pillarNumber: null,
    title: "Keynote Dark Headline Reveal",
    shortLabel: "Keynote Teaser",
    ratio: "16:9",
    duration: "12s · 60fps",
    nleReady: "4K Keynote MP4",
    prompt:
      "Dramatic low-light keynote teaser where bold word-by-word typography ('WE NEED TO TALK.') emerges over a spotlighted stage.",
    beats: [
      { time: "00:00–00:04", text: "Spotlight silhouette fade-in from obsidian" },
      { time: "00:04–00:09", text: "Word-by-word display headline reveal" },
      { time: "00:09–00:12", text: "Wide-tracked subtitle fade & hold" },
    ],
  },
];

const CORE_FOUR_IDS = [
  "text-transition-cool",
  "saas-product-launch",
  "broll-data-cutaway",
  "faceless-story-reel",
];

const CATEGORY_TABS: { id: TemplateCategory; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "All reels", label: "All Reels", icon: FiGrid },
  { id: "Text & Transitions", label: "01 · Text & Transitions", icon: FiType },
  { id: "Product launch", label: "02 · Product Launch", icon: FiZap },
  { id: "Animated B-rolls", label: "03 · Animated B-Rolls", icon: FiFilm },
  { id: "Faceless video", label: "04 · Faceless Video", icon: FiLayers },
  { id: "Vertical 9:16 shorts", label: "Vertical 9:16 Shorts", icon: FiSmartphone },
];

const RATIO_FILTERS: { id: AspectFilter; label: string }[] = [
  { id: "All", label: "All ratios" },
  { id: "16:9", label: "16:9 Landscape" },
  { id: "9:16", label: "9:16 Portrait" },
];

const BASE_W = 1280;

/**
 * Scaled live HTML stage for responsive iframe rendering
 */
function LiveScaledStage({
  src,
  title,
  category,
  duration,
  hoverLabel,
  onClick,
}: {
  src: string;
  title: string;
  category?: string;
  duration?: string;
  hoverLabel?: string;
  onClick?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.3);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      if (el.clientWidth > 0) {
        setScale(el.clientWidth / BASE_W);
      }
    };
    updateScale();

    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) {
        setScale(entry.contentRect.width / BASE_W);
      }
    });
    ro.observe(el);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#040c1c] border border-[#07142e]/30 cursor-pointer group"
    >
      {/* Top HUD */}
      {category && duration && (
        <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#07142e]/90 px-2 py-0.5 text-[9px] font-mono font-bold text-[#faf8f2] backdrop-blur-xs border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5ef26]" />
            <span>{category}</span>
          </span>
          <span className="rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white/90 backdrop-blur-xs">
            {duration}
          </span>
        </div>
      )}

      {/* Scaled Iframe */}
      {visible && (
        <iframe
          key={src}
          src={src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={() => setLoaded(true)}
          className="pointer-events-none absolute top-0 left-0 w-[1280px] h-[720px] border-0 origin-top-left transition-opacity duration-300"
          style={{
            transform: `scale(${scale})`,
            opacity: loaded ? 1 : 0,
          }}
        />
      )}

      {/* Hover Overlay */}
      {hoverLabel && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#07142e]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 backdrop-blur-2xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c5ef26] px-3.5 py-1.5 font-mono text-[11px] font-bold text-[#07142e] shadow-lg">
            <FiPlay size={12} className="fill-[#07142e]" />
            <span>{hoverLabel}</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default function TemplatesSection({ onSelectTemplate }: TemplatesSectionProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [stageTemplate, setStageTemplate] = useState<LiveStudioTemplate>(TEMPLATES[0]);
  const [stagePrompt, setStagePrompt] = useState<string>(TEMPLATES[0].prompt);
  const [copiedStage, setCopiedStage] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("All reels");
  const [selectedRatio, setSelectedRatio] = useState<AspectFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const quickStageReels = useMemo(
    () => CORE_FOUR_IDS.map((id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0]),
    []
  );

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tpl) => {
      if (selectedCategory !== "All reels" && tpl.category !== selectedCategory) {
        return false;
      }
      if (selectedRatio !== "All" && tpl.ratio !== selectedRatio) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = tpl.title.toLowerCase().includes(q);
        const matchCat = tpl.category.toLowerCase().includes(q);
        const matchPrompt = tpl.prompt.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchPrompt) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedRatio, searchQuery]);

  const handleSelectForStage = (tpl: LiveStudioTemplate, scrollToTop = false) => {
    setStageTemplate(tpl);
    setStagePrompt(tpl.prompt);
    setCopiedStage(false);
    if (scrollToTop && stageRef.current) {
      stageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard?.writeText(stagePrompt);
    setCopiedStage(true);
    setTimeout(() => setCopiedStage(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-5 sm:p-7 lg:p-8 space-y-7" ref={stageRef}>
      {/* ── Page Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(7,20,46,0.18)] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#c5ef26]/35 border border-[#07142e]/30 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#07142e]">
              STUDIO BLUEPRINTS
            </span>
            <span className="rounded-full bg-[#07142e] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#c5ef26]">
              4 CORE RIGS · 60 FPS
            </span>
          </div>
          <h1 className="mt-2 text-[26px] sm:text-[34px] font-extrabold tracking-tight text-[#07142e] leading-tight m-0">
            Director&apos;s Screening Room &amp; Templates
          </h1>
          <p className="mt-1 text-[13.5px] text-[rgba(7,20,46,0.7)] max-w-2xl leading-relaxed m-0">
            Every template below is a live 60fps composition compiled from a prompt. Load any template onto the master screening deck to inspect scene beats, edit the prompt, and open it in the Studio.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <FiSearch size={15} className="absolute left-3.5 top-3.5 text-[rgba(7,20,46,0.5)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reels, tags, prompts..."
            className="w-full h-10 rounded-xl border border-[rgba(7,20,46,0.12)] bg-[#fffefb] pl-9.5 pr-8 text-[12.5px] text-[#07142e] placeholder-[rgba(7,20,46,0.45)] focus:border-[rgba(7,20,46,0.32)] focus:bg-white focus:outline-none transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-[11px] font-bold text-[rgba(7,20,46,0.5)] hover:text-[#07142e]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          HERO STAGE: MASTER SCREENING DECK (Monitor + Notebook Sheet Inspector)
         ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Live 60fps Screening Monitor + 4 Core Switcher (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="overflow-hidden rounded-2xl border-2 border-[#07142e] bg-[#07142e] shadow-xl">
            {/* Monitor Header */}
            <div className="px-4 py-2.5 bg-[#040c1c] border-b border-white/10 flex items-center justify-between font-mono text-[11px] text-white/90">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c5ef26] animate-pulse" />
                <span className="font-bold tracking-wide">MASTER SCREENING MONITOR</span>
              </span>
              <span className="text-[#c5ef26] font-bold">
                {stageTemplate.ratio} · 60 FPS
              </span>
            </div>

            {/* Live Render Viewport */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <iframe
                key={stageTemplate.src}
                src={stageTemplate.src}
                title={stageTemplate.title}
                sandbox="allow-scripts"
                className="w-full h-full border-0 pointer-events-auto"
              />
            </div>
          </div>

          {/* 4 Core Quick Switcher Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickStageReels.map((item) => {
              const isCurrent = stageTemplate.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectForStage(item, false)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition cursor-pointer ${
                    isCurrent
                      ? "border-[#07142e] bg-[#07142e] text-[#faf8f2] shadow-sm"
                      : "border-[rgba(7,20,46,0.12)] bg-[#fffefb] text-[#07142e] hover:border-[rgba(7,20,46,0.28)] hover:bg-white"
                  }`}
                >
                  <span
                    className={`font-mono text-[9px] font-bold uppercase tracking-wider ${
                      isCurrent ? "text-[#c5ef26]" : "text-[rgba(7,20,46,0.65)]"
                    }`}
                  >
                    {item.pillarNumber ? `RIG ${item.pillarNumber}` : item.category}
                  </span>
                  <span className="text-[12px] font-bold truncate mt-0.5">
                    {item.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Transparent Notebook Director's Sheet (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[rgba(7,20,46,0.12)] bg-[#fffefb] p-5 sm:p-6 shadow-xs backdrop-blur-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[rgba(7,20,46,0.18)] pb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c5ef26]/35 border border-[#07142e]/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#07142e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]" />
                <span>NOW SCREENING</span>
              </span>
              <span className="font-mono text-[11px] font-semibold text-[rgba(7,20,46,0.7)]">
                {stageTemplate.ratio} · {stageTemplate.nleReady}
              </span>
            </div>

            <h2 className="mt-3 text-[19px] sm:text-[21px] font-extrabold text-[#07142e] leading-snug m-0">
              {stageTemplate.title}
            </h2>

            {/* Scene Beats */}
            <div className="mt-3.5 space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[rgba(7,20,46,0.65)] block">
                SCENE BEATS &amp; MOTION TIMING:
              </span>
              <div className="space-y-1.5">
                {stageTemplate.beats.map((beat) => (
                  <div
                    key={beat.time}
                    className="flex items-start gap-2.5 rounded-lg border border-[rgba(7,20,46,0.12)] bg-[#fffefb] p-2 text-[12px]"
                  >
                    <span className="font-mono text-[10.5px] font-bold text-[#4d7c0f] shrink-0 pt-0.5">
                      {beat.time}
                    </span>
                    <span className="text-[rgba(7,20,46,0.85)] leading-tight">
                      {beat.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Prompt */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="screening-prompt-input"
                  className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[rgba(7,20,46,0.7)] cursor-pointer"
                >
                  DIRECTOR PROMPT (EDITABLE)
                </label>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#07142e] hover:underline cursor-pointer"
                >
                  {copiedStage ? (
                    <>
                      <FiCheck size={12} className="text-[#4d7c0f]" />
                      <span className="text-[#4d7c0f]">Copied</span>
                    </>
                  ) : (
                    <>
                      <FiCopy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="screening-prompt-input"
                rows={3}
                value={stagePrompt}
                onChange={(e) => setStagePrompt(e.target.value)}
                className="w-full rounded-xl border border-[rgba(7,20,46,0.12)] bg-[#fffefb] p-3 text-[12.5px] text-[#07142e] leading-relaxed focus:border-[rgba(7,20,46,0.32)] focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-[rgba(7,20,46,0.18)]">
            <button
              type="button"
              onClick={() => onSelectTemplate(stagePrompt.trim() || stageTemplate.prompt)}
              className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#07142e] hover:bg-[#040c1c] text-[#faf8f2] text-[13px] font-bold border border-[#07142e] shadow-sm transition active:scale-98 cursor-pointer"
            >
              <IconSparkles className="w-4 h-4 text-[#c5ef26]" />
              <span>Open in Studio with this prompt</span>
              <FiArrowRight size={14} className="text-[#c5ef26]" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FILTER LEDGER BAR
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[rgba(7,20,46,0.18)] py-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_TABS.map((cat) => {
            const IconComponent = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition cursor-pointer ${
                  active
                    ? "bg-[#07142e] text-[#faf8f2] shadow-xs"
                    : "border border-[rgba(7,20,46,0.12)] bg-[#fffefb] text-[rgba(7,20,46,0.85)] hover:border-[rgba(7,20,46,0.28)] hover:bg-white hover:text-[#07142e]"
                }`}
              >
                <IconComponent size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ratio Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-[rgba(7,20,46,0.12)] bg-[#fffefb] p-0.5">
          {RATIO_FILTERS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRatio(r.id)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[10.5px] font-semibold transition cursor-pointer ${
                selectedRatio === r.id
                  ? "bg-[#07142e] text-[#faf8f2] shadow-xs"
                  : "text-[rgba(7,20,46,0.7)] hover:text-[#07142e] hover:bg-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          12-REEL LIVE STORYBOARD GRID
         ========================================================================= */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[rgba(7,20,46,0.16)] bg-[#fffefb] p-12 text-center space-y-3">
          <p className="font-mono text-[14px] text-[rgba(7,20,46,0.8)]">
            No templates matching &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All reels");
              setSelectedRatio("All");
              setSearchQuery("");
            }}
            className="rounded-xl bg-[#07142e] px-4 py-2 text-[12px] font-semibold text-[#faf8f2]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => {
            const isOnStage = stageTemplate.id === tpl.id;
            return (
              <div
                key={tpl.id}
                className={`group rounded-2xl border p-3.5 shadow-xs transition-all duration-200 flex flex-col justify-between backdrop-blur-xs ${
                  isOnStage
                    ? "border-[#07142e] bg-[rgba(255,253,248,0.18)] ring-2 ring-[#c5ef26]"
                    : "border-[rgba(7,20,46,0.12)] bg-[#fffefb] hover:-translate-y-1 hover:border-[rgba(7,20,46,0.28)] hover:bg-white hover:shadow-md"
                }`}
              >
                <div>
                  {/* Live scaled stage */}
                  <LiveScaledStage
                    src={tpl.src}
                    title={tpl.title}
                    category={tpl.category}
                    duration={`${tpl.ratio} · ${tpl.duration}`}
                    hoverLabel="Load on stage"
                    onClick={() => handleSelectForStage(tpl, true)}
                  />

                  {/* Card Content */}
                  <div className="mt-3 px-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#4d7c0f]">
                        {tpl.pillarNumber ? `RIG ${tpl.pillarNumber} · ${tpl.category}` : tpl.category}
                      </span>
                      {isOnStage && (
                        <span className="rounded bg-[#c5ef26] px-1.5 py-0.2 font-mono text-[8.5px] font-bold text-[#07142e]">
                          ON STAGE
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 text-[14.5px] font-bold text-[#07142e] leading-snug line-clamp-1 m-0">
                      {tpl.title}
                    </h3>

                    <p className="mt-1.5 text-[12px] text-[rgba(7,20,46,0.75)] line-clamp-2 leading-relaxed m-0">
                      {tpl.prompt}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-[rgba(7,20,46,0.14)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectForStage(tpl, true)}
                    className="font-mono text-[11px] font-bold text-[rgba(7,20,46,0.75)] hover:text-[#07142e] transition cursor-pointer"
                  >
                    {isOnStage ? "Screening above" : "Watch on stage"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tpl.prompt)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#07142e] hover:bg-[#040c1c] px-3.5 py-1.5 text-[11.5px] font-bold text-[#faf8f2] shadow-2xs transition cursor-pointer"
                  >
                    <span>Open in Studio</span>
                    <FiArrowRight size={12} className="text-[#c5ef26]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}