#!/usr/bin/env node
// Dark mode for the hard-coded palette.
//
// Most of the app is styled with literal colours (`bg-[#fcfbf7] text-[#111110]`). This script turns
// every literal into a palette colour backed by a CSS variable, and writes app/theme-palette.css
// with each colour's light value (the literal itself) and its dark value. Re-run it after adding
// new literal colours:   npm run theme:palette
//
// Colours are role-aware, because the same literal plays different parts:
//   surf-xxxxxx  backgrounds, borders, rings, gradient stops: light surfaces turn dark; dark
//                surfaces (ink buttons, panels) stay dark, lifted a little off the page; bright
//                brand fills and saturated status colours keep their value.
//   ink-xxxxxx   text, fills, strokes, placeholders: dark text turns light; text that is already
//                light (it sits on a dark surface, which stays dark) keeps its value.
// Inside an element filled with a bright colour (the lime buttons), text keeps its light-mode value,
// so dark text on lime stays dark.
//
// Video and illustration content (Remotion compositions, canvas art, preview data) is left alone.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "app");
const OUT = path.join(APP, "theme-palette.css");

// Content, not chrome: these keep their literal colours in both themes.
const SKIP = [
  /[\\/]remotion[\\/]/,
  /SaasLaunchVideoPlayer\.tsx$/,
  /SceneArt\.tsx$/,
  /canvasLoop\.ts$/,
  /RaycastBeamsCanvas\.tsx$/,
  /SpiderNetBackground\.tsx$/,
  /landing[\\/]data\.ts$/,
  /landing[\\/]trailer\.ts$/,
  /theme-palette\.css$/,
  /globals\.css$/,
];

const INK_UTILITIES = /^(text|fill|stroke|placeholder|caret|accent|decoration)$/;

// ── colour maths (OKLCH) ──────────────────────────────────────────────────────
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToOklch(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => toLin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793661785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: Math.atan2(B, A) };
}

function oklchToRgb({ L, C, H }) {
  const A = C * Math.cos(H), B = C * Math.sin(H);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** OKLCH → hex, lowering chroma until the colour fits sRGB. */
function oklchToHex(c) {
  let { C } = c;
  for (let i = 0; i < 40; i++) {
    const rgb = oklchToRgb({ ...c, C });
    if (rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4)) {
      return rgb.map((v) => Math.round(Math.min(1, Math.max(0, fromLin(v))) * 255).toString(16).padStart(2, "0")).join("");
    }
    C *= 0.9;
  }
  return oklchToHex({ ...c, C: 0 });
}

// Lightness in the light theme → lightness in the dark theme (monotone, read between the points).
// Cream paper (0.99) → page (0.155); borders (0.89) → 0.27; muted text (0.54) → 0.65; ink (0.18) → 0.93.
const FLIP = [
  [1.0, 0.19], [0.99, 0.19], [0.97, 0.205], [0.95, 0.22], [0.92, 0.255], [0.89, 0.295], [0.8, 0.39],
  [0.7, 0.5], [0.63, 0.57], [0.54, 0.65], [0.44, 0.74], [0.35, 0.82], [0.29, 0.86], [0.18, 0.93], [0.1, 0.95], [0, 0.97],
];
function flipL(L) {
  for (let i = 1; i < FLIP.length; i++) {
    const [l0, d0] = FLIP[i - 1], [l1, d1] = FLIP[i];
    if (L <= l0 && L >= l1) return d0 + ((L - l0) / (l1 - l0)) * (d1 - d0);
  }
  return FLIP.at(-1)[1];
}

const isBright = ({ L, C }) => C >= 0.12 && L >= 0.72; // lime and other brand fills
const isSaturatedMid = ({ L, C }) => C >= 0.1 && L >= 0.35 && L < 0.72; // red / blue buttons and badges

/** Dark value of a colour used as a surface (background, border, ring, gradient stop). */
function surfDark(hex) {
  const c = hexToOklch(hex);
  if (hex === "000000" || isBright(c) || isSaturatedMid(c)) return hex;
  if (hex === "ffffff") return oklchToHex({ L: 0.235, C: 0.004, H: c.H }); // cards sit just above the page
  if (c.L >= 0.35) return oklchToHex({ L: flipL(c.L), C: c.C * 0.6, H: c.H });
  return oklchToHex({ L: Math.min(0.42, Math.max(0.24, c.L + 0.12)), C: c.C, H: c.H }); // dark surface: lifted
}

