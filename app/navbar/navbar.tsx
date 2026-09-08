"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiZap,
  FiCompass,
  FiTag,
  FiKey,
  FiMenu,
  FiX,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiArrowRight,
  FiChevronDown,
  FiLayers,
  FiType,
  FiActivity,
  FiCreditCard,
  FiSliders,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

// Routes where the global public navbar should NOT be rendered (workspace has its own dedicated studio sidebar)
const EXCLUDED_ROUTES = ["/login", "/register", "/workspace"];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const productDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current route is excluded
  const isExcluded = pathname
    ? EXCLUDED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
    : false;

  // Scroll detection for dynamic blur / shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(e.target as Node)
      ) {
        setProductDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle window resize (close mobile drawer on desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isExcluded) {
    return null;
  }

  const userPlan = user?.plan?.tier || "free";
  const userDisplayName = user?.name || "Creator";
  const userEmail = user?.email || "";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out select-none ${
          isScrolled || mobileMenuOpen
            ? "bg-white/85 dark:bg-[#0c0c11]/85 backdrop-blur-xl border-b border-black/[0.08] dark:border-white/[0.08] shadow-lg shadow-black/[0.04] dark:shadow-2xl dark:shadow-black/70 py-2.5 sm:py-3"
            : "bg-transparent backdrop-blur-none border-b border-transparent shadow-none py-3.5 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* 1. Brand Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <Logo size={34} showText={true} />
              </Link>

              {/* 2. Desktop Navigation Bar */}
              <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
                {/* Motion Studio Link (Featured) */}
                <Link
                  href="/workspace"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pathname === "/workspace"
                      ? "bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 dark:border-cyan-500/40 shadow-xs"
                      : "text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-500/10"
                  }`}
                >
                  <FiZap className="w-3.5 h-3.5" />
                  <span>Studio</span>
                </Link>

                {/* Product Dropdown */}
                <div
                  ref={productDropdownRef}
                  className="relative"
                  onMouseEnter={() => {
                    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                    setProductDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    dropdownTimeoutRef.current = setTimeout(() => {
                      setProductDropdownOpen(false);
                    }, 150);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      productDropdownOpen || pathname?.startsWith("/product")
                        ? "text-slate-900 dark:text-white bg-black/[0.06] dark:bg-white/[0.08]"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>Products</span>
                    <FiChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                        productDropdownOpen ? "rotate-180 text-cyan-600 dark:text-cyan-400" : ""
                      }`}
                    />
                  </button>

                  {/* Clean Dropdown Card */}
                  {productDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-[#0e0f14]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <Link
                        href="/workspace"
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                          <FiZap className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                            Motion Studio
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            60FPS natural language prompt-to-animation engine
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/workspace?tab=vectorizer"
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-400/25 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                          <FiType className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                            Character Vectorizer
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Procedural typography glyph keyframes &amp; physics
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/api-keys"
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                          <FiKey className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                            Developer API &amp; SDK
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Generate API tokens, webhooks &amp; headless render calls
                          </p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Explore Templates */}
                <Link
                  href="/explore"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    pathname === "/explore"
                      ? "text-slate-950 dark:text-white bg-black/[0.06] dark:bg-white/[0.08]"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  Explore
                </Link>

                {/* Plans & Pricing */}
                <Link
                  href="/pricing"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    pathname === "/pricing" || pathname === "/billing"
                      ? "text-slate-950 dark:text-white bg-black/[0.06] dark:bg-white/[0.08]"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  Pricing
                </Link>

                {/* Developer API */}
                <Link
                  href="/api-keys"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    pathname === "/api-keys"
                      ? "text-slate-950 dark:text-white bg-black/[0.06] dark:bg-white/[0.08]"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  API Keys
                </Link>
              </nav>
            </div>

            {/* 3. Right Action Area */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Theme Toggle Button */}
              <ThemeToggle />

              {user ? (
                /* Logged In State: Open Studio CTA + Profile Dropdown */
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Link
                    href="/workspace"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <FiZap className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
                    <span>Open Studio</span>
                  </Link>

                  {/* Clean User Profile Dropdown */}
                  <div ref={userDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] text-xs text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                        {userDisplayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium max-w-[100px] truncate hidden sm:inline">
                        {userDisplayName}
                      </span>
                      <FiChevronDown
                        className={`w-3 h-3 text-slate-400 transition-transform ${
                          userDropdownOpen ? "rotate-180 text-cyan-500 dark:text-cyan-400" : ""
                        }`}
                      />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-white/95 dark:bg-[#0e0f14]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.06] mb-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {userDisplayName}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono uppercase bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/30">
                              {userPlan}
                            </span>
                          </div>
                          {userEmail && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                              {userEmail}
                            </span>
                          )}
                        </div>

                        <Link
                          href="/workspace"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
                        >
                          <FiZap className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                          <span>Motion Studio</span>
                        </Link>

                        <Link
                          href="/workspace?tab=usage"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
                        >
                          <FiActivity className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                          <span>Usages &amp; Quotas</span>
                        </Link>

                        <Link
                          href="/billing"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
                        >
                          <FiCreditCard className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                          <span>Plans &amp; Billing</span>
                        </Link>

                        <Link
                          href="/api-keys"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
                        >
                          <FiKey className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                          <span>Developer API</span>
                        </Link>

                        <div className="pt-1 border-t border-black/[0.06] dark:border-white/[0.06] mt-1">
                          <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <FiLogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Logged Out State: Minimalist Log in & Get Started */
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-white dark:hover:bg-slate-200 rounded-xl shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>Get Started</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Mobile Sheet Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.08] dark:border-white/[0.08] bg-white/98 dark:bg-[#0c0c11]/98 backdrop-blur-2xl px-4 py-4 space-y-3 animate-in fade-in duration-200">
            {/* Theme switcher pill in mobile drawer */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Appearance</span>
              <ThemeToggle variant="studio" showLabel={true} />
            </div>

            <div className="space-y-1">
              <Link
                href="/workspace"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-400/30"
              >
                <FiZap className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>Motion Studio</span>
              </Link>

              <Link
                href="/explore"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              >
                <FiCompass className="w-4 h-4 text-slate-400" />
                <span>Explore Templates</span>
              </Link>

              <Link
                href="/pricing"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              >
                <FiTag className="w-4 h-4 text-slate-400" />
                <span>Plans &amp; Pricing</span>
              </Link>

              <Link
                href="/api-keys"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              >
                <FiKey className="w-4 h-4 text-slate-400" />
                <span>Developer API</span>
              </Link>
            </div>

            {/* Mobile Auth Bottom Section */}
            <div className="pt-3 border-t border-black/[0.08] dark:border-white/[0.08]">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {userDisplayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">{userDisplayName}</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-mono uppercase bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold">
                      {userPlan}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                  >
                    <FiLogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:text-slate-950 dark:bg-white dark:hover:bg-slate-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
