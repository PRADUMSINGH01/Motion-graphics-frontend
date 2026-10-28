"use client";



import React, { memo, useState } from "react";

import Link from "next/link";

import {

  FiCheck,

  FiArrowRight,

  FiShield,

  FiChevronDown,

  FiZap,

  FiSliders,

  FiLayers,

  FiDownload,

  FiCpu,

  FiUsers,

  FiHelpCircle,

  FiLock,

  FiRepeat,

} from "react-icons/fi";

import { IconSparkles } from "./Icons";



type BillingInterval = "monthly" | "annual";



interface PlanFeature {

  text: string;

  highlight?: boolean;

}



interface Plan {

  id: string;

  name: string;

  badge?: string;

  tagline: string;

  priceMonthly: number;

  priceAnnual: number;

  periodLabel: string;

  ctaText: string;

  ctaHref: string;

  popular?: boolean;

  features: PlanFeature[];

}



const PLANS: Plan[] = [

  {

    id: "free",

    name: "Free Creator",

    tagline: "For trying prompt-to-motion generation and testing the workflow.",

    priceMonthly: 0,

    priceAnnual: 0,

    periodLabel: "Free forever",

    ctaText: "Start Free Today",

    ctaHref: "/register",

    features: [

      { text: "5 credits per month" },

      { text: "720p MP4 exports with watermark" },

      { text: "Prompt-to-animation generation" },

      { text: "Core motion templates and typography" },

      { text: "Standard rendering queue" },

      { text: "Community support" },

    ],

  },

  {

    id: "pro",

    name: "Pro Studio",

    badge: "MOST POPULAR",

    tagline: "For creators producing regular social videos, explainers, and product demos.",

    priceMonthly: 19,

    priceAnnual: 15,

    periodLabel: "per editor / month",

    ctaText: "Upgrade to Pro Studio",

    ctaHref: "/register?plan=pro",

    popular: true,

    features: [

      { text: "60 credits per month", highlight: true },

      { text: "1080p MP4 export", highlight: true },

      { text: "No watermark on final exports", highlight: true },

      { text: "Priority rendering queue", highlight: true },

      { text: "Custom colors, fonts, and reusable styles" },

      { text: "Commercial use for exported videos" },

      { text: "Email support" },

    ],

  },

  {

    id: "team",

    name: "Team & Scale",

    tagline: "For freelancers and small teams producing videos at higher volume.",

    priceMonthly: 59,

    priceAnnual: 47,

    periodLabel: "per workspace / month (3 seats included)",

    ctaText: "Choose Studio",

    ctaHref: "/register?plan=team",

    features: [

      { text: "200 credits per month", highlight: true },

      { text: "Up to 1080p MP4 exports", highlight: true },

      { text: "Batch generation workflow", highlight: true },

      { text: "Higher rendering priority", highlight: true },

      { text: "Shared workspace and reusable brand styles" },

      { text: "3 workspace seats included" },

      { text: "Priority email support" },

    ],

  },

];



const COMPARISON_ROWS = [

  {

    category: "Video Generation & Rendering",

    features: [

      { name: "Monthly short-video credits", free: "5", pro: "60", team: "200" },

      { name: "Max resolution", free: "720p (watermarked)", pro: "1080p", team: "1080p" },

      { name: "Frame rate", free: "Up to 30 FPS", pro: "Up to 30 FPS", team: "Up to 30 FPS" },

      { name: "H.264 MP4 export", free: true, pro: true, team: true },

      { name: "Watermark-free export", free: false, pro: true, team: true },

      { name: "Rendering queue", free: "Standard", pro: "Priority", team: "Higher priority" },

    ],

  },

  {

    category: "Workflow & Brand Kit",

    features: [

      { name: "Autonomous prompt agent", free: true, pro: true, team: true },

      { name: "Website-to-video brief", free: "Basic", pro: "Included", team: "Included" },

      { name: "Reusable brand styles", free: false, pro: true, team: true },

      { name: "Audio support", free: "Basic", pro: "Basic", team: "Basic" },

      { name: "Watermark removal", free: false, pro: true, team: true },

      { name: "Shared workspace", free: false, pro: false, team: true },

    ],

  },

  {

    category: "Collaboration & Enterprise Support",

    features: [

      { name: "Team seats included", free: "1 seat", pro: "1 seat", team: "3 seats" },

      { name: "Commercial use", free: "Personal projects", pro: "Included", team: "Included" },

      { name: "Support level", free: "Self-serve", pro: "Email", team: "Priority email" },

      { name: "Uptime SLA", free: false, pro: false, team: false },

    ],

  },

];



