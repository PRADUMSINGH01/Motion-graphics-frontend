"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  FiZap,
  FiCompass,
  FiKey,
  FiTag,
  FiLogOut,
  FiPlay,
  FiPause,
  FiRepeat,
  FiDownload,
  FiCopy,
  FiCheck,
  FiMaximize2,
  FiType,
  FiClock,
  FiPlus,
  FiTrash2,
  FiArrowUpRight,
  FiHelpCircle,
  FiLayers,
  FiSliders,
  FiActivity,
  FiCreditCard,
  FiFileText,
  FiShield,
  FiRefreshCw,
  FiCheckCircle,
  FiTrendingUp,
  FiDatabase,
  FiCpu,
  FiAlertCircle,
  FiArrowRight,
  FiStar,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { api, addCharConversion, addChatConversation } from "../lib/api";
import SpiderNetBackground from "../components/SpiderNetBackground";

export type StylePreset =
  | "Kinetic Typography"
  | "3D Isometric"
  | "Logo Reveal"
  | "Abstract VFX"
  | "UI & Lottie";

export type AspectRatio = "16:9" | "9:16" | "1:1";
export type WorkspaceView = "prompt" | "vectorizer" | "usage" | "billing";
export type BillingInterval = "monthly" | "annual";
export type PlanTier = "free" | "creator" | "pro" | "enterprise";

export interface ProjectItem {
  id: string;
  name: string;
  category: StylePreset;
  duration: number;
  prompt: string;
  text: string;
  updatedAt: string;
}

