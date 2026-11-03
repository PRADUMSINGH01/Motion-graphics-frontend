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
import { useOpenRouterProviders } from "../lib/models";
import { api } from "../../lib/api";
import { loadBrandKit } from "../lib/brandKit";

/**
 * The credits a film with these settings holds when it starts (the server's estimate for this model and
 * length; it is then charged what it measures). Fetched a moment after the settings stop changing.
 */
function useEstimate(provider: string | undefined, model: string | undefined, length: number): number | null {
  const [result, setResult] = useState<{ key: string; credits: number } | null>(null);
  const key = `${provider}|${model}|${length}`;
  useEffect(() => {
    let live = true;
    const timer = setTimeout(() => {
      api.billing
        .estimate({ provider, model, length })
        .then((r) => live && setResult({ key, credits: r.credits }))
        .catch(() => {});
    }, 250);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [provider, model, length, key]);
  return result?.key === key ? result.credits : null;
}
import type { OpenRouterProvider } from "../../lib/api";

const RATIOS: { id: Ratio; w: number; h: number }[] = [
  { id: "16:9", w: 16, h: 9 },
  { id: "9:16", w: 9, h: 16 },
  { id: "1:1", w: 12, h: 12 },
];
// Any whole second from 1 to 60; the plan may allow less.
const MIN_SECONDS = 1;
const MAX_SECONDS = 60;
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

  const cost = useEstimate(settings.provider, settings.model, settings.length) ?? creditCost(settings.length);
  // Read on each render: the kit lives in this browser and changes on the Brand kit page.
  const brandOn = Boolean(user?.id && typeof window !== "undefined" && loadBrandKit(user.id).enabled);
  const remaining = user?.usage?.credits?.remaining;
  const short = remaining != null && remaining < cost;
  const lockedTitle = maxSeconds ? `Your plan makes films up to ${maxSeconds} s. Upgrade in Billing for longer films.` : undefined;
  // The longest film this plan makes; a typed length outside 1..that comes back inside.
  const allowedSeconds = Math.min(MAX_SECONDS, maxSeconds ?? MAX_SECONDS);
  const setLength = (s: number) => {
    if (!Number.isFinite(s)) return;
    onChange({ ...settings, length: Math.max(MIN_SECONDS, Math.min(allowedSeconds, Math.round(s))) });
  };
  // A provider choice belongs to its model: a new model starts on Auto.
  const pickModel = (m: ModelOption, e: EffortLevel) =>
    onChange({ ...settings, provider: m.provider, model: m.id, effort: e, route: m.id === settings.model ? settings.route : undefined });

  // OpenRouter models: who serves the film. Auto lets OpenRouter balance; a sort or one named provider.
  const routed = model.provider === "openrouter";
  const providers = useOpenRouterProviders(routed ? model.id : null);
  const route = (routed && settings.route) || "auto";
  const pinned = providers?.find((p) => p.tag === route);
  const money = (n: number) => (n === 0 ? "free" : `$${n < 0.1 ? n.toFixed(3).replace(/0$/, "") : n.toFixed(2)}`);
  const providerLabel = (p: OpenRouterProvider) => {
    const variant = p.tag.split("/").slice(1).join("/") || p.quantization;
    return `${p.name}${variant ? ` · ${variant}` : ""} — ${money(p.inputPerM)} in / ${money(p.outputPerM)} out`;
  };

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

      {routed && (
        <div className="space-y-2">
          <label htmlFor={`studio-route-${variant}`} className="block text-[12px] font-medium text-[var(--db-muted)]">
            Provider
          </label>
          <div className="relative">
            <select
              id={`studio-route-${variant}`}
              value={route}
              onChange={(e) => onChange({ ...settings, route: e.target.value === "auto" ? undefined : e.target.value })}
              className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-[var(--db-rule-strong)] bg-white pl-3 pr-8 text-[13px] text-[var(--db-ink)] transition hover:border-[rgba(7,20,46,0.32)]"
            >
              <option value="auto">Auto: cheapest reliable hosts</option>
              <option value="throughput">Fastest available</option>
              {route !== "auto" && route !== "throughput" && !pinned && <option value={route}>{route}</option>}
              {providers && providers.length > 0 && (
                <optgroup label="Only this provider">
                  {providers.map((p) => (
                    <option key={p.tag} value={p.tag}>
                      {providerLabel(p)}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <FiChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--db-muted)]" />
          </div>
          <p className="text-[12px] leading-snug text-[var(--db-muted)]">
            {pinned
              ? `Only ${pinned.name} runs this film, with no fallback${pinned.uptime != null ? ` (${pinned.uptime}% up today)` : ""}. Prices per million tokens.`
              : providers === null
              ? "Loading providers…"
              : providers.length === 0
              ? "Couldn't load the provider list. Auto still works."
              : `${providers.length} provider${providers.length === 1 ? "" : "s"} serve this model; Auto uses the cheapest reliable ones. Prices per million tokens.`}
          </p>
        </div>
      )}

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
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`studio-length-${variant}`} className="text-[12px] font-medium text-[var(--db-muted)]">
            Length
          </label>
          <span className="flex items-center gap-1.5">
            <input
              type="number"
              inputMode="numeric"
              aria-label="Length in seconds"
              min={MIN_SECONDS}
              max={allowedSeconds}
              value={settings.length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="h-9 w-16 rounded-lg border border-[var(--db-rule-strong)] bg-white px-2 text-right text-[13px] font-semibold tabular-nums text-[var(--db-ink)] focus:border-[var(--db-ink)] focus:outline-none"
            />
            <span className="text-[12.5px] text-[var(--db-muted)]">s</span>
          </span>
        </div>
        <input
          id={`studio-length-${variant}`}
          type="range"
          min={MIN_SECONDS}
          max={allowedSeconds}
          step={1}
          value={Math.min(settings.length, allowedSeconds)}
          onChange={(e) => setLength(Number(e.target.value))}
          aria-valuetext={`${settings.length} seconds`}
          title={lockedTitle}
          className="h-11 w-full cursor-pointer accent-[var(--db-ink)] lg:h-8"
        />
        <div className="flex justify-between text-[11.5px] tabular-nums text-[var(--db-faint)]" aria-hidden="true">
          <span>{MIN_SECONDS} s</span>
          <span>{allowedSeconds} s</span>
        </div>
        {maxSeconds !== null && maxSeconds < MAX_SECONDS && (
          <p className="text-[12px] leading-snug text-[var(--db-muted)]">
            Your plan makes films up to {maxSeconds} s.{" "}
            <a href="#membership" className="font-medium text-[var(--db-ink)] underline underline-offset-2">
              See plans
            </a>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span id={`studio-sound-${variant}`} className="text-[12px] font-medium text-[var(--db-muted)]">
          Sound effects
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={settings.sound !== false}
          aria-labelledby={`studio-sound-${variant}`}
          onClick={() => onChange({ ...settings, sound: settings.sound === false })}
          className={`relative h-7 w-12 shrink-0 rounded-full transition cursor-pointer ${settings.sound !== false ? "bg-[var(--db-ink)]" : "bg-[rgba(7,20,46,0.2)]"}`}
        >
          <span
            aria-hidden="true"
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${settings.sound !== false ? "left-6" : "left-1"}`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-[var(--db-muted)]">Brand kit</span>
        <a href="#brandkit" className="text-[12px] font-medium text-[var(--db-ink)] underline underline-offset-2">
          {brandOn ? "On" : "Off"}
        </a>
      </div>

      <div className="border-t border-[var(--db-rule)] pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] text-[var(--db-muted)]">This video uses</span>
          <span className={`text-[15px] font-semibold tabular-nums ${short ? "text-[#b42318]" : "text-[var(--db-ink)]"}`}>{cost} {cost === 1 ? "credit" : "credits"}</span>
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
          {settings.ratio}, {settings.length} s{settings.sound === false ? ", silent" : ""}
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
