"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeMode = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "animagent_theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      const initialTheme = stored && ["dark", "light", "system"].includes(stored) ? stored : "dark";
      setThemeState(initialTheme);
      const initialResolved = initialTheme === "system" ? getSystemTheme() : initialTheme;
      setResolvedTheme(initialResolved);
    } catch {
      // Fallback if localStorage is inaccessible
      setThemeState("dark");
      setResolvedTheme("dark");
    }
    setMounted(true);
  }, []);

  // Update DOM and attributes when theme changes
  useEffect(() => {
    if (!mounted) return;

    const activeResolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(activeResolved);

    const root = document.documentElement;
    if (activeResolved === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme, mounted]);

  // Listen to system preference changes if theme is "system"
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const nextResolved = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        const root = document.documentElement;
        if (nextResolved === "dark") {
          root.classList.add("dark");
          root.classList.remove("light");
          root.setAttribute("data-theme", "dark");
          root.style.colorScheme = "dark";
        } else {
          root.classList.add("light");
          root.classList.remove("dark");
          root.setAttribute("data-theme", "light");
          root.style.colorScheme = "light";
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  // Sync across browser tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue as ThemeMode;
        if (["dark", "light", "system"].includes(newTheme)) {
          setThemeState(newTheme);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const currentResolved = prev === "system" ? getSystemTheme() : prev;
      return currentResolved === "dark" ? "light" : "dark";
    });
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        isDark,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
