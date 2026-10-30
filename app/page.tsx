"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotebookShell from "./components/landing/NotebookShell";
import { SHOWREEL, type ShowreelItem } from "./components/landing/showreel";
import "./components/landing/landing.css";
import "./components/landing/home.css";

/* HyperFrames originals are authored at 1920×1080; the earlier reels on a 1280×720 stage. */
function stageOf(item: ShowreelItem) {
  return item.hyperframes ? { w: 1920, h: 1080 } : { w: 1280, h: 720 };
}

function srcOf(item: ShowreelItem) {
  return item.hyperframes ? `/hyperframes/${item.id}.html?autoplay` : `/${item.id}.html`;
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
 * One live reel, scaled to cover its tile. The iframe only exists while the tile is on screen
 * (so a wall of reels never runs all at once) and while reels are playing; otherwise the
 * still poster shows.
 */
function ReelTile({
  item,
  index,
  playing,
  onUse,
}: {
  item: ShowreelItem;
  index: number;
  playing: boolean;
  onUse: (item: ShowreelItem) => void;
}) {
  const feature = item.feature;
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [onScreen, setOnScreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: width, h: height });
    });
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
        if (!entry.isIntersecting) setLoaded(false);
      },
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const stage = stageOf(item);
  const scale = box.w ? Math.max(box.w / stage.w, box.h / stage.h) : 0;
  const dx = (box.w - stage.w * scale) / 2;
  const dy = (box.h - stage.h * scale) / 2;
  const live = onScreen && playing && scale > 0;

  return (
    <figure
      className={`hm-tile${feature ? ` is-feature is-feature-${feature}` : ""}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div ref={boxRef} className="hm-tile-stage">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static poster, sized by CSS */}
        <img
          src={`/showreel/${item.id}.jpg`}
          alt=""
          className="hm-tile-poster"
          loading={feature ? "eager" : "lazy"}
          decoding="async"
        />
        {live && (
          <iframe
            src={srcOf(item)}
            title={item.title}
            sandbox="allow-scripts"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => setLoaded(true)}
            className="hm-tile-frame"
            style={{
              width: stage.w,
              height: stage.h,
              transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
              opacity: loaded ? 1 : 0,
            }}
          />
        )}
      </div>
      <figcaption className="hm-tile-caption">
        <span className="hm-tile-title">{item.title}</span>
        <button type="button" className="hm-tile-use" onClick={() => onUse(item)}>
          Use this prompt
        </button>
      </figcaption>
    </figure>
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

  const applyReelPrompt = (item: ShowreelItem) => {
    setPrompt(item.prompt);
    const el = inputRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    el.focus({ preventScroll: true });
  };

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
        <header className="hm-intro">
          <h1 className="hm-title">
            <span className="hm-title-line">Describe the video.</span>{" "}
            <span className="hm-title-line">byreel animates it.</span>
          </h1>
          <p className="hm-lede">
            Every reel on this page started as one written sentence. Pick one to remix, or
            write your own.
          </p>
        </header>

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
            placeholder="A 15-second launch trailer for a note-taking app, bold type, lime on navy"
            className="hm-prompt-input"
            autoComplete="off"
          />
          <button type="submit" className="hm-cta">
            Generate video
          </button>
        </form>

        <section className="hm-wall-wrap" aria-label="Motion graphics made with byreel">
          <p className="hm-pen-note" aria-hidden="true">
            all live renders
            <svg className="hm-pen-arrow" viewBox="0 0 64 40">
              <path d="M4 8 C 20 10, 38 18, 50 32" />
              <path d="M40 33 L 51 33 L 50 22" />
            </svg>
          </p>
          <div className="hm-wall-bar">
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
            {SHOWREEL.map((item, i) => (
              <ReelTile key={item.id} item={item} index={i} playing={playing} onUse={applyReelPrompt} />
            ))}
          </div>
          <p className="hm-wall-foot">
            Want more starting points?{" "}
            <Link href="/templates" className="hm-link">
              Browse the templates library
            </Link>
          </p>
        </section>
      </div>
    </NotebookShell>
  );
}
