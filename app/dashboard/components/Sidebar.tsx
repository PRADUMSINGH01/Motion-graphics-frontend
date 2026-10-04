"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiEdit2,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronsLeft,
  FiSettings,
} from "react-icons/fi";
import { type Chat, groupChatsByDate } from "../lib/chatStore";

interface SidebarProps {
  chats: Chat[];
  activeId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  userName: string;
  userEmail: string;
  planLabel?: string;
}

export default function Sidebar({
  chats,
  activeId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  userName,
  userEmail,
  planLabel = "Free plan",
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");

  const filtered = query.trim()
    ? chats.filter((c) =>
        `${c.title} ${c.messages.map((m) => m.content).join(" ")}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      )
    : chats;
  const groups = groupChatsByDate(filtered);

  const startRename = (chat: Chat) => {
    setRenamingId(chat.id);
    setRenameDraft(chat.title);
  };

  const commitRename = () => {
    if (renamingId && renameDraft.trim()) onRenameChat(renamingId, renameDraft);
    setRenamingId(null);
  };

  return (
    <aside
      className={`relative h-full shrink-0 flex flex-col border-r transition-[width] duration-300 ease-in-out
        bg-[var(--surface-primary)] border-[var(--border-subtle)]
        ${isOpen ? "w-[272px]" : "w-[0px] overflow-hidden"}`}
    >
      {/* Brand + collapse */}
      <div className="flex items-center justify-between px-3 h-14 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center shrink-0">
            <span className="text-white text-[13px] font-bold">b</span>
          </span>
          <span className="text-[14px] font-semibold tracking-tight text-[var(--text-primary)] truncate">
            byreel
          </span>
        </div>
        <button
          onClick={onToggle}
          title="Collapse sidebar"
          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors cursor-pointer"
        >
          <FiChevronsLeft size={16} />
        </button>
      </div>

      {/* New chat */}
      <div className="px-3 pb-2 shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 h-9 px-3 rounded-xl text-[13px] font-medium
            bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)]
            transition-colors shadow-sm cursor-pointer"
        >
          <FiPlus size={15} />
          New Short
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2 shrink-0">
        <div className="flex items-center gap-2 h-8 px-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] focus-within:border-[var(--border-strong)] transition-colors">
          <FiSearch size={13} className="text-[var(--text-muted)] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            className="w-full bg-transparent text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
        </div>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0 scroll-smooth">
        {groups.length === 0 && (
          <p className="px-3 py-8 text-center text-[12px] text-[var(--text-muted)]">
            {query ? "No chats match your search." : "Your shorts will appear here."}
          </p>
        )}

        {groups.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="px-3 pt-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.chats.map((chat) => {
                const isActive = chat.id === activeId;
                const isRenaming = chat.id === renamingId;
                return (
                  <li key={chat.id} className="group relative">
                    {isRenaming ? (
                      <input
                        autoFocus
                        value={renameDraft}
                        onChange={(e) => setRenameDraft(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        className="w-full h-8 px-2.5 rounded-lg text-[12.5px] bg-[var(--background)]
                          border border-[var(--accent-primary)] text-[var(--text-primary)] outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full flex items-center gap-2 h-8 px-2.5 rounded-lg text-left text-[12.5px] transition-colors cursor-pointer
                          ${
                            isActive
                              ? "bg-[var(--surface-card)] text-[var(--text-primary)] font-medium"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface-card)] hover:text-[var(--text-primary)]"
                          }`}
                      >
                        <FiMessageSquare
                          size={13}
                          className={`shrink-0 ${isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}`}
                        />
                        <span className="truncate flex-1 pr-8">{chat.title}</span>
                      </button>
                    )}

                    {/* Hover actions */}
                    {!isRenaming && (
                      <div
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5
                          opacity-0 group-hover:opacity-100 transition-opacity
                          ${isActive ? "bg-[var(--surface-card)]" : "bg-transparent"}`}
                      >
                        <button
                          onClick={() => startRename(chat)}
                          title="Rename"
                          className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
                        >
                          <FiEdit2 size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteChat(chat.id)}
                          title="Delete"
                          className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* User footer */}
      <div className="shrink-0 border-t border-[var(--border-subtle)] p-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[var(--surface-card)] transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-semibold">
              {userName.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-medium text-[var(--text-primary)] truncate leading-tight">
              {userName}
            </p>
            <p className="text-[10.5px] text-[var(--text-muted)] truncate leading-tight">
              {planLabel} · {userEmail}
            </p>
          </div>
          <FiSettings size={14} className="text-[var(--text-muted)] shrink-0" />
        </div>
      </div>
    </aside>
  );
}

export function SidebarRevealButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Open sidebar"
      className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors cursor-pointer"
    >
      <FiChevronLeft size={16} className="rotate-180" />
    </button>
  );
}
