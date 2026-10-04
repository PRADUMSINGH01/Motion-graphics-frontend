"use client";

import React from "react";
import { FiZap, FiType, FiBarChart2, FiTrendingUp, FiFilm } from "react-icons/fi";

const SUGGESTION_CARDS = [
  {
    icon: FiType,
    title: "Kinetic Typography",
    prompt: "Create a kinetic typography short on the power of compound interest",
  },
  {
    icon: FiBarChart2,
    title: "Data Explainer",
    prompt: "Data explainer short on why 90% of startups fail in year one",
  },
  {
    icon: FiTrendingUp,
    title: "Tech News",
    prompt: "60-second vertical tech news video on how AI is changing software",
  },
  {
    icon: FiFilm,
    title: "Product Promo",
    prompt: "Product promo for a minimalist habit tracker app, clean and premium",
  },
];

export default function EmptyState({
  userName,
  onSelectSuggestion,
}: {
  userName: string;
  onSelectSuggestion: (prompt: string) => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = userName.split(" ")[0];

  return (
    <div className="flex-1 overflow-y-auto min-h-0 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6 py-10 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[11px] font-medium text-[var(--text-secondary)] mb-5">
          <FiZap size={11} className="text-[var(--accent-primary)]" />
          Motion graphics, from one prompt
        </span>

        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-[var(--text-primary)] mb-2">
          {greeting}, {firstName}.
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mb-8">
          Describe a short and I&apos;ll plan the shots, resolve assets, and compose the motion —
          ready to render in seconds.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
          {SUGGESTION_CARDS.map(({ icon: Icon, title, prompt }) => (
            <button
              key={title}
              onClick={() => onSelectSuggestion(prompt)}
              className="group flex items-start gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)]
                bg-[var(--surface-card)] hover:border-[var(--border-strong)]
                hover:bg-[var(--surface-glass)] transition-all duration-200 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[var(--accent-primary)]/20">
                <Icon size={14} className="text-[var(--accent-primary)]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-semibold text-[var(--text-primary)] mb-0.5">
                  {title}
                </span>
                <span className="block text-[11.5px] leading-snug text-[var(--text-muted)] line-clamp-2">
                  {prompt}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
