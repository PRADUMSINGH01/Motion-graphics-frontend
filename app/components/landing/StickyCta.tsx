"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LogoMark } from "./LandingLogo";

/**
 * Floating call to action. Shown once the hero (#top) has scrolled away. Hidden again while
 * the trailer (#trailer) or the final CTA (#start) is on screen, so it never covers the video
 * or duplicates a visible form.
 */
export default function StickyCta() {
  const { user } = useAuth();
  const [heroVisible, setHeroVisible] = useState(true);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [trailerVisible, setTrailerVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const cta = document.getElementById("start");
    const trailer = document.getElementById("trailer");
    if (!hero || !cta) return;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === cta) setCtaVisible(e.isIntersecting);
        if (e.target === trailer) setTrailerVisible(e.isIntersecting);
      }
    });
    io.observe(hero);
    io.observe(cta);
    if (trailer) io.observe(trailer); // keep the bar off the video frame
    return () => io.disconnect();
  }, []);

  const shown = !heroVisible && !ctaVisible && !trailerVisible;

  return (
    <div
      role="region"
      aria-label="Get started"
      inert={!shown}
      className={`lp-sticky ${shown ? "is-shown" : ""}`}
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#1C1C1A] max-sm:hidden">
        <LogoMark on="dark" style={{ width: 22, height: 22 }} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[14px]">
        <span className="font-semibold">Your first launch video is free.</span>
        <span className="text-[#A8A59C] max-md:hidden"> No credit card needed.</span>
      </span>
      <a href="#pricing" className="lp-link-u flex-none px-2 text-[14px] text-[#C9C6BD] max-sm:hidden">
        Pricing
      </a>
      <Link
        href={user ? "/workspace" : "/register"}
        className="lp-btn-accent lp-shine inline-flex min-h-[40px] flex-none items-center gap-2 rounded-full px-[18px] text-[14px] font-semibold"
        style={{ background: "var(--lp-accent)", color: "#fff" }}
      >
        {user ? "Open studio" : "Start free"} <span className="lp-arrow" aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
