import { StylePreset, ColorPalette } from "./types";

export interface PaletteTheme {
  name: string;
  primary: string;
  secondary: string;
  glow: string;
  accent: string;
  lightGlow: string;
}

export const PALETTE_THEMES: Record<ColorPalette, PaletteTheme> = {
  cyan: {
    name: "CYBER NEON",
    primary: "#00f0ff",
    secondary: "#f43f5e",
    glow: "#00f0ff",
    accent: "rgba(0, 240, 255, 0.9)",
    lightGlow: "rgba(0, 240, 255, 0.15)",
  },
  purple: {
    name: "NEON VIOLET",
    primary: "#c084fc",
    secondary: "#f472b6",
    glow: "#a855f7",
    accent: "rgba(192, 132, 252, 0.9)",
    lightGlow: "rgba(168, 85, 247, 0.15)",
  },
  amber: {
    name: "SOLAR AMBER",
    primary: "#fbbf24",
    secondary: "#f97316",
    glow: "#f59e0b",
    accent: "rgba(251, 191, 36, 0.9)",
    lightGlow: "rgba(245, 158, 11, 0.15)",
  },
  matrix: {
    name: "EMERALD MATRIX",
    primary: "#34d399",
    secondary: "#06b6d4",
    glow: "#10b981",
    accent: "rgba(52, 211, 153, 0.9)",
    lightGlow: "rgba(16, 185, 129, 0.15)",
  },
  crimson: {
    name: "CRIMSON FLAME",
    primary: "#f87171",
    secondary: "#fb923c",
    glow: "#ef4444",
    accent: "rgba(248, 113, 113, 0.9)",
    lightGlow: "rgba(239, 68, 68, 0.15)",
  },
  blue: {
    name: "ELECTRIC BLUE",
    primary: "#60a5fa",
    secondary: "#38bdf8",
    glow: "#3b82f6",
    accent: "rgba(96, 165, 250, 0.9)",
    lightGlow: "rgba(59, 130, 246, 0.15)",
  },
};

