/**
 * Lightweight inline SVG icons — replaces `react-icons/fi` to avoid
 * importing the entire Feather icon set (~150 KB gzipped).
 *
 * Each icon is a pure SVG with zero runtime dependencies.
 * Props mirror the standard React SVG element API.
 */
import React, { memo } from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const svg = (d: string, props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d={d} />
  </svg>
);

/* Multi-path helper for icons that need more than one <path>/<element> */
const svgMulti = (children: React.ReactNode, props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

// ── Navigation & Actions ──────────────────────────────────────

export const IconArrowRight = memo((p: IconProps) =>
  svg("M5 12h14M12 5l7 7-7 7", p)
);
IconArrowRight.displayName = "IconArrowRight";

export const IconArrowUpRight = memo((p: IconProps) =>
  svg("M7 17L17 7M7 7h10v10", p)
);
IconArrowUpRight.displayName = "IconArrowUpRight";

export const IconChevronDown = memo((p: IconProps) =>
  svg("M6 9l6 6 6-6", p)
);
IconChevronDown.displayName = "IconChevronDown";

export const IconMenu = memo((p: IconProps) =>
  svg("M3 12h18M3 6h18M3 18h18", p)
);
IconMenu.displayName = "IconMenu";

export const IconX = memo((p: IconProps) =>
  svg("M18 6L6 18M6 6l12 12", p)
);
IconX.displayName = "IconX";

// ── Auth & User ───────────────────────────────────────────────

export const IconLogIn = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </>,
    p
  )
);
IconLogIn.displayName = "IconLogIn";

export const IconLogOut = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>,
    p
  )
);
IconLogOut.displayName = "IconLogOut";

export const IconUser = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>,
    p
  )
);
IconUser.displayName = "IconUser";

// ── Features & Status ─────────────────────────────────────────

export const IconZap = memo((p: IconProps) =>
  svg("M13 2L3 14h9l-1 8 10-12h-9l1-8", p)
);
IconZap.displayName = "IconZap";

export const IconPlay = memo((p: IconProps) =>
  svgMulti(<polygon points="5 3 19 12 5 21 5 3" />, p)
);
IconPlay.displayName = "IconPlay";

export const IconDownload = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>,
    p
  )
);
IconDownload.displayName = "IconDownload";

export const IconCode = memo((p: IconProps) =>
  svg("M16 18l6-6-6-6M8 6l-6 6 6 6", p)
);
IconCode.displayName = "IconCode";

export const IconLayers = memo((p: IconProps) =>
  svgMulti(
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>,
    p
  )
);
IconLayers.displayName = "IconLayers";

export const IconCheck = memo((p: IconProps) =>
  svg("M20 6L9 17l-5-5", p)
);
IconCheck.displayName = "IconCheck";

export const IconCheckCircle = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </>,
    p
  )
);
IconCheckCircle.displayName = "IconCheckCircle";

export const IconShield = memo((p: IconProps) =>
  svg("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", p)
);
IconShield.displayName = "IconShield";

export const IconStar = memo((p: IconProps) =>
  svg(
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    p
  )
);
IconStar.displayName = "IconStar";

export const IconTrendingUp = memo((p: IconProps) =>
  svgMulti(
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>,
    p
  )
);
IconTrendingUp.displayName = "IconTrendingUp";

// ── Content & Media ───────────────────────────────────────────

export const IconCompass = memo((p: IconProps) =>
  svgMulti(
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>,
    p
  )
);
IconCompass.displayName = "IconCompass";

export const IconTag = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </>,
    p
  )
);
IconTag.displayName = "IconTag";

export const IconKey = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </>,
    p
  )
);
IconKey.displayName = "IconKey";

export const IconFileText = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </>,
    p
  )
);
IconFileText.displayName = "IconFileText";

export const IconDatabase = memo((p: IconProps) =>
  svgMulti(
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>,
    p
  )
);
IconDatabase.displayName = "IconDatabase";

export const IconBox = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </>,
    p
  )
);
IconBox.displayName = "IconBox";

export const IconTerminal = memo((p: IconProps) =>
  svgMulti(
    <>
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </>,
    p
  )
);
IconTerminal.displayName = "IconTerminal";

// ── Social ────────────────────────────────────────────────────

export const IconGithub = memo((p: IconProps) =>
  svg(
    "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
    p
  )
);
IconGithub.displayName = "IconGithub";

export const IconTwitter = memo((p: IconProps) =>
  svg(
    "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    p
  )
);
IconTwitter.displayName = "IconTwitter";

export const IconLinkedin = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>,
    p
  )
);
IconLinkedin.displayName = "IconLinkedin";

export const IconYoutube = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </>,
    p
  )
);
IconYoutube.displayName = "IconYoutube";

// ── Theme ─────────────────────────────────────────────────────

export const IconSun = memo((p: IconProps) =>
  svgMulti(
    <>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </>,
    p
  )
);
IconSun.displayName = "IconSun";

export const IconMoon = memo((p: IconProps) =>
  svg("M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z", p)
);
IconMoon.displayName = "IconMoon";

// ── Workspace / Studio ────────────────────────────────────────

export const IconType = memo((p: IconProps) =>
  svgMulti(
    <>
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </>,
    p
  )
);
IconType.displayName = "IconType";

export const IconActivity = memo((p: IconProps) =>
  svg("M22 12h-4l-3 9L9 3l-3 9H2", p)
);
IconActivity.displayName = "IconActivity";

export const IconCreditCard = memo((p: IconProps) =>
  svgMulti(
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>,
    p
  )
);
IconCreditCard.displayName = "IconCreditCard";

export const IconSliders = memo((p: IconProps) =>
  svgMulti(
    <>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </>,
    p
  )
);
IconSliders.displayName = "IconSliders";

export const IconAward = memo((p: IconProps) =>
  svgMulti(
    <>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </>,
    p
  )
);
IconAward.displayName = "IconAward";

export const IconAlertTriangle = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>,
    p
  )
);
IconAlertTriangle.displayName = "IconAlertTriangle";

export const IconXCircle = memo((p: IconProps) =>
  svgMulti(
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </>,
    p
  )
);
IconXCircle.displayName = "IconXCircle";

export const IconSearch = memo((p: IconProps) =>
  svgMulti(
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>,
    p
  )
);
IconSearch.displayName = "IconSearch";

export const IconSparkles = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
      <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
    </>,
    p
  )
);
IconSparkles.displayName = "IconSparkles";

export const IconClipboard = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </>,
    p
  )
);
IconClipboard.displayName = "IconClipboard";

export const IconLayout = memo((p: IconProps) =>
  svgMulti(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </>,
    p
  )
);
IconLayout.displayName = "IconLayout";

export const IconApple = memo((p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...p}
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.96c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.72-.88 2.76 1.01.08 2.03-.51 2.58-1.26z" />
  </svg>
));
IconApple.displayName = "IconApple";

export const IconCommand = memo((p: IconProps) =>
  svgMulti(
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />,
    p
  )
);
IconCommand.displayName = "IconCommand";

export const IconCalculator = memo((p: IconProps) =>
  svgMulti(
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="18" />
      <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
    </>,
    p
  )
);
IconCalculator.displayName = "IconCalculator";

export const IconSmile = memo((p: IconProps) =>
  svgMulti(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </>,
    p
  )
);
IconSmile.displayName = "IconSmile";

export const IconMaximize = memo((p: IconProps) =>
  svgMulti(
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </>,
    p
  )
);
IconMaximize.displayName = "IconMaximize";

export const IconWindows = memo((p: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...p}
  >
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.901-1.799" />
  </svg>
));
IconWindows.displayName = "IconWindows";
