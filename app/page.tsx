"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotebookShell from "./components/landing/NotebookShell";
import "./components/landing/landing.css";

const FOUR_SHOWCASE_PILLARS = [
  {
    id: "text-transition",
    num: "01 · TEXT & TRANSITIONS",
    tabLabel: "Text & Transitions",
    badge: "COLORFUL 60 FPS",
    title: "Text Animation & Transitions",
    desc: "Vibrant kinetic word pops, spring physics, and multi-color shutter & iris wipes.",
    src: "/text-transition-cool.html",
    ratio: "16:9" as const,
    prompt:
      "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
  },
  {
    id: "product-launch",
    num: "02 · PRODUCT LAUNCH",
    tabLabel: "Product Launch",
    badge: "SAAS TRAILER",
    title: "Product Launch Video",
    desc: "Multi-scene SaaS & app launch trailers with UI cards, live metrics, and CTA end-cards.",
    src: "/saas-product-launch.html",
    ratio: "16:9" as const,
    prompt:
      "Direct a multi-scene SaaS product launch trailer with isometric UI cards, +340% YoY telemetry bars, sub-8ms latency counter, and a bold CTA end-card.",
  },
  {
    id: "broll",
    num: "03 · ANIMATED B-ROLL",
    tabLabel: "Animated B-Roll",
    badge: "CUTAWAY CLIP",
    title: "Editorial & Creator B-Roll",
    desc: "Documentary highlight sweeps, animated data cutaways, and camera pans for YouTube.",
    src: "/broll-data-cutaway.html",
    ratio: "16:9" as const,
    prompt:
      "Create a 10-second animated B-roll cutaway panning across an archival print clipping with an electric lime marker sweep and live telemetry chart.",
  },
  {
    id: "faceless-video",
    num: "04 · FACELESS VIDEO",
    tabLabel: "Faceless Video",
    badge: "AUTO STORY",
    title: "Faceless Channel Video",
    desc: "Complete faceless storytelling scenes with synced word-by-word captions & visual hooks.",
    src: "/faceless-story-reel.html",
    ratio: "9:16" as const,
    prompt:
      "Generate a complete faceless storytelling video with automated visual B-roll scenes, chapter progression, and synchronized word-by-word kinetic captions.",
  },
] as const;

const BASE_W = 1280;

function HomeLiveReelThumb({ src, title }: { src: string; title: string }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth > 0) setScale(el.clientWidth / BASE_W);
    };
    update();
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) {
        setScale(entry.contentRect.width / BASE_W);
      }
    });
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="lp-tpl-live-viewport"
      style={{ borderBottom: "1px solid rgba(7, 20, 46, 0.28)" }}
    >
      {visible && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={() => setLoaded(true)}
          className="lp-tpl-live-iframe"
          style={{
            transform: `scale(${scale})`,
            opacity: loaded ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(FOUR_SHOWCASE_PILLARS[0].id);
  const [selectedRatio, setSelectedRatio] = useState<"16:9" | "9:16" | "RGBA">(
    "16:9"
  );
  const [prompt, setPrompt] = useState<string>(FOUR_SHOWCASE_PILLARS[0].prompt);

  const handleSelectPillar = (
    id: string,
    newPrompt: string,
    ratio: "16:9" | "9:16" | "RGBA" = "16:9"
  ) => {
    setActiveId(id);
    setPrompt(newPrompt);
    setSelectedRatio(ratio);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push(
      `/dashboard?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(
        selectedRatio
      )}`
    );
  };

  return (
    <NotebookShell ariaLabel="byreel.in studio for text animation & transitions, product launches, B-rolls, and faceless videos">
      <div className="lp-home-sections">
        {/* =====================================================================
            1. HERO STAGE + PROMPT COMPOSER
           ===================================================================== */}
        <div className="lp-hero-stage-wrap">
          <div className="lp-hero-block">
            <div className="lp-saas-eyebrow" style={{ marginBottom: 12 }}>
              <span className="lp-saas-eyebrow-dot" aria-hidden="true" />
              <span>
                TEXT &amp; TRANSITIONS · PRODUCT LAUNCH · ANIMATED B-ROLL · FACELESS VIDEO
              </span>
            </div>

            <h1 className="lp-editorial-heading">
              Turn plain prompts into{" "}
              <span className="lp-lime-highlight">
                motion, launches &amp; faceless videos.
              </span>
            </h1>

            <form onSubmit={handleSubmit} className="lp-clean-prompt-box">
              {/* 4 Mode Tabs + Output Ratio Selector */}
              <div className="lp-composer-mode-bar">
                <div
                  className="lp-composer-modes"
                  role="tablist"
                  aria-label="Production format"
                >
                  {FOUR_SHOWCASE_PILLARS.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() =>
                          handleSelectPillar(item.id, item.prompt, item.ratio)
                        }
                        className={`lp-composer-mode-btn ${
                          isActive ? "is-active" : ""
                        }`}
                      >
                        {item.tabLabel}
                      </button>
                    );
                  })}
                </div>

                <div
                  className="lp-composer-specs-right"
                  role="group"
                  aria-label="Output aspect ratio"
                >
                  {(["16:9", "9:16", "RGBA"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRatio(r)}
                      className={`lp-composer-ratio-pill ${
                        selectedRatio === r ? "is-active" : ""
                      }`}
                    >
                      {r === "RGBA" ? "RGBA Alpha" : r}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your colorful text animation & transition, product launch video, B-roll cutaway, or faceless video..."
                className="lp-clean-textarea"
              />

              <div className="lp-prompt-footer-bar">
                <span className="lp-pen-hint">
                  Exports 1080p &amp; 4K 60fps .MP4 or transparent RGBA .WebM
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Link href="/templates" className="lp-tpl-inspect-btn">
                    Templates
                  </Link>
                  <button type="submit" className="lp-clean-submit-btn">
                    <span>Generate Video</span>
                    <span className="lp-btn-arrow">→</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* =====================================================================
            2. THE FOUR CORE SHOWCASES (Text & Transition · Product Launch · B-Roll · Faceless Video)
           ===================================================================== */}
        <section aria-label="Four core studio showcases" style={{ width: "100%" }}>
          <div className="lp-home-live-grid">
            {FOUR_SHOWCASE_PILLARS.map((item) => {
              const isSelected = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleSelectPillar(item.id, item.prompt, item.ratio)
                  }
                  className={`lp-home-live-card ${
                    isSelected ? "is-active" : ""
                  }`}
                >
                  <div className="lp-home-live-top">
                    <span className="lp-home-live-num">{item.num}</span>
                    <span className="lp-home-live-badge">{item.badge}</span>
                  </div>

                  <HomeLiveReelThumb src={item.src} title={item.title} />

                  <div className="lp-home-live-foot">
                    <span className="lp-home-live-name">{item.title}</span>
                    <span className="lp-home-live-desc">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </NotebookShell>
  );
}
