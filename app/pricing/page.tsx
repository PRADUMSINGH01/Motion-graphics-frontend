"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import NotebookShell from "../components/landing/NotebookShell";
import "../components/landing/pricing.css";

type PlanId = "free" | "creator" | "pro" | "enterprise";

interface Plan {
  id: PlanId;
  name: string;
  forWho: string;
  monthlyPrice: number;
  annualPrice: number;
  annualTotal: number;
  credits: number;
  creditsNote: string;
  cta: string;
  href: string;
  includesLabel: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    forWho: "Try the studio and make your first few clips.",
    monthlyPrice: 0,
    annualPrice: 0,
    annualTotal: 0,
    credits: 15,
    creditsNote: "About 5 B-roll clips or 3 short videos",
    cta: "Start free",
    href: "/register?plan=free",
    includesLabel: "Includes",
    features: [
      "720p exports at 30 fps",
      "16:9 and 9:16 formats",
      "B-roll clips up to 10 seconds",
      "Starter templates",
      "Shared render queue",
      "byreel watermark on exports",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    forWho: "For people posting Shorts, Reels and B-roll every day.",
    monthlyPrice: 19,
    annualPrice: 15,
    annualTotal: 180,
    credits: 200,
    creditsNote: "About 40 short videos or 65 B-roll clips",
    cta: "Choose Creator",
    href: "/register?plan=creator",
    includesLabel: "Everything in Free, plus",
    features: [
      "1080p at 60 fps, MP4 and WebM",
      "No watermark, full commercial rights",
      "16:9, 9:16 and 1:1 formats",
      "Documentary-style B-roll",
      "Transparent overlays for your editor",
      "Unused credits roll over for 30 days",
    ],
  },
  {
    id: "pro",
    name: "Pro Studio",
    forWho: "For teams shipping product launches and 4K video.",
    monthlyPrice: 39,
    annualPrice: 31,
    annualTotal: 372,
    credits: 600,
    creditsNote: "About 50 launch trailers or 200 B-roll clips",
    cta: "Choose Pro Studio",
    href: "/register?plan=pro",
    includesLabel: "Everything in Creator, plus",
    popular: true,
    features: [
      "Multi-scene product launch videos",
      "4K at 60 fps, with transparent WebM",
      "Turn a URL or screenshot into a launch reel",
      "Brand kit with your fonts, colours and logo",
      "Priority renders, about 3× faster",
      "Scene-by-scene timing editor",
    ],
  },
  {
    id: "enterprise",
    name: "Agency",
    forWho: "For agencies and content teams working at volume.",
    monthlyPrice: 99,
    annualPrice: 79,
    annualTotal: 948,
    credits: 2500,
    creditsNote: "Shared across up to 10 seats",
    cta: "Choose Agency",
    href: "/register?plan=enterprise",
    includesLabel: "Everything in Pro Studio, plus",
    features: [
      "Up to 10 seats",
      "Separate brand kits per client",
      "Batch export in every format",
      "Render API and webhooks",
      "Dedicated render capacity",
      "90-day rollover and priority support",
    ],
  },
];

/* What one render costs. The calculator and the cost list both read from here. */
const RENDERS = [
  { id: "shorts", label: "Short videos", detail: "15 to 30 s, vertical for Reels, Shorts and TikTok", credits: 5, max: 100, start: 12 },
  { id: "broll", label: "B-roll clips", detail: "5 to 10 s cutaways for YouTube", credits: 3, max: 100, start: 10 },
  { id: "motion", label: "Motion graphics scenes", detail: "30 to 45 s, kinetic type, charts, explainers", credits: 8, max: 50, start: 2 },
  { id: "launch", label: "Product launch videos", detail: "45 to 60 s, multi-scene trailers", credits: 12, max: 30, start: 1 },
] as const;

type RenderId = (typeof RENDERS)[number]["id"];

