"use client";

import React, { useState, memo } from "react";
import Link from "next/link";

export const ExtensionCarousel = memo(function ExtensionCarousel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpace, setActiveSpace] = useState("Work");

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-canvas text-white overflow-hidden border-t border-white/[0.06] select-none">
      <div className="max-w-7xl mx-auto">
        {/* ── 4 EXTENSION CARDS GRID (EXACT TO REFERENCE SCREENSHOT 3) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* ── CARD 1: LINEAR ── */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-surface via-surface to-canvas p-6 flex flex-col justify-between h-[450px] overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 shadow-xl">
            {/* Top Info */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  {/* Linear Logo Squircle */}
                  <div className="w-8 h-8 rounded-[8px] bg-[#1a1733] border border-white/10 flex items-center justify-center shadow-xs">
                    <svg className="w-4 h-4 text-[#8F99F8]" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M50 0C22.386 0 0 22.386 0 50s22.386 50 50 50 50-22.386 50-50S77.614 0 50 0zm-8.87 86.87C21.737 83.242 8.758 70.263 5.13 50.87L50.87 5.13C70.263 8.758 83.242 21.737 86.87 41.13L41.13 86.87zm16.53-6.19l31.21-31.21c-.81 4.54-2.48 8.8-4.87 12.59l-13.75 13.75c-3.79 2.39-8.05 4.06-12.59 4.87zm14.15-20.34l12.7-12.7c-2.45-3.87-5.73-7.15-9.6-9.6l-12.7 12.7c3.87 2.45 7.15 5.73 9.6 9.6z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-white text-[15px] tracking-tight">Linear</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors cursor-pointer">
                  <svg className="w-3 h-3 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-400 text-[13px] font-normal leading-[1.55]">
                Create, search and modify your issues without leaving your keyboard.
              </p>
            </div>

            {/* Visual Graphic: Linear Celestial Arc with Status Indicators */}
            <div className="relative h-[230px] rounded-xl bg-black/40 border border-white/[0.05] overflow-hidden flex flex-col items-center justify-center p-4">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(94, 106, 210, 0.25) 0%, transparent 70%)",
                }}
              />

              {/* Star dust dots */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              {/* Celestial Arc Graphic */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 140 140" fill="none">
                  {/* Outer circle arc */}
                  <path
                    d="M 18,105 A 56,56 0 1,1 122,105"
                    stroke="#5E6AD2"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                  />
                  {/* Diagonal speed lines */}
                  <line x1="28" y1="100" x2="68" y2="60" stroke="#5E6AD2" strokeWidth="2" strokeOpacity="0.4" />
                  <line x1="22" y1="85" x2="55" y2="52" stroke="#5E6AD2" strokeWidth="2" strokeOpacity="0.3" />
                  <line x1="20" y1="68" x2="42" y2="46" stroke="#5E6AD2" strokeWidth="2" strokeOpacity="0.2" />
                  {/* Glowing perimeter node */}
                  <circle cx="122" cy="105" r="2.5" fill="#8F99F8" filter="drop-shadow(0 0 6px #5E6AD2)" />
                </svg>
              </div>

              {/* 4 Status Indicator Pills */}
              <div className="flex items-center gap-3.5 mt-3 relative z-10">
                {/* 1. Dotted Circle (Backlog) */}
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-zinc-500/80 flex items-center justify-center" />
                {/* 2. Solid Outline Circle (Todo) */}
                <div className="w-6 h-6 rounded-full border-2 border-white/90 bg-white/5" />
                {/* 3. Half-Filled Amber Circle (In Progress) */}
                <div className="w-6 h-6 rounded-full border-2 border-amber-400/90 overflow-hidden flex items-center">
                  <div className="w-1/2 h-full bg-amber-400" />
                </div>
                {/* 4. Filled Blue Circle with Checkmark (Done) */}
                <div className="w-6 h-6 rounded-full bg-[#5E6AD2] flex items-center justify-center text-white text-[11px] font-bold shadow-md">
                  ✓
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 2: GOOGLE TRANSLATE ── */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-surface via-surface to-canvas p-6 flex flex-col justify-between h-[450px] overflow-hidden group hover:border-blue-500/40 transition-all duration-300 shadow-xl">
            {/* Top Info */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  {/* Google Translate Squircle */}
                  <div className="w-8 h-8 rounded-[8px] bg-[#141e34] border border-white/10 flex items-center justify-center shadow-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="#4285F4" />
                    </svg>
                  </div>
                  <span className="font-semibold text-white text-[15px] tracking-tight">Google Translate</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors cursor-pointer">
                  <svg className="w-3 h-3 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-400 text-[13px] font-normal leading-[1.55]">
                Use Google Translate to effortlessly translate into multiple languages
              </p>
            </div>

            {/* Visual Graphic: Translation Cascade (Exact Match to Screenshot 3) */}
            <div className="relative h-[230px] rounded-xl bg-black/40 border border-white/[0.05] overflow-hidden flex flex-col justify-center px-4 space-y-1.5 select-none font-sans">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 60% 40%, rgba(66, 133, 244, 0.2) 0%, transparent 70%)",
                }}
              />

              {/* Line 1 */}
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-white tracking-tight">Omelette du fromage</span>
                <span className="text-accent font-medium text-[12px]">بالجبنة</span>
              </div>
              {/* Line 2 */}
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-normal text-zinc-400">Cheese Omelette</span>
                <span className="text-zinc-500 font-normal">Kaas omelet</span>
              </div>
              {/* Line 3 */}
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-normal text-zinc-300">Tortilla de queso</span>
                <span className="text-zinc-500 font-normal">Ostomelet</span>
              </div>
              {/* Line 4 */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 font-normal">Käse omlett</span>
                <span className="text-zinc-500 font-normal">Omelette al form</span>
              </div>
              {/* Line 5 */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-accent font-normal">Ushizi Omelette</span>
                <span className="text-accent font-normal">チーズオムレ</span>
              </div>
              {/* Line 6 */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500 font-normal">Omleta cu branza</span>
                <span className="text-zinc-600 font-normal">Trung tran</span>
              </div>
              {/* Line 7 */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-600 font-normal">חביתת גבינה</span>
                <span className="text-zinc-600 font-normal">Truita de format</span>
              </div>
            </div>
          </div>

          {/* ── CARD 3: SPOTIFY ── */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-surface via-surface to-canvas p-6 flex flex-col justify-between h-[450px] overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
            {/* Top Info */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  {/* Spotify Logo Squircle */}
                  <div className="w-8 h-8 rounded-[8px] bg-[#0c2415] border border-white/10 flex items-center justify-center shadow-xs">
                    <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-white text-[15px] tracking-tight">Spotify</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors cursor-pointer">
                  <svg className="w-3 h-3 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-400 text-[13px] font-normal leading-[1.55]">
                Search for music and podcasts, browse your library, and control playback.
              </p>
            </div>

            {/* Visual Graphic: Album Artwork & Media Controls (Exact Match to Screenshot 3) */}
            <div className="relative h-[230px] rounded-xl bg-black/40 border border-white/[0.05] overflow-hidden flex flex-col items-center justify-center p-3">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(29, 185, 84, 0.28) 0%, transparent 75%)",
                }}
              />

              {/* Album Art Cover (Clean Editorial Photo Mockup) */}
              <div className="w-28 h-28 rounded-md bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden relative flex items-center justify-center">
                {/* Monochrome Artistic Profile Image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-300 via-zinc-400 to-zinc-200 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/10">
                    <svg className="w-20 h-20 text-zinc-800" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="50" cy="45" r="22" opacity="0.85" />
                      <path d="M20 90c0-16.569 13.431-30 30-30s30 13.431 30 30" opacity="0.8" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Player Controls Bar */}
              <div className="flex items-center gap-5 mt-4 text-white/90 relative z-10">
                {/* Previous */}
                <button
                  type="button"
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="Previous Track"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg className="w-3.5 h-3.5 fill-black" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 fill-black ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Next */}
                <button
                  type="button"
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="Next Track"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── CARD 4: ARC ── */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-surface via-canvas to-canvas p-6 flex flex-col justify-between h-[450px] overflow-hidden group hover:border-pink-500/40 transition-all duration-300 shadow-xl">
            {/* Top Info */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  {/* Arc Logo Squircle */}
                  <div className="w-8 h-8 rounded-[8px] bg-[#221332] border border-white/10 flex items-center justify-center shadow-xs">
                    <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-white text-[15px] tracking-tight">Arc</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors cursor-pointer">
                  <svg className="w-3 h-3 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-400 text-[13px] font-normal leading-[1.55]">
                Navigate your open tabs or search through your browser history.
              </p>
            </div>

            {/* Visual Graphic: Neon Arc 3D Ribbon & Spaces Floating Menu (Exact Match to Screenshot 3) */}
            <div className="relative h-[230px] rounded-xl bg-black/40 border border-white/[0.05] overflow-hidden flex items-center justify-center p-3 select-none">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 45% 45%, rgba(244, 63, 94, 0.22) 0%, rgba(168, 85, 247, 0.12) 45%, transparent 70%)",
                }}
              />

              {/* Glowing Neon 3D Arc "A" Ribbon */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(244,63,94,0.45)]">
                  <defs>
                    <linearGradient id="arcNeonGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="40%" stopColor="#EC4899" />
                      <stop offset="80%" stopColor="#FF3358" />
                      <stop offset="100%" stopColor="#FFAA40" />
                    </linearGradient>
                  </defs>
                  {/* Intertwined tubular ribbon */}
                  <path
                    d="M 32,92 C 15,65 25,35 60,20 C 95,35 105,65 88,92 C 72,70 48,70 32,92 Z"
                    fill="none"
                    stroke="url(#arcNeonGradient)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Floating Translucent Spaces Dropdown (Exact Match to Screenshot 3) */}
                <div className="absolute bottom-1 right-1 bg-[#191122]/90 backdrop-blur-xl border border-white/15 rounded-xl p-2 shadow-2xl text-[11px] min-w-[85px] z-20">
                  <div className="text-zinc-500 font-semibold uppercase tracking-wider text-[9px] px-2 py-0.5">
                    Spaces
                  </div>
                  {["Work", "Personal", "AI"].map((space) => {
                    const isActive = activeSpace === space;
                    return (
                      <div
                        key={space}
                        onClick={() => setActiveSpace(space)}
                        className={`px-2 py-1 rounded-md cursor-pointer transition-colors text-[11px] ${
                          isActive
                            ? "bg-white/15 text-white font-medium shadow-xs"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {space}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BROWSE BAR (EXACT MATCH TO REFERENCE SCREENSHOT 3) ── */}
        <div className="mt-8 flex items-center justify-between text-[13px] text-zinc-400">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors group font-normal text-[13px]"
          >
            <span>Browse thousands more</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <svg className="w-3 h-3 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Next"
            >
              <svg className="w-3 h-3 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ExtensionCarousel;
