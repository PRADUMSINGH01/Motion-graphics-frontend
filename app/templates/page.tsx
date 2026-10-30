"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotebookShell from "../components/landing/NotebookShell";

type TemplateCategory =
  | "All reels"
  | "Product launch"
  | "Animated B-rolls"
  | "Motion graphics"
  | "Vertical 9:16 shorts";

type AspectFilter = "All" | "16:9" | "9:16";

interface SceneBeat {
  time: string;
  text: string;
}

interface LiveStudioTemplate {
  id: string;
  src: string;
  category: Exclude<TemplateCategory, "All reels">;
  title: string;
  shortLabel: string;
  ratio: "16:9" | "9:16";
  duration: string;
  nleReady: string;
  prompt: string;
  beats: SceneBeat[];
}

const TEMPLATES: LiveStudioTemplate[] = [
  {
    id: "text-transition-cool",
    src: "/text-transition-cool.html",
    category: "Motion graphics",
    title: "Colorful Kinetic Text & Wipe Transitions",
    shortLabel: "01 · Text & Transitions",
    ratio: "16:9",
    duration: "15s · 60fps",
    nleReady: "16:9 & RGBA Alpha",
    prompt:
      "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
    beats: [
      { time: "00:00–00:03", text: "Colorful kinetic word chips pop with spring physics" },
      { time: "00:03–00:06", text: "Multi-color diagonal shutter wipe & iris portal reveal" },
      { time: "00:06–00:09", text: "Counter-sliding full-spectrum kinetic ribbons" },
    ],
  },
  {
    id: "saas-product-launch",
    src: "/saas-product-launch.html",
    category: "Product launch",
    title: "SaaS 3.0 Flagship Launch Trailer",
    shortLabel: "02 · Product Launch",
    ratio: "16:9",
    duration: "30s · 60fps",
    nleReady: "4K MP4 & WebM",
    prompt:
      "Keynote SaaS product launch trailer with 3D glass telemetry dashboard, rising +340% YoY benchmark bars, sub-8ms latency counter, and bold CTA.",
    beats: [
      { time: "00:00–00:08", text: "Keynote headline reveal over perspective grid" },
      { time: "00:08–00:20", text: "Isometric glass UI & rising +340% YoY telemetry bars" },
      { time: "00:20–00:30", text: "7.4ms latency proof & deploy CTA lockup" },
    ],
  },
  {
    id: "broll-data-cutaway",
    src: "/broll-data-cutaway.html",
    category: "Animated B-rolls",
    title: "Vox-Style Archival Highlight Cutaway",
    shortLabel: "03 · Animated B-Roll",
    ratio: "16:9",
    duration: "12s · 60fps",
    nleReady: "Premiere & DaVinci",
    prompt:
      "Vox-style documentary B-roll panning across an archival print clipping with an animated electric lime marker sweep and source citation.",
    beats: [
      { time: "00:00–00:03", text: "Smooth camera pan onto archival newspaper clipping" },
      { time: "00:03–00:08", text: "Electric lime marker sweep across key quote" },
      { time: "00:08–00:12", text: "Source masthead & exhibit citation stamp" },
    ],
  },
  {
    id: "faceless-story-reel",
    src: "/faceless-story-reel.html",
    category: "Vertical 9:16 shorts",
    title: "Faceless Channel Story & Caption Engine",
    shortLabel: "04 · Faceless Video",
    ratio: "9:16",
    duration: "20s · 60fps",
    nleReady: "YouTube & Reels",
    prompt:
      "Generate a complete faceless storytelling video with automated visual B-roll scenes, chapter progression, and synchronized word-by-word kinetic captions.",
    beats: [
      { time: "00:00–00:05", text: "Chapter 01 visual hook & retention graph reveal" },
      { time: "00:05–00:13", text: "Automated scene B-roll nodes & telemetry proof" },
      { time: "00:13–00:20", text: "Synchronized voiceover wave & word-by-word captions" },
    ],
  },
  {
    id: "split-screen-attention",
    src: "/split-screen-attention.html",
    category: "Animated B-rolls",
    title: "Attention Split Documentary B-Roll",
    shortLabel: "Attention Split",
    ratio: "16:9",
    duration: "20s · 60fps",
    nleReady: "YouTube Essays",
    prompt:
      "Split-screen documentary B-roll contrasting monochrome analog deep work on the left against a saturated high-velocity social feed on the right.",
    beats: [
      { time: "00:00–00:06", text: "Monochrome film-grain reader scene establishes" },
      { time: "00:06–00:14", text: "Center divider splits to saturated mobile feed" },
      { time: "00:14–00:20", text: "Dual-stage contrast caption reveal" },
    ],
  },
  {
    id: "neon-host-neuron",
    src: "/neon-host-neuron.html",
    category: "Animated B-rolls",
    title: "3D Neon Callout → Neural Synapse Cutaway",
    shortLabel: "Neon → Neuron",
    ratio: "16:9",
    duration: "15s · 60fps",
    nleReady: "MP4 & WebM",
    prompt:
      "3D perspective neon callout card beside the speaker that transitions into a glowing synaptic neuron firing across the axon.",
    beats: [
      { time: "00:00–00:05", text: "3D neon callout box pops in beside speaker" },
      { time: "00:05–00:10", text: "Camera zooms into neural dendrite network" },
      { time: "00:10–00:15", text: "Glowing impulse travels axon with particle burst" },
    ],
  },
  {
    id: "aggressive-zoom-flashcuts",
    src: "/aggressive-zoom-flashcuts.html",
    category: "Vertical 9:16 shorts",
    title: "Flash-Cut Zoom & Beat Montage",
    shortLabel: "Flash-Cut Zoom",
    ratio: "9:16",
    duration: "15s · 60fps",
    nleReady: "Reels & Shorts",
    prompt:
      "Aggressive camera zoom punches with high-contrast flash cuts, scanline texture, and bold impact labels on every beat.",
    beats: [
      { time: "00:00–00:04", text: "Rapid camera push-in with keylight shift" },
      { time: "00:04–00:10", text: "Beat-synced full-frame graphic flash cuts" },
      { time: "00:10–00:15", text: "Scanline overlay & timecode lockup" },
    ],
  },
  {
    id: "host-intro-text",
    src: "/host-intro-text.html",
    category: "Motion graphics",
    title: "Bold Kinetic Creator Intro",
    shortLabel: "Creator Intro",
    ratio: "16:9",
    duration: "10s · 60fps",
    nleReady: "16:9 & 9:16",
    prompt:
      "Low-key creator silhouette with lens-glint eyes and giant stacked kinetic typography slamming into frame with subtle camera shake.",
    beats: [
      { time: "00:00–00:03", text: "Low-key studio silhouette & eye lens glint" },
      { time: "00:03–00:07", text: "Heavy stacked title cards slam into place" },
      { time: "00:07–00:10", text: "Camera micro-shake & vignette settle" },
    ],
  },
  {
    id: "feed-scroll-macro",
    src: "/feed-scroll-macro.html",
    category: "Vertical 9:16 shorts",
    title: "Macro POV — Thumb Scrolling Feed",
    shortLabel: "Macro Feed Scroll",
    ratio: "9:16",
    duration: "15s · 60fps",
    nleReady: "9:16 Vertical",
    prompt:
      "Handheld macro POV shot of a smartphone feed scrolling rapidly with jump-cut flashes and kinetic retention hooks.",
    beats: [
      { time: "00:00–00:04", text: "Jump-cut flash into macro phone viewport" },
      { time: "00:04–00:11", text: "Rapid thumb-scroll feed cards with camera shake" },
      { time: "00:11–00:15", text: "Pattern-interrupt hook card freeze" },
    ],
  },
  {
    id: "flash-cut-broadcast",
    src: "/flash-cut-broadcast.html",
    category: "Motion graphics",
    title: "Broadcast Lower-Third & Flash Cut",
    shortLabel: "Broadcast Cut",
    ratio: "16:9",
    duration: "15s · 60fps",
    nleReady: "Broadcast 60fps",
    prompt:
      "Skewed broadcast news lower-third title bar over studio lighting followed by rapid full-screen editorial flash cuts.",
    beats: [
      { time: "00:00–00:05", text: "Studio keylight & skewed lower-third bar slide" },
      { time: "00:05–00:11", text: "Rapid full-frame editorial cutaways" },
      { time: "00:11–00:15", text: "Return to host stage with sub-caption" },
    ],
  },
  {
    id: "phone-toss-clock",
    src: "/phone-toss-clock.html",
    category: "Vertical 9:16 shorts",
    title: "Phone Toss → Ticking Clock Hook",
    shortLabel: "Phone Toss Hook",
    ratio: "9:16",
    duration: "12s · 60fps",
    nleReady: "Reels, Shorts & X",
    prompt:
      "A smartphone gets tossed out of frame with motion blur, hard-cutting to a high-contrast ticking analog clock.",
    beats: [
      { time: "00:00–00:04", text: "Lockscreen time glow & hand grip" },
      { time: "00:04–00:07", text: "Phone tossed upward with impact flash cut" },
      { time: "00:07–00:12", text: "High-contrast analog clock second-hand tick" },
    ],
  },
  {
    id: "host-dark-text",
    src: "/host-dark-text.html",
    category: "Product launch",
    title: "Keynote Dark Headline Reveal",
    shortLabel: "Keynote Teaser",
    ratio: "16:9",
    duration: "12s · 60fps",
    nleReady: "4K Keynote MP4",
    prompt:
      "Dramatic low-light keynote teaser where bold word-by-word typography ('WE NEED TO TALK.') emerges over a spotlighted stage.",
    beats: [
      { time: "00:00–00:04", text: "Spotlight silhouette fade-in from obsidian" },
      { time: "00:04–00:09", text: "Word-by-word display headline reveal" },
      { time: "00:09–00:12", text: "Wide-tracked subtitle fade & hold" },
    ],
  },
];