const COMPARE: { group: string; rows: [string, string, string, string, string][] }[] = [
  {
    group: "Videos",
    rows: [
      ["Credits each month", "15", "200", "600", "2,500 shared"],
      ["B-roll clip length", "Up to 10 s", "Any length", "Any length, 4K", "Any length, batch"],
      ["Short videos for Reels and Shorts", "720p draft", "1080p, 60 fps", "4K, 60 fps, auto-reframe", "4K, 60 fps, batch"],
      ["Product launch videos", "Preview only", "1080p", "4K, multi-scene", "4K, per-client kits"],
    ],
  },
  {
    group: "Exports",
    rows: [
      ["Best quality", "720p, 30 fps", "1080p, 60 fps", "4K, 60 fps", "4K, 60 fps"],
      ["Formats", "16:9, 9:16", "16:9, 9:16, 1:1, 4:5", "All, in one click", "All, in one click"],
      ["Transparent overlays (WebM)", "", "1080p", "4K", "4K"],
      ["Watermark-free, commercial use", "", "yes", "yes", "Client licence"],
    ],
  },
  {
    group: "Brand and editing",
    rows: [
      ["Uploaded assets", "3", "50", "Unlimited", "Shared library"],
      ["Brand kits", "", "1", "Unlimited", "One per client"],
      ["Editor", "Text only", "Full scene editor", "Scene editor and keyframes", "Editor with team review"],
    ],
  },
  {
    group: "Speed and team",
    rows: [
      ["Renders at once", "1", "2", "4, priority", "10, dedicated"],
      ["Unused credits roll over", "", "30 days", "60 days", "90 days"],
      ["Seats", "1", "1", "Up to 3", "10, plus API"],
    ],
  },
];

const FAQS = [
  {
    q: "What does a credit pay for?",
    a: "Rendering. A B-roll clip is 3 credits, a short video 5, a motion graphics scene 8 and a product launch video 12. Changing words, colours, screenshots or timing in the editor is free; credits are only used when you render.",
  },
  {
    q: "Can I use the videos in Premiere, Final Cut, DaVinci or CapCut?",
    a: "Yes. Export a 60 fps MP4, or a WebM with a transparent background to lay charts, captions and callouts over your own footage.",
  },
  {
    q: "Can one video go to YouTube and to Reels?",
    a: "Yes. Paid plans export 16:9, 9:16, 1:1 and 4:5 from the same project, so you set it up once.",
  },
  {
    q: "What happens to credits I don't use?",
    a: "On paid plans they roll over: 30 days on Creator, 60 on Pro Studio and 90 on Agency.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Any time, from your account. Upgrades apply straight away.",
  },
];

function cost(plan: Plan, annual: boolean) {
  return annual ? plan.annualPrice : plan.monthlyPrice;
}

