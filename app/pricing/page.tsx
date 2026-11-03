"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import NotebookShell from "../components/landing/NotebookShell";
import type { BillingCycle, BillingPlan, PlanPrice } from "../lib/api";
import { hasAnnualPrices, startCheckout, usePlans } from "../lib/plans";
import "../components/landing/pricing.css";

type PlanId = "free" | "creator" | "pro" | "enterprise";

/* Prices, credits and the longest film come from the backend (the Dodo products checkout sells); this
   holds only the words around them. */
interface Plan {
  id: PlanId;
  name: string;
  forWho: string;
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
    credits: 15,
    creditsNote: "About 5 B-roll clips or 3 short videos",
    cta: "Start free",
    href: "/register?plan=free",
    includesLabel: "Includes",
    features: [
      "720p exports at 30 fps",
      "16:9 and 9:16 formats",
      "Films up to 15 seconds",
      "Starter templates",
      "Shared render queue",
      "byreel watermark on exports",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    forWho: "For people posting Shorts, Reels and B-roll every day.",
    credits: 200,
    creditsNote: "About 40 short videos or 65 B-roll clips",
    cta: "Choose Creator",
    href: "/register?plan=creator",
    includesLabel: "Everything in Free, plus",
    features: [
      "1080p at 60 fps, MP4 and WebM",
      "No watermark, full commercial rights",
      "16:9, 9:16 and 1:1 formats",
      "Films up to 60 seconds",
      "Documentary-style B-roll",
      "Transparent overlays for your editor",
    ],
  },
  {
    id: "pro",
    name: "Pro Studio",
    forWho: "For teams shipping product launches and 4K video.",
    credits: 600,
    creditsNote: "About 30 one-minute launch films or 200 B-roll clips",
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
      "Priority support",
    ],
  },
];

/* Typical renders. Each is charged what it measures (model tokens and render time); the credits shown are the
   typical numbers on the default model, from the backend. */
const RENDERS = [
  { id: "shorts", label: "Short videos", detail: "15 s, vertical for Reels, Shorts and TikTok", seconds: 15, max: 100, start: 12 },
  { id: "broll", label: "B-roll clips", detail: "9 s cutaways for YouTube", seconds: 9, max: 100, start: 10 },
  { id: "motion", label: "Motion graphics scenes", detail: "30 s of kinetic type, charts or explainers", seconds: 30, max: 50, start: 2 },
  { id: "launch", label: "Product launch videos", detail: "60 s multi-scene trailers", seconds: 60, max: 30, start: 1 },
] as const;

type RenderId = (typeof RENDERS)[number]["id"];

const COMPARE: { group: string; rows: [string, string, string, string, string][] }[] = [
  {
    group: "Videos",
    rows: [
      ["Credits each month", "15", "200", "600", "2,500 shared"],
      ["Longest film", "15 s", "60 s", "60 s", "60 s"],
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
      ["Seats", "1", "1", "Up to 3", "10, plus API"],
    ],
  },
];

const FAQS = [
  {
    q: "What does a credit pay for?",
    a: "Each video is charged by what it actually uses: the model's tokens and the render time, so a short title on a fast model costs a credit or two and a long film on a top model costs more. The Studio shows the estimate before you start, each finished video shows what it was charged, and a video that fails gives its credits back.",
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
    a: "Your credits renew at the start of each billing month. Unused credits don't carry over, so pick the plan that fits a typical month.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Any time, from Billing in your studio. Upgrades apply straight away; cancelling keeps your plan until the end of the period you paid for. Payments are handled by Dodo Payments.",
  },
];

/* The price as the page draws it: symbol and number apart. Yearly prices are shown per month. */
function priceParts(price: PlanPrice, cycle: BillingCycle) {
  const amount = cycle === "annual" ? price.amount / 12 : price.amount;
  const parts = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency || "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).formatToParts(amount);
  return {
    symbol: parts.filter((p) => p.type === "currency").map((p) => p.value).join(""),
    number: parts.filter((p) => p.type !== "currency" && p.type !== "literal").map((p) => p.value).join(""),
    total: new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency || "USD" }).format(price.amount),
  };
}