const QUICK_STAGE_IDS = [
  "text-transition-cool",
  "saas-product-launch",
  "broll-data-cutaway",
  "faceless-story-reel",
];

const CATEGORY_TABS: TemplateCategory[] = [
  "All reels",
  "Product launch",
  "Animated B-rolls",
  "Motion graphics",
  "Vertical 9:16 shorts",
];

const RATIO_FILTERS: { id: AspectFilter; label: string }[] = [
  { id: "All", label: "All ratios" },
  { id: "16:9", label: "16:9" },
  { id: "9:16", label: "9:16" },
];

const BASE_W = 1280;

/**
 * Renders a real 1280x720 60fps composition scaled smoothly to fit its container.
 */
function LiveScaledStage({
  src,
  title,
  category,
  duration,
  hoverLabel,
  onClick,
}: {
  src: string;
  title: string;
  category?: string;
  duration?: string;
  hoverLabel?: string;
  onClick?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.3);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      if (el.clientWidth > 0) {
        setScale(el.clientWidth / BASE_W);
      }
    };
    updateScale();

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
      { rootMargin: "260px" }
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="lp-tpl-live-viewport"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {category && duration && (
        <div className="lp-tpl-live-top-hud">
          <span className="lp-tpl-hud-pill">
            <span className="lp-tpl-hud-dot" />
            <span>{category}</span>
          </span>
          <span className="lp-tpl-hud-spec">{duration}</span>
        </div>
      )}

      {visible && (
        <iframe
          key={src}
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

      {onClick && hoverLabel && (
        <div className="lp-tpl-live-hover-mask">
          <span className="lp-tpl-expand-pill">{hoverLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [stageTemplate, setStageTemplate] = useState<LiveStudioTemplate>(
    TEMPLATES[0]
  );
  const [stagePrompt, setStagePrompt] = useState<string>(TEMPLATES[0].prompt);
  const [copiedStage, setCopiedStage] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] =
    useState<TemplateCategory>("All reels");
  const [selectedRatio, setSelectedRatio] = useState<AspectFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoryCounts = useMemo(() => {
    const counts: Record<TemplateCategory, number> = {
      "All reels": TEMPLATES.length,
      "Product launch": 0,
      "Animated B-rolls": 0,
      "Motion graphics": 0,
      "Vertical 9:16 shorts": 0,
    };
    for (const tpl of TEMPLATES) {
      counts[tpl.category] += 1;
    }
    return counts;
  }, []);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tpl) => {
      if (
        selectedCategory !== "All reels" &&
        tpl.category !== selectedCategory
      ) {
        return false;
      }
      if (selectedRatio !== "All" && tpl.ratio !== selectedRatio) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = tpl.title.toLowerCase().includes(q);
        const matchCat = tpl.category.toLowerCase().includes(q);
        const matchPrompt = tpl.prompt.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchPrompt) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedRatio, searchQuery]);

  const handleSelectForStage = (
    tpl: LiveStudioTemplate,
    scrollToTop = false
  ) => {
    setStageTemplate(tpl);
    setStagePrompt(tpl.prompt);
    setCopiedStage(false);
    if (scrollToTop && stageRef.current) {
      stageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleOpenInStudio = (promptText: string, templateId: string) => {
    router.push(
      `/dashboard?prompt=${encodeURIComponent(
        promptText
      )}&template=${encodeURIComponent(templateId)}`
    );
  };

  const handleCopyStagePrompt = () => {
    navigator.clipboard?.writeText(stagePrompt);
    setCopiedStage(true);
    setTimeout(() => setCopiedStage(false), 1800);
  };

  const quickStageReels = useMemo(
    () =>
      QUICK_STAGE_IDS.map(
        (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0]
      ),
    []
  );

  return (
    <NotebookShell ariaLabel="byreel.in studio templates and screening room">
      <div className="lp-templates-wrap" ref={stageRef}>
        {/* 1. Editorial Page Heading */}
        <header className="lp-tpl-top-intro">
          <div>
            <h1 className="lp-tpl-headline">
              Director&rsquo;s screening room &amp; templates.
            </h1>
            <p className="lp-tpl-sub">
              Every reel on this sheet is a live 60fps render compiled from a
              single prompt. Load any template onto the screening monitor to
              inspect its scene beats, edit the prompt, and open it in the
              Studio.
            </p>
          </div>
        </header>

        {/* 2. Interactive Director's Screening Stage (Live Monitor + Notebook Inspector) */}
        <section
          className="lp-director-deck"
          aria-label="Active template screening stage"
        >
          {/* Left: Live 60fps Screening Monitor + 4-Reel Quick Switcher */}
          <div className="lp-director-monitor-col">
            <div className="lp-director-monitor-frame">
              <LiveScaledStage
                src={stageTemplate.src}
                title={stageTemplate.title}
                category={stageTemplate.category}
                duration={`${stageTemplate.ratio} · ${stageTemplate.duration}`}
              />
            </div>

            <div
              className="lp-stage-quick-bar"
              role="tablist"
              aria-label="Featured screening reels"
            >
              {quickStageReels.map((item) => {
                const isCurrent = stageTemplate.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => handleSelectForStage(item, false)}
                    className={`lp-stage-quick-btn ${
                      isCurrent ? "is-active" : ""
                    }`}
                  >
                    <span className="lp-stage-quick-cat">{item.category}</span>
                    <span className="lp-stage-quick-name">
                      {item.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Transparent Notebook Director's Sheet */}
          <div className="lp-director-sheet-col">
            <div className="lp-director-sheet-top">
              <div className="lp-director-meta-row">
                <span className="lp-director-live-tag">
                  <span className="lp-tpl-hud-dot" />
                  <span>Now screening</span>
                </span>
                <span className="lp-director-spec-tag">
                  {stageTemplate.ratio} · {stageTemplate.nleReady}
                </span>
              </div>

              <h2 className="lp-director-title">{stageTemplate.title}</h2>

              {/* 3-Beat Scene Breakdown */}
              <div className="lp-beat-list" aria-label="Scene breakdown">
                {stageTemplate.beats.map((b) => (
                  <div key={b.time} className="lp-beat-row">
                    <span className="lp-beat-time">{b.time}</span>
                    <span className="lp-beat-text">{b.text}</span>
                  </div>
                ))}
              </div>

              {/* Editable Director Prompt */}
              <div className="lp-director-prompt-box">
                <div className="lp-director-prompt-head">
                  <label
                    htmlFor="stage-prompt-input"
                    className="lp-director-prompt-lbl"
                  >
                    Director prompt (editable)
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyStagePrompt}
                    className="lp-director-copy-btn"
                  >
                    {copiedStage ? "Copied to clipboard" : "Copy prompt"}
                  </button>
                </div>
                <textarea
                  id="stage-prompt-input"
                  rows={3}
                  value={stagePrompt}
                  onChange={(e) => setStagePrompt(e.target.value)}
                  className="lp-director-textarea"
                />
              </div>
            </div>

            <div className="lp-director-cta-row">
              <button
                type="button"
                onClick={() =>
                  handleOpenInStudio(
                    stagePrompt.trim() || stageTemplate.prompt,
                    stageTemplate.id
                  )
                }
                className="lp-director-launch-btn"
              >
                <span>Open in Studio with this prompt</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Filter & Search Ledger Bar */}
        <div className="lp-tpl-controls-bar">
          <div
            className="lp-tpl-cat-tabs"
            role="tablist"
            aria-label="Filter templates by category"
          >
            {CATEGORY_TABS.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`lp-tpl-cat-btn ${active ? "is-active" : ""}`}
                >
                  <span>{cat}</span>
                  <span className="lp-tpl-cat-count">
                    {categoryCounts[cat]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lp-tpl-right-filters">
            <div
              className="lp-tpl-ratio-group"
              role="group"
              aria-label="Filter by aspect ratio"
            >
              {RATIO_FILTERS.map((rf) => (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setSelectedRatio(rf.id)}
                  className={`lp-tpl-ratio-btn ${
                    selectedRatio === rf.id ? "is-active" : ""
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>

            <div className="lp-tpl-search-wrap">
              <span className="lp-tpl-search-icon" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reels..."
                aria-label="Search templates"
                className="lp-tpl-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="lp-tpl-search-clear"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. 12-Reel Live Storyboard Grid */}
        {filteredTemplates.length === 0 ? (
          <div
            style={{
              padding: "42px 24px",
              border: "1px dashed rgba(7, 20, 46, 0.38)",
              borderRadius: 12,
              textAlign: "center",
              color: "#07142e",
            }}
          >
            <p style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700 }}>
              No reels matched &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All reels");
                setSelectedRatio("All");
                setSearchQuery("");
              }}
              className="lp-tpl-inspect-btn"
            >
              Show all 12 reels
            </button>
          </div>
        ) : (
          <div className="lp-tpl-grid">
            {filteredTemplates.map((tpl) => {
              const isOnStage = stageTemplate.id === tpl.id;
              return (
                <article
                  key={tpl.id}
                  className={`lp-tpl-card ${isOnStage ? "is-on-stage" : ""}`}
                >
                  <LiveScaledStage
                    src={tpl.src}
                    title={tpl.title}
                    category={tpl.category}
                    duration={`${tpl.ratio} · ${tpl.duration}`}
                    hoverLabel="Load on screening stage"
                    onClick={() => handleSelectForStage(tpl, true)}
                  />

                  <div className="lp-tpl-card-info">
                    <div>
                      <div className="lp-tpl-title-row">
                        <h3 className="lp-tpl-title">{tpl.title}</h3>
                        {isOnStage && (
                          <span className="lp-tpl-playing-pill">ON STAGE</span>
                        )}
                      </div>
                      <p className="lp-tpl-prompt-line">{tpl.prompt}</p>
                    </div>

                    <div className="lp-tpl-action-bar">
                      <button
                        type="button"
                        onClick={() => handleSelectForStage(tpl, true)}
                        className="lp-tpl-inspect-btn"
                      >
                        {isOnStage ? "Screening above" : "Watch on stage"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenInStudio(tpl.prompt, tpl.id)}
                        className="lp-tpl-use-btn"
                      >
                        <span>Open in Studio</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 5. Bottom Custom Scene Invitation */}
        <div className="lp-credit-strip" aria-label="Start from a blank prompt">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#07142e",
                }}
              >
                Starting from your own script or storyboard?
              </span>
              <span className="lp-credit-strip-note">
                Open a blank notebook prompt in the Studio to direct custom
                motion graphics, YouTube B-rolls, product launches, or 9:16
                shorts.
              </span>
            </div>
            <Link
              href="/dashboard"
              className="lp-tpl-use-btn"
              style={{ padding: "9px 16px" }}
            >
              <span>Start blank project in Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </NotebookShell>
  );
}
