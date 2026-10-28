"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FiSearch,
  FiBell,
  FiSidebar,
  FiCheck,
  FiPlus,
  FiVideo,
  FiZap,
  FiClock,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
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
  onNavigate,
}: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "renders">("all");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Velocity Sneaker 4K Render Ready",
      desc: "ProRes 422 60FPS render completed on GPU cluster #04.",
      time: "10m ago",
      type: "render",
      unread: true,
    },
    {
      id: "2",
      title: "Monthly Studio Credits Refreshed",
      desc: "120 of 300 compute credits used for current billing cycle.",
      time: "2h ago",
      type: "billing",
      unread: true,
    },
    {
      id: "3",
      title: "New AI Template: Kinetic Typography",
      desc: "Dynamic beat-synced 9:16 portrait template is now live in Studio.",
      time: "1d ago",
      type: "template",
      unread: false,
    },
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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

  // Close notifications on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === "unread") return n.unread;
    if (activeTab === "renders") return n.type === "render";
    return true;
  });

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-surf-eceae3 bg-surf-fcfbf7 px-4 sm:px-6 z-20">
      {/* Left side: Universal sidebar toggle + Global search bar */}
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-surf-e5e2d8 bg-surf-ffffff text-ink-55544e shadow-2xs transition hover:border-surf-111110 hover:text-ink-111110 cursor-pointer"
        >
          <FiSidebar size={16} />
        </button>

        {/* Global Search Bar with ⌘ K */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-8c8980">
            <FiSearch size={15} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates, projects, prompts or assets..."
            className="h-10 w-full rounded-xl border border-surf-e5e2d8 bg-surf-ffffff pl-10 pr-14 text-[13px] text-ink-111110 placeholder-ink-9c9990 shadow-2xs transition focus:border-surf-111110 focus:outline-none focus:ring-2 focus:ring-surf-c5ef26/40"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="inline-flex h-5 items-center rounded border border-surf-dfdbcf bg-surf-f5f4ee px-1.5 font-mono text-[10px] font-medium text-ink-7a7871">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Engine status indicator (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border border-surf-eceae3 bg-surf-ffffff text-[11.5px] font-mono text-ink-68655c">
          <span className="w-2 h-2 rounded-full bg-surf-c5ef26 animate-pulse" />
          <span>GPU ENGINE ONLINE</span>
        </div>
      </div>

      {/* Right side: Quick Launch + Credits + Notifications + User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Launch CTA Button */}
        {onNewLaunch && (
          <button
            type="button"
            onClick={onNewLaunch}
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-surf-111110 hover:bg-surf-25262c text-white font-medium text-[12.5px] shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <FiPlus size={14} className="text-surf-c5ef26" />
            <span>New Video</span>
          </button>
        )}

        {/* Credits Badge / Upgrade link */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate("membership")}
            className="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full border border-surf-dedad0 bg-surf-ffffff hover:bg-surf-faf9f5 text-[11.5px] font-mono text-ink-33322d transition cursor-pointer"
            title="View compute credit limits"
          >
            <FiZap size={12} className="text-surf-c5ef26 fill-surf-c5ef26" />
            <span className="font-semibold text-ink-111110">180</span>
            <span className="text-ink-8c8980">/ 300 credits</span>
          </button>
        )}

        <ThemeToggle />

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-surf-e5e2d8 bg-surf-ffffff text-ink-55544e shadow-2xs transition hover:border-surf-111110 hover:text-ink-111110 cursor-pointer"
          >
            <FiBell size={15} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-surf-c5ef26 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Flyout Drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-full z-40 mt-2 w-84 overflow-hidden rounded-2xl border border-surf-dedad0 bg-surf-ffffff shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-surf-eceae3 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-ink-111110">Studio Activity</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-surf-f2fac2 px-1.5 py-0.2 font-mono text-[9.5px] font-bold text-ink-658b02">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-ink-717069 hover:text-ink-111110 transition cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center border-b border-surf-f2efe6 px-3 py-1.5 gap-1 bg-surf-faf9f5">
                {(["all", "unread", "renders"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition cursor-pointer ${
                      activeTab === tab
                        ? "bg-surf-111110 text-white"
                        : "text-ink-717069 hover:text-ink-111110"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-surf-f2efe6">
                {filteredNotifs.length === 0 ? (
                  <div className="p-6 text-center text-[12px] text-ink-8c8980">
                    No notifications in this filter.
                  </div>
                ) : (
                  filteredNotifs.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 transition hover:bg-surf-fcfbf7 ${
                        n.unread ? "bg-surf-f2fac2/15" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] font-semibold text-ink-111110 leading-snug">
                          {n.title}
                        </p>
                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-surf-c5ef26 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-ink-717069 leading-relaxed">
                        {n.desc}
                      </p>
                      <span className="mt-1 block font-mono text-[10px] text-ink-9c9990">
                        {n.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
