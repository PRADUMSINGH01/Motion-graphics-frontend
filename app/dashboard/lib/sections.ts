export const SECTION_IDS = [
  "dashboard",
  "overview",
  "create",
  "launches",
  "product-launch",
  "brolls",
  "your-videos",
  "templates",
  "agent-console",
  "brandkit",
  "settings",
  "account",
  "billing",
  "membership",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  dashboard: "Home",
  overview: "Home",
  create: "Studio",
  launches: "Studio",
  "product-launch": "Product launch",
  brolls: "Animated B-rolls",
  "your-videos": "Your videos",
  templates: "Templates",
  "agent-console": "Agent console",
  brandkit: "Brand kit",
  settings: "Settings",
  account: "Settings",
  billing: "Billing",
  membership: "Plan",
};

/** Pages that were removed; old links and bookmarks land on the page that replaced them. */
const MOVED: Record<string, SectionId> = {
  projects: "your-videos",
  media: "your-videos",
  assets: "your-videos",
  exports: "your-videos",
  integrations: "settings",
};

export function isSectionId(value: string | null | undefined): value is SectionId {
  return !!value && (SECTION_IDS as readonly string[]).includes(value);
}

/** The section a hash or ?section= names, following removed pages to their replacement. */
export function sectionFor(value: string | null | undefined): SectionId | null {
  if (isSectionId(value)) return value;
  return (value && MOVED[value]) || null;
}
