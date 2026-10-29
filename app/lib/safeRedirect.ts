/**
 * Validate a `?redirect=` target before navigating to it. Only a same-origin, absolute path is
 * allowed — rejects protocol-relative ("//evil.com") and absolute URLs so a crafted login link
 * can't bounce a signed-in user off-site.
 */
export function safeRedirect(target: string | null | undefined, fallback = "/dashboard"): string {
  if (!target) return fallback;
  if (!target.startsWith("/") || target.startsWith("//")) return fallback;
  if (target.includes("://")) return fallback;
  return target;
}
