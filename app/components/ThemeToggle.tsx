"use client";

import React, { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  variant?: "navbar" | "studio" | "minimal";
  showLabel?: boolean;
}

export default function ThemeToggle({
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
      <button
        type="button"
        className={`p-2 rounded-xl border border-transparent opacity-0 pointer-events-none ${className}`}
        aria-hidden="true"
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "studio") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer ${
          isDark
            ? "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-slate-300 hover:text-white"
            : "bg-black/[0.04] hover:bg-black/[0.08] border-black/[0.08] text-slate-700 hover:text-slate-950"
        } ${className}`}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <FiSun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <FiMoon className="w-3.5 h-3.5 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </div>
        {showLabel && (
          <span className="text-[11px] font-mono select-none">
            {isDark ? "Light" : "Dark"}
          </span>
        )}
      </button>
    );
  }

  // Default navbar variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex items-center justify-center w-8 h-8 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        isDark
          ? "bg-white/[0.04] hover:bg-white/[0.09] border-white/[0.08] hover:border-white/[0.15] text-amber-400 hover:text-amber-300 shadow-xs"
          : "bg-black/[0.04] hover:bg-black/[0.08] border-black/[0.08] hover:border-black/[0.15] text-indigo-600 hover:text-indigo-800 shadow-xs"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        <FiSun
          className={`w-4 h-4 text-amber-400 absolute transition-all duration-300 transform ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-50 pointer-events-none"
          }`}
        />
        <FiMoon
          className={`w-4 h-4 text-indigo-600 absolute transition-all duration-300 transform ${
            !isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50 pointer-events-none"
          }`}
        />
      </div>
    </button>
  );
}
