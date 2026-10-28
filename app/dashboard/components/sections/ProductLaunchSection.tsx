"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiServer,
  FiTerminal,
  FiSmartphone,
  FiShield,
  FiActivity,
  FiLayers,
  FiSliders,
  FiEye,
  FiMaximize2,
  FiRotateCw,
  FiCheckCircle,
  FiCheck,
  FiLink,
  FiGlobe,
  FiPlay,
  FiRotateCcw,
  FiDownload,
  FiShare2,
  FiLoader,
  FiArrowRight,
  FiCopy,
  FiExternalLink,
  FiZap,
  FiCpu,
  FiClock,
} from "react-icons/fi";
import {
  SiLinear,
  SiSupabase,
  SiStripe,
  SiVercel,
  SiGithub,
} from "react-icons/si";
import { IconSparkles } from "../../../components/Icons";
import SaasLaunchVideoPlayer from "./SaasLaunchVideoPlayer";

interface ProductLaunchSectionProps {
  onStartLaunch: (prompt: string) => void;
}

interface SaasPreset {
  id: string;
  title: string;
  domain: string;
  sub: string;
  duration: string;
  ratio: "16:9" | "9:16";
  thumbnail: string;
  brandColor: string;
  accentColor: string;
  stats: string;
  beats: string[];
  prompt: string;
}

interface ExtractedProduct {
  brandName: string;
  domain: string;
  tagline: string;
  keyFeature: string;
  brandColor: string;
  accentColor: string;
  category: string;
  techStack: string[];
  latency: string;
  beats: string[];
}

const CATEGORIES = [
  {
    id: "saas",
    label: "SaaS & Cloud Platforms",
    icon: FiServer,
    example: "Dashboard & 3D Glass UI",
    badge: "Most Popular",
  },
  {
    id: "devtools",
    label: "Developer Tools & CLI",
    icon: FiTerminal,
    example: "Kinetic Terminal & Code Sync",
    badge: "High Velocity",
  },
  {
    id: "ai",
    label: "AI Agents & Copilots",
    icon: IconSparkles,
    example: "Neural Particles & Prompt UI",
    badge: "Trending",
  },
  {
    id: "fintech",
    label: "FinTech & Global Pay",
    icon: FiZap,
    example: "Sub-50ms Settlement & Cards",
  },
  {
    id: "mobile",
    label: "Mobile Apps & iOS/Android",
    icon: FiSmartphone,
    example: "9:16 Bezel Mockups & Gestures",
  },
  {
    id: "security",
    label: "Enterprise Security & Zero-Trust",
    icon: FiShield,
    example: "Encrypted Enclaves & Edge PoPs",
  },
];

const SHOT_SEQUENCE = [
  {
    id: "s1",
    label: "Teaser Silhouette & Lighting Reveal",
    time: "00:00 - 00:04",
    icon: FiEye,
    desc: "Dramatic obsidian shadows outlining product geometry with laser sweep",
  },
  {
    id: "s2",
    label: "Ultra Macro Glass & Surface Scan",
    time: "00:04 - 00:09",
    icon: FiMaximize2,
    desc: "Microscopic focal roll over 3D glass bevels, code typography, and shaders",
  },
  {
    id: "s3",
    label: "3D Exploded UI Layer Breakdown",
    time: "00:09 - 00:19",
    icon: FiLayers,
    desc: "Isometric floating widgets, real-time charts, and telemetry streams",
  },
  {
    id: "s4",
    label: "Kinetic Velocity & Benchmark Counter",
    time: "00:19 - 00:25",
    icon: FiActivity,
    desc: "Sub-50ms latency counter countdown from 1,420ms to 8ms in neon lime",
  },
  {
    id: "s5",
    label: "Hero Brand Lockup & Call-To-Action",
    time: "00:25 - 00:30",
    icon: FiCheckCircle,
    desc: "Clean brand logo stamp with URL pre-order or free trial badge",
  },
];

