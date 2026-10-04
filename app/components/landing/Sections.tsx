import Link from "next/link";
import { BARS } from "./data";

const RULE = { borderColor: "var(--lp-rule)" } as const;
const MUTED = { color: "var(--lp-muted)" } as const;
const SUPPORT = "mailto:support@byreel.ai";

/* ── 02 · How it works ── */

const STEPS = [
  { n: "1", title: "Add your product", body: "A link, screenshots or a screen recording. byreel pulls your name, colours and key features." },
  { n: "2", title: "Shape the storyboard", body: "Choose a launch video, b-roll or shorts. Rewrite a line, reorder scenes or regenerate a single shot." },
  { n: "3", title: "Export and publish", body: "Download every format with captions burned in, or take single clips into your own editor." },
];

export function HowItWorks() {
  return (
    <section id="how" className="lp-wrap pt-[140px]">
      <div className="lp-sc lp-mono">
        <span>SC.02 — HOW IT WORKS</span>
        <span>TC 00:00:24:00</span>
      </div>
      <h2 className="lp-serif lp-h2 mb-[72px]">
        From product page to published video, <em className="lp-acc">before lunch.</em>
      </h2>
      <div className="lp-cols3 grid grid-cols-3">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className={`flex flex-col gap-[18px] ${i === 0 ? "pr-8" : i === 1 ? "border-l px-8" : "border-l pl-8"}`}
            style={RULE}
          >
            <div
              className="lp-serif text-[120px] leading-[0.8]"
              style={{ color: i === 2 ? "var(--lp-accent)" : "var(--lp-ink)" }}
            >
              {s.n}
            </div>
            <h3 className="m-0 text-[22px] font-semibold tracking-[-0.02em]">{s.title}</h3>
            <p className="m-0" style={MUTED}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 03 · Features ── */

function FeatureRow({
  letter,
  title,
  body,
  last,
  children,
  stretch,
}: {
  letter: string;
  title: string;
  body: string;
  last?: boolean;
  stretch?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`lp-g12 grid grid-cols-12 items-center gap-x-8 gap-y-4 border-t py-9 ${last ? "border-b" : ""}`}
      style={RULE}
    >
      <span className="lp-mono col-span-1 text-[12px]" style={MUTED}>
        {letter}
      </span>
      <h3 className="lp-serif col-span-4 m-0 text-[40px] leading-none tracking-[-0.02em]">{title}</h3>
      <p className="col-span-4 m-0" style={MUTED}>
        {body}
      </p>
      <div className={`col-span-3 ${stretch ? "justify-self-stretch" : "justify-self-end"}`}>{children}</div>
    </div>
  );
}

const MONO10 = "lp-mono inline-flex items-center justify-center text-[10px]";

export function Features() {
  return (
    <section id="features" className="lp-wrap pt-[140px]">
      <div className="lp-sc lp-mono">
        <span>SC.03 — FEATURES</span>
        <span>TC 00:00:36:00</span>
      </div>
      <h2 className="lp-serif lp-h2 mb-16">
        Everything a launch needs. <em className="lp-acc">Nothing it doesn&apos;t.</em>
      </h2>

      <FeatureRow letter="A" title="One link, full kit" body="Every project gives you a hero video, a pack of b-roll and vertical cuts from the same script.">
        <div className="flex items-end gap-2" aria-hidden="true">
          <span className="h-[54px] w-24 rounded-md" style={{ background: "linear-gradient(155deg,#F59E5C,#C2410C 60%,#7A2606)" }} />
          <span className="h-[54px] w-[54px] rounded-md" style={{ background: "linear-gradient(160deg,#C9F5DF,#63D6A6)" }} />
          <span className="h-14 w-8 rounded-md" style={{ background: "linear-gradient(160deg,#14141C,#0B0B10)" }} />
        </div>
      </FeatureRow>

      <FeatureRow letter="B" title="Brand kit" body="Your logo, fonts and colours applied to every frame automatically.">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="lp-serif mr-1.5 text-[44px] leading-none">Aa</span>
          <span className="h-[26px] w-[26px] rounded-full" style={{ background: "var(--lp-ink)" }} />
          <span className="h-[26px] w-[26px] rounded-full" style={{ background: "var(--lp-accent)" }} />
          <span className="h-[26px] w-[26px] rounded-full" style={{ background: "#9B87F5" }} />
          <span className="h-[26px] w-[26px] rounded-full border bg-white" style={RULE} />
        </div>
      </FeatureRow>

      <FeatureRow letter="C" title="Captions that hold" body="Word-timed captions in styles built for silent autoplay feeds.">
        <div className="flex flex-col items-end gap-1.5" aria-hidden="true">
          <span className="rounded-[5px] px-[9px] py-[3px] text-[15px] font-bold text-white" style={{ background: "var(--lp-ink)" }}>
            Stop scrolling.
          </span>
          <span className="rounded-[5px] px-[9px] py-[3px] text-[15px] font-bold text-white" style={{ background: "var(--lp-accent)" }}>
            It does this.
          </span>
        </div>
      </FeatureRow>

      <FeatureRow letter="D" title="Every aspect ratio" body="One render, reframed for 16:9, 1:1 and 9:16 with no re-editing.">
        <div className="flex items-end gap-2.5" aria-hidden="true">
          <span className={`${MONO10} h-11 w-[78px] rounded border-[1.5px]`} style={{ borderColor: "var(--lp-ink)" }}>
            16:9
          </span>
          <span className={`${MONO10} h-12 w-12 rounded border-[1.5px]`} style={{ borderColor: "var(--lp-ink)" }}>
            1:1
          </span>
          <span
            className={`${MONO10} h-[60px] w-[34px] rounded border-[1.5px] text-white`}
            style={{ borderColor: "var(--lp-accent)", background: "var(--lp-accent)" }}
          >
            9:16
          </span>
        </div>
      </FeatureRow>

      <FeatureRow last stretch letter="E" title="Voice and music" body="Choose a voice and a track, or bring your own audio.">
        <div aria-hidden="true" className="flex h-10 items-center gap-[3px]">
          {BARS.map((b, i) => (
            <span
              key={i}
              className="lp-wave flex-[1_1_0] rounded-sm"
              style={{ height: b.h, background: "var(--lp-ink)", animationDelay: b.d, transformOrigin: "center" }}
            />
          ))}
        </div>
      </FeatureRow>
    </section>
  );
}

/* ── Statement ── */

// [text, isAccent] runs; each word becomes a span that inks in on scroll (see .lp-word).
const STATEMENT: [string, boolean][] = [
  ["Most launches stall in the edit. byreel gets yours", false],
  ["out the door", true],
  ["the same day.", false],
];

// Number every word across the runs so the ink-in staggers through the whole sentence.
const STATEMENT_RUNS = (() => {
  let n = 0;
  return STATEMENT.map(([text, accent]) => ({
    accent,
    words: text.split(" ").map((word) => ({ word, i: n++ })),
  }));
})();

function Words({ words }: { words: { word: string; i: number }[] }) {
  return words.map(({ word, i }) => (
    <span key={i} className="lp-word" style={{ "--i": i } as React.CSSProperties}>
      {word}{" "}
    </span>
  ));
}

export function Statement() {
  return (
    <section className="lp-wrap py-40">
      <p className="lp-serif lp-statement m-0 max-w-[1120px] text-[clamp(36px,5vw,76px)] leading-[1.02] tracking-[-0.025em]">
        {STATEMENT_RUNS.map((run, k) =>
          run.accent ? (
            <em key={k} className="lp-acc">
              <Words words={run.words} />
            </em>
          ) : (
            <span key={k}>
              <Words words={run.words} />
            </span>
          ),
        )}
      </p>
    </section>
  );
}

/* ── 04 · Pricing ── */

const PLANS = [
  {
    name: "Free",
    tag: "TRY IT",
    price: "$0",
    per: "",
    items: ["3 videos to start", "720p export", "byreel watermark"],
    cta: "Start free",
    href: "/register",
  },
  {
    name: "Pro",
    tag: "MOST POPULAR",
    price: "$29",
    per: " /month",
    items: ["40 videos a month", "1080p, no watermark", "Voiceover and brand kit"],
    cta: "Upgrade to Pro",
    href: "/register?plan=pro",
    featured: true,
  },
  {
    name: "Team",
    tag: "AGENCIES",
    price: "$99",
    per: " /month",
    items: ["150 videos a month", "4K export", "Multiple brand kits and seats"],
    cta: "Book a demo",
    href: `${SUPPORT}?subject=Book%20a%20demo`,
  },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="lp-wrap">
      <div className="lp-sc lp-mono">
        <span>SC.04 — PRICING</span>
        <span>TC 00:00:48:00</span>
      </div>
      <h2 className="lp-serif lp-h2 mb-16">
        Start free. <em className="lp-acc">Scale when you ship.</em>
      </h2>

      <div className="lp-cols3 grid grid-cols-3 border-y" style={RULE}>
        {PLANS.map((p, i) => {
          const featured = "featured" in p && p.featured;
          return (
            <div
              key={p.name}
              className={`flex flex-col gap-6 pb-10 pt-9 ${featured ? "lp-dark px-8" : i === 0 ? "pr-8" : "pl-8"}`}
              style={featured ? { background: "var(--lp-ink)", color: "var(--lp-paper)" } : undefined}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="m-0 text-[16px] font-semibold">{p.name}</h3>
                {featured ? (
                  <span className="lp-mono rounded px-2 py-[3px] text-[12px]" style={{ background: "var(--lp-accent)", color: "var(--lp-paper)" }}>
                    {p.tag}
                  </span>
                ) : (
                  <span className="lp-mono text-[12px]" style={MUTED}>
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="lp-serif text-[88px] leading-[0.9] tracking-[-0.03em]">
                {p.price}
                {p.per && (
                  <span
                    className="text-[15px] tracking-normal"
                    style={{ fontFamily: "var(--font-geist), sans-serif", color: featured ? "#A8A59C" : "var(--lp-muted)" }}
                  >
                    {p.per}
                  </span>
                )}
              </div>
              <ul className="m-0 flex list-none flex-col p-0 text-[15px]" style={{ color: featured ? "#E4E1DA" : "var(--lp-ink-2)" }}>
                {p.items.map((it) => (
                  <li key={it} className="border-t py-2.5" style={{ borderColor: featured ? "#2A2927" : "#E4E1DA" }}>
                    {it}
                  </li>
                ))}
              </ul>
              {featured ? (
                <Link
                  href={p.href}
                  className="lp-btn-accent mt-auto flex min-h-[50px] items-center justify-center gap-2 rounded-full text-[15px] font-semibold"
                  style={{ background: "var(--lp-accent)", color: "#fff" }}
                >
                  {p.cta} <span className="lp-arrow" aria-hidden="true">→</span>
                </Link>
              ) : (
                <Link
                  href={p.href}
                  className="lp-btn-line mt-auto flex min-h-[50px] items-center justify-center rounded-full border text-[15px] font-semibold"
                  style={{ borderColor: "var(--lp-ink)" }}
                >
                  {p.cta}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <p className="lp-mono mt-[18px] text-[12px]" style={MUTED}>
        ALL PAID PLANS INCLUDE COMMERCIAL USE. CANCEL ANYTIME.
      </p>
    </section>
  );
}

/* ── 05 · FAQ ── */

const FAQS = [
  ["What do I need to give byreel?", "A product link is enough. Screenshots or a short screen recording make the b-roll more accurate to your real UI."],
  ["Can I edit the video after it is generated?", "Yes. Edit the script and storyboard, regenerate single scenes, or download the clips and finish in your own editor."],
  ["Which formats can I export?", "MP4 in 16:9, 1:1 and 9:16, with captions burned in or as a separate file."],
  ["Can I use the videos in ads?", "Yes. Exports on paid plans are cleared for commercial use, including paid ads."],
  ["How long does a render take?", "It depends on length and format. Scenes render in parallel, so a typical 30-second launch video finishes in a few minutes."],
];

export function Faq() {
  return (
    <section id="faq" className="lp-wrap py-[140px]">
      <div className="lp-sc lp-mono">
        <span>SC.05 — QUESTIONS</span>
        <span>TC 00:01:00:00</span>
      </div>
      <div className="lp-g12 grid grid-cols-12 gap-x-8 gap-y-10">
        <div className="col-span-4 flex flex-col gap-4">
          <h2 className="lp-serif m-0 text-[clamp(40px,4.4vw,64px)] leading-[0.95] tracking-[-0.03em]">
            Good <em className="lp-acc">questions.</em>
          </h2>
          <p className="m-0" style={MUTED}>
            Something else?{" "}
            <a href={SUPPORT} className="lp-link-u font-semibold" style={{ color: "var(--lp-ink)" }}>
              Talk to us
            </a>
            .
          </p>
        </div>
        <div className="col-span-7 col-start-6 border-t" style={RULE}>
          {FAQS.map(([q, a]) => (
            <details key={q} className="border-b py-6" style={RULE}>
              <summary className="flex cursor-pointer justify-between gap-4 text-[19px] font-medium">
                {q}
                <span className="lp-chev" aria-hidden="true" style={MUTED}>
                  +
                </span>
              </summary>
              <p className="m-0 mt-3" style={MUTED}>
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