function Check() {
  return (
    <svg className="pr-check" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

/**
 * A plan's button. Signed out: sign up with the plan in mind. Signed in: checkout (or the studio for the
 * plan you have, Billing for anything else that isn't for sale here).
 */
function PlanCta({
  plan,
  live,
  loaded,
  cycle,
  primary,
  className = "",
}: {
  plan: Plan;
  live: BillingPlan | undefined;
  /** The backend's plans have loaded, so a missing price means "not on sale", not "still loading". */
  loaded: boolean;
  cycle: BillingCycle;
  primary?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const { failure } = useAlert();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const cls = `pr-cta${primary ? " is-primary" : ""}${className ? ` ${className}` : ""}`;
  const currentTier = user?.plan?.tier;

  if (currentTier === plan.id) {
    return (
      <Link href="/dashboard" className={cls}>
        Open your studio
      </Link>
    );
  }
  if (plan.id !== "free" && loaded && !live?.prices[cycle]) {
    return (
      <button type="button" className={cls} disabled>
        Coming soon
      </button>
    );
  }
  if (!user) {
    // A paid plan comes back here after sign-up and opens checkout (see ?buy= in PricingPage).
    const href =
      plan.id === "free" ? plan.href : `${plan.href}&redirect=${encodeURIComponent(`/pricing?buy=${plan.id}&interval=${cycle}`)}`;
    return (
      <Link href={href} className={cls}>
        {plan.cta}
      </Link>
    );
  }
  // Moving to Free is cancelling, and a plan with no product isn't sold yet: both live in Billing.
  if (plan.id === "free") {
    return (
      <Link href="/dashboard?section=billing" className={cls}>
        Manage your plan
      </Link>
    );
  }
  if (!live?.prices[cycle]) {
    // Prices still loading (a missing price after loading is "Coming soon", above).
    return (
      <button type="button" className={cls} disabled>
        {plan.cta}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={cls}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          if ((await startCheckout(plan.id, cycle)) === "changed") router.push("/billing");
        } catch (err) {
          failure("Couldn't start checkout", err instanceof Error ? err.message : "Please try again.");
          setBusy(false);
        }
      }}
    >
      {busy ? "Opening checkout…" : plan.cta}
    </button>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const { user } = useAuth();
  const currentTier = user?.plan?.tier;
  const { plans: live, typical } = usePlans();
  const liveOf = (id: PlanId) => live?.find((p) => p.tier === id);
  // The yearly switch shows only when a plan is sold yearly.
  const yearly = hasAnnualPrices(live);
  const cycle: BillingCycle = yearly && annual ? "annual" : "monthly";
  const creditsOf = (plan: Plan) => liveOf(plan.id)?.credits ?? plan.credits;

  // Back from sign-up with a paid plan in mind (?buy=pro&interval=monthly): open its checkout, once.
  const { failure } = useAlert();
  const bought = useRef(false);
  useEffect(() => {
    if (bought.current || !user || !live) return;
    const params = new URLSearchParams(window.location.search);
    const buy = params.get("buy");
    if (!buy) return;
    bought.current = true;
    window.history.replaceState({}, "", "/pricing");
    const plan = live.find((p) => p.tier === buy);
    const interval: BillingCycle = params.get("interval") === "annual" && plan?.prices.annual ? "annual" : "monthly";
    if (!plan?.prices[interval] || user.plan?.tier === plan.tier) return;
    startCheckout(plan.tier, interval).catch((err) =>
      failure("Couldn't start checkout", err instanceof Error ? err.message : "Please try again.")
    );
  }, [user, live, failure]);

  const [counts, setCounts] = useState<Record<RenderId, number>>(
    () => Object.fromEntries(RENDERS.map((r) => [r.id, r.start])) as Record<RenderId, number>
  );
  const needed = RENDERS.reduce((sum, r) => sum + typical(r.seconds) * counts[r.id], 0);
  const fit = PLANS.find((p) => creditsOf(p) >= needed) ?? PLANS[PLANS.length - 1];
  const spare = creditsOf(fit) - needed;

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
          {yearly && (
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
                Yearly
              </button>
            </div>
          )}
        </header>

        <section className="pr-plans" aria-label="Plans">
          {PLANS.map((plan) => {
            const livePlan = liveOf(plan.id);
            const price = livePlan?.prices[cycle];
            const parts = price ? priceParts(price, cycle) : null;
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
                  {plan.id === "free" ? (
                    <>
                      <span className="pr-currency">$</span>
                      <span className="pr-amount">0</span>
                      <span className="pr-per">forever</span>
                    </>
                  ) : parts ? (
                    <>
                      <span className="pr-currency">{parts.symbol}</span>
                      <span className="pr-amount">{parts.number}</span>
                      <span className="pr-per">a month</span>
                    </>
                  ) : (
                    <span className="pr-amount">{live ? "Soon" : "…"}</span>
                  )}
                </p>
                <p className="pr-price-note">
                  {plan.id === "free"
                    ? "No card needed"
                    : parts
                      ? cycle === "annual"
                        ? `Billed yearly, ${parts.total}`
                        : "Billed monthly"
                      : live
                        ? "Not on sale yet"
                        : "Loading price"}
                </p>

                <div className="pr-credits">
                  <strong>{creditsOf(plan).toLocaleString("en-US")} credits a month</strong>
                  <span>{plan.creditsNote}</span>
                </div>

                <PlanCta plan={plan} live={livePlan} loaded={Boolean(live)} cycle={cycle} primary={plan.popular} />
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
                    {r.detail}. About {typical(r.seconds)} credits each.
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
            <PlanCta plan={fit} live={liveOf(fit.id)} loaded={Boolean(live)} cycle={cycle} primary className="pr-result-cta" />
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
