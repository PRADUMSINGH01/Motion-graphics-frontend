/**
 * Brand kit: the colours, type and voice a user's new videos follow while it is switched on.
 * Stored per user in localStorage (no backend endpoint yet), like the chat store. The Studio sends it with each
 * new video as a short brand guide (brandGuide); edits keep the look of the video they change.
 */

export interface BrandColor {
  id: string;
  name: string;
  value: string;
}

export interface BrandKit {
  /** New videos follow the kit only while this is on. */
  enabled: boolean;
  brandName: string;
  tagline: string;
  colors: BrandColor[];
  headingFont: string;
  bodyFont: string;
  /** One of VOICES' ids, or "". */
  voice: string;
  updatedAt: string;
}

const key = (userId: string) => `byreel.brandkit.v1:${userId}`;
const cid = () => `col-${crypto.randomUUID().slice(0, 8)}`;

/** Families the renderer can load (Google Fonts). */
export const FONT_OPTIONS = [
  "Instrument Serif",
  "Geist",
  "Inter",
  "Playfair Display",
  "Space Grotesk",
  "DM Sans",
  "Fraunces",
];

export const VOICES = [
  { id: "luxury", label: "Minimal and premium", desc: "Clean type, generous space, slow and confident moves" },
  { id: "viral", label: "High energy", desc: "Fast cuts, punchy kinetic type, strong beats" },
  { id: "technical", label: "Technical and precise", desc: "Grids, interface details, exact numbers and charts" },
  { id: "cinematic", label: "Cinematic", desc: "Atmosphere, depth and slower storytelling" },
];

export function defaultBrandKit(brandName = "My brand"): BrandKit {
  return {
    enabled: false,
    brandName,
    tagline: "",
    colors: [
      { id: cid(), name: "Ink", value: "#111110" },
      { id: cid(), name: "Paper", value: "#FCFBF7" },
      { id: cid(), name: "Accent", value: "#C5EF26" },
    ],
    headingFont: "Instrument Serif",
    bodyFont: "Geist",
    voice: "",
    updatedAt: new Date().toISOString(),
  };
}

export function loadBrandKit(userId: string, fallbackName?: string): BrandKit {
  try {
    const raw = window.localStorage.getItem(key(userId));
    if (raw) {
      const { logoDataUrl: _logo, ...parsed } = JSON.parse(raw) as Partial<BrandKit> & { logoDataUrl?: unknown };
      return { ...defaultBrandKit(fallbackName), ...parsed };
    }
  } catch {
    // ignore corrupt or blocked storage
  }
  return defaultBrandKit(fallbackName);
}

export function saveBrandKit(userId: string, kit: BrandKit): void {
  try {
    window.localStorage.setItem(key(userId), JSON.stringify({ ...kit, updatedAt: new Date().toISOString() }));
  } catch {
    // storage full or blocked
  }
}

export function newColor(): BrandColor {
  return { id: cid(), name: "Colour", value: "#8A877E" };
}

/** The guide sent with a new video while the kit is on, or null. The name shows only when the request asks. */
export function brandGuide(kit: BrandKit | null | undefined): string | null {
  if (!kit?.enabled) return null;
  const voice = VOICES.find((v) => v.id === kit.voice);
  const colours = kit.colors.filter((c) => /^#[0-9a-f]{6}$/i.test(c.value)).map((c) => `${c.name.trim() || "colour"} ${c.value}`);
  const parts = [
    colours.length ? `colours ${colours.join(", ")}` : null,
    `heading font ${kit.headingFont}, body font ${kit.bodyFont}`,
    voice ? `feel: ${voice.label.toLowerCase()} (${voice.desc.toLowerCase()})` : null,
  ].filter(Boolean);
  const name = kit.brandName.trim() ? ` for ${kit.brandName.trim()}` : "";
  return `Brand guide${name}: ${parts.join("; ")}. Use these colours and fonts; show the brand name or tagline only where the request asks for them.`;
}
