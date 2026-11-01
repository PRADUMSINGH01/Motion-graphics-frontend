"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotebookShell from "./components/landing/NotebookShell";
import { CATEGORIES, SHOWREEL, type Category, type ShowreelItem } from "./components/landing/showreel";
import "./components/landing/landing.css";
import "./components/landing/home.css";

const EXAMPLES = [
  {
    label: "Launch teaser for my app",
    prompt:
      "A 10-second launch teaser for my note-taking app: a 3, 2, 1 countdown on paper, the product card slams in, bold type, lime on navy.",
  },
  {
    label: "Quote for Reels",
    prompt:
      "A vertical 9:16 kinetic quote for Reels: 'Make it simple, then make it move.' word by word on textured paper.",
  },
  {
    label: "Chart for a YouTube video",
    prompt:
      "A 10-second B-roll chart for YouTube: a glowing line draws up to 2.4M views, milestone tags pop in, slow camera push.",
  },
];

/* The hero plays the brand story itself: a handwritten line becomes motion, ending on
   "ideas in motion". The wall below shows every other reel. */
const HERO_REEL = SHOWREEL.find((r) => r.id === "ink-to-motion") ?? SHOWREEL[0];
const WALL = SHOWREEL.filter((r) => r !== HERO_REEL);

/* A real sequence, so the cards are numbered. */
const STEPS = [
  {
    title: "Write what you want",
    body: "One sentence is enough: what happens, the words on screen and the mood.",
  },
  {
    title: "Check the storyboard",
    body: "byreel splits it into timed scenes. Change any word, colour or cut; edits don't use credits.",
  },
  {
    title: "Export and post",
    body: "Drop it into Premiere, DaVinci or CapCut, or post it straight to YouTube and Reels.",
  },
];

const STORYBOARD = [
  { id: "launch-day", time: "0:00" },
  { id: "pocket-studio", time: "0:03" },
  { id: "feature-bento", time: "0:07" },
];

/* Every ninth reel of whatever is showing becomes a 2×2 tile, alternating sides, but only when
   at least four reels follow it to fill out the block beside it. */
function featureOf(index: number, count: number): "left" | "right" | undefined {
  if (index % 9 !== 0 || count - index < 5) return undefined;
  return (index / 9) % 2 === 0 ? "left" : "right";
}

/* Every reel ships as a short looping MP4 in two sizes (540p for tiles, 720p for the hero and
   the screening room) plus a WebP poster, all in /public/showreel. */
function videoOf(item: ShowreelItem, size: "sm" | "lg") {
  return `/showreel/video/${item.id}${size === "lg" ? "-720" : ""}.mp4`;
}

function posterOf(item: ShowreelItem) {
  return `/showreel/${item.id}.webp`;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Live view of the OS "reduce motion" setting (false during server render). */
function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

/**
 * A reel as a muted, looping video. Nothing downloads until the reel is near the viewport and
 * reels are playing (so a paused or reduced-motion visit costs only posters); after that it
 * plays only while on screen, so the wall never decodes more than what you can see.
 */
function ReelVideo({
  item,
  playing,
  size,
  className,
}: {
  item: ShowreelItem;
  playing: boolean;
  size: "sm" | "lg";
  className: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        setOnScreen(entry.isIntersecting);
      },
      { rootMargin: "240px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !near) return;
    if (onScreen && playing) el.play().catch(() => {});
    else el.pause();
  }, [near, onScreen, playing]);

  return (
    <video
      ref={ref}
      className={className}
      src={near && playing ? videoOf(item, size) : undefined}
      poster={posterOf(item)}
      muted
      loop
      playsInline
      preload={near && playing ? "auto" : "none"}
      disablePictureInPicture
      aria-hidden="true"
    />
  );
}

function ReelTile({
  item,
  index,
  feature,
  playing,
  onOpen,
  onUse,
}: {
  item: ShowreelItem;
  index: number;
  feature?: "left" | "right";
  playing: boolean;
  onOpen: (item: ShowreelItem) => void;
  onUse: (item: ShowreelItem) => void;
}) {
  return (
    <figure
      className={`hm-tile${feature ? ` is-feature is-feature-${feature}` : ""}`}
      style={{ "--i": Math.min(index, 8) } as React.CSSProperties}
    >
      <button type="button" className="hm-tile-open" onClick={() => onOpen(item)}>
        <span className="hm-sr-only">Watch {item.title}</span>
        <ReelVideo item={item} playing={playing} size="sm" className="hm-tile-video" />
      </button>
      <figcaption className="hm-tile-caption">
        <span className="hm-tile-title">{item.title}</span>
        <button type="button" className="hm-tile-use" onClick={() => onUse(item)}>
          Use this prompt
        </button>
      </figcaption>
    </figure>
  );
}

