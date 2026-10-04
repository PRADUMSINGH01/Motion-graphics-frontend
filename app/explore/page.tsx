"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiPlay,
  FiPause,
  FiHeart,
  FiBookmark,
  FiX,
  FiArrowRight,
  FiDownload,
  FiRepeat,
  FiCopy,
  FiCheck,
  FiSliders,
  FiGrid,
  FiMaximize2,
  FiZap,
  FiLayers,
  FiClock,
  FiStar,
  FiCode,
  FiShare2,
  FiSmartphone,
  FiTv,
  FiSquare,
  FiTrendingUp,
  FiCompass,
  FiUser,
  FiShuffle,
  FiFilter,
  FiEye,
  FiRotateCcw,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiRefreshCw,
  FiArrowUp,
} from "react-icons/fi";
import { useAlert } from "../context/AlertContext";
import SpiderNetBackground from "../components/SpiderNetBackground";
import BackButton from "../components/BackButton";
import ThemeToggle from "../components/ThemeToggle";

export type TemplateCategory =
  | "Kinetic Typography"
  | "Social & Reels (9:16)"
  | "3D & VFX"
  | "Logo Reveals"
  | "UI & Lottie"
  | "HUD & Cyberpunk";

export interface TemplateItem {
  id: string;
  title: string;
  category: TemplateCategory;
  duration: string;
  durationSec: number;
  aspectRatio: "16:9" | "9:16";
  fps: number;
  resolution: string;
  easing: string;
  tags: string[];
  palette: string[];
  exportFormats: string[];
  defaultText: string;
  prompt: string;
  author: {
    name: string;
    avatar: string;
    pro: boolean;
    role?: string;
  };
  likes: number;
  views: string;
  remixes: number;
  featured?: boolean;
  renderAnimation: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    isHovered: boolean,
    customText?: string
  ) => void;
}

