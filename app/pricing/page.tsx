"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import NotebookShell from "../components/landing/NotebookShell";

interface SaaSPlan {
  id: "free" | "creator" | "pro" | "enterprise";
  code: string;
  name: string;
  desc: string;
  monthlyPrice: number;
  annualPrice: number;
  annualTotal: number;
  quotaMain: string;
  quotaSub: string;
  popular: boolean;
  ctaLabel: string;
  ctaHref: string;
  groupHeader: string;
  features: string[];
}

const PLANS: SaaSPlan[] = [
  {
    id: "free",
    code: "TIER 01 · STARTER",
    name: "Free Trial",
    desc: "For creators testing AI motion graphics, B-roll cutaways, and short video prompts.",
    monthlyPrice: 0,
    annualPrice: 0,
    annualTotal: 0,
    quotaMain: "15 video credits / mo",
    quotaSub: "≈ 5 B-roll clips or 3 short video drafts",
    popular: false,
    ctaLabel: "Start Free",
    ctaHref: "/register?plan=free",
    groupHeader: "Included in Free Trial:",
    features: [
      "720p 30 FPS .MP4 video exports",
      "16:9 YouTube & 9:16 Shorts/Reels formats",
      "5–10s animated B-roll cutaway scenes",
      "Access to starter motion templates",
      "Standard shared GPU render queue",
      "byreel.in watermark on exports",
    ],
  },
  {
    id: "creator",
    code: "TIER 02 · SOLO CREATOR",
    name: "Creator",
    desc: "For YouTubers, founders, and editors publishing daily Shorts, Reels, and B-rolls.",
    monthlyPrice: 19,
    annualPrice: 15,
    annualTotal: 180,
    quotaMain: "200 video credits / mo",
    quotaSub: "≈ 65 B-roll clips or 40 Short/Reel videos",
    popular: false,
    ctaLabel: "Upgrade to Creator",
    ctaHref: "/register?plan=creator",
    groupHeader: "Everything in Free, plus:",
    features: [
      "1080p Full HD 60 FPS .MP4 & .WebM",
      "Zero watermarks · Full commercial rights",
      "9:16 Vertical Shorts/Reels + 16:9 + 1:1",
      "Documentary & Vox-style B-roll generators",
      "Transparent alpha B-roll overlays for NLEs",
      "30-day unused credit rollover",
    ],
  },
  {
    id: "pro",
    code: "TIER 03 · PRODUCTION",
    name: "Pro Studio",
    desc: "For SaaS teams, marketers, and studios shipping 4K product launch videos and B-roll packs.",
    monthlyPrice: 39,
    annualPrice: 31,
    annualTotal: 372,
    quotaMain: "600 fast-queue credits / mo",
    quotaSub: "≈ 200 B-rolls or 50 full Product Launch videos",
    popular: true,
    ctaLabel: "Start Pro Studio",
    ctaHref: "/register?plan=pro",
    groupHeader: "Everything in Creator, plus:",
    features: [
      "Full Product Launch Studio (multi-scene trailers)",
      "4K UHD 60 FPS .MP4 & RGBA Alpha .WebM",
      "URL / UI screenshot to SaaS launch reel",
      "Custom brand kit (fonts, colors, logos)",
      "Priority GPU render lane (3× faster)",
      "Interactive timeline & scene pacing editor",
    ],
  },
  {
    id: "enterprise",
    code: "TIER 04 · AGENCY & SCALE",
    name: "Agency & Team",
    desc: "For video agencies and content teams producing high-volume launch campaigns & B-rolls.",
    monthlyPrice: 99,
    annualPrice: 79,
    annualTotal: 948,
    quotaMain: "2,500 shared credits / mo",
    quotaSub: "Pooled across up to 10 editor & creator seats",
    popular: false,
    ctaLabel: "Start Agency Plan",
    ctaHref: "/register?plan=enterprise",
    groupHeader: "Everything in Pro Studio, plus:",
    features: [
      "Up to 10 collaborative studio seats",
      "Shared client brand kits & preset workspaces",
      "Batch B-roll & multi-aspect campaign export",
      "Programmatic Video Render API & Webhooks",
      "Dedicated concurrent GPU render cluster",
      "90-day credit rollover & priority support SLA",
    ],
  },
];

