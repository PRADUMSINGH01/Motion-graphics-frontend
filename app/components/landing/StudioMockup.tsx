"use client";

import { useState } from "react";
import { BARS, FORMATS, PAL, SETS, type FormatId } from "./data";
import { SceneArt, SceneCaption } from "./SceneArt";

const STEPS = ["Read your product page", "Pulled brand colours and logo", "Wrote the script", "Picked shots and b-roll"];

function CheckDot() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-none">
      <circle cx="8" cy="8" r="7" fill="#DCFCE7" />
      <path d="M5 8.2l2 2L11 6" stroke="#15803D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StudioMockup() {
  const [format, setFormat] = useState<FormatId>("launch");
  const set = SETS[format];
  const scenes = set.scenes.map((s, i) => ({
    pal: PAL[i],
    time: s[0],
    caption: s[1],
    label: s[2],
    delay: `${i * 2.2}s`,
  }));
  const vertical = format === "short";

  return (
    <section id="studio" className="lp-wrap pt-[120px]">
      <div className="lp-sc lp-mono">
        <span>SC.01 — THE STUDIO</span>
        <span>TC 00:00:12:00</span>
      </div>

      <div className="lp-g12 mb-16 grid grid-cols-12 items-start gap-x-8 gap-y-10">
        <h2 className="lp-serif lp-h2 col-span-6">
          Direct every scene. <em className="lp-acc">Skip the edit.</em>
        </h2>
        <div className="col-span-5 col-start-8 flex flex-col gap-7">
          <p className="m-0 text-[18px]" style={{ color: "var(--lp-ink-2)" }}>
            You stay in charge of the story. The AI director reads your product, writes the script, picks the shots and
            cuts it together while you watch.
          </p>
          <div className="grid grid-cols-2 gap-x-6">
            {[
              ["AI director", "Script and shot list from your page"],
              ["Storyboard", "Reorder, rewrite, regenerate"],
              ["Captions", "Word-timed and on brand"],
              ["Export", "16:9, 1:1 and 9:16"],
            ].map(([t, d], i) => (
              <div
                key={t}
                className={`border-t py-4 ${i > 1 ? "border-b" : ""}`}
                style={{ borderColor: "var(--lp-rule)" }}
              >
                <div className="text-[15px] font-semibold">{t}</div>
                <div className="text-[14px]" style={{ color: "var(--lp-muted)" }}>
                  {d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-[14px] border bg-white"
        style={{ borderColor: "var(--lp-ink)", boxShadow: "0 40px 80px -48px rgba(17,17,16,.45)" }}
      >
        {/* toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F0F2] px-3.5 py-2.5">
          <div className="flex items-center gap-3.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4E7]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4E7]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E4E4E7]" />
            </div>
            <span className="text-[13px] font-medium text-[#3F3F46]">Untitled project</span>
          </div>
          <div role="group" aria-label="Video type" className="inline-flex gap-[3px] rounded-[10px] bg-[#F4F4F5] p-[3px]">
            {FORMATS.map((f) => {
              const on = f.id === format;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFormat(f.id)}
                  className={`min-h-8 cursor-pointer rounded-lg border-0 px-3 text-[13px] font-medium transition-all duration-200 ${
                    on ? "bg-white text-[#0B0B0F] shadow-[0_1px_3px_rgba(11,11,15,.14)]" : "bg-transparent text-[#52525B]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5">
            <span className="lp-mono inline-flex items-center gap-[7px] text-[12px] text-[#52525B]">
              <span className="lp-pulse h-[7px] w-[7px] rounded-full" style={{ background: "var(--lp-accent)" }} />
              {set.ratio} · {set.duration}
            </span>
            <span className="rounded-lg bg-[#0B0B0F] px-[13px] py-[7px] text-[12px] font-semibold text-white">Export</span>
          </div>
        </div>

        <div className="flex flex-wrap">
          {/* AI panel */}
          <aside className="flex min-w-0 max-w-[300px] flex-[1_1_250px] flex-col gap-4 border-r border-[#F0F0F2] bg-[#FBFBFA] p-[18px]">
            <div className="lp-mono text-[11px] tracking-[0.06em] text-[#71717A]">AI DIRECTOR</div>
            <div className="rounded-xl border border-[#E4E4E7] bg-white px-3.5 py-3 text-[13px] leading-[1.45] text-[#3F3F46]">
              Make a launch video for my product page. Keep it punchy, on brand, under 40 seconds.
            </div>
            <div className="flex flex-col gap-2.5 text-[13px]">
              {STEPS.map((s, i) => (
                <div key={s} className="lp-step flex items-center gap-[9px]" style={{ animationDelay: `${i * 1.8}s` }}>
                  <CheckDot />
                  {s}
                </div>
              ))}
              <div className="lp-step flex items-center gap-[9px]" style={{ animationDelay: "7.2s" }}>
                <span className="lp-pulse inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FDE6D8]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--lp-accent)" }} />
                </span>
                Rendering scenes
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <div className="h-[5px] overflow-hidden rounded-[3px] bg-[#E4E4E7]">
                <div className="lp-fill h-full bg-[#0B0B0F]" />
              </div>
              <div className="text-[12px] text-[#71717A]">Scenes render in parallel</div>
            </div>
          </aside>

          {/* stage + timeline */}
          <div className="min-w-0 flex-[999_1_460px] bg-[#F1F1EF] p-4">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#E4E4E1]">
              <div
                className="relative overflow-hidden"
                style={vertical ? { height: "100%", aspectRatio: "9 / 16" } : { width: "100%", height: "100%" }}
              >
                {scenes.map((s) => (
                  <div
                    key={`${format}-${s.time}`}
                    className="lp-scene-layer absolute inset-0 overflow-hidden"
                    style={{ background: s.pal.bg, animationDelay: s.delay }}
                  >
                    <SceneArt pal={s.pal} mode="stage" />
                    <SceneCaption text={s.caption} mode="stage" delay={s.delay} />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-3.5">
              <div className="flex gap-1.5">
                {scenes.map((s) => (
                  <div
                    key={`${format}-${s.time}`}
                    className="lp-clip flex min-w-0 flex-[1_1_0] items-center gap-[7px] overflow-hidden whitespace-nowrap rounded-lg border border-[#E4E4E7] p-1.5 text-[12px] font-medium"
                    style={{ animationDelay: s.delay }}
                  >
                    <span className="h-[18px] w-[26px] flex-none rounded" style={{ background: s.pal.bg }} />
                    <span className="overflow-hidden text-ellipsis">{s.label}</span>
                  </div>
                ))}
              </div>
              <div aria-hidden="true" className="mt-2 flex h-6 items-end gap-[3px]">
                {BARS.map((b, i) => (
                  <span
                    key={i}
                    className="lp-wave flex-[1_1_0] rounded-sm bg-[#CFCFD4]"
                    style={{ height: b.h, animationDelay: b.d }}
                  />
                ))}
              </div>
              <div
                aria-hidden="true"
                className="lp-playhead absolute w-0.5"
                style={{ top: -6, bottom: -4, background: "var(--lp-accent)" }}
              >
                <span
                  className="absolute h-3 w-3 rounded-[3px]"
                  style={{ top: -4, left: -5, background: "var(--lp-accent)" }}
                />
              </div>
            </div>
          </div>

          {/* script */}
          <aside className="flex min-w-0 max-w-[290px] flex-[1_1_240px] flex-col gap-1 border-l border-[#F0F0F2] bg-white p-4">
            <div className="lp-mono flex justify-between px-2.5 pb-2.5 pt-0.5 text-[11px] tracking-[0.06em] text-[#71717A]">
              <span>SCRIPT</span>
              <span>EDITABLE</span>
            </div>
            {scenes.map((s) => (
              <div
                key={`${format}-${s.time}`}
                className="lp-row flex flex-col gap-0.5 rounded-[9px] p-2.5"
                style={{ animationDelay: s.delay }}
              >
                <span className="lp-mono text-[11px] text-[#71717A]">
                  {s.time} · {s.label}
                </span>
                <span className="text-[14px] font-medium">{s.caption}</span>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
