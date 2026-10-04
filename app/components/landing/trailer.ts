/**
 * The landing-page trailer. This is the one place to edit.
 *
 * `src` accepts any of:
 *   - a file in /public, e.g. "/trailer.mp4" (mp4 or webm)
 *   - a YouTube link  (watch?v=…, youtu.be/…, /embed/…, /shorts/…)
 *   - a Vimeo link    (vimeo.com/123456789)
 * Leave it `null` and the section shows a "coming soon" state with no player.
 */
export const TRAILER = {
  src: null as string | null,
  /** Optional still shown behind the play button. Without it, the animated scene reel is used. */
  poster: null as string | null,
  title: "The byreel launch film",
  /** Shown on the frame, e.g. "0:48". Optional. */
  duration: null as string | null,
};

export type TrailerSource =
  | { kind: "file"; url: string }
  | { kind: "embed"; url: string; provider: "youtube" | "vimeo" };

/** Turns the configured `src` into something the player can render, or null if unusable. */
export function parseTrailerSource(src: string | null): TrailerSource | null {
  const value = src?.trim();
  if (!value) return null;

  // Local file or any relative path
  if (value.startsWith("/")) return { kind: "file", url: value };

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/")[1];
    return id ? youtube(id) : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const id =
      url.searchParams.get("v") ??
      (["embed", "shorts", "live", "v"].includes(parts[0]) ? parts[1] : null);
    return id ? youtube(id) : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).find((p) => /^\d+$/.test(p));
    if (!id) return null;
    // Unlisted videos carry a hash: vimeo.com/123456789/abcdef1234
    const hash = url.pathname.split("/").filter(Boolean).find((p) => /^[a-f0-9]{8,}$/i.test(p) && p !== id);
    const q = new URLSearchParams({ autoplay: "1", dnt: "1" });
    if (hash) q.set("h", hash);
    return { kind: "embed", provider: "vimeo", url: `https://player.vimeo.com/video/${id}?${q}` };
  }

  // Any other absolute URL is treated as a direct video file.
  return { kind: "file", url: value };
}

function youtube(id: string): TrailerSource | null {
  if (!/^[\w-]{6,20}$/.test(id)) return null;
  const q = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1", playsinline: "1" });
  return { kind: "embed", provider: "youtube", url: `https://www.youtube-nocookie.com/embed/${id}?${q}` };
}