const FAQS = [

  {

    q: "How do monthly credits work?",

    a: "Credits are deducted when a final video is rendered. The credit cost depends on duration and render complexity. Previewing a draft does not use export credits. Failed renders caused by a platform error are refunded.",

  },

  {

    q: "Can I use generated videos commercially?",

    a: "Paid plans allow commercial use of exported videos, subject to our terms and any third-party asset or font licenses. The Free plan is intended for personal testing.",

  },

  {

    q: "Can I upgrade, downgrade, or cancel at any time?",

    a: "Yes, you can change your subscription tier or cancel with 1 click directly inside your billing settings. If you cancel, your subscription remains active until the end of the paid period with no early cancellation fees.",

  },

  {

    q: "What export formats and quality are supported?",

    a: "Free exports watermarked H.264 MP4 at up to 720p. Paid plans export H.264 MP4 at up to 1080p. Frame rate and export formats depend on the rendering pipeline available at launch.",

  },

  {

    q: "Can I turn a website into a launch video?",

    a: "If the website-to-video feature is enabled for your account, paste a URL to use available page metadata as context for a launch-video draft. Review and edit the generated storyboard before rendering.",

  },

  {

    q: "Do you offer custom volume or enterprise plans?",

    a: "Yes! For agencies and high-volume workflows that need custom limits or API access, contact us at hello@byreel.in.",

  },

];



function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {

  if (typeof value === "boolean") {

    return value ? (

      <span className="flex items-center justify-center">

        <FiCheck className={`w-4 h-4 ${highlight ? "text-ink-c5ef26" : "text-ink-658b02"}`} />

      </span>

    ) : (

      <span className="text-ink-dedad0 text-center block">—</span>

    );

  }

  return <span className={highlight ? "font-semibold text-ink-111110" : ""}>{value}</span>;

}