/** Dark value of a colour used for text, icons and strokes. */
function inkDark(hex) {
  const c = hexToOklch(hex);
  if (c.L >= 0.6) return hex; // already light: it sits on a dark surface, which stays dark
  let L = flipL(c.L);
  if (c.C > 0.05) L = Math.max(L, 0.72); // coloured text (red, dark lime) stays readable
  return oklchToHex({ L, C: c.C, H: c.H });
}

/** Grey scales shared by text and surfaces (slate-500 …): a plain lightness flip. */
const greyDark = (hex) => {
  const c = hexToOklch(hex);
  return oklchToHex({ L: flipL(c.L), C: c.C, H: c.H });
};

/**
 * CSS custom properties (landing.css's --lp-ink, --lp-paper …) feed text and surfaces alike: a
 * plain lightness flip, so ink and paper swap places; bright and saturated colours keep their value.
 */
const flipDark = (hex) => {
  const c = hexToOklch(hex);
  return hex === "000000" || isBright(c) || isSaturatedMid(c) ? hex : greyDark(hex);
};

// ── rewrite sources ──────────────────────────────────────────────────────────
const norm = (h) => (h.length === 3 ? h.split("").map((x) => x + x).join("") : h).toLowerCase();
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|ts|css)$/.test(e.name) && !SKIP.some((re) => re.test(p))) files.push(p);
  }
})(APP);

const HEX = "([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])";
let changed = 0;

