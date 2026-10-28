"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
  FiDownload,
  FiShare2,
  FiArrowRight,
  FiCheck,
  FiExternalLink,
  FiActivity,
  FiZap,
  FiLayers,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { IconSparkles } from "../../../components/Icons";

export interface SaasLaunchVideoProps {
  productName: string;
  tagline: string;
  keyFeature: string;
  productUrl: string;
  brandColor?: string;
  accentColor?: string;
  categoryLabel?: string;
  initialRatio?: "16:9" | "9:16" | "1:1";
  autoPlay?: boolean;
  onOpenInStudio?: (prompt: string) => void;
  onClose?: () => void;
}

const TOTAL_DURATION = 30; // 30 seconds

export default function SaasLaunchVideoPlayer({
  productName = "Apex Analytics 3.0",
  tagline = "The autonomous telemetry engine for modern cloud teams.",
  keyFeature = "Sub-50ms query synchronization and 3D glass dashboard",
  productUrl = "https://apex.io/launch",
  brandColor = "#c5ef26", // electric lime default
  accentColor = "#658b02",
  categoryLabel = "SaaS Cloud Platform",
  initialRatio = "16:9",
  autoPlay = true,
  onOpenInStudio,
  onClose,
}: SaasLaunchVideoProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [ratio, setRatio] = useState<"16:9" | "9:16" | "1:1">(initialRatio);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSceneRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Determine current active scene
  // Scene 1: 0 - 6s (The Problem)
  // Scene 2: 6 - 15s (Hero 3D Glass UI)
  // Scene 3: 15 - 23s (Velocity Benchmark 8ms)
  // Scene 4: 23 - 30s (Finale Call to Action)
  const currentScene =
    currentTime < 6 ? 1 : currentTime < 15 ? 2 : currentTime < 23 ? 3 : 4;

  // Sound FX via Web Audio API
  const playSoundEffect = (scene: number) => {
    if (isMuted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (scene === 1) {
        // Deep low hum
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      } else if (scene === 2) {
        // Futuristic chord sweep
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      } else if (scene === 3) {
        // High-tech laser tick
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      } else {
        // Uplifting finale chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.5);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  // Playback timer engine
  useEffect(() => {
    let active = true;
    lastTickRef.current = Date.now();

    const loop = () => {
      if (!active) return;
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            return 0; // loop
          }
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Trigger sound when scene changes
  useEffect(() => {
    if (currentScene !== lastSceneRef.current) {
      lastSceneRef.current = currentScene;
      playSoundEffect(currentScene);
    }
  }, [currentScene, isMuted]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const jumpToScene = (targetTime: number) => {
    setCurrentTime(targetTime);
    setIsPlaying(true);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  // Dynamic calculations for animations
  // Latency benchmark countdown (Scene 3: 15s - 23s)
  const scene3Progress = Math.max(0, Math.min(1, (currentTime - 15) / 8));
  const latencyDisplay = Math.round(1420 - scene3Progress * (1420 - 8));

  // Chart progress for Scene 2 (6s - 15s)
  const scene2Progress = Math.max(0, Math.min(1, (currentTime - 6) / 9));

  const cleanDomain = productUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .toUpperCase();

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const masterPrompt = `A 30-second high-end SaaS commercial for "${productName}" (${cleanDomain}). Obsidian black luxury aesthetic with ${brandColor} neon glow, floating 3D perspective glassmorphism UI, real-time query countdown to 8ms, sub-50ms edge latency badges, and keynote typographic outro with CTA "${productUrl}".`;

  const copyPrompt = () => {
    navigator.clipboard?.writeText(masterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl border border-[#dedad0] bg-[#111110] text-white shadow-2xl overflow-hidden flex flex-col">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-5 py-3.5 bg-[#171716]">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#c5ef26] animate-pulse" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#c5ef26]">
              SAAS MOTION ENGINE 4K
            </span>
            <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80">
              60 FPS
            </span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline font-mono text-[12px] text-white/60">
            {cleanDomain}
          </span>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10.5px] text-white/50 mr-1 hidden md:inline">
            Format:
          </span>
          {(["16:9", "9:16", "1:1"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatio(r)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition ${
                ratio === r
                  ? "bg-[#c5ef26] text-[#111110]"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {r}
            </button>
          ))}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ml-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#0c0c0b] to-[#141413] min-h-[360px] sm:min-h-[460px] overflow-hidden">
        {/* Dynamic Canvas Container matching Aspect Ratio */}
        <div
          className={`relative w-full max-w-full overflow-hidden rounded-2xl border border-white/15 bg-[#090908] shadow-2xl transition-all duration-300 flex items-center justify-center ${
            ratio === "16:9"
              ? "aspect-video max-w-4xl"
              : ratio === "9:16"
              ? "aspect-[9/16] max-h-[520px] max-w-[292px]"
              : "aspect-square max-w-[420px]"
          }`}
          style={{
            boxShadow: `0 0 60px -15px ${brandColor}25`,
          }}
        >
          {/* Subtle Dynamic Ambient Aura */}
          <div
            className="absolute -top-20 -left-20 h-64 w-64 rounded-full blur-[90px] opacity-25 transition-all duration-700 pointer-events-none"
            style={{
              backgroundColor: brandColor,
              transform: `translate(${Math.sin(currentTime) * 40}px, ${
                Math.cos(currentTime) * 30
              }px)`,
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full blur-[90px] opacity-20 transition-all duration-700 pointer-events-none"
            style={{ backgroundColor: brandColor }}
          />

          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff12 1px, transparent 1px), linear-gradient(to bottom, #ffffff12 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* =============================================================
              SCENE 1: THE PROBLEM / LEGACY BOTTLENECK (00:00 - 00:06)
             ============================================================= */}
          {currentScene === 1 && (
            <div className="relative z-10 w-full p-6 text-center animate-in fade-in zoom-in-95 duration-500 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                01 · The Legacy Bottleneck
              </span>

              <h2 className="text-[24px] sm:text-[34px] font-black uppercase tracking-tight text-white leading-tight">
                Slow. Fragmented.{" "}
                <span className="text-red-400 line-through">Expensive.</span>
              </h2>

              <p className="mx-auto max-w-md text-[13px] sm:text-[14px] text-white/60 leading-relaxed">
                Legacy tools force engineering teams to wait 14+ minutes per
                deploy, drowning in disconnected silos.
              </p>

              {/* Red Warning Metric Card */}
              <div className="mx-auto max-w-sm rounded-xl border border-red-500/20 bg-red-950/20 p-3.5 backdrop-blur-md flex items-center justify-between">
                <div className="text-left">
                  <div className="font-mono text-[10px] text-red-400/80">
                    LEGACY AVERAGE LATENCY
                  </div>
                  <div className="font-mono text-[20px] font-bold text-red-400">
                    1,420 ms
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-red-400/80">
                    MANUAL STEPS
                  </div>
                  <div className="font-mono text-[20px] font-bold text-red-400">
                    12 CLICKS
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================
              SCENE 2: THE 3D GLASS UI HERO REVEAL (00:06 - 00:15)
             ============================================================= */}
          {currentScene === 2 && (
            <div className="relative z-10 w-full p-5 sm:p-7 text-center animate-in fade-in zoom-in-95 duration-700 space-y-3.5">
              <div className="flex items-center justify-center gap-2">
                <span
                  className="rounded-full px-3 py-0.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#111110]"
                  style={{ backgroundColor: brandColor }}
                >
                  02 · INTRODUCING THE FUTURE
                </span>
              </div>

              <div>
                <h2 className="text-[26px] sm:text-[36px] font-black tracking-tight text-white">
                  {productName}
                </h2>
                <p className="mx-auto max-w-lg text-[13px] sm:text-[14px] text-white/70 line-clamp-1">
                  {tagline}
                </p>
              </div>

              {/* 3D Glassmorphism Dashboard Simulation */}
              <div
                className="mx-auto max-w-md rounded-2xl border border-white/20 bg-[#16171a]/85 p-4 sm:p-5 backdrop-blur-xl shadow-2xl transition-all duration-500 text-left"
                style={{
                  transform: "perspective(800px) rotateX(8deg)",
                  boxShadow: `0 20px 40px -10px ${brandColor}30`,
                }}
              >
                {/* Mock Window Controls */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    <span className="ml-2 font-mono text-[10.5px] text-white/50">
                      {cleanDomain}/dashboard
                    </span>
                  </div>
                  <span
                    className="rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase"
                    style={{
                      backgroundColor: `${brandColor}20`,
                      color: brandColor,
                    }}
                  >
                    LIVE 60FPS
                  </span>
                </div>

                {/* Animated Rising SVG Line Chart */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-white/60 font-mono">
                    <span>TELEMETRY THROUGHPUT</span>
                    <span style={{ color: brandColor }}>+94.8% REALTIME</span>
                  </div>

                  <svg
                    viewBox="0 0 300 65"
                    className="w-full h-16 mt-1 overflow-visible"
                  >
                    <defs>
                      <linearGradient
                        id="brandGlowGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={brandColor}
                          stopOpacity="0.45"
                        />
                        <stop
                          offset="100%"
                          stopColor={brandColor}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    {/* Area */}
                    <path
                      d={`M 0 55 Q 50 ${50 - scene2Progress * 25} 100 ${
                        40 - scene2Progress * 20
                      } T 200 ${30 - scene2Progress * 25} T 300 ${
                        15 - scene2Progress * 10
                      } L 300 65 L 0 65 Z`}
                      fill="url(#brandGlowGrad)"
                    />
                    {/* Line */}
                    <path
                      d={`M 0 55 Q 50 ${50 - scene2Progress * 25} 100 ${
                        40 - scene2Progress * 20
                      } T 200 ${30 - scene2Progress * 25} T 300 ${
                        15 - scene2Progress * 10
                      }`}
                      fill="none"
                      stroke={brandColor}
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                {/* Micro Spec Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[10.5px] font-medium text-white/90 border border-white/10 flex items-center gap-1">
                    <FiZap size={11} style={{ color: brandColor }} />
                    Zero-Cold Starts
                  </span>
                  <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[10.5px] font-medium text-white/90 border border-white/10 flex items-center gap-1">
                    <FiLayers size={11} style={{ color: brandColor }} />
                    Multi-Region Edge
                  </span>
                  <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[10.5px] font-medium text-white/90 border border-white/10 flex items-center gap-1">
                    <IconSparkles
                      className="w-3 h-3"
                      style={{ color: brandColor }}
                    />
                    AI Copilot
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================
              SCENE 3: VELOCITY & BENCHMARK SPEED TEST (00:15 - 00:23)
             ============================================================= */}
          {currentScene === 3 && (
            <div className="relative z-10 w-full p-6 text-center animate-in fade-in zoom-in-95 duration-500 space-y-4">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#111110]"
                style={{ backgroundColor: brandColor }}
              >
                03 · RAW BENCHMARK SPEED
              </span>

              <h2 className="text-[22px] sm:text-[32px] font-black uppercase tracking-tight text-white">
                10X Faster. Sub-8ms Execution.
              </h2>

              {/* Pulsing Benchmark Speedometer */}
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#ffffff15"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={brandColor}
                    strokeWidth="8"
                    strokeDasharray="314"
                    strokeDashoffset={314 - 314 * scene3Progress}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 0.1s linear",
                      filter: `drop-shadow(0 0 8px ${brandColor})`,
                    }}
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-[28px] sm:text-[34px] font-black text-white leading-none">
                    {latencyDisplay}
                  </span>
                  <span
                    className="font-mono text-[11px] font-bold tracking-widest mt-0.5"
                    style={{ color: brandColor }}
                  >
                    MILLISECONDS
                  </span>
                </div>
              </div>

              {/* Spec Bullet Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80">
                  ⚡ 00:00.08 Global P99
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80">
                  🔒 Zero Data Leaks
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80">
                  🌐 240 Edge PoPs
                </span>
              </div>
            </div>
          )}

          {/* =============================================================
              SCENE 4: FINALE CALL TO ACTION & BRAND OUTRO (00:23 - 00:30)
             ============================================================= */}
          {currentScene === 4 && (
            <div className="relative z-10 w-full p-6 text-center animate-in fade-in zoom-in-95 duration-500 space-y-4">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#111110]"
                style={{ backgroundColor: brandColor }}
              >
                04 · CALL TO ACTION FINALE
              </span>

              {/* Glowing Brand Stamp */}
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#17181c] border-2 shadow-2xl transition duration-300"
                style={{
                  borderColor: brandColor,
                  boxShadow: `0 0 30px ${brandColor}50`,
                }}
              >
                <span
                  className="font-mono text-[24px] font-black"
                  style={{ color: brandColor }}
                >
                  {productName.charAt(0)}
                </span>
              </div>

              <div>
                <h2 className="text-[26px] sm:text-[36px] font-black uppercase tracking-tight text-white">
                  Build Without Limits.
                </h2>
                <p className="text-[13px] sm:text-[14px] text-white/70">
                  Deploy {productName} in less than 60 seconds.
                </p>
              </div>

              {/* High-Contrast URL Badge */}
              <div className="mx-auto inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#c5ef26] animate-ping" />
                <span className="font-mono text-[13px] font-semibold tracking-wide text-white">
                  {cleanDomain}
                </span>
              </div>

              {/* Shimmering CTA Button */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenInStudio) onOpenInStudio(masterPrompt);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold text-[#111110] shadow-xl transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: brandColor,
                    boxShadow: `0 10px 30px ${brandColor}40`,
                  }}
                >
                  <span>Start Free Trial Today</span>
                  <FiArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Time & Scene Overlay HUD (Bottom of Canvas) */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none text-white/50 font-mono text-[10.5px]">
            <div className="flex items-center gap-2">
              <span className="rounded bg-black/70 px-2 py-0.5 text-white/90 backdrop-blur-xs">
                {formatTime(currentTime)} / 00:30.00
              </span>
              <span className="hidden sm:inline rounded bg-black/70 px-2 py-0.5 text-white/80 backdrop-blur-xs">
                Scene {currentScene}/4
              </span>
            </div>

            <span className="rounded bg-black/70 px-2 py-0.5 text-[#c5ef26] backdrop-blur-xs font-semibold">
              {categoryLabel}
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================
          BOTTOM CONTROL DECK (SCRUBBER, PLAY/PAUSE, SCENES, EXPORTS)
         ================================================================= */}
      <div className="border-t border-white/10 bg-[#141413] p-4 sm:p-5 space-y-3.5">
        {/* Scrubber Bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#111110] shadow-md transition hover:scale-105 shrink-0"
            style={{ backgroundColor: brandColor }}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <FiPause size={18} className="fill-[#111110]" />
            ) : (
              <FiPlay size={18} className="ml-0.5 fill-[#111110]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentTime(0);
              setIsPlaying(true);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 hover:bg-white/10 hover:text-white shrink-0"
            title="Replay from start"
          >
            <FiRotateCcw size={16} />
          </button>

          {/* Range Slider */}
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max={TOTAL_DURATION}
              step="0.05"
              value={currentTime}
              onChange={handleScrub}
              className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#c5ef26]"
            />
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-[12px] font-semibold transition shrink-0 ${
              !isMuted
                ? "bg-[#c5ef26] text-[#111110]"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
            title={isMuted ? "Unmute Sound FX" : "Mute Sound FX"}
          >
            {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
            <span className="hidden sm:inline">
              {isMuted ? "Sound Off" : "Sound FX"}
            </span>
          </button>
        </div>

        {/* 4-Beat Scene Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 1, label: "01. Legacy Problem", time: 0 },
            { id: 2, label: "02. 3D Glass UI", time: 6.5 },
            { id: 3, label: "03. 8ms Benchmark", time: 15.5 },
            { id: 4, label: "04. Finale CTA", time: 23.5 },
          ].map((scene) => {
            const isActive = currentScene === scene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => jumpToScene(scene.time)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-left font-mono text-[11px] font-medium transition ${
                  isActive
                    ? "bg-white/15 text-white ring-1 ring-[#c5ef26]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/90"
                }`}
              >
                <span>{scene.label}</span>
                <span className="text-[10px] text-white/40">
                  {scene.time === 0 ? "00:00" : `00:${Math.floor(scene.time)}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions Deck */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyPrompt}
              className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-[12px] font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              {copiedPrompt ? (
                <FiCheck size={14} className="text-[#c5ef26]" />
              ) : (
                <IconSparkles className="w-3.5 h-3.5 text-[#c5ef26]" />
              )}
              <span>{copiedPrompt ? "Script Copied!" : "Copy Video Script"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-[12px] font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              {downloadSuccess ? (
                <FiCheck size={14} className="text-[#c5ef26]" />
              ) : (
                <FiDownload size={14} />
              )}
              <span>{downloadSuccess ? "Render Queued!" : "Download 4K ProRes"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenInStudio) onOpenInStudio(masterPrompt);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#c5ef26] px-4 py-2 text-[13px] font-bold text-[#111110] shadow-md transition hover:bg-[#b2dc1e]"
            >
              <IconSparkles className="w-4 h-4 text-[#111110]" />
              <span>Open in Motion Studio</span>
              <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
