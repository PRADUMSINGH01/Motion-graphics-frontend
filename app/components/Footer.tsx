"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ByreelLogo } from "./landing/ByreelBrand";
import ThemeToggle from "./ThemeToggle";
import { IconGithub, IconTwitter, IconYoutube, IconLinkedin } from "./Icons";

// The landing page ("/") and studio dashboard ship their own chrome.
const EXCLUDED_ROUTES = [
  "/",
  "/templates",
  "/pricing",
  "/login",
  "/register",
  "/loading",
  "/dashboard",
  "/workspace",
];

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Studio & Products",
    links: [
      { label: "Product Launch Studio", href: "/dashboard?section=product-launch" },
      { label: "Motion Studio", href: "/dashboard" },
      { label: "Templates Library", href: "/templates" },
      { label: "Pricing & Plans", href: "/pricing" },
      { label: "FAQ", href: "/pricing#pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API keys", href: "/api-keys" },
      { label: "Usage & limits", href: "/data-usage" },
      { label: "Billing", href: "/billing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact Support", href: "mailto:support@byreel.ai", external: true },
      { label: "Media Kit", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/policy" },
      { label: "Acceptable Use", href: "/policy" },
    ],
  },
];

const SOCIAL = [
  { label: "GitHub", href: "https://github.com", icon: IconGithub },
  { label: "X / Twitter", href: "https://twitter.com", icon: IconTwitter },
  { label: "YouTube", href: "https://youtube.com", icon: IconYoutube },
  { label: "LinkedIn", href: "https://linkedin.com", icon: IconLinkedin },
];

export const Footer = memo(function Footer() {
  const pathname = usePathname();

  const isExcluded = pathname
    ? EXCLUDED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
    : false;

  if (isExcluded) {
    return null;
  }

  return (
    <footer className="w-full border-t border-surf-dedad0 bg-surf-faf9f5 text-ink-111110">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" aria-label="byreel home" className="inline-flex">
              <ByreelLogo size={28} theme="light" />
            </Link>
            <p className="text-[13.5px] text-ink-717069 leading-relaxed max-w-xs">
              The autonomous AI agent that turns plain-language prompts into broadcast-grade 60 FPS motion graphics.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-xl border border-surf-dedad0 bg-surf-ffffff text-ink-55544e hover:border-surf-111110 hover:text-ink-111110 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-ink-111110 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-[13.5px] text-ink-717069 hover:text-ink-111110 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-ink-717069 hover:text-ink-111110 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-surf-dedad0 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-[12.5px] text-ink-8c8980">
          <span>© {new Date().getFullYear()} Byreel Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 font-mono text-[11.5px] text-ink-658b02">
              <span className="w-2 h-2 rounded-full bg-surf-c5ef26 animate-pulse" />
              All systems 60 FPS operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