/**
 * The screening room: one reel large, with the sentence that made it. Arrow keys step through
 * whatever the wall is showing; Escape closes (native <dialog> behaviour).
 */
function ScreeningRoom({
  reels,
  index,
  onIndex,
  onClose,
  onUse,
}: {
  reels: ShowreelItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  onUse: (item: ShowreelItem) => void;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const item = index === null ? null : reels[index];

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  const step = (delta: number) => {
    if (index === null) return;
    onIndex((index + delta + reels.length) % reels.length);
  };

  return (
    <dialog
      ref={ref}
      className="hm-room"
      aria-labelledby="hm-room-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      {item && (
        <div className="hm-room-inner">
          <div className="hm-room-screen">
            <video
              key={item.id}
              className="hm-room-video"
              src={videoOf(item, "lg")}
              poster={posterOf(item)}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
            />
          </div>
          <div className="hm-room-side">
            <p className="hm-room-cat">{item.category}</p>
            <h2 id="hm-room-title" className="hm-room-title">
              {item.title}
            </h2>
            <p className="hm-room-label">The sentence behind it</p>
            <blockquote className="hm-room-prompt lp-card-stock">{item.prompt}</blockquote>
            <div className="hm-room-actions">
              <button
                type="button"
                className="hm-room-use"
                onClick={() => {
                  onClose();
                  onUse(item);
                }}
              >
                Use this prompt
              </button>
              <span className="hm-room-count">
                {(index ?? 0) + 1} of {reels.length}
              </span>
            </div>
          </div>
          <div className="hm-room-nav">
            <button type="button" className="hm-room-btn" aria-label="Previous reel" onClick={() => step(-1)}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3L5 8l5 5" />
              </svg>
            </button>
            <button type="button" className="hm-room-btn" aria-label="Next reel" onClick={() => step(1)}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </button>
            <button type="button" className="hm-room-btn" aria-label="Close" onClick={onClose}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [prompt, setPrompt] = useState("");

  /* Reels play for everyone by default. A device set to reduce motion starts them paused
     (with a note saying why), and anyone can pause or resume them with the toggle. */
  const reduceMotion = useReducedMotion();
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const playing = choice === "play" || (choice === "auto" && !reduceMotion);

  const [filter, setFilter] = useState<"All" | Category>("All");
  const visible = filter === "All" ? WALL : WALL.filter((r) => r.category === filter);
  const countOf = (c: "All" | Category) =>
    c === "All" ? WALL.length : WALL.filter((r) => r.category === c).length;

  const fillPrompt = (text: string) => {
    setPrompt(text);
    const el = inputRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    el.focus({ preventScroll: true });
  };
  const applyReelPrompt = (item: ShowreelItem) => fillPrompt(item.prompt);
  const [screening, setScreening] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/dashboard?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <NotebookShell ariaLabel="byreel — turn a written prompt into a motion graphics video">
      <div className="hm">
        <section className="hm-hero" aria-labelledby="hm-title">
          <h1 id="hm-title" className="hm-title">
            <span className="hm-title-line">Ideas start as words.</span>{" "}
            <span className="hm-title-line">byreel puts them in motion.</span>
          </h1>
          <div className="hm-hero-body">
          <div className="hm-hero-copy">
            <p className="hm-story">
              byreel is a motion design studio you direct in plain language. Write what you can
              see in your head; byreel storyboards it, animates it and renders the reel at up to
              4K and 60 fps, ready for YouTube, Reels or launch day.
            </p>

            <form onSubmit={handleSubmit} className="hm-prompt">
              <label htmlFor="hm-prompt" className="hm-sr-only">
                Describe your video
              </label>
              <input
                ref={inputRef}
                id="hm-prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A launch trailer for my app, lime on navy"
                className="hm-prompt-input"
                autoComplete="off"
              />
              <button type="submit" className="hm-cta">
                Generate video
              </button>
            </form>

            <div className="hm-try">
              <span className="hm-try-label">Try</span>
              {EXAMPLES.map((ex) => (
                <button key={ex.label} type="button" className="hm-chip" onClick={() => fillPrompt(ex.prompt)}>
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          <figure className="hm-hero-reel">
            <span className="lp-tape hm-hero-tape is-left" aria-hidden="true" />
            <span className="lp-tape hm-hero-tape is-right" aria-hidden="true" />
            <div className="hm-hero-screen">
              <ReelVideo item={HERO_REEL} playing={playing} size="lg" className="hm-tile-video" />
            </div>
            <figcaption className="hm-hero-note">
              <svg className="hm-hero-arrow" viewBox="0 0 64 40" aria-hidden="true">
                <path d="M58 34 C 44 32, 26 24, 14 8" />
                <path d="M24 9 L 13 7 L 14 18" />
              </svg>
              this reel started as one sentence
            </figcaption>
          </figure>
          </div>
        </section>

        <section className="hm-wall-wrap" aria-labelledby="hm-wall-title">
          <div className="hm-wall-head">
            <h2 id="hm-wall-title" className="hm-h2">
              Made with byreel
            </h2>
            <p className="hm-wall-lede">
              Every reel here started as one sentence. Open any of them to watch it large and
              read the prompt behind it.
            </p>
          </div>
          <div className="hm-wall-bar">
            <div className="hm-filters" role="group" aria-label="Filter reels">
              {(["All", ...CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={filter === c}
                  onClick={() => setFilter(c)}
                  className="hm-filter"
                >
                  {c}
                  <span className="hm-filter-count">{countOf(c)}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="hm-play-toggle"
              aria-pressed={playing}
              onClick={() => setChoice(playing ? "pause" : "play")}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                {playing ? (
                  <path d="M4 3h3v10H4zM9 3h3v10H9z" />
                ) : (
                  <path d="M4 2.5v11l9.5-5.5z" />
                )}
              </svg>
              {playing ? "Pause reels" : "Play reels"}
            </button>
            {!playing && reduceMotion && choice === "auto" && (
              <p className="hm-motion-note">
                Paused because this device is set to reduce motion.
              </p>
            )}
          </div>
          <div className="hm-wall">
            {visible.map((item, i) => (
              <ReelTile
                key={item.id}
                item={item}
                index={i}
                feature={featureOf(i, visible.length)}
                playing={playing}
                onOpen={(it) => setScreening(visible.indexOf(it))}
                onUse={applyReelPrompt}
              />
            ))}
          </div>
          <ScreeningRoom
            reels={visible}
            index={screening}
            onIndex={setScreening}
            onClose={() => setScreening(null)}
            onUse={applyReelPrompt}
          />
          <p className="hm-wall-foot">
            Want more starting points?{" "}
            <Link href="/templates" className="hm-link">
              Browse the templates library
            </Link>
          </p>
        </section>

        <section className="hm-how" aria-labelledby="hm-how-title">
          <h2 id="hm-how-title" className="hm-h2">
            How a video gets made
          </h2>
          <ol className="hm-steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="hm-step lp-card-stock">
                <span className="lp-tape hm-step-tape" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="hm-step-art" aria-hidden="true">
                  {i === 0 && (
                    <p className="hm-art-note">
                      a launch teaser for my app, lime on navy, ten seconds, end on the logo
                    </p>
                  )}
                  {i === 1 && (
                    <div className="hm-art-board">
                      {STORYBOARD.map((f) => (
                        <figure key={f.id} className="hm-art-frame">
                          {/* eslint-disable-next-line @next/next/no-img-element -- tiny static still */}
                          <img src={`/showreel/${f.id}.webp`} alt="" loading="lazy" />
                          <figcaption>{f.time}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                  {i === 2 && (
                    <ul className="hm-art-specs">
                      <li>MP4 up to 4K at 60 fps</li>
                      <li>WebM with a transparent background</li>
                      <li>16:9, 9:16, 1:1 and 4:5</li>
                    </ul>
                  )}
                </div>
                <h3 className="hm-step-title">{step.title}</h3>
                <p className="hm-step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="hm-close" aria-labelledby="hm-close-title">
          <div>
            <h2 id="hm-close-title" className="hm-close-title">
              Start with 15 free credits a month.
            </h2>
            <p className="hm-close-body">No card needed. That&apos;s about three short videos.</p>
          </div>
          <div className="hm-close-actions">
            <button type="button" className="hm-close-cta" onClick={() => fillPrompt(prompt)}>
              Write your first prompt
            </button>
            <Link href="/pricing" className="hm-close-link">
              See pricing
            </Link>
          </div>
        </section>
      </div>
    </NotebookShell>
  );
}
