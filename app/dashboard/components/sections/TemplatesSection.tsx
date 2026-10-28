"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiPlay,
  FiPause,
  FiSearch,
  FiArrowRight,
  FiCheck,
  FiX,
  FiCopy,
  FiSliders,
  FiLayers,
  FiClock,
  FiZap,
  FiServer,
  FiSmartphone,
  FiActivity,
  FiGrid,
  FiCompass,
  FiRotateCcw,
  FiExternalLink,
  FiCheckCircle,
} from "react-icons/fi";
import { IconSparkles } from "../../../components/Icons";

interface TemplatesSectionProps {
  onSelectTemplate: (prompt: string) => void;
}

export interface TemplateItem {
  id: string;
  category: string;
  title: string;
  ratio: "16:9" | "9:16" | "1:1";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Pro";
  image: string;
  badge?: string;
  stats?: string;
  prompt: string;
  timeline: { time: string; label: string; desc: string }[];
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "t1",
    category: "Product Launch",
    title: "Velocity Kinetic Sneaker",
    ratio: "16:9",
    duration: "15s",
    difficulty: "Pro",
    badge: "Trending",
    stats: "4K 60FPS · Octane 3D",
    image: "/dashboard/template-sneaker.jpg",
    prompt:
      "High-octane product launch commercial for a luxury running shoe. Neon lime accent lighting sweeps, 360° turntable with glowing dust particles, dynamic camera rolls, and bold kinetic headline 'JUST MOVE FORWARD'.",
    timeline: [
      { time: "00:00 - 00:03", label: "Dynamic Macro Sole Reveal", desc: "Extreme close-up rolling across textured rubber tread with lime laser sweep" },
      { time: "00:03 - 00:10", label: "360° Turntable in Atmospheric Mist", desc: "Suspended shoe rotating smoothly while neon particles radiate from the sole" },
      { time: "00:10 - 00:15", label: "Bold Kinetic Outro & Pre-Order CTA", desc: "Heavy typographic stamp 'JUST MOVE FORWARD' with brand lockup" },
    ],
  },
  {
    id: "t2",
    category: "SaaS & Tech",
    title: "Apex Analytics 3.0 Dashboard",
    ratio: "16:9",
    duration: "30s",
    difficulty: "Pro",
    badge: "Most Popular",
    stats: "3D Glass UI · Keynote Ready",
    image: "/dashboard/project-data.jpg",
    prompt:
      "Keynote-style SaaS product launch commercial for Apex Analytics. Dark obsidian luxury aesthetic with floating 3D glassmorphism widgets, real-time query countdown from 1,400ms down to 8ms in neon lime, and keynote typography.",
    timeline: [
      { time: "00:00 - 00:06", label: "Legacy Bottleneck Dissolve", desc: "Complex legacy spreadsheets shattering into dark ambient mist" },
      { time: "00:06 - 00:15", label: "3D Glassmorphism Dashboard Elevation", desc: "Isometric floating widgets and real-time rising telemetry chart" },
      { time: "00:15 - 00:23", label: "Sub-8ms Latency Speedometer", desc: "Kinetic countdown counter spinning to 8ms with neon green glow" },
      { time: "00:23 - 00:30", label: "1-Click Deploy Finale CTA", desc: "Global node mesh lighting up with apex.io/start CTA" },
    ],
  },
  {
    id: "t3",
    category: "Brand Stories",
    title: "A Bigger Tomorrow",
    ratio: "16:9",
    duration: "30s",
    difficulty: "Intermediate",
    badge: "Cinematic",
    stats: "2.39:1 Anamorphic · 60FPS",
    image: "/dashboard/template-hiker.jpg",
    prompt:
      "Inspiring cinematic brand story film with majestic mountain silhouettes, golden hour sun rays, and atmospheric dust particles. Slow camera dolly in on solitary explorer with dramatic orchestral pacing.",
    timeline: [
      { time: "00:00 - 00:06", label: "Wide Misty Alpine Ridge", desc: "Establishing landscape with slow cinematic drone pan over snow peaks" },
      { time: "00:06 - 00:20", label: "Slow Dolly In on Mountain Explorer", desc: "Sun flares catching edge lighting as figure reaches summit" },
      { time: "00:20 - 00:30", label: "Typography Fade & Brand Callout", desc: "Poetic tagline fading in with minimal monochrome logo mark" },
    ],
  },
  {
    id: "t4",
    category: "Data Visualisation",
    title: "Turn Data Into Stories",
    ratio: "16:9",
    duration: "20s",
    difficulty: "Pro",
    badge: "High Tech",
    stats: "Holographic 3D · 4K",
    image: "/dashboard/template-data.jpg",
    prompt:
      "Futuristic Earth holographic data visualization with rising translucent charts and real-time telemetry arcs. Deep space darkness with high-contrast cyan and lime telemetry vectors.",
    timeline: [
      { time: "00:00 - 00:05", label: "Cosmic Orbital Earth Scan", desc: "200+ edge server nodes lighting up interconnected network paths" },
      { time: "00:05 - 00:14", label: "Holographic 3D Bar Graph Extrusion", desc: "Translucent cyan and lime data pillars rising dynamically" },
      { time: "00:14 - 00:20", label: "Telemetry Matrix Metrics Summary", desc: "Summary statistics locked in crisp monospace typography" },
    ],
  },
  {
    id: "t5",
    category: "Social & Reels 9:16",
    title: "Create Share Grow",
    ratio: "9:16",
    duration: "15s",
    difficulty: "Beginner",
    badge: "Viral Ready",
    stats: "Vertical 9:16 · Reels/TikTok",
    image: "/dashboard/template-portrait.jpg",
    prompt:
      "Editorial vertical portrait reel with natural ambient shadows, warm color grading, and organic transitions designed for TikTok, Instagram Reels, and YouTube Shorts.",
    timeline: [
      { time: "00:00 - 00:03", label: "Sub-second Portrait Hook", desc: "Eye-catching subject movement with kinetic typography overlay" },
      { time: "00:03 - 00:10", label: "Warm Foliage Light Transition", desc: "Fluid lens whip transition through warm ambient sunlight" },
      { time: "00:10 - 00:15", label: "Dynamic Callout & Social Outro", desc: "Punchy animated handle and subscribe button" },
    ],
  },
  {
    id: "t6",
    category: "Social & Reels 9:16",
    title: "Fintech Mobile Core",
    ratio: "9:16",
    duration: "15s",
    difficulty: "Intermediate",
    badge: "App Showcase",
    stats: "Vertical 9:16 · 60FPS",
    image: "/dashboard/project-app.jpg",
    prompt:
      "Sleek mobile app presentation with hand holding frosted titanium smartphone in moody smoke. Floating debit card contactless tap radiating 3D lime waves and sub-second transaction checkmark.",
    timeline: [
      { time: "00:00 - 00:04", label: "Hand Holding Phone in Dramatic Mist", desc: "Device floating forward with reflective screen glow" },
      { time: "00:04 - 00:11", label: "Contactless Card Tap & Lime Wave", desc: "3D glass card taps phone screen triggering neon ripples" },
      { time: "00:11 - 00:15", label: "App Store Badge & Download CTA", desc: "Zero Foreign Fees stamped with app store button" },
    ],
  },
  {
    id: "t7",
    category: "SaaS & Tech",
    title: "Make Ideas Move",
    ratio: "16:9",
    duration: "25s",
    difficulty: "Pro",
    badge: "3D Motion",
    stats: "Fluid Dynamics · Octane",
    image: "/dashboard/template-sphere.jpg",
    prompt:
      "3D abstract fluid sphere and ribbon showcase designed for a modern fintech web application. Glossy morphing surfaces, reflective chrome spheres, and crisp vector typography.",
    timeline: [
      { time: "00:00 - 00:06", label: "Glossy Fluid Ribbon Morphing", desc: "Organic obsidian and lime ribbon flowing across 3D canvas" },
      { time: "00:06 - 00:18", label: "Metallic Spheres Colliding with Glow", desc: "Chrome spheres interacting with elastic physics" },
      { time: "00:18 - 00:25", label: "Product Logo Lockup Reveal", desc: "Ribbon forms the central brand glyph with subtle shine sweep" },
    ],
  },
  {
    id: "t8",
    category: "Product Launch",
    title: "Minimalist Hardware Drop",
    ratio: "16:9",
    duration: "30s",
    difficulty: "Intermediate",
    badge: "Keynote Ready",
    stats: "Exploded 3D · 4K",
    image: "/dashboard/project-launch.jpg",
    prompt:
      "Clean geometric tech hardware turntable with dark luxury lighting, laser rim sweeps, exploded internal components view, and precision specification callouts.",
    timeline: [
      { time: "00:00 - 00:08", label: "Laser Rim Lighting Sweep", desc: "Chassis silhouette illuminated by moving laser line" },
      { time: "00:08 - 00:22", label: "Exploded Internal Components View", desc: "Precision microchips, heatsinks, and glass housing levitating apart" },
      { time: "00:22 - 00:30", label: "Hero Lockup & Pre-Order Button", desc: "Parts snap back together with magnetic click and CTA" },
    ],
  },
  {
    id: "t9",
    category: "Brand Stories",
    title: "Canyon Valleys Architecture",
    ratio: "16:9",
    duration: "35s",
    difficulty: "Pro",
    badge: "Architectural",
    stats: "Flythrough · 60FPS",
    image: "/dashboard/project-explainer.jpg",
    prompt:
      "Architectural 3D flythrough through sleek snow-capped minimalist canyons with morning mist, geometric pavilion structures, and atmospheric drone camera movement.",
    timeline: [
      { time: "00:00 - 00:10", label: "High Altitude Canyon Flyover", desc: "Sweeping camera angle over snow-dusted ridgelines" },
      { time: "00:10 - 00:25", label: "Valley Depth Camera Glide", desc: "Smooth descent toward modern glass pavilion" },
      { time: "00:25 - 00:35", label: "Title Card Minimalist Reveal", desc: "Clean serif brand typography fading in center screen" },
    ],
  },
  {
    id: "t10",
    category: "Data Visualisation",
    title: "Metropolis Growth Index",
    ratio: "16:9",
    duration: "25s",
    difficulty: "Intermediate",
    badge: "Telemetry",
    stats: "Sunset City · 4K",
    image: "/dashboard/project-data.jpg",
    prompt:
      "Sunset skyscraper cityscape with holographic 3D bar charts reflecting in calm waters. Rising glowing towers indicating year-over-year revenue growth.",
    timeline: [
      { time: "00:00 - 00:07", label: "Golden Hour Reflection Establishing", desc: "Drone perspective over tranquil water reflecting skyline" },
      { time: "00:07 - 00:18", label: "Rising Glowing Towers Graph", desc: "Data bars extruding upward alongside skyscraper heights" },
      { time: "00:18 - 00:25", label: "Final Growth Metrics Stamped", desc: "+340% YoY expansion badge highlighted in neon lime" },
    ],
  },
];

