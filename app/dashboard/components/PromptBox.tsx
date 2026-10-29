"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FiArrowUp,
  FiClock,
  FiMaximize2,
  FiCpu,
  FiChevronDown,
  FiCheck,
  FiSliders,
  FiX,
  FiZap,
} from "react-icons/fi";
import {
  MAX_PROMPT_LENGTH,
  DEFAULT_SETTINGS,
  type ChatSettings,
  type Ratio,
} from "../lib/chatStore";

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

export interface ModelOption {
  provider: "azure" | "glm" | "claude" | "openai" | "gemini";
  id: string;
  name: string;
  providerLabel: string;
  tag: string;
  description: string;
  efforts: ("low" | "medium" | "high" | "xhigh")[];
  defaultEffort: "low" | "medium" | "high" | "xhigh";
  isReady?: boolean;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    provider: "azure",
    id: "qwen--qwen38-27b",
    name: "Qwen 3.8 27B",
    providerLabel: "Azure AI (A100)",
    tag: "2x A100 GPU",
    description: "Max reasoning with deep visual & motion planning",
    efforts: ["low", "medium", "high", "xhigh"],
    defaultEffort: "xhigh",
    isReady: true,
  },
  {
    provider: "azure",
    id: "DeepSeek-V4-Pro",
    name: "DeepSeek V4 Pro",
    providerLabel: "Azure AI (MaaS)",
    tag: "Serverless",
    description: "High-speed coding benchmark leader (>70%)",
    efforts: ["low", "medium", "high"],
    defaultEffort: "high",
    isReady: true,
  },
  {
    provider: "glm",
    id: "glm-5.3-flash",
    name: "GLM 5.3 Flash",
    providerLabel: "Zhipu AI",
    tag: "Ultra Fast",
    description: "Lightning-fast thinking & script synthesis",
    efforts: ["low", "medium", "high"],
    defaultEffort: "low",
    isReady: true,
  },
  {
    provider: "claude",
    id: "claude-sonnet-5-5",
    name: "Claude 3.5 Sonnet",
    providerLabel: "Anthropic",
    tag: "Visual Design",
    description: "World-class layout, typography & camera animation",
    efforts: ["low", "medium", "high"],
    defaultEffort: "low",
    isReady: true,
  },
  {
    provider: "openai",
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    providerLabel: "OpenAI",
    tag: "Reasoning",
    description: "Standard concise reasoning & swift logic",
    efforts: ["low", "medium", "high"],
    defaultEffort: "low",
    isReady: false,
  },
  {
    provider: "gemini",
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    providerLabel: "Google AI",
    tag: "Multimodal",
    description: "Long-context video and scene choreography",
    efforts: ["low", "medium", "high"],
    defaultEffort: "low",
    isReady: false,
  },
];