const SAAS_PRESETS: SaasPreset[] = [
  {
    id: "apex",
    title: "Apex Analytics 3.0",
    domain: "apex.io",
    sub: "Keynote-style 3D glass dashboard with telemetry streams and AI copilot",
    duration: "30s",
    ratio: "16:9",
    thumbnail: "/dashboard/project-data.jpg",
    brandColor: "#c5ef26",
    accentColor: "#658b02",
    stats: "4K 60FPS · 94.6% Hook Retention",
    beats: [
      "00:00 - 00:06: Complex legacy spreadsheets shattering into dark ambient mist",
      "00:06 - 00:15: 3D Isometric glassmorphism dashboard elevating with glowing telemetry",
      "00:15 - 00:23: Real-time query execution counter: 1,400ms down to 8ms in neon lime",
      "00:23 - 00:30: 'Deploy in 1 Click' callout with brand logo and apex.io/start CTA",
    ],
    prompt:
      "A cinematic 30-second SaaS product launch video for Apex Analytics. Dark obsidian luxury aesthetic with electric lime glowing data charts, floating 3D glass widgets, animated vector telemetry, fast camera zooms, and keynote typography.",
  },
  {
    id: "linear",
    title: "Linear Next",
    domain: "linear.app",
    sub: "High-velocity keyboard shortcuts, split-second issue tracking, dark UI",
    duration: "30s",
    ratio: "16:9",
    thumbnail: "/dashboard/project-explainer.jpg",
    brandColor: "#5E6AD2",
    accentColor: "#8b96f5",
    stats: "ProRes 422 · 3.8x Social CTR",
    beats: [
      "00:00 - 00:06: Kinetic terminal cursor typing 'linear --sync-all' at lightning speed",
      "00:06 - 00:15: Sleek monochrome kanban board sliding smoothly with zero frame drops",
      "00:15 - 00:23: Sub-50ms sync badge expanding with neon violet particle glow",
      "00:23 - 00:30: 'Crafted for High Velocity' stamped with linear.app/start CTA",
    ],
    prompt:
      "A high-velocity SaaS commercial for Linear Next project management. Minimalist obsidian UI, instant keyboard navigation motions, violet accent neon glows, crisp 60fps whip transitions, and keynote typography.",
  },
  {
    id: "supabase",
    title: "Supabase Vector Cloud",
    domain: "supabase.com",
    sub: "Build production AI applications with Postgres vector search at scale",
    duration: "30s",
    ratio: "16:9",
    thumbnail: "/dashboard/template-data.jpg",
    brandColor: "#3ECF8E",
    accentColor: "#1e8a5a",
    stats: "Enterprise Ready · 60FPS",
    beats: [
      "00:00 - 00:06: Millions of unindexed embeddings swirling in deep space nebula",
      "00:06 - 00:15: Postgres emerald cylinder indexing 1,000,000 vectors in 4ms",
      "00:15 - 00:23: Real-time semantic similarity query benchmarks flashing in green neon",
      "00:23 - 00:30: 'The Open Source AI Database' stamped with supabase.com/vector CTA",
    ],
    prompt:
      "An enterprise SaaS product launch video for Supabase Vector Cloud. Deep space nebula, emerald green laser beams, 3D Postgres cylinders, real-time embedding queries, and high-tech typography.",
  },
  {
    id: "stripe",
    title: "Stripe Global Issuing",
    domain: "stripe.com",
    sub: "Financial infrastructure to programmatically issue cards in 30+ countries",
    duration: "30s",
    ratio: "16:9",
    thumbnail: "/dashboard/project-app.jpg",
    brandColor: "#635BFF",
    accentColor: "#4238e8",
    stats: "Fintech Core · Multi-Region",
    beats: [
      "00:00 - 00:06: Legacy wire transfer paper trails dissolving into dark obsidian smoke",
      "00:06 - 00:15: Holographic titanium payment card extruding with glowing encrypted chip",
      "00:15 - 00:23: Sub-second multi-tenant settlement ticker across 30 global currencies",
      "00:23 - 00:30: 'Financial Infrastructure for the Internet' with stripe.com CTA",
    ],
    prompt:
      "A sleek luxury FinTech product launch video for Stripe Issuing. Blurple neon ambient glow, floating frosted cards, encrypted microchip laser sweeps, instant currency conversion counters, and keynote polish.",
  },
];

const QUICK_URLS = [
  {
    name: "Linear",
    url: "https://linear.app",
    icon: SiLinear,
    color: "#5E6AD2",
  },
  {
    name: "Supabase",
    url: "https://supabase.com",
    icon: SiSupabase,
    color: "#3ECF8E",
  },
  {
    name: "Stripe",
    url: "https://stripe.com",
    icon: SiStripe,
    color: "#635BFF",
  },
  {
    name: "Vercel",
    url: "https://vercel.com",
    icon: SiVercel,
    color: "#ffffff",
  },
  {
    name: "Byreel",
    url: "https://byreel.io",
    icon: IconSparkles,
    color: "#c5ef26",
  },
];

