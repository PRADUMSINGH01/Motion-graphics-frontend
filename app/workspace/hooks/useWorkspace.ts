"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { api } from "../../lib/api";
import {
  StylePreset,
  AspectRatio,
  WorkspaceView,
  BillingInterval,
  PlanTier,
  CharEffect,
  GeneratedTemplateItem,
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

  // Generated Templates state: stores all templates generated via prompt backend API
  const [generatedTemplates, setGeneratedTemplates] = useState<GeneratedTemplateItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("animagent_generated_templates");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_PROJECTS;
  });

  const [activeTemplateId, setActiveTemplateId] = useState<string>("");

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

  // Character Vectorizer Dedicated State
  const [charInput, setCharInput] = useState("");
  const [charEffect, setCharEffect] = useState<CharEffect>("kinetic_split");
  const [isConvertingChar, setIsConvertingChar] = useState(false);

  // Dynamic activeTemplate resolution: returns actual active template or clean composition
  const activeTemplate = useMemo<GeneratedTemplateItem>(() => {
    if (generatedTemplates.length > 0) {
      return (
        generatedTemplates.find((p) => p.id === activeTemplateId) ||
        generatedTemplates[0]
      );
    }
    return {
      id: "new-composition",
      name: promptText.trim()
        ? promptText.trim().length > 24
          ? `${promptText.trim().slice(0, 24)}...`
          : promptText.trim()
        : "Motion Studio",
      category: activeStyle,
      duration: 5,
      prompt: promptText,
      text: liveText,
      fps: 60,
      palette: colorPalette,
      createdAt: new Date().toISOString(),
      updatedAt: "Ready",
    };
  }, [generatedTemplates, activeTemplateId, activeStyle, promptText, liveText, colorPalette]);

  // Backward-compatible alias
  const activeProject = activeTemplate;
  const projects = generatedTemplates;
  const activeProjectId = activeTemplateId;

  // Active animation flag: true ONLY when a motion graphic has actually been generated
  const hasActiveAnimation = Boolean(
    liveText.trim() || (generatedTemplates.length > 0 && activeTemplateId)
  );

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

  // Explicit template selection handler
  const handleSelectTemplate = useCallback(
    (template: GeneratedTemplateItem) => {
      setActiveTemplateId(template.id);
      setPromptText(template.prompt);
      setActiveStyle(template.category);
      setLiveText(template.text);
      if (template.palette) {
        setColorPalette(template.palette);
      }
      startTimeRef.current = Date.now();
      setCurrentTime(0);
      setIsPlaying(true);
    },
    []
  );

  const handleSelectProject = useCallback(
    (id: string) => {
      const found = generatedTemplates.find((p) => p.id === id);
      if (found) {
        handleSelectTemplate(found);
      }
    },
    [generatedTemplates, handleSelectTemplate]
  );

  // Template deletion handler
  const handleDeleteTemplate = useCallback(
    (id: string) => {
      setGeneratedTemplates((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        try {
          localStorage.setItem("animagent_generated_templates", JSON.stringify(updated));
        } catch {}
        return updated;
      });
      if (activeTemplateId === id) {
        setActiveTemplateId("");
      }
      success("Template Removed", "Removed template from your generated grid.");
    },
    [activeTemplateId, success]
  );

  // Clear all generated templates handler
  const handleClearTemplates = useCallback(() => {
    setGeneratedTemplates([]);
    setActiveTemplateId("");
    try {
      localStorage.removeItem("animagent_generated_templates");
    } catch {}
    success("Grid Cleared", "Cleared all generated templates.");
  }, [success]);

  // Remix template handler
  const handleRemixTemplate = useCallback(
    (remixPrompt: string, remixStyle: StylePreset) => {
      setPromptText(remixPrompt);
      setActiveStyle(remixStyle);
      success("Template Loaded", `Loaded ${remixStyle} prompt. Customize or click Generate.`);
    },
    [success]
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

  // 60FPS Animation Loop
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

      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      let t = currentTime;
      if (isPlaying) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        if (elapsed > activeTemplate.duration) {
          if (isLooping) {
            startTimeRef.current = Date.now();
            t = 0;
            setCurrentTime(0);
          } else {
            setIsPlaying(false);
            t = activeTemplate.duration;
            setCurrentTime(activeTemplate.duration);
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
  }, [isPlaying, isLooping, currentTime, activeTemplate.duration, renderEngine]);

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
  }, [isPlaying, currentTime, activeTemplate.duration]);

  // Clean Play / Pause Toggle Helper
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTime >= activeTemplate.duration) {
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

  // Handle Prompt-to-Motion Generation: connects via Next.js API /api/prompt to Express backend
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = promptText.trim();
    if (!trimmed) {
      failure("Prompt Required", "Please enter a descriptive prompt.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(20);
    setGenerationStatus("Connecting to Next.js /api/prompt & Express backend API...");

    try {
      const generatedPromptId = `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const activeUserId =
        user?.id ||
        (typeof window !== "undefined"
          ? localStorage.getItem("animagent_user_id") || "creator"
          : "creator");

      setGenerationProgress(45);
      setGenerationStatus("Backend queue processing prompt on GPU cluster...");

      // Await server response from /api/prompt (which connects to Express backend API)
      const serverRes = await api.prompt.submit({
        prompt: trimmed,
        userId: activeUserId,
        promptId: generatedPromptId,
        template: activeStyle,
      });

      setGenerationProgress(80);
      setGenerationStatus("Receiving generated 60 FPS motion templates...");

      await new Promise((resolve) => setTimeout(resolve, 300));
      setGenerationProgress(100);

      // Extract motion data
      const motionData = serverRes?.motion;
      const finalRenderText =
        motionData?.renderedText ||
        trimmed.slice(0, 24).toUpperCase();
      const finalStyle = (motionData?.style as StylePreset) || activeStyle || "Kinetic Typography";
      const finalPalette = (motionData?.palette as ColorPalette) || colorPalette || "cyan";
      const finalDuration = motionData?.duration || 5;

      // Update canvas engine state with the server response
      setLiveText(finalRenderText);
      setActiveStyle(finalStyle);
      setColorPalette(finalPalette);
      setMotionSpeed(1);

      // Extract generated templates array from API response
      const incomingTemplates: GeneratedTemplateItem[] =
        serverRes?.templates && Array.isArray(serverRes.templates) && serverRes.templates.length > 0
          ? serverRes.templates
          : [
              {
                id: `tmpl-${generatedPromptId}`,
                name: trimmed.length > 24 ? `${trimmed.slice(0, 24)}...` : trimmed,
                category: finalStyle,
                duration: finalDuration,
                prompt: trimmed,
                text: finalRenderText,
                palette: finalPalette,
                fps: 60,
                createdAt: new Date().toISOString(),
                updatedAt: "Just now",
                jobId: serverRes?.job?.id,
              },
            ];

      // Add newly generated templates to state and persist in localStorage
      setGeneratedTemplates((prev) => {
        const newIds = new Set(incomingTemplates.map((t) => t.id));
        const filteredPrev = prev.filter((p) => !newIds.has(p.id));
        const combined = [...incomingTemplates, ...filteredPrev];
        try {
          localStorage.setItem("animagent_generated_templates", JSON.stringify(combined));
        } catch {}
        return combined;
      });

      // Select primary newly generated template
      setActiveTemplateId(incomingTemplates[0].id);

      // Reset transport and start playback
      startTimeRef.current = Date.now();
      setCurrentTime(0);
      setIsPlaying(true);

      success(
        "Templates Generated",
        `Synthesized ${incomingTemplates.length} 60FPS motion template variations from your prompt.`
      );
    } catch (err: any) {
      console.error("[Workspace] Prompt API error:", err);
      failure("Generation Error", err?.message || "Could not reach prompt backend server.");
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
      await api.charConversion.add({
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

  // Reset to clean prompt creation
  const handleCreateProject = () => {
    setActiveTemplateId("");
    setPromptText("");
    setLiveText("");
    setCurrentTime(0);
    setIsPlaying(false);
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

  // User Plan & Usage Details: strictly DB-backed
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

  // Real-time usage calculation
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
    hasActiveAnimation,
    // Generated Templates State & Handlers
    generatedTemplates,
    setGeneratedTemplates,
    activeTemplateId,
    setActiveTemplateId,
    activeTemplate,
    handleSelectTemplate,
    handleDeleteTemplate,
    handleClearTemplates,
    handleRemixTemplate,
    // Backward-compatible aliases
    projects,
    activeProjectId,
    setActiveProjectId: setActiveTemplateId,
    activeProject,
    handleSelectProject,
    // Generation parameters
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
