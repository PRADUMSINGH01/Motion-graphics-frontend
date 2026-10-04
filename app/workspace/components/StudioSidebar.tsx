"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiZap,
  FiType,
  FiActivity,
  FiTag,
  FiCompass,
  FiKey,
  FiPlus,
  FiCpu,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";
import Logo from "../../components/Logo";
import { WorkspaceView, PlanTier, ProjectItem } from "../types";

interface StudioSidebarProps {
  workspaceMode: WorkspaceView;
  setWorkspaceMode: (mode: WorkspaceView) => void;
  userPlan: PlanTier;
  genPercent: number;
  genUsed: number;
  genLimit: number;
  projects: ProjectItem[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  userDisplayName: string;
  userEmail: string;
  onLogout: () => void;
}

export default function StudioSidebar({
  workspaceMode,
  setWorkspaceMode,
  userPlan,
  genPercent,
  genUsed,
  genLimit,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  userDisplayName,
  userEmail,
  onLogout,
}: StudioSidebarProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <aside className="w-[240px] shrink-0 border-r border-line bg-surface/95 backdrop-blur-2xl flex flex-col justify-between h-full z-20 select-none transition-colors duration-200">
      {/* Top Brand & Nav */}
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
        {/* Brand Header with Back Button */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-line">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={28} />
            <div className="flex flex-col">
              <span className="font-bold text-xs tracking-tight text-fg leading-tight">
                byreel
              </span>
              <span className="text-[9px] font-mono text-accent font-semibold tracking-wider uppercase">
                STUDIO {userPlan}
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleGoBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-black/[0.03] hover:bg-fg/[0.06] dark:hover:bg-white/[0.08] border border-line transition-colors cursor-pointer"
            title="Back to Previous Route"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="p-2.5 space-y-1">
          <button
            type="button"
            onClick={() => setWorkspaceMode("prompt")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              workspaceMode === "prompt"
                ? "bg-cyan-500/15 text-accent border border-accent/35 shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-fg/[0.04]"
            }`}
          >
            <FiZap className="w-4 h-4 text-accent" />
            <span>Motion Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setWorkspaceMode("vectorizer")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              workspaceMode === "vectorizer"
                ? "bg-cyan-500/15 text-accent border border-accent/35 shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-fg/[0.04]"
            }`}
          >
            <FiType className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Char Vectorizer</span>
          </button>

          {/* In-Workspace Usage & Quotas Tab */}
          <button
            type="button"
            onClick={() => setWorkspaceMode("usage")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              workspaceMode === "usage"
                ? "bg-cyan-500/15 text-accent border border-accent/35 shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-fg/[0.04]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FiActivity className="w-4 h-4 text-success" />
              <span>Usages &amp; Quotas</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/[0.06] dark:bg-white/10 text-success">
              {genPercent}%
            </span>
          </button>

          {/* In-Workspace Plans & Pricing Tab */}
          <button
            type="button"
            onClick={() => setWorkspaceMode("billing")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              workspaceMode === "billing"
                ? "bg-cyan-500/15 text-accent border border-accent/35 shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-fg/[0.04]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FiTag className="w-4 h-4 text-warning" />
              <span>Plans &amp; Pricing</span>
            </div>
            {userPlan !== "enterprise" && (
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-amber-500/20 text-warning border border-amber-500/30">
                UPGRADE
              </span>
            )}
          </button>

          <Link
            href="/explore"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-fg/[0.04] transition-all"
          >
            <FiCompass className="w-4 h-4" />
            <span>Explore Templates</span>
          </Link>

          <Link
            href="/api-keys"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-fg/[0.04] transition-all"
          >
            <FiKey className="w-4 h-4" />
            <span>Developer API</span>
          </Link>
        </nav>

        {/* Generated Templates Section */}
        <div className="px-2.5 pt-2 border-t border-line flex-1">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-fg-muted font-semibold flex items-center gap-1.5">
              <span>Templates</span>
              <span className="px-1.5 py-0.2 rounded text-[8px] bg-cyan-500/15 text-accent font-bold border border-cyan-500/25 dark:border-cyan-400/20">
                {projects.length}
              </span>
            </span>
            <button
              type="button"
              onClick={onCreateProject}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-fg/10 transition-colors cursor-pointer"
              title="New Prompt"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="py-6 px-2 text-center rounded-xl bg-black/[0.02] dark:bg-white/[0.015] border border-dashed border-line my-2">
              <p className="text-[11px] text-fg-muted font-medium">No templates yet</p>
              <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                Submit a prompt to generate 60FPS motion templates
              </p>
              <button
                type="button"
                onClick={onCreateProject}
                className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-accent bg-cyan-500/10 hover:bg-cyan-500/20 border border-accent/35 transition-all cursor-pointer"
              >
                <FiPlus className="w-3 h-3" />
                <span>New Prompt</span>
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId && workspaceMode === "prompt";
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => onSelectProject(proj.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-500/15 text-fg font-medium border border-accent/35 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="truncate flex-1 flex flex-col min-w-0 pr-1">
                      <span className="truncate text-[11px] font-medium text-fg">{proj.name}</span>
                      <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400/70">{proj.category}</span>
                    </div>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1.5 ${
                        isActive ? "bg-accent-solid" : "bg-slate-400 dark:bg-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Bottom: Live Compute Quota + Integrated User Card Dock */}
      <div className="p-2.5 border-t border-line bg-canvas-subtle space-y-2 transition-colors">
        {/* Compact Compute Quota */}
        <div className="p-2 rounded-xl bg-fg/[0.025] border border-line shadow-xs dark:shadow-none space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase text-fg-muted font-semibold flex items-center gap-1">
              <FiCpu className="w-3 h-3 text-accent" />
              Compute Quota
            </span>
            <span className="text-[9px] font-mono text-accent font-bold">
              {genUsed} / {genLimit}
            </span>
          </div>

          <div className="w-full h-1 bg-fg/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                genPercent > 85
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-cyan-500 to-indigo-600"
              }`}
              style={{ width: `${Math.max(4, genPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] pt-0.5">
            <button
              type="button"
              onClick={() => setWorkspaceMode("usage")}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              Quotas ({genPercent}%) →
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode("billing")}
              className="font-semibold text-cyan-600 hover:text-accent dark:hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Clean Integrated User Dock */}
        <div className="flex items-center justify-between p-1.5 rounded-xl bg-fg/[0.025] border border-line shadow-xs dark:shadow-none">
          <div
            onClick={() => setWorkspaceMode("billing")}
            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
            title="Manage Plan & Billing"
          >
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 font-bold text-xs text-white shadow-sm">
              {userDisplayName.charAt(0).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-canvas" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-fg truncate group-hover:text-accent transition-colors">
                  {userDisplayName}
                </span>
                <span className="px-1 py-0.2 rounded text-[8px] font-mono uppercase bg-accent-soft text-accent font-bold border border-cyan-500/25 dark:border-cyan-500/30 shrink-0">
                  {userPlan}
                </span>
              </div>
              <span className="text-[9px] text-fg-muted truncate block">
                {userEmail}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            <FiLogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
