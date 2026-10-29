export const SECTION_IDS = [
  "dashboard",
  "overview",
  "create",
  "launches",
  "product-launch",
  "brolls",
  "your-videos",
  "templates",
  "projects",
  "media",
  "exports",
  "agent-console",
  "brandkit",
  "integrations",
  "settings",
  "account",
  "billing",
  "membership",
  "assets",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  dashboard: "Dashboard",
  overview: "Dashboard",
  create: "Create Video",
  launches: "Create Video",
  "product-launch": "Product Launch",
  brolls: "B-Rolls",
  "your-videos": "Your Videos",
  templates: "Templates",
  projects: "Projects",
  media: "Media Library",
  exports: "Exports",
  "agent-console": "Agent Console",
  brandkit: "Brand Kit",
  integrations: "Integrations",
  settings: "Settings",
  account: "Account Settings",
  billing: "Billing",
  membership: "Membership & Plan",
  assets: "Assets",
};

export function isSectionId(value: string | null | undefined): value is SectionId {
  return !!value && (SECTION_IDS as readonly string[]).includes(value);
}
