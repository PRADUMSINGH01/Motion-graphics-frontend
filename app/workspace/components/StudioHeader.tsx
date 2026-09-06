"use client";

import React from "react";
import {
  FiDownload,
  FiCopy,
  FiCheck,
  FiArrowLeft,
  FiRefreshCw,
} from "react-icons/fi";
import { AspectRatio, ProjectItem, StylePreset, WorkspaceView } from "../types";

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
}: StudioHeaderProps) {
  return (
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
              onClick={onCopyPrompt}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
              title="Copy Prompt"
            >
              {copiedPrompt ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <FiCopy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Export Action */}
            <button
              type="button"
              onClick={() => onExport("MP4 60FPS")}
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
              onClick={onRefreshQuotas}
              disabled={isRefreshingQuotas}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
            >
              <FiRefreshCw
                className={`w-3.5 h-3.5 ${isRefreshingQuotas ? "animate-spin" : ""}`}
              />
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
              onClick={() => setWorkspaceMode("prompt")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Studio</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
