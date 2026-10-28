/**
 * Brand kit: the colours, type and voice byreel applies to a user's videos.
 * Stored per user in localStorage (no backend endpoint yet), like the chat store.
 */

export interface BrandColor {
  id: string;
  name: string;
  value: string;
}

export interface BrandKit {
  brandName: string;
  tagline: string;
  colors: BrandColor[];
  headingFont: string;
  bodyFont: string;
  voice: string;
  logoDataUrl: string | null;
  updatedAt: string;
}

const key = (userId: string) => `byreel.brandkit.v1:${userId}`;
const cid = () => `col-${crypto.randomUUID().slice(0, 8)}`;

export const FONT_OPTIONS = [
  "Instrument Serif",
  "Geist",
  "Inter",
  "Playfair Display",
  "Space Grotesk",
  "Söhne",
  "Georgia",
];

export function defaultBrandKit(brandName = "My brand"): BrandKit {
  return {
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
    logoDataUrl: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadBrandKit(userId: string, fallbackName?: string): BrandKit {
  try {
    const raw = window.localStorage.getItem(key(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<BrandKit>;
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
