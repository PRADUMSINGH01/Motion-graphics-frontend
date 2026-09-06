/**
 * Central API Client for Animagent Motion Graphics Platform
 * Connects frontend to backend REST endpoints with session cookies & bearer token support.
 */

export const HOSTED_API_URL = "https://motion-backend--background-ab0ec.us-east4.hosted.app";
export const LOCAL_API_URL = "http://localhost:3001";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";
    if (isLocal) {
      if (
        process.env.NEXT_PUBLIC_API_URL &&
        (process.env.NEXT_PUBLIC_API_URL.includes("localhost") || process.env.NEXT_PUBLIC_API_URL.includes("127.0.0.1"))
      ) {
        return process.env.NEXT_PUBLIC_API_URL;
      }
      return LOCAL_API_URL;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || HOSTED_API_URL;
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

  constructor(message: string, statusCode: number, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

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
  } catch (err: any) {
    // If primary failed with network error and in browser, attempt fallback URL
    const isLocal = primaryBase.includes("localhost") || primaryBase.includes("127.0.0.1");
    const fallbackBase = isLocal ? HOSTED_API_URL : LOCAL_API_URL;
    const fallbackUrl = `${fallbackBase}/${cleanEndpoint}`;

    try {
      res = await executeFetch(fallbackUrl);
    } catch {
      throw new ApiError(
        `Unable to reach backend server. Please check your connection or start the backend at ${LOCAL_API_URL}.`,
        0
      );
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
    throw new ApiError(errorMsg, res.status, data?.errors);
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
    provider: "email" | "google" | "github" | "apple";
    emailVerified: boolean;
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

// ============================================================================
// API Endpoints
// ============================================================================

export const api = {
  auth: {
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
      request<{ success: boolean; message: string; user: BackendUser; token: string }>("/api/register", {
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

    updatePlan: (tier: "free" | "creator" | "pro" | "enterprise", interval: "monthly" | "annual" = "monthly") =>
      request<{ success: boolean; message: string; user: BackendUser }>("/api/user/plan", {
        method: "POST",
        body: JSON.stringify({ tier, interval }),
      }),
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
  // Chat & Conversation Management API (adds conversation to backend)
  // ==========================================================================
  conversation: {
    add: (payload: {
      title?: string;
      initialMessage?: string;
      prompt?: string;
      category?: string;
    }) =>
      request<{
        success: boolean;
        conversation: {
          id: string;
          title: string;
          messages: Array<{
            id?: string;
            role: "user" | "assistant" | "system";
            content: string;
            motionPrompt?: string;
            createdAt?: string;
          }>;
          createdAt: string;
        };
      }>("/api/conversations", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    sendMessage: (
      conversationId: string,
      message: {
        role?: "user" | "assistant";
        content: string;
        motionPrompt?: string;
      }
    ) =>
      request<{
        success: boolean;
        reply: {
          id: string;
          role: "assistant";
          content: string;
          motionPrompt?: string;
          createdAt: string;
        };
      }>(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify(message),
      }),

    list: () =>
      request<{
        success: boolean;
        conversations: Array<{
          id: string;
          title: string;
          updatedAt: string;
          messageCount: number;
        }>;
      }>("/api/conversations", {
        method: "GET",
      }),

    get: (conversationId: string) =>
      request<{
        success: boolean;
        conversation: {
          id: string;
          title: string;
          messages: Array<{
            id: string;
            role: "user" | "assistant";
            content: string;
            createdAt: string;
          }>;
        };
      }>(`/api/conversations/${conversationId}`, {
        method: "GET",
      }),

    delete: (conversationId: string) =>
      request<{ success: boolean; message: string }>(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      }),
  },

  // Alias for chat/conversation
  chat: {
    addConversation: (payload: { title?: string; initialMessage?: string; prompt?: string }) =>
      request<{ success: boolean; conversation: any }>("/api/conversations", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    sendMessage: (conversationId: string, content: string, motionPrompt?: string) =>
      request<{ success: boolean; reply: any }>(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content, motionPrompt }),
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
    submit: (payload: {
      prompt: string;
      userId: string;
      promptId: string;
      template?: string;
    }) =>
      request<{ message: string; job?: any }>("/api/prompt", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
};

// ============================================================================
// Types for Character Conversion & Chat Conversations
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

export interface ConversationPayload {
  title?: string;
  initialMessage?: string;
  prompt?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface ConversationMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  motionPrompt?: string;
  createdAt?: string;
}

export interface ConversationRecord {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: string;
}

// ============================================================================
// Convenient Standalone Helper Functions
// ============================================================================

/**
 * Add a character conversion job to the backend.
 * @param payload Character conversion payload containing text, font, effect, physics
 */
export async function addCharConversion(payload: CharConversionPayload): Promise<CharConversionResult> {
  return api.charConversion.add(payload);
}

/**
 * Add a new chat conversation to the backend.
 * @param payload Initial conversation payload containing title, prompt or initial message
 */
export async function addChatConversation(payload: ConversationPayload) {
  return api.conversation.add(payload);
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


