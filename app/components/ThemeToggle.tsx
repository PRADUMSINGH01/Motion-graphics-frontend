"use client";

import React, { useState, useEffect, memo } from "react";
import { IconSun, IconMoon } from "./Icons";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  variant?: "navbar" | "studio" | "minimal";
  showLabel?: boolean;
}

function ThemeToggle({
  className = "",
  variant = "navbar",
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className={`inline-flex w-8 h-8 shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "studio") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`group inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-line bg-surface text-xs font-medium text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors cursor-pointer ${className}`}
        title={label}
        aria-label={label}
      >
        {isDark ? (
          <IconSun className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <IconMoon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-12" />
        )}
        {showLabel && <span className="select-none">{isDark ? "Light" : "Dark"}</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-md text-fg-muted hover:text-fg hover:bg-fg/5 transition-colors cursor-pointer select-none ${className}`}
      title={label}
      aria-label={label}
    >
      <IconSun
        className={`w-4 h-4 absolute transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        }`}
      />
      <IconMoon
        className={`w-4 h-4 absolute transition-all duration-300 ${
          !isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        }`}
      />
    </button>
  );
}

export default memo(ThemeToggle);
