"use client";

import React, { useState } from "react";
import Link from "next/link";
import BackButton from "../components/BackButton";
import StudioLoadingScreen from "../components/StudioLoadingScreen";
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
import ThemeToggle from "../components/ThemeToggle";

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
  const { user, isLoading, refreshUser } = useAuth();
  const { success, failure } = useAlert();

  // Client-side auth guard: immediately redirect to login if session ends
  React.useEffect(() => {
    if (!isLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/login?redirect=/billing";
      }
    }
  }, [user, isLoading]);

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

  // Prevent rendering billing dashboard if unauthenticated
  if (!user && !isLoading) {
    return (
      <StudioLoadingScreen
        message="AUTHENTICATING BILLING SESSION..."
        subMessage="Securing account details and billing invoices"
      />
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-fg font-poppins selection:bg-cyan-500 selection:text-black pt-20">
      {/* Breadcrumb Header */}
      <div className="border-b border-line bg-surface/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton fallbackUrl="/workspace" label="Back" />
            <span className="text-fg-subtle hidden sm:inline">•</span>
            <Link
              href="/workspace"
              className="hidden sm:flex items-center gap-2 text-xs text-fg-muted hover:text-fg transition-colors"
            >
              <FiLayers className="text-accent" />
              <span>Studio Workspace</span>
            </Link>
            <span className="text-fg-subtle hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-fg font-mono">
              PLANS &amp; BILLING
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-all shadow-xs cursor-pointer"
            >
              <FiZap className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-500" />
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-accent font-semibold">
            <FiShield className="w-3.5 h-3.5 text-accent" />
            <span>TRANSPARENT SUBSCRIPTIONS &amp; USAGE METRICS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-fg tracking-tight font-comic">
            Plans &amp; Studio Billing
          </h1>

          <p className="text-sm sm:text-base text-fg-muted leading-relaxed">
            Scale your generative motion graphics workflow with dedicated cloud GPU clusters,
            lossless 4K ProRes rendering, and flexible API quotas.
          </p>

          {/* Billing Cadence Toggle */}
          <div className="pt-3 inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-white/[0.04] border border-line backdrop-blur-md select-none">
            <button
              type="button"
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                billingInterval === "monthly"
                  ? "bg-white text-slate-950 font-bold shadow-md"
                  : "text-fg-muted hover:text-fg"
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
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-accent px-2 py-0.5 rounded-full border border-cyan-500/30">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 2. ACTIVE ACCOUNT & LIVE USAGE QUOTAS (If User Logged In) */}
        {/* ================================================================== */}
        {user && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-white/[0.05] dark:to-white/[0.02] border border-line shadow-xl dark:shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono uppercase text-fg-muted">
                    Active Subscription
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-cyan-500/15 text-accent border border-cyan-500/30">
                    {activeTier} TIER
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-success border border-emerald-500/20">
                    ● ACTIVE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-fg">
                  {user.name}&apos;s Motion Studio
                </h3>
                <p className="text-xs text-fg-muted">
                  Billing Cycle:{" "}
                  <span className="text-fg capitalize font-medium">
                    {userPlanInterval}
                  </span>{" "}
                  • Renews on{" "}
                  <span className="text-fg font-mono">
                    {new Date(Date.now() + 24 * 3600 * 1000 * 28).toLocaleDateString()}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSwitchPlan(activeTier === "pro" ? "creator" : "pro")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 border border-black/10 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/10 transition-all cursor-pointer"
                >
                  Manage Subscription
                </button>
              </div>
            </div>

            {/* Live Quota Progress Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quota 1: Generations */}
              <div className="p-4 rounded-2xl bg-canvas-subtle border border-line space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted flex items-center gap-1.5">
                    <FiZap className="text-accent" />
                    Generations
                  </span>
                  <span className="font-mono text-accent font-semibold">
                    {activeTier === "enterprise" ? "Unlimited" : "42 / 600"}
                  </span>
                </div>
                <div className="w-full h-2 bg-fg/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-solid rounded-full"
                    style={{ width: activeTier === "enterprise" ? "10%" : "7%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Resets in 28 days</span>
              </div>

              {/* Quota 2: 4K Renders */}
              <div className="p-4 rounded-2xl bg-canvas-subtle border border-line space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted flex items-center gap-1.5">
                    <FiActivity className="text-accent" />
                    4K Renders
                  </span>
                  <span className="font-mono text-accent font-semibold">18 / 100</span>
                </div>
                <div className="w-full h-2 bg-fg/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full"
                    style={{ width: "18%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Lossless ProRes GPU</span>
              </div>

              {/* Quota 3: API Calls */}
              <div className="p-4 rounded-2xl bg-canvas-subtle border border-line space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted flex items-center gap-1.5">
                    <FiCpu className="text-success" />
                    API Calls
                  </span>
                  <span className="font-mono text-success font-semibold">1,240 / 50k</span>
                </div>
                <div className="w-full h-2 bg-fg/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: "2.5%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">Rate limit: 60/min</span>
              </div>

              {/* Quota 4: Storage */}
              <div className="p-4 rounded-2xl bg-canvas-subtle border border-line space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted flex items-center gap-1.5">
                    <FiLayers className="text-purple-500 dark:text-purple-400" />
                    Asset Cloud
                  </span>
                  <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold">3.8 / 50 GB</span>
                </div>
                <div className="w-full h-2 bg-fg/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 dark:bg-purple-400 rounded-full"
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
                    ? "bg-white dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] border-2 border-cyan-500 dark:border-cyan-400/50 shadow-2xl shadow-cyan-500/10 lg:-translate-y-2"
                    : "bg-fg/[0.025] border border-line hover:border-line-strong hover:bg-slate-50/50 dark:hover:bg-white/[0.05] shadow-xl"
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
                    <h3 className="text-xl font-bold text-fg font-comic">
                      {tier.name}
                    </h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-cyan-500/20 text-accent border border-cyan-500/40">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-fg-muted min-h-[34px] leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="my-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-fg tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs text-fg-muted font-medium">/ month</span>
                    {billingInterval === "annual" && price > 0 && (
                      <span className="text-[10px] text-accent font-medium ml-1.5 font-mono">
                        billed yearly
                      </span>
                    )}
                  </div>

                  <div className="w-full h-px bg-fg/10 my-4" />

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 text-xs text-fg-muted mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="mt-0.5 p-0.5 rounded-full bg-cyan-500/20 text-accent shrink-0">
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
                        ? "bg-slate-100 text-cyan-800 dark:bg-white/10 dark:text-cyan-300 border border-cyan-500/40"
                        : tier.highlighted
                        ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-black/10 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20"
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
          <div className="p-6 rounded-3xl bg-fg/[0.025] border border-line shadow-lg dark:shadow-none flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-fg flex items-center gap-2">
                <FiCreditCard className="text-accent w-4 h-4" />
                Payment Method
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-fg/10 text-fg-muted">
                Primary
              </span>
            </div>

            {/* Futuristic Credit Card Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-surface to-surface border border-line-strong shadow-xl space-y-4 relative overflow-hidden text-white">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-cyan-400 font-bold tracking-widest">
                  BYREEL PRO
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
              className="w-full py-2 rounded-xl text-xs font-medium text-fg-muted hover:text-fg bg-fg/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-line transition-colors cursor-pointer"
            >
              {isEditingPayment ? "Cancel Edit" : "Update Card Details"}
            </button>
          </div>

          {/* Card 2: Billing & Invoice Information Form */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-fg/[0.025] border border-line shadow-lg dark:shadow-none space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-semibold text-fg flex items-center gap-2">
                <FiFileText className="text-accent w-4 h-4" />
                Billing Contact &amp; VAT Information
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Applied to all tax receipts
              </span>
            </div>

            <form onSubmit={handleSavePayment} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-fg-muted font-medium">Company or Full Name</label>
                <input
                  type="text"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="w-full bg-canvas-subtle border border-line-strong rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-fg-muted font-medium">Billing Email Receipt</label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="w-full bg-canvas-subtle border border-line-strong rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-fg-muted font-medium">VAT / GST / Tax Identification</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="e.g. EU123456789"
                  className="w-full bg-canvas-subtle border border-line-strong rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-fg-muted font-medium">Country / Region</label>
                <select className="w-full bg-canvas-subtle border border-line-strong rounded-lg px-3 py-2 text-fg focus:outline-none">
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
        <div className="p-6 rounded-3xl bg-fg/[0.025] border border-line shadow-lg dark:shadow-none space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
                <FiFileText className="text-accent" />
                Invoice &amp; Receipt History
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Download tax-compliant receipts and track payment status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-fg-muted">
              <thead className="bg-fg/[0.025] text-fg-muted font-mono uppercase text-[10px] border-b border-line">
                <tr>
                  <th className="py-2.5 px-4">Invoice ID</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/[0.04]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-fg/[0.025] transition-colors">
                    <td className="py-3 px-4 font-mono text-accent font-medium">
                      {inv.id}
                    </td>
                    <td className="py-3 px-4 text-fg-muted">{inv.date}</td>
                    <td className="py-3 px-4 font-medium text-fg">{inv.description}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-fg">
                      {inv.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/15 text-success border border-emerald-500/30">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(inv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-black/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10 transition-colors cursor-pointer text-[11px]"
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
        <div className="p-6 sm:p-8 rounded-3xl bg-fg/[0.025] border border-line shadow-lg dark:shadow-none space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-fg font-comic">
              Detailed Feature Comparison Matrix
            </h3>
            <p className="text-xs sm:text-sm text-fg-muted">
              Side-by-side technical breakdown of capabilities across all subscription tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-fg-muted">
              <thead className="bg-fg/[0.025] text-fg-muted font-mono uppercase text-[10px] border-b border-line">
                <tr>
                  <th className="py-3 px-4">Capability / Feature</th>
                  <th className="py-3 px-4 text-center">Free</th>
                  <th className="py-3 px-4 text-center">Creator</th>
                  <th className="py-3 px-4 text-center text-accent font-bold">Studio Pro</th>
                  <th className="py-3 px-4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/[0.04]">
                <tr>
                  <td className="py-3 px-4 font-semibold text-fg">Monthly AI Motion Quota</td>
                  <td className="py-3 px-4 text-center font-mono">10</td>
                  <td className="py-3 px-4 text-center font-mono">150</td>
                  <td className="py-3 px-4 text-center font-mono text-accent font-bold">600</td>
                  <td className="py-3 px-4 text-center font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-fg">Maximum Render Resolution</td>
                  <td className="py-3 px-4 text-center">720p 30FPS</td>
                  <td className="py-3 px-4 text-center">1080p 60FPS</td>
                  <td className="py-3 px-4 text-center text-accent font-bold">4K Lossless 60FPS</td>
                  <td className="py-3 px-4 text-center">8K Broadcast</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-fg">Export Codecs &amp; Files</td>
                  <td className="py-3 px-4 text-center">Web Preview</td>
                  <td className="py-3 px-4 text-center">MP4, WebM, Lottie</td>
                  <td className="py-3 px-4 text-center text-accent font-bold">
                    ProRes, After Effects (.aep)
                  </td>
                  <td className="py-3 px-4 text-center">Custom Raw Codecs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-fg">Cloud GPU Cluster</td>
                  <td className="py-3 px-4 text-center">Community Queue</td>
                  <td className="py-3 px-4 text-center">Standard GPU</td>
                  <td className="py-3 px-4 text-center text-accent font-bold">Priority High-Speed</td>
                  <td className="py-3 px-4 text-center">Dedicated Bare-Metal</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-fg">Developer API Key Access</td>
                  <td className="py-3 px-4 text-center text-fg-subtle">—</td>
                  <td className="py-3 px-4 text-center">Read-Only</td>
                  <td className="py-3 px-4 text-center text-accent font-bold">
                    Full REST + Webhooks
                  </td>
                  <td className="py-3 px-4 text-center">Custom SLA &amp; SDKs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-fg">Team Workspace Seats</td>
                  <td className="py-3 px-4 text-center">1 Seat</td>
                  <td className="py-3 px-4 text-center">1 Seat</td>
                  <td className="py-3 px-4 text-center text-accent font-bold">5 Seats Included</td>
                  <td className="py-3 px-4 text-center">Unlimited SSO Seats</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-fg">Commercial Rights</td>
                  <td className="py-3 px-4 text-center">Personal Only</td>
                  <td className="py-3 px-4 text-center">Commercial</td>
                  <td className="py-3 px-4 text-center text-accent font-bold">Worldwide Commercial</td>
                  <td className="py-3 px-4 text-center">Full IP Ownership</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 7. FREQUENTLY ASKED QUESTIONS */}
        {/* ================================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-fg/[0.025] border border-line shadow-lg dark:shadow-none space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-fg font-comic">
              Frequently Asked Billing Questions
            </h3>
            <p className="text-xs sm:text-sm text-fg-muted">
              Clear answers regarding subscriptions, refunds, and quota management.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-black/10 dark:divide-white/[0.06]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-fg hover:text-accent transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <FiChevronUp className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <FiChevronDown className="w-4 h-4 text-fg-subtle shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs text-fg-muted leading-relaxed pl-1">
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
