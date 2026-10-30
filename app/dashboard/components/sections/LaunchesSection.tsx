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
    label: "Text Animation & Transitions",
    tag: "COLORFUL · 60 FPS",
    prompt:
      "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
  },
  {
    code: "02",
    label: "Product Launch",
    tag: "SAAS TRAILER",
    prompt:
      "Direct a multi-scene SaaS product launch trailer with isometric UI cards, +340% YoY telemetry bars, sub-8ms latency counter, and a bold CTA end-card.",
  },
  {
    code: "03",
    label: "Animated B-Roll",
    tag: "EDITORIAL CUTAWAY",
    prompt:
      "Create a 10-second animated B-roll cutaway panning across an archival print clipping with an electric lime marker sweep and live telemetry chart.",
  },
  {
    code: "04",
    label: "Faceless Video",
    tag: "AUTO STORY",
    prompt:
      "Generate a complete faceless storytelling video with automated visual B-roll scenes, chapter progression, and synchronized word-by-word kinetic captions.",
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
  onUpdateChatSettings?: (chatId: string, settings: ChatSettings) => void;
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
  onUpdateChatSettings,
}: LaunchesSectionProps) {
  const [selectedRatio, setSelectedRatio] = useState<Ratio>(DEFAULT_SETTINGS.ratio);
  const [selectedLength, setSelectedLength] = useState(DEFAULT_SETTINGS.length);
  const [selectedProvider, setSelectedProvider] = useState<string>(DEFAULT_SETTINGS.provider || "glm");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_SETTINGS.model || "glm-5.3-flash");
  const [selectedEffort, setSelectedEffort] = useState<string>(DEFAULT_SETTINGS.effort || "high");
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

  const chatSettings: ChatSettings = {
    ratio: activeChat?.settings?.ratio ?? selectedRatio,
    length: activeChat?.settings?.length ?? selectedLength,
    provider: activeChat?.settings?.provider ?? selectedProvider,
    model: activeChat?.settings?.model ?? selectedModel,
    effort: activeChat?.settings?.effort ?? selectedEffort,
  };
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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-transparent">
      {/* ── Top Studio Session Bar ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(7,20,46,0.18)] bg-[rgba(250,248,242,0.92)] backdrop-blur-md px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {activeChat && (
            <button
              type="button"
              onClick={onBack}
              title="Back to new composition"
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(7,20,46,0.28)] bg-transparent px-2.5 py-1 text-[12px] font-semibold text-[#07142e] transition hover:border-[#07142e] hover:bg-[rgba(255,253,248,0.3)] cursor-pointer"
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
                    className="h-7 rounded-lg border border-[#07142e] bg-transparent px-2.5 text-[13px] text-[#07142e] font-semibold outline-none focus:ring-1 focus:ring-[#07142e]"
                  />
                  <button type="submit" className="text-[#4d7c0f] hover:text-[#07142e] p-1 cursor-pointer">
                    <FiCheck size={14} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate text-[14px] font-bold text-[#07142e]">
                    {activeChat.title}
                  </span>
                  <button
                    type="button"
                    onClick={handleStartRename}
                    className="text-[rgba(7,20,46,0.5)] hover:text-[#07142e] p-1 cursor-pointer"
                    title="Rename sequence"
                  >
                    <FiEdit2 size={12} />
                  </button>
                </div>
              )}

              {isRendering ? (
                <span className="flex items-center gap-1.5 rounded-full bg-[rgba(254,243,199,0.7)] border border-[rgba(217,119,6,0.3)] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#b45309]">
                  <FiLoader size={11} className="animate-spin" /> COMPILING AST
                </span>
              ) : hasPreview ? (
                <span className="flex items-center gap-1 rounded-full bg-[#c5ef26]/30 border border-[#07142e]/30 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#07142e]">
                  <FiCheck size={11} strokeWidth={3} /> 60 FPS READY
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#84cc16] shadow-[0_0_6px_rgba(132,204,22,0.6)]" />
              <span className="text-[13.5px] font-bold text-[#07142e] tracking-tight">
                Byreel Motion Compiler
              </span>
              <span className="hidden sm:inline font-mono text-[10.5px] font-bold text-[rgba(7,20,46,0.7)] px-2 py-0.5 rounded bg-[rgba(7,20,46,0.06)] border border-[rgba(7,20,46,0.12)]">
                60 FPS · GSAP · REMOTION
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
                className="flex items-center gap-1.5 rounded-xl border border-[rgba(7,20,46,0.28)] bg-transparent px-3 py-1.5 text-[12px] font-mono font-bold text-[#07142e] transition hover:border-[#07142e] hover:bg-[rgba(255,253,248,0.25)] cursor-pointer"
              >
                <FiClock size={12} />
                <span>Sessions ({chats.length})</span>
              </button>

              {/* History Dropdown Flyout */}
              {showHistory && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-[rgba(7,20,46,0.28)] bg-[#faf8f2]/95 backdrop-blur-md p-2 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[rgba(7,20,46,0.14)] px-3 py-2 text-[10.5px] font-mono font-bold text-[rgba(7,20,46,0.6)]">
                    <span>RECENT SEQUENCES</span>
                    <button
                      type="button"
                      onClick={() => setShowHistory(false)}
                      className="text-[#07142e] hover:underline cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[rgba(7,20,46,0.08)] py-1">
                    {chats.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelect(c.id);
                          setShowHistory(false);
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] transition hover:bg-[rgba(255,253,248,0.6)] ${
                          activeChat?.id === c.id
                            ? "bg-[#c5ef26]/20 font-bold text-[#07142e] border border-[rgba(7,20,46,0.18)]"
                            : "text-[#07142e]"
                        }`}
                      >
                        <span className="truncate flex-1 pr-2">{c.title}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(c.id);
                          }}
                          className="text-[rgba(7,20,46,0.4)] hover:text-[#dc2626] p-1 shrink-0 cursor-pointer"
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
              className="flex items-center gap-1.5 rounded-xl bg-[#07142e] px-3.5 py-1.5 text-[12px] font-bold text-[#faf8f2] shadow-xs transition hover:bg-[#040c1c] cursor-pointer"
            >
              <FiPlus size={14} className="text-[#c5ef26]" />
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
          <div className="shrink-0 border-t border-[rgba(7,20,46,0.18)] bg-[rgba(250,248,242,0.95)] backdrop-blur-md p-3.5 sm:p-5">
            <div className="mx-auto max-w-3xl">
              <PromptBox
                onSend={(text) => onSend(text, chatSettings)}
                settings={chatSettings}
                onSettingsChange={(st) => {
                  setSelectedRatio(st.ratio);
                  setSelectedLength(st.length);
                  if (st.provider) setSelectedProvider(st.provider);
                  if (st.model) setSelectedModel(st.model);
                  if (st.effort) setSelectedEffort(st.effort);
                  if (activeChat && onUpdateChatSettings) {
                    onUpdateChatSettings(activeChat.id, st);
                  }
                }}
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
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-transparent border border-[rgba(7,20,46,0.32)] shadow-2xs">
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
              <span className="font-mono text-[11px] font-semibold tracking-wider text-[#07142e]">
                60 FPS DETERMINISTIC COMPILER · PRORES 4444 RGBA
              </span>
            </div>

            {/* Clean Editorial Title */}
            <div>
              <h1
                className="text-[34px] sm:text-[44px] font-normal tracking-[-0.03em] text-[#07142e] leading-[1.02] m-0"
                style={{ fontFamily: 'var(--font-serif), "Instrument Serif", Georgia, serif' }}
              >
                Direct your motion sequence.
              </h1>
              <p className="mt-2 text-[14px] text-[rgba(7,20,46,0.72)]">
                Describe your scene, kinetic typography, and camera rig. Byreel compiles executable 60 FPS motion graphics.
              </p>
            </div>

            {/* Centered Composer */}
            <div className="text-left">
              <PromptBox
                key={draftPrompt}
                autoFocus
                initialValue={draftPrompt}
                settings={{
                  ratio: selectedRatio,
                  length: selectedLength,
                  provider: selectedProvider,
                  model: selectedModel,
                  effort: selectedEffort,
                }}
                onSettingsChange={(st) => {
                  setSelectedRatio(st.ratio);
                  setSelectedLength(st.length);
                  if (st.provider) setSelectedProvider(st.provider);
                  if (st.model) setSelectedModel(st.model);
                  if (st.effort) setSelectedEffort(st.effort);
                }}
                onSend={(text) => {
                  onSend(text, {
                    ratio: selectedRatio,
                    length: selectedLength,
                    provider: selectedProvider,
                    model: selectedModel,
                    effort: selectedEffort,
                  });
                }}
              />
            </div>

            {/* 4 Architectural Blueprint Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-1">
              {QUICK_PROMPTS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setDraftPrompt(item.prompt)}
                  className="group rounded-2xl border-1.5 border-[rgba(7,20,46,0.32)] bg-transparent p-3.5 transition-all duration-200 hover:border-[#07142e] hover:bg-[rgba(255,253,248,0.22)] hover:shadow-xs cursor-pointer flex flex-col justify-between gap-2 backdrop-blur-2xs"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-[12px] font-bold text-[#07142e] tracking-tight">
                      {item.code} · {item.label}
                    </span>
                    <span className="shrink-0 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-[rgba(197,239,38,0.28)] text-[#07142e] border border-[rgba(7,20,46,0.2)] group-hover:bg-[#07142e] group-hover:text-[#c5ef26] transition-colors">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[12px] text-[rgba(7,20,46,0.72)] line-clamp-2 m-0 leading-relaxed font-normal">
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
