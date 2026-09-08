"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiZap,
  FiLayers,
  FiFileText,
  FiShield,
  FiDatabase,
  FiArrowUpRight,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiCheckCircle,
} from "react-icons/fi";
import Logo from "./Logo";

const EXCLUDED_ROUTES = ["/login", "/register", "/workspace"];

export default function Footer() {
  const pathname = usePathname();

  const isExcluded = pathname
    ? EXCLUDED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
    : false;

  if (isExcluded) {
    return null;
  }

  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 bg-slate-100/90 dark:bg-[#0c0d12]/90 backdrop-blur-2xl text-slate-600 dark:text-slate-400 font-poppins relative z-20">
      {/* Top minimal status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              Animagent Engine v4.2 Operational
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-slate-500 dark:text-slate-400">99.98% GPU Cluster Uptime</span>
          </div>

          {/* Social and quick contacts */}
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
              aria-label="Twitter"
            >
              <FiTwitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
              aria-label="YouTube"
            >
              <FiYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <Logo size={32} showText={true} />
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Autonomous motion graphics agent generating broadcast-ready animation, SVG paths, and WebM renders directly from natural language prompts.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <FiCheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Full commercial output rights on all plans</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white font-sans uppercase tracking-wider">
              Product
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <FiZap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Motion Studio</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <FiLayers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Explore Presets</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace?tab=vectorizer"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <span>Vectorizer Tool</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <span>Architecture & Specs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white font-sans uppercase tracking-wider">
              Developers
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/api-keys"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <span>API Keys</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <span>Compute & Pricing</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <span>About Animagent</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white font-sans uppercase tracking-wider">
              Legal & Trust
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <FiFileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <FiShield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/data-usage"
                  className="inline-flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <FiDatabase className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Data Usage & AI</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} Animagent AI Inc. Built for creative developers and motion designers.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/policy"
              className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/data-usage"
              className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              Data Usage
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
