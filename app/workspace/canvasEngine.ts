import { StylePreset } from "./types";

export function drawCanvasFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  activeStyle: StylePreset,
  liveText: string,
  isPlaying: boolean
) {
  // 1. Deep Midnight Studio Backdrop
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h));
  bgGrad.addColorStop(0, "#0e111a");
  bgGrad.addColorStop(1, "#050608");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle tech background grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
  ctx.lineWidth = 1;
  const step = 48;
  for (let x = 0; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const cx = w / 2;
  const cy = h / 2;

  // 2. Render Motion Graphics by Selected Style
  if (activeStyle === "Kinetic Typography") {
    const text = (liveText || "VELOCITY").toUpperCase();
    ctx.font = "bold 50px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Kinetic offset only when playing or time > 0
    const offset = isPlaying ? Math.sin(t * 2.5) * 28 : 0;
    const bounce = isPlaying ? Math.cos(t * 3.2) * 5 : 0;

    if (isPlaying && offset !== 0) {
      // Chromatic split red/pink trail
      ctx.fillStyle = "rgba(244, 63, 94, 0.4)";
      ctx.fillText(text, cx - offset, cy - 8 + bounce);

      // Chromatic split cyan trail
      ctx.fillStyle = "rgba(56, 189, 248, 0.45)";
      ctx.fillText(text, cx + offset, cy + 8 - bounce);
    }

    // Core crisp foreground with cyan glow
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = isPlaying ? 22 : 16;
    ctx.fillText(text, cx, cy);
    ctx.shadowBlur = 0;

    // Subtitle tag
    ctx.font = "600 11px monospace";
    ctx.fillStyle = "rgba(0, 240, 255, 0.85)";
    ctx.fillText("60.0 FPS • HARDWARE ACCELERATED RENDER", cx, cy + 58);
  } else if (activeStyle === "3D Isometric") {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(isPlaying ? t * 0.6 : 0.2);

    const size = 66;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.strokeStyle = i % 2 === 0 ? "#00f0ff" : "#818cf8";
      ctx.lineWidth = 2;
      const s = size - i * 15;
      ctx.strokeRect(-s, -s, s * 2, s * 2);
    }

    const pulse = isPlaying ? (Math.sin(t * 3) + 1) * 0.5 : 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14 + pulse * 7, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#818cf8";
    ctx.shadowBlur = 22;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.font = "600 11px monospace";
    ctx.fillStyle = "rgba(129, 140, 248, 0.9)";
    ctx.textAlign = "center";
    ctx.fillText("ISOMETRIC PROJECTION MATRIX", cx, cy + 105);
  } else if (activeStyle === "Logo Reveal") {
    const radius = 64;
    const progress = isPlaying ? (t * 0.75) % 1 : 1;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + progress * Math.PI * 2;

    // Outer neon glow arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 22;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Counter-rotating inner ring
    const innerProgress = 1 - progress;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.75, Math.PI / 2, Math.PI / 2 + innerProgress * Math.PI * 2);
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();

    // Inner monogram
    ctx.font = "bold 26px -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(liveText?.charAt(0) || "A", cx, cy);

    ctx.font = "600 11px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("VECTOR MONOGRAM REVEAL", cx, cy + 100);
  } else if (activeStyle === "Abstract VFX") {
    const points = 50;
    const baseRadius = 56;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const theta = (i / points) * Math.PI * 2;
      const noise = isPlaying
        ? Math.sin(theta * 3 + t * 4) * 12 + Math.cos(theta * 5 - t * 2) * 7
        : Math.sin(theta * 3) * 8;
      const r = baseRadius + noise;
      const x = cx + Math.cos(theta) * r;
      const y = cy + Math.sin(theta) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const fluidGrad = ctx.createLinearGradient(cx - 60, cy - 60, cx + 60, cy + 60);
    fluidGrad.addColorStop(0, "#f43f5e");
    fluidGrad.addColorStop(0.5, "#a855f7");
    fluidGrad.addColorStop(1, "#06b6d4");
    ctx.fillStyle = fluidGrad;
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = "600 11px monospace";
    ctx.fillStyle = "rgba(244, 63, 94, 0.9)";
    ctx.textAlign = "center";
    ctx.fillText("HARMONIC PLASMA DYNAMICS", cx, cy + 105);
  } else {
    // UI & Lottie Motion
    const barWidth = 30;
    const totalBars = 5;
    const startX = cx - (totalBars * (barWidth + 10)) / 2;

    for (let i = 0; i < totalBars; i++) {
      const hOffset = isPlaying ? Math.sin(t * 3.5 + i * 0.8) * 32 : (i % 2 === 0 ? 20 : -10);
      const barH = 48 + hOffset;
      const x = startX + i * (barWidth + 10);
      const y = cy - barH / 2;

      ctx.fillStyle = i % 2 === 0 ? "#00f0ff" : "#3b82f6";
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, 6);
      ctx.fill();
    }

    ctx.font = "600 11px monospace";
    ctx.fillStyle = "rgba(59, 130, 246, 0.9)";
    ctx.textAlign = "center";
    ctx.fillText("INTERACTIVE LOTTIE RUNTIME", cx, cy + 86);
  }
}
