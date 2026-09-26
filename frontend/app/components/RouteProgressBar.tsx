"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Whenever route changes, trigger completion animation
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on links to start loader immediately
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (
        target &&
        target.href &&
        target.href.startsWith(window.location.origin) &&
        !target.target &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        target.pathname !== window.location.pathname
      ) {
        setLoading(true);
        setProgress(35);
        setTimeout(() => setProgress(75), 150);
      }
    };

    document.addEventListener("click", handleLinkClick, { passive: true });
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none transition-all duration-300 ease-out"
      style={{
        opacity: progress === 100 ? 0 : 1,
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 shadow-[0_0_12px_#00f0ff,0_0_24px_#38bdf8] transition-all duration-300 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Leading glowing spark beam */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-3 bg-white blur-[2px] rounded-full opacity-80" />
      </div>
    </div>
  );
}
