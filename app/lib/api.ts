/**
 * Central API Client for Animagent Motion Graphics Platform
 * Connects frontend to backend REST endpoints with session cookies & bearer token support.
 */

import type { MotionBillingQuote } from "./motionBilling";
import type { Chat } from "../dashboard/lib/chatStore";

export const LOCAL_API_URL = "http://localhost:8080";

/**
 * The backend (video-harness: auth via Supabase, billing, video generation).
 * Set NEXT_PUBLIC_API_URL to its public URL when deployed; in development it defaults to localhost:8080.
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || LOCAL_API_URL;
}

export const API_BASE_URL = getApiBaseUrl();

export interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public statusCode: number;
  public details?: Record<string, string[]>;
  /** The backend's machine-readable reason, e.g. "CREDITS_EXHAUSTED" or "PLAN_LIMIT" on a 402. */
  public code?: string;
  /** The whole error body, for the fields a code carries (required credits, the plan's longest film...). */
  public data?: Record<string, unknown>;

  constructor(message: string, statusCode: number, details?: Record<string, string[]>, code?: string, data?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
    this.data = data;
  }
}

/** A 402 from the paywall: the plan's longest film, or the credits left this period. */
export const isPaywallError = (err: unknown): err is ApiError =>
  err instanceof ApiError && err.statusCode === 402 && (err.code === "PLAN_LIMIT" || err.code === "CREDITS_EXHAUSTED");

/**
 * Generic fetch wrapper for backend API calls with automatic fallback.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const primaryBase = getApiBaseUrl().replace(/\/$/, "");
  const primaryUrl = `${primaryBase}/${cleanEndpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach stored bearer token if available in client localStorage or cookies
  if (typeof window !== "undefined") {
    try {
      let storedToken = localStorage.getItem("animagent_token");
      if (!storedToken && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)(?:token|animagent_token)=([^;]+)/);
        if (match && match[1]) {
          storedToken = decodeURIComponent(match[1]);
          try {
            localStorage.setItem("animagent_token", storedToken);
          } catch {}
        }
      }
      if (storedToken && !headers.Authorization) {
        headers.Authorization = `Bearer ${storedToken}`;
      }
    } catch {
      // ignore in SSR
    }
  }

  const executeFetch = async (targetUrl: string) => {
    return fetch(targetUrl, {
      ...options,
      headers,
      credentials: "include", // Required for HttpOnly cookie persistence
    });
  };

  let res: Response;
  try {
    res = await executeFetch(primaryUrl);
  } catch {
    // One backend only: never retry another server with the user's token.
    throw new ApiError(`Unable to reach the backend at ${primaryBase}. Please check your connection and try again.`, 0);
  }

  // If response returned 404 and in browser, attempt Next.js route fallback. Not for routes the backend
  // owns (auth, account, billing, video prompts): its answer is final, and a local stand-in route would
  // fake success without the user's session.
  const backendOwned = /^api\/(login|register|logout|user|google|billing|prompt|videos|usage|models)(\/|$|\?)/.test(cleanEndpoint);
  if (!res.ok && res.status === 404 && typeof window !== "undefined" && !backendOwned) {
    const nextUrl = `${window.location.origin}/${cleanEndpoint}`;
    if (primaryUrl !== nextUrl) {
      try {
        const nextRes = await executeFetch(nextUrl);
        if (nextRes.ok) {
          res = nextRes;
        }
      } catch {}
    }
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response
  }

  if (!res.ok) {
    const errorMsg =
      data?.message ||
      data?.error ||
      (data?.errors ? Object.values(data.errors).flat().join(", ") : `Request failed with status ${res.status}`);
    throw new ApiError(errorMsg, res.status, data?.errors, typeof data?.error === "string" ? data.error : undefined, data);
  }

  return data as T;
}

// ============================================================================
// Data Types
// ============================================================================

export interface BackendUser {
  id: string;
  email: string;
  username: string;
  profile: {
    displayName: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    company: string | null;
    bio: string | null;
    locale: string;
    timezone: string;
  };
  auth: {
    provider: "email" | "google" | "email+google" | "github" | "apple";
    emailVerified: boolean;
    /** False for an account that signs in only with Google. */
    hasPassword?: boolean;
    /** The email must be confirmed before free films (when the server sends confirmation emails). */
    mustVerify?: boolean;
    role: "user" | "creator" | "admin" | "moderator" | "superadmin";
    status: "active" | "pending" | "suspended" | "deactivated";
    permissions: string[];
  };
  plan: {
    tier: "free" | "creator" | "pro" | "enterprise";
    status: "active" | "trialing" | "past_due" | "canceled";
    billingInterval: "monthly" | "annual";
    startedAt: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    features: string[];
  };
  usage: {
    generations: { daily: number; monthly: number; lifetime: number; limit: number };
    renders: { daily: number; monthly: number; lifetime: number; limit: number };
    apiCalls: { daily: number; monthly: number; lifetime: number; limit: number };
    storage: { usedBytes: number; limitBytes: number };
    lastResetAt: string;
    nextResetAt: string;
    /** This billing period's credits, as the paywall counts them. */
    credits?: CreditsSummary;
  };
  preferences?: {
    renderCompletionAlerts: boolean;
    hardwareAcceleration: boolean;
    productUpdates: boolean;
  };
  createdAt: string;
  lastLoginAt: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  environment: "production" | "sandbox" | "test";
  scopes: string[];
  rateLimitPerMinute: number;
  status: "active" | "revoked" | "expired";
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
}

