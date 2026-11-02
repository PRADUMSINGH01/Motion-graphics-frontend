"use client";

/**
 * The next film's settings: model and effort, frame, length, and what it costs. Wide screens show them as
 * the Studio's side panel; narrow ones as one summary button that opens the same panel in a bottom sheet.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown, FiLock, FiSliders } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { creditCost, usePlans } from "../../lib/plans";
import type { ChatSettings, Ratio } from "../lib/chatStore";
import ModelSelectorModal, { findModel, useModels, type EffortLevel, type ModelOption } from "./ModelSelectorModal";

const RATIOS: { id: Ratio; w: number; h: number }[] = [
  { id: "16:9", w: 16, h: 9 },
  { id: "9:16", w: 9, h: 16 },
  { id: "1:1", w: 12, h: 12 },
];
const LENGTHS = [15, 30, 45, 60];
const EFFORT_NAMES: Record<string, string> = { low: "Low", medium: "Medium", high: "High", xhigh: "Max" };

function FrameIcon({ w, h }: { w: number; h: number }) {
  const scale = 12 / Math.max(w, h);
  return (
    <span
      aria-hidden="true"
      className="inline-block rounded-[2px] border-[1.5px] border-current"
      style={{ width: Math.round(w * scale), height: Math.round(h * scale) }}
    />
  );
}

/** Mutually exclusive choices, as a radio group. */
function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  render,
  isLocked,
  lockedTitle,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  render: (v: T) => React.ReactNode;
  isLocked?: (v: T) => boolean;
  lockedTitle?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full rounded-lg border border-[var(--db-rule-strong)] bg-white p-0.5">
      {options.map((o) => {
        const active = o === value;
        const locked = isLocked?.(o) ?? false;
        return (
          <button
            key={String(o)}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={locked}
            title={locked ? lockedTitle : undefined}
            onClick={() => onChange(o)}
            className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-[12.5px] font-medium transition lg:h-10 ${
              active
                ? "bg-[var(--db-ink)] text-white"
                : locked
                ? "cursor-not-allowed text-[#9aa1b0]"
                : "cursor-pointer text-[var(--db-muted)] hover:bg-[var(--db-paper-2)] hover:text-[var(--db-ink)]"
            }`}
          >
            {locked ? <FiLock size={11} aria-hidden="true" /> : null}
            {render(o)}
          </button>
        );
      })}
    </div>
  );
}

export default function StudioSettings({
  settings,
  onChange,
  variant,
}: {
  settings: ChatSettings;
  onChange: (settings: ChatSettings) => void;
  variant: "panel" | "sheet";
}) {
  const models = useModels();
  const model = findModel(models, settings.model);
  const effort = (settings.effort as EffortLevel) || model.defaultEffort;
  const [picking, setPicking] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // The plan's longest film: longer lengths show locked, and a saved longer length comes down to it.
  const { user } = useAuth();
  const { plans } = usePlans();
  const maxSeconds = plans?.find((p) => p.tier === (user?.plan?.tier ?? "free"))?.maxSeconds ?? null;
  useEffect(() => {
    if (maxSeconds && settings.length > maxSeconds) onChange({ ...settings, length: maxSeconds });
  }, [maxSeconds, settings, onChange]);

  // The sheet holds the page still behind it and closes on Escape (unless the model picker is on top).
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !picking && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen, picking]);

  const cost = creditCost(settings.length);
  const remaining = user?.usage?.credits?.remaining;
  const short = remaining != null && remaining < cost;
  const lockedTitle = maxSeconds ? `Your plan makes films up to ${maxSeconds} s. Upgrade in Billing for longer films.` : undefined;
  const pickModel = (m: ModelOption, e: EffortLevel) => onChange({ ...settings, provider: m.provider, model: m.id, effort: e });

  const panel = (
    <section aria-labelledby={`studio-settings-${variant}`} className="space-y-5">
      <h2 id={`studio-settings-${variant}`} className="text-[13px] font-semibold text-[var(--db-ink)]">
        Next video
      </h2>

      <div className="space-y-2">
        <p className="text-[12px] font-medium text-[var(--db-muted)]">Model</p>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setPicking((p) => !p)}
          aria-haspopup="dialog"
          aria-expanded={picking}
          className="flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-[var(--db-rule-strong)] bg-white px-3 text-left transition hover:border-[rgba(7,20,46,0.32)] cursor-pointer"
        >
          <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[var(--db-ink)]">{model.name}</span>
          <span className="shrink-0 rounded bg-[var(--db-paper-2)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--db-muted)]">
            {EFFORT_NAMES[effort] ?? effort}
          </span>
          <FiChevronDown size={14} aria-hidden="true" className="shrink-0 text-[var(--db-muted)]" />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-medium text-[var(--db-muted)]">Frame</p>
        <Segmented
          label="Frame"
          options={RATIOS.map((r) => r.id)}
          value={settings.ratio}
          onChange={(r) => onChange({ ...settings, ratio: r })}
          render={(id) => {
            const r = RATIOS.find((x) => x.id === id)!;
            return (
              <>
                <FrameIcon w={r.w} h={r.h} />
                <span>{r.id}</span>
              </>
            );
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-medium text-[var(--db-muted)]">Length</p>
        <Segmented
          label="Length in seconds"
          options={LENGTHS}
          value={settings.length}
          onChange={(s) => onChange({ ...settings, length: s })}
          isLocked={(s) => maxSeconds !== null && s > maxSeconds}
          lockedTitle={lockedTitle}
          render={(s) => <span className="tabular-nums">{s}s</span>}
        />
        {maxSeconds !== null && maxSeconds < LENGTHS[LENGTHS.length - 1] && (
          <p className="text-[12px] leading-snug text-[var(--db-muted)]">
            Your plan makes films up to {maxSeconds} s.{" "}
            <a href="#membership" className="font-medium text-[var(--db-ink)] underline underline-offset-2">
              See plans
            </a>
          </p>
        )}
      </div>

      <div className="border-t border-[var(--db-rule)] pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] text-[var(--db-muted)]">This video uses</span>
          <span className={`text-[15px] font-semibold tabular-nums ${short ? "text-[#b42318]" : "text-[var(--db-ink)]"}`}>{cost} credits</span>
        </div>
        {remaining != null && (
          <p className={`mt-1 text-right text-[12px] tabular-nums ${short ? "text-[#b42318]" : "text-[var(--db-muted)]"}`}>
            {short ? `Only ${remaining} left this month` : `${remaining} left this month`}
          </p>
        )}
      </div>

      <ModelSelectorModal
        isOpen={picking}
        onClose={() => setPicking(false)}
        selectedModelId={model.id}
        selectedEffort={effort}
        onSelect={pickModel}
        triggerRef={triggerRef}
      />
    </section>
  );

  if (variant === "panel") return panel;

  return (
    <>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-haspopup="dialog"
        className="flex h-11 min-w-0 max-w-full items-center gap-2 rounded-lg border border-[var(--db-rule-strong)] bg-white px-3 text-left text-[12.5px] cursor-pointer"
      >
        <FiSliders size={14} aria-hidden="true" className="shrink-0 text-[var(--db-muted)]" />
        <span className="min-w-0 truncate font-semibold text-[var(--db-ink)]">{model.name}</span>
        <span className="shrink-0 tabular-nums text-[var(--db-muted)]">
          {settings.ratio}, {settings.length} s
        </span>
      </button>
      {sheetOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true" aria-label="Video settings">
              <div className="absolute inset-0 bg-[rgba(7,20,46,0.45)]" onClick={() => setSheetOpen(false)} aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-2xl bg-[var(--db-paper-2)] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[var(--db-shadow-lg)]">
                <div aria-hidden="true" className="mx-auto mb-4 h-1 w-10 rounded-full bg-[rgba(7,20,46,0.18)]" />
                {panel}
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="mt-6 h-12 w-full rounded-xl bg-[var(--db-ink)] text-[14px] font-semibold text-white cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>,
            // Inside the dashboard root, so the sheet has its colours and focus styles.
            document.querySelector(".db") ?? document.body
          )
        : null}
    </>
  );
}
