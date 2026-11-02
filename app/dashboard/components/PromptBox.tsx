"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { MAX_PROMPT_LENGTH, type ChatSettings } from "../lib/chatStore";
import { AVAILABLE_MODELS, type ModelOption, type EffortLevel } from "./ModelSelectorModal";
import StudioSettings from "./StudioSettings";

export { AVAILABLE_MODELS, type ModelOption, type EffortLevel };

interface PromptBoxProps {
  onSend: (text: string) => void;
  initialValue?: string;
  disabledReason?: string;
  settings?: ChatSettings;
  onSettingsChange?: (settings: ChatSettings) => void;
  placeholder?: string;
  autoFocus?: boolean;
  /** "start": the tall box of a new film; "dock": the one under a conversation. */
  size?: "start" | "dock";
}

const MAX_HEIGHT_PX = 220;

/**
 * The Studio composer. On wide screens the film's settings live in the side panel, so the box is just the
 * prompt and the button; on narrow screens the settings sit in one scrolling row inside it.
 */
export default function PromptBox({
  onSend,
  initialValue = "",
  disabledReason,
  settings,
  onSettingsChange,
  placeholder = "Describe the video: what's on screen, the words, the feel…",
  autoFocus,
  size = "dock",
}: PromptBoxProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabledReason;

  useEffect(() => {
    if (autoFocus || initialValue) textareaRef.current?.focus();
  }, [autoFocus, initialValue]);

  // Grow with the text, up to a limit.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  const submit = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="w-full">
      <div className="st-composer rounded-2xl border border-[var(--db-rule-strong)] bg-white shadow-[var(--db-shadow-sm)] transition focus-within:border-[rgba(7,20,46,0.4)] focus-within:shadow-[0_0_0_3px_rgba(7,20,46,0.08)]">
        <label htmlFor="studio-prompt" className="sr-only">
          Describe your video
        </label>
        <textarea
          id="studio-prompt"
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          rows={size === "start" ? 4 : 2}
          maxLength={MAX_PROMPT_LENGTH}
          placeholder={placeholder}
          className={`block w-full resize-none bg-transparent px-4 pt-3.5 text-[15px] leading-relaxed text-[var(--db-ink)] outline-none placeholder:text-[var(--db-faint)] ${
            size === "start" ? "min-h-[112px]" : "min-h-[52px]"
          }`}
        />

        <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1">
          <div className="flex min-w-0 flex-1">
            {settings && onSettingsChange ? (
              <div className="min-w-0 lg:hidden">
                <StudioSettings settings={settings} onChange={onSettingsChange} variant="sheet" />
              </div>
            ) : null}
            <p className="hidden pl-1 text-[12px] text-[var(--db-faint)] lg:block">Enter to send, Shift + Enter for a new line</p>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Make video"
            className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[var(--db-ink)] px-3 text-[13.5px] font-semibold text-white transition hover:bg-[#040c1c] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[rgba(7,20,46,0.35)] sm:px-4 cursor-pointer"
          >
            <FiArrowUp size={16} strokeWidth={2.5} aria-hidden="true" className="text-[var(--db-lime)]" />
            <span className="hidden sm:inline">Make video</span>
          </button>
        </div>
      </div>

      {disabledReason ? <p className="mt-2 px-1 text-[12.5px] text-[#9a3412]">{disabledReason}</p> : null}
    </div>
  );
}
