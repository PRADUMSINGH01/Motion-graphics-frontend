"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiZap,
  FiCheck,
  FiArrowRight,
  FiStar,
  FiCreditCard,
  FiFileText,
  FiDownload,
  FiRefreshCw,
  FiSliders,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiLock,
  FiActivity,
  FiCpu,
  FiLayers,
  FiPlus,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { api } from "../lib/api";

type BillingInterval = "monthly" | "annual";
type PlanTier = "free" | "creator" | "pro" | "enterprise";

interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "paid" | "pending" | "refunded";
  pdfUrl?: string;
}

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const { success, failure } = useAlert();

  // Billing Cycle toggle
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("annual");
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [selectedTierForUpdate, setSelectedTierForUpdate] = useState<PlanTier | null>(null);

  // Billing Details State
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvc, setCardCvc] = useState("•••");
  const [billingName, setBillingName] = useState(user?.name || "Pro Motion Creator");
  const [billingEmail, setBillingEmail] = useState(user?.email || "creator@animagent.ai");
  const [taxId, setTaxId] = useState("US-94829104-TAX");

  // Invoices list
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: "INV-2026-0901",
      date: "Sep 01, 2026",
      description: "Studio Pro - Annual Subscription",
      amount: "$59.00 USD",
      status: "paid",
    },
    {
      id: "INV-2026-0801",
      date: "Aug 01, 2026",
      description: "Studio Pro - Annual Subscription",
      amount: "$59.00 USD",
      status: "paid",
    },
    {
      id: "INV-2026-0701",
      date: "Jul 01, 2026",
      description: "Creator Plan - Monthly Subscription",
      amount: "$29.00 USD",
      status: "paid",
    },
  ]);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // User current plan details
  const activeTier: PlanTier = (user?.plan?.tier as PlanTier) || "free";
  const userPlanInterval: BillingInterval =
    (user?.plan?.billingInterval as BillingInterval) || "annual";

  // Tier pricing & features
  const tiers: Array<{
    id: PlanTier;
    name: string;
    badge: string | null;
    priceMonthly: number;
    priceAnnual: number;
    description: string;
    highlighted: boolean;
    features: string[];
  }> = [
    {
      id: "free",
      name: "Free Community",
      badge: null,
      priceMonthly: 0,
      priceAnnual: 0,
      description: "Experiment with procedural motion graphics and basic SVG text animations.",
      highlighted: false,
      features: [
        "10 AI Generations / month",
        "720p 30FPS Web Preview Export",
        "Standard SVG Typography & Keyframes",
        "Community Showcase Access",
        "Shared Community GPU Queue",
      ],
    },
    {
      id: "creator",
      name: "Creator",
      badge: null,
      priceMonthly: 29,
      priceAnnual: 22,
      description: "For freelance animators, motion designers, and indie creative creators.",
      highlighted: false,
      features: [
        "150 AI Motion Generations / month",
        "1080p 60FPS MP4 & WebM Video Export",
        "Full Lottie JSON & Web Vector Glyphs",
        "Kinetic 3D Typography & Logo Reveals",
        "Standard Cloud GPU Queue",
        "Commercial Usage & Monetization Rights",
      ],
    },
    {
      id: "pro",
      name: "Studio Pro",
      badge: "Most Popular",
      priceMonthly: 79,
      priceAnnual: 59,
      description: "For design agencies, motion studios, and production teams scaling output.",
      highlighted: true,
      features: [
        "600 AI Motion Generations / month",
        "4K Lossless 60FPS Apple ProRes & MP4",
        "Editable After Effects (.aep) Project Export",
        "Priority High-Speed GPU Render Cluster",
        "Advanced 3D Camera Controls & Physics",
        "Custom Brand Color Palettes & Fonts",
        "Shared Team Workspace (Up to 5 Seats)",
        "Developer API Access (60 req/min)",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      badge: "Custom Scale",
      priceMonthly: 199,
      priceAnnual: 159,
      description: "For production houses, broadcast networks, and high-volume automated pipelines.",
      highlighted: false,
      features: [
        "Unlimited Generations & Concurrent Renders",
        "Fine-Tuned AI Models on Your Brand Assets",
        "Headless API Access & Webhook Integrations",
        "Dedicated Private GPU Cluster (Zero Queue)",
        "Enterprise SLA & 99.99% Uptime Guarantee",
        "Dedicated Account Manager & 24/7 Support",
        "Custom Invoicing & SSO / SAML Security",
      ],
    },
  ];

  // Handle plan upgrade / switch
  const handleSwitchPlan = async (tier: PlanTier) => {
    if (tier === activeTier && billingInterval === userPlanInterval) {
      return;
    }

    setIsUpdatingPlan(true);
    setSelectedTierForUpdate(tier);

    try {
      if (user) {
        // Live backend call to update plan
        const res = await api.user.updatePlan(tier, billingInterval);
        await refreshUser();
        success(
          "Subscription Updated",
          `Your account has been switched to ${res.user.plan.tier.toUpperCase()} (${billingInterval}).`
        );
      } else {
        // Redirect to register with selected plan
        window.location.href = `/register?plan=${tier}`;
      }
    } catch (err: any) {
      failure("Update Failed", err.message || "Failed to modify subscription plan.");
    } finally {
      setIsUpdatingPlan(false);
      setSelectedTierForUpdate(null);
    }
  };

  // Handle invoice download simulation
  const handleDownloadInvoice = (invoice: InvoiceItem) => {
    success("Invoice Downloaded", `Saved ${invoice.id} (${invoice.amount}) as PDF receipt.`);
  };

  // Handle payment method update
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingPayment(false);
    success("Payment Method Updated", "Default billing card updated successfully.");
  };

  const faqs = [
    {
      q: "Can I upgrade, downgrade, or cancel at any time?",
      a: "Yes. When you upgrade, your new quota and compute tier activate immediately, and prorated credit is applied. When downgrading or canceling, your active benefits remain until the end of your billing cycle.",
    },
    {
      q: "What happens if I exceed my monthly generation quota?",
      a: "If you reach your monthly generation cap, you can either purchase on-demand render credit packs at $0.05/credit or upgrade to the next tier with one click.",
    },
    {
      q: "Do unused motion generation credits roll over?",
      a: "On annual Studio Pro and Enterprise plans, unused generation credits roll over for up to 3 consecutive billing months.",
    },
    {
      q: "What payment methods and currencies are supported?",
      a: "We accept all major credit/debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and SEPA. Enterprise accounts can also pay via automated ACH and corporate bank wire with 30-day net terms.",
    },
    {
      q: "Can I get an official VAT/GST business invoice?",
      a: "Yes. Simply input your company name and VAT/Tax ID in the Billing Information section above, and all past and future invoice receipts will automatically include your tax details.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 font-poppins selection:bg-cyan-500 selection:text-black">
      {/* Breadcrumb Header */}
      <div className="border-b border-white/[0.08] bg-[#090a0f]/90 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <FiLayers className="text-cyan-400" />
              <span>Studio Workspace</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold text-white font-mono">
              PLANS &amp; BILLING
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 transition-all shadow-xs cursor-pointer"
            >
              <FiZap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Open Studio</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ================================================================== */}
        {/* 1. TOP HERO SECTION */}
        {/* ================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 font-semibold">
            <FiShield className="w-3.5 h-3.5 text-cyan-400" />
            <span>TRANSPARENT SUBSCRIPTIONS &amp; USAGE METRICS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-comic">
            Plans &amp; Studio Billing
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Scale your generative motion graphics workflow with dedicated cloud GPU clusters,
            lossless 4K ProRes rendering, and flexible API quotas.
          </p>

          {/* Billing Cadence Toggle */}
          <div className="pt-3 inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md select-none">
            <button
              type="button"
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                billingInterval === "monthly"
                  ? "bg-white text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval("annual")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                billingInterval === "annual"
                  ? "bg-white text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 2. ACTIVE ACCOUNT & LIVE USAGE QUOTAS (If User Logged In) */}
        {/* ================================================================== */}
        {user && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono uppercase text-slate-400">
                    Active Subscription
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {activeTier} TIER
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ● ACTIVE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {user.name}&apos;s Motion Studio
                </h3>
                <p className="text-xs text-slate-400">
                  Billing Cycle:{" "}
                  <span className="text-slate-200 capitalize font-medium">
                    {userPlanInterval}
                  </span>{" "}
                  • Renews on{" "}
                  <span className="text-slate-200 font-mono">
                    {new Date(Date.now() + 24 * 3600 * 1000 * 28).toLocaleDateString()}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSwitchPlan(activeTier === "pro" ? "creator" : "pro")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer"
                >
                  Manage Subscription
                </button>
              </div>
            </div>

            {/* Live Quota Progress Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quota 1: Generations */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <FiZap className="text-cyan-400" />
                    Generations
                  </span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    {activeTier === "enterprise" ? "Unlimited" : "42 / 600"}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]"
                    style={{ width: activeTier === "enterprise" ? "10%" : "7%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Resets in 28 days</span>
              </div>

              {/* Quota 2: 4K Renders */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <FiActivity className="text-indigo-400" />
                    4K Renders
                  </span>
                  <span className="font-mono text-indigo-300 font-semibold">18 / 100</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full shadow-[0_0_8px_#818cf8]"
                    style={{ width: "18%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Lossless ProRes GPU</span>
              </div>

              {/* Quota 3: API Calls */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <FiCpu className="text-emerald-400" />
                    API Calls
                  </span>
                  <span className="font-mono text-emerald-300 font-semibold">1,240 / 50k</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"
                    style={{ width: "2.5%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Rate limit: 60/min</span>
              </div>

              {/* Quota 4: Storage */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <FiLayers className="text-purple-400" />
                    Asset Cloud
                  </span>
                  <span className="font-mono text-purple-300 font-semibold">3.8 / 50 GB</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full shadow-[0_0_8px_#c084fc]"
                    style={{ width: "7.6%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Project backups</span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 3. SUBSCRIPTION TIERS CARDS (4 TIERS) */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {tiers.map((tier) => {
            const price =
              billingInterval === "annual" ? tier.priceAnnual : tier.priceMonthly;
            const isCurrent = activeTier === tier.id;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between p-6 rounded-3xl transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/10 lg:-translate-y-2"
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] shadow-xl"
                }`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30">
                      <FiStar className="w-3 h-3 fill-current" />
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white font-comic">
                      {tier.name}
                    </h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 min-h-[34px] leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="my-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                    {billingInterval === "annual" && price > 0 && (
                      <span className="text-[10px] text-cyan-400 font-medium ml-1.5 font-mono">
                        billed yearly
                      </span>
                    )}
                  </div>

                  <div className="w-full h-px bg-white/10 my-4" />

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="mt-0.5 p-0.5 rounded-full bg-cyan-400/20 text-cyan-300 shrink-0">
                          <FiCheck className="w-3 h-3" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Switch / Upgrade Action Button */}
                <div>
                  <button
                    type="button"
                    disabled={isCurrent || isUpdatingPlan}
                    onClick={() => handleSwitchPlan(tier.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      isCurrent
                        ? "bg-white/10 text-cyan-300 border border-cyan-400/40"
                        : tier.highlighted
                        ? "bg-white text-slate-950 hover:bg-slate-100 shadow-md shadow-white/10"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    {isUpdatingPlan && selectedTierForUpdate === tier.id ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Updating Plan...</span>
                      </>
                    ) : isCurrent ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>Current Active Tier</span>
                      </>
                    ) : (
                      <>
                        <span>{user ? `Switch to ${tier.name}` : "Get Started"}</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================== */}
        {/* 4. PAYMENT METHOD & BILLING CONTACT DETAILS */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Payment Method Mockup */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <FiCreditCard className="text-cyan-400 w-4 h-4" />
                Payment Method
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-slate-300">
                Primary
              </span>
            </div>

            {/* Futuristic Credit Card Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-[#10131d] to-[#1a1f30] border border-white/15 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-cyan-400 font-bold tracking-widest">
                  ANIMAGENT PRO
                </span>
                <span className="text-xs font-mono text-slate-400">VISA</span>
              </div>

              <div className="pt-2 font-mono text-base tracking-widest text-white">
                {cardNumber}
              </div>

              <div className="flex justify-between items-end text-[10px] font-mono text-slate-400">
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">Cardholder</span>
                  <span className="text-slate-200 font-semibold">{billingName}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">Expires</span>
                  <span className="text-slate-200 font-semibold">{cardExpiry}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingPayment(!isEditingPayment)}
              className="w-full py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
            >
              {isEditingPayment ? "Cancel Edit" : "Update Card Details"}
            </button>
          </div>

          {/* Card 2: Billing & Invoice Information Form */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <FiFileText className="text-cyan-400 w-4 h-4" />
                Billing Contact &amp; VAT Information
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Applied to all tax receipts
              </span>
            </div>

            <form onSubmit={handleSavePayment} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Company or Full Name</label>
                <input
                  type="text"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="w-full bg-[#12141d] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Billing Email Receipt</label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="w-full bg-[#12141d] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">VAT / GST / Tax Identification</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="e.g. EU123456789"
                  className="w-full bg-[#12141d] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Country / Region</label>
                <select className="w-full bg-[#12141d] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none">
                  <option>United States (USD)</option>
                  <option>European Union (EUR)</option>
                  <option>United Kingdom (GBP)</option>
                  <option>Canada (CAD)</option>
                  <option>Australia (AUD)</option>
                  <option>India (INR)</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Save Billing Information
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 5. INVOICE & TRANSACTION HISTORY */}
        {/* ================================================================== */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FiFileText className="text-cyan-400" />
                Invoice &amp; Receipt History
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Download tax-compliant receipts and track payment status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/[0.02] text-slate-400 font-mono uppercase text-[10px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-4">Invoice ID</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-300 font-medium">
                      {inv.id}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{inv.date}</td>
                    <td className="py-3 px-4 font-medium text-white">{inv.description}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      {inv.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(inv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer text-[11px]"
                      >
                        <FiDownload className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 6. FULL FEATURE COMPARISON MATRIX TABLE */}
        {/* ================================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-comic">
              Detailed Feature Comparison Matrix
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Side-by-side technical breakdown of capabilities across all subscription tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/[0.03] text-slate-400 font-mono uppercase text-[10px] border-b border-white/[0.08]">
                <tr>
                  <th className="py-3 px-4">Capability / Feature</th>
                  <th className="py-3 px-4 text-center">Free</th>
                  <th className="py-3 px-4 text-center">Creator</th>
                  <th className="py-3 px-4 text-center text-cyan-300 font-bold">Studio Pro</th>
                  <th className="py-3 px-4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Monthly AI Motion Quota</td>
                  <td className="py-3 px-4 text-center font-mono">10</td>
                  <td className="py-3 px-4 text-center font-mono">150</td>
                  <td className="py-3 px-4 text-center font-mono text-cyan-300 font-bold">600</td>
                  <td className="py-3 px-4 text-center font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Maximum Render Resolution</td>
                  <td className="py-3 px-4 text-center">720p 30FPS</td>
                  <td className="py-3 px-4 text-center">1080p 60FPS</td>
                  <td className="py-3 px-4 text-center text-cyan-300 font-bold">4K Lossless 60FPS</td>
                  <td className="py-3 px-4 text-center">8K Broadcast</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Export Codecs &amp; Files</td>
                  <td className="py-3 px-4 text-center">Web Preview</td>
                  <td className="py-3 px-4 text-center">MP4, WebM, Lottie</td>
                  <td className="py-3 px-4 text-center text-cyan-300 font-bold">
                    ProRes, After Effects (.aep)
                  </td>
                  <td className="py-3 px-4 text-center">Custom Raw Codecs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Cloud GPU Cluster</td>
                  <td className="py-3 px-4 text-center">Community Queue</td>
                  <td className="py-3 px-4 text-center">Standard GPU</td>
                  <td className="py-3 px-4 text-center text-cyan-300 font-bold">Priority High-Speed</td>
                  <td className="py-3 px-4 text-center">Dedicated Bare-Metal</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Developer API Key Access</td>
                  <td className="py-3 px-4 text-center text-slate-600">—</td>
                  <td className="py-3 px-4 text-center">Read-Only</td>
                  <td className="py-3 px-4 text-center text-cyan-300 font-bold">
                    Full REST + Webhooks
                  </td>
                  <td className="py-3 px-4 text-center">Custom SLA &amp; SDKs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Team Workspace Seats</td>
                  <td className="py-3 px-4 text-center">1 Seat</td>
                  <td className="py-3 px-4 text-center">1 Seat</td>
                  <td className="py-3 px-4 text-center text-cyan-300 font-bold">5 Seats Included</td>
                  <td className="py-3 px-4 text-center">Unlimited SSO Seats</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Commercial Rights</td>
                  <td className="py-3 px-4 text-center">Personal Only</td>
                  <td className="py-3 px-4 text-center">Commercial</td>
                  <td className="py-3 px-4 text-center text-cyan-300 font-bold">Worldwide Commercial</td>
                  <td className="py-3 px-4 text-center">Full IP Ownership</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 7. FREQUENTLY ASKED QUESTIONS */}
        {/* ================================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-comic">
              Frequently Asked Billing Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear answers regarding subscriptions, refunds, and quota management.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-white/[0.06]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <FiChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <FiChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
