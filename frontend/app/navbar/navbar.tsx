"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCompass,
  FiZap,
  FiTag,
  FiInfo,
  FiMenu,
  FiX,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiArrowRight,
  FiSearch,
  FiLayers,
  FiChevronDown,
  FiKey,
  FiCpu,
  FiFilm,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isDropdown?: boolean;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Product", href: "/product", icon: FiZap, badge: "AI Core", isDropdown: true },
  { name: "Explore", href: "/explore", icon: FiCompass },
  { name: "Pricing", href: "/#pricing", icon: FiTag },
  { name: "About", href: "/about", icon: FiInfo },
];

// Routes where the navbar should NOT be rendered
const EXCLUDED_ROUTES = ["/login", "/register"];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [mobileProductExpanded, setMobileProductExpanded] = useState(true);

  const productMenuRef = useRef<HTMLDivElement>(null);

  // Check if current route is in the excluded list
  const isExcluded = pathname
    ? EXCLUDED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
    : false;

  // Handle scroll detection for dynamic glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page navigation or outside click
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setProductMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        productMenuRef.current &&
        !productMenuRef.current.contains(e.target as Node)
      ) {
        setProductMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If on login or register, do not render navbar
  if (isExcluded) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${
          isScrolled
            ? "bg-[#121013]/85 backdrop-blur-xl shadow-xl shadow-black/30 py-3"
            : "bg-[#121013]/40 backdrop-blur-md py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand / Logo */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-white shadow-md shadow-black/20 ring-1 ring-white/20 transition-all duration-300 group-hover:bg-white/15 overflow-hidden">
                  <img
                    src="/animagent-logo.png"
                    alt="Animagent"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white font-comic drop-shadow-md">
                    Animagent
                  </span>
                 
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav
                className="hidden md:flex items-center gap-1 font-poppins"
                aria-label="Main Navigation"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(item.href);

                  // Special Dropdown for Product
                  if (item.isDropdown) {
                    return (
                      <div
                        key={item.name}
                        ref={productMenuRef}
                        className="relative"
                        onMouseEnter={() => setProductMenuOpen(true)}
                        onMouseLeave={() => setProductMenuOpen(false)}
                      >
                        <button
                          type="button"
                          onClick={() => setProductMenuOpen(!productMenuOpen)}
                          className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                            isActive || productMenuOpen
                              ? "text-white bg-white/10 ring-1 ring-white/20 font-semibold shadow-xs"
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isActive || productMenuOpen
                                ? "text-cyan-400 scale-110"
                                : "text-slate-400"
                            }`}
                          />
                          <span>{item.name}</span>
                          <FiChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              productMenuOpen ? "rotate-180 text-cyan-400" : "text-slate-400"
                            }`}
                          />
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                              {item.badge}
                            </span>
                          )}
                        </button>

                        {/* Product Mega Dropdown Menu */}
                        {productMenuOpen && (
                          <div className="absolute top-full left-0 mt-2 w-[440px] rounded-2xl bg-[#0e0f14]/95 backdrop-blur-2xl border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-4 space-y-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 font-poppins">
                            {/* Section 1: Active Core & Developer Tools */}
                            <div>
                              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 px-2 flex items-center justify-between">
                                <span>Platform & Developers</span>
                                <span className="text-cyan-400 font-semibold">Available Now</span>
                              </div>

                              <div className="space-y-1">
                                {/* Autonomous Motion Agent */}
                                <Link
                                  href="/product"
                                  onClick={() => setProductMenuOpen(false)}
                                  className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shrink-0 group-hover:bg-cyan-500/25 transition-colors">
                                    <FiZap className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors font-comic">
                                        Autonomous Motion Agent
                                      </span>
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
                                        Core v4.2
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                                      Prompt-to-60FPS animation & procedural physics engine
                                    </p>
                                  </div>
                                </Link>

                                {/* API Keys & SDK Access */}
                                <Link
                                  href="/api-keys"
                                  onClick={() => setProductMenuOpen(false)}
                                  className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                                    <FiKey className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors font-comic">
                                        API Keys & Tokens
                                      </span>
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                                        REST & SDK
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                                      Generate secret tokens, streaming webhooks & render APIs
                                    </p>
                                  </div>
                                </Link>
                              </div>
                            </div>

                            {/* Section 2: Incoming Projects & Agent Labs */}
                            <div className="pt-2 border-t border-white/[0.08]">
                              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 px-2 flex items-center justify-between">
                                <span>Incoming Agent Labs</span>
                                <span className="text-purple-400 font-semibold">In Development</span>
                              </div>

                              <div className="space-y-1.5">
                                {/* Vector Morph Agent */}
                                <div className="flex items-start gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-400/25 flex items-center justify-center text-purple-400 shrink-0">
                                    <FiLayers className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-slate-200">
                                        Vector Morph Agent
                                      </span>
                                      <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.2 rounded">
                                        Coming Soon • Q4
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                      Autonomous kinetic SVG path morphing & logo rigs
                                    </p>
                                  </div>
                                </div>

                                {/* 3D Physics Rig Agent */}
                                <div className="flex items-start gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/25 flex items-center justify-center text-amber-400 shrink-0">
                                    <FiCpu className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-slate-200">
                                        3D Physics Rig Agent
                                      </span>
                                      <span className="text-[9px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded">
                                        Private Alpha
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                      Parametric spring-damper spider web & collision solver
                                    </p>
                                  </div>
                                </div>

                                {/* Voice2Motion Agent */}
                                <div className="flex items-start gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                  <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-400/25 flex items-center justify-center text-pink-400 shrink-0">
                                    <FiFilm className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-slate-200">
                                        Voice2Motion Agent
                                      </span>
                                      <span className="text-[9px] font-mono text-pink-300 bg-pink-500/20 px-1.5 py-0.2 rounded">
                                        In Dev
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                      Speech & beat-synced kinetic typography generator
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Section 3: Bottom Links */}
                            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between px-2 text-[11px]">
                              <Link
                                href="/product"
                                onClick={() => setProductMenuOpen(false)}
                                className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                              >
                                <span>Product Architecture</span>
                                <FiArrowRight className="w-3 h-3" />
                              </Link>
                              <Link
                                href="/explore"
                                onClick={() => setProductMenuOpen(false)}
                                className="text-slate-400 hover:text-white"
                              >
                                Explore Showcase →
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-white bg-white/10 ring-1 ring-white/20 font-semibold shadow-xs"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isActive
                            ? "text-cyan-400 scale-110"
                            : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                              {item.badge}
                            </span>
                      )}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3 font-poppins">
              {/* Quick Search Button (Desktop) */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 backdrop-blur-sm transition-colors cursor-pointer"
                title="Search (Quick shortcut)"
              >
                <FiSearch className="w-3.5 h-3.5 text-slate-400" />
                <span>Search...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white/10 rounded">
                  ⌘K
                </kbd>
              </button>

              <div className="hidden sm:block w-px h-5 bg-white/10 mx-1" />

              {/* Dynamic Auth Buttons: Log In / Register vs User Profile / Log Out */}
              <div className="hidden sm:flex items-center gap-2">
                {user ? (
                  <div className="flex items-center gap-2">
                    {/* User Pill */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>

                    {/* Centralized Log Out Trigger Button */}
                    <button
                      type="button"
                      onClick={logout}
                      className="group flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600/30 border border-rose-500/25 rounded-xl transition-all duration-200 cursor-pointer"
                      title="Log Out of Session"
                    >
                      <FiLogOut className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                      <span>Log out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FiLogIn className="w-4 h-4 text-slate-400" />
                      <span>Log in</span>
                    </Link>

                    <Link
                      href="/register"
                      className="group relative inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-900 rounded-lg bg-white hover:bg-slate-100 shadow-md shadow-black/20 transition-all duration-200 active:scale-[0.98]"
                    >
                      <span>Get Started</span>
                      <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-slate-900" />
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-200 hover:bg-white/10 focus:outline-none transition-colors cursor-pointer"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <FiX className="w-6 h-6 text-white transition-transform duration-200 rotate-90" />
                ) : (
                  <FiMenu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Search Drawer (Toggleable) */}
          {searchOpen && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="relative flex items-center font-poppins">
                <FiSearch className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search articles, docs, tools, projects..."
                  autoFocus
                  className="w-full pl-10 pr-10 py-2 text-sm bg-black/40 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 text-white placeholder-slate-400 backdrop-blur-md"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  ESC
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#121013]/95 backdrop-blur-2xl transition-all duration-300 font-poppins">
            <div className="max-w-7xl mx-auto px-4 pt-3 pb-6 space-y-2">
              {/* Mobile Search input */}
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(item.href);

                  // Mobile Accordion for Product
                  if (item.isDropdown) {
                    return (
                      <div key={item.name} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => setMobileProductExpanded(!mobileProductExpanded)}
                          className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "text-white bg-white/10 font-semibold"
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-cyan-400" />
                            <span>{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                {item.badge}
                              </span>
                            )}
                            <FiChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                mobileProductExpanded ? "rotate-180 text-cyan-400" : "text-slate-400"
                              }`}
                            />
                          </div>
                        </button>

                        {/* Mobile Sub-items */}
                        {mobileProductExpanded && (
                          <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-cyan-500/30 ml-4">
                            <Link
                              href="/product"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between py-2 text-xs text-slate-200 hover:text-white"
                            >
                              <div className="flex items-center gap-2">
                                <FiZap className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Autonomous Motion Agent</span>
                              </div>
                              <span className="text-[9px] font-mono text-cyan-400">Core</span>
                            </Link>

                            <Link
                              href="/api-keys"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between py-2 text-xs text-slate-200 hover:text-white"
                            >
                              <div className="flex items-center gap-2">
                                <FiKey className="w-3.5 h-3.5 text-emerald-400" />
                                <span>API Keys & Tokens</span>
                              </div>
                              <span className="text-[9px] font-mono text-emerald-400">SDK</span>
                            </Link>

                            <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                              Incoming Agents
                            </div>

                            <div className="flex items-center justify-between py-1.5 text-xs text-slate-400">
                              <span>Vector Morph Agent</span>
                              <span className="text-[9px] font-mono text-purple-400">Q4</span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 text-xs text-slate-400">
                              <span>3D Physics Rig Agent</span>
                              <span className="text-[9px] font-mono text-amber-400">Alpha</span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 text-xs text-slate-400">
                              <span>Voice2Motion Agent</span>
                              <span className="text-[9px] font-mono text-pink-400">In Dev</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "text-white bg-white/10 font-semibold"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Auth and Alert Section */}
              <div className="pt-4 mt-2 border-t border-white/10 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.04] rounded-xl border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center font-bold text-cyan-300">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-slate-200 border border-white/15 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <FiLogIn className="w-4 h-4" />
                      <span>Log in</span>
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-lg bg-white shadow-md transition-all"
                    >
                      <span>Get Started</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent page content from hiding behind fixed navbar */}
      <div className="h-16 sm:h-20 w-full" aria-hidden="true" />
    </>
  );
}
