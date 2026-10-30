"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotebookShell from "./components/landing/NotebookShell";
import "./components/landing/landing.css";
import "./components/landing/home.css";

type Ratio = "16:9" | "9:16" | "RGBA";

const FORMATS: {
  id: string;
  name: string;
  desc: string;
  src: string;
  ratio: Ratio;
  prompt: string;
}[] = [
  {
    id: "text-transition",
    name: "Kinetic text & transitions",
    desc: "Word pops, spring physics and colour wipes for intros and title cards.",
    src: "/text-transition-cool.html",
    ratio: "16:9",
    prompt:
      "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
  },
  {
    id: "product-launch",
    name: "Product launch",
    desc: "Multi-scene SaaS trailers with UI cards, live metrics and an end card.",
    src: "/saas-product-launch.html",
    ratio: "16:9",
    prompt:
      "Direct a multi-scene SaaS product launch trailer with isometric UI cards, +340% YoY telemetry bars, sub-8ms latency counter, and a bold CTA end-card.",
  },
  {
    id: "broll",
    name: "Animated B-roll",
    desc: "Data cutaways and highlight sweeps to drop between talking-head shots.",
    src: "/broll-data-cutaway.html",
    ratio: "16:9",
    prompt:
      "Create a 10-second animated B-roll cutaway panning across an archival print clipping with an electric lime marker sweep and live telemetry chart.",
  },
  {
    id: "faceless-video",
    name: "Faceless video",
    desc: "Story scenes with word-by-word captions, ready for Shorts and Reels.",
    src: "/faceless-story-reel.html",
    ratio: "9:16",
    prompt:
      "Generate a complete faceless storytelling video with automated visual B-roll scenes, chapter progression, and synchronized word-by-word kinetic captions.",
  },
];

const RATIOS: { id: Ratio; label: string }[] = [
  { id: "16:9", label: "16:9" },
  { id: "9:16", label: "9:16" },
  { id: "RGBA", label: "Transparent" },
];

const STEPS = [
  {
    title: "Describe it",
    body: "Write what happens on screen, the words to animate and the mood. One sentence is enough to start.",
  },
  {
    title: "Review the storyboard",
    body: "The agent splits your prompt into timed scenes. Change copy, colours or pacing. Edits don't use credits.",
  },
  {
    title: "Export",
    body: "Render up to 4K at 60 fps as MP4, or as WebM with transparency to layer in Premiere, DaVinci or CapCut.",
  },
];

/* The reels are authored on a 1280×720 stage; scale that stage to whatever box holds it. */
const BASE_W = 1280;

function LiveReel({ src, title }: { src: string; title: string }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (el.clientWidth > 0) setScale(el.clientWidth / BASE_W);
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setScale(entry.contentRect.width / BASE_W);
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
    <div ref={boxRef} className="lp-tpl-live-viewport">
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
          style={{ transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const monitorRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState(FORMATS[0].id);
  const [ratio, setRatio] = useState<Ratio>(FORMATS[0].ratio);
  const [prompt, setPrompt] = useState(FORMATS[0].prompt);

  const active = FORMATS.find((f) => f.id === activeId) ?? FORMATS[0];

  const selectFormat = (f: (typeof FORMATS)[number]) => {
    setActiveId(f.id);
    setPrompt(f.prompt);
    setRatio(f.ratio);
    // On narrow screens the preview sits above the picker; bring it back into view.
    const el = monitorRef.current;
    if (el && el.getBoundingClientRect().bottom < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/dashboard?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(ratio)}`
    );
  };

  return (
    <NotebookShell ariaLabel="byreel — turn a written prompt into a motion graphics video">
      <div className="hm">
        <section className="hm-hero" aria-labelledby="hm-title">
          <div className="hm-hero-copy">
            <h1 id="hm-title" className="hm-title">
              <span className="hm-title-line">Describe the video.</span>{" "}
              <span className="hm-title-line">byreel animates it.</span>
            </h1>
            <p className="hm-lede">
              Kinetic type, launch trailers, B-roll cutaways and faceless shorts, written in plain
              language and rendered at 60&nbsp;fps.
            </p>

            <form onSubmit={handleSubmit} className="hm-composer">
              <label htmlFor="hm-prompt" className="hm-sr-only">
                Describe your video
              </label>
              <textarea
                id="hm-prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A 15-second launch trailer for a note-taking app, bold type, lime on navy…"
                className="hm-composer-input"
              />
              <div className="hm-composer-bar">
                <div className="hm-seg" role="radiogroup" aria-label="Output format">
                  {RATIOS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      role="radio"
                      aria-checked={ratio === r.id}
                      onClick={() => setRatio(r.id)}
                      className="hm-seg-btn"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <button type="submit" className="hm-cta" disabled={!prompt.trim()}>
                  Generate video
                </button>
              </div>
            </form>

            <p className="hm-composer-note">
              Free plan includes 15 credits a month.{" "}
              <Link href="/templates" className="hm-link">
                Browse templates
              </Link>
            </p>
          </div>

          <figure ref={monitorRef} className="hm-monitor">
            <div className="hm-monitor-screen">
              <LiveReel key={active.id} src={active.src} title={`${active.name} sample render`} />
            </div>
            <figcaption className="hm-monitor-caption">
              <svg className="hm-pen-arrow" viewBox="0 0 64 40" aria-hidden="true">
                <path d="M6 34 C 18 30, 34 24, 46 10" />
                <path d="M36 10 L 47 8 L 47 20" />
              </svg>
              <span className="hm-pen-note">live render, not a mockup</span>
            </figcaption>
          </figure>
        </section>

        <section className="hm-formats" aria-labelledby="hm-formats-title">
          <h2 id="hm-formats-title" className="hm-h2">
            Start from a format
          </h2>
          <div className="hm-format-grid">
            {FORMATS.map((f) => {
              const isActive = f.id === activeId;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectFormat(f)}
                  className="hm-format"
                >
                  <span className="hm-format-thumb">
                    <LiveReel src={f.src} title={`${f.name} preview`} />
                  </span>
                  <span className="hm-format-body">
                    <span className="hm-format-name">
                      <span className="hm-format-label">{f.name}</span>
                      <span className="hm-format-ratio">{f.ratio}</span>
                    </span>
                    <span className="hm-format-desc">{f.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="hm-steps" aria-labelledby="hm-steps-title">
          <h2 id="hm-steps-title" className="hm-h2">
            How a video gets made
          </h2>
          <ol className="hm-step-list">
            {STEPS.map((s, i) => (
              <li key={s.title} className="hm-step">
                <span className="hm-step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="hm-step-title">{s.title}</h3>
                <p className="hm-step-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </NotebookShell>
  );
}
