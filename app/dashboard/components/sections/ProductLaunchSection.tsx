"use client";

import React, { useEffect, useState } from "react";
import { FiArrowRight, FiLock, FiX } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { usePlans } from "../../../lib/plans";
import { DEFAULT_SETTINGS, type ChatSettings, type Ratio } from "../../lib/chatStore";
import { SHOWREEL, type ShowreelItem } from "../../../components/landing/showreel";

const LENGTHS = [10, 15, 20, 30] as const;
const RATIOS: Ratio[] = ["16:9", "9:16", "1:1"];
const STYLES = [
  { id: "keynote", label: "Keynote", desc: "Dark stage, big type, slow confident reveals" },
  { id: "bright", label: "Bright and friendly", desc: "Light ground, soft colour, bouncy UI moments" },
  { id: "editorial", label: "Editorial", desc: "Serif headlines, paper tones, measured pacing" },
  { id: "kinetic", label: "Kinetic", desc: "Fast cuts and punchy type on the beat" },
] as const;

const EXAMPLES = SHOWREEL.filter((r) => r.category === "Product launches");

interface Brief {
  name: string;
  what: string;
  features: string[];
  audience: string;
  cta: string;
  style: (typeof STYLES)[number]["id"];
}

/** The request the Studio receives: only what the person wrote, laid out as a launch story. */
function launchPrompt(b: Brief, length: number): string {
  const style = STYLES.find((s) => s.id === b.style)!;
  const features = b.features.map((f) => f.trim()).filter(Boolean);
  return [
    `A ${length}-second product launch video for ${b.name.trim()}: ${b.what.trim()}`,
    features.length ? `Show these features, one beat each: ${features.map((f) => `"${f}"`).join(", ")}.` : null,
    b.audience.trim() ? `It is for ${b.audience.trim()}.` : null,
    `Arc: a hook, the product reveal, the features, then end on the name${b.cta.trim() ? ` and "${b.cta.trim()}"` : ""}.`,
    `Style: ${style.label.toLowerCase()} (${style.desc.toLowerCase()}). Interface moments are clean mock-ups; use only the words and numbers given here.`,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function ProductLaunchSection({ onStartLaunch }: { onStartLaunch: (prompt: string, settings: ChatSettings) => void }) {
  const { user } = useAuth();
  const { plans } = usePlans();
  const maxSeconds = plans?.find((p) => p.tier === (user?.plan?.tier ?? "free"))?.maxSeconds ?? null;
  const [brief, setBrief] = useState<Brief>({ name: "", what: "", features: ["", "", ""], audience: "", cta: "", style: "keynote" });
  const [length, setLength] = useState<number>(15);
  const [ratio, setRatio] = useState<Ratio>("16:9");
  const [preview, setPreview] = useState<ShowreelItem | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  const set = (patch: Partial<Brief>) => setBrief((b) => ({ ...b, ...patch }));
  const ready = brief.name.trim() && brief.what.trim();
  const tooLong = (s: number) => maxSeconds != null && s > maxSeconds;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!ready) return;
    const seconds = tooLong(length) ? maxSeconds! : length;
    onStartLaunch(launchPrompt(brief, seconds), { ...DEFAULT_SETTINGS, ratio, length: seconds });
  };

  const input =
    "mt-1.5 w-full rounded-xl border border-surf-dedad0 bg-surf-ffffff px-3.5 text-[13.5px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:outline-none";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="text-[26px] font-bold text-ink-111110">Product launch</h1>
        <p className="mt-1 max-w-2xl text-[13.5px] text-ink-717069">
          Tell us about the product and we&apos;ll write a launch story around it: a hook, the reveal, your features and a
          closing call to action. Only the words and numbers you give here appear on screen.
        </p>
      </header>

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-12" noValidate>
        <div className="space-y-5 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12.5px] font-medium text-ink-55544e">Product name</span>
              <input
                className={`${input} h-10`}
                value={brief.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Northwind"
                aria-invalid={touched && !brief.name.trim()}
              />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-medium text-ink-55544e">Call to action (optional)</span>
              <input className={`${input} h-10`} value={brief.cta} onChange={(e) => set({ cta: e.target.value })} placeholder="Try it free at northwind.app" />
            </label>
          </div>
          <label className="block">
            <span className="text-[12.5px] font-medium text-ink-55544e">What it does, in a sentence</span>
            <textarea
              rows={2}
              className={`${input} resize-none py-2.5`}
              value={brief.what}
              onChange={(e) => set({ what: e.target.value })}
              placeholder="Plans a team's week from their calendar and inbox."
              aria-invalid={touched && !brief.what.trim()}
            />
          </label>
          <fieldset>
            <legend className="text-[12.5px] font-medium text-ink-55544e">Features to show (up to three)</legend>
            <div className="mt-1.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {brief.features.map((f, i) => (
                <input
                  key={i}
                  className={`${input} h-10`}
                  value={f}
                  aria-label={`Feature ${i + 1}`}
                  onChange={(e) => set({ features: brief.features.map((x, j) => (j === i ? e.target.value : x)) })}
                  placeholder={["Auto-scheduling", "Focus blocks", "Weekly report"][i]}
                />
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="text-[12.5px] font-medium text-ink-55544e">Who it&apos;s for (optional)</span>
            <input className={`${input} h-10`} value={brief.audience} onChange={(e) => set({ audience: e.target.value })} placeholder="Small product teams" />
          </label>
          <fieldset>
            <legend className="text-[12.5px] font-medium text-ink-55544e">Style</legend>
            <div className="mt-1.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={brief.style === s.id}
                  onClick={() => set({ style: s.id })}
                  className={`rounded-xl border p-3 text-left transition ${brief.style === s.id ? "border-surf-111110 bg-surf-faf9f5" : "border-surf-eceae3 hover:border-surf-dedad0"}`}
                >
                  <span className="block text-[12.5px] font-semibold text-ink-111110">{s.label}</span>
                  <span className="mt-0.5 block text-[11.5px] text-ink-717069">{s.desc}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <div className="space-y-4 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5">
            <fieldset>
              <legend className="text-[12.5px] font-medium text-ink-55544e">Length</legend>
              <div className="mt-1.5 grid grid-cols-4 gap-1 rounded-xl border border-surf-dedad0 p-1">
                {LENGTHS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={length === s}
                    disabled={tooLong(s)}
                    title={tooLong(s) ? `Your plan makes videos up to ${maxSeconds} s` : undefined}
                    onClick={() => setLength(s)}
                    className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[12.5px] font-medium tabular-nums disabled:cursor-not-allowed disabled:opacity-40 ${length === s ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"}`}
                  >
                    {tooLong(s) && <FiLock size={10} />}
                    {s} s
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[12.5px] font-medium text-ink-55544e">Frame</legend>
              <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-xl border border-surf-dedad0 p-1">
                {RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={ratio === r}
                    onClick={() => setRatio(r)}
                    className={`rounded-lg py-1.5 text-[12.5px] font-medium ${ratio === r ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </fieldset>
            {touched && !ready && <p className="text-[12.5px] text-ink-dc2626">Add the product name and what it does.</p>}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-3 text-[13.5px] font-semibold text-white transition hover:bg-surf-272725"
            >
              Write the launch video <FiArrowRight size={14} />
            </button>
            <p className="text-[12px] leading-relaxed text-ink-717069">
              Opens in the Studio, where you can watch it being made and change anything afterwards. It costs credits like any video.
            </p>
          </div>
        </aside>
      </form>

      {EXAMPLES.length > 0 && (
        <section aria-labelledby="launch-examples">
          <h2 id="launch-examples" className="text-[15px] font-semibold text-ink-111110">
            Launch videos made with byreel
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMPLES.map((r) => (
              <li key={r.id} className="overflow-hidden rounded-xl border border-surf-dedad0 bg-surf-ffffff">
                <button type="button" onClick={() => setPreview(r)} className="block aspect-video w-full bg-[#0b0b0a]" aria-label={`Watch ${r.title}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/showreel/${r.id}.webp`} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
                <p className="truncate p-3.5 text-[13.5px] font-semibold text-ink-111110">{r.title}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreview(null)} role="presentation">
          <div role="dialog" aria-modal="true" aria-label={preview.title} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-surf-ffffff shadow-2xl">
            <video src={`/showreel/video/${preview.id}-720.mp4`} poster={`/showreel/${preview.id}.webp`} autoPlay muted loop playsInline className="aspect-video w-full bg-black" />
            <div className="space-y-2 p-5">
              <h3 className="text-[16px] font-semibold text-ink-111110">{preview.title}</h3>
              <p className="text-[13px] leading-relaxed text-ink-717069">{preview.prompt}</p>
            </div>
            <button type="button" onClick={() => setPreview(null)} aria-label="Close" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-111110">
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
