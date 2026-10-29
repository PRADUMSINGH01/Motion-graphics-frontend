/**
 * Chat store: dashboard conversations, kept in localStorage per signed-in user.
 * The video itself lives on the render server; a chat only remembers the prompt id to follow
 * and the player URL once the render is done.
 */

export type MessageRole = "user" | "assistant";
export type PipelineStageState = "pending" | "running" | "done";

export interface PipelineStage {
  id: string;
  label: string;
  state: PipelineStageState;
}

export interface PreviewCard {
  title: string;
  /** Where the finished video plays. */
  url: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  /** Assistant only: the backend prompt this reply belongs to. */
  promptId?: string;
  /** Assistant only: the render job on the backend. */
  harnessJobId?: string;
  stages?: PipelineStage[];
  /** Assistant only: what the pipeline is doing right now. */
  activity?: string;
  preview?: PreviewCard;
  /** Assistant only: still waiting on the render. */
  isStreaming?: boolean;
  /** Assistant only: the render failed; `content` says why. */
  isError?: boolean;
  /** Assistant only: model tokens the video has used so far, every attempt included. */
  tokens?: number;
  tokenDetails?: {
    total: number;
    input: number;
    cachedInput?: number;
    output: number;
  };
  logs?: Array<{ ts: string; line: string }>;
  thought?: string;
  provider?: string;
  model?: string;
  effort?: string;
}

/** "850 tokens", "12.4k tokens", "1.25M tokens". */
export function formatTokens(n: number): string {
  if (n < 1000) return `${n} tokens`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k tokens`;
  return `${(n / 1_000_000).toFixed(2)}M tokens`;
}

export type Ratio = "9:16" | "16:9" | "1:1";

export interface ChatSettings {
  ratio: Ratio;
  /** Seconds. */
  length: number;
  provider?: string;
  model?: string;
  effort?: string;
}

/**
 * The look every video in a chat shares: set by the chat's first video once its design is
 * chosen, then sent as `themeFrom` with every later prompt. A new look means a new chat.
 */
export interface ChatTheme {
  jobId: string;
  name: string;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  settings?: ChatSettings;
  theme?: ChatTheme;
}

export const DEFAULT_SETTINGS: ChatSettings = {
  ratio: "9:16",
  length: 30,
  provider: "azure",
  model: "qwen--qwen38-27b",
  effort: "xhigh",
};

export const MAX_PROMPT_LENGTH = 4000;
const MAX_STORED_CHATS = 100;
const storageKey = (userId: string) => `byreel.chats.v2:${userId}`;

export function createId(prefix = "c"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createChat(settings: ChatSettings = DEFAULT_SETTINGS): Chat {
  const now = new Date().toISOString();
  return { id: createId(), title: "New Short", createdAt: now, updatedAt: now, messages: [], settings };
}

/** The chat's first video is still choosing its look: later prompts wait for it to share the theme. */
export function themePending(chat: Chat): boolean {
  return !chat.theme && chat.messages.some((m) => m.role === "assistant" && m.isStreaming);
}

export function loadChats(userId: string): Chat[] {
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Chat[]) : [];
  } catch {
    return [];
  }
}

export function saveChats(userId: string, chats: Chat[]): void {
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(chats.slice(0, MAX_STORED_CHATS)));
  } catch {
    // Storage full or blocked: the session still works, it just won't survive a reload.
  }
}

/** Group chats into date buckets for the sidebar, newest first. */
export function groupChatsByDate(chats: Chat[]): { label: string; chats: Chat[] }[] {
  const sorted = [...chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const DAY = 86_400_000;
  const buckets: [string, number][] = [
    ["Today", startOfToday],
    ["Yesterday", startOfToday - DAY],
    ["Previous 7 days", startOfToday - 7 * DAY],
    ["Previous 30 days", startOfToday - 30 * DAY],
    ["Older", -Infinity],
  ];

  const groups = new Map<string, Chat[]>();
  for (const chat of sorted) {
    const t = new Date(chat.updatedAt).getTime();
    const [label] = buckets.find(([, from]) => t >= from)!;
    groups.set(label, [...(groups.get(label) ?? []), chat]);
  }
  return buckets.flatMap(([label]) => (groups.has(label) ? [{ label, chats: groups.get(label)! }] : []));
}

export function deriveTitle(prompt: string): string {
  const clean = prompt.replace(/\s+/g, " ").trim();
  if (!clean) return "New Short";
  return clean.length > 42 ? `${clean.slice(0, 42).trimEnd()}…` : clean;
}

export interface LibraryVideo {
  id: string;
  chatId: string;
  title: string;
  prompt: string;
  url: string;
  createdAt: string;
}

export interface PendingVideo {
  id: string;
  chatId: string;
  prompt: string;
  createdAt: string;
}

/** Every finished video across chats, newest first. The prompt is the user message just before the reply. */
export function collectVideos(chats: Chat[]): LibraryVideo[] {
  return chats
    .flatMap((chat) =>
      chat.messages.flatMap((m, i) =>
        m.preview
          ? [{ id: m.id, chatId: chat.id, title: m.preview.title, prompt: chat.messages[i - 1]?.content ?? "", url: m.preview.url, createdAt: m.createdAt }]
          : []
      )
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Renders still running. */
export function collectPending(chats: Chat[]): PendingVideo[] {
  return chats.flatMap((chat) =>
    chat.messages.flatMap((m, i) =>
      m.isStreaming ? [{ id: m.id, chatId: chat.id, prompt: chat.messages[i - 1]?.content ?? "", createdAt: m.createdAt }] : []
    )
  );
}