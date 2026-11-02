import type { Ratio } from "../lib/chatStore";

/** A film's frame in the Studio: the render placeholder and the finished video share it, so nothing jumps. */
export function frameClass(ratio: Ratio | undefined): string {
  if (ratio === "9:16") return "aspect-[9/16] w-full max-w-[320px]";
  if (ratio === "1:1") return "aspect-square w-full max-w-[460px]";
  return "aspect-video w-full max-w-[760px]";
}