export type PromptStatus = "queued" | "running" | "done" | "failed";

export interface PromptJob {
  id: string;
  promptId: string;
  status: PromptStatus;
  harnessJobId: string | null;
  /** Pipeline step: queued, preparing, designing, planning, audio, building, assembling, checking, reviewing, rendering, done. */
  stage?: string;
  /** One line on what the pipeline is doing now. */
  activity?: string | null;
  /** The look this video uses (a design preset name), once chosen. */
  theme?: string | null;
  /** Player URLs of the finished video(s). */
  play: string[];
  /** A still from late in the finished video, for thumbnails. */
  poster?: string | null;
  /** The finished video this one changed, when it is an edit. */
  editOf?: string | null;
  durationS?: number | null;
  error: string | null;
  /** Model tokens this video has used so far, every attempt included. */
  tokens?: PromptTokens | null;
  /** A failed video can continue from the step it stopped at (api.prompt.retry). */
  canRetry?: boolean;
  /** Raw agent/tool event trace for this run. Only present while the server that ran it is up. */
  logs?: Array<{ ts: string; line: string }>;
  title?: string;
  prompt?: string;
  ratio?: string;
  createdAt?: string;
  updatedAt?: string;
  /** What the person should know about the finished film (a scene that fell back to a simple version). */
  notes?: string[];
  /** Credits the film holds while it runs, then what it was charged once it measured what it used. */
  credits?: number;
  creditsSettled?: boolean;
  /** What the film ran on. */
  provider?: string;
  model?: string;
  effort?: string;
  route?: string;
}

export interface PromptTokens {
  total: number;
  input: number;
  /** Input tokens the model provider served from its cache (cheaper). */
  cachedInput: number;
  output: number;
}

// ---- Billing, usage and models (server/billing.mjs and the /api/usage, /api/models routes) ----

export type PlanTier = "free" | "creator" | "pro" | "enterprise";
export type BillingCycle = "monthly" | "annual";

export interface CreditsSummary {
  used: number;
  limit: number;
  remaining: number;
  periodStart: string;
  periodEnd: string;
}

export interface PlanPrice {
  amount: number;
  currency: string;
}

/** A plan as checkout sells it: prices come from the Dodo products, so null means it can't be bought yet. */
export interface BillingPlan {
  tier: PlanTier;
  credits: number;
  maxSeconds: number;
  prices: Record<BillingCycle, PlanPrice | null>;
  purchasable: boolean;
}

export interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
}

export interface UsageFilm {
  promptId: string;
  title?: string;
  status: PromptStatus;
  createdAt: string;
  durationS: number | null;
  ratio: string | null;
  credits: number;
  refunded: boolean;
  thumbnail: string | null;
  videoUrl: string | null;
}

export interface UsageSummary {
  plan: {
    tier: PlanTier;
    status: string;
    interval: BillingCycle | null;
    renewsAt: string | null;
    cancelAtPeriodEnd: boolean;
    /** A Dodo customer exists, so the billing portal can open. */
    manageable: boolean;
  };
  credits: CreditsSummary;
  limits: { maxSeconds: number; creditsPerFilm: Record<string, number> };
  totals: {
    films: number;
    completed: number;
    failed: number;
    seconds: number;
    creditsCharged: number;
    creditsRefunded: number;
  };
  films: UsageFilm[];
}

export interface ModelCatalogEntry {
  id: string;
  name: string;
  tag: string;
  description: string;
  defaultEffort: string;
  efforts: string[];
  /** Only on a paid plan (the server answers PLAN_LIMIT on Free). */
  paid?: boolean;
}

