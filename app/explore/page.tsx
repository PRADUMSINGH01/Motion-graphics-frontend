"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
  FiTag,
  FiRefreshCw,
} from "react-icons/fi";
import { useAlert } from "../context/AlertContext";
import SpiderNetBackground from "../components/SpiderNetBackground";
import BackButton from "../components/BackButton";

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
  aspectRatio: "16:9" | "9:16" | "1:1";
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
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "remixes" | "recent" | "duration">("popular");
  const [layoutMode, setLayoutMode] = useState<"grid" | "cinema">("grid");

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

  // Check URL query param ?template=... on mount for deep linking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tplParam = params.get("template");
      if (tplParam) {
        const found = templates.find((t) => t.id === tplParam);
        if (found) {
          setSelectedItem(found);
          setModalCustomText(found.defaultText);
        }
      }
    }
  }, []);

  // Update modal text when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setModalCustomText(selectedItem.defaultText);
      setModalPlaying(true);
      setModalTime(0);
    }
  }, [selectedItem]);

  const categories = [
    "All",
    "Kinetic Typography",
    "Social & Reels (9:16)",
    "3D & VFX",
    "Logo Reveals",
    "UI & Lottie",
    "HUD & Cyberpunk",
  ];

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
        defaultText: "ANIMAGENT",
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
        aspectRatio: "1:1",
        fps: 60,
        resolution: "2160×2160 (1:1 Square)",
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
        aspectRatio: "1:1",
        fps: 60,
        resolution: "1920×1920 (1:1 Square)",
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
        aspectRatio: "1:1",
        fps: 60,
        resolution: "2160×2160 (1:1 Square)",
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
        aspectRatio: "1:1",
        fps: 60,
        resolution: "1920×1920 (1:1 Square)",
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

  // Top Featured Template for the Spotlight Banner
  const featuredTemplate = useMemo(() => {
    return templates.find((t) => t.featured) || templates[0];
  }, [templates]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    templates.forEach((t) => t.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet).slice(0, 8);
  }, [templates]);

  // Filtered & Sorted Templates
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((tpl) => {
        const matchesCat =
          activeCategory === "All" || tpl.category === activeCategory;
        const matchesAspect =
          aspectRatioFilter === "All" || tpl.aspectRatio === aspectRatioFilter;
        const matchesTag =
          !selectedTag || tpl.tags.includes(selectedTag);
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          tpl.title.toLowerCase().includes(q) ||
          tpl.prompt.toLowerCase().includes(q) ||
          tpl.author.name.toLowerCase().includes(q) ||
          tpl.category.toLowerCase().includes(q) ||
          tpl.tags.some((tag) => tag.toLowerCase().includes(q));

        return matchesCat && matchesAspect && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.likes - a.likes;
        if (sortBy === "remixes") return b.remixes - a.remixes;
        if (sortBy === "duration") return a.durationSec - b.durationSec;
        return b.id.localeCompare(a.id);
      });
  }, [templates, activeCategory, aspectRatioFilter, selectedTag, searchQuery, sortBy]);

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
      generator: "Animagent AI Motion Engine",
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
    <div className="min-h-screen flex flex-col font-sans text-slate-100 bg-[#090a0f] relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Interactive Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-55">
        <SpiderNetBackground opacity={0.65} />
      </div>

      {/* Hero Header Section with Dynamic Spotlight */}
      <section className="relative z-10 pt-28 pb-8 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-[#0e1017]/90 via-[#0c0d14]/70 to-transparent backdrop-blur-xs">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Navigation */}
          <div>
            <BackButton fallbackUrl="/workspace" label="Back to Studio" />
          </div>
          {/* Header Title & Metrics */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-xs font-semibold shadow-xs">
                <FiZap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>Next-Gen Motion Gallery</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
                Curated Motion Presets
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-sans">
                Explore production-grade procedural animations, kinetic typography, 9:16 vertical reels, 3D
                refractions, and UI micro-interactions. Scrub live timelines and remix directly in Studio.
              </p>
            </div>

            {/* Platform Stats Pills */}
            <div className="flex items-center gap-3 shrink-0 overflow-x-auto pb-1">
              <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                  Active Presets
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  {templates.length}+ Ready
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                  Engine
                </div>
                <div className="text-base sm:text-lg font-bold text-cyan-400">
                  60 FPS Live
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                  Export
                </div>
                <div className="text-base sm:text-lg font-bold text-indigo-400">
                  4K • ProRes • Lottie
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight Hero Banner: Featured Template of the Day */}
          {featuredTemplate && (
            <div className="relative rounded-3xl bg-gradient-to-r from-[#121420] via-[#10121b] to-[#151624] border border-cyan-500/30 p-4 sm:p-6 shadow-2xl shadow-cyan-950/40 overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                {/* Left: Interactive Live Preview */}
                <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-lg">
                  <VirtualCardCanvas
                    renderAnimation={featuredTemplate.renderAnimation}
                    isHovered={true}
                    customText={featuredTemplate.defaultText}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
                    <FiStar className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                    <span>FEATURED PRESET</span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-white border border-white/15">
                    {featuredTemplate.resolution} • {featuredTemplate.fps} FPS
                  </div>
                </div>

                {/* Right: Metadata & Instant Remix CTA */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                      {featuredTemplate.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {featuredTemplate.duration} duration
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">
                      By {featuredTemplate.author.name}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {featuredTemplate.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-2xl font-sans">
                      &quot;{featuredTemplate.prompt}&quot;
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href={`/workspace?prompt=${encodeURIComponent(
                        featuredTemplate.prompt
                      )}&style=${encodeURIComponent(
                        featuredTemplate.category
                      )}&text=${encodeURIComponent(featuredTemplate.defaultText)}`}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <FiZap className="w-4 h-4 fill-slate-950" />
                      <span>Remix in Studio</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedItem(featuredTemplate)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all flex items-center gap-2"
                    >
                      <FiMaximize2 className="w-4 h-4" />
                      <span>Inspect Keyframes &amp; Specs</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyPromptText(featuredTemplate.prompt)}
                      className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                      title="Copy Prompt"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky High-Precision Filter & Search Bar */}
      <div className="sticky top-16 sm:top-20 z-30 border-b border-white/[0.08] bg-[#0c0c11]/90 backdrop-blur-xl transition-all shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          {/* Row 1: Categories & Search Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count =
                  cat === "All"
                    ? templates.length
                    : templates.filter((t) => t.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white text-slate-950 shadow-md shadow-white/10"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Search, Sort & Layout */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              {/* Search Input */}
              <div className="relative flex items-center w-full sm:w-60">
                <FiSearch className="absolute left-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompt, tag, style..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-white/[0.04] border border-white/[0.1] hover:border-white/20 focus:border-cyan-400/50 rounded-full text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 text-slate-500 hover:text-white"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-white/[0.04] border border-white/[0.1] rounded-full text-slate-300 focus:outline-none hover:border-white/20 cursor-pointer"
              >
                <option value="popular" className="bg-[#121319] text-white">
                  Most Popular
                </option>
                <option value="remixes" className="bg-[#121319] text-white">
                  Most Remixed
                </option>
                <option value="duration" className="bg-[#121319] text-white">
                  Shortest Duration
                </option>
                <option value="recent" className="bg-[#121319] text-white">
                  Recently Added
                </option>
              </select>

              {/* Layout Switcher */}
              <div className="hidden sm:flex items-center bg-white/[0.04] p-0.5 rounded-full border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setLayoutMode("grid")}
                  className={`p-1.5 rounded-full transition-colors ${
                    layoutMode === "grid"
                      ? "bg-white text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode("cinema")}
                  className={`p-1.5 rounded-full transition-colors ${
                    layoutMode === "cinema"
                      ? "bg-white text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Cinema View"
                >
                  <FiMaximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Aspect Ratio Filters & Tag Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-1 border-t border-white/[0.05]">
            {/* Aspect Ratio Buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-mono mr-1 hidden md:inline">
                Ratio:
              </span>
              {[
                { id: "All", label: "All Ratios", icon: null },
                { id: "16:9", label: "16:9 Landscape", icon: FiTv },
                { id: "9:16", label: "9:16 Vertical (Reels)", icon: FiSmartphone },
                { id: "1:1", label: "1:1 Square", icon: FiSquare },
              ].map((item) => {
                const isActive = aspectRatioFilter === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspectRatioFilter(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/35"
                        : "text-slate-400 hover:text-white bg-white/[0.02] border border-transparent hover:border-white/10"
                    }`}
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Tag Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              <span className="text-[11px] text-slate-500 font-mono mr-1 hidden lg:inline">
                Tags:
              </span>
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors whitespace-nowrap ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950 font-bold"
                        : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
              {selectedTag && (
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="text-[10px] text-slate-500 hover:text-white underline ml-1"
                >
                  Clear Tag
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Template Showcase Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-28 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400">
              <FiSearch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              No matching motion presets found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any templates matching your current filters. Try
              clearing your search query, aspect ratio, or category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setAspectRatioFilter("All");
                setSelectedTag(null);
              }}
              className="mt-2 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              layoutMode === "cinema"
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredTemplates.map((item) => {
              const isHovered = hoveredId === item.id;
              const isScrubbing = scrubbingId === item.id;
              const progress = scrubProgress[item.id] ?? (isHovered ? 0.5 : 0);
              const isLiked = !!likedIds[item.id];
              const isSaved = !!savedIds[item.id];

              // Scrubbing calculation
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

              // Formatted scrub time code
              const currentTime = isScrubbing
                ? (progress * item.durationSec).toFixed(1)
                : "0.0";

              return (
                <div
                  key={item.id}
                  className="group flex flex-col rounded-3xl bg-[#111218]/90 border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 overflow-hidden"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Canvas Stage Container with Aspect Ratio */}
                  <div
                    className={`relative w-full overflow-hidden cursor-pointer bg-[#07080c] ${
                      item.aspectRatio === "9:16"
                        ? "aspect-[4/3] flex items-center justify-center"
                        : item.aspectRatio === "1:1"
                        ? "aspect-video flex items-center justify-center"
                        : "aspect-video"
                    }`}
                    onClick={() => setSelectedItem(item)}
                    onMouseMove={handleMouseMove}
                  >
                    {/* Viewport Virtualized Canvas */}
                    <div className="w-full h-full">
                      <VirtualCardCanvas
                        renderAnimation={item.renderAnimation}
                        isHovered={isHovered}
                        scrubProgress={isScrubbing ? progress : undefined}
                        durationSec={item.durationSec}
                        customText={item.defaultText}
                      />
                    </div>

                    {/* Top Badges: Category & Quality */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-semibold text-cyan-300 border border-white/10 flex items-center gap-1 shadow-sm">
                        <FiLayers className="w-3 h-3 text-cyan-400" />
                        <span>{item.category}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
                          {item.aspectRatio}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
                          {item.duration}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Horizontal Scrub Bar Indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50 z-20">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 transition-all duration-75"
                        style={{
                          width: isScrubbing ? `${progress * 100}%` : isHovered ? "100%" : "0%",
                        }}
                      />
                    </div>

                    {/* Scrubbing Timestamp Overlay Pill */}
                    {isScrubbing && (
                      <div className="absolute bottom-3 left-3 z-20 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-cyan-300 border border-cyan-400/30">
                        {currentTime}s / {item.durationSec}s
                      </div>
                    )}

                    {/* Hover Action Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 transition-opacity duration-200 flex flex-col justify-between p-3.5 z-10 ${
                        isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      {/* Top Right Quick Actions */}
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleSaveToggle(item.id, e)}
                          className="p-2 rounded-xl bg-black/75 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/15 transition-all active:scale-95"
                          title="Save to Collection"
                        >
                          <FiBookmark
                            className={`w-3.5 h-3.5 ${
                              isSaved ? "fill-current text-cyan-400" : ""
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleLikeToggle(item.id, e)}
                          className="p-2 rounded-xl bg-black/75 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/15 transition-all active:scale-95"
                          title="Like Template"
                        >
                          <FiHeart
                            className={`w-3.5 h-3.5 ${
                              isLiked ? "fill-rose-500 text-rose-500" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Bottom Primary Remix & Inspect CTA */}
                      <div className="flex items-end justify-between gap-2">
                        <div className="space-y-0.5 max-w-[55%]">
                          <span className="text-xs font-semibold text-white drop-shadow-md line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-300 line-clamp-1 font-mono">
                            {item.resolution}
                          </span>
                        </div>

                        {/* HIGH-CONVERSION 1-CLICK REMIX ACTION */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Link
                            href={`/workspace?prompt=${encodeURIComponent(
                              item.prompt
                            )}&style=${encodeURIComponent(
                              item.category
                            )}&text=${encodeURIComponent(item.defaultText)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
                            title="Remix this template in Studio"
                          >
                            <FiZap className="w-3.5 h-3.5 fill-slate-950" />
                            <span>Remix in Studio</span>
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="p-2 rounded-xl bg-black/75 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
                            title="Inspect specs & keyframes"
                          >
                            <FiMaximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content & Metadata Footer */}
                  <div className="p-4 flex flex-col justify-between gap-3">
                    {/* Title and Tech Tags */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => setSelectedItem(item)}
                          className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
                        >
                          {item.title}
                        </h3>

                        {/* Color Palette Dots */}
                        <div className="flex items-center gap-1 shrink-0 pt-1">
                          {item.palette.slice(0, 3).map((color, idx) => (
                            <span
                              key={idx}
                              className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                        {item.prompt}
                      </p>
                    </div>

                    {/* Footer Row: Author & Social Metrics */}
                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      {/* Author Profile */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/15 text-[10px] font-bold text-white flex items-center justify-center">
                          {item.author.avatar}
                        </div>
                        <span className="text-xs font-medium text-slate-300 hover:text-white transition-colors">
                          {item.author.name}
                        </span>
                        {item.author.pro && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                            PRO
                          </span>
                        )}
                      </div>

                      {/* Stats & Quick Actions */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                          <span className="flex items-center gap-1">
                            <FiHeart
                              className={`w-3 h-3 ${
                                isLiked ? "text-rose-500 fill-rose-500" : ""
                              }`}
                            />
                            <span>{item.likes + (isLiked ? 1 : 0)}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <FiRepeat className="w-3 h-3 text-cyan-400" />
                            <span>{item.remixes}</span>
                          </span>
                        </div>

                        {/* Inline Quick Remix Link */}
                        <Link
                          href={`/workspace?prompt=${encodeURIComponent(
                            item.prompt
                          )}&style=${encodeURIComponent(
                            item.category
                          )}&text=${encodeURIComponent(item.defaultText)}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all"
                        >
                          <FiZap className="w-3 h-3 fill-cyan-400" />
                          <span>Remix</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Deep Studio Inspector & Remix Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl bg-[#0f1016] border border-white/10 shadow-2xl overflow-hidden flex flex-col text-white my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#12141d]/90">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 text-slate-950 font-bold flex items-center justify-center shadow-md">
                  <FiZap className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                      {selectedItem.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                      {selectedItem.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                  <FiZap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Remix in Studio</span>
                </Link>

                <button
                  type="button"
                  onClick={() => shareTemplateLink(selectedItem)}
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors"
                  title="Share template link"
                >
                  {copiedShareLink ? <FiCheck className="w-4 h-4 text-emerald-400" /> : <FiShare2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => downloadJsonPreset(selectedItem)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 border border-white/15 transition-colors flex items-center gap-1.5"
                  title="Download preset JSON"
                >
                  <FiDownload className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline">JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split Interactive View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
              {/* Left Column: Interactive Cinematic Canvas Player */}
              <div className="lg:col-span-7 bg-[#07080c] flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.08]">
                {/* Canvas Container */}
                <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-radial from-slate-900 to-[#07080c]">
                  <VirtualCardCanvas
                    renderAnimation={selectedItem.renderAnimation}
                    isHovered={modalPlaying}
                    customText={modalCustomText || selectedItem.defaultText}
                    playbackSpeed={modalSpeed}
                  />

                  {/* Corner Badges */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                    60 FPS REAL-TIME • {selectedItem.resolution}
                  </div>
                </div>

                {/* Player Controls Toolbar */}
                <div className="p-4 bg-[#0a0b10] border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalPlaying(!modalPlaying)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 font-medium"
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

                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300 font-mono text-[11px]">
                      <FiClock className="w-3 h-3 text-slate-400" />
                      <span>{selectedItem.duration}</span>
                    </div>
                  </div>

                  {/* Playback speed toggle */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-400 font-mono mr-1">
                      Speed:
                    </span>
                    {[0.5, 1, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setModalSpeed(s)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                          modalSpeed === s
                            ? "bg-cyan-500 text-slate-950"
                            : "bg-white/[0.05] text-slate-400 hover:text-white"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Prompt, Custom Text & Specs */}
              <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 bg-[#0f1016]">
                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                  <button
                    type="button"
                    onClick={() => setModalTab("specs")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      modalTab === "specs"
                        ? "bg-white/10 text-cyan-300 border border-cyan-400/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FiSliders className="w-3.5 h-3.5" />
                    <span>Motion Specs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab("json")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      modalTab === "json"
                        ? "bg-white/10 text-cyan-300 border border-cyan-400/30"
                        : "text-slate-400 hover:text-white"
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
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-cyan-400">
                          Live Custom Text Playground
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Updates canvas in real-time
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={modalCustomText}
                          onChange={(e) => setModalCustomText(e.target.value)}
                          placeholder={selectedItem.defaultText}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400/50 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Prompt Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-cyan-400">
                          Generative Motion Prompt
                        </span>
                        <button
                          type="button"
                          onClick={() => copyPromptText(selectedItem.prompt)}
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          {copiedPrompt ? (
                            <>
                              <FiCheck className="w-3 h-3" />
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
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-200 leading-relaxed">
                        &quot;{selectedItem.prompt}&quot;
                      </div>
                    </div>

                    {/* Animation Technical Specs */}
                    <div className="space-y-2">
                      <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-slate-400">
                        Animation Parameters
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="text-[10px] text-slate-500 font-mono">
                            RESOLUTION
                          </div>
                          <div className="text-white font-semibold mt-0.5">
                            {selectedItem.resolution}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="text-[10px] text-slate-500 font-mono">
                            FRAME RATE
                          </div>
                          <div className="text-cyan-400 font-semibold mt-0.5">
                            {selectedItem.fps} FPS Continuous
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] col-span-2">
                          <div className="text-[10px] text-slate-500 font-mono">
                            EASING EQUATION
                          </div>
                          <div className="text-indigo-300 font-mono text-[11px] mt-0.5">
                            {selectedItem.easing}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color Scheme Palette Swatches */}
                    <div className="space-y-2">
                      <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-slate-400">
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
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-mono text-slate-300 transition-colors"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/40"
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
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-cyan-400">
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
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        {copiedJson ? (
                          <>
                            <FiCheck className="w-3 h-3" />
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

                    <pre className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
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
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 active:scale-[0.99]"
                  >
                    <FiZap className="w-4 h-4 fill-slate-950" />
                    <span>Open &amp; Remix in Animagent Studio</span>
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

    const render = () => {
      // If user is actively scrubbing, lock time to scrub progress
      if (typeof scrubProgress === "number") {
        time = scrubProgress * durationSec;
        renderAnimation(ctx, parentWidth, parentHeight, time, true, customText);
        return;
      }

      // Only run RAF loop if element is visible in viewport
      if (isVisibleRef.current) {
        time += (isHovered ? 0.025 : 0.015) * playbackSpeed;
        renderAnimation(ctx, parentWidth, parentHeight, time, isHovered, customText);
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [renderAnimation, isHovered, scrubProgress, durationSec, customText, playbackSpeed]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
    </div>
  );
}
