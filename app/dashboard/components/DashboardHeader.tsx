"use client";

import React, { useEffect, useRef } from "react";
import { FiSearch, FiSidebar, FiPlus } from "react-icons/fi";
import type { User } from "../../context/AuthContext";
import AccountMenu from "./AccountMenu";
import ThemeToggle from "../../components/ThemeToggle";
import type { SectionId } from "../lib/sections";

interface DashboardHeaderProps {
  user: User;
  onOpenMobileNav: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewLaunch?: () => void;
  onNavigate?: (section: SectionId) => void;
}

export default function DashboardHeader({
  user,
  onOpenMobileNav,
  onOpenSettings,
  onLogout,
  searchQuery,
  onSearchChange,
  onNewLaunch,
}: DashboardHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Command + K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[rgba(7,20,46,0.18)] bg-[#faf8f2]/90 backdrop-blur-md px-4 sm:px-6 z-20">
      {/* Left side: Universal sidebar toggle + Clean Global search bar */}
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(7,20,46,0.28)] bg-transparent text-[#07142e] shadow-2xs transition hover:border-[#07142e] hover:bg-[rgba(255,253,248,0.14)] cursor-pointer"
        >
          <FiSidebar size={16} />
        </button>

        {/* Global Search Bar with ⌘ K */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[rgba(7,20,46,0.5)]">
            <FiSearch size={15} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates, projects, prompts or assets..."
            className="h-10 w-full rounded-lg border border-[rgba(7,20,46,0.28)] bg-transparent pl-10 pr-14 text-[13px] text-[#07142e] placeholder-[rgba(7,20,46,0.48)] shadow-2xs transition focus:border-[#07142e] focus:bg-[rgba(255,253,248,0.12)] focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="inline-flex h-5 items-center rounded border border-[rgba(7,20,46,0.2)] bg-[rgba(7,20,46,0.06)] px-1.5 font-mono text-[10px] font-bold text-[#07142e]">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: Clean Quick Launch + Theme Toggle + User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {onNewLaunch && (
          <button
            type="button"
            onClick={onNewLaunch}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#07142e] hover:bg-[#040c1c] text-[#faf8f2] font-semibold text-[12.5px] border border-[#07142e] shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <FiPlus size={14} className="text-[#c5ef26]" />
            <span>New Video</span>
          </button>
        )}

        <ThemeToggle />

        {/* User Profile Menu */}
        <div className="flex items-center">
          <AccountMenu
            user={user}
            onOpenSettings={onOpenSettings}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
}
