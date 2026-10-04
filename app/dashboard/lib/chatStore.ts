/**
 * Chat store — data layer for dashboard conversations.
 * Persists to localStorage now; swap `loadChats` / `saveChats`
 * for Firebase / backend calls without touching UI code.
 */

export type MessageRole = "user" | "assistant";

export type PipelineStageState = "pending" | "running" | "done";

export interface PipelineStage {
  id: string;
  label: string;
  state: PipelineStageState;
}

export interface PreviewCard {
  format: "9:16" | "16:9";
  title: string;
  style: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  /** Assistant-only: simulated generation pipeline */
  stages?: PipelineStage[];
  preview?: PreviewCard;
  /** Assistant messages still animating their pipeline */
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  format: "9:16" | "16:9";
  style: string;
  messages: ChatMessage[];
}

export const CHAT_STYLES = [
  "Kinetic Typography",
  "Swiss Pulse",
  "Data Drift",
  "Shadow Cut",
  "Maximalist Type",
  "Velvet Standard",
] as const;

const STORAGE_KEY = "byreel.chats.v1";

export function createId(prefix = "c"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createChat(format: "9:16" | "16:9" = "9:16", style: string = CHAT_STYLES[0]): Chat {
  const now = new Date().toISOString();
  return {
    id: createId(),
    title: "New Short",
    createdAt: now,
    updatedAt: now,
    format,
    style,
    messages: [],
  };
}

export function loadChats(): Chat[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Chat[]) : [];
  } catch {
    return [];
  }
}

export function saveChats(chats: Chat[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {
    // storage full / unavailable — non-fatal
  }
}

/** Group chats into date buckets for the sidebar, newest first. */
export function groupChatsByDate(chats: Chat[]): { label: string; chats: Chat[] }[] {
  const sorted = [...chats].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const buckets: Record<string, Chat[]> = {};
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const startOf7Days = startOfToday - 7 * 86_400_000;
  const startOf30Days = startOfToday - 30 * 86_400_000;

  for (const chat of sorted) {
    const t = new Date(chat.updatedAt).getTime();
    let label: string;
    if (t >= startOfToday) label = "Today";
    else if (t >= startOfYesterday) label = "Yesterday";
    else if (t >= startOf7Days) label = "Previous 7 days";
    else if (t >= startOf30Days) label = "Previous 30 days";
    else label = "Older";
    (buckets[label] ||= []).push(chat);
  }

  const order = ["Today", "Yesterday", "Previous 7 days", "Previous 30 days", "Older"];
  return order
    .filter((label) => buckets[label]?.length)
    .map((label) => ({ label, chats: buckets[label] }));
}

export function deriveTitle(prompt: string): string {
  const clean = prompt.replace(/\s+/g, " ").trim();
  if (!clean) return "New Short";
  return clean.length > 42 ? `${clean.slice(0, 42).trimEnd()}…` : clean;
}
