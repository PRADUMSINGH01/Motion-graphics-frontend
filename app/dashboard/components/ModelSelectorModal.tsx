"use client";

import React, { Fragment, useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiCpu,
  FiX,
  FiCheck,
  FiSliders,
  FiZap,
  FiShield,
  FiActivity,
} from "react-icons/fi";

import { FALLBACK_MODELS, findModel, useModels, type EffortLevel, type ModelOption } from "../lib/models";

// The picker's list is the server's (useModels); these names stay importable from here.
export { FALLBACK_MODELS as AVAILABLE_MODELS, findModel, useModels, type EffortLevel, type ModelOption };

export const EFFORT_OPTIONS: {
  id: EffortLevel;
  label: string;
  sub: string;
  tag: string;
  hint: string;
}[] = [
  { id: "low", label: "Low", sub: "Fast", tag: "Fast", hint: "Instant response · Budget friendly" },
  { id: "medium", label: "Med", sub: "Balanced", tag: "Balanced", hint: "Standard reasoning depth" },
  { id: "high", label: "High", sub: "Deep", tag: "Deep", hint: "Deep multi-step reasoning" },
  { id: "xhigh", label: "Max", sub: "Exhaustive", tag: "Max", hint: "Maximum thinking budget (xhigh)" },
];

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelId: string;
  selectedEffort: EffortLevel;
  onSelect: (model: ModelOption, effort: EffortLevel) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function ModelSelectorModal({
  isOpen,
  onClose,
  selectedModelId,
  selectedEffort,
  onSelect,
  triggerRef,
}: ModelSelectorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeModelId, setActiveModelId] = useState<string>(selectedModelId);
  const [activeEffort, setActiveEffort] = useState<EffortLevel>(selectedEffort);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const models = useModels();

  // Sync props when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveModelId(selectedModelId);
      setActiveEffort(selectedEffort);
    }
  }, [isOpen, selectedModelId, selectedEffort]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Responsive device check & desktop popover positioning
  const updatePosition = () => {
    if (typeof window === "undefined") return;
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);

    if (mobile || !triggerRef?.current) {
      setCoords(null);
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 440;
    const popoverHeight = 520;
    const margin = 12;

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    let top: number;
    if (spaceAbove >= popoverHeight + margin || spaceAbove > spaceBelow) {
      // Position above trigger
      top = Math.max(margin, rect.top - popoverHeight - 8);
    } else {
      // Position below trigger
      top = Math.min(window.innerHeight - popoverHeight - margin, rect.bottom + 8);
    }

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - margin) {
      left = window.innerWidth - popoverWidth - margin;
    }
    if (left < margin) {
      left = margin;
    }

    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, { passive: true });
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [isOpen, triggerRef]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleApply();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeModelId, activeEffort]);

  if (!isOpen || !mounted || typeof document === "undefined") {
    return null;
  }

  const currentModel = findModel(models, activeModelId);

  const handleSelectModel = (model: ModelOption) => {
    setActiveModelId(model.id);
    // If active effort is not supported by the new model, fall back to default
    if (!model.efforts.includes(activeEffort)) {
      setActiveEffort(model.defaultEffort);
    }
  };

  const handleSelectEffort = (effort: EffortLevel) => {
    setActiveEffort(effort);
  };

  const handleApply = () => {
    onSelect(currentModel, activeEffort);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] pointer-events-auto">
      {/* ── Screen Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={handleApply}
        aria-hidden="true"
      />

      {/* ── Floating Popover (Desktop) / Bottom Sheet (Mobile) ── */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={
          !isMobile && coords
            ? {
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: "440px",
              }
            : undefined
        }
        className={`fixed z-[1000000] flex flex-col bg-white border border-[rgba(7,20,46,0.12)] shadow-2xl text-[#07142e] transition-all duration-200 select-none ${
          isMobile
            ? "inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl p-4 pb-8 border-b-0 animate-in slide-in-from-bottom"
            : !coords
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-h-[85vh] rounded-2xl p-5 animate-in fade-in zoom-in-95"
            : "max-h-[520px] rounded-2xl p-4.5 animate-in fade-in zoom-in-95"
        }`}
      >
        {/* Mobile Drag Indicator */}
        {isMobile && (
          <div className="w-12 h-1.5 rounded-full bg-[#07142e]/20 mx-auto mb-3 shrink-0" />
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(7,20,46,0.12)] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#07142e] text-[#c5ef26]">
              <FiCpu size={15} />
            </div>
            <div>
              <h3 className="text-[13.5px] font-bold text-[#07142e] tracking-tight leading-none m-0">
                LLM Engine &amp; Reasoning
              </h3>
              <p className="text-[11px] text-[rgba(7,20,46,0.65)] m-0 mt-0.5">
                Select generation model and thinking budget
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleApply}
            aria-label="Close selector"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[rgba(7,20,46,0.5)] hover:text-[#07142e] hover:bg-[rgba(7,20,46,0.06)] transition cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Scrollable Model Options */}
        <div className="flex-1 overflow-y-auto py-2.5 space-y-2 pr-1 min-h-0">
          {models.map((model, i) => {
            const isSelected = activeModelId === model.id;
            // A heading where a new provider group starts (OpenRouter's Free, Value and Top among them).
            const startsGroup = i === 0 || models[i - 1].providerLabel !== model.providerLabel;
            return (
              <Fragment key={`${model.provider}:${model.id}`}>
              {startsGroup && (
                <p className={`m-0 px-1 text-[10.5px] font-bold uppercase tracking-wider text-[rgba(7,20,46,0.55)] ${i === 0 ? "" : "pt-2"}`}>
                  {model.providerLabel}
                </p>
              )}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleSelectModel(model)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectModel(model);
                  }
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "border-[#07142e] bg-[rgba(7,20,46,0.07)] shadow-xs"
                    : "border-[rgba(7,20,46,0.12)] hover:border-[#07142e]/40 hover:bg-[rgba(7,20,46,0.02)]"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] font-bold text-[#07142e] tracking-tight">
                      {model.name}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[rgba(7,20,46,0.07)] text-[#07142e]/85">
                      {model.tag}
                    </span>
                    {model.badge && (
                      <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c5ef26]/30 text-[#07142e] border border-[#07142e]/15">
                        {model.badge}
                      </span>
                    )}
                    {model.isReady && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium"
                        title="Live &amp; Ready"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-[rgba(7,20,46,0.68)] leading-snug mt-1 m-0">{model.description}</p>
                </div>

                {/* Selection Radio / Check Pill */}
                <div
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? "border-[#07142e] bg-[#07142e] text-[#c5ef26] shadow-2xs"
                      : "border-[rgba(7,20,46,0.12)] bg-white text-transparent"
                  }`}
                >
                  <FiCheck size={13} strokeWidth={3} />
                </div>
              </div>
              </Fragment>
            );
          })}
        </div>

        {/* Reasoning Effort Selector */}
        <div className="pt-3 border-t border-[rgba(7,20,46,0.12)] shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FiSliders size={13} className="text-[#07142e]" />
              <span className="text-[12px] font-bold text-[#07142e]">
                Reasoning Effort
              </span>
            </div>
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#07142e] bg-[rgba(7,20,46,0.08)] px-2 py-0.5 rounded-md">
              {activeEffort === "xhigh" ? "MAX" : activeEffort.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 bg-[rgba(7,20,46,0.04)] p-1 rounded-xl border border-[rgba(7,20,46,0.1)]">
            {EFFORT_OPTIONS.map((ef) => {
              const isSelected = activeEffort === ef.id;
              const isSupported = currentModel.efforts.includes(ef.id);

              return (
                <button
                  key={ef.id}
                  type="button"
                  disabled={!isSupported}
                  onClick={() => handleSelectEffort(ef.id)}
                  title={!isSupported ? "Not supported by this model" : ef.hint}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#07142e] text-[#faf8f2] shadow-xs font-bold"
                      : isSupported
                      ? "text-[#07142e]/75 hover:text-[#07142e] hover:bg-white/80 font-medium"
                      : "opacity-30 cursor-not-allowed text-[#07142e]"
                  }`}
                >
                  <span className="text-[12px] font-bold leading-none">
                    {ef.label}
                  </span>
                  <span
                    className={`text-[9.5px] font-medium leading-none mt-1 ${
                      isSelected ? "text-[#c5ef26]" : "text-[rgba(7,20,46,0.55)]"
                    }`}
                  >
                    {ef.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Confirmation Bar */}
        <div className="mt-3 pt-2.5 border-t border-[rgba(7,20,46,0.1)] flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0 flex items-center gap-1.5 text-[11px] text-[rgba(7,20,46,0.7)] font-medium">
            <FiZap size={12} className="text-[#84cc16] shrink-0" />
            <span className="truncate">
              <strong className="text-[#07142e] font-bold">{currentModel.name}</strong> ·{" "}
              {activeEffort === "xhigh" ? "Max" : activeEffort.charAt(0).toUpperCase() + activeEffort.slice(1)} Effort
            </span>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#07142e] hover:bg-[#040c1c] active:scale-95 px-4 py-2 text-[12px] font-bold text-[#faf8f2] shadow-xs transition cursor-pointer"
          >
            <span>Apply Selection</span>
            <FiCheck size={13} strokeWidth={2.5} className="text-[#c5ef26]" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
