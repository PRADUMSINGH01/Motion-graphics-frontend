"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiEdit2,
  FiLoader,
  FiPlus,
  FiTrash2,
  FiTerminal,
  FiZap,
  FiLayers,
  FiActivity,
} from "react-icons/fi";
import {
  type Chat,
  type ChatSettings,
  type Ratio,
  DEFAULT_SETTINGS,
  themePending,
} from "../../lib/chatStore";
import ChatMessages from "../ChatMessages";
import PromptBox from "../PromptBox";

const QUICK_PROMPTS = [
  {
    code: "01",
    label: "Kinetic Hook",
    tag: "GSAP 3.15",
    prompt:
      "A fast-paced 30-second kinetic typography reveal with back.out(2.2) overshoot, bold editorial headlines, and beat-synced cuts",
  },
  {
    code: "02",
    label: "3D Product Launch",
    tag: "OCTANE 3D",
    prompt:
      "A 45-second launch commercial for a luxury minimalist sneaker with 360 turntable, neon lime rim lighting, and bold spec reveal",
  },
  {
    code: "03",
    label: "9:16 Retention Reel",
    tag: "REMOTION",
    prompt:
      "A 15-second vertical 9:16 retention hook with skewed broadcast lower-thirds explaining why 90% of SaaS launches need motion graphics",
  },
  {
    code: "04",
    label: "Vector Telemetry",
    tag: "LOTTIE SVG",
    prompt:
      "A futuristic 3D Earth holographic telemetry explainer with rising translucent bar charts and sub-8ms latency counters",
  },
];

interface LaunchesSectionProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSend: (text: string, settings?: ChatSettings) => void;
  onRetry: (chatId: string, messageId: string) => void;
  onNewChat: (settings?: ChatSettings) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onBack: () => void;
}

