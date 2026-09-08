"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

interface BackButtonProps {
  label?: string;
  fallbackUrl?: string;
  className?: string;
  iconClassName?: string;
  iconOnly?: boolean;
}

export default function BackButton({
  label = "Back to Studio",
  fallbackUrl = "/workspace",
  className,
  iconClassName = "w-3.5 h-3.5 text-cyan-400",
  iconOnly = false,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={
        className ||
        "inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-md px-3.5 py-1.5 rounded-xl cursor-pointer shadow-xs"
      }
      title={label}
    >
      <FiArrowLeft className={iconClassName} />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}
