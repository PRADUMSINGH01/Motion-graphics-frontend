"use client";

/**
 * Plans as the backend sells them. Credits, longest film and prices come from /api/billing/plans (the
 * same Dodo products checkout charges), so the pricing page, the dashboard and checkout never disagree.
 */

import { useEffect, useState } from "react";
import { api, type BillingCycle, type BillingPlan, type PlanPrice, type PlanTier } from "./api";

export const PLAN_NAMES: Record<PlanTier, string> = {
  free: "Free",
  creator: "Creator",
  pro: "Pro Studio",
  enterprise: "Agency",
};

/**
 * The flat rate (a credit per 3 seconds, at least 2): only a fallback while the measured numbers load. Films are
 * charged what they use: model tokens and render time (server/billing.mjs).
 */
export const creditCost = (seconds: number) => Math.max(2, Math.ceil(seconds / 3));

export function formatPrice(price: PlanPrice | null | undefined): string {
  if (!price) return "";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: price.currency || "USD",
    currencyDisplay: "narrowSymbol", // "$5", not "US$5"
    maximumFractionDigits: Number.isInteger(price.amount) ? 0 : 2,
  }).format(price.amount);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// One request per page load, shared by every component that asks.
let plansRequest: Promise<{ plans: BillingPlan[]; typical: Record<string, number> }> | null = null;
function loadPlans(): Promise<{ plans: BillingPlan[]; typical: Record<string, number> }> {
  if (!plansRequest) {
    plansRequest = api.billing.plans().then((r) => ({ plans: r.plans, typical: r.creditsPerFilm ?? {} })).catch((err) => {
      plansRequest = null; // a failed load is retried next time
      throw err;
    });
  }
  return plansRequest;
}

/** Plans, and what a film of a given length typically costs in credits (measured films vary by model). */
export function usePlans(): { plans: BillingPlan[] | null; error: string | null; typical: (seconds: number) => number } {
  const [plans, setPlans] = useState<BillingPlan[] | null>(null);
  const [typicalMap, setTypicalMap] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    loadPlans()
      .then((p) => {
        if (!live) return;
        setPlans(p.plans);
        setTypicalMap(p.typical);
      })
      .catch((err) => live && setError(err instanceof Error ? err.message : "Could not load plans."));
    return () => {
      live = false;
    };
  }, []);
  return { plans, error, typical: (seconds: number) => typicalMap[String(seconds)] ?? creditCost(seconds) };
}

/** Any plan sells yearly: only then is a monthly/yearly switch worth showing. */
export const hasAnnualPrices = (plans: BillingPlan[] | null) => Boolean(plans?.some((p) => p.prices.annual));

/**
 * Buy or change a plan. A new subscriber goes to Dodo's checkout; a subscriber changing plan may be sent to
 * a payment link, or be changed straight away (then the caller refreshes the account).
 */
export async function startCheckout(tier: PlanTier, interval: BillingCycle): Promise<"redirected" | "changed"> {
  const res = await api.billing.checkout(tier, interval);
  if (res.url) {
    window.location.href = res.url;
    return "redirected";
  }
  return "changed";
}
