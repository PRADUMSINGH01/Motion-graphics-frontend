"use client";

import React, { memo } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

function Logo({ size = 32, className = "", showText = true }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (showText) {
    const src = isDark ? "/byreel-logo-white.png" : "/byreel-logo.png";
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <Image
          src={src}
          alt="byreel"
          width={Math.round(size * 3.0)}
          height={size}
          className="h-auto object-contain"
          style={{ height: size, width: "auto" }}
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/byreel-mark.png"
        alt="byreel"
        width={size}
        height={size}
        className="object-contain w-full h-full"
        priority
      />
    </div>
  );
}

export default memo(Logo);
