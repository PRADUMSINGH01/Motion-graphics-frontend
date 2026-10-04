import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * The byreel brand lockup (icon + wordmark). `light.png` is the black artwork for light
 * surfaces and `darkmode.png` is the white artwork for dark surfaces; both are transparent.
 */
export function LogoLockup({
  height = 40,
  on = "light",
  priority = false,
  className,
  style,
}: {
  /** Pixel height, or "auto" to fill the available width at the artwork's own aspect ratio. */
  height?: number | "auto";
  on?: "light" | "dark";
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Image
      src={on === "light" ? "/light.png" : "/darkmode.png"}
      alt="byreel"
      // Intrinsic size = displayed size (artwork is 3:1) so Next serves a right-sized file.
      width={height === "auto" ? 1100 : Math.round(height * 3)}
      height={height === "auto" ? 367 : height}
      priority={priority}
      className={className}
      style={{ height, width: height === "auto" ? "100%" : "auto", ...style }}
    />
  );
}

/**
 * Just the icon mark, cropped from the left of the lockup. The wrapper takes its size from
 * `style` (any CSS unit), so it works inside the container-query scene artwork too.
 */
export function LogoMark({
  on = "light",
  className,
  style,
}: {
  on?: "light" | "dark";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ position: "relative", display: "block", overflow: "hidden", ...style }}
    >
      <Image
        src={on === "light" ? "/light.png" : "/darkmode.png"}
        alt=""
        fill
        sizes="120px"
        style={{ objectFit: "cover", objectPosition: "4% 50%" }}
      />
    </span>
  );
}