const EFFORTS: { id: "low" | "medium" | "high" | "xhigh"; label: string; hint: string }[] = [
  { id: "low", label: "Low", hint: "Fastest / Budget" },
  { id: "medium", label: "Med", hint: "Balanced" },
  { id: "high", label: "High", hint: "Deep Reasoning" },
  { id: "xhigh", label: "Max", hint: "Exhaustive vLLM (xhigh)" },
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
  const [showModelPopover, setShowModelPopover] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const canSend = value.trim().length > 0 && !disabledReason;

  // Local state ensures immediate UI feedback even if parent update is asynchronous
  const [localModelId, setLocalModelId] = useState<string>(
    settings?.model || DEFAULT_SETTINGS.model || "qwen--qwen38-27b"
  );
  const [localEffort, setLocalEffort] = useState<string>(
    settings?.effort || DEFAULT_SETTINGS.effort || "xhigh"
  );

  useEffect(() => {
    if (settings?.model) setLocalModelId(settings.model);
    if (settings?.effort) setLocalEffort(settings.effort);
  }, [settings?.model, settings?.effort]);

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === localModelId) || AVAILABLE_MODELS[0];
  const currentEffort = (localEffort || currentModel.defaultEffort) as "low" | "medium" | "high" | "xhigh";

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

  // Click outside listener
  useEffect(() => {
    if (!showModelPopover) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setShowModelPopover(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showModelPopover]);

  const submit = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  };

  const selectModel = (m: ModelOption, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextEffort = m.efforts.includes(currentEffort)
      ? currentEffort
      : m.defaultEffort;
    setLocalModelId(m.id);
    setLocalEffort(nextEffort);
    if (onSettingsChange) {
      onSettingsChange({
        ...(settings ?? DEFAULT_SETTINGS),
        provider: m.provider,
        model: m.id,
        effort: nextEffort,
      });
    }
    setShowModelPopover(false);
  };

  const selectEffort = (effort: "low" | "medium" | "high" | "xhigh", e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLocalEffort(effort);
    if (onSettingsChange) {
      onSettingsChange({
        ...(settings ?? DEFAULT_SETTINGS),
        provider: currentModel.provider,
        model: currentModel.id,
        effort,
      });
    }
  };

  return (
    <div className="w-full relative">
      {/* Floating Model & Reasoning Effort Popover */}
      {showModelPopover && (
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full left-0 mb-2.5 z-50 w-full sm:w-[420px] rounded-2xl border border-[rgba(7,20,46,0.2)] bg-[#faf8f2] shadow-2xl p-4 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(7,20,46,0.1)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#07142e]">
              <FiCpu className="text-[#07142e]" size={14} />
              <span>Select Model &amp; LLM Engine</span>
            </div>
            <button
              type="button"
              onClick={() => setShowModelPopover(false)}
              className="text-[rgba(7,20,46,0.5)] hover:text-[#07142e] p-1 rounded-md transition cursor-pointer"
            >
              <FiX size={15} />
            </button>
          </div>

          {/* Model Options List */}
          <div className="mt-2.5 space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {AVAILABLE_MODELS.map((m) => {
              const isSelected = currentModel.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={(e) => selectModel(m, e)}
                  role="button"
                  tabIndex={0}
                  className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? "border-[#07142e] bg-[rgba(7,20,46,0.08)] shadow-2xs"
                      : "border-transparent hover:border-[rgba(7,20,46,0.12)] hover:bg-[rgba(7,20,46,0.03)]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-bold text-[#07142e]">
                        {m.name}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[rgba(7,20,46,0.08)] text-[#07142e]/85">
                        {m.tag}
                      </span>
                      {m.isReady && (
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Ready on backend" />
                      )}
                    </div>
                    <p className="text-[11px] text-[rgba(7,20,46,0.65)] truncate mt-0.5">
                      {m.providerLabel} · {m.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="shrink-0 w-5 h-5 rounded-full bg-[#07142e] text-[#c5ef26] flex items-center justify-center">
                      <FiCheck size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reasoning Effort Control */}
          <div className="mt-3 pt-2.5 border-t border-[rgba(7,20,46,0.1)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11.5px] font-bold text-[#07142e] flex items-center gap-1.5">
                <FiSliders size={12} /> Reasoning Effort
              </span>
              <span className="text-[10.5px] font-mono font-semibold text-[#07142e] bg-[rgba(7,20,46,0.06)] px-1.5 py-0.5 rounded">
                {currentEffort}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 bg-[rgba(7,20,46,0.04)] p-1 rounded-xl border border-[rgba(7,20,46,0.08)]">
              {EFFORTS.map((ef) => {
                const isSelected = currentEffort === ef.id;
                const isSupported = currentModel.efforts.includes(ef.id);
                return (
                  <button
                    key={ef.id}
                    type="button"
                    disabled={!isSupported}
                    onClick={(e) => selectEffort(ef.id, e)}
                    title={!isSupported ? "Not supported by this model" : ef.hint}
                    className={`py-1.5 text-center rounded-lg text-[11px] font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-[#07142e] text-[#faf8f2] shadow-xs font-bold"
                        : isSupported
                        ? "text-[rgba(7,20,46,0.7)] hover:text-[#07142e] hover:bg-white/80"
                        : "opacity-35 cursor-not-allowed"
                    }`}
                  >
                    {ef.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
                setShowModelPopover((prev) => !prev);
              }}
              title={`Active Model: ${currentModel.name} (${currentEffort} reasoning)`}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium border transition cursor-pointer ${
                showModelPopover
                  ? "bg-[#07142e] text-[#faf8f2] border-[#07142e] shadow-xs"
                  : "bg-transparent border-[rgba(7,20,46,0.24)] text-[#07142e] hover:bg-[rgba(255,253,248,0.2)] hover:border-[#07142e]"
              }`}
            >
              <FiZap size={11} className={showModelPopover ? "text-[#c5ef26]" : "text-[#07142e]"} />
              <span className="font-bold">{currentModel.name}</span>
              <span
                className={`font-mono text-[9.5px] uppercase tracking-wider px-1 py-0.2 rounded font-bold ${
                  showModelPopover ? "bg-white/20 text-white" : "bg-[rgba(7,20,46,0.08)] text-[#07142e]"
                }`}
              >
                {currentEffort}
              </span>
              <FiChevronDown size={11} className={`transition-transform duration-150 ${showModelPopover ? "rotate-180" : ""}`} />
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
