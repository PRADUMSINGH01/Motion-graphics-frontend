"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { LogoLockup } from "./LandingLogo";

const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const NAV: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "#studio",
    label: "Studio",
    icon: (
      <svg {...iconProps}>
        <rect x="2.5" y="4" width="15" height="12" rx="2.5" />
        <path d="M8.5 7.8v4.4l3.6-2.2-3.6-2.2z" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "#how",
    label: "How it works",
    icon: (
      <svg {...iconProps}>
        <path d="M3 5h14M3 10h10M3 15h6" />
      </svg>
    ),
  },
  {
    href: "#features",
    label: "Features",
    icon: (
      <svg {...iconProps}>
        <path d="M10 2.5l1.7 4.3 4.3 1.7-4.3 1.7L10 14.5l-1.7-4.3L4 8.5l4.3-1.7L10 2.5z" />
      </svg>
    ),
  },
  {
    href: "#pricing",
    label: "Pricing",
    icon: (
      <svg {...iconProps}>
        <path d="M3 10.2V4.5A1.5 1.5 0 0 1 4.5 3h5.7l6.3 6.3a1.5 1.5 0 0 1 0 2.1l-5.1 5.1a1.5 1.5 0 0 1-2.1 0L3 10.2z" />
        <circle cx="7" cy="7" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export default function LandingNav() {
  const { user } = useAuth();

  return (
    <header style={{ borderBottom: "1px solid var(--lp-rule)" }}>
      <div className="lp-wrap lp-nav-grid grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-[14px]">
        <nav
          aria-label="Main"
          className="lp-nav-left flex flex-wrap gap-0.5 justify-self-start rounded-full border p-1"
          style={{ borderColor: "var(--lp-rule)", background: "var(--lp-paper-2)" }}
        >
          {NAV.map(({ href, label, icon }) => (
            <a key={href} href={href} className="lp-nav-pill">
              {icon}
              {label}
            </a>
          ))}
        </nav>

        <Link href="/" aria-label="byreel home" className="lp-nav-logo flex min-h-[44px] items-center">
          <LogoLockup height={42} priority />
        </Link>

        <div className="lp-nav-right flex items-center gap-1.5 justify-self-end">
          {!user && (
            <Link href="/login" className="lp-nav-pill">
              <svg {...iconProps}>
                <circle cx="10" cy="7" r="3.2" />
                <path d="M3.8 16.5c.8-3 3.2-4.5 6.2-4.5s5.4 1.5 6.2 4.5" />
              </svg>
              Log in
            </Link>
          )}
          <Link
            href={user ? "/workspace" : "/register"}
            className="lp-btn-ink inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
            style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
          >
            {user ? "Open studio" : "Start free"} <span className="lp-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
