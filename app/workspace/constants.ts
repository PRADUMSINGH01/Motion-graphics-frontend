import { InspirationPreset, PricingTier, ProjectItem } from "./types";

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "p-1",
    name: "Cyber Kinetic Velocity",
    category: "Kinetic Typography",
    duration: 5,
    prompt:
      "Kinetic typography sliding across staggered axes with glowing cyan edges and spring-damper easing",
    text: "VELOCITY",
    updatedAt: "Just now",
    palette: "cyan",
  },
  {
    id: "p-2",
    name: "Prism Glass Refraction",
    category: "3D Isometric",
    duration: 6,
    prompt:
      "Interlocking frosted glass cubes rotating on a 45-degree isometric gimbal with chromatic dispersion",
    text: "REFRACTION",
    updatedAt: "15m ago",
    palette: "purple",
  },
  {
    id: "p-3",
    name: "Quantum Logo Arc",
    category: "Logo Reveal",
    duration: 4,
    prompt:
      "Dual vector arcs rotating synchronously with high-voltage neon pulse and particle corona",
    text: "ORBITAL",
    updatedAt: "1h ago",
    palette: "blue",
  },
  {
    id: "p-4",
    name: "Molten Plasma VFX",
    category: "Abstract VFX",
    duration: 5,
    prompt:
      "Undulating plasma sphere with organic harmonic frequency and liquid surface turbulence",
    text: "NEBULA",
    updatedAt: "3h ago",
    palette: "crimson",
  },
];

export const INSPIRATION_PRESETS: InspirationPreset[] = [
  {
    title: "Cyberpunk Kinetic",
    category: "Kinetic Typography",
    text: "VELOCITY",
    prompt:
      "Kinetic typography sliding across staggered axes with glowing cyan edges and spring-damper easing",
    icon: "⚡",
    palette: "cyan",
  },
  {
    title: "Prism Glass 3D",
    category: "3D Isometric",
    text: "REFRACTION",
    prompt:
      "Interlocking frosted glass cubes rotating on an isometric gimbal with chromatic light dispersion",
    icon: "💎",
    palette: "purple",
  },
  {
    title: "Neon Monogram",
    category: "Logo Reveal",
    text: "ORBITAL",
    prompt:
      "Circular vector arc sweeps tracing modern brand emblem with high-voltage neon cyan particle pulse",
    icon: "🌀",
    palette: "blue",
  },
  {
    title: "Plasma VFX",
    category: "Abstract VFX",
    text: "NEBULA",
    prompt:
      "Undulating plasma sphere with organic harmonic frequency and liquid surface turbulence",
    icon: "🔮",
    palette: "crimson",
  },
  {
    title: "UI & Lottie",
    category: "UI & Lottie",
    text: "SYNTHESIS",
    prompt:
      "Procedural UI audio frequency bars dancing with spring bounce and smooth damping",
    icon: "📊",
    palette: "matrix",
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free Community",
    badge: null,
    priceMonthly: 0,
    priceAnnual: 0,
    description: "Experiment with procedural motion graphics and basic SVG text animations.",
    highlighted: false,
    features: [
      "10 AI Generations / month",
      "720p 30FPS Web Preview Export",
      "Standard SVG Typography & Keyframes",
      "Community Showcase Access",
      "Shared Community GPU Queue",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    badge: null,
    priceMonthly: 29,
    priceAnnual: 22,
    description: "For freelance animators, motion designers, and indie creative creators.",
    highlighted: false,
    features: [
      "150 AI Motion Generations / month",
      "1080p 60FPS MP4 & WebM Video Export",
      "Full Lottie JSON & Web Vector Glyphs",
      "Kinetic 3D Typography & Logo Reveals",
      "Standard Cloud GPU Queue",
      "Commercial Usage & Monetization Rights",
    ],
  },
  {
    id: "pro",
    name: "Studio Pro",
    badge: "Most Popular",
    priceMonthly: 79,
    priceAnnual: 59,
    description: "For design agencies, motion studios, and production teams scaling output.",
    highlighted: true,
    features: [
      "600 AI Motion Generations / month",
      "4K Lossless 60FPS Apple ProRes & MP4",
      "Editable After Effects (.aep) Export",
      "Priority High-Speed GPU Render Cluster",
      "Advanced 3D Camera Controls & Physics",
      "Custom Brand Color Palettes & Fonts",
      "Shared Team Workspace (Up to 5 Seats)",
      "Developer API Access (60 req/min)",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: "Custom Scale",
    priceMonthly: 199,
    priceAnnual: 159,
    description: "For production houses, broadcast networks, and high-volume automated pipelines.",
    highlighted: false,
    features: [
      "10,000 Generations & Unlimited Renders",
      "Fine-Tuned AI Models on Your Brand Assets",
      "Headless API Access & Webhook Integrations",
      "Dedicated Private GPU Cluster (Zero Queue)",
      "Enterprise SLA & 99.99% Uptime Guarantee",
      "Dedicated Account Manager & 24/7 Support",
      "Custom Invoicing & SSO / SAML Security",
    ],
  },
];
