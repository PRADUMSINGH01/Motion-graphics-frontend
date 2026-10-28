"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./landing.css";

export const MARGIN_NOTES = [
  { num: "00", label: "Home", href: "/" },
  { num: "01", label: "Studio", href: "/dashboard" },
  { num: "02", label: "Templates", href: "/templates" },
  { num: "03", label: "Price", href: "/pricing" },
  { num: "04", label: "Login", href: "/login" },
  { num: "05", label: "Register", href: "/register" },
];

const MAIN_LETTERS = ["b", "y", "r", "e", "e", "l"];

interface NotebookShellProps {
  children: React.ReactNode;
  ariaLabel?: string;
}

export default function NotebookShell({
  children,
  ariaLabel = "byreel.in notebook studio",
}: NotebookShellProps) {
  const pathname = usePathname();

  return (
    <main className="lp-crisp-paper" aria-label={ariaLabel}>
      {/* Layer 1: Crisp Notebook Horizontal Ruled Lines */}
      <div className="lp-notebook-rules" aria-hidden="true" />

      {/* Layer 2: Left-Side Double Vertical Blue Margin Lines */}
      <div className="lp-notebook-blue-margins" aria-hidden="true" />

      {/* Layer 3: Subtle Sheet Vignette */}
      <div className="lp-paper-vignette" aria-hidden="true" />

      {/* =====================================================================
          LEFT-MARGIN HANDWRITTEN PEN SIDEBAR (Behind the Double Blue Lines)
         ===================================================================== */}
      <aside className="lp-margin-sidebar" aria-label="Notebook margin navigation">
        <div className="lp-margin-header">INDEX</div>
        <nav className="lp-margin-nav">
          {MARGIN_NOTES.map((item, idx) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`lp-pen-link ${isActive ? "is-active" : ""}`}
                style={{ "--line-idx": idx } as React.CSSProperties}
              >
                <span className="lp-pen-num">{item.num}.</span>
                <span className="lp-pen-word">
                  {item.label}
                  <svg
                    viewBox="0 0 110 12"
                    className="lp-pen-stroke-svg"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2 7 C 32 3, 74 9, 108 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* =====================================================================
          TOP-CENTER FLAT 2D MOTION GRAPHICS LOGO LOCKUP: byreel.in
         ===================================================================== */}
      <header className="lp-top-center-header">
        <Link
          href="/"
          className="lp-motion-logo"
          aria-label="byreel.in — ideas in motion"
          style={{ textDecoration: "none" }}
        >
          <div className="lp-ribbon-mark">
            <Image
              src="/byreel-mark.png"
              alt="byreel mark"
              width={46}
              height={46}
              priority
              className="lp-ribbon-img"
            />
          </div>

          <div className="lp-wordmark-stack">
            <div className="lp-wordmark-row">
              <span className="lp-wordmark-main" aria-hidden="true">
                {MAIN_LETTERS.map((char, i) => (
                  <span
                    key={i}
                    className="lp-glyph-clip"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="lp-glyph">{char}</span>
                  </span>
                ))}
              </span>

              <span className="lp-tld-group" aria-hidden="true">
                <span className="lp-tld-dot" />
                <span className="lp-glyph-clip" style={{ "--i": 6 } as React.CSSProperties}>
                  <span className="lp-glyph">i</span>
                </span>
                <span className="lp-glyph-clip" style={{ "--i": 7 } as React.CSSProperties}>
                  <span className="lp-glyph">n</span>
                </span>
              </span>
            </div>

            <div className="lp-subcaption-row" aria-hidden="true">
              <span className="lp-subcaption-text">IDEAS IN MOTION</span>
            </div>
          </div>
        </Link>
      </header>

      {/* =====================================================================
          RIGHT-SIDE NOTEBOOK WORKSPACE + SIMPLE PROFESSIONAL FOOTER
         ===================================================================== */}
      <section className="lp-right-workspace">
        {children}

        <footer className="lp-notebook-footer" aria-label="Site footer">
          <div className="lp-notebook-footer-inner">
            <div className="lp-footer-brand-group">
              <span className="lp-footer-brand">byreel.in</span>
              <span className="lp-footer-sep" aria-hidden="true">·</span>
              <span className="lp-footer-copy">
                © {new Date().getFullYear()} byreel.in — Ideas in Motion
              </span>
            </div>

            <nav className="lp-footer-links" aria-label="Footer navigation">
              <Link href="/dashboard" className="lp-footer-link">
                Studio
              </Link>
              <Link href="/templates" className="lp-footer-link">
                Templates
              </Link>
              <Link href="/pricing" className="lp-footer-link">
                Pricing
              </Link>
              <Link href="/login" className="lp-footer-link">
                Login
              </Link>
              <Link href="/register" className="lp-footer-link">
                Register
              </Link>
              <Link href="/privacy" className="lp-footer-link">
                Privacy
              </Link>
              <Link href="/terms" className="lp-footer-link">
                Terms
              </Link>
            </nav>
          </div>
        </footer>
      </section>
    </main>
  );
}

