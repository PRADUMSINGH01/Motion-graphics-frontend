export type Variant = "device" | "type" | "cards" | "chart" | "logo";

export interface Pal {
  variant: Variant;
  bg: string;
  glow: string;
  fg: string;
  panel: string;
  line: string;
  acc: string;
}

/** One palette per demo scene; the variant decides which artwork is drawn. */
export const PAL: Pal[] = [
  { variant: "device", bg: "linear-gradient(155deg,#F59E5C 0%,#C2410C 55%,#7A2606 100%)", glow: "#FFD9B8", fg: "#FFFFFF", panel: "#FFFFFF", line: "#F7E8DC", acc: "#9A3412" },
  { variant: "type", bg: "linear-gradient(160deg,#14141C 0%,#0B0B10 100%)", glow: "#6C5CFF", fg: "#FFFFFF", panel: "#1A1A22", line: "#2A2A35", acc: "#9D90FF" },
  { variant: "cards", bg: "linear-gradient(160deg,#C9F5DF 0%,#63D6A6 100%)", glow: "#F0FFF8", fg: "#0B0B0F", panel: "#FFFFFF", line: "#E4F5EC", acc: "#0B7A55" },
  { variant: "chart", bg: "linear-gradient(160deg,#C4D8FF 0%,#4F7DFF 100%)", glow: "#E8F0FF", fg: "#0B0B0F", panel: "#FFFFFF", line: "#E4ECFF", acc: "#2F5BFF" },
  { variant: "logo", bg: "linear-gradient(160deg,#E4DAFF 0%,#9B87F5 100%)", glow: "#F4EFFF", fg: "#0B0B0F", panel: "#FFFFFF", line: "#E9E2FF", acc: "#0B0B0F" },
];

export type FormatId = "launch" | "broll" | "short";

export const FORMATS: { id: FormatId; label: string }[] = [
  { id: "launch", label: "Launch video" },
  { id: "broll", label: "B-roll pack" },
  { id: "short", label: "Short-form" },
];

/** [timecode, caption, label] per scene */
export const SETS: Record<
  FormatId,
  { ratio: string; duration: string; scenes: [string, string, string][] }
> = {
  launch: {
    ratio: "16:9",
    duration: "0:32",
    scenes: [
      ["00:00", "Meet your new workspace.", "Hook"],
      ["00:04", "Hours of work, gone.", "Problem"],
      ["00:10", "Everything in one place.", "Feature"],
      ["00:18", "See what is working.", "Proof"],
      ["00:26", "Live today.", "Call to action"],
    ],
  },
  broll: {
    ratio: "16:9",
    duration: "0:28",
    scenes: [
      ["00:00", "Dashboard pan", "Slow pan"],
      ["00:05", "Cursor flow", "Click-through"],
      ["00:11", "Feature close-up", "Zoom"],
      ["00:17", "Metrics reveal", "Chart"],
      ["00:23", "byreel", "End card"],
    ],
  },
  short: {
    ratio: "9:16",
    duration: "0:20",
    scenes: [
      ["00:00", "Stop scrolling.", "Hook"],
      ["00:03", "Hours to minutes.", "Reveal"],
      ["00:08", "It does this.", "Feature"],
      ["00:13", "Watch the numbers.", "Proof"],
      ["00:17", "Link in bio.", "Call to action"],
    ],
  },
};

const GALLERY_CAPTIONS = [
  "Meet your new workspace.",
  "Ship it today.",
  "Everything in one place.",
  "See what is working.",
  "Live today.",
];

const STRIP_ORDER = [0, 1, 2, 3, 4, 1, 3, 0, 4, 2];

/** The marquee film strip: the order repeated twice so the -50% loop is seamless. */
export const STRIP = [...STRIP_ORDER, ...STRIP_ORDER].map((gi, k) => ({
  pal: PAL[gi],
  caption: GALLERY_CAPTIONS[gi],
  progressDelay: `${-(k * 0.8)}s`,
}));

/** 64 deterministic waveform bars (no Math.random, so server and client agree). */
export const BARS = Array.from({ length: 64 }, (_, i) => ({
  h: `${30 + ((i * 37) % 70)}%`,
  d: `${(-((i * 0.13) % 1.3)).toFixed(2)}s`,
}));

export const BARS6 = [38, 56, 44, 72, 62, 90].map((h, i) => ({
  h: `${h}%`,
  d: `${i * 0.15}s`,
}));
