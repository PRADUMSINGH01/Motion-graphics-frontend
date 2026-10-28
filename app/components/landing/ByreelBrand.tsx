"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ByreelLogoProps {
  size?: number;
  height?: number;
  className?: string;
  theme?: "light" | "dark";
  showText?: boolean;
  withTagline?: boolean;
  priority?: boolean;
}

/**
 * Official byreel brand logo component using the official brand asset:
 * Glossy neon-lime & black 3D folded ribbon mark + bold geometric "byreel" wordmark.
 */
export function ByreelLogo({
  size = 32,
  height,
  className = "",
  theme = "light",
  showText = true,
  withTagline = false,
  priority = false,
}: ByreelLogoProps) {
  const actualHeight = height || size;

  // If user wants full lockup including text & tagline:
  if (showText) {
    const width = Math.round(actualHeight * 3.0);
    const lockup = (src: string, cls: string) => (
      <Image
        src={src}
        alt="byreel"
        width={width}
        height={actualHeight}
        priority={priority}
        className={`h-auto object-contain ${cls}`}
        style={{ height: actualHeight, width: "auto" }}
      />
    );

    // theme="dark" sits on a surface that is dark in both themes (the white wordmark always);
    // theme="light" sits on page chrome, which turns dark with the site theme, so it follows it.
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        {theme === "dark" ? (
          lockup("/byreel-logo-white.png", "")
        ) : (
          <>
            {lockup("/byreel-logo.png", "dark:hidden")}
            {lockup("/byreel-logo-white.png", "hidden dark:block")}
          </>
        )}
      </div>
    );
  }

  // If user only wants the iconic 3D ribbon mark (symbol):
  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: actualHeight, height: actualHeight }}
    >
      <Image
        src="/byreel-mark.png"
        alt="byreel"
        width={actualHeight}
        height={actualHeight}
        priority={priority}
        className="object-contain w-full h-full"
      />
    </div>
  );
}

export function ByreelBrandLink({
  href = "/",
  theme = "light",
  size = 32,
}: {
  href?: string;
  theme?: "light" | "dark";
  size?: number;
}) {
  return (
    <Link href={href} aria-label="byreel home" className="inline-flex items-center">
      <ByreelLogo theme={theme} size={size} />
    </Link>
  );
}

export default ByreelLogo;
