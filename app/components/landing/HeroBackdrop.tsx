"use client";

import { useEffect, useRef } from "react";
import { startCanvasLoop } from "./canvasLoop";

const INK = "17,17,16";
const ACCENT = "194,65,12";
const SWEEP_PERIOD = 7; // seconds between playhead passes

/**
 * Hero background: a dot grid that drifts like a scrolling timeline and ripples like an
 * audio waveform. A playhead sweeps across every few seconds, lighting the dots it passes,
 * and dots lift away from the cursor. Two warm glows drift underneath.
 */
export default function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement?.parentElement;
    if (!canvas || !host) return;

    let spacing = 26;

    return startCanvasLoop(canvas, {
      host,
      staticTime: 2.2,
      onResize: (w) => {
        spacing = w < 640 ? 22 : 26;
      },
      draw: ({ ctx, w, h, t, px, py, pointerActive }) => {
        const s = spacing;
        const drift = (t * 10) % s; // the grid slides left like a timeline
        const cols = Math.ceil(w / s) + 2;
        const rows = Math.ceil(h / s) + 1;

        // Playhead: travels across during the first 60% of each period, then rests off-screen.
        const phase = (t % SWEEP_PERIOD) / SWEEP_PERIOD;
        const sweepX = phase < 0.6 ? (phase / 0.6) * (w + 240) - 120 : -9999;

        const R = 150;

        for (let r = 0; r < rows; r++) {
          const y0 = r * s + s * 0.5;
          for (let c = 0; c < cols; c++) {
            const x0 = c * s - drift;

            // Two travelling sine waves give an audio-waveform ripple.
            let x = x0;
            let y =
              y0 +
              Math.sin(x0 * 0.011 + t * 1.1) * 5 +
              Math.sin(x0 * 0.027 - t * 0.7 + r * 0.45) * 2.5;

            let size = 1.3;
            let alpha = 0.11;
            let heat = 0;

            const sx = (x - sweepX) / 46;
            const sweep = Math.exp(-sx * sx);
            if (sweep > 0.02) {
              heat = Math.max(heat, sweep);
              alpha += sweep * 0.32;
              size += sweep * 1.1;
            }

            if (pointerActive) {
              const dx = x - px;
              const dy = y - py;
              const d = Math.sqrt(dx * dx + dy * dy);
              if (d < R) {
                const f = (1 - d / R) * (1 - d / R);
                const push = (f * 16) / (d || 1);
                x += dx * push;
                y += dy * push;
                heat = Math.max(heat, f);
                alpha += f * 0.4;
                size += f * 1.6;
              }
            }

            ctx.fillStyle = heat > 0.15 ? `rgba(${ACCENT},${Math.min(alpha, 0.75)})` : `rgba(${INK},${alpha})`;
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
          }
        }

        // The playhead line itself, very faint.
        if (sweepX > -200) {
          const g = ctx.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, `rgba(${ACCENT},0)`);
          g.addColorStop(0.5, `rgba(${ACCENT},0.22)`);
          g.addColorStop(1, `rgba(${ACCENT},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(sweepX - 0.5, 0, 1, h);
        }
      },
    });
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="lp-glow lp-glow-a" />
      <div className="lp-glow lp-glow-b" />
      <canvas ref={canvasRef} className="lp-hero-canvas absolute inset-0 h-full w-full" />
    </div>
  );
}