/** One rewrite pass over a file's text. */
function rewrite(file, s) {
  if (file.endsWith(".css")) {
    // Selectors that name a Tailwind colour class (`.bg-\[\#111110\]`) follow the class rename.
    s = s.replace(new RegExp(`\\.([a-z]+(?:-[a-z]+)*)-\\\\\\[\\\\#${HEX}\\\\\\]`, "g"), (all, util, hex) => {
      const base = util.split("-")[0];
      return `.${util}-${INK_UTILITIES.test(base) ? "ink" : "surf"}-${norm(hex)}`;
    });
    // `color:` → ink role, a custom property → flip role, every other property → surface role.
    s = s.replace(new RegExp(`([\\w-]+)(\\s*:[^;{}]*?)#${HEX}`, "g"), function rep(all, prop, mid, hex) {
      const role = prop.startsWith("--") ? "flip" : /^(color|fill|stroke|caret-color|-webkit-text-fill-color)$/.test(prop) ? "ink" : "surf";
      const out = `${prop}${mid}var(--${role}-${norm(hex)})`;
      // A value with several colours: convert the rest too.
      return new RegExp(`#${HEX}`).test(out) ? out.replace(new RegExp(`#${HEX}`, "g"), (_, h) => `var(--surf-${norm(h)})`) : out;
    });
  } else {
    // Tailwind arbitrary colour utilities: bg-[#fcfbf7] → bg-surf-fcfbf7, text-[#111110] → text-ink-111110.
    s = s.replace(new RegExp(`\\b([a-z]+(?:-[a-z]+)*)-\\[#${HEX}\\]`, "g"), (all, util, hex) => {
      const base = util.split("-")[0];
      return `${util}-${INK_UTILITIES.test(base) ? "ink" : "surf"}-${norm(hex)}`;
    });
    // Gradient text (bg-clip-text): its gradient stops are the text colour, so the ink role.
    s = s.replace(/(["'`])([^"'`]*\bbg-clip-text\b[^"'`]*)\1/g, (all, q, body) => q + body.replace(/\b(from|via|to)-surf-/g, "$1-ink-") + q);
    // Colours inside other arbitrary values (shadows, gradients): var(--surf-…).
    s = s.replace(new RegExp(`\\[[^\\]\\s"'\`]*#${HEX}[^\\]\\s"'\`]*\\]`, "g"), (all) =>
      all.replace(new RegExp(`#${HEX}`, "g"), (_, h) => `var(--surf-${norm(h)})`),
    );
    // Opaque white surfaces (cards, inputs, page fades) flip; white text and translucent white
    // (glass on dark sections) stay white.
    s = s.replace(/(?<=^|[\s"'`])((?:[\w-]+:)*)(bg|from|via|to)-white(?![\w/-])/g, "$1$2-surf-ffffff");
    // Inline styles: literal colours inside style={{ … }}.
    s = s.replace(/style=\{\{[^{}]*\}\}/g, (block) =>
      block.replace(new RegExp(`(\\w+)(\\s*:\\s*)(["'])#${HEX}\\3`, "g"), (all, prop, sep, q, hex) => {
        const role = /color|fill|stroke/i.test(prop) && !/background|border/i.test(prop) ? "ink" : "surf";
        return `${prop}${sep}${q}var(--${role}-${norm(hex)})${q}`;
      }),
    );
  }
  return s;
}

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  // Until nothing changes, so one run leaves no literal behind (overlapping matches need a second pass).
  let s = before;
  for (let pass = 0, prev; pass < 5 && s !== prev; pass++) [prev, s] = [s, rewrite(file, s)];
  if (s !== before) {
    fs.writeFileSync(file, s);
    changed++;
  }
}

// The grey scales in globals.css (text-zinc-500, bg-slate-100 …) flip as a plain grey ramp.
const globalsFile = path.join(APP, "globals.css");
let globals = fs.readFileSync(globalsFile, "utf8");
const greys = new Set();
globals = globals.replace(new RegExp(`(--color-(?:slate|zinc|gray|neutral)-\\d+:\\s*)(?:#${HEX}|var\\(--grey-([0-9a-f]{6})\\))`, "g"), (all, head, hex, existing) => {
  const h = existing || norm(hex);
  greys.add(h);
  return `${head}var(--grey-${h})`;
});
globals = globals.replace(/(--color-button-primary:\s*)#111110/, "$1var(--surf-111110)");
if (!/@import "\.\/theme-palette\.css";/.test(globals)) {
  globals = globals.replace(/(@import "tailwindcss";\s*\n)/, `$1@import "./theme-palette.css";\n`);
}
fs.writeFileSync(globalsFile, globals);

// ── collect the palette and write theme-palette.css ─────────────────────────
const surf = new Set(["ffffff", "111110"]);
const ink = new Set();
const flip = new Set();
for (const file of [...files, globalsFile]) {
  const s = fs.readFileSync(file, "utf8");
  for (const m of s.matchAll(/(?:--|\b)surf-([0-9a-f]{6})\b/g)) surf.add(m[1]);
  for (const m of s.matchAll(/(?:--|\b)ink-([0-9a-f]{6})\b/g)) ink.add(m[1]);
  for (const m of s.matchAll(/--flip-([0-9a-f]{6})\b/g)) flip.add(m[1]);
}
const sorted = (set) => [...set].sort();
const brightSurf = sorted(surf).filter((h) => isBright(hexToOklch(h)));

const lines = [
  "/* Generated by scripts/dark-palette.mjs: npm run theme:palette. Do not edit by hand. */",
  "/* Every literal colour of the UI as a variable: its light value, then its dark value. */",
  "",
  "@theme inline {",
  ...sorted(surf).map((h) => `  --color-surf-${h}: var(--surf-${h});`),
  ...sorted(ink).map((h) => `  --color-ink-${h}: var(--ink-${h});`),
  "}",
  "",
  ":root {",
  ...sorted(surf).map((h) => `  --surf-${h}: #${h};`),
  ...sorted(ink).map((h) => `  --ink-${h}: #${h};`),
  ...sorted(greys).map((h) => `  --grey-${h}: #${h};`),
  ...sorted(flip).map((h) => `  --flip-${h}: #${h};`),
  "}",
  "",
  "html.dark {",
  ...sorted(surf).map((h) => `  --surf-${h}: #${surfDark(h)};`),
  ...sorted(ink).map((h) => `  --ink-${h}: #${inkDark(h)};`),
  ...sorted(greys).map((h) => `  --grey-${h}: #${greyDark(h)};`),
  ...sorted(flip).map((h) => `  --flip-${h}: #${flipDark(h)};`),
  "}",
  "",
  "/* Text keeps its light-mode colour on a bright fill (dark text on the lime buttons). The utilities",
  "   read --color-ink-*, which <html> resolves once, so both names are reset here. */",
  `html.dark :is(${brightSurf.flatMap((h) => [`[class~="bg-surf-${h}"]`, `[class~="hover:bg-surf-${h}"]:hover`]).join(", ")}) {`,
  ...sorted(ink).flatMap((h) => [`  --ink-${h}: #${h};`, `  --color-ink-${h}: #${h};`]),
  "}",
  "",
];
fs.writeFileSync(OUT, lines.join("\n"));
console.log(`rewrote ${changed} file(s); palette: ${surf.size} surface, ${ink.size} ink, ${flip.size} flip, ${greys.size} grey colours → ${path.relative(ROOT, OUT)}`);
