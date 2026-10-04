"use client";

import { useEffect, useRef } from "react";
import { startCanvasLoop } from "./canvasLoop";

interface Mote {
  x: number;
  y: number;
  z: number; // depth 0.3–1: nearer motes are bigger, brighter and faster
  phase: number;
  speed: number;
}

const PAPER = "245,244,240";
const WARM = "245,158,92";
const SWAY_PERIOD = 14;
const SWAY_DEG = 3.5;

/**
 * Background for the final CTA: a projector beam that sways from the top-right corner with
 * dust motes drifting through it, a soft glow that follows the cursor, film grain and a
 * 3-2-1 film-leader countdown.
 */
export default function ProjectorBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const beam = beamRef.current;
    const host = canvas?.parentElement?.parentElement;
    if (!canvas || !beam || !host) return;

    let motes: Mote[] = [];
    // Deterministic pseudo-random so the layout is stable between resizes.
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    return startCanvasLoop(canvas, {
      host,
      maxDpr: 1.5,
      staticTime: 4,
      onResize: (w, h) => {
        seed = 7;
        const n = Math.round(Math.min(170, Math.max(60, (w * h) / 8000)));
        motes = Array.from({ length: n }, () => ({
          x: rnd() * w,
          y: rnd() * h,
          z: 0.3 + rnd() * 0.7,
          phase: rnd() * Math.PI * 2,
          speed: 0.6 + rnd() * 0.8,
        }));
      },
      draw: ({ ctx, w, h, t, dt, px, py, pointerActive }) => {
        // Beam geometry: apex near the top-right, aimed down-left, swaying slowly.
        const sway = Math.sin((t / SWAY_PERIOD) * Math.PI * 2) * SWAY_DEG;
        beam.style.transform = `rotate(${sway.toFixed(3)}deg)`;

        const ax = w * 0.9;
        const ay = -h * 0.08;
        // Matches the .lp-beam cone in landing.css (apex at its top-right, bottom centre ~30% across).
        const base = Math.atan2(h * 1.3, -w * 0.595) + (sway * Math.PI) / 180;
        const halfCone = 0.14;

        // Cursor glow
        if (pointerActive) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, 260);
          g.addColorStop(0, `rgba(${WARM},0.10)`);
          g.addColorStop(1, `rgba(${WARM},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(px - 260, py - 260, 520, 520);
        }

        for (const m of motes) {
          // Drift up with a lazy side-to-side wobble.
          m.y -= dt * 9 * m.z * m.speed;
          m.x += Math.sin(t * 0.5 * m.speed + m.phase) * dt * 6 * m.z;

          if (pointerActive) {
            const dx = m.x - px;
            const dy = m.y - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < 140 * 140) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / 140) * 60 * dt;
              m.x += (dx / d) * f;
              m.y += (dy / d) * f;
            }
          }

          if (m.y < -6) {
            m.y = h + 6;
            m.x = rnd() * w;
          }
          if (m.x < -6) m.x = w + 6;
          if (m.x > w + 6) m.x = -6;

          // How deep inside the beam cone is this mote? (1 on the centre line, 0 outside)
          const ang = Math.atan2(m.y - ay, m.x - ax);
          let diff = Math.abs(ang - base);
          if (diff > Math.PI) diff = Math.PI * 2 - diff;
          const inBeam = Math.max(0, 1 - diff / halfCone);

          const twinkle = 0.65 + 0.35 * Math.sin(t * 2.1 * m.speed + m.phase);
          const alpha = (0.07 + inBeam * inBeam * 0.6) * m.z * twinkle;
          const size = (0.6 + m.z * 1.4) * (1 + inBeam * 0.5);

          ctx.fillStyle = `rgba(${inBeam > 0.55 && m.z > 0.75 ? WARM : PAPER},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      },
    });
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div ref={beamRef} className="lp-beam" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="lp-leader">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="97" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="80" strokeWidth="0.8" />
          <path d="M100 0v200M0 100h200" strokeWidth="0.5" />
        </svg>
        <div className="lp-leader-sweep" />
        <div className="lp-leader-nums lp-serif">
          <span>3</span>
          <span>2</span>
          <span>1</span>
        </div>
      </div>

      <div className="lp-grain" />
      <div className="lp-vignette" />
    </div>
  );
}
