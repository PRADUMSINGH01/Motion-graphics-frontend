"use client";

import React, { useEffect, useRef, memo } from "react";

interface WebVertex {
  spokeIndex: number;
  ringIndex: number;
  baseRadius: number;
  angle: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
}

interface WebPulse {
  spokeIndex: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || navigator.hardwareConcurrency <= 4;
}

const SpiderNetBackground = memo(function SpiderNetBackground({
  opacity = 0.92,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const mobile = isMobile();
    const dpr = typeof window !== "undefined" ? (mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2)) : 1;

    let width = (canvas.width = (canvas.parentElement?.clientWidth || window.innerWidth) * dpr);
    let height = (canvas.height = (canvas.parentElement?.clientHeight || window.innerHeight) * dpr);

    let cssWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    let cssHeight = canvas.parentElement?.clientHeight || window.innerHeight;

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
    };

    // Reduced complexity: fewer spokes/rings on mobile
    const spokeCount = mobile ? 12 : 18; // Reduced from 24
    const ringCount = mobile ? 8 : 12;   // Reduced from 15
    let hubX = cssWidth * 0.5;
    let hubY = cssHeight * 0.44;

    let webVertices: WebVertex[][] = [];
    const pulses: WebPulse[] = [];

    // Skip ambient particles on mobile — they're tiny and barely visible
    const particleCount = mobile ? 0 : 25; // Reduced from 50
    const ambientParticles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; baseAlpha: number; pulseSpeed: number }[] = [];

    const initWeb = () => {
      hubX = cssWidth * 0.5;
      hubY = cssHeight * 0.44;
      const maxRadius = Math.max(cssWidth, cssHeight) * 0.88;

      webVertices = [];

      for (let r = 0; r < ringCount; r++) {
        const ringArray: WebVertex[] = [];
        const progress = (r + 1) / ringCount;
        const ringRadius = Math.pow(progress, 1.28) * maxRadius + 32;

        for (let s = 0; s < spokeCount; s++) {
          const angle = (s / spokeCount) * Math.PI * 2;
          const x = hubX + Math.cos(angle) * ringRadius;
          const y = hubY + Math.sin(angle) * ringRadius;

          ringArray.push({
            spokeIndex: s,
            ringIndex: r,
            baseRadius: ringRadius,
            angle,
            x,
            y,
            targetX: x,
            targetY: y,
            vx: 0,
            vy: 0,
          });
        }
        webVertices.push(ringArray);
      }
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const alpha = Math.random() * 0.4 + 0.2;
      ambientParticles.push({
        x: Math.random() * cssWidth,
        y: Math.random() * cssHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8,
        alpha,
        baseAlpha: alpha,
        pulseSpeed: Math.random() * 0.03 + 0.015,
      });
    }

    initWeb();

    // Visibility observer — pause when off-screen
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visObserver.observe(canvas);

    const handleResize = () => {
      if (!canvas) return;
      cssWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      cssHeight = canvas.parentElement?.clientHeight || window.innerHeight;
      width = canvas.width = cssWidth * dpr;
      height = canvas.height = cssHeight * dpr;
      initWeb();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (clientX >= 0 && clientX <= cssWidth && clientY >= 0 && clientY <= cssHeight) {
        mouse.x = clientX;
        mouse.y = clientY;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    // Skip mouse interaction on mobile — no hover anyway
    if (!mobile) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    let time = 0;
    let pulseSpawnTimer = 0;

    const animate = () => {
      // Skip rendering when off-screen
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      time += 0.022;
      pulseSpawnTimer++;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // 1. Hub gradient
      const hubPulse = (Math.sin(time * 1.5) + 1) * 0.5;
      const radial = ctx.createRadialGradient(
        hubX,
        hubY,
        20 + hubPulse * 15,
        hubX,
        hubY,
        Math.max(cssWidth, cssHeight) * (0.68 + hubPulse * 0.05)
      );
      radial.addColorStop(0, "rgba(61, 115, 245, 0.08)");
      radial.addColorStop(0.25, "rgba(61, 115, 245, 0.04)");
      radial.addColorStop(0.55, "rgba(61, 115, 245, 0.015)");
      radial.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // 2. Spawn pulses (reduced frequency)
      if (pulseSpawnTimer % 42 === 0 && pulses.length < 8) {
        pulses.push({
          spokeIndex: Math.floor(Math.random() * spokeCount),
          progress: 0,
          speed: 0.012 + Math.random() * 0.016,
          color: Math.random() > 0.5 ? "#6b9bff" : "#a0a0ab",
          size: 2.2 + Math.random() * 1.5,
        });
      }

      // 3. Update vertices
      for (let r = 0; r < ringCount; r++) {
        const windWave =
          Math.sin(time * 1.6 + r * 0.42) * (1.8 + r * 0.6) +
          Math.cos(time * 0.9 + r * 0.25) * (1.2 + r * 0.35);

        for (let s = 0; s < spokeCount; s++) {
          const v = webVertices[r][s];
          const dynamicRadius = v.baseRadius + windWave;

          v.targetX = hubX + Math.cos(v.angle) * dynamicRadius;
          v.targetY = hubY + Math.sin(v.angle) * dynamicRadius;

          if (!mobile && mouse.x > 0 && mouse.y > 0) {
            const dxMouse = mouse.x - v.x;
            const dyMouse = mouse.y - v.y;
            const distMouse = Math.hypot(dxMouse, dyMouse);

            if (distMouse < mouse.radius) {
              const force = (1 - distMouse / mouse.radius) * 20;
              v.targetX += (dxMouse / (distMouse || 1)) * force;
              v.targetY += (dyMouse / (distMouse || 1)) * force;
            }
          }

          const ax = (v.targetX - v.x) * 0.12;
          const ay = (v.targetY - v.y) * 0.12;
          v.vx = (v.vx + ax) * 0.84;
          v.vy = (v.vy + ay) * 0.84;
          v.x += v.vx;
          v.y += v.vy;
        }
      }

      const isLight = document.documentElement.classList.contains("light");

      // 4. Draw spokes
      ctx.lineWidth = isLight ? 1.0 : 0.9;
      for (let s = 0; s < spokeCount; s++) {
        ctx.beginPath();
        ctx.moveTo(hubX, hubY);

        for (let r = 0; r < ringCount; r++) {
          const v = webVertices[r][s];
          ctx.lineTo(v.x, v.y);
        }

        const spokeAlpha = (isLight ? 0.34 : 0.24) + Math.sin(time + s * 0.2) * 0.06;
        ctx.strokeStyle = isLight
          ? `rgba(42, 91, 224, ${spokeAlpha})`
          : `rgba(160, 160, 171, ${spokeAlpha})`;
        ctx.stroke();
      }

      // 5. Draw rings
      for (let r = 0; r < ringCount; r++) {
        const ring = webVertices[r];
        const ringAlpha = Math.max(0.1, (isLight ? 0.42 : 0.35) - (r / ringCount) * 0.22);

        ctx.beginPath();
        for (let s = 0; s < spokeCount; s++) {
          const current = ring[s];
          const next = ring[(s + 1) % spokeCount];

          if (s === 0) {
            ctx.moveTo(current.x, current.y);
          }

          const midAngle =
            (current.angle + next.angle) / 2 +
            (s === spokeCount - 1 ? Math.PI : 0);
          const sagFactor = 0.93;
          const midRadius = current.baseRadius * sagFactor;
          const cpX =
            hubX +
            Math.cos(midAngle) * midRadius +
            (current.x + next.x) * 0.5 -
            current.targetX;
          const cpY =
            hubY +
            Math.sin(midAngle) * midRadius +
            (current.y + next.y) * 0.5 -
            current.targetY;

          ctx.quadraticCurveTo(cpX, cpY, next.x, next.y);
        }

        ctx.strokeStyle = isLight
          ? `rgba(42, 91, 224, ${ringAlpha})`
          : `rgba(107, 155, 255, ${ringAlpha})`;
        ctx.lineWidth = r % 3 === 0 ? (isLight ? 1.15 : 1.0) : (isLight ? 0.75 : 0.65);
        ctx.stroke();
      }

      // 6. Travelling pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const ringProgress = p.progress * (ringCount - 1);
        const lowerR = Math.floor(ringProgress);
        const upperR = Math.min(ringCount - 1, lowerR + 1);
        const frac = ringProgress - lowerR;

        const v1 = webVertices[lowerR][p.spokeIndex];
        const v2 = webVertices[upperR][p.spokeIndex];

        const px = v1.x + (v2.x - v1.x) * frac;
        const py = v1.y + (v2.y - v1.y) * frac;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 7. Dewdrop nodes — draw every 3rd instead of every 2nd
      for (let r = 0; r < ringCount; r += 3) {
        for (let s = 0; s < spokeCount; s += 3) {
          const v = webVertices[r][s];
          const twinkle = (Math.sin(time * 2.5 + r * 1.5 + s * 0.8) + 1) * 0.5;
          const nodeRadius = 1.2 + twinkle * 1.1;

          ctx.beginPath();
          ctx.arc(v.x, v.y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = isLight
            ? `rgba(42, 91, 224, ${0.45 + twinkle * 0.5})`
            : `rgba(147, 182, 255, ${0.4 + twinkle * 0.5})`;
          ctx.shadowColor = isLight ? "rgba(42, 91, 224, 0.35)" : "rgba(61, 115, 245, 0.6)";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 8. Cursor tension strands (desktop only)
      if (!mobile && mouse.x > 0 && mouse.y > 0) {
        let connectedCount = 0;
        for (let r = 0; r < ringCount && connectedCount < 6; r++) {
          for (let s = 0; s < spokeCount && connectedCount < 6; s++) {
            const v = webVertices[r][s];
            const dist = Math.hypot(mouse.x - v.x, mouse.y - v.y);

            if (dist < mouse.radius) {
              const alpha = (1 - dist / mouse.radius) * 0.5;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(v.x, v.y);
              ctx.strokeStyle = isLight
                ? `rgba(42, 91, 224, ${alpha * 1.2})`
                : `rgba(107, 155, 255, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
              connectedCount++;
            }
          }
        }
      }

      // 9. Floating particles (desktop only)
      for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = cssWidth;
        if (p.x > cssWidth) p.x = 0;
        if (p.y < 0) p.y = cssHeight;
        if (p.y > cssHeight) p.y = 0;

        const pulse = (Math.sin(time * p.pulseSpeed * 10) + 1) * 0.5;
        const currentAlpha = p.baseAlpha * (0.6 + pulse * 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(42, 91, 224, ${currentAlpha * 0.8})`
          : `rgba(237, 237, 240, ${currentAlpha})`;
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (!mobile) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
      visObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-0 ${className}`}
      style={{ opacity }}
    />
  );
});

export default SpiderNetBackground;
