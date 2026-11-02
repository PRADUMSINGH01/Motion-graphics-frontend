"use client";

import React, { useState } from "react";
import { FiCheck, FiArrowRight, FiLoader } from "react-icons/fi";
import { useAuth, type User } from "../../../context/AuthContext";
import { useAlert } from "../../../context/AlertContext";
import { api, type BillingCycle, type BillingPlan, type PlanTier } from "../../../lib/api";
import { PLAN_NAMES, creditCost, formatPrice, hasAnnualPrices, startCheckout, usePlans } from "../../../lib/plans";

const BLURBS: Record<PlanTier, string> = {
  free: "Try the studio and make your first few films.",
  creator: "For people posting Shorts, Reels and B-roll every week.",
  pro: "For teams shipping launches and longer films.",
  enterprise: "For agencies and content teams working at volume.",
};

/** What a plan really gives, in the backend's terms. */
function featuresOf(plan: BillingPlan): string[] {
  const shortFilms = Math.floor(plan.credits / creditCost(15));
  return [
    `${plan.credits.toLocaleString()} credits every month`,
    `Films up to ${plan.maxSeconds} seconds`,
    `About ${shortFilms.toLocaleString()} fifteen-second films`,
    "Every model, 16:9, 9:16 and 1:1",
    "Credits come back when a film fails",
  ];
}

export default function MembershipSection({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const { success, failure } = useAlert();
  const { plans, error } = usePlans();
  const [interval, setInterval] = useState<BillingCycle>("monthly");
  const [busy, setBusy] = useState<PlanTier | "portal" | null>(null);
  const currentTier = (user.plan?.tier ?? "free") as PlanTier;
  const annual = hasAnnualPrices(plans);
  const cycle: BillingCycle = annual ? interval : "monthly";

  const choose = async (plan: BillingPlan) => {
    setBusy(plan.tier);
    try {
      if ((await startCheckout(plan.tier, cycle)) === "changed") {
        await refreshUser();
        success("Plan changed", `You're now on ${PLAN_NAMES[plan.tier]}.`);
      }
    } catch (err) {
      failure("Couldn't start checkout", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(null);
    }
  };

  // Moving down to Free is a cancellation, which Dodo's portal handles (the plan runs to the end of the period).
  const openPortal = async () => {
    setBusy("portal");
    try {
      window.location.href = (await api.billing.portal()).url;
    } catch (err) {
      failure("Couldn't open the billing portal", err instanceof Error ? err.message : "Please try again.");
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-6 lg:p-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
          MEMBERSHIP & PLAN
        </span>
        <h1 className="mt-2 text-[32px] sm:text-[38px] font-bold text-ink-111110">Pick the plan that fits</h1>
        <p className="mt-2 text-[14px] text-ink-717069">
          Credits are spent when a film renders and renew every billing month. Change or cancel any time.
        </p>

        {annual && (
          <div className="mt-6 inline-flex items-center rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-1 shadow-2xs">
            {(["monthly", "annual"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setInterval(c)}
                className={`rounded-xl px-4 py-1.5 text-[12.5px] font-semibold transition ${
                  interval === c ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"
                }`}
              >
                {c === "monthly" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mx-auto max-w-xl rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-4 text-center text-[13.5px] text-ink-717069">
          Plans couldn&apos;t load: {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {!plans && !error &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-[420px] animate-pulse rounded-3xl border border-surf-dedad0 bg-surf-faf9f5" />
          ))}

        {plans?.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const isFeatured = plan.tier === "pro";
          const price = plan.prices[cycle];
          const isDowngradeToFree = plan.tier === "free" && currentTier !== "free";

          let label: string;
          let action: (() => void) | null = null;
          if (isCurrent) label = "Current plan";
          else if (isDowngradeToFree) {
            label = "Cancel in billing portal";
            action = openPortal;
          } else if (plan.tier === "free") label = "Included";
          else if (price) {
            label = `${currentTier === "free" ? "Upgrade to" : "Switch to"} ${PLAN_NAMES[plan.tier]}`;
            action = () => choose(plan);
          } else label = "Not on sale yet";

          const isBusy = busy === plan.tier || (isDowngradeToFree && busy === "portal");

          return (
            <div
              key={plan.tier}
              className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 ${
                isFeatured
                  ? "border-2 border-surf-111110 bg-surf-ffffff shadow-xl ring-2 ring-surf-c5ef26/30"
                  : "border border-surf-dedad0 bg-surf-ffffff shadow-2xs hover:border-surf-111110"
              }`}
            >
              {isFeatured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-surf-111110 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-c5ef26">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-[17px] font-bold text-ink-111110">{PLAN_NAMES[plan.tier]}</h3>
                <p className="mt-1 text-[12px] text-ink-717069 min-h-[36px]">{BLURBS[plan.tier]}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  {plan.tier === "free" ? (
                    <span className="text-[34px] font-bold text-ink-111110">Free</span>
                  ) : price ? (
                    <>
                      <span className="text-[34px] font-bold text-ink-111110">{formatPrice(price)}</span>
                      <span className="text-[12px] text-ink-8c8980">/ {cycle === "annual" ? "year" : "month"}</span>
                    </>
                  ) : (
                    <span className="text-[20px] font-bold text-ink-8c8980">Coming soon</span>
                  )}
                </div>

                <div className="mt-6 border-t border-surf-f2efe6 pt-5 space-y-2.5">
                  {featuresOf(plan).map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-[12.5px] text-ink-2d2c28">
                      <FiCheck size={14} className="text-ink-658b02 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-surf-f2efe6">
                <button
                  type="button"
                  disabled={!action || busy !== null}
                  onClick={action ?? undefined}
                  className={`inline-flex w-full items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition disabled:cursor-default ${
                    !action
                      ? "bg-surf-f2efe6 text-ink-717069"
                      : isFeatured
                      ? "bg-surf-111110 text-white hover:bg-surf-272725 shadow-xs disabled:opacity-60"
                      : "border border-surf-dedad0 bg-surf-ffffff text-ink-111110 hover:bg-surf-faf9f5 disabled:opacity-60"
                  }`}
                >
                  {isBusy ? <FiLoader size={13} className="animate-spin" /> : null}
                  <span>{label}</span>
                  {action && !isBusy ? <FiArrowRight size={13} /> : null}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[12px] text-ink-8c8980">
        Payments are processed by Dodo Payments. A 15-second film uses {creditCost(15)} credits, a minute uses{" "}
        {creditCost(60)}.
      </p>
    </div>
  );
}