/** One provider serving an OpenRouter model. Prices are USD per million tokens. */
export interface OpenRouterProvider {
  tag: string;
  name: string;
  quantization: string | null;
  inputPerM: number;
  outputPerM: number;
  contextLength: number | null;
  /** Percent over the last day. */
  uptime: number | null;
}

export interface ModelCatalogGroup {
  provider: string;
  name: string;
  /** The server has a key for this provider. */
  ready: boolean;
  models: ModelCatalogEntry[];
}

// ============================================================================
// API Endpoints
// ============================================================================

export const api = {
  auth: {
    /** Sends a new confirmation link to the signed-in user's email. */
    resendVerification: () =>
      request<{ success: boolean; message: string }>("/api/verify-email/resend", { method: "POST" }),

    login: (credentials: { email: string; password: string }) =>
      request<{ success: boolean; message: string; user: BackendUser; token: string }>("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),

    register: (payload: {
      email: string;
      password: string;
      name: string;
      username?: string;
      plan?: "free" | "creator" | "pro" | "enterprise";
    }) =>
      // error "EMAIL_CONFIRMATION_REQUIRED": the account was created; the user confirms their email, then signs in.
      request<{ success: boolean; message: string; user: BackendUser; token: string; error?: string }>("/api/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getGoogleAuthUrl: (params?: { origin?: string; mode?: "login" | "register"; plan?: string; popup?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.origin) query.set("origin", params.origin);
      if (params?.mode) query.set("mode", params.mode);
      if (params?.plan) query.set("plan", params.plan);
      if (params?.popup) query.set("popup", "true");
      const qs = query.toString() ? `?${query.toString()}` : "";
      return request<{ success: boolean; url: string }>(`/api/google/url${qs}`, {
        method: "GET",
      });
    },

    getGooglePopupUrl: (params?: { origin?: string; mode?: "login" | "register"; plan?: string }) => {
      const base = getApiBaseUrl().replace(/\/$/, "");
      const origin = params?.origin || (typeof window !== "undefined" ? window.location.origin : "");
      const query = new URLSearchParams({
        origin,
        mode: params?.mode || "login",
        plan: params?.plan || "free",
        popup: "true",
      });
      return `${base}/api/google/auth?${query.toString()}`;
    },

    initiateGoogleAuth: (params?: { origin?: string; mode?: "login" | "register"; plan?: string; popup?: boolean }) => {
      const base = getApiBaseUrl().replace(/\/$/, "");
      const origin = params?.origin || (typeof window !== "undefined" ? window.location.origin : "");
      const query = new URLSearchParams({
        origin,
        mode: params?.mode || "login",
        plan: params?.plan || "free",
      });
      if (params?.popup) {
        query.set("popup", "true");
      }
      if (typeof window !== "undefined") {
        window.location.href = `${base}/api/google/auth?${query.toString()}`;
      }
    },

    googleLogin: (credential: string) =>
      request<{ success: boolean; message: string; user: BackendUser; token: string }>("/api/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      }),

    googleRegister: (credential: string) =>
      request<{ success: boolean; message: string; user: BackendUser; token: string }>("/api/google/register", {
        method: "POST",
        body: JSON.stringify({ credential }),
      }),

    logout: () =>
      request<{ success: boolean; message: string }>("/api/logout", {
        method: "POST",
      }),
  },

  user: {
    getMe: () =>
      request<{ success: boolean; user: BackendUser }>("/api/user/me", {
        method: "GET",
      }),

    updateProfile: (profile: {
      displayName?: string;
      email?: string;
      company?: string;
      bio?: string;
      avatarUrl?: string;
      role?: string;
      currentPassword?: string;
      newPassword?: string;
    }) =>
      request<{ success: boolean; message: string; user: BackendUser }>("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(profile),
      }),

    updatePreferences: (preferences: {
      renderCompletionAlerts?: boolean;
      hardwareAcceleration?: boolean;
      productUpdates?: boolean;
    }) =>
      request<{ success: boolean; message?: string; preferences: any }>("/api/user/preferences", {
        method: "PATCH",
        body: JSON.stringify(preferences),
      }),

    /** Deletes the account and everything in it. Needs the password, or the email for an account without one. */
    deleteAccount: (confirm: { password?: string; confirm?: string }) =>
      request<{ success: boolean; message: string }>("/api/user/me", {
        method: "DELETE",
        body: JSON.stringify(confirm),
      }),
  },

  // ==========================================================================
  // Billing (Dodo Payments): plans and prices, checkout, the customer portal, invoices
  // ==========================================================================
  billing: {
    /** Public: every plan's credits, longest film and real price. */
    /** The credits a film holds before it starts (it is charged what it measures when it finishes). */
    estimate: (params: { provider?: string; model?: string; length: number }) =>
      request<{ success: boolean; seconds: number; credits: number; measured: boolean }>(
        `/api/billing/estimate?${new URLSearchParams({ length: String(params.length), ...(params.provider ? { provider: params.provider } : {}), ...(params.model ? { model: params.model } : {}) })}`,
        { method: "GET" }
      ),
    plans: () =>
      request<{ success: boolean; configured: boolean; plans: BillingPlan[]; creditsPerFilm: Record<string, number> }>(
        "/api/billing/plans",
        { method: "GET" }
      ),

    /** A new subscriber gets a checkout link; a subscriber changing plan may get a payment link, or none. */
    checkout: (tier: PlanTier, interval: BillingCycle = "monthly") =>
      request<{ success: boolean; kind: "checkout" | "change"; url: string | null }>("/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ tier, interval }),
      }),

    /** Dodo's customer portal: payment method, receipts, cancel. */
    portal: () => request<{ success: boolean; url: string }>("/api/billing/portal", { method: "POST" }),

    /** Pull the subscription from Dodo (on return from checkout): right even when a webhook is late. */
    sync: () => request<{ success: boolean; user: BackendUser; applied: string[] }>("/api/billing/sync", { method: "POST" }),

    invoices: () => request<{ success: boolean; invoices: InvoiceItem[] }>("/api/billing/invoices", { method: "GET" }),
  },

  usage: {
    /** The plan, this period's credits, and the films that used them. */
    get: () => request<{ success: boolean } & UsageSummary>("/api/usage", { method: "GET" }),
  },

  /** The Studio's chats, kept on the server per account so they follow the user to any browser. */
  chats: {
    /** Every chat, newest first, and the ids deleted in another browser. */
    list: () => request<{ success: boolean; chats: Chat[]; deleted: string[] }>("/api/chats", { method: "GET" }),
    /** Saves a chat. 409 (code CHAT_NEWER) carries the server's newer copy in `data.chat`; 410 means it was deleted. */
    save: (chat: Chat, options?: { restore?: boolean }) =>
      request<{ success: boolean; chat: Chat }>(`/api/chats/${encodeURIComponent(chat.id)}${options?.restore ? "?restore=1" : ""}`, {
        method: "PUT",
        body: JSON.stringify(chat),
      }),
    remove: (id: string) => request<{ success: boolean }>(`/api/chats/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },

  models: {
    /** The models the server can run, grouped by provider. */
    list: () => request<{ success: boolean; catalog: ModelCatalogGroup[] }>("/api/models", { method: "GET" }),
    /** The providers serving an OpenRouter model (tool calls included), cheapest first. */
    routes: (model: string) =>
      request<{ success: boolean; model: string; sorts: string[]; providers: OpenRouterProvider[] }>(
        `/api/models/routes?model=${encodeURIComponent(model)}`,
        { method: "GET" }
      ),
  },

  keys: {
    list: () =>
      request<{ success: boolean; keys: ApiKeyItem[] }>("/api/keys", {
        method: "GET",
      }),

    create: (payload: {
      name: string;
      environment?: "production" | "sandbox" | "test";
      scopes?: string[];
      expiresInDays?: number | null;
    }) =>
      request<{
        success: boolean;
        message: string;
        apiKey: ApiKeyItem;
        secretKey: string;
      }>("/api/keys", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    revoke: (keyId: string) =>
      request<{ success: boolean; message: string }>(`/api/keys/${keyId}`, {
        method: "DELETE",
      }),
  },



  // ==========================================================================
  // Character & Typography Vector Conversion API
  // ==========================================================================
  charConversion: {
    add: (payload: CharConversionPayload) =>
      request<CharConversionResult>("/api/motion/char-conversion", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    convert: (payload: CharConversionPayload) =>
      request<CharConversionResult>("/api/motion/char-conversion", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getGlyphs: (text: string) =>
      request<{ success: boolean; glyphs: any[] }>(
        `/api/motion/glyphs?text=${encodeURIComponent(text)}`,
        {
          method: "GET",
        }
      ),
  },

  // ==========================================================================
  // Prompt Queue API (adds generation job to BullMQ AGENTQUEUE)
  // ==========================================================================
  prompt: {
    /** Queue a prompt on the backend as the signed-in user. The caller picks promptId so retries are idempotent. */
    queue: (payload: {
      prompt: string;
      promptId: string;
      template?: string;
      ratio?: "9:16" | "16:9" | "1:1";
      /** Seconds, 1-60 (the plan may allow less). */
      length?: number;
      /** A previous video's job id: reuse its exact look (the chat's theme). */
      themeFrom?: string;
      provider?: string;
      model?: string;
      effort?: string;
      /** OpenRouter only: "auto", "price", "throughput", or a provider tag such as "baidu/fp8". */
      route?: string;
      /** Edit this finished video (its promptId) instead of making a new one: unchanged scenes are kept. */
      editOf?: string;
      /** false: a silent video. */
      sound?: boolean;
      /** The brand kit's guide (colours, fonts, feel) for a new video; ignored for edits. */
      brand?: string;
    }) =>
      request<{ success: boolean; job: PromptJob }>("/api/prompt", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    status: (promptId: string) =>
      request<{ success: boolean; job: PromptJob }>(`/api/prompt/${encodeURIComponent(promptId)}`, { method: "GET" }),

    /** Continue a failed video from the step it stopped at; it keeps its finished work and does not count again. */
    retry: (promptId: string) =>
      request<{ success: boolean; job: PromptJob }>(`/api/prompt/${encodeURIComponent(promptId)}/retry`, { method: "POST" }),

    /** Every job the backend knows about (in-memory + indexed from disk), newest first. */
    list: () => request<{ success: boolean; jobs: PromptJob[]; videos: PromptJob[] }>("/api/jobs", { method: "GET" }),

    submit: async (payload: {
      prompt: string;
      userId: string;
      promptId: string;
      template?: string;
    }) => {
      const targetUrl =
        typeof window !== "undefined"
          ? "/api/prompt"
          : `${getApiBaseUrl().replace(/\/$/, "")}/api/prompt`;

      const res = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMessage = `Prompt request failed with status ${res.status}`;
        try {
          const errData = await res.json();
          errMessage = errData?.error || errData?.message || errMessage;
        } catch {}
        throw new ApiError(errMessage, res.status);
      }

      return (await res.json()) as {
        success: boolean;
        message: string;
        billing?: MotionBillingQuote;
        backendConnected?: boolean;
        job?: any;
        motion?: {
          promptId: string;
          prompt: string;
          renderedText: string;
          style: string;
          palette: string;
          fps: number;
          duration: number;
          status: string;
        };
        template?: any;
        templates?: any[];
      };
    },
  },
};

// ============================================================================
// Types for Character Conversion
// ============================================================================

export interface CharConversionPayload {
  text: string;
  characters?: string[];
  fontFamily?: string;
  fontSize?: number;
  effect?: "kinetic_split" | "neon_glow" | "wave" | "glitch" | "isometric" | string;
  physics?: {
    tension?: number;
    damping?: number;
    mass?: number;
  };
  metadata?: Record<string, any>;
}

export interface CharConversionGlyph {
  char: string;
  svgPath: string;
  width: number;
  height: number;
  keyframes: Array<{
    time: number;
    x: number;
    y: number;
    scale: number;
    opacity: number;
    rotation: number;
  }>;
}

export interface CharConversionResult {
  success: boolean;
  text: string;
  id?: string;
  glyphs: CharConversionGlyph[];
  totalDurationMs?: number;
  createdAt?: string;
}



/**
 * Submits a prompt generation job to the backend BullMQ AGENTQUEUE (/api/prompt).
 */
export async function submitPromptToQueue(payload: {
  prompt: string;
  userId: string;
  promptId: string;
  template?: string;
}) {
  return api.prompt.submit(payload);
}

/**
 * Opens a centered popup window for server-side Google OAuth 2.0.
 * Returns the popup window reference or null if blocked.
 */
export function openGoogleAuthPopup(options?: {
  mode?: "login" | "register";
  plan?: string;
}): Window | null {
  if (typeof window === "undefined") return null;

  const width = 500;
  const height = 640;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2.5));

  const features = `toolbar=no,menubar=no,location=no,directories=no,status=no,resizable=yes,scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`;
  const popupUrl = api.auth.getGooglePopupUrl({
    mode: options?.mode,
    plan: options?.plan,
    origin: window.location.origin,
  });

  return window.open(popupUrl, "animagent_google_oauth", features);
}

export default api;


