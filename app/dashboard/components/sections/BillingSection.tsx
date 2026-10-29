"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiCreditCard, FiExternalLink, FiDownload, FiCheck, FiPlus, FiAlertCircle } from "react-icons/fi";
import type { User } from "../../../context/AuthContext";

const INVOICES = [
  { id: "INV-2026-003", date: "Oct 01, 2026", amount: "$29.00", status: "Paid", pdf: "#" },
  { id: "INV-2026-002", date: "Sep 01, 2026", amount: "$29.00", status: "Paid", pdf: "#" },
  { id: "INV-2026-001", date: "Aug 01, 2026", amount: "$29.00", status: "Paid", pdf: "#" },
];

export default function BillingSection({ user }: { user: User }) {
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const tier = user.plan?.tier ?? "free";
  const interval = user.plan?.billingInterval ?? "monthly";
  const gens = user.usage?.generations;
  const renewalDate = user.raw?.plan?.currentPeriodEnd
    ? new Date(user.raw.plan.currentPeriodEnd).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "—";

  const downloadPdf = (invId: string) => {
    setDownloadMsg(`Downloading invoice receipt ${invId}.pdf...`);
    setTimeout(() => setDownloadMsg(null), 2500);
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
            ACCOUNT PAYMENTS
          </span>
        </div>
        <h1 className="mt-1 text-[28px] font-bold text-ink-111110">Billing & Invoices</h1>
        <p className="text-[13.5px] text-ink-717069">
          Manage your subscription payment methods, credit quota, and tax receipts.
        </p>
      </div>

      {downloadMsg && (
        <div className="rounded-xl bg-surf-f2fac2 p-3 text-[13px] font-medium text-ink-658b02">
          <FiCheck className="inline mr-1" /> {downloadMsg}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-4">
          <span className="font-mono text-[11px] font-semibold uppercase text-ink-8c8980">Current Plan</span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-[24px] font-bold text-ink-111110 capitalize">{tier} Plan</h3>
            <span className="rounded-full bg-surf-f2efe6 px-2.5 py-0.5 font-mono text-[11px] text-ink-55544e">
              Billed {interval}
            </span>
          </div>

          <div className="space-y-2 text-[13px] text-ink-717069 border-t border-surf-f2efe6 pt-3">
            <div className="flex justify-between">
              <span>Next billing renewal:</span>
              <span className="font-medium text-ink-111110">{renewalDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Credits allocation:</span>
              <span className="font-medium text-ink-111110">
                {gens ? `${gens.monthly} / ${gens.limit} credits used` : "—"}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="#membership"
              className="inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-surf-272725"
            >
              Change Subscription Plan
            </Link>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-4">
          <span className="font-mono text-[11px] font-semibold uppercase text-ink-8c8980">Payment Method</span>
          <div className="flex items-center gap-3 rounded-xl border border-surf-eceae3 bg-surf-faf9f5 p-3.5">
            <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-surf-111110 text-white">
              <span className="font-mono text-[11px] font-bold">VISA</span>
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-ink-111110">Visa ending in 4242</p>
              <p className="text-[11.5px] text-ink-8c8980">Expires 12/28 · Default card</p>
            </div>
          </div>

          <p className="text-[12px] text-ink-717069">
            Payments are securely encrypted and processed via Stripe PCI-DSS Level 1 infrastructure.
          </p>

          <div className="pt-1">
            <button
              type="button"
              className="rounded-xl border border-surf-dedad0 px-3.5 py-2 text-[12.5px] font-medium text-ink-111110 hover:bg-surf-faf9f5"
            >
              Update Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <section className="space-y-4">
        <h3 className="text-[18px] font-bold text-ink-111110">Invoice History</h3>
        <div className="overflow-hidden rounded-2xl border border-surf-dedad0 bg-surf-ffffff shadow-2xs divide-y divide-surf-f2efe6">
          {INVOICES.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-surf-faf9f5 transition">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surf-f2efe6 text-ink-55544e">
                  <FiCreditCard size={15} />
                </span>
                <div>
                  <h4 className="font-mono text-[13px] font-semibold text-ink-111110">{inv.id}</h4>
                  <p className="text-[12px] text-ink-717069">{inv.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[13.5px] font-bold text-ink-111110">{inv.amount}</span>
                <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-658b02">
                  {inv.status}
                </span>
                <button
                  type="button"
                  onClick={() => downloadPdf(inv.id)}
                  className="flex items-center gap-1 rounded-lg border border-surf-dedad0 px-2.5 py-1 text-[11.5px] font-medium text-ink-111110 hover:bg-surf-f2efe6"
                >
                  <FiDownload size={12} /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
