"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChats } from "./hooks/useChats";
import Sidebar, { SidebarRevealButton } from "./components/Sidebar";
import ChatMessages from "./components/ChatMessages";
import EmptyState from "./components/EmptyState";
import PromptBox from "./components/PromptBox";
import { FiFilm, FiChevronDown } from "react-icons/fi";

export default function DashboardPage() {
  const {
    chats,
    activeChat,
    activeId,
    isLoading,
    isSending,
    suggestions,
    newChat,
    selectChat,
    deleteChat,
    renameChat,
    setFormat,
    setStyle,
    send,
  } = useChats();

  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [titleOpen, setTitleOpen] = useState(false);
  const [draft, setDraft] = useState<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const userName = user?.name || "Creator";
  const userEmail = user?.email || "you@byreel.app";
  const planLabel = user?.plan?.tier
    ? `${user.plan.tier.charAt(0).toUpperCase()}${user.plan.tier.slice(1)} plan`
    : "Free plan";

  // Autoscroll on new messages / stage updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeChat?.messages]);

  const handleSuggestion = (prompt: string) => setDraft(prompt);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeId={activeId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onNewChat={() => newChat(activeChat?.format ?? "9:16", activeChat?.style)}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
        userName={userName}
        userEmail={userEmail}
        planLabel={planLabel}
      />

      {/* Main column */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <header className="shrink-0 h-14 flex items-center gap-2 px-3 border-b border-[var(--border-subtle)] bg-[var(--surface-glass)] backdrop-blur-xl">
          {!sidebarOpen && <SidebarRevealButton onClick={() => setSidebarOpen(true)} />}

          <span className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center shrink-0 md:hidden">
            <span className="text-white text-[12px] font-bold">b</span>
          </span>

          {/* Chat title dropdown */}
          <div className="relative">
            <button
              onClick={() => setTitleOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium
                text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors cursor-pointer max-w-[280px]"
            >
              <FiFilm size={13} className="text-[var(--accent-primary)] shrink-0" />
              <span className="truncate">{activeChat?.title ?? "byreel Studio"}</span>
              {activeChat && (
                <FiChevronDown
                  size={12}
                  className={`text-[var(--text-muted)] shrink-0 transition-transform ${titleOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>
            {titleOpen && activeChat && chats.length > 0 && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setTitleOpen(false)} />
                <div className="absolute top-full left-0 mt-1 z-20 w-64 max-h-72 overflow-y-auto py-1 rounded-xl
                  border border-[var(--border-subtle)] bg-[var(--surface-primary)] shadow-xl">
                  {chats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        selectChat(c.id);
                        setTitleOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[12.5px] truncate transition-colors cursor-pointer
                        ${
                          c.id === activeId
                            ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-card)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Format badge */}
          {activeChat && (
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded-md
              border border-[var(--border-subtle)] text-[10.5px] font-medium text-[var(--text-muted)]">
              {activeChat.format === "16:9" ? "Landscape" : "Vertical"} · {activeChat.style}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2 pr-1">
            <button
              onClick={() => newChat(activeChat?.format ?? "9:16", activeChat?.style)}
              className="h-8 px-3.5 rounded-lg text-[12.5px] font-medium bg-[var(--accent-primary)]
                text-white hover:bg-[var(--accent-secondary)] transition-colors shadow-sm cursor-pointer"
            >
              New Short
            </button>
          </div>
        </header>

        {/* Conversation */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="w-5 h-5 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent-primary)] animate-spin" />
          </div>
        ) : !activeChat || activeChat.messages.length === 0 ? (
          <EmptyState userName={userName} onSelectSuggestion={handleSuggestion} />
        ) : (
          <ChatMessages messages={activeChat.messages} bottomRef={bottomRef} />
        )}

        {/* Prompt box */}
        <PromptBox
          onSend={send}
          format={activeChat?.format ?? "9:16"}
          style={activeChat?.style ?? "Kinetic Typography"}
          onFormatChange={setFormat}
          onStyleChange={setStyle}
          disabled={isSending}
          draft={draft}
          onDraftConsumed={() => setDraft(undefined)}
        />
      </main>
    </div>
  );
}
