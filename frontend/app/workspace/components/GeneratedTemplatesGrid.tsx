"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FiPlay,
  FiPause,
  FiMaximize2,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiZap,
  FiRefreshCw,
  FiSliders,
} from "react-icons/fi";
import { GeneratedTemplateItem, StylePreset, ColorPalette } from "../types";
import { drawCanvasFrame, PALETTE_THEMES } from "../canvasEngine";

interface GeneratedTemplatesGridProps {
  templates: GeneratedTemplateItem[];
  activeTemplateId: string;
  onSelectTemplate: (template: GeneratedTemplateItem) => void;
  onDeleteTemplate: (id: string) => void;
  onRemixTemplate: (prompt: string, style: StylePreset) => void;
  onClearAll?: () => void;
  isGenerating?: boolean;
}

// Sub-component for an individual 60FPS animated template canvas card
function TemplateCanvasCard({
  template,
  isActive,
  onSelect,
  onDelete,
  onRemix,
}: {
  template: GeneratedTemplateItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRemix: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const activeTheme = PALETTE_THEMES[template.palette] || PALETTE_THEMES.cyan;

  // 60FPS Animation Loop for mini canvas preview
  useEffect(() => {
    let animId: number;
    const shouldAnimate = isHovered || isPlaying;

    if (shouldAnimate) {
      startTimeRef.current = Date.now();
    }

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      let t = 0.85; // Standby frame
      if (shouldAnimate) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        t = elapsed % (template.duration || 5);
      }

      drawCanvasFrame(
        ctx,
        rect.width,
        rect.height,
        t,
        template.category,
        template.text || "MOTION",
        shouldAnimate,
        template.palette || "cyan",
        1
      );

      ctx.restore();

      if (shouldAnimate) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    if (shouldAnimate) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isHovered, isPlaying, template]);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(template.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleRemix = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemix();
  };

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPlaying(false);
      }}
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border ${
        isActive
          ? "bg-white dark:bg-[#11131c] border-cyan-500 dark:border-cyan-400 shadow-[0_0_24px_rgba(0,240,255,0.22)] ring-1 ring-cyan-400/50"
          : "bg-white dark:bg-[#0b0c13]/90 border-black/10 dark:border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.12)] hover:-translate-y-0.5"
      }`}
    >
      {/* 1. Canvas Preview Stage */}
      <div className="relative aspect-video w-full bg-[#05060a] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wide uppercase backdrop-blur-md border shadow-xs"
            style={{
              backgroundColor: `${activeTheme.primary}20`,
              color: activeTheme.primary,
              borderColor: `${activeTheme.primary}40`,
            }}
          >
            {template.category}
          </span>

          <div className="flex items-center gap-1.5">
            {isActive && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-cyan-500 text-black shadow-xs">
                Active in Canvas
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium text-slate-300 bg-black/60 backdrop-blur-md border border-white/10">
              60 FPS
            </span>
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2.5 transition-opacity duration-200 z-10 ${
            isHovered || isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={handleTogglePlay}
            className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer shadow-lg"
            title={isPlaying ? "Pause Preview" : "Play 60FPS Preview"}
          >
            {isPlaying ? <FiPause className="w-4 h-4 text-cyan-300" /> : <FiPlay className="w-4 h-4 ml-0.5 text-cyan-300" />}
          </button>

          <button
            type="button"
            onClick={onSelect}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-transform active:scale-95 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
            title="Open in Studio Canvas Player"
          >
            <FiMaximize2 className="w-3.5 h-3.5" />
            <span>Open in Studio</span>
          </button>
        </div>

        {/* Duration bottom pill */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300 bg-black/70 backdrop-blur-md border border-white/10 z-10">
          {template.duration || 5}s
        </div>
      </div>

      {/* 2. Metadata & Actions Bar */}
      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate tracking-wide group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              {template.name}
            </h3>
            <span
              className="w-2 h-2 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: activeTheme.primary }}
              title={`Palette: ${template.palette}`}
            />
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed font-sans">
            &ldquo;{template.prompt}&rdquo;
          </p>
        </div>

        {/* Footer with Quick Action Icons */}
        <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500">
              {template.text ? `TEXT: ${template.text}` : "PROCEDURAL"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
              title="Copy Prompt"
            >
              {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleRemix}
              className="p-1.5 rounded-lg hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
              title="Remix Prompt"
            >
              <FiRefreshCw className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Remove Template"
            >
              <FiTrash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratedTemplatesGrid({
  templates,
  activeTemplateId,
  onSelectTemplate,
  onDeleteTemplate,
  onRemixTemplate,
  onClearAll,
  isGenerating = false,
}: GeneratedTemplatesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: string[] = [
    "All",
    "Kinetic Typography",
    "3D Isometric",
    "Logo Reveal",
    "Abstract VFX",
    "UI & Lottie",
  ];

  // Filter templates by category and search
  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.text && item.text.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  return (
    <div className="w-full space-y-4 pt-2">
      {/* 1. Header Bar: Title, Count, Category Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-400/30 text-cyan-600 dark:text-cyan-400 shadow-xs">
            <FiZap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                Generated Templates
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25 dark:border-cyan-400/30">
                {templates.length} Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              60 FPS procedural templates generated via backend prompt API
            </p>
          </div>
        </div>

        {/* Filter & Actions */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter templates..."
              className="pl-8 pr-2.5 py-1.5 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-44 transition-all"
            />
          </div>

          {templates.length > 0 && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-500/10 border border-black/10 dark:border-white/[0.08] hover:border-rose-500/30 transition-all cursor-pointer"
              title="Clear all generated templates"
            >
              Clear Grid
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 dark:border-cyan-400/40 shadow-xs font-semibold"
                : "bg-black/[0.03] dark:bg-white/[0.02] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-black/[0.06] dark:border-white/[0.06]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Templates Grid Content */}
      {filteredTemplates.length === 0 ? (
        <div className="py-12 px-4 rounded-2xl bg-white/60 dark:bg-white/[0.015] border border-dashed border-black/10 dark:border-white/[0.08] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400 shadow-inner">
            <FiZap className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {templates.length === 0 ? "No Generated Templates Yet" : "No Matching Templates Found"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {templates.length === 0
                ? "Type any creative prompt above and click Generate Motion. The backend API will synthesize 60 FPS motion templates and display them in this grid."
                : `No templates matched "${searchQuery}" or category "${selectedCategory}". Try changing filters.`}
            </p>
          </div>

          {templates.length === 0 && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
              {[
                { label: "⚡ Cyberpunk Kinetic", prompt: "Kinetic typography sliding across axes with cyan edges", style: "Kinetic Typography" as StylePreset },
                { label: "💎 3D Prism Glass", prompt: "Rotating frosted glass isometric cubes with chromatic light dispersion", style: "3D Isometric" as StylePreset },
                { label: "🌀 Vector Logo Reveal", prompt: "Circular neon cyan vector arc sweep tracing modern emblem", style: "Logo Reveal" as StylePreset },
                { label: "🔮 Plasma VFX Sphere", prompt: "Harmonic liquid plasma sphere with organic frequency turbulence", style: "Abstract VFX" as StylePreset },
              ].map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => onRemixTemplate(sample.prompt, sample.style)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-black/10 dark:border-white/[0.08] hover:border-cyan-500/40 dark:hover:border-cyan-400/40 transition-all cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCanvasCard
              key={template.id}
              template={template}
              isActive={template.id === activeTemplateId}
              onSelect={() => onSelectTemplate(template)}
              onDelete={() => onDeleteTemplate(template.id)}
              onRemix={() => onRemixTemplate(template.prompt, template.category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
