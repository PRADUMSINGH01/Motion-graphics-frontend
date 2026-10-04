"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { IconGithub, IconTwitter, IconYoutube, IconLinkedin } from "./Icons";

// The landing page ("/") ships its own footer.
const EXCLUDED_ROUTES = ["/", "/login", "/register", "/workspace", "/dashboard"];

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Motion Studio", href: "/workspace" },
      { label: "Templates", href: "/explore" },
      { label: "Pricing", href: "/pricing" },
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
      { label: "Contact", href: "mailto:support@byreel.ai", external: true },
      { label: "Press kit", href: "/about" },
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
    <footer className="w-full border-t border-line bg-canvas-subtle">
      <div className="container-page pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" aria-label="byreel home" className="inline-flex">
              <Logo size={28} />
            </Link>
            <p className="text-sm text-fg-muted leading-relaxed max-w-xs">
              The AI agent that turns plain-language prompts into broadcast-grade motion graphics.
            </p>
            <div className="flex items-center gap-1 -ml-2">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-md text-fg-subtle hover:text-fg hover:bg-fg/5 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-medium text-fg mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} className="text-[13.5px] text-fg-muted hover:text-fg transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-[13.5px] text-fg-muted hover:text-fg transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-line flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-[13px] text-fg-subtle">
          <span>© {new Date().getFullYear()} byreel Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              All systems operational
            </span>
            <ThemeToggle variant="studio" showLabel />
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
