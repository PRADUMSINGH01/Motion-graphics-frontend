"use client";

import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

/**
 * Official Animagent Geometric Ribbon "M" Logo Component
 * High-definition vector graphics with multi-stop indigo, magenta, and cyan-blue gradients.
 */
export default function Logo({
  size = 36,
  className = "",
  showText = false,
  textClassName = "",
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md"
      >
        <defs>
          {/* Left Pillar Gradient: Royal Indigo & Violet */}
          <linearGradient id="logoLeftPillar" x1="120" y1="150" x2="200" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="40%" stopColor="#6366F1" />
            <stop offset="75%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>

          {/* Center Diagonal Fold Gradient: Radiant Orchid / Fuchsia */}
          <linearGradient id="logoCenterFold" x1="160" y1="160" x2="330" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="35%" stopColor="#9333EA" />
            <stop offset="70%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#E879F9" />
          </linearGradient>

          {/* Right Wing Gradient: Electric Sky Cyan & Brilliant Blue */}
          <linearGradient id="logoRightWing" x1="260" y1="160" x2="385" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="30%" stopColor="#0284C7" />
            <stop offset="65%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>

          {/* Soft Dimensional Ambient Shadow */}
          <filter id="logoShadow" x="-15%" y="-15%" width="130%" height="135%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0F172A" floodOpacity="0.35" />
          </filter>
        </defs>

        <g filter="url(#logoShadow)">
          {/* 1. Left Vertical Pillar */}
          <path
            d="M 155 157
               C 139.5 157 127 169.5 127 185
               L 127 327
               C 127 342.5 139.5 355 155 355
               C 170.5 355 183 342.5 183 327
               L 183 255
               L 183 185
               C 183 169.5 170.5 157 155 157 Z"
            fill="url(#logoLeftPillar)"
          />

          {/* 2. Right Wing Pillar */}
          <path
            d="M 357 157
               C 372.5 157 385 169.5 385 185
               L 385 327
               C 385 342.5 372.5 355 357 355
               C 341.5 355 329 342.5 329 327
               L 329 250
               L 266 218
               L 329 185
               C 329 169.5 341.5 157 357 157 Z"
            fill="url(#logoRightWing)"
          />

          {/* 3. Center Fold Ribbon */}
          <path
            d="M 155 157
               C 165 157 174 162 179 170
               L 266 218
               L 329 250
               L 329 327
               C 329 330 328.5 333 327.5 336
               L 183 255
               L 183 185
               C 183 173 173 159 155 157 Z"
            fill="url(#logoCenterFold)"
          />

          {/* 4. Subtle Crease Separation */}
          <line
            x1="329"
            y1="250"
            x2="329"
            y2="327"
            stroke="rgba(0, 0, 0, 0.14)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {showText && (
        <div className={`flex items-center gap-2 ${textClassName}`}>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors font-sans">
            Animagent
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-400/30">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
