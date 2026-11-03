"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowRight, FiMessageSquare, FiSearch, FiSidebar, FiPlus } from "react-icons/fi";
import type { User } from "../../context/AuthContext";
import AccountMenu from "./AccountMenu";
import ThemeToggle from "../../components/ThemeToggle";
import { SECTION_LABELS, type SectionId } from "../lib/sections";
import type { Chat } from "../lib/chatStore";

/** Pages the quick-open can jump to, by the words people type for them. */
const PAGES: { id: SectionId; words: string }[] = [
  { id: "dashboard", words: "home dashboard" },
  { id: "create", words: "studio new video chat make" },
  { id: "your-videos", words: "your videos library downloads exports" },
  { id: "templates", words: "templates reels starting points" },
  { id: "product-launch", words: "product launch trailer website" },
  { id: "brolls", words: "b-rolls broll cutaways loops" },
  { id: "brandkit", words: "brand kit colours colors fonts logo" },
  { id: "billing", words: "billing plan credits invoices upgrade" },
  { id: "settings", words: "settings account profile password" },
];

interface DashboardHeaderProps {
  user: User;
  onOpenMobileNav: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewLaunch?: () => void;
  onNavigate?: (section: SectionId) => void;
  title?: string;
  chats?: Chat[];
  onOpenChat?: (chatId: string) => void;
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
  title,
  chats = [],
  onOpenChat,
}: DashboardHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [cursor, setCursor] = useState(0);

  // Quick-open: chats whose title or prompts match, then pages. Enter opens the highlighted one.
  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const chatHits = chats
      .filter((c) => c.title.toLowerCase().includes(q) || c.messages.some((m) => m.role === "user" && m.content.toLowerCase().includes(q)))
      .slice(0, 6)
      .map((c) => ({ key: `c:${c.id}`, label: c.title, hint: "Chat", open: () => onOpenChat?.(c.id) }));
    const pageHits = PAGES.filter((p) => p.words.includes(q) || SECTION_LABELS[p.id].toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({ key: `p:${p.id}`, label: SECTION_LABELS[p.id], hint: "Page", open: () => onNavigate?.(p.id) }));
    return [...chatHits, ...pageHits];
  }, [searchQuery, chats, onOpenChat, onNavigate]);

  const choose = (i: number) => {
    const hit = results[i];
    if (!hit) return;
    hit.open();
    onSearchChange("");
    setFocused(false);
    searchInputRef.current?.blur();
  };

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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(7,20,46,0.1)] bg-white/85 backdrop-blur-md px-4 sm:px-6 z-20">
      {/* Left side: Universal sidebar toggle + Clean Global search bar */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(7,20,46,0.12)] bg-white text-[#07142e] shadow-2xs transition hover:border-[rgba(7,20,46,0.28)] hover:bg-white cursor-pointer"
        >
          <FiSidebar size={16} />
        </button>

        {title && <h1 className="mr-2 hidden shrink-0 whitespace-nowrap text-[13.5px] font-semibold text-[#07142e] lg:block">{title}</h1>}

        {/* Global Search Bar with ⌘ K */}
        <div className="relative hidden w-full max-w-md sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[rgba(7,20,46,0.5)]">
            <FiSearch size={15} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCursor(0);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                choose(cursor);
              } else if (e.key === "Escape") {
                onSearchChange("");
                searchInputRef.current?.blur();
              }
            }}
            role="combobox"
            aria-expanded={focused && results.length > 0}
            aria-controls="quick-open"
            aria-label="Search chats and pages"
            placeholder="Search chats and pages"
            className="h-9 w-full rounded-lg border border-[rgba(7,20,46,0.12)] bg-white pl-10 pr-14 text-[13px] text-[#07142e] placeholder-[rgba(7,20,46,0.48)] shadow-2xs transition focus:border-[rgba(7,20,46,0.32)] focus:bg-white focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="inline-flex h-5 items-center rounded-md border border-[rgba(7,20,46,0.1)] bg-[rgba(7,20,46,0.04)] px-1.5 font-mono text-[10px] font-medium text-[rgba(7,20,46,0.6)]">
              ⌘ K
            </kbd>
          </div>
          {focused && searchQuery.trim() && (
            <ul
              id="quick-open"
              role="listbox"
              className="absolute left-0 right-0 top-11 z-30 overflow-hidden rounded-xl border border-[rgba(7,20,46,0.12)] bg-white py-1 shadow-lg"
            >
              {results.length === 0 ? (
                <li className="px-3.5 py-2.5 text-[13px] text-[#6b7488]">No chats or pages match.</li>
              ) : (
                results.map((r, i) => (
                  <li key={r.key} role="option" aria-selected={i === cursor}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => choose(i)}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] ${i === cursor ? "bg-[rgba(7,20,46,0.05)]" : ""}`}
                    >
                      {r.hint === "Chat" ? <FiMessageSquare size={14} className="shrink-0 text-[#6b7488]" /> : <FiArrowRight size={14} className="shrink-0 text-[#6b7488]" />}
                      <span className="min-w-0 flex-1 truncate text-[#07142e]">{r.label}</span>
                      <span className="text-[11.5px] text-[#6b7488]">{r.hint}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
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