export default function ProductLaunchSection({
  onStartLaunch,
}: ProductLaunchSectionProps) {
  const [selectedCat, setSelectedCat] = useState("saas");
  const [productUrl, setProductUrl] = useState("https://linear.app");
  const [isScanningUrl, setIsScanningUrl] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Extracted product data from URL
  const [extractedData, setExtractedData] = useState<ExtractedProduct>({
    brandName: "Linear Next",
    domain: "linear.app",
    tagline: "The issue tracker designed for high-velocity software teams.",
    keyFeature: "Sub-50ms offline synchronization with bi-directional Git sync.",
    brandColor: "#5E6AD2",
    accentColor: "#8b96f5",
    category: "Developer Tools & CLI",
    techStack: ["Next.js", "GraphQL", "Sync Engine", "Rust Core"],
    latency: "8ms",
    beats: [
      "00:00 - 00:06: Kinetic terminal typing 'linear --sync-all' at lightning speed",
      "00:06 - 00:15: Sleek monochrome kanban board sliding with zero frame drops",
      "00:15 - 00:23: Sub-50ms sync badge expanding with neon violet particle glow",
      "00:23 - 00:30: 'Crafted for High Velocity' stamped with linear.app CTA",
    ],
  });

  // Current active SaaS video state loaded in live player
  const [activeVideo, setActiveVideo] = useState<{
    productName: string;
    tagline: string;
    keyFeature: string;
    productUrl: string;
    brandColor: string;
    categoryLabel: string;
  }>({
    productName: "Linear Next",
    tagline: "The issue tracker designed for high-velocity software teams.",
    keyFeature: "Sub-50ms offline synchronization with bi-directional Git sync.",
    productUrl: "https://linear.app",
    brandColor: "#5E6AD2",
    categoryLabel: "Developer Tools & CLI",
  });

  // Form Fields
  const [productName, setProductName] = useState("Linear Next");
  const [tagline, setTagline] = useState(
    "The issue tracker designed for high-velocity software teams."
  );
  const [keyFeature, setKeyFeature] = useState(
    "Sub-50ms offline synchronization with bi-directional Git sync."
  );
  const [selectedShots, setSelectedShots] = useState<string[]>([
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
  ]);

  // Fullscreen video modal preview
  const [fullscreenVideo, setFullscreenVideo] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const toggleShot = (id: string) => {
    setSelectedShots((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleScanUrl = (urlToScan?: string) => {
    const target = urlToScan || productUrl;
    if (!target.trim()) return;

    setProductUrl(target);
    setIsScanningUrl(true);
    setScanMessage("Resolving DNS & OpenGraph metadata from " + target + "...");

    setTimeout(() => {
      setScanMessage("Extracting brand colors, typography & hero copy...");
    }, 600);

    setTimeout(() => {
      setIsScanningUrl(false);

      if (target.includes("linear")) {
        const data: ExtractedProduct = {
          brandName: "Linear Next",
          domain: "linear.app",
          tagline: "The issue tracker designed for high-velocity software teams.",
          keyFeature:
            "Sub-50ms offline synchronization with bi-directional Git sync.",
          brandColor: "#5E6AD2",
          accentColor: "#8b96f5",
          category: "Developer Tools & CLI",
          techStack: ["Next.js", "GraphQL", "Sync Engine", "Rust"],
          latency: "8ms",
          beats: [
            "00:00 - 00:06: Kinetic terminal typing 'linear --sync-all' at lightning speed",
            "00:06 - 00:15: Sleek monochrome kanban board sliding with zero frame drops",
            "00:15 - 00:23: Sub-50ms sync badge expanding with neon violet particle glow",
            "00:23 - 00:30: 'Crafted for High Velocity' stamped with linear.app CTA",
          ],
        };
        setExtractedData(data);
        setProductName(data.brandName);
        setTagline(data.tagline);
        setKeyFeature(data.keyFeature);
        setSelectedCat("devtools");
        setActiveVideo({
          productName: data.brandName,
          tagline: data.tagline,
          keyFeature: data.keyFeature,
          productUrl: target,
          brandColor: data.brandColor,
          categoryLabel: data.category,
        });
      } else if (target.includes("supabase")) {
        const data: ExtractedProduct = {
          brandName: "Supabase Vector Cloud",
          domain: "supabase.com",
          tagline:
            "Build production AI applications with Postgres vector search at scale.",
          keyFeature: "Millions of high-dimensional embeddings queried in 4ms.",
          brandColor: "#3ECF8E",
          accentColor: "#1e8a5a",
          category: "SaaS & Cloud Platforms",
          techStack: ["PostgreSQL", "pgvector", "Deno Edge", "Go Engine"],
          latency: "4ms",
          beats: [
            "00:00 - 00:06: Millions of unindexed embeddings swirling in deep space nebula",
            "00:06 - 00:15: Postgres emerald cylinder indexing 1,000,000 vectors in 4ms",
            "00:15 - 00:23: Real-time semantic similarity query benchmarks flashing in green neon",
            "00:23 - 00:30: 'The Open Source AI Database' stamped with supabase.com/vector CTA",
          ],
        };
        setExtractedData(data);
        setProductName(data.brandName);
        setTagline(data.tagline);
        setKeyFeature(data.keyFeature);
        setSelectedCat("saas");
        setActiveVideo({
          productName: data.brandName,
          tagline: data.tagline,
          keyFeature: data.keyFeature,
          productUrl: target,
          brandColor: data.brandColor,
          categoryLabel: data.category,
        });
      } else if (target.includes("stripe")) {
        const data: ExtractedProduct = {
          brandName: "Stripe Global Issuing",
          domain: "stripe.com",
          tagline:
            "Financial infrastructure to programmatically issue cards in 30+ countries.",
          keyFeature:
            "Zero currency friction with instant multi-tenant settlement.",
          brandColor: "#635BFF",
          accentColor: "#4238e8",
          category: "FinTech & Global Pay",
          techStack: ["PCI-DSS Level 1", "Global Wire", "Card Ledger", "API"],
          latency: "12ms",
          beats: [
            "00:00 - 00:06: Legacy wire transfer paper trails dissolving into dark obsidian smoke",
            "00:06 - 00:15: Holographic titanium payment card extruding with glowing encrypted chip",
            "00:15 - 00:23: Sub-second multi-tenant settlement ticker across 30 global currencies",
            "00:23 - 00:30: 'Financial Infrastructure for the Internet' with stripe.com CTA",
          ],
        };
        setExtractedData(data);
        setProductName(data.brandName);
        setTagline(data.tagline);
        setKeyFeature(data.keyFeature);
        setSelectedCat("fintech");
        setActiveVideo({
          productName: data.brandName,
          tagline: data.tagline,
          keyFeature: data.keyFeature,
          productUrl: target,
          brandColor: data.brandColor,
          categoryLabel: data.category,
        });
      } else if (target.includes("vercel")) {
        const data: ExtractedProduct = {
          brandName: "Vercel Frontend Cloud",
          domain: "vercel.com",
          tagline: "Develop. Preview. Ship. The complete platform for the Web.",
          keyFeature: "Zero-cold start edge functions with instant global cache.",
          brandColor: "#ffffff",
          accentColor: "#888888",
          category: "Developer Tools & CLI",
          techStack: ["Next.js", "Edge Middleware", "Turbopack", "Global CDN"],
          latency: "2ms",
          beats: [
            "00:00 - 00:06: Stale monolithic server instances freezing under traffic surges",
            "00:06 - 00:15: Minimalist monochrome Vercel triangle activating 240 global PoPs",
            "00:15 - 00:23: Instant deployment preview URL generated in sub-200ms",
            "00:23 - 00:30: 'Ship at the Speed of Light' stamped with vercel.com CTA",
          ],
        };
        setExtractedData(data);
        setProductName(data.brandName);
        setTagline(data.tagline);
        setKeyFeature(data.keyFeature);
        setSelectedCat("devtools");
        setActiveVideo({
          productName: data.brandName,
          tagline: data.tagline,
          keyFeature: data.keyFeature,
          productUrl: target,
          brandColor: data.brandColor,
          categoryLabel: data.category,
        });
      } else {
        const domain = target.replace(/^https?:\/\//, "").split("/")[0];
        const cleanName = domain.split(".")[0];
        const capitalized =
          cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        const data: ExtractedProduct = {
          brandName: `${capitalized} Cloud Engine`,
          domain: domain,
          tagline: "Engineered for speed, built for modern builders.",
          keyFeature: "10x performance increase with automated workflows.",
          brandColor: "#c5ef26",
          accentColor: "#658b02",
          category: "SaaS & Cloud Platforms",
          techStack: ["Cloud Native", "AI Copilot", "Global Edge", "REST API"],
          latency: "8ms",
          beats: [
            `00:00 - 00:06: Legacy bottlenecks shattering under modern workload`,
            `00:06 - 00:15: 3D Isometric glass dashboard elevating for ${capitalized}`,
            `00:15 - 00:23: Sub-8ms latency benchmark counter spinning in neon green`,
            `00:23 - 00:30: 'Deploy with 1 Click' callout with ${domain} CTA`,
          ],
        };
        setExtractedData(data);
        setProductName(data.brandName);
        setTagline(data.tagline);
        setKeyFeature(data.keyFeature);
        setSelectedCat("saas");
        setActiveVideo({
          productName: data.brandName,
          tagline: data.tagline,
          keyFeature: data.keyFeature,
          productUrl: target,
          brandColor: data.brandColor,
          categoryLabel: data.category,
        });
      }

      setScanMessage(
        `✓ Extracted brand DNA, color palette, and generated 4-scene video blueprint from ${target}`
      );
      setTimeout(() => setScanMessage(null), 5000);
    }, 1200);
  };

  const handleLaunchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = productName.trim() || "Nova SaaS Platform";
    const tag = tagline.trim() || "Engineered for speed and velocity";
    const feat =
      keyFeature.trim() || "Real-time telemetry and 3D glass dashboard";
    const fullPrompt = `A high-end cinematic SaaS product launch video for "${name}" (${productUrl}) - ${tag}. Highlight key feature: "${feat}". Include dynamic 3D glass UI layer elevation, macro texture scan, kinetic typography specs, sub-50ms latency counter, and ${extractedData.brandColor} lighting on obsidian black background.`;
    onStartLaunch(fullPrompt);
  };

  const loadPreset = (preset: SaasPreset) => {
    setActiveVideo({
      productName: preset.title,
      tagline: preset.sub,
      keyFeature: preset.beats[2] || "Sub-50ms sync",
      productUrl: `https://${preset.domain}`,
      brandColor: preset.brandColor,
      categoryLabel: preset.title,
    });
    setProductName(preset.title);
    setTagline(preset.sub);
    setProductUrl(`https://${preset.domain}`);
  };

  const copyScript = (beats: string[]) => {
    navigator.clipboard?.writeText(beats.join("\n"));
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6 lg:p-8 space-y-12">
      {/* Page Title & Status Ticker */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
              PRODUCT LAUNCH STUDIO
            </span>
            <span className="rounded-full bg-surf-111110 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-c5ef26">
              60 FPS 4K ENGINE
            </span>
          </div>
          <h1 className="mt-1 text-[28px] sm:text-[38px] font-black tracking-tight text-ink-111110">
            SaaS & Product Launch Motion Studio
          </h1>
          <p className="text-[14px] text-ink-717069 max-w-2xl">
            Auto-extract any SaaS or product URL to generate cinematic 3D motion
            commercials, interactive glass dashboards, and kinetic benchmark
            launches.
          </p>
        </div>

        {/* Feature stats ticker */}
        <div className="flex items-center gap-2 rounded-2xl border border-surf-dedad0 bg-surf-ffffff px-4 py-2.5 shadow-2xs">
          <span className="flex h-2.5 w-2.5 rounded-full bg-surf-c5ef26 animate-pulse" />
          <span className="font-mono text-[12px] font-medium text-ink-55544e">
            Render Pipeline:
          </span>
          <span className="font-mono text-[12px] font-bold text-ink-111110">
            URL → Storyboard → 4K ProRes
          </span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: URL AUTO-SCANNER & METADATA EXTRACTOR ("we will need url")
         ========================================================================= */}
      <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surf-111110 text-ink-c5ef26 shadow-sm">
              <FiGlobe size={20} />
            </span>
            <div>
              <h2 className="text-[18px] font-bold text-ink-111110">
                Auto-Extract from Product URL
              </h2>
              <p className="text-[12.5px] text-ink-717069">
                Paste your website or docs URL. Byreel auto-scans brand palette,
                tech stack, and generates the 4-scene SaaS commercial.
              </p>
            </div>
          </div>
        </div>

        {/* High-Impact URL Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <FiLink
              size={18}
              className="absolute left-4 top-3.5 text-ink-8c8980"
            />
            <input
              type="url"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://yourproduct.com/launch"
              className="w-full h-12 rounded-2xl border border-surf-dedad0 bg-surf-faf9f5 pl-11 pr-4 text-[14px] text-ink-111110 font-mono placeholder-ink-9c9990 focus:border-surf-111110 focus:bg-surf-ffffff focus:outline-none transition shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={() => handleScanUrl()}
            disabled={isScanningUrl || !productUrl.trim()}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-surf-111110 px-7 text-[13.5px] font-semibold text-white shadow-md transition hover:bg-surf-272725 disabled:opacity-50 shrink-0"
          >
            {isScanningUrl ? (
              <>
                <FiLoader size={16} className="animate-spin text-ink-c5ef26" />
                <span>Scanning Product DNA...</span>
              </>
            ) : (
              <>
                <IconSparkles className="w-4 h-4 text-ink-c5ef26" />
                <span>Scan URL & Generate Video</span>
              </>
            )}
          </button>
        </div>

        {/* Real Brand Icon Quick Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-surf-f2efe6">
          <span className="font-mono text-[11.5px] font-semibold text-ink-8c8980 mr-1">
            Quick Try Real SaaS:
          </span>
          {QUICK_URLS.map((item) => {
            const BrandIcon = item.icon;
            const isSelected = productUrl === item.url;
            return (
              <button
                key={item.url}
                type="button"
                onClick={() => handleScanUrl(item.url)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-medium transition ${
                  isSelected
                    ? "border-surf-111110 bg-surf-111110 text-ink-c5ef26 shadow-2xs"
                    : "border-surf-eceae3 bg-surf-faf9f5 text-ink-44433e hover:border-surf-dedad0 hover:bg-surf-ffffff"
                }`}
              >
                <BrandIcon
                  size={14}
                  style={{ color: isSelected ? "#c5ef26" : item.color }}
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Live Scan Notification */}
        {scanMessage && (
          <div className="flex items-center gap-2 rounded-2xl bg-surf-f2fac2 p-3.5 text-[13px] font-medium text-ink-658b02 animate-in fade-in">
            <FiCheck size={16} className="shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}

        {/* =============================================================
            LIVE EXTRACTED PRODUCT CARD & STORYBOARD
           ============================================================= */}
        {extractedData && (
          <div className="rounded-2xl border border-surf-eceae3 bg-surf-faf9f5 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surf-dedad0 pb-3">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-mono font-bold text-[16px] shadow-sm"
                  style={{ backgroundColor: extractedData.brandColor }}
                >
                  {extractedData.brandName.charAt(0)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-ink-111110">
                      {extractedData.brandName}
                    </h3>
                    <span className="rounded-full bg-surf-111110 px-2 py-0.2 font-mono text-[9px] font-bold text-ink-c5ef26">
                      VERIFIED DOMAIN
                    </span>
                  </div>
                  <p className="text-[12px] text-ink-717069 font-mono">
                    {extractedData.domain} · {extractedData.category}
                  </p>
                </div>
              </div>

              {/* Color Palette Chips */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-ink-8c8980">
                  Brand DNA:
                </span>
                <span
                  className="flex h-6 w-6 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: extractedData.brandColor }}
                  title={`Primary: ${extractedData.brandColor}`}
                />
                <span
                  className="flex h-6 w-6 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: extractedData.accentColor }}
                  title={`Accent: ${extractedData.accentColor}`}
                />
                <span
                  className="flex h-6 w-6 rounded-full border border-black/10 bg-surf-111110 shadow-2xs"
                  title="Canvas: #111110 Obsidian"
                />
              </div>
            </div>

            {/* Extracted Values & Storyboard scene pills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-[12px] text-ink-717069">
                  <span className="font-semibold text-ink-111110">Hook: </span>
                  &ldquo;{extractedData.tagline}&rdquo;
                </div>
                <div className="text-[12px] text-ink-717069">
                  <span className="font-semibold text-ink-111110">Core Spec: </span>
                  {extractedData.keyFeature}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {extractedData.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-surf-ffffff border border-surf-dedad0 px-2 py-0.5 font-mono text-[10.5px] text-ink-55544e"
                    >
                      {tech}
                    </span>
                  ))}
                  <span className="rounded-md bg-surf-f2fac2 border border-surf-d9f268 px-2 py-0.5 font-mono text-[10.5px] text-ink-658b02 font-semibold">
                    ⚡ {extractedData.latency}
                  </span>
                </div>
              </div>

              {/* Storyboard Script Preview */}
              <div className="space-y-1.5 rounded-xl border border-surf-eceae3 bg-surf-ffffff p-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-8c8980">
                  <span className="font-semibold text-ink-111110">
                    Auto-Generated 4-Beat Script
                  </span>
                  <button
                    type="button"
                    onClick={() => copyScript(extractedData.beats)}
                    className="flex items-center gap-1 text-ink-111110 hover:underline"
                  >
                    {copiedScript ? (
                      <FiCheck size={11} className="text-ink-658b02" />
                    ) : (
                      <FiCopy size={11} />
                    )}
                    <span>{copiedScript ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="space-y-1 text-[11.5px] text-ink-55544e">
                  {extractedData.beats.slice(0, 2).map((b, i) => (
                    <p key={i} className="line-clamp-1">
                      <span className="font-mono text-ink-658b02 font-semibold mr-1">
                        Beat {i + 1}:
                      </span>
                      {b}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Playback Action Button */}
            <div className="flex justify-end pt-1">
              <a
                href="#live-video-player"
                onClick={() => {
                  setActiveVideo({
                    productName: extractedData.brandName,
                    tagline: extractedData.tagline,
                    keyFeature: extractedData.keyFeature,
                    productUrl: productUrl,
                    brandColor: extractedData.brandColor,
                    categoryLabel: extractedData.category,
                  });
                }}
                className="flex items-center gap-2 rounded-xl bg-surf-111110 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-surf-272725 transition shadow-xs"
              >
                <FiPlay size={14} className="fill-ink-c5ef26 text-ink-c5ef26" />
                <span>Preview Interactive SaaS Launch Video Below</span>
                <FiArrowRight size={13} className="text-ink-c5ef26" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 2: LIVE INTERACTIVE SAAS LAUNCH VIDEO ENGINE ("give me saas launch video")
         ========================================================================= */}
      <section id="live-video-player" className="space-y-5 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-surf-111110 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-c5ef26">
                LIVE PLAYABLE SIMULATOR
              </span>
            </div>
            <h2 className="mt-1 text-[22px] font-bold text-ink-111110">
              Interactive SaaS Launch Video Engine
            </h2>
            <p className="text-[13px] text-ink-717069">
              Real-time 60 FPS motion graphics simulation with 4 keynote beats,
              synthesized audio FX, time scrubber, and aspect ratio controls.
            </p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {SAAS_PRESETS.map((p) => {
              const active = activeVideo.productName === p.title;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => loadPreset(p)}
                  className={`rounded-xl px-3 py-1.5 text-[11.5px] font-semibold transition flex items-center gap-1.5 ${
                    active
                      ? "bg-surf-111110 text-ink-c5ef26 shadow-sm"
                      : "bg-surf-ffffff border border-surf-dedad0 text-ink-55544e hover:border-surf-111110 hover:text-ink-111110"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.brandColor }}
                  />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Live Interactive Video Player */}
        <SaasLaunchVideoPlayer
          productName={activeVideo.productName}
          tagline={activeVideo.tagline}
          keyFeature={activeVideo.keyFeature}
          productUrl={activeVideo.productUrl}
          brandColor={activeVideo.brandColor}
          categoryLabel={activeVideo.categoryLabel}
          onOpenInStudio={(prompt) => onStartLaunch(prompt)}
        />
      </section>

      {/* =========================================================================
          SECTION 3: SAAS LAUNCH VIDEO BLUEPRINT CARDS
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-ink-111110">
              Featured SaaS Launch Blueprints
            </h3>
            <p className="text-[12.5px] text-ink-717069">
              Pre-configured keynote styles with script breakdowns and hook
              benchmarks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SAAS_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className="group cursor-pointer rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-surf-111110 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surf-111110">
                  <Image
                    src={preset.thumbnail}
                    alt={preset.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white">
                    {preset.duration} · {preset.ratio}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full text-ink-111110 shadow-md"
                      style={{ backgroundColor: preset.brandColor }}
                    >
                      <FiPlay size={18} className="ml-0.5 fill-ink-111110" />
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 px-0.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-surf-f2fac2 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-ink-658b02">
                      SAAS BLUEPRINT
                    </span>
                    <span className="font-mono text-[10px] text-ink-8c8980">
                      {preset.domain}
                    </span>
                  </div>
                  <h4 className="mt-1 text-[14.5px] font-bold text-ink-111110 group-hover:underline line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="mt-1 text-[12px] text-ink-717069 line-clamp-2 leading-relaxed">
                    {preset.sub}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-surf-f2efe6 pt-3 flex items-center justify-between">
                <span className="font-mono text-[10.5px] text-ink-658b02 font-semibold">
                  {preset.stats}
                </span>
                <span className="text-[12px] font-bold text-ink-111110 flex items-center gap-1 group-hover:underline">
                  Load Video <FiArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: STEP-BY-STEP LAUNCH CONFIGURATOR (WITH REAL CLEAN ICONS)
         ========================================================================= */}
      <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 sm:p-8 shadow-xs space-y-8">
        <div className="border-b border-surf-f2efe6 pb-4">
          <h2 className="text-[20px] font-bold text-ink-111110">
            Customize Your Product Launch Commercial
          </h2>
          <p className="text-[13px] text-ink-717069 mt-0.5">
            Configure target category, product metadata, and cinematic shot
            sequence.
          </p>
        </div>

        <form onSubmit={handleLaunchSubmit} className="space-y-8">
          {/* Step 1: Real Icon Categories */}
          <div>
            <label className="text-[14px] font-bold text-ink-111110">
              Step 1: Target Product Category
            </label>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const active = selectedCat === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition ${
                      active
                        ? "border-surf-111110 bg-surf-faf9f5 ring-2 ring-surf-c5ef26/30 shadow-xs"
                        : "border-surf-eceae3 bg-surf-ffffff hover:border-surf-dedad0 hover:bg-surf-faf9f5"
                    }`}
                  >
                    {cat.badge && (
                      <span className="absolute -top-2.5 rounded-full bg-surf-111110 px-2 py-0.2 font-mono text-[8.5px] font-bold uppercase text-ink-c5ef26">
                        {cat.badge}
                      </span>
                    )}

                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl mb-2 transition ${
                        active
                          ? "bg-surf-111110 text-ink-c5ef26"
                          : "bg-surf-f2efe6 text-ink-55544e"
                      }`}
                    >
                      <IconComponent size={20} />
                    </span>

                    <span className="text-[12.5px] font-bold text-ink-111110 leading-snug">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-ink-8c8980 mt-0.5">
                      {cat.example}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Metadata Fields */}
          <div className="border-t border-surf-f2efe6 pt-6 space-y-4">
            <label className="text-[14px] font-bold text-ink-111110">
              Step 2: Product Name & Value Proposition
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-ink-55544e">
                  Product / Service Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder='e.g. "Apex Analytics"'
                  className="mt-1.5 w-full h-11 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-ink-55544e">
                  Hook / Launch Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder='e.g. "From raw data to instant clarity in 8ms."'
                  className="mt-1.5 w-full h-11 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-ink-55544e">
                  Core Feature / Spec Highlight
                </label>
                <input
                  type="text"
                  value={keyFeature}
                  onChange={(e) => setKeyFeature(e.target.value)}
                  placeholder='e.g. "Interactive 3D glass dashboard & real-time telemetry"'
                  className="mt-1.5 w-full h-11 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Cinematic Shot Sequence (With Real Clean Icons) */}
          <div className="border-t border-surf-f2efe6 pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-bold text-ink-111110">
                Step 3: Cinematic Shot Sequence
              </label>
              <span className="font-mono text-[11px] text-ink-8c8980">
                {selectedShots.length} of {SHOT_SEQUENCE.length} beats enabled
              </span>
            </div>
            <p className="text-[12px] text-ink-717069">
              Toggle beats to tailor the flow for social reels (15s) or
              comprehensive feature keynotes (30s).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
              {SHOT_SEQUENCE.map((shot) => {
                const active = selectedShots.includes(shot.id);
                const ShotIcon = shot.icon;

                return (
                  <div
                    key={shot.id}
                    onClick={() => toggleShot(shot.id)}
                    className={`cursor-pointer rounded-2xl border p-3.5 transition flex flex-col justify-between ${
                      active
                        ? "border-surf-111110 bg-surf-faf9f5 shadow-2xs"
                        : "border-surf-eceae3 bg-surf-ffffff opacity-50 hover:opacity-100"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            active
                              ? "bg-surf-111110 text-ink-c5ef26"
                              : "bg-surf-f2efe6 text-ink-717069"
                          }`}
                        >
                          <ShotIcon size={16} />
                        </span>
                        <span className="font-mono text-[10px] text-ink-8c8980">
                          {shot.time}
                        </span>
                      </div>

                      <h4 className="text-[12.5px] font-bold text-ink-111110 leading-snug">
                        {shot.label}
                      </h4>
                      <p className="text-[11px] text-ink-717069 mt-1 line-clamp-2">
                        {shot.desc}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-surf-eceae3 pt-2">
                      <span className="font-mono text-[10px] text-ink-8c8980">
                        {active ? "Active" : "Omitted"}
                      </span>
                      {active ? (
                        <FiCheck size={14} className="text-ink-658b02" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-surf-dedad0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end border-t border-surf-f2efe6 pt-6">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-surf-111110 px-7 py-3.5 text-[14px] font-semibold text-white shadow-md transition hover:bg-surf-272725"
            >
              <IconSparkles className="w-4 h-4 text-ink-c5ef26" />
              <span>Generate 4K Product Launch Video in Studio</span>
              <FiArrowRight size={15} className="text-ink-c5ef26" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
