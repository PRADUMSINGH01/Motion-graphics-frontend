"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FiArrowUp,
  FiClock,
  FiMaximize2,
  FiChevronDown,
  FiZap,
} from "react-icons/fi";
import {
  MAX_PROMPT_LENGTH,
  DEFAULT_SETTINGS,
  type ChatSettings,
  type Ratio,
} from "../lib/chatStore";
import ModelSelectorModal, {
  AVAILABLE_MODELS,
  type ModelOption,
  type EffortLevel,
} from "./ModelSelectorModal";

export { AVAILABLE_MODELS, type ModelOption, type EffortLevel };

interface PromptBoxProps {
  onSend: (text: string) => void;
  initialValue?: string;
  disabledReason?: string;
  settings?: ChatSettings;
  onSettingsChange?: (settings: ChatSettings) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const MAX_HEIGHT_PX = 180;

const RATIOS: { id: Ratio; label: string; aspectW: number; aspectH: number }[] = [
  { id: "16:9", label: "16:9", aspectW: 16, aspectH: 9 },
  { id: "9:16", label: "9:16", aspectW: 9, aspectH: 16 },
  { id: "1:1", label: "1:1", aspectW: 10, aspectH: 10 },
];

const LENGTHS = [
  { s: 15, label: "15s" },
  { s: 30, label: "30s" },
  { s: 45, label: "45s" },
  { s: 60, label: "60s" },
];

export default function PromptBox({
  onSend,
  initialValue = "",
  disabledReason,
  settings,
  onSettingsChange,
  placeholder = "Message Byreel or describe a video...",
  autoFocus,
}: PromptBoxProps) {
  const [value, setValue] = useState(initialValue);
  const [showModelModal, setShowModelModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const canSend = value.trim().length > 0 && !disabledReason;

  // Local state ensures immediate UI feedback even if parent update is asynchronous
  const [localModelId, setLocalModelId] = useState<string>(
    settings?.model || DEFAULT_SETTINGS.model || "glm-5.3-flash"
  );
  const [localEffort, setLocalEffort] = useState<EffortLevel>(
    (settings?.effort as EffortLevel) || (DEFAULT_SETTINGS.effort as EffortLevel) || "high"
  );

  useEffect(() => {
    if (settings?.model) setLocalModelId(settings.model);
    if (settings?.effort) setLocalEffort(settings.effort as EffortLevel);
  }, [settings?.model, settings?.effort]);

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === localModelId) || AVAILABLE_MODELS[0];
  const currentEffort = (localEffort || currentModel.defaultEffort) as EffortLevel;

  useEffect(() => {
    if (autoFocus || initialValue) {
      textareaRef.current?.focus();
    }
  }, [autoFocus, initialValue]);

  // Auto-grow textarea height
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

  const handleSelectModelAndEffort = (model: ModelOption, effort: EffortLevel) => {
    setLocalModelId(model.id);
    setLocalEffort(effort);
    if (onSettingsChange) {
      onSettingsChange({
        ...(settings ?? DEFAULT_SETTINGS),
        provider: model.provider,
        model: model.id,
        effort,
      });
    }
  };

  return (
    <div className="w-full relative">
      {/* Model & Reasoning Effort Selection Modal (Mounted via Portal with z-[999999]) */}
      <ModelSelectorModal
        isOpen={showModelModal}
        onClose={() => setShowModelModal(false)}
        selectedModelId={currentModel.id}
        selectedEffort={currentEffort}
        onSelect={handleSelectModelAndEffort}
        triggerRef={triggerRef}
      />

      {/* Composer container */}
      <div className="relative rounded-2xl border-1.5 border-[rgba(7,20,46,0.38)] bg-transparent p-3 shadow-xs backdrop-blur-2xs transition-all focus-within:border-[#07142e] focus-within:bg-[rgba(255,253,248,0.12)] focus-within:ring-2 focus-within:ring-[#07142e]/10">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          maxLength={MAX_PROMPT_LENGTH}
          aria-label="Describe your video prompt"
          placeholder={placeholder}
          className="block min-h-[44px] w-full resize-none bg-transparent px-1 text-[14px] sm:text-[14.5px] leading-relaxed text-[#07142e] outline-none placeholder:text-[rgba(7,20,46,0.5)] font-medium"
        />

        {/* Minimal Controls Row */}
        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[rgba(7,20,46,0.18)] pt-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Model & Provider Dropdown Trigger Button */}
            <button
              ref={triggerRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowModelModal((prev) => !prev);
              }}
              title={`Active Model: ${currentModel.name} (${currentEffort} reasoning)`}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium border transition cursor-pointer ${
                showModelModal
                  ? "bg-[#07142e] text-[#faf8f2] border-[#07142e] shadow-xs"
                  : "bg-transparent border-[rgba(7,20,46,0.24)] text-[#07142e] hover:bg-[rgba(255,253,248,0.2)] hover:border-[#07142e]"
              }`}
            >
              <FiZap size={11} className={showModelModal ? "text-[#c5ef26]" : "text-[#84cc16]"} />
              <span className="font-bold">{currentModel.name}</span>
              <span
                className={`font-mono text-[9.5px] uppercase tracking-wider px-1 py-0.2 rounded font-bold ${
                  showModelModal ? "bg-white/20 text-white" : "bg-[rgba(7,20,46,0.08)] text-[#07142e]"
                }`}
              >
                {currentEffort === "xhigh" ? "MAX" : currentEffort.toUpperCase()}
              </span>
              <FiChevronDown size={11} className={`transition-transform duration-150 ${showModelModal ? "rotate-180" : ""}`} />
            </button>

            {/* Aspect Ratio Selector */}
            {settings && onSettingsChange ? (
              <div className="flex items-center gap-0.5 rounded-lg bg-transparent p-0.5 border border-[rgba(7,20,46,0.24)]">
                {RATIOS.map((r) => {
                  const isActive = settings.ratio === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onSettingsChange({ ...settings, ratio: r.id })}
                      title={r.label}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition cursor-pointer ${
                        isActive
                          ? "bg-[#07142e] text-[#faf8f2] shadow-xs font-semibold"
                          : "text-[rgba(7,20,46,0.7)] hover:text-[#07142e] hover:bg-[rgba(255,253,248,0.14)]"
                      }`}
                    >
                      <span
                        className="inline-block border border-current rounded-[1px]"
                        style={{
                          width: r.aspectW > r.aspectH ? "10px" : r.aspectW === r.aspectH ? "8px" : "6px",
                          height: r.aspectH > r.aspectW ? "10px" : r.aspectW === r.aspectH ? "8px" : "6px",
                        }}
                      />
                      <span>{r.id}</span>
                    </button>
                  );
                })}
              </div>
            ) : settings ? (
              <span className="inline-flex items-center gap-1 rounded-lg border border-[rgba(7,20,46,0.24)] bg-transparent px-2.5 py-1 text-[11px] font-mono text-[#07142e]">
                <FiMaximize2 size={11} /> {settings.ratio}
              </span>
            ) : null}

            {/* Duration Selector */}
            {settings && onSettingsChange ? (
              <div className="flex items-center gap-0.5 rounded-lg bg-transparent p-0.5 border border-[rgba(7,20,46,0.24)]">
                {LENGTHS.map((l) => {
                  const isActive = settings.length === l.s;
                  return (
                    <button
                      key={l.s}
                      type="button"
                      onClick={() => onSettingsChange({ ...settings, length: l.s })}
                      className={`rounded-md px-2 py-1 text-[11px] font-mono font-medium transition cursor-pointer ${
                        isActive
                          ? "bg-[#07142e] text-[#faf8f2] shadow-xs font-semibold"
                          : "text-[rgba(7,20,46,0.7)] hover:text-[#07142e] hover:bg-[rgba(255,253,248,0.14)]"
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            ) : settings ? (
              <span className="inline-flex items-center gap-1 rounded-lg border border-[rgba(7,20,46,0.24)] bg-transparent px-2.5 py-1 text-[11px] font-mono text-[#07142e]">
                <FiClock size={11} /> {settings.length}s
              </span>
            ) : null}
          </div>

          {/* Send / Generate Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              aria-label="Send prompt"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#07142e] text-[#faf8f2] shadow-xs transition-all hover:bg-[#040c1c] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none cursor-pointer"
            >
              <FiArrowUp size={16} strokeWidth={2.5} className="text-[#c5ef26]" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle footer hint only when needed */}
      {disabledReason ? (
        <div className="mt-1.5 px-1 text-[11.5px] text-[#b45309]">
          {disabledReason}
        </div>
      ) : null}
    </div>
  );
}
