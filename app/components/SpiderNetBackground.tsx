"use client";

import React, { useEffect, useRef } from "react";

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
  progress: number; // 0 to 1
  speed: number;
  color: string;
  size: number;
}

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
}

interface ShockwaveWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export default function SpiderNetBackground({
  opacity = 0.92,
  className = "",
}: {
  opacity?: number;
  className?: string;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    let width = (canvas.width = (canvas.parentElement?.clientWidth || window.innerWidth) * dpr);
    let height = (canvas.height = (canvas.parentElement?.clientHeight || window.innerHeight) * dpr);

    let cssWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    let cssHeight = canvas.parentElement?.clientHeight || window.innerHeight;

    // Window-level mouse tracking so it interacts even with pointer-events-none on canvas
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
      lastX: -1000,
      lastY: -1000,
      vx: 0,
      vy: 0,
    };

    // Web Hub configuration
    const spokeCount = 24; // Number of radial spokes
    const ringCount = 15; // Number of concentric web rings
    let hubX = cssWidth * 0.5;
    let hubY = cssHeight * 0.44;

    let webVertices: WebVertex[][] = [];
    const ambientParticles: AmbientParticle[] = [];
    const pulses: WebPulse[] = [];
    const shockwaves: ShockwaveWave[] = [];

    // Initialize Web Geometry
    const initWeb = () => {
      hubX = cssWidth * 0.5;
      hubY = cssHeight * 0.44;
      const maxRadius = Math.max(cssWidth, cssHeight) * 0.88;

      webVertices = [];

      for (let r = 0; r < ringCount; r++) {
        const ringArray: WebVertex[] = [];
        // Natural exponential spacing of web spirals
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
            angle: angle,
            x: x,
            y: y,
            targetX: x,
            targetY: y,
            vx: 0,
            vy: 0,
          });
        }
        webVertices.push(ringArray);
      }
    };

    // Initialize floating ambient luminescent particles
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const alpha = Math.random() * 0.4 + 0.2;
      ambientParticles.push({
        x: Math.random() * cssWidth,
        y: Math.random() * cssHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8,
        alpha: alpha,
        baseAlpha: alpha,
        pulseSpeed: Math.random() * 0.03 + 0.015,
      });
    }

    initWeb();

    const handleResize = () => {
      if (!canvas) return;
      cssWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      cssHeight = canvas.parentElement?.clientHeight || window.innerHeight;
      width = canvas.width = cssWidth * dpr;
      height = canvas.height = cssHeight * dpr;
      initWeb();
    };

    // Global window mouse listener for fluid plucking physics
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (clientX >= 0 && clientX <= cssWidth && clientY >= 0 && clientY <= cssHeight) {
        mouse.vx = clientX - mouse.x;
        mouse.vy = clientY - mouse.y;
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

    const handleClick = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (clickX >= 0 && clickX <= cssWidth && clickY >= 0 && clickY <= cssHeight) {
        shockwaves.push({
          x: clickX,
          y: clickY,
          radius: 12,
          maxRadius: Math.max(cssWidth, cssHeight) * 0.7,
          alpha: 0.85,
        });

        // Pluck web strings near the click point
        for (let r = 0; r < ringCount; r++) {
          for (let s = 0; s < spokeCount; s++) {
            const v = webVertices[r][s];
            const dist = Math.hypot(clickX - v.x, clickY - v.y);
            if (dist < 260) {
              const force = (1 - dist / 260) * 22;
              const angle = Math.atan2(v.y - clickY, v.x - clickX);
              v.vx += Math.cos(angle) * force;
              v.vy += Math.sin(angle) * force;
            }
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick, { passive: true });

    let time = 0;
    let pulseSpawnTimer = 0;

    const animate = () => {
      time += 0.022;
      pulseSpawnTimer++;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // 1. Soft Dynamic Pulsing Hub Gradient (Deep Cyan & Violet Radiance)
      const hubPulse = (Math.sin(time * 1.5) + 1) * 0.5;
      const radial = ctx.createRadialGradient(
        hubX,
        hubY,
        20 + hubPulse * 15,
        hubX,
        hubY,
        Math.max(cssWidth, cssHeight) * (0.68 + hubPulse * 0.05)
      );
      radial.addColorStop(0, "rgba(56, 189, 248, 0.12)"); // Cyan core
      radial.addColorStop(0.25, "rgba(139, 92, 246, 0.07)"); // Violet mid
      radial.addColorStop(0.55, "rgba(236, 72, 153, 0.03)"); // Rose subtle edge
      radial.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // 2. Spawn Traveling Neuro-Pulses along Spokes
      if (pulseSpawnTimer % 28 === 0 && pulses.length < 12) {
        pulses.push({
          spokeIndex: Math.floor(Math.random() * spokeCount),
          progress: 0,
          speed: 0.012 + Math.random() * 0.016,
          color: Math.random() > 0.5 ? "#38bdf8" : "#c084fc",
          size: 2.2 + Math.random() * 1.5,
        });
      }

      // 3. Update Web Vertices (Continuous Wind Breathing & Spring Damping)
      for (let r = 0; r < ringCount; r++) {
        // Natural multi-frequency harmonic wave: makes the web sway gently in organic wind
        const windWave =
          Math.sin(time * 1.6 + r * 0.42) * (1.8 + r * 0.6) +
          Math.cos(time * 0.9 + r * 0.25) * (1.2 + r * 0.35);

        for (let s = 0; s < spokeCount; s++) {
          const v = webVertices[r][s];
          const dynamicRadius = v.baseRadius + windWave;

          // Target coordinate with organic breathing
          v.targetX = hubX + Math.cos(v.angle) * dynamicRadius;
          v.targetY = hubY + Math.sin(v.angle) * dynamicRadius;

          // Interactive mouse plucking physics
          if (mouse.x > 0 && mouse.y > 0) {
            const dxMouse = mouse.x - v.x;
            const dyMouse = mouse.y - v.y;
            const distMouse = Math.hypot(dxMouse, dyMouse);

            if (distMouse < mouse.radius) {
              const force = (1 - distMouse / mouse.radius) * 20;
              v.targetX += (dxMouse / (distMouse || 1)) * force;
              v.targetY += (dyMouse / (distMouse || 1)) * force;
            }
          }

          // Spring physics toward target position
          const ax = (v.targetX - v.x) * 0.12;
          const ay = (v.targetY - v.y) * 0.12;
          v.vx = (v.vx + ax) * 0.84;
          v.vy = (v.vy + ay) * 0.84;
          v.x += v.vx;
          v.y += v.vy;
        }
      }

      // 4. Draw Radial Spokes (From Center Hub Outward)
      ctx.lineWidth = 0.9;
      for (let s = 0; s < spokeCount; s++) {
        ctx.beginPath();
        ctx.moveTo(hubX, hubY);

        for (let r = 0; r < ringCount; r++) {
          const v = webVertices[r][s];
          ctx.lineTo(v.x, v.y);
        }

        // Color gradient along spoke
        const spokeAlpha = 0.24 + Math.sin(time + s * 0.2) * 0.06;
        ctx.strokeStyle = `rgba(165, 180, 252, ${spokeAlpha})`;
        ctx.stroke();
      }

      // 5. Draw Concentric Web Rings (With Natural Curved Catenary Sagging)
      for (let r = 0; r < ringCount; r++) {
        const ring = webVertices[r];
        const ringAlpha = Math.max(0.1, 0.35 - (r / ringCount) * 0.22);

        ctx.beginPath();
        for (let s = 0; s < spokeCount; s++) {
          const current = ring[s];
          const next = ring[(s + 1) % spokeCount];

          if (s === 0) {
            ctx.moveTo(current.x, current.y);
          }

          // Natural spider web sag toward the center hub
          const midAngle =
            (current.angle + next.angle) / 2 +
            (s === spokeCount - 1 ? Math.PI : 0);
          const sagFactor = 0.93; // 7% inward sag
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

        ctx.strokeStyle = `rgba(196, 181, 253, ${ringAlpha})`;
        ctx.lineWidth = r % 3 === 0 ? 1.0 : 0.65;
        ctx.stroke();
      }

      // 6. Draw Traveling Neuro-Pulse Sparks along Web Strands
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

        // Draw glowing electrical pulse particle
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 7. Draw Glowing Dewdrop Nodes at Intersections (Twinkling Starlight)
      for (let r = 0; r < ringCount; r += 2) {
        for (let s = 0; s < spokeCount; s += 2) {
          const v = webVertices[r][s];
          const twinkle = (Math.sin(time * 2.5 + r * 1.5 + s * 0.8) + 1) * 0.5;
          const nodeRadius = 1.2 + twinkle * 1.1;

          ctx.beginPath();
          ctx.arc(v.x, v.y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${0.4 + twinkle * 0.5})`;
          ctx.shadowColor = "rgba(168, 85, 247, 0.7)";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 8. Draw Elastic Tension Strands to Cursor (When Active)
      if (mouse.x > 0 && mouse.y > 0) {
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
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
              connectedCount++;
            }
          }
        }
      }

      // 9. Draw Expanding Click Shockwaves
      for (let wIdx = shockwaves.length - 1; wIdx >= 0; wIdx--) {
        const sw = shockwaves[wIdx];
        sw.radius += 10;
        sw.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${sw.alpha * 0.6})`;
        ctx.lineWidth = 2.5 * sw.alpha;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (sw.alpha < 0.02 || sw.radius > sw.maxRadius) {
          shockwaves.splice(wIdx, 1);
        }
      }

      // 10. Floating Ambient Motes / Dust Across the Spider Web
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
        ctx.fillStyle = `rgba(224, 231, 255, ${currentAlpha})`;
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-0 ${className}`}
      style={{ opacity }}
    />
  );
}
