"use client";

/**
 * /billing: where Dodo's checkout and billing portal send people back (?checkout=success). The account is
 * synced from Dodo first, so the new plan shows even when its webhook is late, then the person lands on the
 * dashboard's Billing & usage section, which is the one billing page.
 */

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import StudioLoadingScreen from "../components/StudioLoadingScreen";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { api } from "../lib/api";
import { PLAN_NAMES } from "../lib/plans";

export default function BillingPage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();
  const { success, failure } = useAlert();
  const ran = useRef(false);

  useEffect(() => {
    if (isLoading || ran.current) return;
    ran.current = true;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/billing${window.location.search}`)}`);
      return;
    }
    const returning = new URLSearchParams(window.location.search).get("checkout") === "success";
    (async () => {
      if (returning) {
        try {
          const { user: synced } = await api.billing.sync();
          await refreshUser();
          success("Payment received", `You're on ${PLAN_NAMES[synced.plan.tier] ?? synced.plan.tier}. Your credits are ready.`);
        } catch (err) {
          failure(
            "Payment is still processing",
            err instanceof Error ? `${err.message} Refresh Billing & usage in a minute.` : "Refresh Billing & usage in a minute."
          );
        }
      }
      router.replace("/dashboard?section=billing");
    })();
  }, [isLoading, user, router, refreshUser, success, failure]);

  return <StudioLoadingScreen message="OPENING BILLING..." subMessage="Checking your plan and credits" />;
}