const CREDIT_RATES = [
  {
    cost: "3 Credits",
    label: "Animated B-Roll Clip",
    spec: "5–10s · 60 FPS cutaway for YouTube / Reels",
  },
  {
    cost: "5 Credits",
    label: "Short-Form Video",
    spec: "15–30s · 9:16 Reels, Shorts, TikTok & X",
  },
  {
    cost: "8 Credits",
    label: "Motion Graphics Scene",
    spec: "30–45s · Kinetic type, charts & explainers",
  },
  {
    cost: "12 Credits",
    label: "Product Launch Trailer",
    spec: "45–60s · Multi-scene SaaS & app launch video",
  },
];

const COMPARISON_SECTIONS = [
  {
    category: "01 · Video Formats & Production Types",
    rows: [
      {
        feature: "Monthly video credit allowance",
        free: "15 / mo",
        creator: "200 / mo",
        pro: "600 / mo",
        enterprise: "2,500 / mo",
      },
      {
        feature: "Animated B-Roll Cutaways (charts, maps, UI, kinetic type)",
        free: "Up to 10s",
        creator: "Unlimited length",
        pro: "Unlimited + 4K Alpha",
        enterprise: "Batch B-roll packs",
      },
      {
        feature: "Short-Form Videos (9:16 Reels, YouTube Shorts, TikTok)",
        free: "720p draft",
        creator: "1080p 60 FPS",
        pro: "4K 60 FPS + Auto-reframe",
        enterprise: "4K 60 FPS + Batch",
      },
      {
        feature: "Product Launch Studio (SaaS & App promo trailers)",
        free: "Preview only",
        creator: "1080p Launch Reels",
        pro: "Full 4K Multi-Scene",
        enterprise: "Full 4K + Client Kits",
      },
    ],
  },
  {
    category: "02 · Render Quality & NLE Editor Compatibility",
    rows: [
      {
        feature: "Maximum export resolution & frame rate",
        free: "720p · 30 FPS",
        creator: "1080p · 60 FPS",
        pro: "4K UHD · 60 FPS",
        enterprise: "4K UHD · 60 FPS",
      },
      {
        feature: "Aspect ratios (16:9 YouTube, 9:16 Vertical, 1:1, 4:5)",
        free: "16:9 & 9:16",
        creator: "All 4 ratios",
        pro: "1-Click Multi-Ratio",
        enterprise: "1-Click Multi-Ratio",
      },
      {
        feature: "Transparent RGBA B-Roll Overlays (Premiere / DaVinci / CapCut)",
        free: "—",
        creator: "1080p RGBA .WebM",
        pro: "4K RGBA .WebM",
        enterprise: "4K RGBA .WebM",
      },
      {
        feature: "Watermark-free commercial & broadcast rights",
        free: "Watermarked",
        creator: "✓ Included",
        pro: "✓ Included",
        enterprise: "✓ Agency client license",
      },
    ],
  },
  {
    category: "03 · Brand Kit, Timeline & Workflow",
    rows: [
      {
        feature: "Upload product screenshots, logos & UI mockups",
        free: "Up to 3 assets",
        creator: "50 assets",
        pro: "Unlimited brand assets",
        enterprise: "Shared agency library",
      },
      {
        feature: "Custom brand fonts & color palette locking",
        free: "—",
        creator: "1 Brand Kit",
        pro: "Unlimited Brand Kits",
        enterprise: "Client-isolated Kits",
      },
      {
        feature: "Interactive scene timing, copy & camera cut editor",
        free: "Basic text edit",
        creator: "Full scene editor",
        pro: "Full + keyframe pacing",
        enterprise: "Full + team review",
      },
    ],
  },
  {
    category: "04 · Queue Speed, Team & API",
    rows: [
      {
        feature: "Concurrent GPU video renders",
        free: "1 job",
        creator: "2 jobs",
        pro: "4 priority jobs (3×)",
        enterprise: "10 dedicated jobs",
      },
      {
        feature: "Unused credit rollover window",
        free: "—",
        creator: "30 days",
        pro: "60 days",
        enterprise: "90 days",
      },
      {
        feature: "Included workspace seats & Render API",
        free: "1 seat",
        creator: "1 seat",
        pro: "Up to 3 seats",
        enterprise: "10 seats + REST API",
      },
    ],
  },
];

