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
  IconArrowRight,
} from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

// Routes where the global public navbar should NOT be rendered (workspace has its own dedicated studio sidebar,
// and the landing page ("/") ships its own header)
const EXCLUDED_ROUTES = ["/", "/login", "/register", "/workspace", "/dashboard"];

const NAV_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/workspace", label: "Studio" },
  { href: "/explore", label: "Templates" },
  { href: "/api-keys", label: "Developers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "Company" },
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
    ? EXCLUDED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
    : false;

  // Scroll detection for border / blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page navigation (state adjusted during render, not in an effect)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle window resize (close mobile drawer on desktop)
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
  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
          isScrolled || mobileMenuOpen
            ? "bg-canvas/80 backdrop-blur-xl border-b border-line"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <header className="container-page flex h-16 items-center justify-between gap-6 select-none">
          {/* ── Brand ── */}
          <Link href="/" className="flex items-center shrink-0" aria-label="byreel home">
            <Logo size={30} />
          </Link>

          {/* ── Desktop navigation ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-[13.5px] font-medium transition-colors ${
                  isActive(href) ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <ThemeToggle className="hidden md:flex" />

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/workspace" className="btn btn-sm btn-secondary hidden md:inline-flex">
                  Open Studio
                </Link>
                <div ref={userDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 h-8 pl-1 pr-2 rounded-md border border-line hover:bg-fg/5 transition-colors cursor-pointer"
                    aria-haspopup="menu"
                    aria-expanded={userDropdownOpen}
                  >
                    <span className="w-6 h-6 rounded-[5px] bg-accent-solid flex items-center justify-center text-[11px] font-semibold text-accent-fg">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </span>
                    <IconChevronDown
                      className={`w-3.5 h-3.5 text-fg-subtle transition-transform ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div
                      role="menu"
                      className="absolute top-full right-0 mt-2 w-60 rounded-xl bg-surface-2 border border-line shadow-elevated p-1.5 z-50 animate-fade-up"
                    >
                      <div className="px-2.5 py-2 mb-1 border-b border-line">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-medium text-fg truncate">{userDisplayName}</span>
                          <span className="badge badge-accent h-5 px-1.5 text-[10px] uppercase tracking-wide">
                            {userPlan}
                          </span>
                        </div>
                        {userEmail && <span className="text-xs text-fg-subtle truncate block mt-0.5">{userEmail}</span>}
                      </div>
                      <MenuLink href="/billing" icon={<IconCreditCard className="w-4 h-4" />} label="Billing" />
                      <MenuLink href="/data-usage" icon={<IconActivity className="w-4 h-4" />} label="Usage" />
                      <MenuLink href="/api-keys" icon={<IconKey className="w-4 h-4" />} label="API keys" />
                      <div className="my-1 h-px bg-line" />
                      <button
                        onClick={logout}
                        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] text-fg-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                      >
                        <IconLogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/login" className="btn btn-sm btn-ghost hidden sm:inline-flex">
                  Log in
                </Link>
                <Link href="/register" className="btn btn-sm btn-primary">
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile drawer trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn btn-sm btn-ghost px-2"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* ── Mobile sheet ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-line bg-canvas px-4 pt-3 pb-5 space-y-4 animate-fade-up">
            <nav className="flex flex-col" aria-label="Mobile Navigation">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between py-3 text-[15px] border-b border-line ${
                    isActive(href) ? "text-fg font-medium" : "text-fg-muted"
                  }`}
                >
                  <span>{label}</span>
                  <IconArrowRight className="w-4 h-4 text-fg-subtle" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-between">
              <span className="text-sm text-fg-muted">Appearance</span>
              <ThemeToggle variant="studio" showLabel />
            </div>

            {user ? (
              <div className="space-y-2">
                <Link href="/workspace" className="btn btn-primary w-full">
                  Open Studio
                </Link>
                <button type="button" onClick={logout} className="btn btn-secondary w-full">
                  <IconLogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="btn btn-secondary">
                  Log in
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Get started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-fg-muted hover:text-fg hover:bg-fg/5 transition-colors"
    >
      <span className="text-fg-subtle">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default memo(Navbar);
