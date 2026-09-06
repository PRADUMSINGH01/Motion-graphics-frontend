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
  FiEye,
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
  FiActivity,
  FiStar,
  FiCode,
  FiRefreshCw,
  FiShare2,
} from "react-icons/fi";
import { useAlert } from "../context/AlertContext";
import SpiderNetBackground from "../components/SpiderNetBackground";

export type TemplateCategory =
  | "Kinetic Typography"
  | "3D Animation"
  | "Logo Reveals"
  | "Abstract & VFX"
  | "UI & Lottie"
  | "HUD & Cyberpunk";

export interface TemplateItem {
  id: string;
  title: string;
  category: TemplateCategory;
  duration: string;
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
    isHovered: boolean
  ) => void;
}

export default function ExplorePage() {
  const { success } = useAlert();

  // Filters and search states
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "remixes" | "recent" | "duration">("popular");
  const [layoutMode, setLayoutMode] = useState<"grid" | "cinema">("grid");

  // Interaction states
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<TemplateItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [modalTab, setModalTab] = useState<"specs" | "json">("specs");

  // Modal playback control state
  const [modalPlaying, setModalPlaying] = useState(true);
  const [modalSpeed, setModalSpeed] = useState<number>(1);

  const categories = [
    "All",
    "Kinetic Typography",
    "3D Animation",
    "Logo Reveals",
    "Abstract & VFX",
    "UI & Lottie",
    "HUD & Cyberpunk",
  ];

  // 12 Curated Production-Grade Procedural Motion Templates
  const templates: TemplateItem[] = useMemo(
    () => [
      {
        id: "tpl-1",
        title: "Kinetic Velocity Sans",
        category: "Kinetic Typography",
        duration: "0:05",
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
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#0a0b10";
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
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

          // Animated text layers
          const text = "VELOCITY";
          const fontSize = Math.max(26, Math.min(48, Math.floor(w * 0.09)));
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const speed = isHovered ? 2.2 : 1.4;
          const offset1 = Math.sin(t * speed) * (w * 0.05);
          const offset2 = Math.cos(t * speed) * (w * 0.05);

          // Chromatic Trail Layers
          ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
          ctx.fillText(text, w / 2 - offset1, h / 2 - 12);

          ctx.fillStyle = "rgba(236, 72, 153, 0.4)";
          ctx.fillText(text, w / 2 + offset2, h / 2 + 12);

          // Foreground White Typography
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 12;
          ctx.fillText(text, w / 2, h / 2);
          ctx.shadowBlur = 0;

          // Technical vector corner marks
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.strokeRect(w * 0.15, h * 0.2, 14, 14);
          ctx.strokeRect(w * 0.85 - 14, h * 0.8 - 14, 14, 14);
        },
      },
      {
        id: "tpl-2",
        title: "Isometric Prism Refraction",
        category: "3D Animation",
        duration: "0:06",
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
                ? "rgba(96, 165, 250, 0.7)"
                : i === 1
                ? "rgba(192, 132, 252, 0.7)"
                : i === 2
                ? "rgba(56, 189, 248, 0.7)"
                : "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = 1.6;
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
        id: "tpl-3",
        title: "Quantum Cyber Logo Reveal",
        category: "Logo Reveals",
        duration: "0:04",
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        tags: ["Logo Reveal", "Arc Sweep", "Neon Corona", "Particle Aura"],
        palette: ["#22d3ee", "#6366f1", "#a855f7", "#ffffff"],
        exportFormats: ["MP4 (H.264)", "ProRes 4444 (Alpha)", "Lottie JSON"],
        defaultText: "ORBITAL",
        prompt:
          "Dual vector neon circular arcs rotating synchronously with glowing particle corona, high-voltage plasma flare, and central brand emblem reveal.",
        author: { name: "Kaelen Voss", avatar: "KV", pro: true, role: "Motion Designer" },
        likes: 2190,
        views: "29.4k",
        remixes: 710,
        featured: false,
        renderAnimation: (ctx, w, h, t, isHovered) => {
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

          // Sparks orbiting
          for (let s = 0; s < 6; s++) {
            const angle = sweep + (s * Math.PI) / 3;
            const dist = radius + Math.sin(t * 3 + s) * 10;
            const sx = cx + Math.cos(angle) * dist;
            const sy = cy + Math.sin(angle) * dist;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(sx, sy, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Center Logo Glyph
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.floor(radius * 0.55)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("M", cx, cy);
        },
      },
      {
        id: "tpl-4",
        title: "Molten Chrome Liquid",
        category: "Abstract & VFX",
        duration: "0:06",
        aspectRatio: "16:9",
        fps: 60,
        resolution: "3840×2160 (4K UHD)",
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
          const points = 12;
          const baseRadius = Math.min(w, h) * 0.24;
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

          // Inner metallic highlights
          ctx.strokeStyle = "rgba(255,255,255,0.45)";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Liquid ripple rings
          const ripple = (t * 0.8) % 1;
          ctx.beginPath();
          ctx.arc(cx, cy, baseRadius * (1.1 + ripple * 0.5), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * (1 - ripple)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        },
      },
      {
        id: "tpl-5",
        title: "Elastic Dynamic Island",
        category: "UI & Lottie",
        duration: "0:03",
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
        id: "tpl-6",
        title: "Holographic HUD Telemetry",
        category: "HUD & Cyberpunk",
        duration: "0:06",
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

          // 12 Degree Ticks
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
          ctx.fillText(`LAT 37.77° // ALT 4,200M`, cx - boxSize, cy + boxSize + 16);
          ctx.fillText(`SYS: LOCKED [60FPS]`, cx - boxSize, cy - boxSize - 8);
        },
      },
      {
        id: "tpl-7",
        title: "Hyperspace Warp Stream",
        category: "Abstract & VFX",
        duration: "0:05",
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
        id: "tpl-8",
        title: "Bioluminescent Aurora Ribbon",
        category: "Abstract & VFX",
        duration: "0:06",
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
        author: { name: "Elena Rostova", avatar: "ER", pro: false, role: "Visual Effects" },
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

          // Floating Spore Dust
          for (let p = 0; p < 10; p++) {
            const px = ((p * 45 + t * 20) % w);
            const py = (h * 0.3 + Math.sin(t + p) * (h * 0.25));
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        },
      },
      {
        id: "tpl-9",
        title: "Cyber Glitch Frame Offset",
        category: "Kinetic Typography",
        duration: "0:04",
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
        renderAnimation: (ctx, w, h, t, isHovered) => {
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

          // Center Monospace Typography
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.floor(w * 0.05)}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 12;
          ctx.fillText("// GLITCH_FRAME //", w / 2, h / 2);
          ctx.shadowBlur = 0;

          // Scanline bars
          ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
          ctx.lineWidth = 1;
          for (let y = 0; y < h; y += 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }
        },
      },
      {
        id: "tpl-10",
        title: "Lottie Elastic Check Burst",
        category: "UI & Lottie",
        duration: "0:03",
        aspectRatio: "16:9",
        fps: 60,
        resolution: "1920×1080 (FHD)",
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

          // Main circle spring
          const circleR = Math.min(w, h) * 0.22;
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

          // Confetti particles exploding radially
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
        id: "tpl-11",
        title: "Swiss Architectural Title Card",
        category: "Kinetic Typography",
        duration: "0:05",
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
        renderAnimation: (ctx, w, h, t, isHovered) => {
          ctx.fillStyle = "#0c0d13";
          ctx.fillRect(0, 0, w, h);

          const speed = isHovered ? 1.8 : 1.0;
          const slide = (Math.sin(t * speed) + 1) * 0.5;

          // Crimson Architectural Block
          ctx.fillStyle = "#f43f5e";
          ctx.fillRect(w * 0.12, h * 0.22, 6, h * 0.56);

          // Top Subtitle
          ctx.fillStyle = "#94a3b8";
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "left";
          ctx.fillText("INTERNATIONAL TYPOGRAPHIC STYLE", w * 0.16, h * 0.3);

          // Bold Title
          ctx.fillStyle = "#ffffff";
          const titleSize = Math.max(22, Math.floor(w * 0.075));
          ctx.font = `bold ${titleSize}px sans-serif`;
          ctx.fillText("ARCHITECTURAL", w * 0.16, h * 0.48);

          // Moving bottom accent bar
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(w * 0.16, h * 0.58, w * 0.68 * slide, 2);

          // Bottom Metric
          ctx.fillStyle = "#64748b";
          ctx.font = "9px monospace";
          ctx.fillText("SCALE: 1:1.618 // GRID-LOCKED", w * 0.16, h * 0.68);
        },
      },
      {
        id: "tpl-12",
        title: "Audio Reactive Spectrum Ring",
        category: "Abstract & VFX",
        duration: "0:06",
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
        featured: true,
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
    ],
    []
  );

  // Filtered & Sorted Templates
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((tpl) => {
        const matchesCat =
          activeCategory === "All" || tpl.category === activeCategory;
        const matchesAspect =
          aspectRatioFilter === "All" || tpl.aspectRatio === aspectRatioFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          tpl.title.toLowerCase().includes(q) ||
          tpl.prompt.toLowerCase().includes(q) ||
          tpl.author.name.toLowerCase().includes(q) ||
          tpl.category.toLowerCase().includes(q) ||
          tpl.tags.some((tag) => tag.toLowerCase().includes(q));

        return matchesCat && matchesAspect && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.likes - a.likes;
        if (sortBy === "remixes") return b.remixes - a.remixes;
        if (sortBy === "duration") return a.duration.localeCompare(b.duration);
        return b.id.localeCompare(a.id);
      });
  }, [templates, activeCategory, aspectRatioFilter, searchQuery, sortBy]);

  // Social & Bookmark Actions
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const willSave = !savedIds[id];
    setSavedIds((prev) => ({ ...prev, [id]: willSave }));
    if (willSave) {
      success("Template Saved", "Added to your personal collection in Animagent Studio.");
    }
  };

  const copyPromptText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    success("Prompt Copied", "Motion prompt copied to clipboard.");
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const downloadJsonPreset = (item: TemplateItem) => {
    const presetData = {
      name: item.title,
      version: "2.0.0",
      generator: "Animagent AI Motion Engine",
      category: item.category,
      duration: item.duration,
      fps: item.fps,
      resolution: item.resolution,
      easing: item.easing,
      prompt: item.prompt,
      defaultText: item.defaultText,
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
      {/* Background Interactive Spider Net */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
        <SpiderNetBackground opacity={0.65} />
      </div>

      {/* Hero Header Section */}
      <section className="relative z-10 pt-28 pb-8 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-[#0e1017]/80 to-transparent backdrop-blur-xs">
        <div className="max-w-7xl mx-auto">
          {/* Badge & Title */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-xs font-semibold">
                <FiStar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Motion Preset Showcase</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
                Curated Motion Templates
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-sans">
                Explore production-grade procedural animations, kinetic typography, 3D
                refractions, and UI micro-interactions. Inspect code specs and remix
                instantly in Studio with 1-click.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 overflow-x-auto pb-1">
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Templates
                </div>
                <div className="text-base sm:text-lg font-bold text-white">
                  12+ Active
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Engine
                </div>
                <div className="text-base sm:text-lg font-bold text-cyan-400">
                  60 FPS Live
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Format
                </div>
                <div className="text-base sm:text-lg font-bold text-indigo-400">
                  4K &amp; ProRes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky High-Precision Filter & Search Bar */}
      <div className="sticky top-16 sm:top-20 z-30 border-b border-white/[0.08] bg-[#0c0c11]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          {/* Row 1: Categories & Search Bar */}
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

            {/* Search Input & Sort Selector */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex items-center w-full sm:w-64">
                <FiSearch className="absolute left-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompt, style, tag..."
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
                  Most Remixes
                </option>
                <option value="recent" className="bg-[#121319] text-white">
                  Recently Added
                </option>
                <option value="duration" className="bg-[#121319] text-white">
                  Shortest Duration
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
              No matching motion templates
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any templates matching &quot;{searchQuery}&quot;. Try
              adjusting your search keyword or active category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setAspectRatioFilter("All");
              }}
              className="mt-2 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
            >
              Reset Filters
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
              const isLiked = !!likedIds[item.id];
              const isSaved = !!savedIds[item.id];

              return (
                <div
                  key={item.id}
                  className="group flex flex-col rounded-2xl bg-[#111218]/90 border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-500/5 overflow-hidden"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Canvas Animation Stage Container */}
                  <div
                    className="relative w-full aspect-video bg-[#07080c] overflow-hidden cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Live Rendering Canvas */}
                    <CardCanvas
                      renderAnimation={item.renderAnimation}
                      isHovered={isHovered}
                    />

                    {/* Top Badges: Category & Quality */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-semibold text-cyan-300 border border-white/10 flex items-center gap-1 shadow-sm">
                        <FiLayers className="w-3 h-3 text-cyan-400" />
                        <span>{item.category}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
                          {item.fps} FPS
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
                          {item.duration}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Scrubber Indicator on Hover */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-white/15 transition-opacity duration-200 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 w-full animate-pulse" />
                    </div>

                    {/* Professional Hover Overlay Action Bar */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 transition-opacity duration-200 flex flex-col justify-between p-3.5 ${
                        isHovered
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      {/* Top Right Quick Actions */}
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => toggleSave(item.id, e)}
                          className="p-2 rounded-xl bg-black/70 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/15 transition-all active:scale-95"
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
                          onClick={(e) => toggleLike(item.id, e)}
                          className="p-2 rounded-xl bg-black/70 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/15 transition-all active:scale-95"
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
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
                            className="p-2 rounded-xl bg-black/70 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
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

                        {/* Inline Remix Link */}
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

      {/* High-End Studio Template Inspector Modal */}
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
            <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#12141d]/80">
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
                  )}&text=${encodeURIComponent(selectedItem.defaultText)}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                  <FiZap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Remix in Studio</span>
                </Link>

                <button
                  type="button"
                  onClick={() => downloadJsonPreset(selectedItem)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 border border-white/15 transition-colors flex items-center gap-1.5"
                  title="Download preset file"
                >
                  <FiDownload className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline">Download JSON</span>
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
                  <CardCanvas
                    renderAnimation={selectedItem.renderAnimation}
                    isHovered={modalPlaying}
                  />

                  {/* Corner Badges */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-white/10">
                    60 FPS REAL-TIME
                  </div>
                </div>

                {/* Player Toolbar */}
                <div className="p-4 bg-[#0a0b10] border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalPlaying(!modalPlaying)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 font-medium"
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

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300 font-mono text-[11px]">
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

              {/* Right Column: Prompt, Keyframes & Specs */}
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
                      <div className="flex items-center gap-2">
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

                    {/* Compatible Export Targets */}
                    <div className="space-y-2">
                      <span className="font-semibold uppercase tracking-wider font-mono text-[10px] text-slate-400">
                        Supported Export Targets
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.exportFormats.map((fmt, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/[0.05] border border-white/10 text-slate-300"
                          >
                            {fmt}
                          </span>
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
                          defaultText: selectedItem.defaultText,
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
                    )}&text=${encodeURIComponent(selectedItem.defaultText)}`}
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

// 60FPS Procedural Canvas Subcomponent with High-DPI scaling
function CardCanvas({
  renderAnimation,
  isHovered,
}: {
  renderAnimation: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    isHovered: boolean
  ) => void;
  isHovered: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      time += isHovered ? 0.03 : 0.015;
      renderAnimation(ctx, parentWidth, parentHeight, time, isHovered);
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [renderAnimation, isHovered]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover" />;
}
