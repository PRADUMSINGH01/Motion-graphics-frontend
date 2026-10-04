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
  iconClassName = "w-3.5 h-3.5",
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
        "btn btn-sm btn-ghost -ml-3"
      }
      title={label}
    >
      <FiArrowLeft className={iconClassName} />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}
