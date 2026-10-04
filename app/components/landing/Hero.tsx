import LinkForm from "./LinkForm";
import HeroBackdrop from "./HeroBackdrop";

const HEADLINE_STYLE = {
  fontSize: "clamp(58px, 10vw, 160px)",
  lineHeight: 0.9,
  letterSpacing: "-0.035em",
} as const;

/** Rendered twice: a pale "ghost" copy underneath and an ink copy revealed left-to-right. */
function Headline() {
  return (
    <>
      <span className="block overflow-hidden pb-[0.04em]">
        <span className="lp-reveal" style={{ animationDelay: "0.05s" }}>
          Launch videos,
        </span>
      </span>
      <span className="block overflow-hidden pb-[0.08em]">
        <span className="lp-reveal" style={{ animationDelay: "0.18s" }}>
          <em className="lp-acc">directed</em> by AI.
        </span>
      </span>
    </>
  );
}

const FORMATS = [
  ["01", "Launch video", "0:30–1:00 · 16:9"],
  ["02", "B-roll pack", "3–8 s clips"],
  ["03", "Short-form", "15–30 s · 9:16"],
];

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <HeroBackdrop />
      <section id="top" className="lp-wrap relative pt-14">
        <span aria-hidden="true" className="lp-crop" style={{ top: 16, left: 8, borderWidth: "1px 0 0 1px" }} />
        <span aria-hidden="true" className="lp-crop" style={{ top: 16, right: 8, borderWidth: "1px 1px 0 0" }} />

        <div
          className="lp-mono mb-10 flex flex-wrap justify-between gap-3 border-b pb-5 text-[12px] tracking-[0.08em]"
          style={{ color: "var(--lp-muted)", borderColor: "var(--lp-rule)" }}
        >
          <span>AI VIDEO STUDIO FOR PRODUCT LAUNCHES</span>
          <span>LAUNCH VIDEOS · B-ROLL · SHORT-FORM</span>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="lp-mono mb-2 flex justify-between text-[11px] tracking-[0.04em]"
            style={{ color: "var(--lp-faint)" }}
          >
            <span>00:00:00:00</span>
            <span className="max-sm:hidden">00:00:01:00</span>
            <span>00:00:02:00</span>
            <span className="max-sm:hidden">00:00:03:00</span>
            <span>00:00:04:00</span>
          </div>
          <div
            aria-hidden="true"
            className="mb-7 h-3 border-b"
            style={{
              borderColor: "#B5B2A9",
              backgroundImage:
                "repeating-linear-gradient(90deg, #B5B2A9 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, #8A877E 0 1px, transparent 1px 160px)",
              backgroundSize: "100% 6px, 100% 12px",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "bottom, bottom",
            }}
          />

          <div className="relative">
            <h1 className="lp-serif lp-ghost m-0" style={HEADLINE_STYLE}>
              <Headline />
            </h1>
            <div aria-hidden="true" className="lp-serif lp-render-ink absolute inset-0 m-0" style={HEADLINE_STYLE}>
              <Headline />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="lp-render-head absolute w-0.5"
            style={{ top: 18, bottom: -10, background: "var(--lp-accent)" }}
          >
            <span
              className="absolute"
              style={{
                top: -18,
                left: -7,
                width: 16,
                height: 12,
                background: "var(--lp-accent)",
                clipPath: "polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%)",
              }}
            />
          </div>

          <div
            aria-hidden="true"
            className="lp-render-done lp-mono absolute right-0 inline-flex items-center gap-2 text-[11px] tracking-[0.06em]"
            style={{ bottom: -34, color: "var(--lp-ink-2)" }}
          >
            <span className="h-[7px] w-[7px] rounded-full" style={{ background: "#15803D" }} />
            RENDERED · 00:00:04:00
          </div>
        </div>

        <div className="lp-g12 mt-14 grid grid-cols-12 items-end gap-x-8 gap-y-12 pb-16">
          <div className="col-span-6 flex flex-col gap-7">
            <p className="m-0 max-w-[540px] text-[clamp(18px,1.5vw,21px)] leading-[1.5]" style={{ color: "var(--lp-ink-2)" }}>
              Paste a product link. byreel writes the script, designs every scene and edits a launch video, a b-roll
              pack and short-form cuts, on brand and ready to post.
            </p>
            <div className="max-w-[560px]">
              <LinkForm
                button="Generate video"
                notes={
                  <>
                    <span>No credit card</span>
                    <span>First video free</span>
                    <span>Commercial use</span>
                  </>
                }
              />
            </div>
          </div>

          <ol className="col-span-5 col-start-8 m-0 list-none border-t p-0" style={{ borderColor: "var(--lp-ink)" }}>
            {FORMATS.map(([n, name, meta]) => (
              <li
                key={n}
                className="grid grid-cols-[44px_1fr_auto] items-baseline gap-4 border-b py-[18px]"
                style={{ borderColor: "var(--lp-rule)" }}
              >
                <span className="lp-mono text-[12px]" style={{ color: "var(--lp-muted)" }}>
                  {n}
                </span>
                <span className="lp-serif text-[30px] leading-none">{name}</span>
                <span className="lp-mono text-[12px]" style={{ color: "var(--lp-muted)" }}>
                  {meta}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