export const PricingSection = memo(function PricingSection() {

  const [interval, setInterval] = useState<BillingInterval>("annual");

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [calcVideos, setCalcVideos] = useState<number>(60);



  const isAnnual = interval === "annual";



  // Dynamic estimate calculations

  const recommendedPlan =

    calcVideos <= 5 ? "Free Creator" : calcVideos <= 60 ? "Pro Studio" : calcVideos <= 200 ? "Team & Scale" : "Contact Sales";



  return (

    <section id="pricing" className="relative w-full pt-6 pb-24 sm:pt-10 sm:pb-32 bg-surf-fcfbf7 text-ink-111110">

      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-20">

        {/* ── Top Header ── */}

        <div className="text-center max-w-3xl mx-auto space-y-4">

          <div className="inline-flex items-center gap-2 rounded-full border border-surf-dedad0 bg-surf-ffffff px-3 py-1 shadow-2xs">

            <span className="h-2 w-2 rounded-full bg-surf-c5ef26 animate-pulse" />

            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-111110">

              TRANSPARENT PRICING

            </span>

          </div>



          <h1 className="text-[34px] sm:text-[48px] font-black tracking-tight text-ink-111110 leading-tight">

            Simple, predictable plans for modern video creators.

          </h1>



          <p className="text-[15px] sm:text-[16px] text-ink-717069 leading-relaxed max-w-xl mx-auto">

            Start free. Upgrade for more generation credits, watermark-free 1080p exports, and team workflows.

          </p>



          {/* Billing Interval Toggle */}

          <div className="pt-3">

            <div

              role="tablist"

              aria-label="Billing interval"

              className="inline-flex items-center p-1 rounded-2xl border border-surf-dedad0 bg-surf-ffffff shadow-2xs"

            >

              <button

                type="button"

                role="tab"

                aria-selected={interval === "monthly"}

                onClick={() => setInterval("monthly")}

                className={`h-9 px-5 rounded-xl text-[13px] font-semibold transition ${

                  interval === "monthly"

                    ? "bg-surf-111110 text-white shadow-xs"

                    : "text-ink-55544e hover:text-ink-111110"

                }`}

              >

                Monthly Billing

              </button>

              <button

                type="button"

                role="tab"

                aria-selected={interval === "annual"}

                onClick={() => setInterval("annual")}

                className={`flex items-center gap-2 h-9 px-5 rounded-xl text-[13px] font-semibold transition ${

                  interval === "annual"

                    ? "bg-surf-111110 text-white shadow-xs"

                    : "text-ink-55544e hover:text-ink-111110"

                }`}

              >

                <span>Annual Billing</span>

                <span className="rounded-full bg-surf-f2fac2 px-2 py-0.5 font-mono text-[10px] font-bold text-ink-658b02">

                  SAVE UP TO 21%

                </span>

              </button>

            </div>

          </div>

        </div>



        {/* ── 3 Main Plan Cards ── */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">

          {PLANS.map((plan) => {

            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            const isPro = plan.popular;



            return (

              <div

                key={plan.id}

                className={`relative flex flex-col justify-between rounded-3xl p-8 border transition-all duration-300 ${

                  isPro

                    ? "border-surf-111110 bg-surf-111110 text-white shadow-2xl lg:-translate-y-2 ring-2 ring-surf-c5ef26/30"

                    : "border-surf-dedad0 bg-surf-ffffff text-ink-111110 shadow-xs hover:border-surf-111110"

                }`}

              >

                {/* Popular Badge */}

                {isPro && (

                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-surf-c5ef26 px-3.5 py-0.5 font-mono text-[10.5px] font-extrabold text-ink-111110 shadow-md uppercase tracking-wider">

                    {plan.badge}

                  </div>

                )}



                <div>

                  <div className="flex items-center justify-between">

                    <h3 className={`text-[20px] font-bold ${isPro ? "text-white" : "text-ink-111110"}`}>

                      {plan.name}

                    </h3>

                  </div>



                  <p className={`mt-2 text-[13px] leading-relaxed min-h-[40px] ${isPro ? "text-white/70" : "text-ink-717069"}`}>

                    {plan.tagline}

                  </p>



                  {/* Price Tag */}

                  <div className="mt-6 flex items-baseline gap-1.5">

                    <span className={`text-[46px] font-black tracking-tight leading-none ${isPro ? "text-white" : "text-ink-111110"}`}>

                      ${price}

                    </span>

                    {price > 0 && (

                      <span className={`text-[13px] font-medium ${isPro ? "text-white/60" : "text-ink-8c8980"}`}>

                        / month

                      </span>

                    )}

                  </div>



                  <p className={`mt-1.5 text-[12px] font-mono ${isPro ? "text-ink-c5ef26" : "text-ink-717069"}`}>

                    {price === 0

                      ? plan.periodLabel

                      : isAnnual

                      ? `${plan.periodLabel} · billed $${price * 12}/year`

                      : `${plan.periodLabel} · billed monthly`}

                  </p>



                  {/* CTA Button */}

                  <div className="mt-7">

                    <Link

                      href={plan.ctaHref}

                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[13.5px] font-bold transition shadow-xs ${

                        isPro

                          ? "bg-surf-c5ef26 text-ink-111110 hover:bg-surf-b2dc1e"

                          : "bg-surf-111110 text-white hover:bg-surf-272725"

                      }`}

                    >

                      <span>{plan.ctaText}</span>

                      <FiArrowRight size={15} />

                    </Link>

                  </div>



                  {/* Features List */}

                  <div className={`mt-8 border-t pt-6 ${isPro ? "border-white/10" : "border-surf-f2efe6"}`}>

                    <p className={`text-[12.5px] font-bold uppercase tracking-wider mb-3.5 font-mono ${isPro ? "text-white/80" : "text-ink-55544e"}`}>

                      {plan.id === "free" ? "Included features:" : `Everything in ${plan.id === "pro" ? "Free" : "Pro"}, plus:`}

                    </p>



                    <ul className="space-y-3 text-[13px]">

                      {plan.features.map((feature, idx) => (

                        <li key={idx} className="flex items-start gap-2.5">

                          <span

                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5 ${

                              isPro

                                ? "bg-surf-c5ef26/20 text-ink-c5ef26"

                                : "bg-surf-f2fac2 text-ink-658b02"

                            }`}

                          >

                            <FiCheck size={12} strokeWidth={3} />

                          </span>

                          <span

                            className={

                              feature.highlight

                                ? isPro

                                  ? "font-semibold text-white"

                                  : "font-semibold text-ink-111110"

                                : isPro

                                ? "text-white/70"

                                : "text-ink-55544e"

                            }

                          >

                            {feature.text}

                          </span>

                        </li>

                      ))}

                    </ul>

                  </div>

                </div>



                <div className={`mt-8 pt-4 border-t text-[11px] font-mono ${isPro ? "border-white/10 text-white/40" : "border-surf-f2efe6 text-ink-8c8980"}`}>

                  ✓ Instant access · Cancel anytime

                </div>

              </div>

            );

          })}

        </div>



        {/* ── Interactive Volume Calculator ── */}

        <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-7 sm:p-9 shadow-xs max-w-4xl mx-auto space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div>

              <div className="flex items-center gap-2">

                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-surf-111110 text-ink-c5ef26">

                  <FiSliders size={14} />

                </span>

                <h3 className="text-[17px] font-bold text-ink-111110">

                  Video Volume & Savings Calculator

                </h3>

              </div>

              <p className="text-[12.5px] text-ink-717069 mt-0.5">

                Estimate your monthly video credits to find the closest tier.

              </p>

            </div>



            <span className="rounded-xl bg-surf-faf9f5 border border-surf-dedad0 px-3.5 py-1.5 font-mono text-[12px] font-bold text-ink-111110">

              Recommended: <span className="text-ink-658b02">{recommendedPlan}</span>

            </span>

          </div>



          <div className="space-y-3">

            <div className="flex items-center justify-between font-mono text-[13px]">

              <span className="text-ink-55544e">Estimated Monthly Usage:</span>

              <span className="text-[18px] font-black text-ink-111110">

                {calcVideos} Credits / mo

              </span>

            </div>



            <input

              type="range"

              min="5"

              max="1500"

              step="5"

              value={calcVideos}

              onChange={(e) => setCalcVideos(parseInt(e.target.value))}

              className="w-full h-2 bg-surf-eceae3 rounded-lg appearance-none cursor-pointer accent-ink-111110"

            />



            <div className="flex justify-between font-mono text-[11px] text-ink-8c8980">

              <span>5 credits</span>

              <span>60 credits (Pro)</span>

              <span>200 credits (Studio)</span>

            </div>

          </div>

        </div>



        {/* ── Detailed Comparison Matrix ── */}

        <div className="max-w-5xl mx-auto space-y-6">

          <div className="text-center space-y-1">

            <h3 className="text-[24px] sm:text-[30px] font-bold text-ink-111110">

              Feature Comparison Matrix

            </h3>

            <p className="text-[13px] text-ink-717069">

              Every tool, engine parameter, and export format mapped across plans.

            </p>

          </div>



          <div className="overflow-x-auto rounded-3xl border border-surf-dedad0 bg-surf-ffffff shadow-xs">

            <table className="w-full min-w-[640px] text-left border-collapse text-[13.5px]">

              <thead>

                <tr className="border-b border-surf-dedad0 bg-surf-faf9f5">

                  <th className="p-4 sm:px-6 font-bold text-ink-55544e w-2/5">Capabilities</th>

                  <th className="p-4 font-bold text-ink-111110 text-center w-1/5">Free</th>

                  <th className="p-4 font-bold text-ink-658b02 text-center w-1/5 bg-surf-f2fac2/30">Pro Studio</th>

                  <th className="p-4 font-bold text-ink-111110 text-center w-1/5">Team &amp; Scale</th>

                </tr>

              </thead>

              <tbody>

                {COMPARISON_ROWS.map((group) => (

                  <React.Fragment key={group.category}>

                    <tr className="bg-surf-f7f6f0 border-b border-surf-dedad0">

                      <td

                        colSpan={4}

                        className="py-2.5 px-4 sm:px-6 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-717069"

                      >

                        {group.category}

                      </td>

                    </tr>

                    {group.features.map((row) => (

                      <tr key={row.name} className="border-b border-surf-dedad0 last:border-b-0 hover:bg-surf-faf9f5/50">

                        <td className="p-4 sm:px-6 text-ink-44433e font-medium">{row.name}</td>

                        <td className="p-4 text-center text-ink-717069">

                          <Cell value={row.free} />

                        </td>

                        <td className="p-4 text-center text-ink-111110 font-semibold bg-surf-f2fac2/20">

                          <Cell value={row.pro} highlight />

                        </td>

                        <td className="p-4 text-center text-ink-111110 font-semibold">

                          <Cell value={row.team} />

                        </td>

                      </tr>

                    ))}

                  </React.Fragment>

                ))}

              </tbody>

            </table>

          </div>

        </div>



        {/* ── Enterprise Custom Tier Banner ── */}

        <div className="rounded-3xl border border-surf-111110 bg-surf-111110 text-white p-8 sm:p-10 shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="space-y-2">

            <span className="rounded-full bg-surf-c5ef26 px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink-111110 uppercase">

              CUSTOM PLANS

            </span>

            <h3 className="text-[22px] sm:text-[26px] font-black">

              Need higher volume or custom integrations?

            </h3>

            <p className="text-[13px] text-white/70 max-w-xl">

              Need higher monthly volume, API access, or custom team requirements? Contact us to discuss a suitable plan.

            </p>

          </div>



          <a

            href="mailto:hello@byreel.in"

            className="flex items-center gap-2 rounded-2xl bg-surf-ffffff px-6 py-3.5 text-[13.5px] font-bold text-ink-111110 hover:bg-surf-c5ef26 transition shrink-0 shadow-md"

          >

            <span>Contact Us</span>

            <FiArrowRight size={15} />

          </a>

        </div>



        {/* ── Frequently Asked Questions ── */}

        <div className="max-w-3xl mx-auto space-y-6">

          <div className="text-center space-y-1">

            <h3 className="text-[24px] sm:text-[30px] font-bold text-ink-111110">

              Frequently Asked Questions

            </h3>

            <p className="text-[13px] text-ink-717069">

              Everything you need to know about plans, billing, and commercial usage.

            </p>

          </div>



          <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff divide-y divide-surf-eceae3 shadow-xs overflow-hidden">

            {FAQS.map((faq, idx) => {

              const isOpen = openFaq === idx;

              return (

                <div key={idx} className="transition">

                  <button

                    type="button"

                    onClick={() => setOpenFaq(isOpen ? null : idx)}

                    aria-expanded={isOpen}

                    className="w-full flex items-center justify-between gap-4 px-6 py-4.5 text-left text-[14.5px] font-bold text-ink-111110 hover:bg-surf-faf9f5 cursor-pointer"

                  >

                    <span>{faq.q}</span>

                    <FiChevronDown

                      className={`w-4 h-4 text-ink-8c8980 shrink-0 transition-transform duration-200 ${

                        isOpen ? "rotate-180 text-ink-111110" : ""

                      }`}

                    />

                  </button>

                  {isOpen && (

                    <div className="px-6 pb-5 text-[13px] text-ink-55544e leading-relaxed animate-in fade-in">

                      {faq.a}

                    </div>

                  )}

                </div>

              );

            })}

          </div>



          {/* Trust Guarantees */}

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-[12.5px] font-medium text-ink-717069">

            <span className="flex items-center gap-1.5">

              <FiShield size={14} className="text-ink-658b02" />

              <span>Cancel anytime</span>

            </span>

            <span className="flex items-center gap-1.5">

              <FiCheck size={14} className="text-ink-658b02" />

              <span>Commercial use on paid plans</span>

            </span>

            <span className="flex items-center gap-1.5">

              <FiLock size={14} className="text-ink-658b02" />

              <span>Secure checkout</span>

            </span>

          </div>

        </div>

      </div>

    </section>

  );

});



export default PricingSection;