export default function ExplorePage() {
  const { success } = useAlert();

  // Filters and search states
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>("All");
  const [motionFormat, setMotionFormat] = useState<"vertical" | "landscape">("vertical");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<"all" | "short" | "medium" | "long">("all");
  const [fpsFilter, setFpsFilter] = useState<"all" | "60" | "30">("all");
  const [sortBy, setSortBy] = useState<"popular" | "remixes" | "recent" | "duration" | "duration-desc">("popular");
  const [layoutMode, setLayoutMode] = useState<"grid" | "cinema">("grid");
  const [marketView, setMarketView] = useState<"all" | "featured" | "saved" | "pro">("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [autoPlayAll, setAutoPlayAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Interaction states
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scrubbingId, setScrubbingId] = useState<string | null>(null);
  const [scrubProgress, setScrubProgress] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<TemplateItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<"specs" | "json">("specs");

  // Modal playback & custom text state
  const [modalPlaying, setModalPlaying] = useState(true);
  const [modalSpeed, setModalSpeed] = useState<number>(1);
  const [modalCustomText, setModalCustomText] = useState<string>("");
  const [modalTime, setModalTime] = useState<number>(0);

  // Load likes and saves from localStorage on mount
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem("animagent_explore_likes");
      if (savedLikes) setLikedIds(JSON.parse(savedLikes));
      const savedBookmarks = localStorage.getItem("animagent_explore_saves");
      if (savedBookmarks) setSavedIds(JSON.parse(savedBookmarks));
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Sync likes to localStorage
  const handleLikeToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("animagent_explore_likes", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Sync saves to localStorage
  const handleSaveToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const willSave = !savedIds[id];
    setSavedIds((prev) => {
      const updated = { ...prev, [id]: willSave };
      try {
        localStorage.setItem("animagent_explore_saves", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (willSave) {
      success("Saved to Collection", "Motion template bookmarked to your studio library.");
    }
  };

  // Update modal text when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setModalCustomText(selectedItem.defaultText);
      setModalPlaying(true);
      setModalTime(0);
    }
  }, [selectedItem]);

const exploreCategories = [
  {
    id: "all",
    label: "All Motion",
    icon: FiGrid,
    subcategories: [],
  },
  {
    id: "typography",
    label: "Typography",
    icon: FiCode,
    subcategories: [
      "Kinetic Typography",
      "Text Highlights",
      "Lower Thirds",
      "Title Cards",
      "Captions & Subtitles",
    ],
  },
  {
    id: "explainers",
    label: "Explainers",
    icon: FiLayers,
    subcategories: [
      "Diagrams",
      "Flowcharts",
      "Data Visualization",
      "Timelines",
      "Maps",
      "Code & Algorithms",
    ],
  },
  {
    id: "branding",
    label: "Branding",
    icon: FiStar,
    subcategories: [
      "Logo Reveals",
      "YouTube Intros",
      "YouTube Outros",
      "Subscribe CTA",
      "Channel Stingers",
    ],
  },
  {
    id: "transitions",
    label: "Transitions & Effects",
    icon: FiZap,
    subcategories: [
      "Glitch",
      "Zoom",
      "Blur",
      "Light Leaks",
      "Particles",
      "Camera Moves",
    ],
  },
  {
    id: "audio",
    label: "Audio Visuals",
    icon: FiPlay,
    subcategories: [
      "Waveforms",
      "Equalizers",
      "Beat Sync",
      "Podcast",
      "Music Visualizers",
    ],
  },
  {
    id: "ui",
    label: "UI & Tech",
    icon: FiSmartphone,
    subcategories: [
      "UI Motion",
      "App Screens",
      "Device Mockups",
      "HUD",
      "Cyberpunk",
    ],
  },
  {
    id: "3d",
    label: "3D & VFX",
    icon: FiMaximize2,
    subcategories: [
      "3D Objects",
      "Glass & Chrome",
      "Liquid",
      "Particle Worlds",
      "Sci-Fi",
    ],
  },
  {
    id: "social",
    label: "Social & Shorts",
    icon: FiShare2,
    subcategories: [
      "YouTube Shorts",
      "Instagram Reels",
      "TikTok",
      "9:16",
    ],
  },
] as const;

const legacyCategoryParent: Record<TemplateCategory, string> = {
  "Kinetic Typography": "typography",
  "Social & Reels (9:16)": "social",
  "3D & VFX": "3d",
  "Logo Reveals": "branding",
  "UI & Lottie": "ui",
  "HUD & Cyberpunk": "ui",
};

function getTemplateSubcategory(template: TemplateItem): string {
  const title = template.title.toLowerCase();
  const tags = template.tags.map((tag) => tag.toLowerCase()).join(" ");

  if (template.category === "Kinetic Typography") {
    if (title.includes("subtitle") || tags.includes("captions")) return "Captions & Subtitles";
    if (title.includes("swiss") || title.includes("title card")) return "Title Cards";
    if (title.includes("highlight")) return "Text Highlights";
    return "Kinetic Typography";
  }

  if (template.category === "Social & Reels (9:16)") {
    if (title.includes("podcast")) return "Podcast";
    if (title.includes("reel")) return "Instagram Reels";
    return "YouTube Shorts";
  }

  if (template.category === "Logo Reveals") {
    if (title.includes("stinger")) return "Channel Stingers";
    return "Logo Reveals";
  }

  if (template.category === "UI & Lottie") {
    if (title.includes("lottie") || tags.includes("micro-interaction")) return "UI Motion";
    if (title.includes("dynamic island")) return "Device Mockups";
    return "UI Motion";
  }

  if (template.category === "HUD & Cyberpunk") {
    if (title.includes("glitch")) return "Glitch";
    return title.includes("hud") || tags.includes("hud") ? "HUD" : "Cyberpunk";
  }

  if (template.category === "3D & VFX") {
    if (title.includes("chrome") || title.includes("liquid")) return "Liquid";
    if (title.includes("warp") || title.includes("aurora") || title.includes("spectrum")) return "Particle Worlds";
    if (title.includes("prism") || title.includes("glass")) return "Glass & Chrome";
    if (title.includes("synthwave") || title.includes("cyber")) return "Sci-Fi";
    return "3D Objects";
  }

  return template.category;
}

function getTemplateParent(template: TemplateItem): string {
  return legacyCategoryParent[template.category] ?? "all";
}

  // 18 Curated Broadcast-Grade Procedural Motion Templates
  const templates: TemplateItem[] = useMemo(
    () => [
      {
        id: "tpl-1",
        title: "Kinetic Velocity Sans",
        category: "Kinetic Typography",
        duration: "0:05",
        durationSec: 5,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        tags: ["Monospace", "RGB Split", "Cyberpunk", "Spring Damper"],
        palette: ["#38bdf8", "#ec4899", "#818cf8", "#ffffff"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "Lottie JSON", "GIF"],
        defaultText: "VELOCITY",
        prompt:
          "Heavy monospaced kinetic typography sliding across staggered axes with chromatic RGB aberration, glowing cyan grid matrix, and spring-damper easing.",
        author: { name: "Studio Mono", avatar: "SM", pro: true, role: "Design Lead" },
        likes: 2480,
        views: "34.2k",
        remixes: 842,
        featured: true,
        renderAnimation: (ctx, w, h, t, isHovered, customText) => {
          ctx.fillStyle = "#090a10";
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 36) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 36) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          const text = (customText || "VELOCITY").toUpperCase();
          const fontSize = Math.max(22, Math.min(52, Math.floor(w * 0.09)));
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const speed = isHovered ? 2.2 : 1.4;
          const offset1 = Math.sin(t * speed) * (w * 0.04);
          const offset2 = Math.cos(t * speed) * (w * 0.04);

          // Chromatic Trail Layers
          ctx.fillStyle = "rgba(56, 189, 248, 0.45)";
          ctx.fillText(text, w / 2 - offset1, h / 2 - 10);

          ctx.fillStyle = "rgba(236, 72, 153, 0.45)";
          ctx.fillText(text, w / 2 + offset2, h / 2 + 10);

          // Foreground White Typography
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 14;
          ctx.fillText(text, w / 2, h / 2);
          ctx.shadowBlur = 0;

          // Technical vector corner marks
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.strokeRect(w * 0.1, h * 0.15, 12, 12);
          ctx.strokeRect(w * 0.9 - 12, h * 0.85 - 12, 12, 12);
        },
      },
      {
        id: "tpl-2",
        title: "Viral Hook Dynamic Subtitles",
        category: "Social & Reels (9:16)",
        duration: "0:04",
        durationSec: 4,
        aspectRatio: "9:16",
        fps: 60,
        resolution: "1080×1920 (9:16 Vertical)",
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        tags: ["Reels", "TikTok", "Word Pop", "Viral Hook"],
        palette: ["#facc15", "#22d3ee", "#ffffff", "#0f172a"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "WebM"],
        defaultText: "STOP SCROLLING",
        prompt:
          "High-energy viral social media hook captions with popping bouncy word reveal, bright yellow accent stroke, and audio-reactive particle sparks.",
        author: { name: "Kai Rivera", avatar: "KR", pro: true, role: "Content Creator" },
        likes: 3120,
        views: "42.8k",
        remixes: 1120,
        featured: true,
        renderAnimation: (ctx, w, h, t, isHovered, customText) => {
          ctx.fillStyle = "#08090f";
          ctx.fillRect(0, 0, w, h);

          // Central vertical glowing flare
          const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.55);
          grad.addColorStop(0, "rgba(34, 211, 238, 0.18)");
          grad.addColorStop(1, "rgba(8, 9, 15, 0)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          const text = (customText || "STOP SCROLLING").toUpperCase();
          const words = text.split(" ");
          const speed = isHovered ? 2.5 : 1.6;
          const activeIndex = Math.floor((t * speed) % words.length);

          const fontSize = Math.max(18, Math.min(36, Math.floor(w * 0.085)));
          ctx.font = `900 ${fontSize}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Draw stacked words
          const totalH = words.length * (fontSize * 1.35);
          const startY = h / 2 - totalH / 2 + fontSize * 0.7;

          words.forEach((word, idx) => {
            const y = startY + idx * (fontSize * 1.35);
            const isHighlight = idx === activeIndex;

            if (isHighlight) {
              const bounce = Math.sin(t * 8) * 4;
              ctx.save();
              ctx.translate(w / 2, y + bounce);
              ctx.scale(1.08, 1.08);

              // Background highlight pill
              const textWidth = ctx.measureText(word).width;
              ctx.fillStyle = "#facc15";
              ctx.shadowColor = "#facc15";
              ctx.shadowBlur = 18;
              ctx.beginPath();
              ctx.roundRect(-textWidth / 2 - 12, -fontSize * 0.65, textWidth + 24, fontSize * 1.3, 8);
              ctx.fill();
              ctx.shadowBlur = 0;

              // Black text inside yellow pill
              ctx.fillStyle = "#0f172a";
              ctx.fillText(word, 0, 0);
              ctx.restore();
            } else {
              ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
              ctx.fillText(word, w / 2, y);
            }
          });

          // Floating confetti or fire spark dots
          for (let i = 0; i < 8; i++) {
            const px = (w * 0.2 + (i * 37 + t * 40) % (w * 0.6));
            const py = (h * 0.8 - ((t * 50 + i * 25) % (h * 0.4)));
            ctx.fillStyle = i % 2 === 0 ? "#facc15" : "#22d3ee";
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        },
      },
      {
        id: "tpl-3",
        title: "Isometric Prism Refraction",
        category: "3D & VFX",
        duration: "0:06",
        durationSec: 6,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        tags: ["3D Gimbal", "Frosted Glass", "Caustics", "Raymarching"],
        palette: ["#60a5fa", "#c084fc", "#38bdf8", "#ffffff"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "WebM"],
        defaultText: "REFRACTION",
        prompt:
          "Interlocking multi-faceted glass cubes rotating on a 45-degree isometric gimbal with internal caustics, dispersion lines, and core orb luminescence.",
        author: { name: "Aria Thorne", avatar: "AT", pro: true, role: "3D Artist" },
        likes: 3890,
        views: "52.8k",
        remixes: 1290,
        featured: true,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#08090e";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const baseSize = Math.min(w, h) * 0.22;
          const speed = isHovered ? 1.0 : 0.6;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * speed);

          // Outer Refractive Glass Squares
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.strokeStyle =
              i === 0
                ? "rgba(96, 165, 250, 0.75)"
                : i === 1
                ? "rgba(192, 132, 252, 0.75)"
                : i === 2
                ? "rgba(56, 189, 248, 0.75)"
                : "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = 1.8;
            const size = baseSize - i * 14;
            ctx.strokeRect(-size, -size, size * 2, size * 2);
          }

          // Central Pulsing Core
          const pulse = (Math.sin(t * (speed * 2.5)) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, 10 + pulse * 8, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#818cf8";
          ctx.shadowBlur = 24;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Crosshair lines
          ctx.strokeStyle = "rgba(255,255,255,0.15)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-baseSize * 1.5, 0);
          ctx.lineTo(baseSize * 1.5, 0);
          ctx.moveTo(0, -baseSize * 1.5);
          ctx.lineTo(0, baseSize * 1.5);
          ctx.stroke();

          ctx.restore();
        },
      },
      {
        id: "tpl-4",
        title: "Quantum Cyber Logo Reveal",
        category: "Logo Reveals",
        duration: "0:04",
        durationSec: 4,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        tags: ["Logo Reveal", "Arc Sweep", "Neon Corona", "Particle Aura"],
        palette: ["#22d3ee", "#6366f1", "#a855f7", "#ffffff"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444 (Alpha)", "Lottie JSON"],
        defaultText: "BYREEL",
        prompt:
          "Dual vector neon circular arcs rotating synchronously with glowing particle corona, high-voltage plasma flare, and central brand emblem reveal.",
        author: { name: "Kaelen Voss", avatar: "KV", pro: true, role: "Motion Designer" },
        likes: 2190,
        views: "29.4k",
        remixes: 710,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered, customText) => {
          ctx.fillStyle = "#07080c";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const radius = Math.min(w, h) * 0.26;
          const speed = isHovered ? 1.8 : 1.2;
          const sweep = (t * speed) % (Math.PI * 2);

          // Outer Neon Arc
          ctx.beginPath();
          ctx.arc(cx, cy, radius, sweep, sweep + Math.PI * 1.2);
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 3.5;
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = 18;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Inner Counter-Rotating Arc
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.72, -sweep, -sweep + Math.PI * 1.4);
          ctx.strokeStyle = "#a855f7";
          ctx.lineWidth = 2.5;
          ctx.shadowColor = "#a855f7";
          ctx.shadowBlur = 14;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Center Logo Glyph or Letter
          const label = customText ? customText.slice(0, 3).toUpperCase() : "A";
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.floor(radius * 0.55)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, cx, cy);
        },
      },
      {
        id: "tpl-5",
        title: "Molten Chrome Liquid",
        category: "3D & VFX",
        duration: "0:06",
        durationSec: 6,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K 16:9)",
        easing: "cubic-bezier(0.33, 1, 0.68, 1)",
        tags: ["Metaball", "Liquid Chrome", "Harmonic Waves", "Organic"],
        palette: ["#a855f7", "#3b82f6", "#06b6d4", "#e2e8f0"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "GIF"],
        defaultText: "NEBULA",
        prompt:
          "Undulating molten metallic liquid sphere floating in dark space with harmonic surface wave frequencies and specular chrome gradient reflections.",
        author: { name: "Julian Meyer", avatar: "JM", pro: true, role: "VFX Artist" },
        likes: 4120,
        views: "61.3k",
        remixes: 1540,
        featured: true,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#090a10";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const points = 14;
          const baseRadius = Math.min(w, h) * 0.25;
          const speed = isHovered ? 2.2 : 1.4;

          ctx.beginPath();
          for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const wave = Math.sin(angle * 3 + t * speed) * (baseRadius * 0.22);
            const r = baseRadius + wave;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();

          const grad = ctx.createLinearGradient(
            cx - baseRadius,
            cy - baseRadius,
            cx + baseRadius,
            cy + baseRadius
          );
          grad.addColorStop(0, "#c084fc");
          grad.addColorStop(0.5, "#38bdf8");
          grad.addColorStop(1, "#818cf8");

          ctx.fillStyle = grad;
          ctx.shadowColor = "#818cf8";
          ctx.shadowBlur = 28;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner metallic specular ring
          ctx.strokeStyle = "rgba(255,255,255,0.45)";
          ctx.lineWidth = 2;
          ctx.stroke();
        },
      },
      {
        id: "tpl-6",
        title: "Elastic Dynamic Island",
        category: "UI & Lottie",
        duration: "0:03",
        durationSec: 3,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "1920×1080 (FHD)",
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        tags: ["Mobile UI", "Dynamic Island", "Spring Physics", "Audio Equalizer"],
        palette: ["#10b981", "#38bdf8", "#f43f5e", "#ffffff"],
        exportFormats: ["Lottie JSON", "MP4", "ProRes 4444"],
        defaultText: "HAPTIC",
        prompt:
          "Expanding mobile UI capsule island with dual-phase liquid spring physics, animated sound wave equalizer bars, and glowing status beacon.",
        author: { name: "Elena Rostova", avatar: "ER", pro: false, role: "UI Motion" },
        likes: 1890,
        views: "24.7k",
        remixes: 620,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#08090d";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const speed = isHovered ? 2.5 : 1.6;
          const progress = (Math.sin(t * speed) + 1) * 0.5;

          const pillWidth = Math.min(w * 0.75, 140 + progress * 90);
          const pillHeight = 44;

          // Capsule Body
          ctx.beginPath();
          ctx.roundRect(
            cx - pillWidth / 2,
            cy - pillHeight / 2,
            pillWidth,
            pillHeight,
            pillHeight / 2
          );
          ctx.fillStyle = "#161822";
          ctx.strokeStyle = "rgba(255,255,255,0.15)";
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();

          // Left Green Status Beacon
          ctx.beginPath();
          ctx.arc(cx - pillWidth / 2 + 22, cy, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Animated Audio Wave Equalizer Bars
          const barCount = 5;
          const startX = cx - 10;
          for (let i = 0; i < barCount; i++) {
            const barH = 6 + Math.sin(t * (speed * 2) + i * 1.1) * 14;
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(startX + i * 8, cy - barH / 2, 3, barH);
          }

          // Right Timing Badge
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          ctx.fillText("01:42", cx + pillWidth / 2 - 16, cy);
        },
      },
      {
        id: "tpl-7",
        title: "Holographic HUD Telemetry",
        category: "HUD & Cyberpunk",
        duration: "0:06",
        durationSec: 6,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "linear",
        tags: ["HUD", "Telemetry", "Cyberpunk", "Reticle"],
        palette: ["#06b6d4", "#3b82f6", "#10b981", "#ffffff"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444 (Alpha)", "WebM"],
        defaultText: "TELEMETRY",
        prompt:
          "Futuristic sci-fi tactical HUD telemetry display with rotating concentric compass reticles, degree markers, horizon ladder, and live coordinate readout.",
        author: { name: "Vance Media", avatar: "VM", pro: true, role: "Game VFX" },
        likes: 3410,
        views: "48.9k",
        remixes: 1140,
        featured: true,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#06080d";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const r = Math.min(w, h) * 0.3;
          const speed = isHovered ? 1.5 : 0.8;

          // Outer Degree Ring
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * (speed * 0.4));

          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();

          for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * (r - 8), Math.sin(angle) * (r - 8));
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            ctx.strokeStyle = "#06b6d4";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.restore();

          // Inner Target Box
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1.5;
          const boxSize = r * 0.45;
          ctx.strokeRect(cx - boxSize, cy - boxSize, boxSize * 2, boxSize * 2);

          // Center Reticle Dot
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#10b981";
          ctx.fill();

          // Telemetry Text
          ctx.fillStyle = "#06b6d4";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "left";
          ctx.fillText(`LAT 37.77° // LOCK 60FPS`, cx - boxSize, cy + boxSize + 16);
        },
      },
      {
        id: "tpl-8",
        title: "Hyperspace Warp Stream",
        category: "3D & VFX",
        duration: "0:05",
        durationSec: 5,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "cubic-bezier(0.7, 0, 0.3, 1)",
        tags: ["Hyperspace", "Starfield", "Particle Streaks", "Sci-Fi"],
        palette: ["#818cf8", "#38bdf8", "#c084fc", "#ffffff"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "WebM"],
        defaultText: "WARP",
        prompt:
          "3D relativistic warp-speed star streaks radiating from the vanishing center with chromatic indigo-cyan trails and high-speed relativistic flare.",
        author: { name: "Studio Mono", avatar: "SM", pro: true, role: "Motion Lab" },
        likes: 2950,
        views: "39.1k",
        remixes: 960,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#05060a";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const streakCount = 42;
          const speed = isHovered ? 2.5 : 1.5;

          for (let i = 0; i < streakCount; i++) {
            const angle = (i / streakCount) * Math.PI * 2;
            const progress = ((t * speed * 0.4 + i * 0.17) % 1);
            const dist1 = progress * progress * (w * 0.55);
            const dist2 = dist1 + (15 + progress * 40);

            const x1 = cx + Math.cos(angle) * dist1;
            const y1 = cy + Math.sin(angle) * dist1;
            const x2 = cx + Math.cos(angle) * dist2;
            const y2 = cy + Math.sin(angle) * dist2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = i % 2 === 0 ? "#818cf8" : "#38bdf8";
            ctx.lineWidth = 1 + progress * 2.5;
            ctx.globalAlpha = Math.min(1, progress * 1.5);
            ctx.stroke();
          }
          ctx.globalAlpha = 1.0;

          // Core flare
          ctx.beginPath();
          ctx.arc(cx, cy, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.shadowBlur = 0;
        },
      },
      {
        id: "tpl-9",
        title: "Podcast Waveform Stinger (9:16)",
        category: "Social & Reels (9:16)",
        duration: "0:05",
        durationSec: 5,
        aspectRatio: "9:16",
        fps: 60,
        resolution: "1080×1920 (9:16 Vertical)",
        easing: "ease-in-out",
        tags: ["Podcast", "Soundwave", "Reels", "Audio Visualizer"],
        palette: ["#ec4899", "#8b5cf6", "#38bdf8", "#ffffff"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "WebM"],
        defaultText: "EPISODE 42",
        prompt:
          "Vertical social reel soundwave audiogram with dynamic frequency ribbons, episode title reveal, and pulsing ambient audio rings.",
        author: { name: "Elena Rostova", avatar: "ER", pro: true, role: "Sound & Social" },
        likes: 2430,
        views: "31.8k",
        remixes: 820,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered, customText) => {
          ctx.fillStyle = "#090a12";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h * 0.48;
          const bars = 28;
          const barW = Math.max(3, w * 0.016);
          const spacing = barW * 1.8;
          const totalW = bars * spacing;
          const startX = cx - totalW / 2;
          const speed = isHovered ? 2.5 : 1.5;

          // Soundwave bars
          for (let i = 0; i < bars; i++) {
            const hVal = Math.sin(t * speed + i * 0.4) * (h * 0.12) + Math.cos(t * 1.2 + i * 0.8) * (h * 0.05) + h * 0.03;
            const x = startX + i * spacing;
            const grad = ctx.createLinearGradient(0, cy - hVal, 0, cy + hVal);
            grad.addColorStop(0, "#ec4899");
            grad.addColorStop(1, "#38bdf8");

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, cy - Math.abs(hVal), barW, Math.abs(hVal) * 2, barW / 2);
            ctx.fill();
          }

          // Title & Episode Label
          const text = (customText || "EPISODE 42").toUpperCase();
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.floor(w * 0.075)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(text, cx, h * 0.72);

          ctx.fillStyle = "#8b5cf6";
          ctx.font = "bold 11px monospace";
          ctx.fillText("LISTEN NOW // SPOTIFY & APPLE", cx, h * 0.78);
        },
      },
      {
        id: "tpl-10",
        title: "Bioluminescent Aurora Ribbon",
        category: "3D & VFX",
        duration: "0:06",
        durationSec: 6,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "cubic-bezier(0.42, 0, 0.58, 1)",
        tags: ["Aurora", "Wave Ribbons", "Luminescence", "Gradient Waves"],
        palette: ["#06b6d4", "#8b5cf6", "#ec4899", "#3b82f6"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "GIF"],
        defaultText: "AURORA",
        prompt:
          "Harmonic undulating bioluminescent ribbon waves sweeping across canvas with violet-to-cyan gradient glows and floating ambient luminescent particles.",
        author: { name: "Julian Meyer", avatar: "JM", pro: true, role: "Visual Effects" },
        likes: 2740,
        views: "36.5k",
        remixes: 810,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#070910";
          ctx.fillRect(0, 0, w, h);

          const waveCount = 3;
          const speed = isHovered ? 1.6 : 0.9;

          for (let k = 0; k < waveCount; k++) {
            ctx.beginPath();
            ctx.moveTo(0, h * 0.5);

            for (let x = 0; x <= w; x += 12) {
              const y =
                h * 0.5 +
                Math.sin(x * 0.015 + t * speed + k * 1.5) * (h * 0.18) +
                Math.cos(x * 0.008 - t * 0.5) * (h * 0.1);
              ctx.lineTo(x, y);
            }

            ctx.strokeStyle =
              k === 0
                ? "rgba(6, 182, 212, 0.7)"
                : k === 1
                ? "rgba(139, 92, 246, 0.7)"
                : "rgba(236, 72, 153, 0.6)";
            ctx.lineWidth = 3;
            ctx.shadowColor = k === 0 ? "#06b6d4" : "#8b5cf6";
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        },
      },
      {
        id: "tpl-11",
        title: "Cyber Glitch Frame Offset",
        category: "HUD & Cyberpunk",
        duration: "0:04",
        durationSec: 4,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "steps(4, jump-end)",
        tags: ["Glitch", "Matrix", "RGB Displacement", "Horizontal Slice"],
        palette: ["#10b981", "#06b6d4", "#f43f5e", "#ffffff"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "GIF"],
        defaultText: "CORRUPT",
        prompt:
          "Horizontal frame-split scanline glitch distortion with RGB displacement channel offset, digital frame timestamp, and cyberpunk interference.",
        author: { name: "Vance Media", avatar: "VM", pro: true, role: "Motion Tech" },
        likes: 2110,
        views: "28.0k",
        remixes: 690,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered, customText) => {
          ctx.fillStyle = "#08090d";
          ctx.fillRect(0, 0, w, h);

          const sliceCount = 10;
          const sliceH = h / sliceCount;
          const speed = isHovered ? 4.0 : 2.2;

          for (let i = 0; i < sliceCount; i++) {
            const shift = Math.sin(t * speed + i * 1.2) * (w * 0.06);
            if (i % 2 === 0) {
              ctx.fillStyle = "rgba(244, 63, 94, 0.35)";
              ctx.fillRect(w * 0.2 + shift, i * sliceH, w * 0.6, sliceH - 2);
            } else {
              ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
              ctx.fillRect(w * 0.2 - shift, i * sliceH, w * 0.6, sliceH - 2);
            }
          }

          const text = (customText || "CORRUPT").toUpperCase();
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.floor(w * 0.06)}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 12;
          ctx.fillText(`// ${text} //`, w / 2, h / 2);
          ctx.shadowBlur = 0;
        },
      },
      {
        id: "tpl-12",
        title: "Lottie Elastic Check Burst",
        category: "UI & Lottie",
        duration: "0:03",
        durationSec: 3,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "1920×1080 (FHD 16:9)",
        easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        tags: ["Micro-interaction", "Lottie", "Checkmark", "Confetti Burst"],
        palette: ["#10b981", "#fbbf24", "#f43f5e", "#38bdf8"],
        exportFormats: ["Lottie JSON", "MP4", "GIF", "SVG Animated"],
        defaultText: "CONFIRMED",
        prompt:
          "Tactile micro-interaction button with elastic rubber-band spring recoil, vector checkmark path draw, and radial confetti particle burst.",
        author: { name: "Aria Thorne", avatar: "AT", pro: true, role: "UX Motion" },
        likes: 1980,
        views: "23.5k",
        remixes: 780,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#08090d";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const speed = isHovered ? 2.5 : 1.4;
          const cycle = (t * speed) % 2;

          const circleR = Math.min(w, h) * 0.24;
          ctx.beginPath();
          ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw Checkmark
          ctx.beginPath();
          ctx.moveTo(cx - circleR * 0.45, cy);
          ctx.lineTo(cx - circleR * 0.1, cy + circleR * 0.35);
          ctx.lineTo(cx + circleR * 0.45, cy - circleR * 0.3);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.stroke();

          // Confetti particles
          const particleCount = 10;
          for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const dist = circleR * (1.2 + cycle * 0.8);
            const px = cx + Math.cos(angle) * dist;
            const py = cy + Math.sin(angle) * dist;

            ctx.fillStyle =
              i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#f43f5e" : "#38bdf8";
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        },
      },
      {
        id: "tpl-13",
        title: "Swiss Architectural Title Card",
        category: "Kinetic Typography",
        duration: "0:05",
        durationSec: 5,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        tags: ["Swiss Design", "Golden Ratio", "Minimalist", "Editorial"],
        palette: ["#f43f5e", "#f8fafc", "#64748b", "#0f172a"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "Lottie JSON"],
        defaultText: "EDITION 01",
        prompt:
          "Sleek architectural Swiss layout reveal with sliding golden-ratio rectangles, crisp typography masks, and bold crimson accent blocks.",
        author: { name: "Studio Mono", avatar: "SM", pro: true, role: "Editorial" },
        likes: 1680,
        views: "21.2k",
        remixes: 510,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered, customText) => {
          ctx.fillStyle = "#0c0d13";
          ctx.fillRect(0, 0, w, h);

          const speed = isHovered ? 1.8 : 1.0;
          const slide = (Math.sin(t * speed) + 1) * 0.5;

          ctx.fillStyle = "#f43f5e";
          ctx.fillRect(w * 0.12, h * 0.22, 6, h * 0.56);

          ctx.fillStyle = "#94a3b8";
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "left";
          ctx.fillText("INTERNATIONAL TYPOGRAPHIC STYLE", w * 0.16, h * 0.3);

          const text = (customText || "ARCHITECTURAL").toUpperCase();
          ctx.fillStyle = "#ffffff";
          const titleSize = Math.max(20, Math.floor(w * 0.07));
          ctx.font = `bold ${titleSize}px sans-serif`;
          ctx.fillText(text, w * 0.16, h * 0.48);

          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(w * 0.16, h * 0.58, w * 0.68 * slide, 2);
        },
      },
      {
        id: "tpl-14",
        title: "Neon Wireframe Logo Trace",
        category: "Logo Reveals",
        duration: "0:05",
        durationSec: 5,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "1920×1080 (FHD 16:9)",
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        tags: ["Logo Stinger", "Neon Trace", "Wireframe", "Plasma Line"],
        palette: ["#22d3ee", "#a855f7", "#ffffff", "#0e0f15"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444 (Alpha)", "WebM"],
        defaultText: "NEXUS",
        prompt:
          "High-voltage neon plasma line tracing an isometric diamond hexagon shield with electric arc pulses and central brand stinger.",
        author: { name: "Kaelen Voss", avatar: "KV", pro: true, role: "Motion Designer" },
        likes: 2890,
        views: "37.1k",
        remixes: 940,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered, customText) => {
          ctx.fillStyle = "#07080d";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const r = Math.min(w, h) * 0.28;
          const speed = isHovered ? 2.0 : 1.2;
          const sides = 6;

          // Hexagon outline
          ctx.beginPath();
          for (let i = 0; i <= sides; i++) {
            const angle = (i * Math.PI * 2) / sides + t * (speed * 0.5);
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 3;
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = 18;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Center Text
          const label = (customText || "NEXUS").toUpperCase();
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.floor(r * 0.4)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, cx, cy);
        },
      },
      {
        id: "tpl-15",
        title: "Audio Reactive Spectrum Ring",
        category: "3D & VFX",
        duration: "0:06",
        durationSec: 6,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "ease-in-out",
        tags: ["Audio Visualizer", "Radial Spectrum", "Equalizer", "Rhythmic"],
        palette: ["#f43f5e", "#fb923c", "#facc15", "#38bdf8"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "WebM"],
        defaultText: "RESONANCE",
        prompt:
          "Radial 48-bar circular frequency spectrum visualizer pulsing to rhythmic harmonic bass waves with rainbow luminescence and central resonant core.",
        author: { name: "Julian Meyer", avatar: "JM", pro: true, role: "Sound & VFX" },
        likes: 3180,
        views: "44.6k",
        remixes: 1040,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#07080d";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const barCount = 48;
          const innerR = Math.min(w, h) * 0.18;
          const speed = isHovered ? 2.8 : 1.6;

          for (let i = 0; i < barCount; i++) {
            const angle = (i / barCount) * Math.PI * 2;
            const barHeight =
              Math.sin(angle * 4 + t * speed) * 18 +
              Math.cos(i * 0.8 + t * (speed * 1.5)) * 12 +
              20;

            const x1 = cx + Math.cos(angle) * innerR;
            const y1 = cy + Math.sin(angle) * innerR;
            const x2 = cx + Math.cos(angle) * (innerR + barHeight);
            const y2 = cy + Math.sin(angle) * (innerR + barHeight);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = i % 2 === 0 ? "#f43f5e" : "#38bdf8";
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }

          // Center pulsing beat orb
          const beat = (Math.sin(t * (speed * 2)) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(cx, cy, innerR * (0.4 + beat * 0.15), 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#f43f5e";
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.shadowBlur = 0;
        },
      },
      {
        id: "tpl-16",
        title: "Tactical Drone Targeting HUD",
        category: "HUD & Cyberpunk",
        duration: "0:05",
        durationSec: 5,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "linear",
        tags: ["Tactical HUD", "Drone Bounding", "Lock-on", "Cyberpunk"],
        palette: ["#10b981", "#ef4444", "#38bdf8", "#064e3b"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "WebM"],
        defaultText: "TARGET ACQUIRED",
        prompt:
          "Autonomous aerial drone target acquisition bounding box with tracking vectors, distance telemetry, laser reticle, and locked target status.",
        author: { name: "Vance Media", avatar: "VM", pro: true, role: "Game VFX" },
        likes: 2670,
        views: "35.2k",
        remixes: 890,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered, customText) => {
          ctx.fillStyle = "#05080c";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const boxSize = Math.min(w, h) * 0.22;
          const speed = isHovered ? 2.0 : 1.0;

          // Corner brackets
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2.5;
          const arm = 14;

          // Top Left
          ctx.beginPath();
          ctx.moveTo(cx - boxSize, cy - boxSize + arm);
          ctx.lineTo(cx - boxSize, cy - boxSize);
          ctx.lineTo(cx - boxSize + arm, cy - boxSize);
          ctx.stroke();

          // Top Right
          ctx.beginPath();
          ctx.moveTo(cx + boxSize - arm, cy - boxSize);
          ctx.lineTo(cx + boxSize, cy - boxSize);
          ctx.lineTo(cx + boxSize, cy - boxSize + arm);
          ctx.stroke();

          // Bottom Left
          ctx.beginPath();
          ctx.moveTo(cx - boxSize, cy + boxSize - arm);
          ctx.lineTo(cx - boxSize, cy + boxSize);
          ctx.lineTo(cx - boxSize + arm, cy + boxSize);
          ctx.stroke();

          // Bottom Right
          ctx.beginPath();
          ctx.moveTo(cx + boxSize - arm, cy + boxSize);
          ctx.lineTo(cx + boxSize, cy + boxSize);
          ctx.lineTo(cx + boxSize, cy + boxSize - arm);
          ctx.stroke();

          // Target lock text
          const statusText = (customText || "TARGET LOCKED [99.8%]").toUpperCase();
          ctx.fillStyle = "#10b981";
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(statusText, cx, cy + boxSize + 16);

          // Center crosshair
          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#ef4444";
          ctx.fill();
        },
      },
      {
        id: "tpl-17",
        title: "Retro Synthwave Grid Sunset",
        category: "3D & VFX",
        duration: "0:06",
        durationSec: 6,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "linear",
        tags: ["Synthwave", "80s Retro", "Wireframe Grid", "Neon Sun"],
        palette: ["#f43f5e", "#a855f7", "#38bdf8", "#fbbf24"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444", "WebM"],
        defaultText: "OUTRUN",
        prompt:
          "80s retro synthwave perspective wireframe terrain rolling endlessly towards a segmented neon sun with magenta-to-cyan horizon glow.",
        author: { name: "Studio Mono", avatar: "SM", pro: true, role: "Retro VFX" },
        likes: 3620,
        views: "49.1k",
        remixes: 1220,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#08060f";
          ctx.fillRect(0, 0, w, h);

          const horizonY = h * 0.55;

          // Segmented Neon Sun
          const sunR = Math.min(w, h) * 0.2;
          const sunGrad = ctx.createLinearGradient(w / 2, horizonY - sunR * 2, w / 2, horizonY);
          sunGrad.addColorStop(0, "#fbbf24");
          sunGrad.addColorStop(0.6, "#f43f5e");
          sunGrad.addColorStop(1, "#a855f7");

          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(w / 2, horizonY - 10, sunR, Math.PI, 0);
          ctx.fill();

          // Sun horizontal slice lines
          ctx.fillStyle = "#08060f";
          for (let s = 1; s <= 5; s++) {
            ctx.fillRect(w / 2 - sunR, horizonY - 10 - s * 10, sunR * 2, s * 1.5);
          }

          // Perspective Grid below horizon
          ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
          ctx.lineWidth = 1;
          const speed = isHovered ? 2.5 : 1.2;

          // Perspective converging lines
          for (let x = -w * 0.5; x <= w * 1.5; x += 36) {
            ctx.beginPath();
            ctx.moveTo(w / 2, horizonY);
            ctx.lineTo(x, h);
            ctx.stroke();
          }

          // Horizontal scrolling lines
          for (let y = horizonY; y < h; y += 12) {
            const progress = (y - horizonY) / (h - horizonY);
            const lineY = horizonY + Math.pow(progress, 2) * (h - horizonY);
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(w, lineY);
            ctx.stroke();
          }
        },
      },
      {
        id: "tpl-18",
        title: "Glassmorphism Micro-Interaction",
        category: "UI & Lottie",
        duration: "0:04",
        durationSec: 4,
        aspectRatio: "16:9",
        fps: 60,
        resolution: "1920×1080 (FHD 16:9)",
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        tags: ["Glassmorphism", "Card Tilt", "Micro-Interaction", "Specular"],
        palette: ["#38bdf8", "#818cf8", "#ffffff", "#1e293b"],
        exportFormats: ["Lottie JSON", "MP4", "ProRes 4444"],
        defaultText: "CARD HOVER",
        prompt:
          "Tactile glassmorphic credit card tilt animation with frosted surface refraction, specular edge sheen, and floating ambient glow spheres.",
        author: { name: "Elena Rostova", avatar: "ER", pro: true, role: "UI Motion" },
        likes: 2150,
        views: "27.4k",
        remixes: 730,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#080910";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const cardW = Math.min(w, h) * 0.65;
          const cardH = cardW * 0.62;
          const speed = isHovered ? 2.0 : 1.0;
          const tilt = Math.sin(t * speed) * 0.08;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);

          // Card Shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 16);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Frosted Card Surface
          const grad = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.12)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0.03)");
          ctx.fillStyle = grad;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 16);
          ctx.fill();
          ctx.stroke();

          // Chip & Specular highlight
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.beginPath();
          ctx.roundRect(-cardW * 0.35, -cardH * 0.25, 24, 18, 4);
          ctx.fill();

          ctx.restore();
        },
      },
    ],
    []
  );

  // Check URL query param ?template=... on mount for deep linking.
  useEffect(() => {
    const tplParam = new URLSearchParams(window.location.search).get("template");
    if (!tplParam) return;

    const found = templates.find((template) => template.id === tplParam);
    if (found) {
      setSelectedItem(found);
      setModalCustomText(found.defaultText);
    }
  }, [templates]);

  // Top Featured Template for the Spotlight Banner
  const featuredTemplate = useMemo(() => {
    return templates.find((t) => t.featured) || templates[0];
  }, [templates]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    templates.forEach((t) => t.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet).slice(0, 18);
  }, [templates]);

  // Filtered & Sorted Templates
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((tpl) => {
        const parentCategory = getTemplateParent(tpl);
        const subcategory = getTemplateSubcategory(tpl);

        const matchesCat =
          activeCategory === "all" || parentCategory === activeCategory;
        const matchesSubcategory =
          !activeSubcategory || subcategory === activeSubcategory;
        const matchesAspect =
          aspectRatioFilter === "All" || tpl.aspectRatio === aspectRatioFilter;
        const matchesTag =
          !selectedTag || tpl.tags.includes(selectedTag);
        const matchesView =
          marketView === "all" ||
          (marketView === "featured" && tpl.featured) ||
          (marketView === "saved" && !!savedIds[tpl.id]) ||
          (marketView === "pro" && tpl.author.pro);
        const matchesDuration =
          durationFilter === "all" ||
          (durationFilter === "short" && tpl.durationSec <= 4) ||
          (durationFilter === "medium" && tpl.durationSec > 4 && tpl.durationSec <= 6) ||
          (durationFilter === "long" && tpl.durationSec > 6);
        const matchesFps =
          fpsFilter === "all" ||
          (fpsFilter === "60" && tpl.fps === 60) ||
          (fpsFilter === "30" && tpl.fps === 30);

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          tpl.title.toLowerCase().includes(q) ||
          tpl.prompt.toLowerCase().includes(q) ||
          tpl.author.name.toLowerCase().includes(q) ||
          tpl.category.toLowerCase().includes(q) ||
          subcategory.toLowerCase().includes(q) ||
          tpl.tags.some((tag) => tag.toLowerCase().includes(q));

        return (
          matchesCat &&
          matchesSubcategory &&
          matchesAspect &&
          matchesTag &&
          matchesView &&
          matchesDuration &&
          matchesFps &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.likes - a.likes;
        if (sortBy === "remixes") return b.remixes - a.remixes;
        if (sortBy === "duration") return a.durationSec - b.durationSec;
        if (sortBy === "duration-desc") return b.durationSec - a.durationSec;
        if (sortBy === "recent") return b.id.localeCompare(a.id);
        return b.likes - a.likes;
      });
  }, [
    templates,
    activeCategory,
    activeSubcategory,
    aspectRatioFilter,
    selectedTag,
    marketView,
    durationFilter,
    fpsFilter,
    savedIds,
    searchQuery,
    sortBy,
  ]);

  // Paginated templates for display (6 per row, default first 12)
  const displayedTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory, activeSubcategory, aspectRatioFilter, durationFilter, fpsFilter, selectedTag, marketView, searchQuery, sortBy]);

  // Load more presets handler
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, filteredTemplates.length));
      setIsLoadingMore(false);
    }, 350);
  };

  const handleLoadAll = () => {
    setVisibleCount(filteredTemplates.length);
  };

  // Active non-default filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== "all") count++;
    if (activeSubcategory) count++;
    if (aspectRatioFilter !== "All") count++;
    if (durationFilter !== "all") count++;
    if (fpsFilter !== "all") count++;
    if (selectedTag) count++;
    if (marketView !== "all") count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [activeCategory, activeSubcategory, aspectRatioFilter, durationFilter, fpsFilter, selectedTag, marketView, searchQuery]);

  // Reset all filters to default
  const handleResetAllFilters = () => {
    setActiveCategory("all");
    setActiveSubcategory(null);
    setAspectRatioFilter("All");
    setDurationFilter("all");
    setFpsFilter("all");
    setSelectedTag(null);
    setMarketView("all");
    setSearchQuery("");
    setSortBy("popular");
  };

  // Hidden file input for loading external presets
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportPresetJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        success("Preset Loaded", `Loaded "${data.name || data.title || "Custom"}" preset!`);
        window.location.href = `/workspace?prompt=${encodeURIComponent(data.prompt || "")}&style=${encodeURIComponent(data.category || "")}&text=${encodeURIComponent(data.defaultText || "")}`;
      } catch {
        alert("Invalid JSON preset file format.");
      }
    };
    reader.readAsText(file);
  };

  // Surprise / Shuffle helper
  const handleShuffleRandom = () => {
    if (filteredTemplates.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredTemplates.length);
    const chosen = filteredTemplates[randomIndex];
    setSelectedItem(chosen);
    success("Surprise Pick!", `Opened "${chosen.title}" in inspector.`);
  };

  // Card Copy Prompt Helper
  const handleCopyCardPrompt = (e: React.MouseEvent, item: TemplateItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.prompt);
    setCopiedPromptId(item.id);
    success("Prompt Copied", `Copied prompt for "${item.title}".`);
    setTimeout(() => setCopiedPromptId(null), 1800);
  };

  // Card Share Helper
  const handleShareCard = (e: React.MouseEvent, item: TemplateItem) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/explore?template=${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareId(item.id);
    success("Link Copied", `Direct link copied for "${item.title}".`);
    setTimeout(() => setCopiedShareId(null), 1800);
  };

  // Copy prompt helper
  const copyPromptText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    success("Prompt Copied", "Motion prompt copied to clipboard.");
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  // Share template helper
  const shareTemplateLink = (item: TemplateItem) => {
    const shareUrl = `${window.location.origin}/explore?template=${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    success("Link Copied", `Direct link to "${item.title}" copied to clipboard.`);
    setTimeout(() => setCopiedShareLink(false), 2200);
  };

  // Export JSON preset
  const downloadJsonPreset = (item: TemplateItem) => {
    const presetData = {
      name: item.title,
      version: "2.5.0",
      generator: "byreel AI Motion Engine",
      category: item.category,
      duration: item.duration,
      durationSec: item.durationSec,
      fps: item.fps,
      resolution: item.resolution,
      easing: item.easing,
      prompt: item.prompt,
      defaultText: modalCustomText || item.defaultText,
      palette: item.palette,
      tags: item.tags,
      author: item.author,
    };

    const blob = new Blob([JSON.stringify(presetData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, "_")}_preset.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    success("Preset Exported", `${item.title} keyframe preset downloaded as JSON.`);
  };

  return (
    <div className="marketplace-shell min-h-screen flex flex-col absolute top-0 z-50 font-sans text-fg bg-surface-2 relative overflow-x-hidden selection:bg-accent-solid/30 selection:text-accent-fg transition-colors duration-200">
      {/* Interactive Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <SpiderNetBackground opacity={0.5} />
      </div>

      {/* Hero Header Section - Professional, Compact & Full-Width */}
      <section className="relative z-10 pt-24 pb-5 px-4 sm:px-6 lg:px-8 xl:px-10 border-b border-line bg-gradient-to-b from-black/[0.02] dark:from-white/[0.02] to-transparent">
        <div className="w-full max-w-[1920px] mx-auto space-y-4">
          {/* Top Bar: Navigation, Action Buttons & Theme Toggle */}
          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <BackButton fallbackUrl="/workspace" label="Back to Studio" />

            {/* Quick Action Button Cluster */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {/* Load / Import Preset JSON */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportPresetJson}
                accept=".json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-fg/[0.04] hover:bg-accent-solid/15 hover:text-accent text-fg border border-line transition-all cursor-pointer shadow-xs active:scale-95"
                title="Load a custom JSON preset from your computer"
              >
                <FiDownload className="w-3.5 h-3.5 text-accent rotate-180" />
                <span>Load Preset</span>
              </button>

              {/* Surprise Me / Random Picker */}
              <button
                type="button"
                onClick={handleShuffleRandom}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-fg/[0.04] hover:bg-accent-solid/15 hover:text-accent text-fg border border-line transition-all cursor-pointer shadow-xs active:scale-95"
                title="Randomly pick and inspect an animation preset"
              >
                <FiShuffle className="w-3.5 h-3.5 text-accent" />
                <span>Surprise Me</span>
              </button>

              {/* Auto-Play All Toggle */}
              <button
                type="button"
                onClick={() => setAutoPlayAll((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                  autoPlayAll
                    ? "bg-accent-solid text-white shadow-md shadow-accent/30"
                    : "bg-fg/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-fg border border-line"
                }`}
                title="Toggle continuous 60FPS animation for all visible cards"
              >
                {autoPlayAll ? (
                  <>
                    <FiPause className="w-3.5 h-3.5 fill-current" />
                    <span>Auto-Play ON</span>
                  </>
                ) : (
                  <>
                    <FiPlay className="w-3.5 h-3.5 fill-current" />
                    <span>Auto-Play All</span>
                  </>
                )}
              </button>

              {/* Open Studio Direct CTA */}
              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-accent-solid to-accent text-slate-950 hover:brightness-110 shadow-sm hover:shadow-accent/25 transition-all active:scale-95"
                title="Launch the byreel Motion Graphics Workspace"
              >
                <FiZap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Open Studio</span>
              </Link>

              {/* Realtime Engine Status Pill */}
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-fg/[0.04] border border-line text-fg-muted">
                <span className="w-2 h-2 rounded-full bg-accent-solid animate-pulse" />
                <span>60 FPS Engine</span>
              </span>

              <ThemeToggle />
            </div>
          </div>

          {/* Header Title & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 pt-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-solid/15 border border-accent/30 text-accent text-xs font-semibold mb-2">
                <FiZap className="w-3 h-3 fill-accent" />
                <span>Motion Preset Showcase</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-fg font-headline">
                Motion Graphics for YouTube
              </h1>
              <p className="text-xs sm:text-sm text-fg-muted mt-1 max-w-2xl font-sans">
                Find production-ready motion graphics for explainers, coding videos, documentaries, Shorts, branding and more. Preview instantly, then remix in Studio.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 text-xs font-mono text-fg-muted flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-fg/[0.04] border border-line">
                {templates.length} Presets
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-fg/[0.04] border border-line">
                {filteredTemplates.length} Showing
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-fg/[0.04] border border-line">
                4K • ProRes • Lottie
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Library Toolbar */}
      <div className="sticky top-16 sm:top-20 z-30 border-b border-line bg-canvas-subtle/95 dark:bg-surface-2/95 backdrop-blur-xl shadow-sm">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                  Explore
                </span>
                <span className="h-1 w-1 rounded-full bg-black/20 dark:bg-white/20" />
                <span className="text-[11px] font-mono text-fg-muted">
                  {filteredTemplates.length} presets
                </span>
              </div>
              <h2 className="mt-0.5 truncate text-base font-semibold text-fg">
                {activeSubcategory ||
                  exploreCategories.find((category) => category.id === activeCategory)?.label ||
                  "All Motion"}
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Mobile Category Picker */}
              <div className="lg:hidden">
                <select
                  value={activeCategory}
                  onChange={(event) => {
                    setActiveCategory(event.target.value);
                    setActiveSubcategory(null);
                  }}
                  className="h-10 w-full min-w-[180px] rounded-xl border border-black/[0.08] bg-white/80 px-3 text-xs font-medium text-slate-800 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-fg"
                >
                  {exploreCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative min-w-0 sm:w-[320px]">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search motion graphics..."
                  className="h-10 w-full rounded-xl border border-black/[0.08] bg-white/80 pl-9 pr-10 text-xs outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-fg"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-fg"
                    aria-label="Clear search"
                  >
                    <FiX className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                className="h-10 rounded-xl border border-black/[0.08] bg-white/80 px-3 text-xs font-medium text-slate-800 outline-none dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-fg"
                aria-label="Sort presets"
              >
                <option value="popular">Most popular</option>
                <option value="remixes">Most remixed</option>
                <option value="recent">Recent</option>
                <option value="duration">Shortest</option>
                <option value="duration-desc">Longest</option>
              </select>

              <button
                type="button"
                onClick={() => setShowAdvancedFilters((previous) => !previous)}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors ${
                  showAdvancedFilters || activeFilterCount > 0
                    ? "border-accent/40 bg-accent-solid/10 text-accent"
                    : "border-black/[0.08] bg-white/80 text-slate-700 hover:bg-black/[0.04] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-fg dark:hover:bg-white/[0.07]"
                }`}
              >
                <FiFilter className="h-3.5 w-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-accent-solid px-1.5 py-0.5 text-[9px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="mt-3 border-t border-black/[0.06] pt-3 dark:border-white/[0.06]">
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                    View
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "all", label: "All" },
                      { id: "featured", label: "Featured" },
                      { id: "saved", label: "Saved" },
                      { id: "pro", label: "Pro creators" },
                    ].map((view) => (
                      <button
                        key={view.id}
                        type="button"
                        onClick={() => setMarketView(view.id as typeof marketView)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                          marketView === view.id
                            ? "bg-accent-solid text-white"
                            : "bg-black/[0.04] text-slate-600 hover:bg-fg/[0.06] dark:text-fg-muted dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                    Duration
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "all", label: "Any length" },
                      { id: "short", label: "0–4s" },
                      { id: "medium", label: "4–6s" },
                      { id: "long", label: "6s+" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setDurationFilter(option.id as typeof durationFilter)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                          durationFilter === option.id
                            ? "bg-accent-solid text-white"
                            : "bg-black/[0.04] text-slate-600 hover:bg-fg/[0.06] dark:text-fg-muted dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                    Canvas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "All", label: "All" },
                      { id: "16:9", label: "16:9" },
                      { id: "9:16", label: "9:16" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAspectRatioFilter(option.id)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                          aspectRatioFilter === option.id
                            ? "bg-accent-solid text-white"
                            : "bg-black/[0.04] text-slate-600 hover:bg-fg/[0.06] dark:text-fg-muted dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 border-t border-black/[0.05] pt-3 dark:border-white/[0.05]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                    Tags
                  </span>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`rounded-full px-2 py-1 text-[10px] font-mono transition-colors ${
                        selectedTag === tag
                          ? "bg-accent-solid text-white"
                          : "bg-black/[0.035] text-slate-600 hover:bg-fg/[0.06] dark:text-fg-muted dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                    Active
                  </span>
                  {activeCategory !== "all" && (
                    <span className="rounded-full border border-accent/25 bg-accent-solid/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
                      {exploreCategories.find((item) => item.id === activeCategory)?.label}
                    </span>
                  )}
                  {activeSubcategory && (
                    <span className="rounded-full border border-accent/25 bg-accent-solid/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
                      {activeSubcategory}
                    </span>
                  )}
                  {selectedTag && (
                    <span className="rounded-full border border-accent/25 bg-accent-solid/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
                      #{selectedTag}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="ml-1 text-[10px] font-medium text-slate-500 underline hover:text-slate-950 dark:text-fg-muted dark:hover:text-white"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Motion Library */}
      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 flex-1">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Desktop Category Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
                  Categories
                </p>
                <p className="mt-1 text-sm font-semibold text-fg">
                  Find the right motion
                </p>
              </div>

              <nav className="space-y-1">
                {exploreCategories.map((category) => {
                  const Icon = category.icon;
                  const active = activeCategory === category.id;
                  const categoryCount =
                    category.id === "all"
                      ? templates.length
                      : templates.filter((template) => getTemplateParent(template) === category.id).length;

                  return (
                    <div key={category.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(category.id);
                          setActiveSubcategory(null);
                        }}
                        className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                          active
                            ? "bg-accent-solid/12 text-accent"
                            : "text-slate-700 hover:bg-black/[0.035] hover:text-slate-950 dark:text-fg-muted dark:hover:bg-white/[0.045] dark:hover:text-white"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${active ? "text-accent" : "opacity-70"}`} />
                        <span className={`min-w-0 flex-1 truncate ${active ? "font-semibold" : "font-medium"}`}>
                          {category.label}
                        </span>
                        <span className={`font-mono text-[9px] ${active ? "text-accent/80" : "text-fg-subtle"}`}>
                          {categoryCount}
                        </span>
                        {category.subcategories.length > 0 && (
                          <FiChevronRight
                            className={`h-3 w-3 shrink-0 transition-transform ${
                              active ? "rotate-90" : "opacity-40 group-hover:translate-x-0.5"
                            }`}
                          />
                        )}
                      </button>

                      {active && category.subcategories.length > 0 && (
                        <div className="ml-5 mt-1 border-l border-black/[0.07] pl-3 dark:border-white/[0.07]">
                          {category.subcategories.map((subcategory) => {
                            const subActive = activeSubcategory === subcategory;
                            const subCount = templates.filter(
                              (template) =>
                                getTemplateParent(template) === category.id &&
                                getTemplateSubcategory(template) === subcategory
                            ).length;

                            return (
                              <button
                                key={subcategory}
                                type="button"
                                onClick={() => {
                                  setActiveCategory(category.id);
                                  setActiveSubcategory(subActive ? null : subcategory);
                                }}
                                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                                  subActive
                                    ? "font-semibold text-accent"
                                    : "text-slate-500 hover:text-slate-900 dark:text-fg-muted dark:hover:text-white"
                                }`}
                              >
                                <span className="min-w-0 flex-1 truncate">{subcategory}</span>
                                {subCount > 0 && (
                                  <span className="font-mono text-[9px] opacity-45">{subCount}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="mt-6 rounded-2xl border border-black/[0.06] bg-black/[0.02] p-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-solid/10 text-accent">
                    <FiZap className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-fg">Need something custom?</p>
                    <p className="text-[10px] text-fg-muted">Generate it in Studio.</p>
                  </div>
                </div>
                <Link
                  href="/workspace"
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent-solid px-3 py-2 text-[11px] font-semibold text-white transition hover:brightness-110"
                >
                  Open Studio
                  <FiArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-28 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-fg/[0.05] border border-line flex items-center justify-center text-fg-muted">
              <FiSearch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-fg">
              No matching motion presets found
            </h3>
            <p className="text-xs text-fg-muted max-w-sm mx-auto">
              Try adjusting your search query, duration, or frame rate filter.
            </p>
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent-solid text-white text-xs font-semibold hover:brightness-110 transition-colors cursor-pointer"
            >
              <FiRotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-3 sm:gap-3.5 ${
              layoutMode === "cinema"
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5"
            }`}
          >
            {displayedTemplates.map((item) => {
              const isHovered = hoveredId === item.id;
              const isScrubbing = scrubbingId === item.id;
              const progress = scrubProgress[item.id] ?? (isHovered ? 0.5 : 0);
              const isLiked = !!likedIds[item.id];
              const isSaved = !!savedIds[item.id];
              const totalLikes = item.likes + (isLiked ? 1 : 0);

              // Scrubbing calculation on mousemove
              const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                setScrubbingId(item.id);
                setScrubProgress((prev) => ({ ...prev, [item.id]: pos }));
              };

              const handleMouseLeave = () => {
                setHoveredId(null);
                setScrubbingId(null);
              };

              const currentTime = isScrubbing
                ? (progress * item.durationSec).toFixed(1)
                : "0.0";

              const cardAspectClass =
                motionFormat === "vertical"
                  ? "aspect-[9/16]"
                  : motionFormat === "landscape"
                  ? "aspect-video"
                  : item.aspectRatio === "9:16"
                  ? "aspect-[9/16]"
                  : "aspect-video";

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl overflow-hidden bg-surface-2 border border-line hover:border-accent/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-accent/10 ${cardAspectClass} cursor-pointer select-none`}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setSelectedItem(item)}
                  onMouseMove={handleMouseMove}
                >
                  {/* Viewport Virtualized Live Canvas */}
                  <div className="w-full h-full">
                    <VirtualCardCanvas
                      renderAnimation={item.renderAnimation}
                      isHovered={isHovered}
                      scrubProgress={isScrubbing ? progress : undefined}
                      durationSec={item.durationSec}
                      customText={item.defaultText}
                      autoPlay={autoPlayAll}
                    />
                  </div>

                  {/* Top Bar Badges & Quick Action Buttons */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 transition-opacity duration-200">
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-semibold text-fg border border-white/10 flex items-center gap-1 shadow-xs">
                        <FiLayers className="w-2.5 h-2.5 text-accent" />
                        <span className="truncate max-w-[70px]">{item.category}</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-mono text-accent border border-white/10 font-bold">
                        {motionFormat === "vertical" ? "9:16" : item.aspectRatio}
                      </span>
                    </div>

                    {/* Quick Button Cluster (Always Interactive) */}
                    <div className="flex items-center gap-1 pointer-events-auto">
                      {/* Copy Prompt Button */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyCardPrompt(e, item)}
                        className="p-1.5 rounded-md bg-black/70 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/10 transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="Copy AI Prompt"
                      >
                        {copiedPromptId === item.id ? (
                          <FiCheck className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <FiCopy className="w-3 h-3" />
                        )}
                      </button>

                      {/* Share Link Button */}
                      <button
                        type="button"
                        onClick={(e) => handleShareCard(e, item)}
                        className="p-1.5 rounded-md bg-black/70 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/10 transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="Share Direct Link"
                      >
                        {copiedShareId === item.id ? (
                          <FiCheck className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <FiShare2 className="w-3 h-3" />
                        )}
                      </button>

                      {/* Save to Collection Button */}
                      <button
                        type="button"
                        onClick={(e) => handleSaveToggle(item.id, e)}
                        className="p-1.5 rounded-md bg-black/70 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/10 transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="Save to Library"
                      >
                        <FiBookmark
                          className={`w-3 h-3 ${
                            isSaved ? "fill-current text-accent" : ""
                          }`}
                        />
                      </button>

                      {/* Like Button with Counter */}
                      <button
                        type="button"
                        onClick={(e) => handleLikeToggle(item.id, e)}
                        className="inline-flex items-center gap-1 px-1.5 py-1 rounded-md bg-black/70 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/10 transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="Like Template"
                      >
                        <FiHeart
                          className={`w-3 h-3 ${
                            isLiked ? "fill-rose-500 text-rose-500" : ""
                          }`}
                        />
                        <span className="text-[9px] font-mono font-bold leading-none">
                          {totalLikes}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Horizontal Scrub Bar Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-20 pointer-events-none">
                    <div
                      className="h-full bg-gradient-to-r from-accent-solid via-accent to-accent transition-all duration-75"
                      style={{
                        width: isScrubbing ? `${progress * 100}%` : isHovered ? "100%" : "0%",
                      }}
                    />
                  </div>

                  {/* Scrubbing Timestamp Overlay Pill */}
                  {isScrubbing && (
                    <div className="absolute bottom-2.5 left-2.5 z-20 px-1.5 py-0.5 rounded bg-black/90 text-[9px] font-mono text-accent border border-accent/40 shadow-md">
                      {currentTime}s / {item.durationSec}s
                    </div>
                  )}

                  {/* Cinematic Hover Action Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/60 transition-opacity duration-200 flex flex-col justify-end p-3 z-10 ${
                      isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {/* Bottom Metadata & Multi-Button Action Bar */}
                    <div className="space-y-2 pt-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white drop-shadow-md truncate block">
                          {item.title}
                        </span>
                        <div className="flex items-center justify-between text-[10px] text-fg-muted font-mono">
                          <span>
                            {item.duration} • {item.fps}fps
                          </span>
                          {/* Palette preview dots */}
                          <div className="flex items-center gap-1">
                            {item.palette.slice(0, 3).map((color, i) => (
                              <span
                                key={i}
                                className="w-2 h-2 rounded-full border border-white/20"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Multi-Button Action Bar */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {/* Primary 1-Click Remix Button */}
                        <Link
                          href={`/workspace?prompt=${encodeURIComponent(
                            item.prompt
                          )}&style=${encodeURIComponent(
                            item.category
                          )}&text=${encodeURIComponent(item.defaultText)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-accent-solid to-accent text-slate-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                          title="Remix this template in Studio"
                        >
                          <FiZap className="w-3 h-3 fill-slate-950" />
                          <span>Remix</span>
                        </Link>

                        {/* Specs / Inspect Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="p-1.5 rounded-lg bg-black/75 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
                          title="Inspect specs & keyframes"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </button>

                        {/* Export JSON Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadJsonPreset(item);
                          }}
                          className="p-1.5 rounded-lg bg-black/75 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
                          title="Export JSON Preset"
                        >
                          <FiDownload className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Presets Control Center */}
          <div className="mt-8 pt-6 border-t border-line flex flex-col items-center justify-center gap-3">
            {/* Progress / Status Summary */}
            <div className="flex items-center gap-2 text-xs text-fg-muted font-mono">
              <span>Showing {displayedTemplates.length} of {filteredTemplates.length} presets</span>
              <div className="w-24 h-1.5 rounded-full bg-fg/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-solid to-accent transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (displayedTemplates.length / Math.max(1, filteredTemplates.length)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Load More Button Group */}
            {displayedTemplates.length < filteredTemplates.length ? (
              <div className="flex items-center gap-2.5">
                {/* Primary Load More Button */}
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-solid to-accent hover:brightness-110 text-slate-950 text-xs font-bold shadow-md shadow-accent/20 active:scale-95 transition-all cursor-pointer disabled:opacity-75"
                >
                  {isLoadingMore ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Loading Presets...</span>
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="w-4 h-4" />
                      <span>Load More Presets (+6)</span>
                    </>
                  )}
                </button>

                {/* Show All Button */}
                <button
                  type="button"
                  onClick={handleLoadAll}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-fg/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-line text-fg text-xs font-semibold transition-all cursor-pointer"
                  title="Display all remaining templates at once"
                >
                  <span>Show All ({filteredTemplates.length})</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-success border border-emerald-500/20">
                  <FiCheck className="w-3.5 h-3.5" />
                  <span>All {filteredTemplates.length} Presets Loaded</span>
                </span>

                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs text-fg-muted hover:text-fg transition-colors cursor-pointer"
                >
                  <FiArrowUp className="w-3 h-3" />
                  <span>Back to Top</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
          </section>
        </div>
      </main>

      {/* Deep Studio Inspector & Remix Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl bg-surface border border-line shadow-2xl overflow-hidden flex flex-col text-fg my-auto max-h-[92vh] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-canvas-subtle dark:bg-surface-2">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-solid to-accent text-slate-950 font-bold flex items-center justify-center shadow-md">
                  <FiZap className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-fg font-headline">
                      {selectedItem.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-solid/15 text-accent border border-accent/25">
                      {selectedItem.category}
                    </span>
                  </div>
                  <p className="text-xs text-fg-muted mt-0.5">
                    Authored by {selectedItem.author.name} • {selectedItem.views} views • {selectedItem.remixes} remixes
                  </p>
                </div>
              </div>

              {/* Action Buttons in Modal Header */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/workspace?prompt=${encodeURIComponent(
                    selectedItem.prompt
                  )}&style=${encodeURIComponent(
                    selectedItem.category
                  )}&text=${encodeURIComponent(modalCustomText || selectedItem.defaultText)}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-solid to-accent text-slate-950 text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-accent/20 active:scale-95"
                >
                  <FiZap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Remix in Studio</span>
                </Link>

                <button
                  type="button"
                  onClick={() => shareTemplateLink(selectedItem)}
                  className="p-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-fg-muted hover:text-fg transition-colors cursor-pointer"
                  title="Share template link"
                >
                  {copiedShareLink ? <FiCheck className="w-4 h-4 text-success" /> : <FiShare2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => downloadJsonPreset(selectedItem)}
                  className="px-3.5 py-2 rounded-xl bg-black/5 hover:bg-fg/10 dark:hover:bg-white/15 text-fg text-xs font-semibold border border-line-strong transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Download preset JSON"
                >
                  <FiDownload className="w-3.5 h-3.5 text-fg-muted" />
                  <span className="hidden sm:inline">JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-500 hover:text-slate-950 dark:text-fg-muted dark:hover:text-white transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split Interactive View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
              {/* Left Column: Interactive Cinematic Canvas Player */}
              <div className="lg:col-span-7 bg-surface-2 flex flex-col border-b lg:border-b-0 lg:border-r border-line">
                {/* Canvas Container with dynamic 9:16 vertical support */}
                <div
                  className={`relative w-full flex items-center justify-center overflow-hidden bg-[#0c0e0a] ${
                    selectedItem.aspectRatio === "9:16" || motionFormat === "vertical"
                      ? "aspect-[9/16] max-h-[60vh] mx-auto my-3 rounded-2xl border border-white/10 shadow-2xl"
                      : "aspect-video"
                  }`}
                >
                  <VirtualCardCanvas
                    renderAnimation={selectedItem.renderAnimation}
                    isHovered={modalPlaying}
                    customText={modalCustomText || selectedItem.defaultText}
                    playbackSpeed={modalSpeed}
                  />

                  {/* Corner Badges */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-accent border border-white/10">
                    60 FPS REAL-TIME • {selectedItem.resolution}
                  </div>
                </div>

                {/* Player Controls Toolbar */}
                <div className="p-4 bg-slate-100 dark:bg-surface-2 border-t border-line flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalPlaying(!modalPlaying)}
                      className="px-3 py-1.5 rounded-lg bg-black/5 hover:bg-fg/10 dark:hover:bg-white/20 text-fg transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                    >
                      {modalPlaying ? (
                        <>
                          <FiPause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <FiPlay className="w-3.5 h-3.5" />
                          <span>Play</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/[0.05] border border-line text-fg-muted font-mono text-[11px] shadow-xs">
                      <FiClock className="w-3 h-3 text-fg-muted" />
                      <span>{selectedItem.duration}</span>
                    </div>
                  </div>

                  {/* Playback speed toggle */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-fg-muted font-mono mr-1">
                      Speed:
                    </span>
                    {[0.5, 1, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setModalSpeed(s)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                          modalSpeed === s
                            ? "bg-accent-solid text-white"
                            : "bg-fg/[0.06] text-fg-muted hover:text-fg"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Prompt, Custom Text & Specs */}
              <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 bg-surface">
                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-line pb-3">
                  <button
                    type="button"
                    onClick={() => setModalTab("specs")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      modalTab === "specs"
                        ? "bg-accent-solid/15 text-accent border border-accent/30 font-semibold"
                        : "text-slate-500 hover:text-slate-950 dark:text-fg-muted dark:hover:text-white"
                    }`}
                  >
                    <FiSliders className="w-3.5 h-3.5" />
                    <span>Motion Specs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab("json")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      modalTab === "json"
                        ? "bg-accent-solid/15 text-accent border border-accent/30 font-semibold"
                        : "text-slate-500 hover:text-slate-950 dark:text-fg-muted dark:hover:text-white"
                    }`}
                  >
                    <FiCode className="w-3.5 h-3.5" />
                    <span>Keyframe Preset JSON</span>
                  </button>
                </div>

                {modalTab === "specs" ? (
                  <>
                    {/* Live Custom Text Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-fg-muted">
                        <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-accent">
                          Custom text
                        </span>
                        <span className="text-[10px] text-fg-subtle">
                          Live preview
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={modalCustomText}
                          onChange={(e) => setModalCustomText(e.target.value)}
                          placeholder={selectedItem.defaultText}
                          className="w-full px-3.5 py-2 rounded-xl bg-fg/[0.04] border border-line focus:border-accent text-xs text-fg placeholder-slate-400 dark:placeholder-fg-subtle focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Prompt Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-fg-muted">
                        <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-accent">
                          Motion prompt
                        </span>
                        <button
                          type="button"
                          onClick={() => copyPromptText(selectedItem.prompt)}
                          className="inline-flex items-center gap-1 text-accent hover:brightness-110 font-medium cursor-pointer"
                        >
                          {copiedPrompt ? (
                            <>
                              <FiCheck className="w-3 h-3 text-emerald-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <FiCopy className="w-3 h-3" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-fg/[0.025] border border-line text-xs font-mono text-fg leading-relaxed">
                        &quot;{selectedItem.prompt}&quot;
                      </div>
                    </div>

                    {/* Animation Technical Specs */}
                    <div className="space-y-2">
                      <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-fg-muted">
                        Animation Parameters
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-fg/[0.025] border border-line">
                          <div className="text-[10px] text-slate-500 font-mono">
                            RESOLUTION
                          </div>
                          <div className="text-fg font-semibold mt-0.5">
                            {selectedItem.resolution}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-fg/[0.025] border border-line">
                          <div className="text-[10px] text-slate-500 font-mono">
                            FRAME RATE
                          </div>
                          <div className="text-accent font-semibold mt-0.5">
                            {selectedItem.fps} FPS Continuous
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-fg/[0.025] border border-line col-span-2">
                          <div className="text-[10px] text-slate-500 font-mono">
                            EASING EQUATION
                          </div>
                          <div className="text-accent font-mono text-[11px] mt-0.5">
                            {selectedItem.easing}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color Scheme Palette Swatches */}
                    <div className="space-y-2">
                      <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-fg-muted">
                        Color Palette
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedItem.palette.map((color, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(color);
                              success("Copied Color", `Hex code ${color} copied.`);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-fg/[0.04] border border-line hover:border-line-strong text-xs font-mono text-fg transition-colors cursor-pointer"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: color }}
                            />
                            <span>{color}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Keyframe Preset JSON Code View */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-fg-muted">
                      <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-accent">
                        Preset JSON Definition
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const jsonStr = JSON.stringify(
                            {
                              id: selectedItem.id,
                              title: selectedItem.title,
                              category: selectedItem.category,
                              prompt: selectedItem.prompt,
                              fps: selectedItem.fps,
                              easing: selectedItem.easing,
                              palette: selectedItem.palette,
                              defaultText: modalCustomText || selectedItem.defaultText,
                            },
                            null,
                            2
                          );
                          navigator.clipboard.writeText(jsonStr);
                          setCopiedJson(true);
                          success("JSON Copied", "Preset configuration copied.");
                          setTimeout(() => setCopiedJson(false), 2000);
                        }}
                        className="inline-flex items-center gap-1 text-accent hover:brightness-110 font-medium cursor-pointer"
                      >
                        {copiedJson ? (
                          <>
                            <FiCheck className="w-3 h-3 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <FiCopy className="w-3 h-3" />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-xl bg-slate-900 dark:bg-black/60 border border-line text-[11px] font-mono text-fg overflow-x-auto max-h-72 leading-relaxed">
                      {JSON.stringify(
                        {
                          id: selectedItem.id,
                          title: selectedItem.title,
                          category: selectedItem.category,
                          duration: selectedItem.duration,
                          fps: selectedItem.fps,
                          resolution: selectedItem.resolution,
                          easing: selectedItem.easing,
                          palette: selectedItem.palette,
                          prompt: selectedItem.prompt,
                          defaultText: modalCustomText || selectedItem.defaultText,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}

                {/* Big Primary Remix Action */}
                <div className="pt-2">
                  <Link
                    href={`/workspace?prompt=${encodeURIComponent(
                      selectedItem.prompt
                    )}&style=${encodeURIComponent(
                      selectedItem.category
                    )}&text=${encodeURIComponent(modalCustomText || selectedItem.defaultText)}`}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-solid to-accent text-slate-950 font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-accent/20 active:scale-[0.99]"
                  >
                    <FiZap className="w-4 h-4 fill-slate-950" />
                    <span>Open &amp; Remix in byreel Studio</span>
                    <FiArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 60FPS Procedural Virtualized Canvas Subcomponent with IntersectionObserver & Timeline Scrubbing
function VirtualCardCanvas({
  renderAnimation,
  isHovered,
  scrubProgress,
  durationSec = 5,
  customText,
  playbackSpeed = 1,
  autoPlay = false,
}: {
  renderAnimation: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    isHovered: boolean,
    customText?: string
  ) => void;
  isHovered: boolean;
  scrubProgress?: number;
  durationSec?: number;
  customText?: string;
  playbackSpeed?: number;
  autoPlay?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Viewport IntersectionObserver to pause off-screen rendering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const parentWidth = canvas.parentElement?.clientWidth || 400;
    const parentHeight = canvas.parentElement?.clientHeight || 225;

    canvas.width = parentWidth * dpr;
    canvas.height = parentHeight * dpr;

    ctx.scale(dpr, dpr);

    const isRunning = autoPlay || isHovered;

    const render = () => {
      // If user is actively scrubbing, lock time to scrub progress
      if (typeof scrubProgress === "number") {
        time = scrubProgress * durationSec;
        renderAnimation(ctx, parentWidth, parentHeight, time, true, customText);
        return;
      }

      // Only run RAF loop if element is visible in viewport
      if (isVisibleRef.current) {
        time += (isRunning ? 0.024 : 0.012) * playbackSpeed;
        renderAnimation(ctx, parentWidth, parentHeight, time, isRunning, customText);
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [renderAnimation, isHovered, scrubProgress, durationSec, customText, playbackSpeed, autoPlay]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
    </div>
  );
}
