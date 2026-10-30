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
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(7,20,46,0.12)] bg-[#fffefb] text-[#07142e] shadow-2xs transition hover:border-[rgba(7,20,46,0.28)] hover:bg-white cursor-pointer"
        >
          <FiSidebar size={16} />
        </button>

        {/* Global Search Bar with ⌘ K */}
        <div className="relative hidden w-full max-w-md sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[rgba(7,20,46,0.5)]">
            <FiSearch size={15} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates, projects, prompts or assets..."
            className="h-10 w-full rounded-lg border border-[rgba(7,20,46,0.12)] bg-[#fffefb] pl-10 pr-14 text-[13px] text-[#07142e] placeholder-[rgba(7,20,46,0.48)] shadow-2xs transition focus:border-[rgba(7,20,46,0.32)] focus:bg-white focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="inline-flex h-5 items-center rounded-md border border-[rgba(7,20,46,0.1)] bg-[rgba(7,20,46,0.04)] px-1.5 font-mono text-[10px] font-medium text-[rgba(7,20,46,0.6)]">
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
            aria-label="New video"
            className="db-btn h-9! px-3! sm:px-3.5! text-[12.5px]! whitespace-nowrap active:scale-95"
          >
            <FiPlus size={14} className="text-[#c5ef26]" />
            <span className="hidden sm:inline">New Video</span>
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
