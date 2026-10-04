"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Official byreel Brand Logo Component
 * Crops to show only the icon mark (left portion) of the full-width logo image.
 */
function Logo({ size = 48, className = "" }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [hasThemeLogoError, setHasThemeLogoError] = useState(false);
  const themeLogo = resolvedTheme === "dark" ? "/darkmode.png" : "/light.png";
  const logoSrc = hasThemeLogoError ? "/brand-logo.png" : themeLogo;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Icon mark — cropped from wide logo to show just the symbol */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src={logoSrc}
          alt="byreel Logo"
          width={size * 4}
          height={size}
          className="object-cover object-left h-full w-auto max-w-none"
          style={{ height: size, width: "auto", maxWidth: "none" }}
          priority
          onError={() => setHasThemeLogoError(true)}
        />
      </div>

      {/* Brand wordmark */}
      <span
        className="font-semibold select-none"
        style={{
          fontSize: Math.max(16, Math.round(size * 0.6)),
          color: "var(--text-primary)",
          fontFamily: "var(--font-headline)",
          letterSpacing: "-0.035em",
        }}
      >
        byreel
      </span>
    </div>
  );
}

export default memo(Logo);
