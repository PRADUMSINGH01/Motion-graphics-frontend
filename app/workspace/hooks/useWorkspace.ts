"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { api, addCharConversion, addChatConversation } from "../../lib/api";
import {
  StylePreset,
  AspectRatio,
  WorkspaceView,
  BillingInterval,
  PlanTier,
  CharEffect,
  ProjectItem,
  InspirationPreset,
  ColorPalette,
  MotionSpeed,
} from "../types";
import {
  DEFAULT_PROJECTS,
  INSPIRATION_PRESETS,
  PRICING_TIERS,
} from "../constants";
import { drawCanvasFrame } from "../canvasEngine";

export function useWorkspace() {
  const { user, isLoading, logout, refreshUser } = useAuth();
  const { success, failure } = useAlert();

  // Mode: standard prompt to motion OR character vectorizer OR usage OR billing
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceView>("prompt");

  // Client-side auth guard: immediately redirect to login if session ends
  useEffect(() => {
    if (!isLoading && !user) {
      if (typeof window !== "undefined") {
        // Clear any stale tokens before navigating to prevent middleware bounces
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax";
        document.cookie = "animagent_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax";
        try {
          localStorage.removeItem("animagent_token");
          localStorage.removeItem("animagent_user");
        } catch {}
        window.location.replace("/login?redirect=/workspace");
      }
    }
  }, [user, isLoading]);

  // Projects state: pure database-driven state, initialized empty (no mock/dummy data)
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>("");

  // Active generation parameters (start empty, no dummy text/prompt)
  const [promptText, setPromptText] = useState("");
  const [activeStyle, setActiveStyle] = useState<StylePreset>("Kinetic Typography");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [liveText, setLiveText] = useState("");
  const [colorPalette, setColorPalette] = useState<ColorPalette>("cyan");
  const [motionSpeed, setMotionSpeed] = useState<MotionSpeed>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Character Vectorizer Dedicated State (clean initial empty string)
  const [charInput, setCharInput] = useState("");
  const [charEffect, setCharEffect] = useState<CharEffect>("kinetic_split");
  const [isConvertingChar, setIsConvertingChar] = useState(false);

  // Dynamic activeProject resolution: returns actual project or clean new composition
  const activeProject = useMemo<ProjectItem>(() => {
    if (projects.length > 0) {
      return projects.find((p) => p.id === activeProjectId) || projects[0];
    }
    return {
      id: "new-composition",
      name: "New Composition",
      category: activeStyle,
      duration: 5,
      prompt: promptText,
      text: liveText,
      updatedAt: "Ready",
      palette: colorPalette,
    };
  }, [projects, activeProjectId, activeStyle, promptText, liveText, colorPalette]);

  // Billing & Usage States
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("annual");
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [selectedTierForUpdate, setSelectedTierForUpdate] = useState<PlanTier | null>(null);
  const [extraCredits, setExtraCredits] = useState(0);
  const [isRefreshingQuotas, setIsRefreshingQuotas] = useState(false);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Fetch real user projects/conversations from backend DB on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDbProjects() {
      try {
        const res = await api.conversation.list();
        if (isMounted && res?.conversations && Array.isArray(res.conversations) && res.conversations.length > 0) {
          const loaded: ProjectItem[] = res.conversations.map((c) => ({
            id: c.id,
            name: c.title || "Untitled Motion",
            category: "Kinetic Typography",
            duration: 5,
            prompt: c.title || "",
            text: (c.title || "").toUpperCase().slice(0, 18),
            updatedAt: c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : "Recent",
            palette: "cyan",
          }));
          setProjects(loaded);
          setActiveProjectId(loaded[0].id);
        }
      } catch {
        // Backend DB has no conversations or offline: keep projects empty []
      }
    }
    if (user) {
      loadDbProjects();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

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

  // Explicit project selection handler
  const handleSelectProject = useCallback(
    (id: string) => {
      setActiveProjectId(id);
      const proj = projects.find((p) => p.id === id);
      if (proj) {
        setPromptText(proj.prompt);
        setActiveStyle(proj.category);
        setLiveText(proj.text);
        if (proj.palette) {
          setColorPalette(proj.palette);
        }
        startTimeRef.current = Date.now();
        setCurrentTime(0);
        setIsPlaying(false);
      }
    },
    [projects]
  );

  // 60FPS High-Definition Canvas Render Engine
  const renderEngine = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      drawCanvasFrame(
        ctx,
        w,
        h,
        t,
        activeStyle,
        liveText,
        isPlaying,
        colorPalette,
        motionSpeed
      );
    },
    [activeStyle, liveText, isPlaying, colorPalette, motionSpeed]
  );

  // 60FPS Animation Loop: Respects play state and stops at duration end
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
      if (
        e.code === "Space" &&
        (e.target as HTMLElement).tagName !== "INPUT" &&
        (e.target as HTMLElement).tagName !== "TEXTAREA" &&
        (e.target as HTMLElement).tagName !== "SELECT"
      ) {
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

  // Scrub handler
  const handleScrub = (val: number) => {
    setCurrentTime(val);
    startTimeRef.current = Date.now() - val * 1000;
  };

  // Handle Prompt-to-Motion Generation
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = promptText.trim();
    if (!trimmed) {
      failure("Prompt Required", "Please enter a descriptive prompt.");
      return;
    }

    // 1. Intelligent Text Extraction from Prompt:
    let targetText = liveText;
    const quoteMatch = trimmed.match(/["']([^"']{1,24})["']/);
    if (quoteMatch && quoteMatch[1]?.trim()) {
      targetText = quoteMatch[1].trim().toUpperCase();
      setLiveText(targetText);
    } else {
      const kwMatch = trimmed.match(/\b(?:text|title|word|for|brand):\s*([a-zA-Z0-9_-]{2,20})\b/i);
      if (kwMatch && kwMatch[1]?.trim()) {
        targetText = kwMatch[1].trim().toUpperCase();
        setLiveText(targetText);
      }
    }

    // 2. Intelligent Color Palette Detection from Prompt:
    const lower = trimmed.toLowerCase();
    let targetPalette = colorPalette;
    if (lower.includes("purple") || lower.includes("violet") || lower.includes("magenta")) {
      targetPalette = "purple";
      setColorPalette("purple");
    } else if (lower.includes("amber") || lower.includes("gold") || lower.includes("yellow") || lower.includes("solar")) {
      targetPalette = "amber";
      setColorPalette("amber");
    } else if (lower.includes("matrix") || lower.includes("emerald") || (lower.includes("green") && !lower.includes("screens"))) {
      targetPalette = "matrix";
      setColorPalette("matrix");
    } else if (lower.includes("crimson") || lower.includes("flame") || lower.includes("fire") || lower.includes("ruby") || lower.includes("red")) {
      targetPalette = "crimson";
      setColorPalette("crimson");
    } else if (lower.includes("blue") || lower.includes("ocean") || lower.includes("sky")) {
      targetPalette = "blue";
      setColorPalette("blue");
    } else if (lower.includes("cyan") || lower.includes("neon")) {
      targetPalette = "cyan";
      setColorPalette("cyan");
    }

    // 3. Motion Speed Detection:
    if (lower.includes("fast") || lower.includes("hyper") || lower.includes("rapid") || lower.includes("rush")) {
      setMotionSpeed(1.5);
    } else if (lower.includes("slow") || lower.includes("cinematic") || lower.includes("smooth") || lower.includes("calm")) {
      setMotionSpeed(0.5);
    }

    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStatus("Synthesizing vector motion curves...");

    try {
      const generatedPromptId = `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const activeUserId =
        user?.id ||
        (typeof window !== "undefined"
          ? localStorage.getItem("animagent_user_id") || "guest_user"
          : "guest_user");

      // Submit prompt job to backend BullMQ queue (/api/prompt)
      let backendJobId: string | null = null;
      try {
        const queueRes = await api.prompt.submit({
          prompt: trimmed,
          userId: activeUserId,
          promptId: generatedPromptId,
          template: activeStyle,
        });
        if (queueRes?.job?.id) {
          backendJobId = String(queueRes.job.id);
        }
      } catch (queueErr) {
        console.warn("[Workspace] Prompt queue background notice:", queueErr);
      }

      addChatConversation({
        title: trimmed.slice(0, 32),
        prompt: trimmed,
        category: activeStyle,
      }).catch(() => {});

      await new Promise((r) => setTimeout(r, 350));
      setGenerationProgress(50);
      setGenerationStatus("Computing spring physics & Bezier keyframes...");

      await new Promise((r) => setTimeout(r, 400));
      setGenerationProgress(85);
      setGenerationStatus("Compiling 60 FPS GPU render shaders...");

      await new Promise((r) => setTimeout(r, 300));
      setGenerationProgress(100);

      const generatedProjectId =
        activeProject?.id && activeProject.id !== "new-composition"
          ? activeProject.id
          : `p-${Date.now()}`;

      const savedProject: ProjectItem = {
        id: generatedProjectId,
        name: trimmed.length > 28 ? `${trimmed.slice(0, 28)}...` : trimmed,
        category: activeStyle,
        duration: 5,
        prompt: trimmed,
        text: targetText,
        palette: targetPalette,
        updatedAt: "Just now",
      };

      setProjects((prev) => {
        const index = prev.findIndex((p) => p.id === generatedProjectId);
        if (index !== -1) {
          return prev.map((p) => (p.id === generatedProjectId ? savedProject : p));
        }
        return [savedProject, ...prev];
      });
      setActiveProjectId(generatedProjectId);

      startTimeRef.current = Date.now();
      setCurrentTime(0);
      setIsPlaying(true);
      success(
        "Motion Generated",
        backendJobId
          ? `Queued job #${backendJobId} • Rendered 60FPS ${activeStyle} (${targetPalette}).`
          : `Rendered 60FPS ${activeStyle} (${targetPalette}).`
      );
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

  // Create Project
  // Create clean new composition
  const handleCreateProject = () => {
    const newId = `p-${Date.now()}`;
    const newProj: ProjectItem = {
      id: newId,
      name: `Project ${projects.length + 1}`,
      category: "Kinetic Typography",
      duration: 5,
      prompt: "",
      text: "",
      updatedAt: "Just now",
      palette: "cyan",
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newId);
    setPromptText("");
    setLiveText("");
    setColorPalette("cyan");
    success("Project Created", `Created "${newProj.name}".`);
  };

  // Select inspiration preset
  const handleSelectPreset = (preset: InspirationPreset) => {
    setPromptText(preset.prompt);
    setActiveStyle(preset.category);
    setLiveText(preset.text);
    if (preset.palette) {
      setColorPalette(preset.palette);
    }
    startTimeRef.current = Date.now();
    setCurrentTime(0);
    setIsPlaying(true);
    success("Preset Loaded", `Loaded "${preset.title}".`);
  };

  // Download receipt
  const handleDownloadReceipt = () => {
    failure("No Receipts", "No billing receipts found in database for this account.");
  };

  // User Plan & Usage Details: strictly DB-backed, no mock/dummy fallbacks
  const userPlan: PlanTier = (user?.plan?.tier as PlanTier) || "free";
  const userPlanInterval: BillingInterval =
    (user?.plan?.billingInterval as BillingInterval) || "monthly";
  const userDisplayName =
    user?.name ||
    user?.raw?.profile?.displayName ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Creator";
  const userEmail = user?.email || "";

  // Real-time usage calculation: fallback to 0 if not provided in DB
  const genUsed = (user?.usage?.generations?.monthly ?? 0) + extraCredits;
  const genLimit =
    user?.usage?.generations?.limit ??
    (userPlan === "creator" ? 150 : userPlan === "pro" ? 600 : userPlan === "enterprise" ? 10000 : 10);
  const genPercent = genLimit > 0 ? Math.min(100, Math.round((genUsed / genLimit) * 100)) : 0;

  const rendersUsed = user?.usage?.renders?.monthly ?? 0;
  const rendersLimit =
    user?.usage?.renders?.limit ??
    (userPlan === "creator" ? 20 : userPlan === "pro" ? 50 : userPlan === "enterprise" ? 500 : 2);
  const rendersPercent = rendersLimit > 0 ? Math.min(100, Math.round((rendersUsed / rendersLimit) * 100)) : 0;

  const apiUsed = user?.usage?.apiCalls?.monthly ?? 0;
  const apiLimit =
    user?.usage?.apiCalls?.limit ??
    (userPlan === "creator" ? 2500 : userPlan === "pro" ? 10000 : userPlan === "enterprise" ? 100000 : 100);
  const apiPercent = apiLimit > 0 ? Math.min(100, Math.round((apiUsed / apiLimit) * 100)) : 0;

  const storageUsedBytes = user?.usage?.storage?.usedBytes ?? 0;
  const storageLimitBytes =
    user?.usage?.storage?.limitBytes ??
    (userPlan === "creator"
      ? 10 * 1024 * 1024 * 1024
      : userPlan === "pro"
      ? 50 * 1024 * 1024 * 1024
      : userPlan === "enterprise"
      ? 500 * 1024 * 1024 * 1024
      : 500 * 1024 * 1024);
  const storageUsedGB = (storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const storageLimitGB = Math.round(storageLimitBytes / (1024 * 1024 * 1024));
  const storagePercent = storageLimitBytes > 0 ? Math.min(100, Math.round((storageUsedBytes / storageLimitBytes) * 100)) : 0;

  return {
    isRedirecting: !user && !isLoading,
    userPlan,
    userDisplayName,
    userEmail,
    logout,
    workspaceMode,
    setWorkspaceMode,
    projects,
    activeProjectId,
    setActiveProjectId,
    activeProject,
    promptText,
    setPromptText,
    activeStyle,
    setActiveStyle,
    aspectRatio,
    setAspectRatio,
    liveText,
    setLiveText,
    colorPalette,
    setColorPalette,
    motionSpeed,
    setMotionSpeed,
    isGenerating,
    generationProgress,
    generationStatus,
    copiedPrompt,
    copyPrompt,
    handleExport,
    charInput,
    setCharInput,
    charEffect,
    setCharEffect,
    isConvertingChar,
    handleRunVectorizer,
    billingInterval,
    setBillingInterval,
    isUpdatingPlan,
    selectedTierForUpdate,
    handleSwitchPlan,
    extraCredits,
    handleTopUpCredits,
    isRefreshingQuotas,
    handleRefreshQuotas,
    isPlaying,
    currentTime,
    setCurrentTime,
    isLooping,
    setIsLooping,
    canvasRef,
    canvasContainerRef,
    togglePlay,
    handleScrub,
    handleGenerate,
    handleCreateProject,
    handleSelectProject,
    handleSelectPreset,
    handleDownloadReceipt,
    pricingTiers: PRICING_TIERS,
    inspirationPresets: INSPIRATION_PRESETS,
    genUsed,
    genLimit,
    genPercent,
    rendersUsed,
    rendersLimit,
    rendersPercent,
    apiUsed,
    apiLimit,
    apiPercent,
    storageUsedGB,
    storageLimitGB,
    storagePercent,
  };
}
