import type { CSSProperties } from "react";
import LinkForm from "./LinkForm";
import ProjectorBackdrop from "./ProjectorBackdrop";

const SLATE = [
  ["PRODUCTION", "Your launch"],
  ["SCENE", "01"],
  ["TAKE", "01"],
  ["DIRECTOR", "byreel AI"],
];

/** What one link produces; the frames are drawn at their real aspect ratios. */
const DELIVERABLES = [
  { name: "Launch video", meta: "16:9 · 0:30–1:00", w: 44, h: 25 },
  { name: "B-roll pack", meta: "1:1 · 3–8 s clips", w: 28, h: 28 },
  { name: "Short-form", meta: "9:16 · 15–30 s", w: 18, h: 32 },
];

export default function GetStarted() {
  return (
    <section
      id="start"
      className="relative isolate overflow-hidden"
      style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
    >
      <ProjectorBackdrop />

      <div className="lp-wrap pb-32 pt-24">
        {/* clapperboard */}
        <div aria-hidden="true" className="mb-10">
          <div
            className="lp-clap h-10 rounded-t border-2"
            style={{
              background: "repeating-linear-gradient(-55deg, #F5F4F0 0 30px, #111110 30px 60px)",
              borderColor: "var(--lp-paper)",
              transformOrigin: "0 100%",
            }}
          />
          <div
            className="h-10 border-2 border-t-0"
            style={{
              background: "repeating-linear-gradient(55deg, #F5F4F0 0 30px, #111110 30px 60px)",
              borderColor: "var(--lp-paper)",
            }}
          />
        </div>

        <div className="lp-sc lp-sc-dark lp-mono">
          <span>06 — GET STARTED</span>
          <span>FIRST VIDEO FREE</span>
        </div>

        <div
          className="lp-slate lp-mono mb-12 grid grid-cols-4 border backdrop-blur-[2px]"
          style={{ borderColor: "#3A3935", background: "rgba(17,17,16,.55)" }}
        >
          {SLATE.map(([k, v], i) => (
            <div
              key={k}
              className={`lp-in-view px-[18px] py-3.5 ${i < 3 ? "border-r" : ""}`}
              style={{ borderColor: "#3A3935", "--i": i } as CSSProperties}
            >
              <div className="text-[11px] tracking-[0.08em]" style={{ color: "var(--lp-faint)" }}>
                {k}
              </div>
              <div className="mt-1 text-[16px]" style={{ color: "var(--lp-paper)" }}>
                {v}
                {k === "TAKE" && <span className="lp-acc"> — the only one</span>}
              </div>
            </div>
          ))}
        </div>

        <h2 className="lp-serif m-0 text-[clamp(64px,11vw,176px)] leading-[0.88] tracking-[-0.04em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="lp-rise-in inline-block">
              Ship it <em className="lp-acc">today.</em>
            </span>
          </span>
        </h2>

        <div className="lp-g12 mt-14 grid grid-cols-12 items-end gap-x-8 gap-y-8">
          <div className="col-span-5 flex flex-col gap-7">
            <p className="m-0 text-[19px]" style={{ color: "#C9C6BD" }}>
              Paste a link and get a ready-to-post launch video, b-roll and shorts. No editor, no agency, no waiting.
            </p>
            <ul className="m-0 grid max-w-[460px] list-none grid-cols-3 gap-4 border-t p-0 pt-5" style={{ borderColor: "#3A3935" }}>
              {DELIVERABLES.map((d) => (
                <li key={d.name} className="flex flex-col gap-2.5">
                  <span className="flex h-8 items-end" aria-hidden="true">
                    <span
                      className="block rounded-[3px] border-[1.5px]"
                      style={{ width: d.w, height: d.h, borderColor: "#5F5E58" }}
                    />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[14px] font-medium">{d.name}</span>
                    <span className="lp-mono text-[11px]" style={{ color: "var(--lp-faint)" }}>
                      {d.meta}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 col-start-7">
            <LinkForm
              tone="dark"
              button="Generate free video"
              notes={
                <>
                  <span>No credit card</span>
                  <span>Cancel anytime</span>
                  <a href="mailto:support@byreel.ai?subject=Book%20a%20demo" className="lp-link-u" style={{ color: "var(--lp-paper)" }}>
                    Book a demo →
                  </a>
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
