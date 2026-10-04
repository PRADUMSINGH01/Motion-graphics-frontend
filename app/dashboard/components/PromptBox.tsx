"use client";

import React, { useRef, useState } from "react";
import { FiArrowUp, FiMonitor, FiSmartphone, FiChevronDown } from "react-icons/fi";
import { CHAT_STYLES } from "../lib/chatStore";

interface PromptBoxProps {
  onSend: (text: string) => void;
  format: "9:16" | "16:9";
  style: string;
  onFormatChange: (format: "9:16" | "16:9") => void;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
  /** Pre-fills the textarea (used by suggestion cards) */
  draft?: string;
  onDraftConsumed?: () => void;
}

export default function PromptBox({
  onSend,
  format,
  style,
  onFormatChange,
  onStyleChange,
  disabled = false,
  draft,
  onDraftConsumed,
}: PromptBoxProps) {
  const [value, setValue] = useState("");
  const [styleOpen, setStyleOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync external draft (suggestion card click)
  React.useEffect(() => {
    if (draft !== undefined) {
      setValue(draft);
      onDraftConsumed?.();
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [draft, onDraftConsumed]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="shrink-0 px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-glass)]
            backdrop-blur-xl shadow-lg focus-within:border-[var(--border-strong)] transition-colors"
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Describe your short… e.g. “24-second kinetic typography on compound interest”"
            className="w-full bg-transparent px-4 pt-3.5 pb-1 text-[13.5px] leading-relaxed text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)] outline-none resize-none min-h-[44px]"
          />

          {/* Controls row */}
          <div className="flex items-center gap-2 px-2.5 pb-2.5 pt-1">
            {/* Format toggle */}
            <div className="flex items-center rounded-lg border border-[var(--border-subtle)] overflow-hidden">
              <button
                onClick={() => onFormatChange("9:16")}
                title="Vertical — Reels / Shorts / TikTok"
                className={`flex items-center gap-1.5 h-7 px-2.5 text-[11.5px] font-medium transition-colors cursor-pointer
                  ${
                    format === "9:16"
                      ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
              >
                <FiSmartphone size={12} /> 9:16
              </button>
              <button
                onClick={() => onFormatChange("16:9")}
                title="Landscape — YouTube"
                className={`flex items-center gap-1.5 h-7 px-2.5 text-[11.5px] font-medium transition-colors cursor-pointer
                  ${
                    format === "16:9"
                      ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
              >
                <FiMonitor size={12} /> 16:9
              </button>
            </div>

            {/* Style select */}
            <div className="relative">
              <button
                onClick={() => setStyleOpen((v) => !v)}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-[var(--border-subtle)]
                  text-[11.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                {style}
                <FiChevronDown size={11} className={`transition-transform ${styleOpen ? "rotate-180" : ""}`} />
              </button>
              {styleOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setStyleOpen(false)} />
                  <div className="absolute bottom-9 left-0 z-20 w-48 py-1 rounded-xl border border-[var(--border-subtle)]
                    bg-[var(--surface-primary)] shadow-xl overflow-hidden">
                    {CHAT_STYLES.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          onStyleChange(s);
                          setStyleOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors cursor-pointer
                          ${
                            s === style
                              ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface-card)] hover:text-[var(--text-primary)]"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <span className="ml-auto text-[10.5px] text-[var(--text-muted)] hidden sm:block">
              <kbd className="px-1 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">⏎</kbd>{" "}
              send ·{" "}
              <kbd className="px-1 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">⇧⏎</kbd>{" "}
              newline
            </span>

            {/* Send */}
            <button
              onClick={submit}
              disabled={!value.trim() || disabled}
              title="Send"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer
                ${
                  value.trim() && !disabled
                    ? "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)] shadow-md"
                    : "bg-[var(--surface-card)] text-[var(--text-muted)] cursor-not-allowed"
                }`}
            >
              <FiArrowUp size={14} />
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-[10.5px] text-[var(--text-muted)]">
          byreel can make mistakes — review generated shorts before publishing.
        </p>
      </div>
    </div>
  );
}
