"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FiCreditCard, FiExternalLink, FiRefreshCw, FiFilm, FiLoader } from "react-icons/fi";
import { useAuth, type User } from "../../../context/AuthContext";
import { useAlert } from "../../../context/AlertContext";
import { api, ApiError, type InvoiceItem, type UsageSummary } from "../../../lib/api";
import { PLAN_NAMES, creditCost, formatDate } from "../../../lib/plans";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-surf-f2fac2 text-ink-658b02",
  past_due: "bg-[#fef3c7] text-[#92400e]",
  on_hold: "bg-[#fef3c7] text-[#92400e]",
  cancelled: "bg-surf-f2efe6 text-ink-55544e",
  expired: "bg-surf-f2efe6 text-ink-55544e",
};

const FILM_STATUS: Record<string, string> = { done: "Ready", failed: "Failed", running: "Rendering", queued: "Queued" };

const fetchBilling = () => Promise.all([api.usage.get(), api.billing.invoices()]);

export default function BillingSection({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const { success, failure } = useAlert();
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"portal" | "refresh" | null>(null);

  const show = useCallback(([u, inv]: [UsageSummary, { invoices: InvoiceItem[] }]) => {
    setUsage(u);
    setInvoices(inv.invoices);
    setLoadError(null);
  }, []);
  const showError = useCallback(
    (err: unknown) => setLoadError(err instanceof Error ? err.message : "Could not load your billing details."),
    []
  );
  const load = useCallback(() => fetchBilling().then(show, showError), [show, showError]);

  useEffect(() => {
    let live = true;
    fetchBilling().then(
      (r) => live && show(r),
      (err) => live && showError(err)
    );
    return () => {
      live = false;
    };
  }, [show, showError]);

  const openPortal = async () => {
    setBusy("portal");
    try {
      window.location.href = (await api.billing.portal()).url;
    } catch (err) {
      failure("Couldn't open the billing portal", err instanceof Error ? err.message : "Please try again.");
      setBusy(null);
    }
  };

  // Ask Dodo for the subscription (a late or missed webhook), then reload what this page shows.
  const refresh = async () => {
    setBusy("refresh");
    try {
      await api.billing.sync().catch((err) => {
        // Payments not set up on this server: there is nothing to sync, the reload still helps.
        if (!(err instanceof ApiError && err.statusCode === 503)) throw err;
      });
      await Promise.all([refreshUser(), load()]);
      success("Up to date", "Your plan and credits are current.");
    } catch (err) {
      failure("Couldn't refresh", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const tier = usage?.plan.tier ?? user.plan?.tier ?? "free";
  const credits = usage?.credits;
  const usedPct = credits && credits.limit > 0 ? Math.min(100, Math.round((credits.used / credits.limit) * 100)) : 0;
  const plan = usage?.plan;
  const ending = plan && (plan.cancelAtPeriodEnd || plan.status === "cancelled");

  return (
    <div className="mx-auto w-full max-w-5xl p-6 lg:p-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
            BILLING & USAGE
          </span>
          <h1 className="mt-1 text-[28px] font-bold text-ink-111110">Billing & usage</h1>
          <p className="text-[13.5px] text-ink-717069">Your plan, the credits left this period, and what each film used.</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 rounded-xl border border-surf-dedad0 bg-surf-ffffff px-3.5 py-2 text-[12.5px] font-medium text-ink-111110 hover:bg-surf-faf9f5 disabled:opacity-60"
        >
          <FiRefreshCw size={13} className={busy === "refresh" ? "animate-spin" : undefined} /> Refresh
        </button>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-4 text-[13.5px] text-ink-717069">
          {loadError}{" "}
          <button type="button" onClick={load} className="font-semibold text-ink-111110 underline">
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan */}
        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-4">
          <span className="font-mono text-[11px] font-semibold uppercase text-ink-8c8980">Current plan</span>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[24px] font-bold text-ink-111110">{PLAN_NAMES[tier]}</h3>
            {plan && (
              <span className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${STATUS_STYLE[plan.status] ?? STATUS_STYLE.active}`}>
                {plan.status.replace("_", " ")}
              </span>
            )}
          </div>

          <div className="space-y-2 text-[13px] text-ink-717069 border-t border-surf-f2efe6 pt-3">
            <div className="flex justify-between">
              <span>Billing</span>
              <span className="font-medium text-ink-111110">
                {plan?.interval ? (plan.interval === "annual" ? "Yearly" : "Monthly") : plan ? "No subscription" : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{ending ? "Ends on" : plan?.renewsAt ? "Renews on" : "Credits renew"}</span>
              <span className="font-medium text-ink-111110">{formatDate(plan?.renewsAt ?? credits?.periodEnd)}</span>
            </div>
            <div className="flex justify-between">
              <span>Longest film</span>
              <span className="font-medium text-ink-111110">{usage ? `${usage.limits.maxSeconds} s` : "—"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {plan?.manageable && (
              <button
                type="button"
                onClick={openPortal}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-surf-272725 disabled:opacity-60"
              >
                {busy === "portal" ? <FiLoader size={13} className="animate-spin" /> : <FiExternalLink size={13} />}
                Manage subscription
              </button>
            )}
            <a
              href="#membership"
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-semibold ${
                plan?.manageable
                  ? "border border-surf-dedad0 text-ink-111110 hover:bg-surf-faf9f5"
                  : "bg-surf-111110 text-white hover:bg-surf-272725"
              }`}
            >
              {tier === "free" ? "Upgrade" : "Change plan"}
            </a>
          </div>
        </div>

        {/* Credits */}
        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-4">
          <span className="font-mono text-[11px] font-semibold uppercase text-ink-8c8980">Credits this period</span>
          {credits ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-[34px] font-bold text-ink-111110">{credits.remaining.toLocaleString()}</span>
                <span className="text-[13px] text-ink-717069">left of {credits.limit.toLocaleString()}</span>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-surf-f2efe6"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={credits.limit}
                aria-valuenow={credits.used}
                aria-label="Credits used this period"
              >
                <div className={`h-full rounded-full ${usedPct >= 90 ? "bg-[#dc2626]" : "bg-surf-111110"}`} style={{ width: `${usedPct}%` }} />
              </div>
              <div className="flex justify-between text-[12px] text-ink-717069">
                <span>{credits.used.toLocaleString()} used</span>
                <span>Renews {formatDate(credits.periodEnd)}</span>
              </div>
              <p className="border-t border-surf-f2efe6 pt-3 text-[12px] text-ink-8c8980">
                A 15-second film uses {creditCost(15)} credits, 30 seconds {creditCost(30)}, a minute {creditCost(60)}. A
                film that fails gives its credits back.
              </p>
            </>
          ) : (
            <div className="h-28 animate-pulse rounded-xl bg-surf-faf9f5" />
          )}
        </div>
      </div>

      {/* This period */}
      {usage && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["Films", usage.totals.films],
            ["Ready", usage.totals.completed],
            ["Seconds rendered", usage.totals.seconds],
            ["Credits refunded", usage.totals.creditsRefunded],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-4 shadow-2xs">
              <p className="font-mono text-[10.5px] font-semibold uppercase text-ink-8c8980">{label}</p>
              <p className="mt-1 text-[22px] font-bold text-ink-111110">{Number(value).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Films this period */}
      <section className="space-y-4">
        <h3 className="text-[18px] font-bold text-ink-111110">Films this period</h3>
        <div className="overflow-hidden rounded-2xl border border-surf-dedad0 bg-surf-ffffff shadow-2xs divide-y divide-surf-f2efe6">
          {usage && usage.films.length === 0 && (
            <p className="p-5 text-[13px] text-ink-717069">No films yet this period.</p>
          )}
          {usage?.films.map((f) => (
            <div key={f.promptId} className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surf-f2efe6 text-ink-55544e">
                  <FiFilm size={15} />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-[13px] font-semibold text-ink-111110">{f.title || "Untitled film"}</h4>
                  <p className="text-[12px] text-ink-717069">
                    {formatDate(f.createdAt)}
                    {f.durationS ? ` · ${f.durationS} s` : ""}
                    {f.ratio ? ` · ${f.ratio}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={`text-[13px] font-bold ${f.refunded ? "text-ink-8c8980 line-through" : "text-ink-111110"}`}>
                  {f.credits} cr
                </span>
                <span className="rounded-full bg-surf-f2efe6 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-55544e">
                  {f.refunded ? "Refunded" : FILM_STATUS[f.status] ?? f.status}
                </span>
              </div>
            </div>
          ))}
          {!usage && !loadError && <div className="h-24 animate-pulse bg-surf-faf9f5" />}
        </div>
      </section>

      {/* Payments */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[18px] font-bold text-ink-111110">Payments</h3>
          <p className="text-[12px] text-ink-8c8980">
            Processed by Dodo Payments. Card details and receipts are in the billing portal.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-surf-dedad0 bg-surf-ffffff shadow-2xs divide-y divide-surf-f2efe6">
          {invoices && invoices.length === 0 && <p className="p-5 text-[13px] text-ink-717069">No payments yet.</p>}
          {invoices?.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surf-f2efe6 text-ink-55544e">
                  <FiCreditCard size={15} />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-[13px] font-semibold text-ink-111110">{inv.description}</h4>
                  <p className="text-[12px] text-ink-717069">
                    {inv.date} · <span className="font-mono">{inv.id}</span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[13.5px] font-bold text-ink-111110">{inv.amount}</span>
                <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold capitalize text-ink-658b02">
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
          {!invoices && !loadError && <div className="h-16 animate-pulse bg-surf-faf9f5" />}
        </div>
      </section>
    </div>
  );
}
