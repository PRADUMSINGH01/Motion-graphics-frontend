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
} from "react-icons/fi";
import type { IconType } from "react-icons";
import type { SectionId } from "../lib/sections";
import type { User } from "../../context/AuthContext";

interface NavItemConfig {
  id: SectionId;
  num: string;
  label: string;
  icon: IconType;
}

const PRIMARY_NAV: NavItemConfig[] = [
  { id: "dashboard", num: "00", label: "Dashboard", icon: FiHome },
  { id: "create", num: "01", label: "Studio Editor", icon: FiVideo },
  { id: "product-launch", num: "02", label: "Product Launch", icon: FiZap },
  { id: "brolls", num: "03", label: "Animated B-Rolls", icon: FiFilm },
  { id: "templates", num: "04", label: "Templates", icon: FiGrid },
  { id: "your-videos", num: "05", label: "Your Videos", icon: FiPlayCircle },
  { id: "agent-console", num: "06", label: "Agent Console", icon: FiTerminal },
];

const SECONDARY_NAV: NavItemConfig[] = [
  { id: "brandkit", num: "07", label: "Brand Kit", icon: FiDroplet },
  { id: "settings", num: "08", label: "Settings", icon: FiSettings },
];

/** Monthly generation quota: one credit per queued prompt (billing.creditsPerGeneration). */
function computeCompute(usage: User["usage"]): { used: number; limit: number; pct: number } {
  const gens = usage?.generations;
  const used = gens?.monthly ?? 0;
  const limit = gens?.limit ?? 0;
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
      aria-label="Notebook studio navigation"
      className={`fixed md:static inset-y-0 left-0 z-30 flex h-full shrink-0 flex-col bg-[#faf8f2]/95 backdrop-blur-sm db-double-margins transition-all duration-300 ${
        isOpen
          ? "w-[240px] translate-x-0 opacity-100"
          : "w-0 -translate-x-full md:w-0 md:translate-x-0 opacity-0 overflow-hidden border-none pointer-events-none"
      }`}
    >
      {/* Top brand header matching notebook style */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-[rgba(7,20,46,0.18)]">
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

      {/* Nav links scrollable list */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3.5">
        {/* Notebook Index Tag */}
        <div className="px-2 mb-2.5">
          <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[rgba(7,20,46,0.5)] uppercase">
            STUDIO INDEX
          </span>
        </div>

        {/* Primary Studio Navigation */}
        <ul className="space-y-1">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            const count = counts[item.id];

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (item.id === "create") {
                      onNewLaunch();
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#07142e] text-[#faf8f2] shadow-xs font-semibold"
                      : "text-[#07142e] hover:bg-white hover:border-[rgba(7,20,46,0.2)] border border-transparent"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] font-bold shrink-0 ${
                      isActive ? "text-[#c5ef26]" : "text-[rgba(7,20,46,0.45)] group-hover:text-[#07142e]"
                    }`}
                  >
                    {item.num}.
                  </span>
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-[#c5ef26]" : "text-[rgba(7,20,46,0.65)] group-hover:text-[#07142e]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>

                  {typeof count === "number" && count > 0 && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.2 font-mono text-[10px] font-bold ${
                        isActive
                          ? "bg-[#c5ef26] text-[#07142e]"
                          : "bg-[rgba(7,20,46,0.08)] text-[rgba(7,20,46,0.7)]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Notebook Ruled Divider */}
        <div className="my-3 border-t border-[rgba(7,20,46,0.16)]" />

        {/* Secondary Configuration Navigation */}
        <ul className="space-y-1">
          {SECONDARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#07142e] text-[#faf8f2] shadow-xs font-semibold"
                      : "text-[#07142e] hover:bg-white hover:border-[rgba(7,20,46,0.2)] border border-transparent"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] font-bold shrink-0 ${
                      isActive ? "text-[#c5ef26]" : "text-[rgba(7,20,46,0.45)] group-hover:text-[#07142e]"
                    }`}
                  >
                    {item.num}.
                  </span>
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-[#c5ef26]" : "text-[rgba(7,20,46,0.65)] group-hover:text-[#07142e]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom Plan & Compute Usage: Clean Notebook Footer */}
        <div className="mt-auto border-t border-[rgba(7,20,46,0.16)] pt-3 pb-1 px-1.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[rgba(7,20,46,0.55)] uppercase font-bold text-[9.5px]">PLAN</span>
            <span className="font-bold text-[#07142e] capitalize text-[11px]">{planLabel}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10.5px] font-mono text-[rgba(7,20,46,0.65)]">
              <span>Compute</span>
              <span className="font-semibold text-[#07142e]">
                {compute.limit > 0 ? `${compute.used} / ${compute.limit} credits` : "No active plan"}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(7,20,46,0.12)]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  compute.pct >= 90 ? "bg-[#dc2626]" : compute.pct >= 70 ? "bg-[#f59e0b]" : "bg-[#84cc16]"
                }`}
                style={{ width: `${compute.pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
