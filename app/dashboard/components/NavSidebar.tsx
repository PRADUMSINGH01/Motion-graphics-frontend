"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiHome,
  FiVideo,
  FiZap,
  FiFilm,
  FiGrid,
  FiPlayCircle,
  FiTerminal,
  FiSettings,
  FiDroplet,
  FiChevronsLeft,
  FiPlus,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import type { SectionId } from "../lib/sections";
import type { User } from "../../context/AuthContext";

interface NavItemConfig {
  id: SectionId;
  label: string;
  icon: IconType;
}

const NAV_GROUPS: { label: string; items: NavItemConfig[] }[] = [
  {
    label: "Create",
    items: [
      { id: "dashboard", label: "Home", icon: FiHome },
      { id: "create", label: "Studio", icon: FiVideo },
      { id: "product-launch", label: "Product launch", icon: FiZap },
      { id: "brolls", label: "Animated B-rolls", icon: FiFilm },
    ],
  },
  {
    label: "Library",
    items: [
      { id: "your-videos", label: "Your videos", icon: FiPlayCircle },
      { id: "templates", label: "Templates", icon: FiGrid },
      { id: "brandkit", label: "Brand kit", icon: FiDroplet },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "agent-console", label: "Agent console", icon: FiTerminal },
      { id: "settings", label: "Settings", icon: FiSettings },
    ],
  },
];

/** This billing period's credits (a film costs a credit per 3 seconds, at least 2). */
function computeCompute(usage: User["usage"]): { used: number; limit: number; pct: number } {
  const used = usage?.credits?.used ?? 0;
  const limit = usage?.credits?.limit ?? 0;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return { used, limit, pct };
}

interface NavSidebarProps {
  section: SectionId;
  counts: Partial<Record<SectionId, number>>;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: SectionId) => void;
  onNewLaunch: () => void;
  userName: string;
  userEmail: string;
  planLabel: string;
  usage: User["usage"];
}

export default function NavSidebar({
  section,
  counts,
  isOpen,
  onClose,
  onNavigate,
  onNewLaunch,
  planLabel,
  usage,
}: NavSidebarProps) {
  const compute = computeCompute(usage);
  // Normalize section to active key
  const activeId: SectionId =
    section === "overview"
      ? "dashboard"
      : section === "launches"
      ? "create"
      : section === "account" || section === "billing" || section === "membership"
      ? "settings"
      : section;

  return (
    <aside
      aria-label="Studio navigation"
      className={`fixed md:static inset-y-0 left-0 z-30 flex h-full shrink-0 flex-col sb db-double-margins transition-all duration-300 ${
        isOpen
          ? "w-[240px] translate-x-0 opacity-100"
          : "w-0 -translate-x-full md:w-0 md:translate-x-0 opacity-0 overflow-hidden border-none pointer-events-none"
      }`}
    >
      {/* Top brand header matching notebook style */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-[rgba(7,20,46,0.1)]">
        <Link href="/" aria-label="byreel.in home" className="flex items-center gap-2.5 no-underline">
          <Image
            src="/byreel-mark.png"
            alt="byreel"
            width={28}
            height={28}
            priority
            className="shrink-0"
          />
          <div className="flex flex-col">
            <div className="flex items-baseline font-bold text-[18px] tracking-[-0.04em] text-[#07142e] leading-none">
              <span>byreel</span>
              <span className="text-[#84cc16] font-extrabold">.in</span>
            </div>
            <span className="text-[7.5px] font-bold tracking-[0.24em] text-[rgba(7,20,46,0.65)] mt-0.5 uppercase">
              Ideas in Motion
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="db-icon-btn text-[#07142e] hover:bg-[rgba(7,20,46,0.08)] md:hidden"
          title="Close sidebar"
        >
          <FiChevronsLeft size={16} />
        </button>
      </div>

      <div className="px-3 pt-3">
        <button type="button" onClick={onNewLaunch} className="sb-new">
          <FiPlus size={15} />
          <span>New video</span>
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3" aria-label="Studio">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="sb-group">
            <p className="sb-group-label">{group.label}</p>
            <ul>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                const count = counts[item.id];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => (item.id === "create" ? onNewLaunch() : onNavigate(item.id))}
                      aria-current={isActive ? "page" : undefined}
                      className="sb-item"
                    >
                      <Icon size={16} />
                      <span className="truncate">{item.label}</span>
                      {typeof count === "number" && count > 0 && <span className="sb-count">{count}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="sb-usage">
          <div className="sb-usage-top">
            <span className="sb-usage-plan">{planLabel}</span>
            <span className="sb-usage-num">
              {compute.limit > 0 ? `${compute.used}/${compute.limit}` : "—"}
            </span>
          </div>
          <div className="sb-usage-bar" aria-hidden="true">
            <span
              style={{ width: `${compute.pct}%` }}
              className={compute.pct >= 90 ? "is-danger" : compute.pct >= 70 ? "is-warn" : undefined}
            />
          </div>
          <p className="sb-usage-note">
            {compute.limit > 0 ? `${Math.max(0, compute.limit - compute.used)} credits left this month` : "Pick a plan to start rendering"}
          </p>
          <button type="button" className="sb-usage-cta" onClick={() => onNavigate("billing")}>
            Upgrade plan
          </button>
        </div>
      </nav>
    </aside>
  );
}
