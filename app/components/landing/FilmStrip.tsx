import { STRIP } from "./data";
import { SceneArt, SceneCaption } from "./SceneArt";

const SPROCKET = "repeating-linear-gradient(90deg, transparent 0 10px, #3A3935 10px 22px, transparent 22px 32px)";

const CHANNELS = ["Instagram Reels", "YouTube Shorts", "TikTok", "LinkedIn", "X", "Product Hunt"];

export default function FilmStrip() {
  return (
    <>
      <section aria-label="Videos made with byreel" className="lp-strip overflow-hidden py-3.5" style={{ background: "var(--lp-ink)" }}>
        <div aria-hidden="true" className="lp-sprocket mb-4 h-2.5" style={{ backgroundImage: SPROCKET }} />
        <div className="lp-mq-strip flex w-max gap-4 pl-4">
          {STRIP.map((s, k) => (
            <div key={k} className="flex-none basis-[216px]">
              <div
                className="lp-gcard relative aspect-[9/16] overflow-hidden rounded-2xl"
                style={{ background: s.pal.bg, boxShadow: "0 20px 36px -24px rgba(17,17,16,.45)" }}
              >
                <SceneArt pal={s.pal} mode="card" />
                <div
                  aria-hidden="true"
                  className="absolute overflow-hidden"
                  style={{ top: "3.4cqh", left: "5cqw", right: "5cqw", height: "0.7cqh", minHeight: 3, borderRadius: 3, background: "rgba(11,11,15,.18)" }}
                >
                  <div className="lp-prog h-full" style={{ background: "#0B0B0F", animationDelay: s.progressDelay }} />
                </div>
                <SceneCaption text={s.caption} mode="card" />
              </div>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="lp-sprocket mt-4 h-2.5" style={{ backgroundImage: SPROCKET }} />
      </section>

      <div
        className="lp-wrap flex flex-wrap items-baseline gap-x-7 gap-y-2 py-[22px] text-[15px]"
        style={{ color: "var(--lp-ink-2)" }}
      >
        <span className="lp-mono text-[12px] tracking-[0.08em]" style={{ color: "var(--lp-muted)" }}>
          EXPORT-READY FOR
        </span>
        {CHANNELS.map((c, i) => (
          <span key={c} className="contents">
            {i > 0 && (
              <span aria-hidden="true" style={{ color: "#B5B2A9" }}>
                /
              </span>
            )}
            <span>{c}</span>
          </span>
        ))}
      </div>
    </>
  );
}
