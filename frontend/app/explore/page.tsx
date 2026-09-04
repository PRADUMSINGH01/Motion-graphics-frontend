"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiPlay,
  FiHeart,
  FiBookmark,
  FiX,
  FiEye,
  FiArrowRight,
  FiDownload,
  FiRepeat,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { useAlert } from "../context/AlertContext";

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  prompt: string;
  author: {
    name: string;
    avatar: string;
    pro?: boolean;
  };
  likes: number;
  views: string;
  aspectRatio: "16/9" | "4/3";
  renderAnimation: (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void;
}

export default function ExplorePage() {
  const { success } = useAlert();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "recent">("popular");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const categories = [
    "All",
    "3D Animation",
    "Kinetic Typography",
    "UI & Lottie",
    "Logo Reveals",
    "Abstract & VFX",
  ];

  // Motion Graphics Items with procedural canvas rendering
  const items: ShowcaseItem[] = useMemo(
    () => [
      {
        id: "item-1",
        title: "Kinetic Velocity Sans",
        category: "Kinetic Typography",
        duration: "0:04",
        prompt:
          "Heavy monospaced kinetic typography sliding across triple staggered axes with glowing cyan edges and spring easing.",
        author: { name: "Studio Mono", avatar: "SM", pro: true },
        likes: 1420,
        views: "18.4k",
        aspectRatio: "16/9",
        renderAnimation: (ctx, w, h, t) => {
          ctx.fillStyle = "#0c0d12";
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = "rgba(255,255,255,0.04)";
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }

          // Animated text layers
          const text = "VELOCITY";
          ctx.font = "bold 38px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const offset1 = Math.sin(t * 1.5) * 30;
          const offset2 = Math.cos(t * 1.5) * 30;

          // Trail layer
          ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
          ctx.fillText(text, w / 2 - offset1, h / 2 - 15);

          ctx.fillStyle = "rgba(236, 72, 153, 0.25)";
          ctx.fillText(text, w / 2 + offset2, h / 2 + 15);

          // Front layer
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, w / 2, h / 2);
        },
      },
      {
        id: "item-2",
        title: "Isometric Refraction Cube",
        category: "3D Animation",
        duration: "0:06",
        prompt:
          "Interlocking glass polygon planes rotating on a 45-degree isometric gimbal with internal caustics.",
        author: { name: "Aria Thorne", avatar: "AT", pro: true },
        likes: 2890,
        views: "32.1k",
        aspectRatio: "16/9",
        renderAnimation: (ctx, w, h, t) => {
          ctx.fillStyle = "#0a0b0e";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const size = 55;

          // Wireframe rotation
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * 0.6);

          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.strokeStyle = i === 0 ? "#60a5fa" : i === 1 ? "#c084fc" : "#38bdf8";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-size + i * 12, -size + i * 12, size * 2 - i * 24, size * 2 - i * 24);
          }

          // Glowing center orb
          const pulse = (Math.sin(t * 2) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, 10 + pulse * 6, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#818cf8";
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.restore();
        },
      },
      {
        id: "item-3",
        title: "Elastic Haptic Island",
        category: "UI & Lottie",
        duration: "0:02",
        prompt:
          "Mobile navigation pill with dual-phase liquid spring physics and harmonic oscillation on press.",
        author: { name: "Elena Rostova", avatar: "ER" },
        likes: 980,
        views: "12.6k",
        aspectRatio: "16/9",
        renderAnimation: (ctx, w, h, t) => {
          ctx.fillStyle = "#0c0d12";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const progress = (Math.sin(t * 2) + 1) * 0.5;
          const pillWidth = 120 + progress * 60;
          const pillHeight = 36;

          // Floating capsule
          ctx.beginPath();
          ctx.roundRect(cx - pillWidth / 2, cy - pillHeight / 2, pillWidth, pillHeight, 18);
          ctx.fillStyle = "#1e222d";
          ctx.strokeStyle = "rgba(255,255,255,0.12)";
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();

          // Status indicator
          ctx.beginPath();
          ctx.arc(cx - pillWidth / 2 + 18, cy, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#10b981";
          ctx.fill();

          // Simulated wave dots
          for (let i = 0; i < 4; i++) {
            const dotH = 4 + Math.sin(t * 4 + i) * 6;
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fillRect(cx + 10 + i * 8, cy - dotH / 2, 2.5, dotH);
          }
        },
      },
      {
        id: "item-4",
        title: "Chromatic Glitch Transition",
        category: "Abstract & VFX",
        duration: "0:03",
        prompt:
          "Horizontal frame-split transition with analog scanline distortion and RGB channel offset.",
        author: { name: "Vance Media", avatar: "VM", pro: true },
        likes: 1840,
        views: "21.9k",
        aspectRatio: "16/9",
        renderAnimation: (ctx, w, h, t) => {
          ctx.fillStyle = "#090a0d";
          ctx.fillRect(0, 0, w, h);

          // Dynamic slicing bars
          const count = 12;
          const barHeight = h / count;

          for (let i = 0; i < count; i++) {
            const shift = Math.sin(t * 3 + i * 0.8) * 35;
            if (i % 2 === 0) {
              ctx.fillStyle = "rgba(244, 63, 94, 0.4)";
              ctx.fillRect(w * 0.2 + shift, i * barHeight, w * 0.6, barHeight - 2);
            } else {
              ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
              ctx.fillRect(w * 0.2 - shift, i * barHeight, w * 0.6, barHeight - 2);
            }
          }

          // Center badge
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px monospace";
          ctx.textAlign = "center";
          ctx.fillText("// GLITCH FRAME //", w / 2, h / 2);
        },
      },
      {
        id: "item-5",
        title: "Liquid Sphere Caustic Loop",
        category: "Abstract & VFX",
        duration: "0:05",
        prompt:
          "Undulating molten metallic liquid sphere floating against dark void with caustic reflections.",
        author: { name: "Julian Meyer", avatar: "JM", pro: true },
        likes: 3120,
        views: "44.2k",
        aspectRatio: "16/9",
        renderAnimation: (ctx, w, h, t) => {
          ctx.fillStyle = "#0c0d12";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const points = 8;
          const baseRadius = 48;

          ctx.beginPath();
          for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const wave = Math.sin(angle * 3 + t * 2) * 12;
            const r = baseRadius + wave;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();

          const grad = ctx.createLinearGradient(cx - 50, cy - 50, cx + 50, cy + 50);
          grad.addColorStop(0, "#a855f7");
          grad.addColorStop(1, "#3b82f6");
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        },
      },
      {
        id: "item-6",
        title: "Monogram Minimalist Emblem",
        category: "Logo Reveals",
        duration: "0:04",
        prompt:
          "Geometric circular arc sweeps tracing out a modern brand emblem with crisp neon cyan accents.",
        author: { name: "Kaelen V.", avatar: "KV" },
        likes: 1670,
        views: "19.5k",
        aspectRatio: "16/9",
        renderAnimation: (ctx, w, h, t) => {
          ctx.fillStyle = "#0a0b0e";
          ctx.fillRect(0, 0, w, h);

          const cx = w / 2;
          const cy = h / 2;
          const sweep = (t * 1.2) % (Math.PI * 2);

          // Arch arcs
          ctx.beginPath();
          ctx.arc(cx, cy, 40, 0, sweep);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy, 26, Math.PI, Math.PI + sweep);
          ctx.strokeStyle = "rgba(99, 102, 241, 0.8)";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("M", cx, cy);
        },
      },
    ],
    []
  );

  // Filtered list
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory =
          activeCategory === "All" || item.category === activeCategory;
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "recent") return b.id.localeCompare(a.id);
        return b.likes - a.likes;
      });
  }, [items, activeCategory, searchQuery, sortBy]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const willSave = !savedIds[id];
    setSavedIds((prev) => ({ ...prev, [id]: willSave }));
    if (willSave) {
      success(
        "Bookmarked Animation",
        "Saved to your personal studio collection."
      );
    }
  };

  const copyPromptText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    success(
      "Prompt Copied",
      "Motion prompt copied to clipboard. Ready to paste in Studio."
    );
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-poppins text-slate-100 bg-[#090a0f]"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, rgba(56, 189, 248, 0.04) 0%, #090a0f 70%)",
      }}
    >
      {/* Clean Studio Sub-Header Filter Bar */}
      <div className="border-b border-white/[0.06] bg-[#090a0f]/90 backdrop-blur-md sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Pills (Clean Minimalist Design) */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-slate-900 font-semibold shadow-xs"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center">
                <FiSearch className="absolute left-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search work..."
                  className="w-48 sm:w-60 pl-8 pr-7 py-1.5 text-xs bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-white/30 rounded-full text-white placeholder-slate-500 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 text-slate-500 hover:text-white"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-full text-slate-300 focus:outline-none hover:border-white/20 cursor-pointer"
              >
                <option value="popular" className="bg-[#121319] text-white">
                  Popular
                </option>
                <option value="recent" className="bg-[#121319] text-white">
                  Recent
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 text-slate-500 text-sm">
            No motion graphics found. Try a different keyword or category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredItems.map((item) => {
              const isHovered = hoveredId === item.id;
              const isLiked = !!likedIds[item.id];
              const isSaved = !!savedIds[item.id];

              return (
                <div
                  key={item.id}
                  className="group flex flex-col cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Video / Canvas Card Stage */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0c0d12] border border-white/[0.08] group-hover:border-white/[0.18] transition-all duration-300 shadow-sm">
                    {/* Live Rendering Canvas */}
                    <CardCanvas
                      renderAnimation={item.renderAnimation}
                      isHovered={isHovered}
                    />

                    {/* Duration badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none">
                      {item.duration}
                    </div>

                    {/* Dribbble-style Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 transition-opacity duration-200 flex flex-col justify-between p-3.5 ${
                        isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      {/* Top Action Icons */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-white/90 drop-shadow-sm">
                          {item.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => toggleSave(item.id, e)}
                            className="p-2 rounded-full bg-black/60 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md transition-colors"
                            title="Save to Collection"
                          >
                            <FiBookmark
                              className={`w-3.5 h-3.5 ${
                                isSaved ? "fill-current text-white" : ""
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleLike(item.id, e)}
                            className="p-2 rounded-full bg-black/60 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md transition-colors"
                            title="Like"
                          >
                            <FiHeart
                              className={`w-3.5 h-3.5 ${
                                isLiked ? "fill-rose-500 text-rose-500" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Title & Dedicated REUSE Button */}
                      <div className="flex items-end justify-between gap-2">
                        <span className="text-sm font-semibold text-white drop-shadow-md line-clamp-1">
                          {item.title}
                        </span>

                        {/* REUSE BUTTON ON HOVER */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/?prompt=${encodeURIComponent(item.prompt)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs shadow-md transition-all active:scale-[0.98]"
                            title="Reuse this motion template in Studio"
                          >
                            <FiRepeat className="w-3.5 h-3.5 text-slate-950" />
                            <span>Reuse</span>
                          </Link>

                          <span className="p-2 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md">
                            <FiPlay className="w-3.5 h-3.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean Footer Info (Author, Title, Dedicated REUSE Button, Stats) */}
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    {/* Author profile */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-white flex items-center justify-center">
                        {item.author.avatar}
                      </div>
                      <span className="font-medium text-slate-200 hover:text-white transition-colors">
                        {item.author.name}
                      </span>
                      {item.author.pro && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-white/10 text-slate-300">
                          PRO
                        </span>
                      )}
                    </div>

                    {/* Actions & Stats Row */}
                    <div className="flex items-center gap-3">
                      {/* INLINE REUSE BUTTON */}
                      <Link
                        href={`/?prompt=${encodeURIComponent(item.prompt)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors"
                        title="Reuse motion template"
                      >
                        <FiRepeat className="w-3 h-3 text-cyan-400" />
                        <span>Reuse</span>
                      </Link>

                      {/* Stats */}
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
                        <span className="flex items-center gap-1">
                          <FiHeart
                            className={`w-3 h-3 ${
                              isLiked ? "text-rose-500 fill-rose-500" : ""
                            }`}
                          />
                          <span>{item.likes + (isLiked ? 1 : 0)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <FiEye className="w-3 h-3" />
                          <span>{item.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Clean Fullscreen Video / Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-[#111218] border border-white/10 overflow-hidden shadow-2xl flex flex-col text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center justify-center">
                  {selectedItem.author.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {selectedItem.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    By {selectedItem.author.name} • {selectedItem.category}
                  </p>
                </div>
              </div>

              {/* REUSE AND DOWNLOAD BUTTONS IN MODAL */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/?prompt=${encodeURIComponent(selectedItem.prompt)}`}
                  className="px-4 py-2 rounded-xl bg-white text-slate-950 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <FiRepeat className="w-3.5 h-3.5 text-slate-950" />
                  <span>Reuse Template</span>
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    alert(`Project file for ${selectedItem.title} downloaded.`)
                  }
                  className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 border border-white/15 transition-colors flex items-center gap-1.5"
                >
                  <FiDownload className="w-3.5 h-3.5 text-slate-300" />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Playback Stage */}
            <div className="w-full aspect-video bg-[#08090d] flex items-center justify-center relative overflow-hidden">
              <CardCanvas
                renderAnimation={selectedItem.renderAnimation}
                isHovered={true}
              />
            </div>

            {/* Prompt Box Inside Modal */}
            <div className="p-4 sm:p-5 border-t border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider font-mono text-[11px]">
                  Motion Graphic Prompt
                </span>
                <button
                  type="button"
                  onClick={() => copyPromptText(selectedItem.prompt)}
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {copiedPrompt ? (
                    <>
                      <FiCheck className="w-3.5 h-3.5" />
                      <span>Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-200 bg-white/[0.03] border border-white/10 p-3 rounded-xl font-mono leading-relaxed">
                &quot;{selectedItem.prompt}&quot;
              </p>
            </div>

            {/* Bottom Info bar */}
            <div className="p-4 sm:p-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>Duration: {selectedItem.duration}</span>
                <span>Aspect: {selectedItem.aspectRatio}</span>
                <span>Likes: {selectedItem.likes}</span>
              </div>
              <Link
                href={`/?prompt=${encodeURIComponent(selectedItem.prompt)}`}
                className="text-white hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium"
              >
                <span>Open in Animagent Studio</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component that manages an HTML5 Canvas rendering at 60FPS
function CardCanvas({
  renderAnimation,
  isHovered,
}: {
  renderAnimation: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
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

    const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 225);

    const render = () => {
      // Speeds up motion slightly when hovered like Behance / Dribbble
      time += isHovered ? 0.035 : 0.015;
      renderAnimation(ctx, width, height, time);
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [renderAnimation, isHovered]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover" />;
}
