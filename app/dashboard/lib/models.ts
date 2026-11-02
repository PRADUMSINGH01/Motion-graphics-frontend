"use client";

/**
 * The models a film can be made with. The list is the server's (/api/models): only providers it holds a
 * key for, so whatever is picked here can run. The built-in list stands in until it loads, or if the
 * server can't be reached.
 */

import { useEffect, useState } from "react";
import { api, type ModelCatalogGroup } from "../../lib/api";

export type EffortLevel = "low" | "medium" | "high" | "xhigh";

export interface ModelOption {
  provider: string;
  id: string;
  name: string;
  providerLabel: string;
  tag: string;
  badge?: string;
  description: string;
  efforts: EffortLevel[];
  defaultEffort: EffortLevel;
  isReady?: boolean;
}

export const FALLBACK_MODELS: ModelOption[] = [
  {
    provider: "glm",
    id: "glm-5.3-flash",
    name: "GLM 5.3 Flash",
    providerLabel: "Zhipu AI",
    tag: "Ultra Fast",
    badge: "Recommended",
    description: "Sub-second thinking, script synthesis & kinetic pacing (200k context)",
    efforts: ["low", "medium", "high", "xhigh"],
    defaultEffort: "high",
    isReady: true,
  },
  {
    provider: "azure",
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    providerLabel: "Azure AI (MaaS)",
    tag: "Serverless",
    badge: "Deep Reasoning",
    description: "Concise reasoning, deterministic code & camera math",
    efforts: ["low", "medium", "high", "xhigh"],
    defaultEffort: "high",
    isReady: true,
  },
  {
    provider: "openrouter",
    id: "deepseek/deepseek-v4.1-flash",
    name: "DeepSeek V4.1 Flash",
    providerLabel: "OpenRouter",
    tag: "Fast · low cost",
    description: "Strong motion code for cents a film; low is quickest, high thinks longest",
    efforts: ["low", "medium", "high"],
    defaultEffort: "medium",
    isReady: true,
  },
  {
    provider: "claude",
    id: "claude-sonnet-5-5",
    name: "Claude Sonnet 5.5",
    providerLabel: "Anthropic",
    tag: "Visual Design",
    badge: "Design Master",
    description: "World-class layout, typography hierarchy & scene choreography",
    efforts: ["low", "medium", "high"],
    defaultEffort: "low",
    isReady: true,
  },
];

const EFFORTS: EffortLevel[] = ["low", "medium", "high", "xhigh"];
// The server also says "max"; the picker calls the top level xhigh.
const toEffort = (e: string): EffortLevel | null => {
  const v = e === "max" ? "xhigh" : e;
  return (EFFORTS as string[]).includes(v) ? (v as EffortLevel) : null;
};

/** The server's catalog as picker options: ready providers only, efforts in the picker's terms. */
export function modelsFromCatalog(catalog: ModelCatalogGroup[]): ModelOption[] {
  return catalog
    .filter((g) => g.ready)
    .flatMap((g) =>
      g.models.map((m) => {
        const efforts = [...new Set(m.efforts.map(toEffort).filter((e): e is EffortLevel => e !== null))];
        const usable = efforts.length ? efforts : (["low", "medium", "high"] as EffortLevel[]);
        const preferred = toEffort(m.defaultEffort);
        return {
          provider: g.provider,
          id: m.id,
          name: m.name,
          providerLabel: g.name,
          tag: m.tag,
          ...(m.paid ? { badge: "Paid plans" } : {}),
          description: m.description,
          efforts: usable,
          defaultEffort: preferred && usable.includes(preferred) ? preferred : usable[0],
          isReady: true,
        };
      })
    );
}

let catalogRequest: Promise<ModelOption[]> | null = null;
function loadModels(): Promise<ModelOption[]> {
  if (!catalogRequest) {
    catalogRequest = api.models
      .list()
      .then((r) => modelsFromCatalog(r.catalog))
      .catch(() => {
        catalogRequest = null;
        return [];
      });
  }
  return catalogRequest;
}

export function useModels(): ModelOption[] {
  const [models, setModels] = useState<ModelOption[]>(FALLBACK_MODELS);
  useEffect(() => {
    let live = true;
    loadModels().then((list) => {
      if (live && list.length) setModels(list);
    });
    return () => {
      live = false;
    };
  }, []);
  return models;
}

/** The option for a saved model id; the first one when that model is no longer offered. */
export const findModel = (models: ModelOption[], id: string | undefined) => models.find((m) => m.id === id) ?? models[0];
