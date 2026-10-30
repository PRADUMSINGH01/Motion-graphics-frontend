"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotebookShell from "./components/landing/NotebookShell";
import { SHOWREEL, type ShowreelItem } from "./components/landing/showreel";
import "./components/landing/landing.css";
import "./components/landing/home.css";

/* Reels are authored on a 1280×720 stage. */
const STAGE_W = 1280;
const STAGE_H = 720;

/**
 * One live reel, scaled to cover its tile. The iframe only exists while the tile is on screen
 * (so a wall of reels never runs all at once), and never for reduced-motion visitors, who
 * get the still poster instead.
 */
function ReelTile({
  item,
  feature,
  onUse,
}: {
  item: ShowreelItem;
  feature?: "left" | "right";
  onUse: (item: ShowreelItem) => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [onScreen, setOnScreen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onMq = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onMq);

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
      mq.removeEventListener("change", onMq);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const scale = box.w ? Math.max(box.w / STAGE_W, box.h / STAGE_H) : 0;
  const dx = (box.w - STAGE_W * scale) / 2;
  const dy = (box.h - STAGE_H * scale) / 2;
  const live = onScreen && !reduceMotion && scale > 0;

  return (
    <figure className={`hm-tile${feature ? ` is-feature is-feature-${feature}` : ""}`}>
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
            src={`/${item.id}.html`}
            title={item.title}
            sandbox="allow-scripts"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => setLoaded(true)}
            className="hm-tile-frame"
            style={{
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
          <div className="hm-wall">
            {SHOWREEL.map((item) => (
              <ReelTile key={item.id} item={item} feature={item.feature} onUse={applyReelPrompt} />
            ))}
          </div>
          <p className="hm-wall-foot">
            <Link href="/templates" className="hm-link">
              Open these in the templates library
            </Link>{" "}
            to see their scene timing and full prompts.
          </p>
        </section>
      </div>
    </NotebookShell>
  );
}
