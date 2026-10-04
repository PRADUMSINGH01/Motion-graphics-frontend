"use client";

import React from "react";
import Link from "next/link";
import {
  FiUser,
  FiFilm,
  FiCheck,
  FiLoader,
  FiClock,
  FiArrowUpRight,
  FiPlay,
} from "react-icons/fi";
import { type ChatMessage } from "../lib/chatStore";

function StageIcon({ state }: { state: "pending" | "running" | "done" }) {
  if (state === "done")
    return (
      <span className="w-4 h-4 rounded-full bg-[var(--accent-primary)]/15 flex items-center justify-center shrink-0">
        <FiCheck size={9} className="text-[var(--accent-primary)]" />
      </span>
    );
  if (state === "running")
    return (
      <span className="w-4 h-4 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
        <FiLoader size={10} className="text-[var(--accent-primary)] animate-spin" />
      </span>
    );
  return (
    <span className="w-4 h-4 rounded-full bg-[var(--border-subtle)] flex items-center justify-center shrink-0">
      <FiClock size={8} className="text-[var(--text-muted)]" />
    </span>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  const formatAspect =
    message.preview?.format === "16:9" ? "aspect-video" : "aspect-[9/16]";

  return (
    <div className="flex gap-3.5">
      <span className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white text-[12px] font-bold">b</span>
      </span>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Pipeline stages */}
        {message.stages && message.stages.length > 0 && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 space-y-2 max-w-md">
            {message.stages.map((stage) => (
              <div key={stage.id} className="flex items-center gap-2.5">
                <StageIcon state={stage.state} />
                <span
                  className={`text-[12.5px] ${
                    stage.state === "pending"
                      ? "text-[var(--text-muted)]"
                      : "text-[var(--text-secondary)]"
                  } ${stage.state === "running" ? "text-[var(--text-primary)]" : ""}`}
                >
                  {stage.label}
                </span>
                {stage.state === "running" && (
                  <span className="ml-auto flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:120ms]" />
                    <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:240ms]" />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Final text */}
        {message.content && (
          <p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)] max-w-2xl">
            {message.content.replace(/\*\*/g, "")}
          </p>
        )}

        {/* Preview card */}
        {message.preview && (
          <div className="group max-w-xs">
            <div
              className={`relative ${formatAspect} rounded-xl overflow-hidden border border-[var(--border-subtle)]
                bg-gradient-to-br from-[var(--surface-card)] to-[var(--surface-primary)]
                flex items-center justify-center`}
            >
              <span className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur text-[10px] font-medium text-white/90">
                <FiFilm size={10} />
                {message.preview.format}
              </span>
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur text-[10px] text-white/80">
                {message.preview.style}
              </span>
              <span className="w-11 h-11 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 cursor-pointer">
                <FiPlay size={16} className="text-white ml-0.5" />
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[12px] font-medium text-[var(--text-primary)] truncate pr-2">
                {message.preview.title}
              </p>
              <Link
                href="/workspace"
                className="flex items-center gap-1 text-[11.5px] font-medium text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors shrink-0"
              >
                Open in Studio <FiArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div className="flex gap-3 max-w-[80%] flex-row-reverse">
        <span className="w-7 h-7 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 mt-0.5">
          <FiUser size={12} className="text-[var(--text-secondary)]" />
        </span>
        <div className="rounded-2xl rounded-tr-md px-4 py-2.5 bg-[var(--accent-primary)] text-white text-[13.5px] leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}

export default function ChatMessages({
  messages,
  bottomRef,
}: {
  messages: ChatMessage[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage key={message.id} message={message} />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
