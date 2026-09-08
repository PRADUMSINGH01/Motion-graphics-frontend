"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  FiDownload,
  FiCopy,
  FiCheck,
  FiArrowLeft,
  FiRefreshCw,
} from "react-icons/fi";
import { AspectRatio, ProjectItem, StylePreset, WorkspaceView } from "../types";
import ThemeToggle from "../../components/ThemeToggle";

interface StudioHeaderProps {
  workspaceMode: WorkspaceView;
  setWorkspaceMode: (mode: WorkspaceView) => void;
  activeProject: ProjectItem;
  activeStyle: StylePreset;
  aspectRatio: AspectRatio;
  setAspectRatio: (aspect: AspectRatio) => void;
  copiedPrompt: boolean;
  onCopyPrompt: () => void;
  onExport: (format: string) => void;
  isRefreshingQuotas: boolean;
  onRefreshQuotas: () => void;
  hasActiveAnimation?: boolean;
}

export default function StudioHeader({
  workspaceMode,
  setWorkspaceMode,
  activeProject,
  activeStyle,
  aspectRatio,
  setAspectRatio,
  copiedPrompt,
  onCopyPrompt,
  onExport,
  isRefreshingQuotas,
  onRefreshQuotas,
  hasActiveAnimation = false,
}: StudioHeaderProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <header className="relative z-10 h-14 shrink-0 border-b border-black/[0.08] dark:border-white/[0.08] bg-white/85 dark:bg-[#121013]/85 backdrop-blur-xl px-4 sm:px-5 flex items-center justify-between text-slate-900 dark:text-white transition-colors duration-200">
      {workspaceMode === "prompt" ? (
        <>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGoBack}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] transition-colors cursor-pointer"
              title="Back to Previous Route"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-900 dark:text-white tracking-wide">
              {hasActiveAnimation ? activeProject.name : "Motion Studio"}
            </span>
            {hasActiveAnimation && (
              <>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 dark:bg-white/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 dark:border-white/10 font-semibold">
                  {activeStyle}
                </span>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span>60 FPS GPU Sync</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {hasActiveAnimation && (
              <>
                {/* Aspect Ratio Switcher */}
                <div className="hidden sm:flex items-center bg-black/[0.05] dark:bg-black/40 border border-black/[0.08] dark:border-white/[0.08] p-0.5 rounded-lg">
                  {(["16:9", "9:16", "1:1"] as AspectRatio[]).map((aspect) => (
                    <button
                      key={aspect}
                      type="button"
                      onClick={() => setAspectRatio(aspect)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all cursor-pointer ${
                        aspectRatio === aspect
                          ? "bg-white dark:bg-white/15 text-cyan-600 dark:text-cyan-300 font-semibold shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {aspect}
                    </button>
                  ))}
                </div>

                {/* Quick Prompt Copy */}
                <button
                  type="button"
                  onClick={onCopyPrompt}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] transition-colors cursor-pointer"
                  title="Copy Prompt"
                >
                  {copiedPrompt ? (
                    <FiCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Export Action */}
                <button
                  type="button"
                  onClick={() => onExport("MP4 60FPS")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 transition-all shadow-sm cursor-pointer"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle variant="studio" />
          </div>
        </>
      ) : workspaceMode === "vectorizer" ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleGoBack}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] transition-colors cursor-pointer"
              title="Back to Previous Route"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Character Vectorizer Engine
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              Procedural Glyphs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWorkspaceMode("prompt")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.08] dark:border-white/10 transition-all cursor-pointer"
            >
              <span>Motion Studio</span>
            </button>
            <ThemeToggle variant="studio" />
          </div>
        </div>
      ) : workspaceMode === "usage" ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleGoBack}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] transition-colors cursor-pointer"
              title="Back to Previous Route"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Usages &amp; Compute Quotas
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Cycle Resets in 24 Days
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={onRefreshQuotas}
              disabled={isRefreshingQuotas}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.08] dark:border-white/10 transition-all cursor-pointer"
            >
              <FiRefreshCw
                className={`w-3.5 h-3.5 ${isRefreshingQuotas ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Sync Quotas</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode("billing")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer shadow-sm"
            >
              Upgrade
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode("prompt")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.08] dark:border-white/10 transition-all cursor-pointer"
            >
              <span>Studio</span>
            </button>
            <ThemeToggle variant="studio" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleGoBack}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] transition-colors cursor-pointer"
              title="Back to Previous Route"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Plans &amp; Pricing Management
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              Zero Lock-In
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setWorkspaceMode("prompt")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.08] dark:border-white/10 transition-all cursor-pointer"
            >
              <span>Studio</span>
            </button>
            <ThemeToggle variant="studio" />
          </div>
        </div>
      )}
    </header>
  );
}
