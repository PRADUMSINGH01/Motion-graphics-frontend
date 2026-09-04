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

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export default function SpiderNetBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
    };

    // Web Hub configuration
    const spokeCount = 22; // Number of radial spokes
    const ringCount = 14;  // Number of concentric web rings
    let hubX = width * 0.5;
    let hubY = height * 0.44;

    let webVertices: WebVertex[][] = [];
    const ambientParticles: AmbientParticle[] = [];

    // Initialize Web Geometry
    const initWeb = () => {
      hubX = width * 0.5;
      hubY = height * 0.44;
      const maxRadius = Math.max(width, height) * 0.85;

      webVertices = [];

      for (let r = 0; r < ringCount; r++) {
        const ringArray: WebVertex[] = [];
        // Natural spider web exponential spacing
        const progress = (r + 1) / ringCount;
        const ringRadius = Math.pow(progress, 1.25) * maxRadius + 30;

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

    // Initialize floating ambient dust/particles
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    initWeb();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initWeb();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Soft atmospheric gradient in the web center
      const radial = ctx.createRadialGradient(
        hubX,
        hubY,
        40,
        hubX,
        hubY,
        Math.max(width, height) * 0.65
      );
      radial.addColorStop(0, "rgba(99, 102, 241, 0.08)"); // Indigo glow
      radial.addColorStop(0.4, "rgba(168, 85, 247, 0.04)"); // Purple glow
      radial.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // 2. Update Web Vertices (Harmonic oscillation + mouse tension physics)
      for (let r = 0; r < ringCount; r++) {
        const wave = Math.sin(time + r * 0.35) * (1.5 + r * 0.5);

        for (let s = 0; s < spokeCount; s++) {
          const v = webVertices[r][s];
          const dynamicRadius = v.baseRadius + wave;

          // Natural target position with harmonic breath
          v.targetX = hubX + Math.cos(v.angle) * dynamicRadius;
          v.targetY = hubY + Math.sin(v.angle) * dynamicRadius;

          // Mouse interaction (plucking / bending web threads)
          const dxMouse = mouse.x - v.x;
          const dyMouse = mouse.y - v.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < mouse.radius) {
            const force = (1 - distMouse / mouse.radius) * 18;
            v.targetX += (dxMouse / (distMouse || 1)) * force;
            v.targetY += (dyMouse / (distMouse || 1)) * force;
          }

          // Spring physics toward target
          const ax = (v.targetX - v.x) * 0.1;
          const ay = (v.targetY - v.y) * 0.1;
          v.vx = (v.vx + ax) * 0.82;
          v.vy = (v.vy + ay) * 0.82;
          v.x += v.vx;
          v.y += v.vy;
        }
      }

      // 3. Draw Radial Spokes (Spreading from hub outwards)
      ctx.lineWidth = 0.8;
      for (let s = 0; s < spokeCount; s++) {
        ctx.beginPath();
        ctx.moveTo(hubX, hubY);

        for (let r = 0; r < ringCount; r++) {
          const v = webVertices[r][s];
          ctx.lineTo(v.x, v.y);
        }

        const outerV = webVertices[ringCount - 1][s];
        const spokeAlpha = 0.22;
        ctx.strokeStyle = `rgba(165, 180, 252, ${spokeAlpha})`;
        ctx.stroke();
      }

      // 4. Draw Concentric Web Rings (With natural curved sagging between spokes)
      for (let r = 0; r < ringCount; r++) {
        const ring = webVertices[r];
        const ringAlpha = Math.max(0.08, 0.32 - (r / ringCount) * 0.2);

        ctx.beginPath();
        for (let s = 0; s < spokeCount; s++) {
          const current = ring[s];
          const next = ring[(s + 1) % spokeCount];

          if (s === 0) {
            ctx.moveTo(current.x, current.y);
          }

          // In a real spider web, the spiral string sags slightly inward toward the hub
          const midAngle = (current.angle + next.angle) / 2 + (s === spokeCount - 1 ? Math.PI : 0);
          const sagFactor = 0.94; // slight inward sag
          const midRadius = current.baseRadius * sagFactor;
          const cpX = hubX + Math.cos(midAngle) * midRadius + (current.x + next.x) * 0.5 - current.targetX;
          const cpY = hubY + Math.sin(midAngle) * midRadius + (current.y + next.y) * 0.5 - current.targetY;

          ctx.quadraticCurveTo(cpX, cpY, next.x, next.y);
        }

        ctx.strokeStyle = `rgba(196, 181, 253, ${ringAlpha})`;
        ctx.lineWidth = r % 2 === 0 ? 0.9 : 0.6;
        ctx.stroke();
      }

      // 5. Draw Glowing Spider Web Junction Nodes (Dewdrop effect)
      for (let r = 0; r < ringCount; r += 2) {
        for (let s = 0; s < spokeCount; s += 2) {
          const v = webVertices[r][s];
          const pulse = (Math.sin(time * 2 + r + s) + 1) * 0.5;
          const nodeRadius = 1.2 + pulse * 1.0;

          ctx.beginPath();
          ctx.arc(v.x, v.y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${0.4 + pulse * 0.4})`;
          ctx.shadowColor = "rgba(168, 85, 247, 0.6)";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 6. Draw Interactive Tension Lines to Cursor
      if (mouse.x > 0 && mouse.y > 0) {
        let connectedCount = 0;
        for (let r = 0; r < ringCount && connectedCount < 6; r++) {
          for (let s = 0; s < spokeCount && connectedCount < 6; s++) {
            const v = webVertices[r][s];
            const dx = mouse.x - v.x;
            const dy = mouse.y - v.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const alpha = (1 - dist / mouse.radius) * 0.45;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(v.x, v.y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 0.9;
              ctx.stroke();
              connectedCount++;
            }
          }
        }
      }

      // 7. Ambient Drifting Motes / Dust across web
      for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 231, 255, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.92 }}
    />
  );
}
