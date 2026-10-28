"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconMenu,
  IconX,
  IconLogOut,
  IconChevronDown,
  IconCreditCard,
  IconActivity,
  IconKey,
  IconBox,
  IconArrowRight,
  IconSparkles,
} from "../components/Icons";
import {
  FiZap,
  FiGrid,
  FiCode,
  FiTag,
  FiInfo,
  FiVideo,
  FiFolder,
  FiUpload,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { ByreelLogo } from "../components/landing/ByreelBrand";
import ThemeToggle from "../components/ThemeToggle";

// Excluded routes: workspace has its own studio chrome, dashboard has its own shell,
// landing page ("/") renders LandingNav, and pricing/billing pages have navbar removed
const EXCLUDED_ROUTES = [
  "/",
  "/workspace",
  "/dashboard",
  "/templates",
  "/pricing",
  "/billing",
  "/login",
  "/register",
  "/loading",
];

const NAV_LINKS = [
  { href: "/dashboard", label: "Studio", badge: "Live" },
  { href: "/dashboard?section=product-launch", label: "Product Launch", badge: "New" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  
 
];

function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Check if current route is excluded
  const isExcluded = pathname
    ? EXCLUDED_ROUTES.some((route) => {
        const clean = pathname.replace(/\/+$/, "") || "/";
        return clean === route || pathname.startsWith(`${route}/`);
      })
    : false;

  // Scroll detection for shadow and blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page navigation
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
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
  const isActive = (href: string) => {
    if (href.includes("?")) return false;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 select-none border-b border-surf-dedad0 bg-surf-fcfbf7/95 backdrop-blur-md ${
          isScrolled || mobileMenuOpen ? "shadow-xs" : ""
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* ── Brand Logo ── */}
          <Link href="/" className="flex items-center shrink-0" aria-label="byreel home">
            <ByreelLogo size={28} theme="light" />
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {NAV_LINKS.map(({ href, label, badge }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13.5px] font-medium transition-all ${
                    active
                      ? "bg-surf-111110 text-ink-c5ef26 font-semibold shadow-xs"
                      : "text-ink-55544e hover:bg-surf-f2efe6 hover:text-ink-111110"
                  }`}
                >
                  <span>{label}</span>
                  {badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase tracking-wider ${
                        active
                          ? "bg-surf-c5ef26 text-ink-111110"
                          : badge === "Live"
                          ? "bg-surf-f2fac2 text-ink-658b02"
                          : "bg-surf-111110 text-ink-c5ef26"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle className="hidden lg:flex" />

            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-surf-272725 shadow-xs"
                >
                  <IconSparkles className="w-3.5 h-3.5 text-white" />
                  <span>Go to Studio</span>
                </Link>

              
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex rounded-xl px-3.5 py-2 text-[13.5px] font-medium text-ink-55544e hover:text-ink-111110 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-surf-272725 transition shadow-xs"
                >
                  <IconSparkles className="w-3.5 h-3.5 text-ink-c5ef26" />
                  <span>Start Free</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-surf-dedad0 bg-surf-ffffff text-ink-111110 hover:bg-surf-faf9f5"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surf-dedad0 bg-surf-fcfbf7 px-6 pt-4 pb-6 space-y-4 animate-in fade-in">
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {NAV_LINKS.map(({ href, label, badge }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-[14px] ${
                    isActive(href)
                      ? "bg-surf-111110 text-ink-c5ef26 font-semibold"
                      : "text-ink-55544e hover:bg-surf-f2efe6 hover:text-ink-111110"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{label}</span>
                    {badge && (
                      <span className="rounded-full bg-surf-f2fac2 px-1.5 py-0.2 font-mono text-[9px] font-bold text-ink-658b02">
                        {badge}
                      </span>
                    )}
                  </div>
                  <IconArrowRight className="w-4 h-4 text-ink-8c8980" />
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-surf-dedad0">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-button-primary py-2.5 text-[13.5px] font-semibold text-white shadow-xs"
                  >
                    <IconSparkles className="w-4 h-4 text-white" />
                    <span>Open Studio Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-surf-dedad0 bg-surf-ffffff py-2 text-[13px] font-medium text-red-600"
                  >
                    <IconLogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-xl border border-surf-dedad0 bg-surf-ffffff py-2.5 text-[13px] font-medium text-ink-111110"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-surf-111110 py-2.5 text-[13px] font-semibold text-white"
                  >
                    <IconSparkles className="w-3.5 h-3.5 text-ink-c5ef26" />
                    <span>Start Free</span>
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

function MenuLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-medium text-ink-55544e hover:text-ink-111110 hover:bg-surf-faf9f5 transition"
    >
      <span className="text-ink-8c8980">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default memo(Navbar);
