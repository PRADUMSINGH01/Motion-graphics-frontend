export type StylePreset =
  | "Kinetic Typography"
  | "3D Isometric"
  | "Logo Reveal"
  | "Abstract VFX"
  | "UI & Lottie";

export type AspectRatio = "16:9" | "9:16" | "1:1";
export type WorkspaceView = "prompt" | "vectorizer" | "usage" | "billing";
export type BillingInterval = "monthly" | "annual";
export type PlanTier = "free" | "creator" | "pro" | "enterprise";
export type CharEffect = "kinetic_split" | "neon_glow" | "wave" | "glitch" | "isometric";

export interface ProjectItem {
  id: string;
  name: string;
  category: StylePreset;
  duration: number;
  prompt: string;
  text: string;
  updatedAt: string;
}

export interface PricingTier {
  id: PlanTier;
  name: string;
  badge: string | null;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  highlighted: boolean;
  features: string[];
}

export interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
}

export interface InspirationPreset {
  title: string;
  category: StylePreset;
  text: string;
  prompt: string;
  icon: string;
}