const CATEGORIES = [
  { id: "All", label: "All Templates", icon: FiGrid },
  { id: "Product Launch", label: "Product Launch", icon: FiZap },
  { id: "SaaS & Tech", label: "SaaS & Tech", icon: FiServer },
  { id: "Social & Reels 9:16", label: "Social & Reels", icon: FiSmartphone },
  { id: "Data Visualisation", label: "Data & Charts", icon: FiActivity },
  { id: "Brand Stories", label: "Brand Stories", icon: FiLayers },
];

export default function TemplatesSection({
  onSelectTemplate,
}: TemplatesSectionProps) {
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedRatio, setSelectedRatio] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<TemplateItem | null>(null);
  const [editablePrompt, setEditablePrompt] = useState("");
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const filtered = TEMPLATES.filter((t) => {
    if (selectedCat !== "All" && t.category !== selectedCat) return false;
    if (selectedRatio !== "All" && t.ratio !== selectedRatio) return false;
    if (difficultyFilter !== "All" && t.difficulty !== difficultyFilter) return false;
    if (
      query &&
      !t.title.toLowerCase().includes(query.toLowerCase()) &&
      !t.category.toLowerCase().includes(query.toLowerCase()) &&
      !t.prompt.toLowerCase().includes(query.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const openTemplateModal = (t: TemplateItem) => {
    setActiveTemplate(t);
    setEditablePrompt(t.prompt);
    setIsPlayingPreview(false);
  };

  const copyPrompt = (p: string) => {
    navigator.clipboard?.writeText(p);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6 lg:p-8 space-y-8">
      {/* ── Page Title & Search Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
              MOTION BLUEPRINTS
            </span>
            <span className="rounded-full bg-surf-111110 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-c5ef26">
              60 FPS MASTER RIGS
            </span>
          </div>
          <h1 className="mt-1 text-[28px] sm:text-[38px] font-black tracking-tight text-ink-111110">
            Motion Template Library
          </h1>
          <p className="text-[14px] text-ink-717069 max-w-2xl">
            Pre-engineered 3D camera paths, kinetic typographic keynotes, and product reveal sequences ready to customize and export.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <FiSearch size={16} className="absolute left-3.5 top-3.5 text-ink-8c8980" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates, scenes, prompts..."
            className="w-full h-11 rounded-2xl border border-surf-dedad0 bg-surf-ffffff pl-10 pr-4 text-[13.5px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:outline-none transition shadow-2xs"
          />
        </div>
      </div>

      {/* ── Filter Deck: Category Pills & Ratio Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surf-eceae3 pb-4">
        {/* Category Icons & Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const active = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition ${
                  active
                    ? "bg-surf-111110 text-ink-c5ef26 shadow-xs"
                    : "border border-surf-dedad0 bg-surf-ffffff text-ink-55544e hover:border-surf-111110 hover:text-ink-111110"
                }`}
              >
                <IconComponent size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Aspect Ratio & Difficulty Pills */}
        <div className="flex items-center gap-2">
          {/* Ratio Toggle */}
          <div className="flex items-center gap-1 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-1 shadow-2xs">
            {["All", "16:9", "9:16", "1:1"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRatio(r)}
                className={`rounded-xl px-3 py-1 font-mono text-[11px] font-semibold transition ${
                  selectedRatio === r
                    ? "bg-surf-111110 text-white shadow-xs"
                    : "text-ink-717069 hover:text-ink-111110"
                }`}
              >
                {r === "All" ? "All Ratios" : r}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="h-9 rounded-xl border border-surf-dedad0 bg-surf-ffffff px-3 text-[12px] font-medium text-ink-55544e focus:border-surf-111110 focus:outline-none cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Pro">Pro Rig</option>
          </select>
        </div>
      </div>

      {/* ── Template Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((t) => (
          <div
            key={t.id}
            onClick={() => openTemplateModal(t)}
            className="group cursor-pointer rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-surf-111110 hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Media Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surf-111110">
                <Image
                  src={t.image}
                  alt={t.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />

                {/* Aspect Ratio & Duration Badge */}
                <span className="absolute bottom-2 left-2 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-xs">
                  {t.ratio} · {t.duration}
                </span>

                {/* Badge Tag */}
                {t.badge && (
                  <span className="absolute top-2 left-2 rounded-full bg-surf-111110 px-2 py-0.5 font-mono text-[9px] font-bold text-ink-c5ef26">
                    {t.badge}
                  </span>
                )}

                {/* Difficulty Pill */}
                <span className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[9.5px] font-medium text-white/90">
                  {t.difficulty}
                </span>

                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surf-c5ef26 text-ink-111110 shadow-md">
                    <FiPlay size={18} className="ml-0.5 fill-ink-111110" />
                  </span>
                </div>
              </div>

              {/* Text Meta */}
              <div className="mt-3.5 px-0.5">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-ink-658b02">
                  {t.category}
                </span>
                <h3 className="mt-1 text-[14.5px] font-bold text-ink-111110 group-hover:underline line-clamp-1">
                  {t.title}
                </h3>
                <p className="mt-1 text-[12px] text-ink-717069 line-clamp-2 leading-relaxed">
                  {t.prompt}
                </p>
              </div>
            </div>

            {/* Bottom Footer Action */}
            <div className="mt-4 pt-3 border-t border-surf-f2efe6 flex items-center justify-between">
              <span className="font-mono text-[10.5px] text-ink-8c8980">
                {t.stats || "60 FPS Master"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(t.prompt);
                }}
                className="flex items-center gap-1 text-[12px] font-bold text-ink-111110 hover:text-ink-658b02 transition"
              >
                <span>Customize</span>
                <FiArrowRight size={13} className="text-ink-c5ef26" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-12 text-center space-y-3">
          <p className="font-mono text-[14px] text-ink-717069">
            No templates matching &ldquo;{query}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCat("All");
              setSelectedRatio("All");
              setDifficultyFilter("All");
              setQuery("");
            }}
            className="rounded-xl bg-surf-111110 px-4 py-2 text-[12.5px] font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* =========================================================================
          DETAIL MODAL: TIMELINE BREAKDOWN & MASTER PROMPT EDITOR
         ========================================================================= */}
      {activeTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
          onClick={() => setActiveTemplate(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
                    {activeTemplate.category}
                  </span>
                  <span className="rounded-full bg-surf-111110 px-2 py-0.5 font-mono text-[10px] font-bold text-ink-c5ef26">
                    {activeTemplate.difficulty}
                  </span>
                  <span className="font-mono text-[11px] text-ink-8c8980">
                    {activeTemplate.ratio} · {activeTemplate.duration}
                  </span>
                </div>
                <h2 className="mt-1 text-[22px] font-bold text-ink-111110">
                  {activeTemplate.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveTemplate(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surf-f2efe6 text-ink-717069 hover:bg-surf-dedad0 hover:text-ink-111110"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-inner">
              <Image
                src={activeTemplate.image}
                alt={activeTemplate.title}
                fill
                className="object-cover"
              />

              {/* Play Overlay */}
              <div
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surf-c5ef26 text-ink-111110 shadow-xl hover:scale-105 transition">
                  {isPlayingPreview ? (
                    <FiPause size={22} className="fill-ink-111110" />
                  ) : (
                    <FiPlay size={22} className="ml-1 fill-ink-111110" />
                  )}
                </span>
              </div>

              {/* HUD Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/80 font-mono text-[11px] pointer-events-none">
                <span className="rounded bg-black/70 px-2 py-0.5 backdrop-blur-xs">
                  {isPlayingPreview ? "PLAYING SIMULATION · 60 FPS" : "PREVIEW PAUSED"}
                </span>
                <span className="rounded bg-black/70 px-2 py-0.5 text-ink-c5ef26 backdrop-blur-xs font-semibold">
                  {activeTemplate.duration}
                </span>
              </div>
            </div>

            {/* Editable Master Prompt Box */}
            <div className="rounded-2xl border border-surf-dedad0 bg-surf-faf9f5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-55544e">
                  Editable Master Prompt
                </span>
                <button
                  type="button"
                  onClick={() => copyPrompt(editablePrompt)}
                  className="flex items-center gap-1 text-[11.5px] font-semibold text-ink-111110 hover:underline"
                >
                  {copied ? <FiCheck size={12} className="text-ink-658b02" /> : <FiCopy size={12} />}
                  <span>{copied ? "Copied!" : "Copy Prompt"}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={editablePrompt}
                onChange={(e) => setEditablePrompt(e.target.value)}
                className="w-full rounded-xl border border-surf-dedad0 bg-surf-ffffff p-3 text-[13px] text-ink-111110 leading-relaxed focus:border-surf-111110 focus:outline-none"
              />
              <span className="block text-[11px] text-ink-8c8980">
                Feel free to tweak product names, colors, or camera movements before launching.
              </span>
            </div>

            {/* Multi-Beat Scene Breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-[13.5px] font-bold text-ink-111110">
                Cinematic Scene Breakdown ({activeTemplate.timeline.length} Beats)
              </h4>
              <div className="space-y-2">
                {activeTemplate.timeline.map((beat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-surf-eceae3 bg-surf-ffffff p-3 text-[12.5px] gap-1"
                  >
                    <div>
                      <span className="font-bold text-ink-111110 mr-2">
                        Beat 0{idx + 1}: {beat.label}
                      </span>
                      <p className="text-[11.5px] text-ink-717069 mt-0.5">
                        {beat.desc}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-ink-658b02 shrink-0">
                      {beat.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-surf-f2efe6 pt-4">
              <button
                type="button"
                onClick={() => setActiveTemplate(null)}
                className="rounded-xl border border-surf-dedad0 px-4 py-2.5 text-[13px] font-medium text-ink-55544e hover:bg-surf-faf9f5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  const p = editablePrompt.trim() || activeTemplate.prompt;
                  setActiveTemplate(null);
                  onSelectTemplate(p);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-surf-111110 px-6 py-2.5 text-[13.5px] font-semibold text-white shadow-md hover:bg-surf-272725 transition"
              >
                <IconSparkles className="w-4 h-4 text-ink-c5ef26" />
                <span>Launch in Studio with this Prompt</span>
                <FiArrowRight size={14} className="text-ink-c5ef26" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