function Check() {
  return (
    <svg className="pr-check" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const { user } = useAuth();
  const currentTier = user?.plan?.tier;

  const [counts, setCounts] = useState<Record<RenderId, number>>(
    () => Object.fromEntries(RENDERS.map((r) => [r.id, r.start])) as Record<RenderId, number>
  );
  const needed = RENDERS.reduce((sum, r) => sum + r.credits * counts[r.id], 0);
  const fit = PLANS.find((p) => p.credits >= needed) ?? PLANS[PLANS.length - 1];
  const spare = fit.credits - needed;

  return (
    <NotebookShell ariaLabel="byreel pricing">
      <div className="pr">
        <header className="pr-head">
          <div>
            <h1 className="pr-title">
              Pay for renders.
              <br />
              Editing is free.
            </h1>
            <p className="pr-lede">
              Every plan has the whole studio. Credits are only used when a video renders, so
              rewriting a headline or changing a colour costs nothing.
            </p>
          </div>
          <div className="pr-billing" role="radiogroup" aria-label="Billing period">
            <button
              type="button"
              role="radio"
              aria-checked={!annual}
              onClick={() => setAnnual(false)}
              className="pr-billing-btn"
            >
              Monthly
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={annual}
              onClick={() => setAnnual(true)}
              className="pr-billing-btn"
            >
              Yearly <span className="pr-save">save 20%</span>
            </button>
          </div>
        </header>

        <section className="pr-plans" aria-label="Plans">
          {PLANS.map((plan) => {
            const price = cost(plan, annual);
            const isCurrent = currentTier === plan.id;
            const isFit = plan.id === fit.id;
            return (
              <article
                key={plan.id}
                className={`pr-plan${plan.popular ? " is-popular" : " lp-card-stock"}${isFit ? " is-fit" : ""}`}
              >
                {plan.popular && <span className="lp-tape pr-tape">most popular</span>}
                <h2 className="pr-plan-name">{plan.name}</h2>
                <p className="pr-plan-for">{plan.forWho}</p>

                <p className="pr-price">
                  <span className="pr-currency">$</span>
                  <span className="pr-amount">{price}</span>
                  <span className="pr-per">{price === 0 ? "forever" : "a month"}</span>
                </p>
                <p className="pr-price-note">
                  {price === 0
                    ? "No card needed"
                    : annual
                      ? `Billed yearly, $${plan.annualTotal.toLocaleString("en-US")}`
                      : "Billed monthly"}
                </p>

                <div className="pr-credits">
                  <strong>{plan.credits.toLocaleString("en-US")} credits a month</strong>
                  <span>{plan.creditsNote}</span>
                </div>

                <Link
                  href={isCurrent ? "/dashboard" : `${plan.href}&interval=${annual ? "annual" : "monthly"}`}
                  className={`pr-cta${plan.popular ? " is-primary" : ""}`}
                >
                  {isCurrent ? "Open your studio" : plan.cta}
                </Link>
                {isCurrent && <p className="pr-current">Your current plan</p>}

                <p className="pr-includes">{plan.includesLabel}</p>
                <ul className="pr-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </section>

        <section className="pr-calc lp-card-stock" aria-labelledby="pr-calc-title">
          <div className="pr-calc-intro">
            <h2 id="pr-calc-title" className="pr-h2">
              Which plan fits?
            </h2>
            <p className="pr-calc-lede">Set roughly what you make in a month.</p>
          </div>
          <div className="pr-calc-rows">
            {RENDERS.map((r) => (
              <label key={r.id} className="pr-row">
                <span className="pr-row-text">
                  <span className="pr-row-label">{r.label}</span>
                  <span className="pr-row-detail">
                    {r.detail}. {r.credits} credits each.
                  </span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={r.max}
                  value={counts[r.id]}
                  onChange={(e) => setCounts((c) => ({ ...c, [r.id]: Number(e.target.value) }))}
                  className="pr-range"
                  style={{ "--fill": `${(counts[r.id] / r.max) * 100}%` } as React.CSSProperties}
                />
                <output className="pr-row-count">{counts[r.id]}</output>
              </label>
            ))}
          </div>
          <div className="pr-result" aria-live="polite">
            <p className="pr-result-total">
              <span className="pr-result-num">{needed.toLocaleString("en-US")}</span> credits a
              month
            </p>
            <p className="pr-result-plan">
              <span className="lp-marker">{fit.name}</span> covers it
              {spare > 0 ? `, with ${spare.toLocaleString("en-US")} to spare.` : "."}
            </p>
            <Link
              href={`${fit.href}&interval=${annual ? "annual" : "monthly"}`}
              className="pr-cta is-primary pr-result-cta"
            >
              {fit.cta}
            </Link>
          </div>
        </section>

        <section className="pr-compare" aria-labelledby="pr-compare-title">
          <h2 id="pr-compare-title" className="pr-h2">
            Compare plans
          </h2>
          <div className="pr-table-wrap lp-card-stock">
            <table className="pr-table">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="pr-sr">Feature</span>
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.id} scope="col" className={p.popular ? "is-popular" : undefined}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {COMPARE.map((section) => (
                <tbody key={section.group}>
                  <tr className="pr-group">
                    <th scope="rowgroup" colSpan={5}>
                      {section.group}
                    </th>
                  </tr>
                  {section.rows.map(([feature, ...cells]) => (
                    <tr key={feature}>
                      <th scope="row">{feature}</th>
                      {cells.map((cell, i) => (
                        <td key={i} className={PLANS[i].popular ? "is-popular" : undefined}>
                          {cell === "yes" ? (
                            <>
                              <Check />
                              <span className="pr-sr">Included</span>
                            </>
                          ) : cell === "" ? (
                            <span className="pr-none">
                              <span aria-hidden="true">–</span>
                              <span className="pr-sr">Not included</span>
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </section>

        <section className="pr-faq" aria-labelledby="pr-faq-title">
          <h2 id="pr-faq-title" className="pr-h2">
            Questions
          </h2>
          <div className="pr-faq-list">
            {FAQS.map((f, i) => (
              <details key={f.q} className="pr-faq-item" open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </NotebookShell>
  );
}
