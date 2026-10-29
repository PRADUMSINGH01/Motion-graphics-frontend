"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./landing/landing.css";

interface StudioLoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  theme?: "dark" | "light";
  showProgress?: boolean;
  onFinish?: () => void;
}

const MAIN_LETTERS = ["b", "y", "r", "e", "e", "l"];

const LOADING_STEPS = [
  {
    id: "motion",
    shortLabel: "01 · Text & Transitions",
    label: "Compiling colorful kinetic word pops & shutter wipes",
    sub: "60 FPS spring physics, counter-sliding ribbons & iris portal reveals",
  },
  {
    id: "launch",
    shortLabel: "02 · Product Launch",
    label: "Staging SaaS flagship launch trailer & 3D telemetry",
    sub: "Isometric glass UI, +340% YoY benchmark bars, and deploy CTA",
  },
  {
    id: "broll",
    shortLabel: "03 · Animated B-Rolls",
    label: "Mounting Vox-style archival cutaways & marker sweeps",
    sub: "Smooth camera pans, electric lime highlighter, and source citations",
  },
  {
    id: "shorts",
    shortLabel: "04 · Faceless Video",
    label: "Synchronizing auto-story scenes & kinetic captions",
    sub: "Automated scene B-roll nodes, chapter hooks, and synchronized voiceover",
  },
];

