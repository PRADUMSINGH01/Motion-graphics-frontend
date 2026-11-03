"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import { DEFAULT_SETTINGS, type ChatSettings, type Ratio } from "../../lib/chatStore";
import { SHOWREEL, type ShowreelItem } from "../../../components/landing/showreel";

const LENGTHS = [3, 5, 8, 10] as const;
const RATIOS: Ratio[] = ["16:9", "9:16", "1:1"];

/** Cutaways the engine draws well: type, data, interface and graphic motion. Each is a prompt to start from. */
const IDEAS = [
  { title: "Highlighted quote", prompt: "A printed article on paper; the camera drifts across it and a lime highlighter sweeps over the key sentence." },
  { title: "Number that climbs", prompt: "A big counter climbs from 0 to 12,400 with a thin progress line under it, then settles with a soft pulse." },
  { title: "Route on a map", prompt: "A minimal map in two tones; a dashed route draws from one pin to another and the arrival pin drops in." },
  { title: "Bar chart build", prompt: "Five bars rise one after another on a clean grid, the tallest one turns lime and gets a label." },
  { title: "Interface zoom", prompt: "A clean app dashboard mock-up; the camera pushes in on one card while the rest of the screen softens." },
  { title: "Notification stack", prompt: "Phone notifications slide in and stack one after another, each with a small bounce, on a dark ground." },
  { title: "Kinetic keyword", prompt: "One word in heavy type punches in, splits into letters that scatter, then reassembles as the next word." },
  { title: "Texture loop", prompt: "A slow, seamless loop of grainy gradient light moving across a dark ground, for behind a voice-over." },
];

/** Real renders that work as cutaways. */
const EXAMPLES = SHOWREEL.filter((r) => r.category === "Textures" || r.category === "Cinematic").slice(0, 6);

export default function BRollsSection({ onMake }: { onMake: (prompt: string, settings: ChatSettings) => void }) {
  const [prompt, setPrompt] = useState("");
  const [length, setLength] = useState<number>(5);
  const [ratio, setRatio] = useState<Ratio>("16:9");
  const [preview, setPreview] = useState<ShowreelItem | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  const make = (text: string) => {
    const t = text.trim();
    if (!t) return promptRef.current?.focus();
    onMake(`A ${length}-second B-roll cutaway, no voice or captions: ${t}`, { ...DEFAULT_SETTINGS, ratio, length });
  };

  const pickIdea = (text: string) => {
    setPrompt(text);
    promptRef.current?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="text-[26px] font-bold text-ink-111110">Animated B-rolls</h1>
        <p className="mt-1 max-w-2xl text-[13.5px] text-ink-717069">
          Short motion cutaways to drop between shots: a highlighted quote, a number that climbs, a route on a map. Each one
          is made in the Studio like any other video and costs credits the same way.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          make(prompt);
        }}
        className="space-y-4 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5"
      >
        <label htmlFor="broll-prompt" className="block text-[13px] font-semibold text-ink-111110">
          What should the cutaway show?
        </label>
        <textarea
          id="broll-prompt"
          ref={promptRef}
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) make(prompt);
          }}
          placeholder="A lime underline draws beneath “30% faster”, then the number counts up from 0…"
          className="w-full resize-none rounded-xl border border-surf-dedad0 bg-surf-ffffff px-3.5 py-3 text-[13.5px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Length</legend>
            <span className="text-[12.5px] text-ink-717069">Length</span>
            <div className="flex rounded-lg border border-surf-dedad0 p-0.5">
              {LENGTHS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={length === s}
                  onClick={() => setLength(s)}
                  className={`rounded-md px-2.5 py-1 text-[12.5px] font-medium tabular-nums ${length === s ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"}`}
                >
                  {s} s
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Frame</legend>
            <span className="text-[12.5px] text-ink-717069">Frame</span>
            <div className="flex rounded-lg border border-surf-dedad0 p-0.5">
              {RATIOS.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={ratio === r}
                  onClick={() => setRatio(r)}
                  className={`rounded-md px-2.5 py-1 text-[12.5px] font-medium ${ratio === r ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-surf-272725 disabled:opacity-40"
          >
            Make B-roll <FiArrowRight size={14} />
          </button>
        </div>
      </form>

      <section aria-labelledby="broll-ideas">
        <h2 id="broll-ideas" className="text-[15px] font-semibold text-ink-111110">
          Ideas to start from
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {IDEAS.map((idea) => (
            <li key={idea.title}>
              <button
                type="button"
                onClick={() => pickIdea(idea.prompt)}
                className="h-full w-full rounded-xl border border-surf-dedad0 bg-surf-ffffff p-4 text-left transition hover:border-surf-111110"
              >
                <span className="block text-[13.5px] font-semibold text-ink-111110">{idea.title}</span>
                <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-717069">{idea.prompt}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {EXAMPLES.length > 0 && (
        <section aria-labelledby="broll-examples">
          <h2 id="broll-examples" className="text-[15px] font-semibold text-ink-111110">
            Made with byreel
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMPLES.map((r) => (
              <li key={r.id} className="overflow-hidden rounded-xl border border-surf-dedad0 bg-surf-ffffff">
                <button type="button" onClick={() => setPreview(r)} className="block aspect-video w-full bg-[#0b0b0a]" aria-label={`Watch ${r.title}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/showreel/${r.id}.webp`} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
                <div className="flex items-center justify-between gap-3 p-3.5">
                  <span className="truncate text-[13.5px] font-semibold text-ink-111110">{r.title}</span>
                  <button type="button" onClick={() => pickIdea(r.prompt)} className="shrink-0 text-[12.5px] font-medium text-ink-717069 hover:text-ink-111110">
                    Use prompt
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreview(null)} role="presentation">
          <div role="dialog" aria-modal="true" aria-label={preview.title} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-surf-ffffff shadow-2xl">
            <video src={`/showreel/video/${preview.id}-720.mp4`} poster={`/showreel/${preview.id}.webp`} autoPlay muted loop playsInline className="aspect-video w-full bg-black" />
            <div className="space-y-3 p-5">
              <h3 className="text-[16px] font-semibold text-ink-111110">{preview.title}</h3>
              <p className="text-[13px] leading-relaxed text-ink-717069">{preview.prompt}</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    pickIdea(preview.prompt);
                    setPreview(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2 text-[12.5px] font-semibold text-white"
                >
                  Use this prompt <FiArrowRight size={14} />
                </button>
              </div>
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