export function drawCanvasFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  activeStyle: StylePreset,
  liveText: string,
  isPlaying: boolean,
  colorPalette: ColorPalette = "cyan",
  motionSpeed: number = 1
) {
  const theme = PALETTE_THEMES[colorPalette] || PALETTE_THEMES.cyan;
  const animTime = t * (motionSpeed || 1);
  const cx = w / 2;
  const cy = h / 2;
  const isStandby = !liveText || !liveText.trim();
  const cleanText = isStandby ? "" : liveText.trim().toUpperCase();

  // 1. Deep Midnight Studio Backdrop
  const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(w, h));
  bgGrad.addColorStop(0, "#0e111a");
  bgGrad.addColorStop(0.7, "#06080e");
  bgGrad.addColorStop(1, "#020305");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Technical studio grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
  ctx.lineWidth = 1;
  const step = 44;
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

  // 3. Ambient floating bokeh particles
  const particleCount = 14;
  for (let i = 0; i < particleCount; i++) {
    const px = (Math.sin(i * 123 + animTime * 0.15) * 0.45 + 0.5) * w;
    const py = (Math.cos(i * 321 + animTime * 0.12) * 0.45 + 0.5) * h;
    const pRadius = 1.2 + (i % 3) * 0.8;
    ctx.beginPath();
    ctx.arc(px, py, pRadius, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? theme.primary : theme.secondary;
    ctx.globalAlpha = 0.25 + Math.sin(animTime + i) * 0.15;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  // 4. Render Active Motion Graphic by Style
  if (isStandby) {
    // Clean empty standby canvas: no dummy placeholder text
    return;
  }

  if (activeStyle === "Kinetic Typography") {
    // Dynamic text size based on character count so it never overflows
      const baseFontSize = Math.min(
        Math.max(28, Math.floor(w / Math.max(7, cleanText.length * 0.75))),
        58
      );
      ctx.font = `900 ${baseFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const offset = isPlaying ? Math.sin(animTime * 2.8) * 24 : 0;
      const bounce = isPlaying ? Math.cos(animTime * 3.4) * 6 : 0;

      if (isPlaying && offset !== 0) {
        // Secondary chromatic split shadow
        ctx.fillStyle = theme.secondary;
        ctx.globalAlpha = 0.45;
        ctx.fillText(cleanText, cx - offset, cy - 7 + bounce);

        // Primary chromatic split shadow
        ctx.fillStyle = theme.primary;
        ctx.globalAlpha = 0.55;
        ctx.fillText(cleanText, cx + offset, cy + 7 - bounce);
        ctx.globalAlpha = 1.0;
      }

      // Core crisp foreground with theme glow
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = isPlaying ? 24 : 16;
      ctx.fillText(cleanText, cx, cy);
      ctx.shadowBlur = 0;

      // Trajectory guide line
      if (isPlaying) {
        const lineLen = Math.min(w * 0.6, 260);
        const lineOffset = Math.sin(animTime * 3) * 30;
        ctx.beginPath();
        ctx.moveTo(cx - lineLen / 2 + lineOffset, cy + baseFontSize * 0.75);
        ctx.lineTo(cx + lineLen / 2 + lineOffset, cy + baseFontSize * 0.75);
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Subtitle technical tag
      ctx.font = "600 11px monospace";
      ctx.fillStyle = theme.accent;
      ctx.fillText(`60.0 FPS • ${theme.name} • SPRING PHYSICS`, cx, cy + baseFontSize * 0.75 + 24);
  } else if (activeStyle === "3D Isometric") {
    ctx.save();
    ctx.translate(cx, cy - 10);
    ctx.rotate(isPlaying ? animTime * 0.55 : 0.2);

    const size = 68;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.strokeStyle = i % 2 === 0 ? theme.primary : theme.secondary;
      ctx.lineWidth = 2;
      const s = size - i * 15;
      ctx.strokeRect(-s, -s, s * 2, s * 2);
    }

    const pulse = isPlaying ? (Math.sin(animTime * 3) + 1) * 0.5 : 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14 + pulse * 7, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Central Monogram
    ctx.font = "bold 15px -apple-system, sans-serif";
    ctx.fillStyle = "#0a0c14";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cleanText ? cleanText.charAt(0) : "3D", 0, 1);
    ctx.restore();

    ctx.font = "600 11px monospace";
    ctx.fillStyle = theme.accent;
    ctx.textAlign = "center";
    ctx.fillText(
      cleanText ? `ISOMETRIC 3D MATRIX // ${cleanText}` : "ISOMETRIC 3D MATRIX // READY",
      cx,
      cy + 100
    );
  } else if (activeStyle === "Logo Reveal") {
    const radius = 64;
    const progress = isPlaying ? (animTime * 0.75) % 1 : 1;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + progress * Math.PI * 2;

    // Outer neon glow arc
    ctx.beginPath();
    ctx.arc(cx, cy - 12, radius, startAngle, endAngle);
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 22;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Counter-rotating inner ring
    const innerProgress = 1 - progress;
    ctx.beginPath();
    ctx.arc(cx, cy - 12, radius * 0.75, Math.PI / 2, Math.PI / 2 + innerProgress * Math.PI * 2);
    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();

    // Inner monogram badge
    ctx.font = "bold 26px -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cleanText ? cleanText.slice(0, 3) : "AG", cx, cy - 12);

    if (cleanText) {
      // Full Brand Title Below
      ctx.font = "bold 14px -apple-system, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(cleanText, cx, cy + 74);
    }

    ctx.font = "600 11px monospace";
    ctx.fillStyle = theme.accent;
    ctx.fillText(
      cleanText ? `VECTOR LOGO REVEAL // ${theme.name}` : `VECTOR LOGO REVEAL // STANDBY`,
      cx,
      cy + (cleanText ? 96 : 74)
    );
  } else if (activeStyle === "Abstract VFX") {
    const points = 50;
    const baseRadius = 56;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const theta = (i / points) * Math.PI * 2;
      const noise = isPlaying
        ? Math.sin(theta * 3 + animTime * 4) * 12 + Math.cos(theta * 5 - animTime * 2) * 7
        : Math.sin(theta * 3) * 8;
      const r = baseRadius + noise;
      const x = cx + Math.cos(theta) * r;
      const y = cy - 10 + Math.sin(theta) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const fluidGrad = ctx.createLinearGradient(cx - 60, cy - 70, cx + 60, cy + 50);
    fluidGrad.addColorStop(0, theme.secondary);
    fluidGrad.addColorStop(0.5, theme.glow);
    fluidGrad.addColorStop(1, theme.primary);
    ctx.fillStyle = fluidGrad;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 32;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (cleanText) {
      // Glowing overlay text
      ctx.font = "bold 16px -apple-system, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(cleanText, cx, cy - 10);
    }

    ctx.font = "600 11px monospace";
    ctx.fillStyle = theme.accent;
    ctx.fillText(
      cleanText ? `HARMONIC PLASMA DYNAMICS // ${theme.name}` : `HARMONIC PLASMA DYNAMICS // STANDBY`,
      cx,
      cy + 100
    );
  } else {
    // UI & Lottie Motion
    const barWidth = 26;
    const totalBars = 7;
    const spacing = 8;
    const totalW = totalBars * barWidth + (totalBars - 1) * spacing;
    const startX = cx - totalW / 2;

    for (let i = 0; i < totalBars; i++) {
      const hOffset = isPlaying
        ? Math.sin(animTime * 3.8 + i * 0.7) * 34 + Math.cos(animTime * 2.2 + i) * 12
        : (i % 2 === 0 ? 18 : -14);
      const barH = Math.max(14, 52 + hOffset);
      const x = startX + i * (barWidth + spacing);
      const y = cy - 12 - barH / 2;

      const barGrad = ctx.createLinearGradient(x, y, x, y + barH);
      barGrad.addColorStop(0, theme.primary);
      barGrad.addColorStop(1, theme.secondary);
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, 5);
      ctx.fill();
    }

    // Centered status chip
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(cleanText ? `[ ${cleanText} ]` : "[ STANDBY RUNTIME ]", cx, cy + 72);

    ctx.font = "600 11px monospace";
    ctx.fillStyle = theme.accent;
    ctx.fillText(
      cleanText ? `PROCEDURAL LOTTIE RUNTIME // 60 FPS` : `PROCEDURAL LOTTIE RUNTIME // IDLE`,
      cx,
      cy + 94
    );
  }
}
