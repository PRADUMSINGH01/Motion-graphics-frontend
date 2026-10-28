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
  FiFolder,
  FiImage,
  FiUpload,
  FiDroplet,
  FiCpu,
  FiSettings,
  FiChevronsLeft,
  FiArrowRight,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { ByreelLogo } from "../../components/landing/ByreelBrand";
import { SECTION_LABELS, type SectionId } from "../lib/sections";

interface NavItemConfig {
  id: SectionId;
  label: string;
  icon: IconType;
  badge?: string;
}

const PRIMARY_NAV: NavItemConfig[] = [
  { id: "dashboard", label: "Dashboard", icon: FiHome },
  { id: "create", label: "Create Video", icon: FiVideo },
  { id: "product-launch", label: "Product Launch", icon: FiZap, badge: "New" },
  { id: "brolls", label: "B-Rolls", icon: FiFilm, badge: "AI" },
  { id: "templates", label: "Templates", icon: FiGrid },
  { id: "your-videos", label: "Your Videos", icon: FiPlayCircle },
  { id: "projects", label: "Projects", icon: FiFolder },
  { id: "media", label: "Media Library", icon: FiImage },
  { id: "exports", label: "Exports", icon: FiUpload },
];

const SECONDARY_NAV: NavItemConfig[] = [
  { id: "brandkit", label: "Brand Kit", icon: FiDroplet },
  { id: "integrations", label: "Integrations", icon: FiCpu },
  { id: "settings", label: "Settings", icon: FiSettings },
];

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
}

export default function NavSidebar({
  section,
  counts,
  isOpen,
  onClose,
  onNavigate,
  onNewLaunch,
  userName,
  userEmail,
  planLabel,
}: NavSidebarProps) {
  // Normalize section to active key
  const activeId: SectionId =
    section === "overview" ? "dashboard" :
    section === "launches" ? "create" :
    section === "account" || section === "billing" || section === "membership" ? "settings" :
    section;

  return (
    <aside
      aria-label="Dashboard navigation"
      className={`fixed md:static inset-y-0 left-0 z-30 flex h-full shrink-0 flex-col border-r border-surf-eceae3 bg-surf-fcfbf7 transition-all duration-300 ${
        isOpen
          ? "w-[240px] translate-x-0 opacity-100"
          : "w-0 -translate-x-full md:w-0 md:translate-x-0 opacity-0 overflow-hidden border-none pointer-events-none"
      }`}
    >
      {/* Top brand header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Link href="/" aria-label="byreel home" className="flex items-center">
          <ByreelLogo size={26} theme="light" />
        </Link>
        <button type="button" onClick={onClose} aria-label="Close navigation" className="db-icon-btn" title="Close sidebar">
          <FiChevronsLeft size={16} />
        </button>
      </div>

      {/* Nav links scrollable list */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2">
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
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-surf-111110 text-white shadow-sm"
                      : "text-ink-55544e hover:bg-surf-f2efe6 hover:text-ink-111110"
                  }`}
                >
                  <Icon
                    size={17}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-ink-c5ef26" : "text-ink-717069"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>

                  {item.badge && !count && (
                    <span
                      className={`ml-auto rounded-full px-1.5 py-0.2 text-[9.5px] font-mono font-semibold ${
                        isActive
                          ? "bg-[rgba(197,239,38,0.25)] text-ink-c5ef26"
                          : "bg-surf-f2fac2 text-ink-658b02"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {typeof count === "number" && count > 0 && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-mono ${
                        isActive
                          ? "bg-[rgba(197,239,38,0.2)] text-ink-c5ef26"
                          : "bg-surf-e8e6de text-ink-55544e"
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

        {/* Hairline Divider */}
        <div className="my-3 border-t border-surf-ebe8df" />

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
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-surf-111110 text-white shadow-sm"
                      : "text-ink-55544e hover:bg-surf-f2efe6 hover:text-ink-111110"
                  }`}
                >
                  <Icon
                    size={17}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-ink-c5ef26" : "text-ink-717069"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom Sidebar Cards */}
        <div className="mt-auto space-y-3 pt-4">
          {/* Free Plan Usage Card */}
          <div className="rounded-2xl border border-surf-ebe8df bg-surf-f8f7f2 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-ink-111110 capitalize">{planLabel}</span>
              <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-surf-f2fac2 text-ink-658b02">
                ACTIVE
              </span>
            </div>
            <p className="mt-1 text-[11.5px] text-ink-717069">
              <span className="font-semibold text-ink-111110">180</span> / 300 credits used
            </p>
            {/* Progress Bar */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surf-e5e2d8">
                <div
                  className="h-full rounded-full bg-surf-c5ef26"
                  style={{ width: "40%" }}
                />
              </div>
              <span className="text-[10.5px] font-medium text-ink-717069">40%</span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("membership")}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-surf-dedad0 bg-surf-ffffff py-1.5 text-[12px] font-medium text-ink-111110 shadow-xs transition hover:bg-surf-fcfbf7"
            >
              Upgrade Plan <FiArrowRight size={12} />
            </button>
          </div>

          {/* Dark Limitless Promo Card */}
          <div className="relative overflow-hidden rounded-2xl bg-surf-0d0f10 p-4 text-white shadow-md">
            {/* Background graphic */}
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-right opacity-40 mix-blend-screen"
              style={{ backgroundImage: `url('/dashboard/sidebar-limitless.jpg')` }}
            />
            <div className="relative z-10">
              <h4 className="text-[14px] font-semibold leading-tight text-white">
                Create <br />
                without <br />
                <span className="text-ink-c5ef26">limits.</span>
              </h4>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-a8a8a2">
                Upgrade for more credits, premium templates and HD exports.
              </p>

              <button
                type="button"
                onClick={() => onNavigate("membership")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-surf-c5ef26 px-3 py-1.5 text-[12px] font-semibold text-ink-111110 shadow-sm transition hover:bg-surf-b6df1e"
              >
                Upgrade now <FiArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