export default function StudioLoadingScreen({
  message,
  subMessage,
  fullScreen = true,
  showProgress = true,
  onFinish,
}: StudioLoadingScreenProps) {
  const [progress, setProgress] = useState(14);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          if (onFinish) onFinish();
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 98 ? 98 : next;
      });
    }, 170);

    return () => clearInterval(interval);
  }, [onFinish]);

  useEffect(() => {
    if (progress < 28) {
      setStepIndex(0);
    } else if (progress < 56) {
      setStepIndex(1);
    } else if (progress < 84) {
      setStepIndex(2);
    } else {
      setStepIndex(3);
    }
  }, [progress]);

  const currentStep = LOADING_STEPS[stepIndex];
  const activeMessage = message || currentStep.label;
  const activeSubMessage = subMessage || currentStep.sub;

  // Format progress as a 60fps timecode (00:00:00:00 -> 00:00:01:30)
  const frameNum = String(Math.floor((progress / 100) * 59)).padStart(2, "0");
  const secNum = progress === 100 ? "01" : "00";

  return (
    <div
      role="status"
      aria-label="Loading byreel.in notebook studio"
      className={`lp-loading-root ${fullScreen ? "is-fullscreen" : ""}`}
    >
      {/* Crisp Notebook Horizontal Ruled Lines */}
      <div className="lp-notebook-rules" aria-hidden="true" />

      {/* Left-Side Double Vertical Dark Navy Margin Lines */}
      <div className="lp-notebook-blue-margins" aria-hidden="true" />

      {/* Sheet Vignette */}
      <div className="lp-paper-vignette" aria-hidden="true" />

      {/* Left-Margin Notebook Index Stub */}
      <aside className="lp-margin-sidebar" aria-hidden="true">
        <div className="lp-margin-header">STUDIO</div>
        <div className="lp-margin-nav">
          {LOADING_STEPS.map((s, idx) => (
            <div
              key={s.id}
              className={`lp-pen-link ${idx === stepIndex ? "is-active" : ""}`}
              style={{ pointerEvents: "none" }}
            >
              <span className="lp-pen-num">0{idx + 1}.</span>
              <span className="lp-pen-word">{s.shortLabel.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Center Transparent Notebook Loading Card */}
      <div className="lp-loading-stage">
        <span
          className="lp-washi-tape is-lime"
          style={{ "--tape-rot": "-1deg" } as React.CSSProperties}
          aria-hidden="true"
        />

        {/* Flat 2D Animated byreel.in — IDEAS IN MOTION Lockup */}
        <div className="lp-motion-logo" style={{ padding: "4px 8px" }}>
          <div className="lp-ribbon-mark">
            <Image
              src="/byreel-mark.png"
              alt="byreel mark"
              width={44}
              height={44}
              priority
              className="lp-ribbon-img"
            />
          </div>

          <div className="lp-wordmark-stack">
            <div className="lp-wordmark-row">
              <span className="lp-wordmark-main" aria-hidden="true">
                {MAIN_LETTERS.map((char, i) => (
                  <span
                    key={i}
                    className="lp-glyph-clip"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="lp-glyph">{char}</span>
                  </span>
                ))}
              </span>

              <span className="lp-tld-group" aria-hidden="true">
                <span className="lp-tld-dot" />
                <span
                  className="lp-glyph-clip"
                  style={{ "--i": 6 } as React.CSSProperties}
                >
                  <span className="lp-glyph">i</span>
                </span>
                <span
                  className="lp-glyph-clip"
                  style={{ "--i": 7 } as React.CSSProperties}
                >
                  <span className="lp-glyph">n</span>
                </span>
              </span>
            </div>

            <div className="lp-subcaption-row" aria-hidden="true">
              <span className="lp-subcaption-text">IDEAS IN MOTION</span>
            </div>
          </div>
        </div>

        {/* 4-Frame Storyboard Filmstrip (Motion Graphics · B-Rolls · Launch · Shorts) */}
        <div className="lp-loading-filmstrip" aria-hidden="true">
          {LOADING_STEPS.map((s, idx) => {
            const isActive = idx === stepIndex;
            const isDone = idx < stepIndex;
            return (
              <div
                key={s.id}
                className={`lp-loading-cell ${isActive ? "is-active" : ""} ${
                  isDone ? "is-done" : ""
                }`}
              >
                {s.id === "motion" && (
                  <svg viewBox="0 0 40 30" className="lp-loading-cell-svg">
                    <rect
                      x="4"
                      y="6"
                      width="24"
                      height="6"
                      rx="2"
                      fill="rgba(152,206,0,0.45)"
                      stroke="#07142e"
                      strokeWidth="1.4"
                    />
                    <rect
                      x="4"
                      y="16"
                      width="32"
                      height="6"
                      rx="2"
                      fill="rgba(7,20,46,0.18)"
                      stroke="#07142e"
                      strokeWidth="1.4"
                    />
                  </svg>
                )}
                {s.id === "broll" && (
                  <svg viewBox="0 0 40 30" className="lp-loading-cell-svg">
                    <line
                      x1="4"
                      y1="25"
                      x2="36"
                      y2="25"
                      stroke="#07142e"
                      strokeWidth="1.4"
                    />
                    <rect
                      x="7"
                      y="15"
                      width="6"
                      height="10"
                      fill="rgba(7,20,46,0.2)"
                      stroke="#07142e"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="17"
                      y="10"
                      width="6"
                      height="15"
                      fill="rgba(7,20,46,0.3)"
                      stroke="#07142e"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="27"
                      y="4"
                      width="6"
                      height="21"
                      fill="rgba(152,206,0,0.5)"
                      stroke="#07142e"
                      strokeWidth="1.2"
                    />
                  </svg>
                )}
                {s.id === "launch" && (
                  <svg viewBox="0 0 40 30" className="lp-loading-cell-svg">
                    <polygon
                      points="20,4 34,11 20,18 6,11"
                      fill="rgba(152,206,0,0.45)"
                      stroke="#07142e"
                      strokeWidth="1.4"
                    />
                    <polygon
                      points="6,11 20,18 20,27 6,20"
                      fill="rgba(7,20,46,0.2)"
                      stroke="#07142e"
                      strokeWidth="1.4"
                    />
                    <polygon
                      points="34,11 20,18 20,27 34,20"
                      fill="none"
                      stroke="#07142e"
                      strokeWidth="1.4"
                    />
                  </svg>
                )}
                {s.id === "shorts" && (
                  <svg viewBox="0 0 40 30" className="lp-loading-cell-svg">
                    <rect
                      x="12"
                      y="2"
                      width="16"
                      height="26"
                      rx="3"
                      fill="rgba(152,206,0,0.3)"
                      stroke="#07142e"
                      strokeWidth="1.5"
                    />
                    <polygon points="18,11 24,15 18,19" fill="#07142e" />
                  </svg>
                )}
                <span className="lp-loading-cell-lbl">{s.shortLabel}</span>
              </div>
            );
          })}
        </div>

        {/* Status Copy */}
        <div className="lp-loading-copy">
          <h2 className="lp-loading-title">{activeMessage}</h2>
          <p className="lp-loading-sub">{activeSubMessage}</p>
        </div>

        {/* Progress Track & Timecode Readout */}
        {showProgress && (
          <div className="lp-loading-progress-wrap">
            <div className="lp-loading-track">
              <div
                className="lp-loading-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="lp-loading-meta-row">
              <span>00:00:{secNum}:{frameNum} · 60 FPS</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