const FAQS = [
  {
    q: "What types of videos can I create with byreel.in?",
    a: "You can generate four core video formats from plain text or product assets: (1) Motion Graphics explainers & kinetic typography, (2) Animated B-Roll cutaways for YouTube & documentaries, (3) SaaS & App Product Launch trailers, and (4) 9:16 Short Videos for Reels, TikTok, YouTube Shorts, and X/LinkedIn.",
  },
  {
    q: "Can I drop generated B-rolls directly into Premiere Pro, Final Cut, DaVinci, or CapCut?",
    a: "Yes. Every scene can be exported as a 60 FPS .MP4 or as a transparent RGBA .WebM overlay so you can layer animated charts, callouts, lower-thirds, and UI B-rolls directly over your talking-head footage.",
  },
  {
    q: "How many credits does a B-roll clip vs. a full Product Launch video use?",
    a: "A 5–10 second animated B-roll cutaway uses 3 credits. A 15–30 second vertical Short/Reel uses 5 credits. A 30–45 second motion graphics sequence uses 8 credits, and a full 45–60 second multi-scene Product Launch trailer uses 12 credits.",
  },
  {
    q: "Do text, color, or timing tweaks cost extra credits?",
    a: "No. Editing headlines, swapping product screenshots, adjusting brand colors, or changing scene durations inside the studio editor is 100% free. Credits are only used when generating new AI scenes or rendering final master files.",
  },
  {
    q: "Can I export the same video in both 16:9 (YouTube/X) and 9:16 (Reels/Shorts)?",
    a: "Yes! Creator, Pro Studio, and Agency plans support 16:9 widescreen, 9:16 vertical, 1:1 square, and 4:5 social feeds so a single product launch or B-roll project adapts to every platform.",
  },
  {
    q: "Do unused video credits roll over, and can I cancel anytime?",
    a: "Paid plans automatically roll over unused monthly credits (30 days on Creator, 60 days on Pro Studio, 90 days on Agency). You can upgrade, downgrade, or cancel with one click at any time.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState<boolean>(true);
  const { user } = useAuth();
  const activeTier = user?.plan?.tier;

  return (
    <NotebookShell ariaLabel="byreel.in SaaS pricing for motion graphics, B-rolls, product launches, and short videos">
      <div className="lp-pricing-wrap">
        {/* 1. Executive SaaS Pricing Header */}
        <header className="lp-saas-header">
          <div className="lp-saas-eyebrow">
            <span className="lp-saas-eyebrow-dot" aria-hidden="true" />
            <span>MOTION GRAPHICS · B-ROLLS · PRODUCT LAUNCH · SHORTS</span>
          </div>

          <h1 className="lp-hero-headline">
            Production pricing for creators, launches &amp; video teams.
          </h1>

          <p className="lp-pricing-sub">
            Generate studio-grade{" "}
            <strong>Motion Graphics</strong>,{" "}
            <strong>Animated B-Roll Cutaways</strong>,{" "}
            <strong>Product Launch Trailers</strong>, and{" "}
            <strong>60 FPS Short Videos</strong> for YouTube, Reels, TikTok, and X.
          </p>

          <div className="lp-saas-controls-row">
            <div
              className="lp-billing-toggle"
              role="group"
              aria-label="Billing interval"
            >
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`lp-billing-btn ${!annual ? "is-active" : ""}`}
              >
                Monthly billing
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`lp-billing-btn ${annual ? "is-active" : ""}`}
              >
                <span>Annual billing</span>
                <span className="lp-billing-save-pill">SAVE 20%</span>
              </button>
            </div>

            <div className="lp-saas-trust-line">
              <span>✓ 16:9, 9:16 &amp; 1:1 formats</span>
              <span>·</span>
              <span>✓ Unused credits roll over</span>
              <span>·</span>
              <span>✓ Cancel or switch anytime</span>
            </div>
          </div>
        </header>

        {/* 2. Unified 4-Column Architectural SaaS Tier Matrix */}
        <div className="lp-pricing-grid">
          {PLANS.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const isCurrent = activeTier === plan.id;

            return (
              <article
                key={plan.id}
                className={`lp-price-card ${plan.popular ? "is-popular" : ""}`}
              >
                <div className="lp-price-card-top">
                  <span className="lp-price-tag">{plan.code}</span>
                  {plan.popular && (
                    <span className="lp-popular-badge">MOST POPULAR</span>
                  )}
                  {!plan.popular && isCurrent && (
                    <span className="lp-popular-badge">CURRENT PLAN</span>
                  )}
                </div>

                <h2 className="lp-price-name">{plan.name}</h2>
                <p className="lp-price-desc">{plan.desc}</p>

                <div className="lp-price-amount-block">
                  <div className="lp-price-amount-row">
                    <span className="lp-price-amount">${price}</span>
                    <span className="lp-price-period">
                      {price === 0 ? "/ forever" : "/ month"}
                    </span>
                  </div>
                  <div className="lp-price-billing-note">
                    {price === 0
                      ? "No credit card required"
                      : annual
                      ? `Billed annually ($${plan.annualTotal}/yr) · Save 20%`
                      : "Billed monthly · Cancel anytime"}
                  </div>
                </div>

                {/* Quota Specification Callout */}
                <div className="lp-quota-box">
                  <span className="lp-quota-main">{plan.quotaMain}</span>
                  <span className="lp-quota-sub">{plan.quotaSub}</span>
                </div>

                <Link
                  href={
                    isCurrent
                      ? "/dashboard"
                      : `${plan.ctaHref}&interval=${annual ? "annual" : "monthly"}`
                  }
                  className={`lp-price-cta ${plan.popular ? "is-primary" : ""}`}
                >
                  <span>{isCurrent ? "Open Studio Workspace" : plan.ctaLabel}</span>
                  <span aria-hidden="true">→</span>
                </Link>

                <div className="lp-tier-group-title">{plan.groupHeader}</div>

                <ul className="lp-price-features">
                  {plan.features.map((feat) => (
                    <li key={feat} className="lp-price-feature-item">
                      <span className="lp-price-check" aria-hidden="true">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* 3. Credit Consumption Reference Strip */}
        <div className="lp-credit-strip" aria-label="Video credit consumption rates">
          <div className="lp-credit-strip-head">
            <span className="lp-credit-strip-title">
              VIDEO CREDIT METERING · WHAT EACH RENDER USES
            </span>
            <span className="lp-credit-strip-note">
              Editing text, brand colors, screenshots, or timing in the timeline is always 0 credits.
            </span>
          </div>
          <div className="lp-credit-items-grid">
            {CREDIT_RATES.map((rate) => (
              <div key={rate.label} className="lp-credit-unit-item">
                <span className="lp-credit-unit-cost">{rate.cost}</span>
                <span className="lp-credit-unit-label">{rate.label}</span>
                <span className="lp-credit-unit-spec">{rate.spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Full SaaS Feature Comparison Ledger */}
        <div className="lp-compare-section">
          <div className="lp-section-subhead">
            <h2 className="lp-section-title">Compare studio capabilities</h2>
            <span className="lp-section-kicker">
              MOTION GRAPHICS · B-ROLLS · LAUNCH TRAILERS · SHORTS
            </span>
          </div>

          <div className="lp-compare-ledger">
            <table className="lp-compare-table">
              <thead>
                <tr>
                  <th style={{ width: "36%" }}>Production Capability</th>
                  <th style={{ width: "16%" }}>Free Trial</th>
                  <th style={{ width: "16%" }}>Creator</th>
                  <th style={{ width: "16%" }}>Pro Studio</th>
                  <th style={{ width: "16%" }}>Agency &amp; Team</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_SECTIONS.map((section) => (
                  <React.Fragment key={section.category}>
                    <tr className="lp-compare-cat-row">
                      <td colSpan={5}>{section.category}</td>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.feature}>
                        <td style={{ fontWeight: 500 }}>{row.feature}</td>
                        <td>{row.free}</td>
                        <td>{row.creator}</td>
                        <td style={{ fontWeight: 700, color: "#07142e" }}>
                          {row.pro}
                        </td>
                        <td>{row.enterprise}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. 2-Column SaaS Billing & Video Production FAQ */}
        <div className="lp-compare-section">
          <div className="lp-section-subhead">
            <h2 className="lp-section-title">Frequently asked questions</h2>
            <span className="lp-section-kicker">
              CREDITS · NLE WORKFLOW · COMMERCIAL RIGHTS
            </span>
          </div>

          <div className="lp-faq-grid">
            {FAQS.map((item) => (
              <div key={item.q} className="lp-faq-card">
                <h3 className="lp-faq-q">{item.q}</h3>
                <p className="lp-faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NotebookShell>
  );
}
