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
  /** Assistant only: the paywall refused the film (the plan's longest film, or credits used up). */
  paywall?: "PLAN_LIMIT" | "CREDITS_EXHAUSTED";
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
  route?: string;
  /** Assistant only: the take this one edits (its promptId), when it is an edit rather than a new take. */
  editOf?: string;
  /** Assistant only: credits the finished film was charged (what it measured). */
  credits?: number;
  /** Assistant only: what to know about the finished film (a scene that fell back to a simple version). */
  notes?: string[];
  /** Assistant only: the film's frame and length as it was ordered. */
  ratio?: Ratio;
  length?: number;
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
  /** OpenRouter models: which provider serves them ("auto" or unset: OpenRouter balances). */
  route?: string;
  /** Sound effects on cuts and hits (off: a silent video). */
  sound?: boolean;
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
  length: 15,
  provider: "glm",
  model: "glm-5.3-flash",
  effort: "high",
  sound: true,
};

export const MAX_PROMPT_LENGTH = 4000;
const MAX_STORED_CHATS = 100;
const storageKey = (userId: string) => `byreel.chats.v2:${userId}`;

export function createId(prefix = "c"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createChat(settings: ChatSettings = DEFAULT_SETTINGS): Chat {
  const now = new Date().toISOString();
  return { id: createId(), title: "New video", createdAt: now, updatedAt: now, messages: [], settings };
}

/**
 * A chat as it is kept (in this browser and on the server): build logs, the model's thinking and live
 * activity are dropped (token counts are kept). They are large, a running take re-reads them from its job, and a finished take's
 * log is fetched when someone opens it.
 */
export function slimChat(chat: Chat): Chat {
  return {
    ...chat,
    messages: chat.messages.map((message) => {
      const kept = { ...message };
      delete kept.logs;
      delete kept.thought;
      delete kept.activity;
      return kept;
    }),
  };
}

/**
 * What a chat's saved copy depends on. A running take's progress (stages, tokens) changes every few seconds
 * and is not worth a save; its start, its result, a rename or a new setting are.
 */
export function chatSyncKey(chat: Chat): string {
  return JSON.stringify({
    t: chat.title,
    s: chat.settings,
    th: chat.theme,
    m: chat.messages.map((m) => [m.id, m.content, m.isStreaming, m.isError, m.paywall, m.preview?.url, m.harnessJobId]),
  });
}

/**
 * This browser's chats merged with the server's: a chat deleted elsewhere goes, each other chat keeps its
 * newer copy, and `upload` lists the ones the server should get (new here, or newer here).
 */
export function mergeChats(local: Chat[], remote: Chat[], deleted: string[]): { chats: Chat[]; upload: string[] } {
  const gone = new Set(deleted);
  const byId = new Map<string, Chat>();
  for (const c of remote) if (!gone.has(c.id)) byId.set(c.id, c);
  const upload: string[] = [];
  for (const c of local) {
    if (gone.has(c.id)) continue;
    const theirs = byId.get(c.id);
    if (!theirs || c.updatedAt > theirs.updatedAt) {
      byId.set(c.id, c);
      if (c.messages.length) upload.push(c.id);
    }
  }
  return { chats: [...byId.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), upload };
}

/** The chat's latest finished video: what a follow-up request edits. */
export function lastFinishedTake(chat: Chat | null | undefined): ChatMessage | null {
  return [...(chat?.messages ?? [])].reverse().find((m) => m.role === "assistant" && m.preview && m.promptId) ?? null;
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

/** This browser's copy: the most recently used chats, slimmed (the server keeps the full history). */
export function saveChats(userId: string, chats: Chat[]): void {
  try {
    const recent = [...chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, MAX_STORED_CHATS);
    window.localStorage.setItem(storageKey(userId), JSON.stringify(recent.map(slimChat)));
  } catch {
    // Storage full or blocked: the chats are still on the server.
  }
}

export const chatStorageKey = storageKey;

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
  if (!clean) return "New video";
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
/** The still of a finished video: the server serves it next to the video, under the same key. */
export function posterFor(videoUrl: string | null | undefined): string | undefined {
  if (!videoUrl || !videoUrl.includes("/final.mp4")) return undefined;
  return videoUrl.replace("/final.mp4", "/thumbnail.jpg");
}

/** "0:05", "1:00". */
export function formatLength(seconds: number | null | undefined): string {
  const s = Math.max(0, Math.round(seconds ?? 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export type ChatTone = "ready" | "working" | "failed" | "draft";

/** Where a chat stands, from its latest reply: being made, failed, has a finished video, or nothing yet. */
export function chatTone(chat: Chat): ChatTone {
  const last = [...chat.messages].reverse().find((m) => m.role === "assistant");
  if (last?.isStreaming) return "working";
  if (last?.isError) return "failed";
  if (chat.messages.some((m) => m.preview)) return "ready";
  return "draft";
}

/** How each state reads in a list: its words and its dot. */
export const CHAT_TONE: Record<ChatTone, { label: string; dot: string }> = {
  ready: { label: "Ready", dot: "bg-[#4d7c0f]" },
  working: { label: "Rendering", dot: "bg-[#b45309]" },
  failed: { label: "Needs attention", dot: "bg-[#b42318]" },
  draft: { label: "Draft", dot: "bg-[#9aa1b0]" },
};
