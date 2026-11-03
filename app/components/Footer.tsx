"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ByreelLogo } from "./landing/ByreelBrand";

// The studio and every page drawn in the notebook shell (which ends on its own footer row) skip this one.
const EXCLUDED_ROUTES = [
  "/",
  "/templates",
  "/pricing",
  "/login",
  "/register",
  "/about",
  "/terms",
  "/policy",
  "/privacy",
  "/dashboard",
  "/workspace",
  "/auth",
];

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Studio", href: "/dashboard" },
      { label: "Product launch", href: "/dashboard?section=product-launch" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API keys", href: "/api-keys" },
      { label: "Billing", href: "/billing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact support", href: "mailto:support@byreel.in", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/policy" },
    ],
  },
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
              Describe a video in plain words. byreel plans the scenes, animates them and renders the MP4.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-ink-111110 mb-4">
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
          <span>© {new Date().getFullYear()} byreel</span>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