export default function LaunchesSection({
  chats,
  activeChat,
  onSend,
  onRetry,
  onNewChat,
  onSelect,
  onDelete,
  onRename,
  onBack,
}: LaunchesSectionProps) {
  const [selectedRatio, setSelectedRatio] = useState<Ratio>(DEFAULT_SETTINGS.ratio);
  const [selectedLength, setSelectedLength] = useState(DEFAULT_SETTINGS.length);
  const [draftPrompt, setDraftPrompt] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const messages = activeChat?.messages;
  useEffect(() => {
    if (messages?.length) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const chatSettings = activeChat?.settings ?? { ratio: selectedRatio, length: selectedLength };
  const hasMessages = !!activeChat && activeChat.messages.length > 0;
  const isRendering = activeChat?.messages.some((m) => m.isStreaming);
  const hasPreview = activeChat?.messages.some((m) => m.preview);
  const waitingForTheme = activeChat ? themePending(activeChat) : false;

  const handleStartRename = () => {
    if (!activeChat) return;
    setRenameValue(activeChat.title);
    setRenaming(true);
  };

  const handleSaveRename = () => {
    if (activeChat && renameValue.trim()) {
      onRename(activeChat.id, renameValue.trim());
    }
    setRenaming(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-surf-fcfbf7">
      {/* ── Top Studio Session Bar ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-surf-eceae3 bg-surf-ffffff px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {activeChat && (
            <button
              type="button"
              onClick={onBack}
              title="Back to new composition"
              className="flex items-center gap-1.5 rounded-lg border border-surf-e5e2d8 px-2.5 py-1 text-[12px] font-medium text-ink-717069 transition hover:border-surf-111110 hover:text-ink-111110 cursor-pointer"
            >
              <FiArrowLeft size={13} />
              <span className="hidden sm:inline">New Sequence</span>
            </button>
          )}

          {activeChat ? (
            <div className="flex items-center gap-2 min-w-0">
              {renaming ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveRename();
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={handleSaveRename}
                    className="h-7 rounded border border-surf-111110 px-2 text-[13px] outline-none"
                  />
                  <button type="submit" className="text-ink-658b02 p-1">
                    <FiCheck size={14} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate text-[14px] font-bold text-ink-111110">
                    {activeChat.title}
                  </span>
                  <button
                    type="button"
                    onClick={handleStartRename}
                    className="text-ink-9c9990 hover:text-ink-111110 p-1 cursor-pointer"
                    title="Rename sequence"
                  >
                    <FiEdit2 size={12} />
                  </button>
                </div>
              )}

              {isRendering ? (
                <span className="flex items-center gap-1.5 rounded-full bg-surf-fef3c7 px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-ink-92400e">
                  <FiLoader size={11} className="animate-spin" /> COMPILING AST
                </span>
              ) : hasPreview ? (
                <span className="flex items-center gap-1 rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-ink-658b02">
                  <FiCheck size={11} strokeWidth={3} /> 60 FPS READY
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-surf-8fb805" />
              <span className="text-[13.5px] font-bold text-ink-111110">
                Byreel Motion Compiler
              </span>
              <span className="hidden sm:inline font-mono text-[10.5px] text-ink-78756c px-2 py-0.5 rounded bg-surf-f2efe6">
                GSAP · REMOTION · LOTTIE
              </span>
            </div>
          )}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Recent chats quick dropdown */}
          {chats.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHistory((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-xl border border-surf-e5e2d8 bg-surf-faf9f5 px-3 py-1.5 text-[12px] font-mono font-medium text-ink-55544e transition hover:border-surf-111110 hover:text-ink-111110 cursor-pointer"
              >
                <FiClock size={12} />
                <span>Sessions ({chats.length})</span>
              </button>

              {/* History Dropdown Flyout */}
              {showHistory && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-surf-e5e2d8 bg-surf-ffffff p-2 shadow-xl">
                  <div className="flex items-center justify-between border-b border-surf-f2efe6 px-2 py-1.5 text-[10.5px] font-mono text-ink-8c8980">
                    <span>RECENT SEQUENCES</span>
                    <button
                      type="button"
                      onClick={() => setShowHistory(false)}
                      className="text-ink-111110 hover:underline cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-surf-faf9f5 py-1">
                    {chats.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelect(c.id);
                          setShowHistory(false);
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-[12.5px] transition hover:bg-surf-f8f7f2 ${
                          activeChat?.id === c.id
                            ? "bg-surf-f2fac2/50 font-semibold text-ink-111110"
                            : "text-ink-55544e"
                        }`}
                      >
                        <span className="truncate flex-1 pr-2">{c.title}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(c.id);
                          }}
                          className="text-ink-9c9990 hover:text-ink-dc2626 p-1 shrink-0 cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeChat ? (
            <button
              type="button"
              onClick={() => onNewChat({ ratio: selectedRatio, length: selectedLength })}
              className="flex items-center gap-1.5 rounded-xl bg-surf-111110 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-xs transition hover:bg-surf-23242a cursor-pointer"
            >
              <FiPlus size={14} className="text-ink-c5ef26" />
              <span className="hidden sm:inline">New Video</span>
            </button>
          ) : null}
        </div>
      </header>

      {/* ── Conversation Stream vs Architectural Studio Composer Empty State ── */}
      {hasMessages && activeChat ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChatMessages
            messages={activeChat.messages}
            ratio={chatSettings.ratio}
            bottomRef={bottomRef}
            onRetry={(messageId) => onRetry(activeChat.id, messageId)}
          />

          {/* Bottom Fixed Composer */}
          <div className="shrink-0 border-t border-surf-eceae3 bg-surf-ffffff p-3.5 sm:p-5">
            <div className="mx-auto max-w-3xl">
              <PromptBox
                onSend={(text) => onSend(text)}
                settings={chatSettings}
                placeholder="Request timing edits, typography changes, or describe the next scene..."
                disabledReason={
                  waitingForTheme
                    ? "Finalizing theme from render... you can send another prompt shortly."
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      ) : (
        /* Studio Empty State */
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-6 text-center">
            {/* Byreel Center Studio Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surf-ffffff border border-surf-dedad0 shadow-2xs">
              <div className="relative h-4 w-4">
                <Image
                  src="/byreel-mark.png"
                  alt="Byreel"
                  fill
                  priority
                  className="object-contain"
                  sizes="16px"
                />
              </div>
              <span className="font-mono text-[11px] font-semibold tracking-wider text-ink-2d2c28">
                60 FPS DETERMINISTIC COMPILER · PRORES 4444 RGBA
              </span>
            </div>

            {/* Clean Editorial Title */}
            <div>
              <h1
                className="text-[34px] sm:text-[44px] font-normal tracking-[-0.03em] text-ink-111110 leading-[1.02] m-0"
                style={{ fontFamily: 'var(--font-serif), "Instrument Serif", Georgia, serif' }}
              >
                Direct your motion sequence.
              </h1>
              <p className="mt-2 text-[14px] text-ink-55544e">
                Describe your scene, kinetic typography, and camera rig. Byreel compiles executable 60 FPS motion graphics.
              </p>
            </div>

            {/* Centered Composer */}
            <div className="text-left">
              <PromptBox
                key={draftPrompt}
                autoFocus
                initialValue={draftPrompt}
                settings={{ ratio: selectedRatio, length: selectedLength }}
                onSettingsChange={(st) => {
                  setSelectedRatio(st.ratio);
                  setSelectedLength(st.length);
                }}
                onSend={(text) => {
                  onSend(text, { ratio: selectedRatio, length: selectedLength });
                }}
              />
            </div>

            {/* 4 Architectural Blueprint Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-1">
              {QUICK_PROMPTS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setDraftPrompt(item.prompt)}
                  className="group rounded-xl border border-surf-dedad0 bg-surf-ffffff p-3 transition hover:border-surf-111110 hover:shadow-xs cursor-pointer flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[10.5px] font-bold text-ink-556b02">
                      {item.code} · {item.label}
                    </span>
                    <span className="font-mono text-[9.5px] px-1.5 py-0.2 rounded bg-surf-f2efe6 text-ink-55544e group-hover:bg-surf-111110 group-hover:text-ink-c5ef26 transition-colors">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-ink-6b6962 line-clamp-2 m-0 leading-relaxed">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
