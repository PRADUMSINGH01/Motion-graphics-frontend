"use client";
export default function MotionQuote() {
  return (
    <div className="flex min-h-[520px] w-full overflow-hidden">
      <FieldBackground />
    </div>
  );
}

import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const LOOP = 24;
const OM = (2 * Math.PI) / LOOP;

/**
 * Detect if we're on a low-power / mobile device to reduce canvas work.
 */
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || navigator.hardwareConcurrency <= 4;
}

export function FieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let DPR = 1;
    let animationFrame = 0;
    let isVisible = true;
    const startTime = performance.now();
    const mobile = isMobileDevice();

    // --------------------------------------------------
    // Grain texture
    // --------------------------------------------------

    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 128; // Reduced from 256
    grainCanvas.height = 128;

    const grainCtx = grainCanvas.getContext("2d");

    if (!grainCtx) return;

    const imageData = grainCtx.createImageData(128, 128);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const value = (118 + Math.random() * 20) | 0;

      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }

    grainCtx.putImageData(imageData, 0, 0);

    let grainPattern: CanvasPattern | null = null;

    // --------------------------------------------------
    // Bloom canvas (skip on mobile for perf)
    // --------------------------------------------------

    const bloomCanvas = mobile ? null : document.createElement("canvas");
    const bloomCtx = bloomCanvas ? bloomCanvas.getContext("2d") : null;

    // --------------------------------------------------
    // Resize
    // --------------------------------------------------

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 2);

      const parent = canvas.parentElement;
      W = Math.floor((parent?.clientWidth || window.innerWidth) * DPR);
      H = Math.floor((parent?.clientHeight || window.innerHeight) * DPR);

      canvas.width = W;
      canvas.height = H;

      canvas.style.width = "100%";
      canvas.style.height = "100%";

      grainPattern = ctx.createPattern(grainCanvas, "repeat");
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    // --------------------------------------------------
    // Visibility observer — pause when off-screen
    // --------------------------------------------------
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visObserver.observe(canvas);

    // --------------------------------------------------
    // Field
    // --------------------------------------------------

    const field = (x: number, z: number, t: number) => {
      let h = 0;

      h += 2.6 * Math.sin(x * 0.2 + z * 0.1 + t * OM * 2);
      h += 1.7 * Math.sin(x * 0.09 - z * 0.22 - t * OM * 3 + 1.3);
      h += 1.1 * Math.sin(x * 0.32 + z * 0.3 + t * OM * 5 + 2.1);

      // Skip higher frequency harmonics on mobile
      if (!mobile) {
        h += 0.65 * Math.sin(x * 0.52 - z * 0.44 - t * OM * 7 + 4.4);
        h += 0.3 * Math.sin(x * 0.85 + z * 0.75 + t * OM * 11 + 0.7);
      }

      h += 0.9 * Math.sin((x + z) * 0.14 + t * OM * 2);

      return h;
    };

    // --------------------------------------------------
    // Camera
    // --------------------------------------------------

    const FOV = () => 0.95 * H;

    const CAMY = 3.2;
    const CAMZ = -9;

    const project = (
      x: number,
      y: number,
      z: number
    ): [number, number, number] => {
      const dz = z - CAMZ;
      const scale = FOV() / dz;
      return [W * 0.5 + x * scale, H * 0.46 - (y - CAMY) * scale, scale];
    };

    // --------------------------------------------------
    // Draw
    // --------------------------------------------------

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Background
      const background = ctx.createLinearGradient(0, 0, 0, H);

      const isDark = resolvedTheme === "dark";
      background.addColorStop(0, isDark ? "#17181b" : "#f4f1ea");
      background.addColorStop(0.45, isDark ? "#131417" : "#e9e5dc");
      background.addColorStop(1, isDark ? "#0c0d0f" : "#d9d5cb");

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, W, H);

      // Grid configuration — REDUCED for performance
      // Desktop: 48×56 (from 92×110) = ~5.3K segments (from ~20K)
      // Mobile: 24×28 = ~1.3K segments
      const XN = mobile ? 24 : 48;
      const ZN = mobile ? 28 : 56;

      const XSPAN = 46;

      const Z0 = 6;
      const Z1 = 130;

      const depthAlpha = (z: number) =>
        Math.min(1, Math.max(0, (Z1 - z) / (Z1 - Z0)));

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Horizontal grid
      for (let j = 0; j < ZN; j++) {
        const u = j / (ZN - 1);
        const ze = Z0 + (Z1 - Z0) * Math.pow(u, 1.7);

        ctx.beginPath();

        let started = false;

        // Reduced subdivision: XN instead of XN*2
        const subdiv = mobile ? XN : XN * 2;
        for (let i = 0; i <= subdiv; i++) {
          const x = -XSPAN / 2 + (XSPAN * i) / subdiv;
          const y = field(x, ze, t);
          const [px, py] = project(x, y, ze);

          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }

        const alpha = 0.05 + 0.34 * depthAlpha(ze);
        ctx.strokeStyle = isDark
          ? `rgba(232,233,228,${alpha.toFixed(3)})`
          : `rgba(35,39,45,${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(0.55, 1.05 * depthAlpha(ze)) * DPR;
        ctx.stroke();
      }

      // Vertical grid
      for (let i = 0; i <= XN; i++) {
        const x = -XSPAN / 2 + (XSPAN * i) / XN;

        ctx.beginPath();

        let started = false;

        const subdiv = mobile ? ZN : ZN * 2;
        for (let j = 0; j <= subdiv; j++) {
          const u = j / subdiv;
          const ze = Z0 + (Z1 - Z0) * Math.pow(u, 1.7);
          const y = field(x, ze, t);
          const [px, py] = project(x, y, ze);

          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }

        const alpha = 0.045 + 0.3 * depthAlpha(Z0 + (Z1 - Z0) * 0.35);
        ctx.strokeStyle = isDark
          ? `rgba(226,227,222,${alpha.toFixed(3)})`
          : `rgba(35,39,45,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8 * DPR;
        ctx.stroke();
      }

      // Bloom — skip on mobile
      if (bloomCanvas && bloomCtx) {
        const bloomWidth = Math.max(1, Math.floor(W / 4)); // Reduced from /3
        const bloomHeight = Math.max(1, Math.floor(H / 4));

        if (
          bloomCanvas.width !== bloomWidth ||
          bloomCanvas.height !== bloomHeight
        ) {
          bloomCanvas.width = bloomWidth;
          bloomCanvas.height = bloomHeight;
        }

        bloomCtx.clearRect(0, 0, bloomWidth, bloomHeight);
        bloomCtx.filter = "blur(7px)";
        bloomCtx.drawImage(canvas, 0, 0, bloomWidth, bloomHeight);
        bloomCtx.filter = "none";

        ctx.save();
        ctx.globalCompositeOperation = isDark ? "lighter" : "multiply";
        ctx.globalAlpha = 0.16;
        ctx.drawImage(bloomCanvas, 0, 0, W, H);
        ctx.restore();
      }

      // Vignette
      const vignette = ctx.createRadialGradient(
        W / 2,
        H * 0.55,
        H * 0.25,
        W / 2,
        H * 0.55,
        H * 0.95
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(
        1,
        isDark ? "rgba(5,6,7,0.55)" : "rgba(35,39,45,0.12)"
      );
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      // Grain
      if (grainPattern) {
        ctx.save();
        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = isDark ? 0.05 : 0.035;
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    };

    // --------------------------------------------------
    // Animation — with visibility check
    // --------------------------------------------------

    const animate = (now: number) => {
      if (isVisible) {
        const elapsed = (now - startTime) / 1000;
        const time = elapsed % LOOP;
        draw(time);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    // --------------------------------------------------
    // Cleanup
    // --------------------------------------------------

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visObserver.disconnect();
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[100%]"
      style={{
        display: "block",
        background: "#111214",
      }}
    />
  );
}