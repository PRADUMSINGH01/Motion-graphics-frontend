"use client";

import React from "react";
import Link from "next/link";
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
  return (
    <aside className="w-[240px] shrink-0 border-r border-white/[0.08] bg-[#0c0c11]/95 backdrop-blur-2xl flex flex-col justify-between h-full z-20 select-none">
      {/* Top Brand & Nav */}
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-white/[0.08]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo size={32} />
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
              onClick={onCreateProject}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Create New Project"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>

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

        {/* Clean Integrated User Dock */}
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
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            <FiLogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