export default function WorkspacePage() {
  const { user, logout, refreshUser } = useAuth();
  const { success, failure } = useAlert();

  // Mode: standard prompt to motion OR character vectorizer OR usage OR billing
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceView>("prompt");

  // Check URL query param on mount (?tab=billing or ?tab=usage or ?prompt=...&style=...&text=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "billing" || tab === "pricing") {
        setWorkspaceMode("billing");
      } else if (tab === "usage") {
        setWorkspaceMode("usage");
      } else if (tab === "vectorizer") {
        setWorkspaceMode("vectorizer");
      }

      const paramPrompt = params.get("prompt");
      const paramStyle = params.get("style");
      const paramText = params.get("text");

      if (paramPrompt) {
        setPromptText(decodeURIComponent(paramPrompt));
        success("Template Loaded", "Remixing template in Animagent Studio. Customize prompt, style, or text below.");
      }
      if (paramStyle) {
        setActiveStyle(paramStyle as StylePreset);
      }
      if (paramText) {
        setLiveText(decodeURIComponent(paramText));
      }
    }
  }, [success]);

  // Projects list
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "p-1",
      name: "Cyber Kinetic Velocity",
      category: "Kinetic Typography",
      duration: 5,
      prompt: "Kinetic typography sliding across staggered axes with glowing cyan edges and spring-damper easing",
      text: "VELOCITY",
      updatedAt: "Just now",
    },
    {
      id: "p-2",
      name: "Prism Glass Refraction",
      category: "3D Isometric",
      duration: 6,
      prompt: "Interlocking frosted glass cubes rotating on a 45-degree isometric gimbal with chromatic dispersion",
      text: "REFRACTION",
      updatedAt: "15m ago",
    },
    {
      id: "p-3",
      name: "Quantum Logo Arc",
      category: "Logo Reveal",
      duration: 4,
      prompt: "Dual vector arcs rotating synchronously with high-voltage neon pulse and particle corona",
      text: "ORBITAL",
      updatedAt: "1h ago",
    },
    {
      id: "p-4",
      name: "Molten Plasma VFX",
      category: "Abstract VFX",
      duration: 5,
      prompt: "Undulating plasma sphere with organic harmonic frequency and liquid surface turbulence",
      text: "NEBULA",
      updatedAt: "3h ago",
    },
  ]);

  const [activeProjectId, setActiveProjectId] = useState("p-1");
  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) || projects[0],
    [projects, activeProjectId]
  );

  // Active generation parameters
  const [promptText, setPromptText] = useState(activeProject.prompt);
  const [activeStyle, setActiveStyle] = useState<StylePreset>(activeProject.category);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [liveText, setLiveText] = useState(activeProject.text);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Character Vectorizer Dedicated State
  const [charInput, setCharInput] = useState("ANIMAGENT");
  const [charEffect, setCharEffect] = useState<"kinetic_split" | "neon_glow" | "wave" | "glitch" | "isometric">("kinetic_split");
  const [isConvertingChar, setIsConvertingChar] = useState(false);

  // Billing & Usage States
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("annual");
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [selectedTierForUpdate, setSelectedTierForUpdate] = useState<PlanTier | null>(null);
  const [extraCredits, setExtraCredits] = useState(0);
  const [isRefreshingQuotas, setIsRefreshingQuotas] = useState(false);

  // Player state: PAUSED BY DEFAULT, NO ENDLESS LOOP!
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Compact Inspiration Presets
  const inspirationPresets = [
    {
      title: "Cyberpunk Kinetic",
      category: "Kinetic Typography" as StylePreset,
      text: "VELOCITY",
      prompt: "Kinetic typography sliding across staggered axes with glowing cyan edges and spring-damper easing",
      icon: "⚡",
    },
    {
      title: "Prism Glass 3D",
      category: "3D Isometric" as StylePreset,
      text: "REFRACTION",
      prompt: "Interlocking frosted glass cubes rotating on an isometric gimbal with chromatic light dispersion",
      icon: "💎",
    },
    {
      title: "Neon Monogram",
      category: "Logo Reveal" as StylePreset,
      text: "ORBITAL",
      prompt: "Circular vector arc sweeps tracing modern brand emblem with high-voltage neon cyan particle pulse",
      icon: "🌀",
    },
    {
      title: "Plasma VFX",
      category: "Abstract VFX" as StylePreset,
      text: "NEBULA",
      prompt: "Undulating plasma sphere with organic harmonic frequency and liquid surface turbulence",
      icon: "🔮",
    },
    {
      title: "UI & Lottie",
      category: "UI & Lottie" as StylePreset,
      text: "SYNTHESIS",
      prompt: "Procedural UI audio frequency bars dancing with spring bounce and smooth damping",
      icon: "📊",
    },
  ];

  // Synchronize when active project changes
  useEffect(() => {
    setPromptText(activeProject.prompt);
    setActiveStyle(activeProject.category);
    setLiveText(activeProject.text);
    startTimeRef.current = Date.now();
    setCurrentTime(0);
    setIsPlaying(false); // Clean pause on project switch
  }, [activeProject.id]);

  // --------------------------------------------------------------------------
  // 60FPS High-Definition Canvas Render Engine (Clean, Stable, Non-wobbling when paused)
  // --------------------------------------------------------------------------
  const renderEngine = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      // 1. Deep Midnight Studio Backdrop
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h));
      bgGrad.addColorStop(0, "#0e111a");
      bgGrad.addColorStop(1, "#050608");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle tech background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;
      const step = 48;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const cx = w / 2;
      const cy = h / 2;

      // 2. Render Motion Graphics by Selected Style
      if (activeStyle === "Kinetic Typography") {
        const text = (liveText || "VELOCITY").toUpperCase();
        ctx.font = "bold 50px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Kinetic offset only when playing or time > 0
        const offset = isPlaying ? Math.sin(t * 2.5) * 28 : 0;
        const bounce = isPlaying ? Math.cos(t * 3.2) * 5 : 0;

        if (isPlaying && offset !== 0) {
          // Chromatic split red/pink trail
          ctx.fillStyle = "rgba(244, 63, 94, 0.4)";
          ctx.fillText(text, cx - offset, cy - 8 + bounce);

          // Chromatic split cyan trail
          ctx.fillStyle = "rgba(56, 189, 248, 0.45)";
          ctx.fillText(text, cx + offset, cy + 8 - bounce);
        }

        // Core crisp foreground with cyan glow
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = isPlaying ? 22 : 16;
        ctx.fillText(text, cx, cy);
        ctx.shadowBlur = 0;

        // Subtitle tag
        ctx.font = "600 11px monospace";
        ctx.fillStyle = "rgba(0, 240, 255, 0.85)";
        ctx.fillText("60.0 FPS • HARDWARE ACCELERATED RENDER", cx, cy + 58);
      } else if (activeStyle === "3D Isometric") {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(isPlaying ? t * 0.6 : 0.2);

        const size = 66;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.strokeStyle = i % 2 === 0 ? "#00f0ff" : "#818cf8";
          ctx.lineWidth = 2;
          const s = size - i * 15;
          ctx.strokeRect(-s, -s, s * 2, s * 2);
        }

        const pulse = isPlaying ? (Math.sin(t * 3) + 1) * 0.5 : 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 14 + pulse * 7, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#818cf8";
        ctx.shadowBlur = 22;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        ctx.font = "600 11px monospace";
        ctx.fillStyle = "rgba(129, 140, 248, 0.9)";
        ctx.textAlign = "center";
        ctx.fillText("ISOMETRIC PROJECTION MATRIX", cx, cy + 105);
      } else if (activeStyle === "Logo Reveal") {
        const radius = 64;
        const progress = isPlaying ? (t * 0.75) % 1 : 1;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + progress * Math.PI * 2;

        // Outer neon glow arc
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 22;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Counter-rotating inner ring
        const innerProgress = 1 - progress;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.75, Math.PI / 2, Math.PI / 2 + innerProgress * Math.PI * 2);
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Inner monogram
        ctx.font = "bold 26px -apple-system, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(liveText?.charAt(0) || "A", cx, cy);

        ctx.font = "600 11px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillText("VECTOR MONOGRAM REVEAL", cx, cy + 100);
      } else if (activeStyle === "Abstract VFX") {
        const points = 50;
        const baseRadius = 56;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const theta = (i / points) * Math.PI * 2;
          const noise = isPlaying
            ? Math.sin(theta * 3 + t * 4) * 12 + Math.cos(theta * 5 - t * 2) * 7
            : Math.sin(theta * 3) * 8;
          const r = baseRadius + noise;
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const fluidGrad = ctx.createLinearGradient(cx - 60, cy - 60, cx + 60, cy + 60);
        fluidGrad.addColorStop(0, "#f43f5e");
        fluidGrad.addColorStop(0.5, "#a855f7");
        fluidGrad.addColorStop(1, "#06b6d4");
        ctx.fillStyle = fluidGrad;
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = "600 11px monospace";
        ctx.fillStyle = "rgba(244, 63, 94, 0.9)";
        ctx.textAlign = "center";
        ctx.fillText("HARMONIC PLASMA DYNAMICS", cx, cy + 105);
      } else {
        // UI & Lottie Motion
        const barWidth = 30;
        const totalBars = 5;
        const startX = cx - (totalBars * (barWidth + 10)) / 2;

        for (let i = 0; i < totalBars; i++) {
          const hOffset = isPlaying ? Math.sin(t * 3.5 + i * 0.8) * 32 : (i % 2 === 0 ? 20 : -10);
          const barH = 48 + hOffset;
          const x = startX + i * (barWidth + 10);
          const y = cy - barH / 2;

          ctx.fillStyle = i % 2 === 0 ? "#00f0ff" : "#3b82f6";
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barH, 6);
          ctx.fill();
        }

        ctx.font = "600 11px monospace";
        ctx.fillStyle = "rgba(59, 130, 246, 0.9)";
        ctx.textAlign = "center";
        ctx.fillText("INTERACTIVE LOTTIE RUNTIME", cx, cy + 86);
      }
    },
    [activeStyle, liveText, isPlaying]
  );

  // 60FPS Animation Loop: Respects play state and stops at duration end (NO INFINITE LOOP)
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      let t = currentTime;
      if (isPlaying) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        if (elapsed > activeProject.duration) {
          if (isLooping) {
            startTimeRef.current = Date.now();
            t = 0;
            setCurrentTime(0);
          } else {
            // STOP PLAYING AT END!
            setIsPlaying(false);
            t = activeProject.duration;
            setCurrentTime(activeProject.duration);
          }
        } else {
          t = elapsed;
          setCurrentTime(elapsed);
        }
      }

      renderEngine(ctx, rect.width, rect.height, t);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isLooping, currentTime, activeProject.duration, renderEngine]);

  // Spacebar Play / Pause Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA" && (e.target as HTMLElement).tagName !== "SELECT") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentTime, activeProject.duration]);

  // Clean Play / Pause Toggle Helper
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTime >= activeProject.duration) {
        startTimeRef.current = Date.now();
        setCurrentTime(0);
      } else {
        startTimeRef.current = Date.now() - currentTime * 1000;
      }
      setIsPlaying(true);
    }
  };

  // Handle Prompt-to-Motion Generation
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) {
      failure("Prompt Required", "Please enter a descriptive prompt.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStatus("Synthesizing vector motion curves...");

    try {
      addChatConversation({
        title: promptText.slice(0, 32),
        prompt: promptText.trim(),
        category: activeStyle,
      }).catch(() => {});

      await new Promise((r) => setTimeout(r, 400));
      setGenerationProgress(50);
      setGenerationStatus("Computing spring physics & Bezier keyframes...");

      await new Promise((r) => setTimeout(r, 450));
      setGenerationProgress(85);
      setGenerationStatus("Compiling 60 FPS GPU render shaders...");

      await new Promise((r) => setTimeout(r, 350));
      setGenerationProgress(100);

      // Update current project
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? {
                ...p,
                prompt: promptText.trim(),
                category: activeStyle,
                text: liveText,
                updatedAt: "Just now",
              }
            : p
        )
      );

      // Start playing newly generated motion once, then stop!
      startTimeRef.current = Date.now();
      setCurrentTime(0);
      setIsPlaying(true);
      success("Motion Generated", `Rendered 60FPS ${activeStyle} composition.`);
    } catch {
      failure("Error", "Could not generate motion.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStatus("");
    }
  };

  // Handle Character Vectorizer Submission
  const handleRunVectorizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charInput.trim()) {
      failure("Input Required", "Enter text to vectorize.");
      return;
    }

    setIsConvertingChar(true);
    try {
      await addCharConversion({
        text: charInput.trim().toUpperCase(),
        effect: charEffect,
      });

      setLiveText(charInput.trim().toUpperCase());
      setActiveStyle("Kinetic Typography");
      setWorkspaceMode("prompt");
      startTimeRef.current = Date.now();
      setCurrentTime(0);
      setIsPlaying(true);
      success("Characters Vectorized", `Vectorized "${charInput.trim()}" into kinetic glyphs.`);
    } catch {
      setLiveText(charInput.trim().toUpperCase());
      setActiveStyle("Kinetic Typography");
      setWorkspaceMode("prompt");
      setIsPlaying(true);
      success("Vector Glyphs Ready", `Rendered "${charInput.trim()}" on canvas.`);
    } finally {
      setIsConvertingChar(false);
    }
  };

  // Helper: Copy Prompt
  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    success("Copied", "Prompt copied to clipboard.");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Helper: Export
  const handleExport = (format: string) => {
    success("Export Started", `Queued ${format} video export at 60 FPS (${aspectRatio}).`);
  };

  // Switch / Upgrade Plan live
  const handleSwitchPlan = async (tier: PlanTier) => {
    if (tier === userPlan && billingInterval === userPlanInterval) {
      success("Active Plan", `You are already on the ${tier.toUpperCase()} plan.`);
      return;
    }

    setIsUpdatingPlan(true);
    setSelectedTierForUpdate(tier);

    try {
      if (user) {
        const res = await api.user.updatePlan(tier, billingInterval);
        await refreshUser();
        success(
          "Subscription Updated",
          `Your workspace has been upgraded to ${res.user.plan.tier.toUpperCase()} (${billingInterval}).`
        );
      } else {
        window.location.href = `/register?plan=${tier}`;
      }
    } catch (err: any) {
      failure("Update Failed", err.message || "Failed to modify subscription plan.");
    } finally {
      setIsUpdatingPlan(false);
      setSelectedTierForUpdate(null);
    }
  };

  // Top Up On-Demand Credits
  const handleTopUpCredits = (amount: number, price: string) => {
    setExtraCredits((prev) => prev + amount);
    success(
      "Compute Credits Added",
      `Added +${amount} On-Demand Generations (${price}) to your workspace balance.`
    );
  };

  // Refresh Quotas from backend
  const handleRefreshQuotas = async () => {
    setIsRefreshingQuotas(true);
    try {
      await refreshUser();
      success("Quotas Refreshed", "Synchronized live compute consumption with cloud GPU cluster.");
    } catch {
      failure("Error", "Could not synchronize quotas.");
    } finally {
      setIsRefreshingQuotas(false);
    }
  };

  // User Plan & Usage Details
  const userPlan: PlanTier = (user?.plan?.tier as PlanTier) || "pro";
  const userPlanInterval: BillingInterval =
    (user?.plan?.billingInterval as BillingInterval) || "annual";
  const userDisplayName = user?.name || "Pro Creator";
  const userEmail = user?.email || "studio@animagent.ai";

  // Real-time usage calculation
  const genUsed = (user?.usage?.generations?.monthly ?? 42) + extraCredits;
  const genLimit =
    user?.usage?.generations?.limit ??
    (userPlan === "free" ? 10 : userPlan === "creator" ? 150 : userPlan === "enterprise" ? 10000 : 600);
  const genPercent = Math.min(100, Math.round((genUsed / genLimit) * 100));

  const rendersUsed = user?.usage?.renders?.monthly ?? 8;
  const rendersLimit =
    user?.usage?.renders?.limit ??
    (userPlan === "free" ? 2 : userPlan === "creator" ? 20 : userPlan === "enterprise" ? 500 : 50);
  const rendersPercent = Math.min(100, Math.round((rendersUsed / rendersLimit) * 100));

  const apiUsed = user?.usage?.apiCalls?.monthly ?? 1420;
  const apiLimit =
    user?.usage?.apiCalls?.limit ??
    (userPlan === "free" ? 100 : userPlan === "creator" ? 2500 : userPlan === "enterprise" ? 100000 : 10000);
  const apiPercent = Math.min(100, Math.round((apiUsed / apiLimit) * 100));

  const storageUsedBytes = user?.usage?.storage?.usedBytes ?? 1.4 * 1024 * 1024 * 1024;
  const storageLimitBytes =
    user?.usage?.storage?.limitBytes ??
    (userPlan === "free"
      ? 500 * 1024 * 1024
      : userPlan === "creator"
      ? 10 * 1024 * 1024 * 1024
      : userPlan === "enterprise"
      ? 500 * 1024 * 1024 * 1024
      : 50 * 1024 * 1024 * 1024);
  const storageUsedGB = (storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const storageLimitGB = Math.round(storageLimitBytes / (1024 * 1024 * 1024));
  const storagePercent = Math.min(100, Math.round((storageUsedBytes / storageLimitBytes) * 100));

  // Pricing Tiers Data
  const pricingTiers: Array<{
    id: PlanTier;
    name: string;
    badge: string | null;
    priceMonthly: number;
    priceAnnual: number;
    description: string;
    highlighted: boolean;
    features: string[];
  }> = [
    {
      id: "free",
      name: "Free Community",
      badge: null,
      priceMonthly: 0,
      priceAnnual: 0,
      description: "Experiment with procedural motion graphics and basic SVG text animations.",
      highlighted: false,
      features: [
        "10 AI Generations / month",
        "720p 30FPS Web Preview Export",
        "Standard SVG Typography & Keyframes",
        "Community Showcase Access",
        "Shared Community GPU Queue",
      ],
    },
    {
      id: "creator",
      name: "Creator",
      badge: null,
      priceMonthly: 29,
      priceAnnual: 22,
      description: "For freelance animators, motion designers, and indie creative creators.",
      highlighted: false,
      features: [
        "150 AI Motion Generations / month",
        "1080p 60FPS MP4 & WebM Video Export",
        "Full Lottie JSON & Web Vector Glyphs",
        "Kinetic 3D Typography & Logo Reveals",
        "Standard Cloud GPU Queue",
        "Commercial Usage & Monetization Rights",
      ],
    },
    {
      id: "pro",
      name: "Studio Pro",
      badge: "Most Popular",
      priceMonthly: 79,
      priceAnnual: 59,
      description: "For design agencies, motion studios, and production teams scaling output.",
      highlighted: true,
      features: [
        "600 AI Motion Generations / month",
        "4K Lossless 60FPS Apple ProRes & MP4",
        "Editable After Effects (.aep) Export",
        "Priority High-Speed GPU Render Cluster",
        "Advanced 3D Camera Controls & Physics",
        "Custom Brand Color Palettes & Fonts",
        "Shared Team Workspace (Up to 5 Seats)",
        "Developer API Access (60 req/min)",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      badge: "Custom Scale",
      priceMonthly: 199,
      priceAnnual: 159,
      description: "For production houses, broadcast networks, and high-volume automated pipelines.",
      highlighted: false,
      features: [
        "10,000 Generations & Unlimited Renders",
        "Fine-Tuned AI Models on Your Brand Assets",
        "Headless API Access & Webhook Integrations",
        "Dedicated Private GPU Cluster (Zero Queue)",
        "Enterprise SLA & 99.99% Uptime Guarantee",
        "Dedicated Account Manager & 24/7 Support",
        "Custom Invoicing & SSO / SAML Security",
      ],
    },
  ];

  // Invoices list for billing view
  const invoices = [
    {
      id: "INV-2026-0901",
      date: "Sep 01, 2026",
      description: `${userPlan === "pro" ? "Studio Pro" : userPlan === "creator" ? "Creator" : "Community"} - Annual Subscription`,
      amount: userPlan === "pro" ? "$59.00 USD" : userPlan === "creator" ? "$22.00 USD" : "$0.00 USD",
      status: "paid",
    },
    {
      id: "INV-2026-0801",
      date: "Aug 01, 2026",
      description: "Studio Pro - Annual Subscription",
      amount: "$59.00 USD",
      status: "paid",
    },
    {
      id: "INV-2026-0701",
      date: "Jul 01, 2026",
      description: "Creator Plan - Monthly Subscription",
      amount: "$29.00 USD",
      status: "paid",
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#121013] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* ==================================================================== */}
      {/* 1. CLEAN PRO SIDEBAR (Fixed 240px width, zero clutter, single dock) */}
      {/* ==================================================================== */}
      <aside className="w-[240px] shrink-0 border-r border-white/[0.08] bg-[#0c0c11]/95 backdrop-blur-2xl flex flex-col justify-between h-full z-20 select-none">
        {/* Top Brand & Nav */}
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
          {/* Brand Header */}
          <div className="h-14 flex items-center px-4 border-b border-white/[0.08]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <FiZap className="w-4 h-4 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs tracking-tight text-white leading-tight">
                  Animagent
                </span>
                <span className="text-[9px] font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                  STUDIO {userPlan}
                </span>
              </div>
            </Link>
          </div>

          {/* Primary Navigation Links */}
          <nav className="p-2.5 space-y-1">
            <button
              type="button"
              onClick={() => setWorkspaceMode("prompt")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                workspaceMode === "prompt"
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <FiZap className="w-4 h-4 text-cyan-400" />
              <span>Motion Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkspaceMode("vectorizer")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                workspaceMode === "vectorizer"
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <FiType className="w-4 h-4 text-purple-400" />
              <span>Char Vectorizer</span>
            </button>

            {/* In-Workspace Usage & Quotas Tab */}
            <button
              type="button"
              onClick={() => setWorkspaceMode("usage")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                workspaceMode === "usage"
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FiActivity className="w-4 h-4 text-emerald-400" />
                <span>Usages &amp; Quotas</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-emerald-300">
                {genPercent}%
              </span>
            </button>

            {/* In-Workspace Plans & Pricing Tab */}
            <button
              type="button"
              onClick={() => setWorkspaceMode("billing")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                workspaceMode === "billing"
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FiTag className="w-4 h-4 text-amber-400" />
                <span>Plans &amp; Pricing</span>
              </div>
              {userPlan !== "enterprise" && (
                <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  UPGRADE
                </span>
              )}
            </button>

            <Link
              href="/explore"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              <FiCompass className="w-4 h-4" />
              <span>Explore Templates</span>
            </Link>

            <Link
              href="/api-keys"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              <FiKey className="w-4 h-4" />
              <span>Developer API</span>
            </Link>
          </nav>

          {/* Compositions & Recent Projects Section */}
          <div className="px-2.5 pt-2 border-t border-white/[0.06] flex-1">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Recent Projects
              </span>
              <button
                type="button"
                onClick={() => {
                  const newId = `p-${Date.now()}`;
                  const newProj: ProjectItem = {
                    id: newId,
                    name: `Scene #${projects.length + 1}`,
                    category: "Kinetic Typography",
                    duration: 5,
                    prompt: "New generative typography scene...",
                    text: "NEW SCENE",
                    updatedAt: "Just now",
                  };
                  setProjects([newProj, ...projects]);
                  setActiveProjectId(newId);
                  setWorkspaceMode("prompt");
                  success("New Project", "Created new studio project.");
                }}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Create New Project"
              >
                <FiPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {projects.map((proj) => {
                const isActive = proj.id === activeProject.id && workspaceMode === "prompt";
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      setWorkspaceMode("prompt");
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? "bg-white/10 text-white font-medium border border-white/10"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="truncate flex-1 text-[11px]">{proj.name}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ml-2 ${
                        isActive ? "bg-cyan-400 shadow-[0_0_6px_#00f0ff]" : "bg-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Bottom: Live Compute Quota + Integrated User Card Dock */}
        <div className="p-2.5 border-t border-white/[0.06] bg-[#090a0f] space-y-2">
          {/* Compact Compute Quota */}
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1">
                <FiCpu className="w-3 h-3 text-cyan-400" />
                Compute Quota
              </span>
              <span className="text-[9px] font-mono text-cyan-400 font-bold">
                {genUsed} / {genLimit}
              </span>
            </div>

            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  genPercent > 85
                    ? "bg-amber-400 shadow-[0_0_6px_#f59e0b]"
                    : "bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_6px_#00f0ff]"
                }`}
                style={{ width: `${Math.max(4, genPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] pt-0.5">
              <button
                type="button"
                onClick={() => setWorkspaceMode("usage")}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Quotas ({genPercent}%) →
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceMode("billing")}
                className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Upgrade
              </button>
            </div>
          </div>

          {/* Clean Integrated User Dock (No duplicate buttons, elevated above bottom-left corner) */}
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div
              onClick={() => setWorkspaceMode("billing")}
              className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
              title="Manage Plan & Billing"
            >
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 font-bold text-xs text-white shadow-sm">
                {userDisplayName.charAt(0).toUpperCase()}
                <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#090a0f]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {userDisplayName}
                  </span>
                  <span className="px-1 py-0.2 rounded text-[8px] font-mono uppercase bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shrink-0">
                    {userPlan}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 truncate block">
                  {userEmail}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <FiLogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* 2. MAIN WORKSPACE VIEWPORT (Clean, Spacious, Zero Ugly Scrollbars) */}
      {/* ==================================================================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#121013] relative">
        {/* Signature Interactive Spider-Man / Spider Net Canvas Background */}
        <SpiderNetBackground opacity={0.88} />
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#121013]/60 via-transparent to-[#121013]/85"
          aria-hidden="true"
        />

        {/* Top Studio Control Header */}
        <header className="relative z-10 h-14 shrink-0 border-b border-white/[0.08] bg-[#121013]/85 backdrop-blur-xl px-5 flex items-center justify-between">
          {workspaceMode === "prompt" ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-white tracking-wide">
                  {activeProject.name}
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-cyan-300 border border-white/10">
                  {activeStyle}
                </span>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>60 FPS GPU Sync</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Aspect Ratio Switcher */}
                <div className="hidden sm:flex items-center bg-black/40 border border-white/[0.08] p-0.5 rounded-lg">
                  {(["16:9", "9:16", "1:1"] as AspectRatio[]).map((aspect) => (
                    <button
                      key={aspect}
                      type="button"
                      onClick={() => setAspectRatio(aspect)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all cursor-pointer ${
                        aspectRatio === aspect
                          ? "bg-white/15 text-cyan-300 font-semibold shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {aspect}
                    </button>
                  ))}
                </div>

                {/* Quick Prompt Copy */}
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
                  title="Copy Prompt"
                >
                  {copiedPrompt ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
                </button>

                {/* Export Action */}
                <button
                  type="button"
                  onClick={() => handleExport("MP4 60FPS")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 transition-all shadow-sm cursor-pointer"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Export Video</span>
                </button>
              </div>
            </>
          ) : workspaceMode === "vectorizer" ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-white">
                  Character Vectorizer Engine
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Procedural Glyphs
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWorkspaceMode("prompt")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Motion Studio</span>
              </button>
            </div>
          ) : workspaceMode === "usage" ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-white">
                  Usages &amp; Compute Quotas
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cycle Resets in 24 Days
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleRefreshQuotas}
                  disabled={isRefreshingQuotas}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
                >
                  <FiRefreshCw className={`w-3.5 h-3.5 ${isRefreshingQuotas ? "animate-spin" : ""}`} />
                  <span>Sync Quotas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkspaceMode("billing")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer shadow-sm"
                >
                  Upgrade Tier
                </button>
                <button
                  type="button"
                  onClick={() => setWorkspaceMode("prompt")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  <span>Studio</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-white">
                  Plans &amp; Pricing Management
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Zero Lock-In
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setWorkspaceMode("usage")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
                >
                  <FiActivity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Quotas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkspaceMode("prompt")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  <span>Studio</span>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Center Workspace Stage (Clean, Scrollbar-hidden, Perfectly Sized) */}
        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-4 max-w-5xl mx-auto w-full flex flex-col justify-center">
          {/* ================================================================ */}
          {/* A. MOTION STUDIO VIEW (Canvas Player & Unified Command Bar) */}
          {/* ================================================================ */}
          {workspaceMode === "prompt" && (
            <div className="flex flex-col items-center justify-center w-full space-y-3.5 my-auto">
              {/* Svelte Canvas Player Viewport (Clean, Scaled, Transport Docked) */}
              <div
                ref={canvasContainerRef}
                className={`relative rounded-2xl bg-[#030406] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col w-full transition-all duration-300 ${
                  aspectRatio === "16:9"
                    ? "max-w-3xl aspect-[16/9] max-h-[50vh]"
                    : aspectRatio === "9:16"
                    ? "max-w-xs aspect-[9/16] max-h-[55vh]"
                    : "max-w-md aspect-square max-h-[50vh]"
                }`}
              >
                {/* 60FPS Canvas */}
                <div className="relative w-full flex-1 overflow-hidden">
                  <canvas ref={canvasRef} className="w-full h-full object-cover select-none" />

                  {/* Status Overlay Badge */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300 font-semibold">
                      1080p • 60 FPS
                    </span>
                  </div>

                  {/* Click-to-Play Center Overlay when paused */}
                  {!isPlaying && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/15 cursor-pointer group transition-all"
                      title="Click to Play"
                    >
                      <div className="w-13 h-13 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-cyan-400/80 group-hover:text-cyan-300 transition-all shadow-xl">
                        <FiPlay className="w-6 h-6 ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Generation Progress Overlay */}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2.5 z-30">
                      <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-white">{generationStatus}</span>
                      <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_#00f0ff]"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Integrated Transport Control Dock (Clean, DaVinci/Runway style) */}
                <div className="h-11 shrink-0 bg-[#090b10]/95 border-t border-white/[0.08] px-3.5 flex items-center gap-2.5 select-none">
                  {/* Play / Pause Toggle */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-7 h-7 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
                    title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                  >
                    {isPlaying ? <FiPause className="w-3.5 h-3.5" /> : <FiPlay className="w-3.5 h-3.5 ml-0.5" />}
                  </button>

                  {/* Loop Toggle: Default OFF (Does not endlessly loop) */}
                  <button
                    type="button"
                    onClick={() => setIsLooping(!isLooping)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      isLooping ? "text-cyan-400 bg-cyan-500/15" : "text-slate-500 hover:text-slate-300"
                    }`}
                    title={isLooping ? "Loop Enabled" : "Loop Disabled (Plays once)"}
                  >
                    <FiRepeat className="w-3.5 h-3.5" />
                  </button>

                  {/* Progress Scrub Slider */}
                  <div className="flex-1 flex items-center px-1">
                    <input
                      type="range"
                      min="0"
                      max={activeProject.duration}
                      step="0.01"
                      value={currentTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCurrentTime(val);
                        startTimeRef.current = Date.now() - val * 1000;
                      }}
                      className="w-full accent-cyan-400 cursor-pointer h-1 bg-white/15 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Timecode */}
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    00:0{currentTime.toFixed(1)} / 00:0{activeProject.duration}.0
                  </span>
                </div>
              </div>

              {/* Unified Prompt Command Bar (Compact, Pristine, Single-row structure) */}
              <div className="w-full max-w-3xl space-y-2.5">
                <form
                  onSubmit={handleGenerate}
                  className="relative flex items-center bg-[#0d0f17] border border-white/[0.14] focus-within:border-cyan-400/80 rounded-2xl shadow-xl p-1.5 transition-all gap-2"
                >
                  <div className="pl-2.5 text-cyan-400 shrink-0">
                    <FiZap className="w-4 h-4" />
                  </div>

                  <input
                    type="text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe the motion graphic you want to generate..."
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none py-1.5 px-1 font-sans"
                  />

                  {/* Integrated Style Preset Selector (Saves an entire row of clutter!) */}
                  <div className="shrink-0 hidden sm:block">
                    <select
                      value={activeStyle}
                      onChange={(e) => setActiveStyle(e.target.value as StylePreset)}
                      className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="Kinetic Typography" className="bg-[#12141d] text-white">Kinetic Typography</option>
                      <option value="3D Isometric" className="bg-[#12141d] text-white">3D Isometric</option>
                      <option value="Logo Reveal" className="bg-[#12141d] text-white">Logo Reveal</option>
                      <option value="Abstract VFX" className="bg-[#12141d] text-white">Abstract VFX</option>
                      <option value="UI & Lottie" className="bg-[#12141d] text-white">UI &amp; Lottie</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold transition-all shadow-sm active:scale-[0.98] shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate</span>
                        <FiArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Compact Single-Row Inspiration Presets (Eliminates vertical clutter & scrollbars) */}
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold shrink-0 mr-1">
                      Presets:
                    </span>
                    {inspirationPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPromptText(preset.prompt);
                          setActiveStyle(preset.category);
                          setLiveText(preset.text);
                          success("Preset Loaded", `Loaded "${preset.title}".`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-400/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <span>{preset.icon}</span>
                        <span>{preset.title}</span>
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 hidden md:inline shrink-0 pl-2">
                    [Space] Play / Pause
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* B. CHARACTER VECTORIZER VIEW */}
          {/* ================================================================ */}
          {workspaceMode === "vectorizer" && (
            <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.12] space-y-5 my-auto">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FiType className="text-cyan-400" />
                  Character Vectorizer Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Convert any raw typography or words into procedural vector glyph keyframes with physics.
                </p>
              </div>

              <form onSubmit={handleRunVectorizer} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Text Characters</label>
                  <input
                    type="text"
                    value={charInput}
                    onChange={(e) => setCharInput(e.target.value)}
                    placeholder="e.g. ANIMAGENT"
                    className="w-full bg-[#12141d] border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Animation Effect</label>
                  <select
                    value={charEffect}
                    onChange={(e) => setCharEffect(e.target.value as any)}
                    className="w-full bg-[#12141d] border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  >
                    <option value="kinetic_split">Kinetic Split</option>
                    <option value="neon_glow">Neon Glow</option>
                    <option value="wave">Harmonic Wave</option>
                    <option value="glitch">Digital Glitch</option>
                    <option value="isometric">3D Isometric</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setWorkspaceMode("prompt")}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.04] border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isConvertingChar}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isConvertingChar ? (
                      <>
                        <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <FiZap className="w-3.5 h-3.5" />
                        <span>Vectorize Characters</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================ */}
          {/* C. USAGE & COMPUTE QUOTAS VIEW */}
          {/* ================================================================ */}
          {workspaceMode === "usage" && (
            <div className="space-y-5 max-w-4xl mx-auto w-full my-auto py-2">
              {/* Status Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-[#13151f] to-indigo-950/20 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      Tier: {userPlan}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Cycle: Sep 01 – Oct 01, 2026
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Workspace Compute Quotas
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Next reset in 24 days</span>
                </div>
              </div>

              {/* 4 Core Usage Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Generations */}
                <div className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <FiZap className="w-3.5 h-3.5 text-cyan-400" />
                      Generations
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {genPercent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-bold text-white font-mono">
                      {genUsed}{" "}
                      <span className="text-[11px] text-slate-500 font-normal font-sans">
                        / {genLimit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full shadow-[0_0_6px_#00f0ff]"
                        style={{ width: `${genPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Daily: 3 / 50</span>
                    <span>Left: {Math.max(0, genLimit - genUsed)}</span>
                  </div>
                </div>

                {/* 2. 4K ProRes Renders */}
                <div className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <FiLayers className="w-3.5 h-3.5 text-purple-400" />
                      4K Renders
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-300">
                      {rendersPercent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-bold text-white font-mono">
                      {rendersUsed}{" "}
                      <span className="text-[11px] text-slate-500 font-normal font-sans">
                        / {rendersLimit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 rounded-full shadow-[0_0_6px_#a855f7]"
                        style={{ width: `${rendersPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>60 FPS ProRes</span>
                    <span>Left: {Math.max(0, rendersLimit - rendersUsed)}</span>
                  </div>
                </div>

                {/* 3. API Calls */}
                <div className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <FiKey className="w-3.5 h-3.5 text-emerald-400" />
                      API Calls
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {apiPercent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-bold text-white font-mono">
                      {apiUsed.toLocaleString()}{" "}
                      <span className="text-[11px] text-slate-500 font-normal font-sans">
                        / {apiLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full shadow-[0_0_6px_#10b981]"
                        style={{ width: `${apiPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Rate: 60 req/min</span>
                    <span>Left: {(apiLimit - apiUsed).toLocaleString()}</span>
                  </div>
                </div>

                {/* 4. Cloud Storage */}
                <div className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <FiDatabase className="w-3.5 h-3.5 text-amber-400" />
                      Storage
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {storagePercent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-bold text-white font-mono">
                      {storageUsedGB}{" "}
                      <span className="text-[11px] text-slate-500 font-normal font-sans">
                        / {storageLimitGB} GB
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full shadow-[0_0_6px_#f59e0b]"
                        style={{ width: `${storagePercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Render Cache</span>
                    <span>Available: {(storageLimitGB - parseFloat(storageUsedGB)).toFixed(1)} GB</span>
                  </div>
                </div>
              </div>

              {/* Instant Credit Top-Ups */}
              <div className="p-5 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FiTrendingUp className="text-cyan-400" />
                    Instant On-Demand Credit Top-Ups
                  </h3>
                  {extraCredits > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      +{extraCredits} Credits Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">+100 Runs</div>
                      <span className="text-[10px] font-mono text-cyan-400">$9 USD</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTopUpCredits(100, "$9")}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>+500 Runs</span>
                        <span className="px-1 rounded text-[8px] font-mono bg-cyan-400 text-slate-950 font-bold">PRO</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">$39 USD</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTopUpCredits(500, "$39")}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">+1,500 Runs</div>
                      <span className="text-[10px] font-mono text-purple-300">$99 USD</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTopUpCredits(1500, "$99")}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* D. PLANS & PRICING IN-WORKSPACE VIEW */}
          {/* ================================================================ */}
          {workspaceMode === "billing" && (
            <div className="space-y-6 max-w-4xl mx-auto w-full my-auto py-2">
              {/* Header & Interval Switcher */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Plans &amp; Subscription Pricing
                  </h2>
                  <p className="text-xs text-slate-400">
                    Switch compute capacity anytime. Changes take effect instantly.
                  </p>
                </div>

                <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingInterval("monthly")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      billingInterval === "monthly"
                        ? "bg-white/15 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingInterval("annual")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      billingInterval === "annual"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Annual</span>
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-cyan-400 text-slate-950 font-bold">
                      SAVE 25%
                    </span>
                  </button>
                </div>
              </div>

              {/* 4 Pricing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {pricingTiers.map((tier) => {
                  const isCurrent = tier.id === userPlan;
                  const price = billingInterval === "annual" ? tier.priceAnnual : tier.priceMonthly;

                  return (
                    <div
                      key={tier.id}
                      className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-200 ${
                        tier.highlighted
                          ? "bg-[#10131d] border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/10"
                          : isCurrent
                          ? "bg-[#0d0f17] border-2 border-emerald-500/60"
                          : "bg-[#0d0f17] border border-white/[0.08]"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">{tier.name}</h3>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono uppercase bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="pb-2 border-b border-white/[0.08]">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-white font-mono">
                              ${price}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              / mo
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-[11px] text-slate-300">
                          {tier.features.slice(0, 4).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <FiCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/[0.06]">
                        {isCurrent ? (
                          <div className="w-full py-2 rounded-lg text-xs font-semibold bg-white/10 text-slate-300 text-center flex items-center justify-center gap-1.5">
                            <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Active Plan</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSwitchPlan(tier.id)}
                            disabled={isUpdatingPlan}
                            className={`w-full py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              tier.highlighted
                                ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-sm"
                                : "bg-white hover:bg-slate-200 text-slate-950"
                            } disabled:opacity-50`}
                          >
                            {isUpdatingPlan && selectedTierForUpdate === tier.id ? (
                              <span>Updating...</span>
                            ) : (
                              <span>Switch to {tier.name}</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Info & Invoices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FiCreditCard className="text-cyan-400" />
                      Payment Method
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">VISA 4242</span>
                  </div>
                  <div className="text-xs text-slate-400 flex justify-between pt-1">
                    <span>Next charge (Oct 01):</span>
                    <strong className="text-white">${userPlan === "pro" ? 59 : userPlan === "creator" ? 22 : 0}.00 USD</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FiFileText className="text-cyan-400" />
                      Recent Receipt
                    </span>
                    <button
                      type="button"
                      onClick={() => success("Receipt Downloaded", "Downloaded receipt for INV-2026-0901.")}
                      className="text-xs text-cyan-400 hover:underline cursor-pointer"
                    >
                      Download PDF
                    </button>
                  </div>
                  <div className="text-xs text-slate-400 flex justify-between pt-1">
                    <span>INV-2026-0901 (Sep 01)</span>
                    <span className="text-emerald-400 font-mono">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
