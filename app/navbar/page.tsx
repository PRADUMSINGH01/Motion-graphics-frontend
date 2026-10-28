"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ByreelLogo } from "../components/landing/ByreelBrand";
import {
  FiZap,
  FiGrid,
  FiCode,
  FiTag,
  FiInfo,
  FiCheck,
  FiArrowRight,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiBox,
  FiCreditCard,
  FiMenu,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import { IconSparkles } from "../components/Icons";

export default function NavbarPage() {
  const [activeTab, setActiveTab] = useState<"public" | "auth" | "dark">("public");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surf-fcfbf7 text-ink-111110 pt-24 pb-20 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Title Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
              DESIGN SYSTEM
            </span>
            <span className="rounded-full bg-surf-111110 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-c5ef26">
              NAVBAR SPECIFICATION
            </span>
          </div>
          <h1 className="text-[32px] sm:text-[42px] font-black tracking-tight text-ink-111110">
            Byreel Global Navigation Suite
          </h1>
          <p className="text-[14.5px] text-ink-717069 max-w-2xl leading-relaxed">
            The official global header architecture for Byreel. Features adaptive glassmorphism, responsive drawer states, verified user menus, and instant access to the Product Launch Studio.
          </p>
        </div>

        {/* State Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-surf-dedad0 pb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab("public");
              setDropdownOpen(false);
            }}
            className={`rounded-xl px-4 py-2 text-[13px] font-semibold transition ${
              activeTab === "public"
                ? "bg-surf-111110 text-ink-c5ef26 shadow-xs"
                : "bg-surf-ffffff border border-surf-dedad0 text-ink-55544e hover:border-surf-111110"
            }`}
          >
            01. Public Guest State
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("auth");
              setDropdownOpen(true);
            }}
            className={`rounded-xl px-4 py-2 text-[13px] font-semibold transition ${
              activeTab === "auth"
                ? "bg-surf-111110 text-ink-c5ef26 shadow-xs"
                : "bg-surf-ffffff border border-surf-dedad0 text-ink-55544e hover:border-surf-111110"
            }`}
          >
            02. Authenticated Studio State
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("dark");
              setDropdownOpen(false);
            }}
            className={`rounded-xl px-4 py-2 text-[13px] font-semibold transition ${
              activeTab === "dark"
                ? "bg-surf-111110 text-ink-c5ef26 shadow-xs"
                : "bg-surf-ffffff border border-surf-dedad0 text-ink-55544e hover:border-surf-111110"
            }`}
          >
            03. Dark Obsidian Cinema State
          </button>

          <button
            type="button"
            onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
            className="ml-auto rounded-xl border border-surf-dedad0 bg-surf-ffffff px-3.5 py-2 text-[12px] font-mono text-ink-55544e hover:border-surf-111110"
          >
            {mobilePreviewOpen ? "Hide Mobile Drawer" : "Preview Mobile Drawer"}
          </button>
        </div>

        {/* ── Interactive Navbar Canvas ── */}
        <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-surf-f2efe6 pb-4 font-mono text-[11.5px] text-ink-8c8980">
            <span>LIVE INTERACTIVE PREVIEW</span>
            <span>VARIANT: {activeTab.toUpperCase()}</span>
          </div>

          {/* Rendered Navbar Preview */}
          <div
            className={`rounded-2xl border transition-all duration-300 p-4 sm:p-5 shadow-sm ${
              activeTab === "dark"
                ? "border-white/10 bg-surf-111110 text-white"
                : "border-surf-eceae3 bg-surf-fcfbf7 text-ink-111110"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Brand Logo */}
              <Link href="/" className="shrink-0 flex items-center">
                <ByreelLogo size={28} theme={activeTab === "dark" ? "dark" : "light"} />
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                {[
                  { label: "Studio", href: "/dashboard", badge: "Live" },
                  { label: "Product Launch", href: "/dashboard?section=product-launch", badge: "New" },
                  { label: "Templates", href: "/templates" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Developers", href: "/api-keys" },
                  { label: "Company", href: "/about" },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-medium transition ${
                      activeTab === "dark"
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-ink-55544e hover:text-ink-111110 hover:bg-surf-f2efe6"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 font-mono text-[8.5px] font-bold uppercase ${
                          link.badge === "Live"
                            ? "bg-surf-f2fac2 text-ink-658b02"
                            : "bg-surf-111110 text-ink-c5ef26"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Actions Right */}
              <div className="flex items-center gap-2.5">
                {activeTab === "public" ? (
                  <>
                    <Link
                      href="/login"
                      className="hidden sm:inline-flex text-[13px] font-medium text-ink-55544e hover:text-ink-111110 px-3 py-1.5"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2 text-[13px] font-semibold text-white hover:bg-surf-272725 transition shadow-xs"
                    >
                      <IconSparkles className="w-3.5 h-3.5 text-ink-c5ef26" />
                      <span>Start Free</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12.5px] font-semibold shadow-xs ${
                        activeTab === "dark"
                          ? "bg-surf-c5ef26 text-ink-111110"
                          : "bg-surf-111110 text-white"
                      }`}
                    >
                      <IconSparkles className="w-3.5 h-3.5" />
                      <span>Studio Dashboard</span>
                    </Link>

                    {/* Dropdown Profile */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`flex items-center gap-1.5 h-9 pl-1 pr-2 rounded-xl border transition ${
                          activeTab === "dark"
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-surf-dedad0 bg-surf-ffffff text-ink-111110"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-surf-c5ef26 flex items-center justify-center text-[11px] font-bold text-ink-111110">
                          P
                        </span>
                        <FiChevronDown
                          size={13}
                          className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div
                          className={`absolute top-full right-0 mt-2 w-64 rounded-2xl border p-2 shadow-2xl z-50 ${
                            activeTab === "dark"
                              ? "border-white/15 bg-surf-17181c text-white"
                              : "border-surf-dedad0 bg-surf-ffffff text-ink-111110"
                          }`}
                        >
                          <div className="px-3 py-2 border-b border-white/10 mb-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[13px]">Pradum Singh</span>
                              <span className="rounded-full bg-surf-f2fac2 px-2 py-0.2 font-mono text-[9px] font-semibold text-ink-658b02">
                                PRO STUDIO
                              </span>
                            </div>
                            <span className="text-[11px] text-white/50 block">pradum@byreel.io</span>
                          </div>

                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] hover:bg-white/10"
                          >
                            <FiBox size={14} />
                            <span>Dashboard Studio</span>
                          </Link>
                          <Link
                            href="/dashboard?section=product-launch"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] hover:bg-white/10"
                          >
                            <FiZap size={14} className="text-ink-c5ef26" />
                            <span>Product Launch Studio</span>
                          </Link>
                          <Link
                            href="/pricing"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] hover:bg-white/10"
                          >
                            <FiCreditCard size={14} />
                            <span>Billing & Plans</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Sheet Preview if toggled */}
            {mobilePreviewOpen && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-[13px]">
                <span className="font-mono text-[10px] uppercase text-ink-8c8980">
                  MOBILE DRAWER SLIDE-OUT
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    className="p-2.5 rounded-xl border border-white/10 text-center font-medium"
                  >
                    Studio
                  </Link>
                  <Link
                    href="/dashboard?section=product-launch"
                    className="p-2.5 rounded-xl border border-white/10 text-center font-medium text-ink-c5ef26"
                  >
                    Product Launch
                  </Link>
                  <Link
                    href="/explore"
                    className="p-2.5 rounded-xl border border-white/10 text-center font-medium"
                  >
                    Templates
                  </Link>
                  <Link
                    href="/pricing"
                    className="p-2.5 rounded-xl border border-white/10 text-center font-medium"
                  >
                    Pricing
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Architecture & Routing Summary ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 space-y-2">
            <h3 className="text-[16px] font-bold text-ink-111110">
              ✓ Product Page Removed
            </h3>
            <p className="text-[12.5px] text-ink-717069 leading-relaxed">
              Old monolithic product page removed. Route <code>/product</code> now cleanly redirects directly to the interactive <strong>Product Launch Studio</strong>.
            </p>
          </div>

          <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 space-y-2">
            <h3 className="text-[16px] font-bold text-ink-111110">
              ✓ High-Priority Pricing Link
            </h3>
            <p className="text-[12.5px] text-ink-717069 leading-relaxed">
              Pricing is now promoted to the primary navigation bar and footer with annual savings badges and volume calculators.
            </p>
          </div>

          <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 space-y-2">
            <h3 className="text-[16px] font-bold text-ink-111110">
              ✓ Official 3D Byreel Ribbon
            </h3>
            <p className="text-[12.5px] text-ink-717069 leading-relaxed">
              All legacy placeholder logos replaced with the official glossy 3D ribbon mark and typography from <code>ByreelBrand.tsx</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
