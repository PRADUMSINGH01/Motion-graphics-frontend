"use client";

import React, { useEffect, useRef, memo } from "react";

export const RaycastBeamsCanvas = memo(function RaycastBeamsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // ── PRE-RENDER HIGH-PERFORMANCE SEAMLESS FILM GRAIN PATTERN ──
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 180;
    grainCanvas.height = 180;
    const gCtx = grainCanvas.getContext("2d");
    if (gCtx) {
      const gData = gCtx.createImageData(180, 180);
      for (let i = 0; i < gData.data.length; i += 4) {
        const val = Math.random() * 255;
        gData.data[i] = val;
        gData.data[i + 1] = val;
        gData.data[i + 2] = val;
        gData.data[i + 3] = 22; // subtle film grain
      }
      gCtx.putImageData(gData, 0, 0);
    }
    const grainPattern = ctx.createPattern(grainCanvas, "repeat");

    const render = () => {
      time += 0.018;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep obsidian background
      ctx.fillStyle = "#050507";
      ctx.fillRect(0, 0, width, height);

      // Save context for beam rotation
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((-40 * Math.PI) / 180);

      // Cyan / Blue edge diffuse underglow (gently pulsing)
      const cyanPulse = 0.24 + Math.sin(time * 0.8) * 0.06;
      const cyanGlow = ctx.createRadialGradient(-180, 50, 20, -180, 50, 420);
      cyanGlow.addColorStop(0, `rgba(0, 180, 255, ${cyanPulse})`);
      cyanGlow.addColorStop(0.5, "rgba(0, 100, 200, 0.09)");
      cyanGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(-650, -420, 1300, 840);

      // 5 Distinct Parallel Beams with organic breathing, shifting lengths & glowing pulses
      const beams = [
        {
          x: -210,
          width: 68,
          length: 720 + Math.sin(time * 0.9) * 45,
          alpha: 0.72 + Math.sin(time * 1.3) * 0.14,
          offset: -40 + Math.cos(time * 0.7) * 22,
        },
        {
          x: -110,
          width: 84,
          length: 880 + Math.sin(time * 0.8 + 1) * 50,
          alpha: 0.88 + Math.sin(time * 1.1 + 1) * 0.1,
          offset: 20 + Math.sin(time * 0.85) * 28,
        },
        {
          x: 0,
          width: 104,
          length: 970 + Math.sin(time * 0.7 + 2) * 60,
          alpha: 0.96 + Math.sin(time * 0.9 + 2) * 0.06, // Center primary beam
          offset: 0 + Math.cos(time * 0.95) * 24,
        },
        {
          x: 120,
          width: 88,
          length: 870 + Math.sin(time * 0.85 + 3) * 50,
          alpha: 0.86 + Math.sin(time * 1.05 + 3) * 0.12,
          offset: -20 + Math.sin(time * 0.8) * 26,
        },
        {
          x: 230,
          width: 70,
          length: 740 + Math.sin(time * 0.95 + 4) * 45,
          alpha: 0.7 + Math.sin(time * 1.25 + 4) * 0.15,
          offset: 40 + Math.cos(time * 0.75) * 22,
        },
      ];

      beams.forEach((beam) => {
        const yStart = -beam.length / 2 + beam.offset;
        const yEnd = beam.length / 2 + beam.offset;

        // Dynamic hot core traveling pulse
        const pulseShift = Math.sin(time * 1.2 + beam.x * 0.01) * 0.08;

        const grad = ctx.createLinearGradient(0, yStart, 0, yEnd);
        grad.addColorStop(0, "rgba(5, 5, 7, 0)");
        grad.addColorStop(0.12, `rgba(180, 15, 50, ${0.4 * beam.alpha})`);
        grad.addColorStop(
          Math.max(0.2, 0.32 + pulseShift),
          `rgba(255, 35, 75, ${0.85 * beam.alpha})`
        );
        grad.addColorStop(
          Math.min(0.7, 0.5 + pulseShift),
          `rgba(255, 80, 115, ${1.0 * beam.alpha})` // Hot coral core
        );
        grad.addColorStop(
          Math.min(0.8, 0.68 + pulseShift),
          `rgba(255, 35, 75, ${0.85 * beam.alpha})`
        );
        grad.addColorStop(0.88, `rgba(180, 15, 50, ${0.4 * beam.alpha})`);
        grad.addColorStop(1, "rgba(5, 5, 7, 0)");

        ctx.fillStyle = grad;

        // Draw rounded capsule beam
        const rx = beam.width / 2;
        const x = beam.x - rx;
        const y = yStart;
        const h = beam.length;

        ctx.beginPath();
        ctx.roundRect(x, y, beam.width, h, rx);
        ctx.fill();

        // Subtle side chromatic fringing on beam edge
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = `rgba(0, 140, 220, ${0.14 * beam.alpha})`;
        ctx.stroke();
      });

      ctx.restore();

      // Overlay film grain texture
      if (grainPattern) {
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute top-0 w-full h-full select-none"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
});

export default RaycastBeamsCanvas;
