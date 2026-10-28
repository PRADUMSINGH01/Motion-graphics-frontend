/**
 * Asset library: logos, footage, stills and audio a user keeps for their videos.
 * Metadata lives in localStorage per user. Small images are kept inline as a data URL for
 * a preview; anything larger stores metadata only (real uploads need a backend blob store).
 */

export type AssetKind = "image" | "video" | "audio" | "font" | "other";

export interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  /** Bytes, when known. */
  size: number;
  /** Inline preview for small images only. */
  previewDataUrl?: string;
  /** External source, when added by URL. */
  sourceUrl?: string;
  createdAt: string;
}

const keyFor = (userId: string) => `byreel.assets.v1:${userId}`;
const MAX_ASSETS = 60;
/** Only inline images up to this size so we don't blow the localStorage quota. */
export const MAX_INLINE_BYTES = 320 * 1024;

export function createAssetId(): string {
  return `a-${crypto.randomUUID()}`;
}

export function kindFromType(type: string, name: string): AssetKind {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (/font|woff|ttf|otf/i.test(type) || /\.(woff2?|ttf|otf)$/i.test(name)) return "font";
  return "other";
}

export function loadAssets(userId: string): Asset[] {
  try {
    const raw = window.localStorage.getItem(keyFor(userId));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Asset[]) : [];
  } catch {
    return [];
  }
}

export function saveAssets(userId: string, assets: Asset[]): boolean {
  try {
    window.localStorage.setItem(keyFor(userId), JSON.stringify(assets.slice(0, MAX_ASSETS)));
    return true;
  } catch {
    return false; // quota exceeded or blocked
  }
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Read a File into an Asset, inlining a preview only for small images. */
export function fileToAsset(file: File): Promise<Asset> {
  const base: Asset = {
    id: createAssetId(),
    name: file.name,
    kind: kindFromType(file.type, file.name),
    size: file.size,
    createdAt: new Date().toISOString(),
  };
  if (base.kind !== "image" || file.size > MAX_INLINE_BYTES) {
    return Promise.resolve(base);
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ ...base, previewDataUrl: typeof reader.result === "string" ? reader.result : undefined });
    reader.onerror = () => resolve(base);
    reader.readAsDataURL(file);
  });
}
