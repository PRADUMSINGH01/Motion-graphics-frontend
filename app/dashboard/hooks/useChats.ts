"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Chat,
  type ChatMessage,
  type ChatSettings,
  type PipelineStage,
  chatSyncKey,
  createChat,
  createId,
  DEFAULT_SETTINGS,
  deriveTitle,
  loadChats,
  mergeChats,
  saveChats,
  slimChat,
  themePending,
} from "../lib/chatStore";
import { api, ApiError, isPaywallError, type PromptJob } from "../../lib/api";

// A refused film says why and, for the paywall, which limit (the chat offers the way past it).
const failureOf = (err: unknown, fallback: string) => ({
  content: err instanceof Error ? err.message : fallback,
  paywall: isPaywallError(err) ? (err.code as "PLAN_LIMIT" | "CREDITS_EXHAUSTED") : undefined,
});

const POLL_INTERVAL_MS = 3000;
// A render takes minutes; a backend that is briefly unreachable should not end the wait.
const MAX_CONSECUTIVE_POLL_FAILURES = 10;
// Saves wait this long for more edits; a failed save tries again after the retry delay.
const SAVE_DELAY_MS = 800;
const SAVE_RETRY_MS = 15000;
// Coming back to the tab re-reads the server's chats (edits from another browser) at most this often.
const REFRESH_AFTER_MS = 30000;

// The backend's pipeline steps, grouped into what the chat shows.
const STAGE_GROUPS: { id: string; label: string; steps: string[] }[] = [
  { id: "look", label: "Choosing the look", steps: ["queued", "preparing", "designing"] },
  { id: "story", label: "Writing the storyboard", steps: ["planning"] },
  { id: "sound", label: "Music and sound", steps: ["audio"] },
  { id: "scenes", label: "Building the scenes", steps: ["building"] },
  { id: "checks", label: "Quality checks", steps: ["assembling", "checking", "reviewing", "awaiting_approval"] },
  { id: "render", label: "Rendering the video", steps: ["rendering"] },
];

const stagesFor = (stage = "queued"): PipelineStage[] => {
  const at = stage === "done" ? STAGE_GROUPS.length : Math.max(0, STAGE_GROUPS.findIndex((g) => g.steps.includes(stage)));
  return STAGE_GROUPS.map((g, i) => ({ id: g.id, label: g.label, state: i < at ? "done" : i === at ? "running" : "pending" }));
};

const byRecent = (a: Chat, b: Chat) => b.updatedAt.localeCompare(a.updatedAt);

/**
 * The signed-in user's Studio chats. This browser keeps a copy for an instant start; the server keeps the
 * history, so a chat made here shows in any other browser, and a rename or delete there shows here.
 */
/** onCredits runs when the account's credits change: a video's estimate is held, settled or refunded. */
export function useChats(userId: string, onCredits?: () => void) {
  // Only rendered client-side, after sign-in, so reading storage during the first render is safe.
  const [chats, setChats] = useState<Chat[]>(() => loadChats(userId).sort(byRecent));
  // null means a new video; a chat opens when the user picks one or sends a prompt.
  const [activeId, setActiveId] = useState<string | null>(null);
  const pollers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const creditsChanged = useRef(onCredits);
  useEffect(() => {
    creditsChanged.current = onCredits;
  });

  // Sync state. `saved` holds each chat's sync key as the server last stored it; a chat whose key differs
  // is saved. Nothing is saved before the server's copy is read, so an old copy here can't race a newer one.
  const chatsRef = useRef(chats);
  const saved = useRef(new Map<string, string>());
  const dirty = useRef(new Set<string>());
  const ready = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFetch = useRef(0);
  const removed = useRef(new Map<string, Chat>());
  // The save loop retries itself through this ref (a callback cannot name itself while it is being made).
  const flushRef = useRef<() => void>(() => {});

  useEffect(() => {
    chatsRef.current = chats;
  });

  const stopPolling = useCallback((messageId: string) => {
    clearTimeout(pollers.current.get(messageId));
    pollers.current.delete(messageId);
  }, []);

  /** Change a chat. `touch` moves it to the top of the recents; a running take's progress does not. */
  const updateChat = useCallback((chatId: string, updater: (chat: Chat) => Chat, touch = true) => {
    setChats((prev) => {
      const next = prev.map((c) => (c.id === chatId ? { ...updater(c), ...(touch ? { updatedAt: new Date().toISOString() } : {}) } : c));
      return touch ? next.sort(byRecent) : next;
    });
  }, []);

  const patchMessage = useCallback(
    (chatId: string, messageId: string, patch: Partial<ChatMessage>, touch = false) =>
      updateChat(
        chatId,
        (c) => ({ ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)) }),
        touch
      ),
    [updateChat]
  );

  /** Follow a queued prompt until the backend reports it done or failed. */
  const track = useCallback(
    (chatId: string, messageId: string, promptId: string, title: string) => {
      let failures = 0;
      const fail = (content: string) => patchMessage(chatId, messageId, { isStreaming: false, isError: true, content }, true);

      const poll = async () => {
        try {
          const { job } = await api.prompt.status(promptId);
          failures = 0;
          const tokens = job.tokens?.total ?? undefined;
          const tokenDetails = job.tokens ?? undefined;
          const logs = job.logs ?? undefined;
          const thought = (job as { thought?: string }).thought ?? undefined;
          const ran = { provider: job.provider, model: job.model, effort: job.effort };
          // The chat's first video to settle a look sets the chat's theme; every later video reuses it.
          if (job.theme && job.harnessJobId) {
            updateChat(chatId, (c) => (c.theme ? c : { ...c, theme: { jobId: job.harnessJobId!, name: job.theme! } }), false);
          }
          if (job.status === "done" || job.status === "failed") creditsChanged.current?.();
          if (job.status === "done") {
            const url = job.play[0];
            if (url) {
              patchMessage(
                chatId,
                messageId,
                {
                  isStreaming: false,
                  stages: stagesFor("done"),
                  activity: undefined,
                  harnessJobId: job.harnessJobId ?? undefined,
                  content: "Your video is ready.",
                  preview: { title, url },
                  notes: job.notes?.length ? job.notes : undefined,
                  credits: job.creditsSettled ? job.credits : undefined,
                  tokens,
                  tokenDetails,
                  logs,
                  thought,
                  ...ran,
                },
                true
              );
            } else {
              fail("The render finished but produced no playable video.");
            }
            return;
          }
          if (job.status === "failed") {
            patchMessage(chatId, messageId, { tokens, tokenDetails, logs });
            return fail(`Generation failed: ${job.error ?? "unknown error"}`);
          }
          patchMessage(chatId, messageId, {
            stages: stagesFor(job.stage),
            activity: job.activity ?? undefined,
            harnessJobId: job.harnessJobId ?? undefined,
            tokens,
            tokenDetails,
            logs,
            thought,
            ...ran,
          });
        } catch (err) {
          // 4xx means retrying cannot help: the prompt is gone or the session ended.
          if (err instanceof ApiError && err.statusCode >= 400 && err.statusCode < 500) return fail(err.message);
          if (++failures >= MAX_CONSECUTIVE_POLL_FAILURES) return fail("Lost contact with the server. Try again.");
        }
        pollers.current.set(messageId, setTimeout(poll, POLL_INTERVAL_MS));
      };
      pollers.current.set(messageId, setTimeout(poll, 0));
    },
    [patchMessage, updateChat]
  );

  /**
   * Follow every take still rendering in these chats (after a reload, or one started in another browser).
   * A take started in the last few seconds is skipped: `send` follows it once the server has it, and polling
   * sooner would find no job yet and mark it failed.
   */
  const resume = useCallback(
    (list: Chat[]) => {
      for (const chat of list) {
        chat.messages.forEach((m, i) => {
          const fresh = Date.now() - Date.parse(m.createdAt) < 15000;
          if (m.isStreaming && m.promptId && !fresh && !pollers.current.has(m.id)) {
            track(chat.id, m.id, m.promptId, deriveTitle(chat.messages[i - 1]?.content ?? ""));
          }
        });
      }
    },
    [track]
  );

  // Saving: each changed chat, one at a time. A newer copy on the server (another browser) replaces this one;
  // a chat deleted elsewhere goes; a network failure tries again shortly.
  const flush = useCallback(async () => {
    saveTimer.current = null;
    let retry = false;
    for (const id of [...dirty.current]) {
      dirty.current.delete(id);
      const chat = chatsRef.current.find((c) => c.id === id);
      if (!chat || !chat.messages.length) continue;
      const key = chatSyncKey(chat);
      if (saved.current.get(id) === key) continue;
      try {
        await api.chats.save(slimChat(chat));
        saved.current.set(id, key);
      } catch (err) {
        if (err instanceof ApiError && err.statusCode === 409 && err.data?.chat) {
          const newer = err.data.chat as Chat;
          saved.current.set(id, chatSyncKey(newer));
          setChats((prev) => prev.map((c) => (c.id === id ? newer : c)).sort(byRecent));
        } else if (err instanceof ApiError && err.statusCode === 410) {
          setChats((prev) => prev.filter((c) => c.id !== id));
          setActiveId((current) => (current === id ? null : current));
        } else if (err instanceof ApiError && (err.statusCode === 400 || err.statusCode === 401)) {
          // Refused (too large, or signed out): this copy stays in this browser.
        } else {
          dirty.current.add(id);
          retry = true;
        }
      }
    }
    if (retry && !saveTimer.current) saveTimer.current = setTimeout(() => flushRef.current(), SAVE_RETRY_MS);
  }, []);

  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);

  const scheduleSave = useCallback(() => {
    if (!ready.current || saveTimer.current) return;
    saveTimer.current = setTimeout(flush, SAVE_DELAY_MS);
  }, [flush]);

  // Read the server's chats and merge them with this browser's.
  const refresh = useCallback(async () => {
    lastFetch.current = Date.now();
    try {
      const { chats: remote, deleted } = await api.chats.list();
      for (const c of remote) saved.current.set(c.id, chatSyncKey(c));
      const { chats: merged } = mergeChats(chatsRef.current, remote, deleted);
      // Merged against the latest state, so a poll that landed while the list was loading is kept.
      setChats((prev) => mergeChats(prev, remote, deleted).chats);
      setActiveId((current) => (current && deleted.includes(current) ? null : current));
      ready.current = true;
      resume(merged);
      for (const c of merged) if (c.messages.length && saved.current.get(c.id) !== chatSyncKey(c)) dirty.current.add(c.id);
      scheduleSave();
    } catch {
      // Offline or the server is down: this browser's copy works on, and saves wait for the next read.
    }
  }, [resume, scheduleSave]);

  useEffect(() => {
    resume(chatsRef.current);
    // The first read of the server's chats starts right after mount (its result updates state).
    const first = setTimeout(refresh, 0);
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - lastFetch.current > REFRESH_AFTER_MS) refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    const active = pollers.current;
    return () => {
      clearTimeout(first);
      document.removeEventListener("visibilitychange", onVisible);
      active.forEach(clearTimeout);
      active.clear();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [userId, resume, refresh]);

  // Every change: kept in this browser at once, and saved to the server when it matters.
  useEffect(() => {
    saveChats(userId, chats);
    if (!ready.current) return;
    for (const c of chats) if (c.messages.length && saved.current.get(c.id) !== chatSyncKey(c)) dirty.current.add(c.id);
    if (dirty.current.size) scheduleSave();
  }, [userId, chats, scheduleSave]);

  const activeChat = useMemo(() => chats.find((c) => c.id === activeId) ?? null, [chats, activeId]);

  const goHome = useCallback(() => setActiveId(null), []);

  /** Delete a chat everywhere. `restoreChat` (the Undo) brings it back for a short while after. */
  const deleteChat = useCallback(
    (chatId: string) => {
      const chat = chatsRef.current.find((c) => c.id === chatId);
      if (!chat) return;
      chat.messages.forEach((m) => stopPolling(m.id));
      removed.current.set(chatId, chat);
      dirty.current.delete(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      setActiveId((current) => (current === chatId ? null : current));
      // Told to the server at once (closing the tab can't lose it); Undo saves it back.
      saved.current.delete(chatId);
      api.chats.remove(chatId).catch(() => {});
    },
    [stopPolling]
  );

  const restoreChat = useCallback(
    (chatId: string) => {
      const chat = removed.current.get(chatId);
      if (!chat) return;
      removed.current.delete(chatId);
      setChats((prev) => [...prev.filter((c) => c.id !== chatId), chat].sort(byRecent));
      if (chat.messages.length) {
        api.chats
          .save(slimChat(chat), { restore: true })
          .then(() => saved.current.set(chatId, chatSyncKey(chat)))
          .catch(() => dirty.current.add(chatId));
      }
      resume([chat]);
    },
    [resume]
  );

  const renameChat = useCallback(
    (chatId: string, title: string) => {
      const clean = title.trim().slice(0, 120);
      if (clean) updateChat(chatId, (c) => ({ ...c, title: clean }));
    },
    [updateChat]
  );

  /** Open an empty chat: a new theme for the next video, with the given format and length. */
  const newChat = useCallback((settings?: ChatSettings) => {
    const chat = createChat(settings);
    setChats((prev) => [chat, ...prev]);
    setActiveId(chat.id);
    return chat;
  }, []);

  /**
   * Make a video in the open chat (or a new one with `settings`). Every video in a chat uses the
   * chat's theme: the look its first video settled on, passed as `themeFrom`.
   */
  const send = useCallback(
    async (text: string, settings?: ChatSettings, { editOf }: { editOf?: string } = {}) => {
      const prompt = text.trim();
      if (!prompt) return;

      const chat = activeChat ?? createChat(settings);
      if (!activeChat) {
        setChats((prev) => [chat, ...prev]);
        setActiveId(chat.id);
      }
      // The first video is still choosing the look: wait, or this one would get a different theme.
      if (themePending(chat)) return;

      const now = new Date().toISOString();
      const promptId = createId("p");
      const title = deriveTitle(prompt);
      const effectiveSettings: ChatSettings = {
        ...DEFAULT_SETTINGS,
        ...(chat.settings ?? {}),
        ...(settings ?? {}),
      };
      const { ratio, length, provider, model, effort, route, sound } = effectiveSettings;

      const assistant: ChatMessage = {
        id: createId("m"),
        role: "assistant",
        content: "",
        createdAt: now,
        promptId,
        stages: stagesFor("queued"),
        isStreaming: true,
        provider,
        model,
        effort,
        route,
        ratio,
        length,
        ...(editOf ? { editOf } : {}),
      };
      updateChat(chat.id, (c) => ({
        ...c,
        settings: effectiveSettings,
        title: c.messages.length === 0 ? title : c.title,
        messages: [...c.messages, { id: createId("m"), role: "user", content: prompt, createdAt: now }, assistant],
      }));

      try {
        await api.prompt.queue({
          prompt,
          promptId,
          ratio,
          length,
          provider,
          model,
          effort,
          route,
          sound,
          ...(editOf ? { editOf } : chat.theme ? { themeFrom: chat.theme.jobId } : {}),
        });
        creditsChanged.current?.();
        track(chat.id, assistant.id, promptId, title);
      } catch (err) {
        patchMessage(
          chat.id,
          assistant.id,
          {
            isStreaming: false,
            isError: true,
            ...failureOf(err, "Could not submit your prompt."),
          },
          true
        );
      }
    },
    [activeChat, updateChat, patchMessage, track]
  );

  /**
   * Retry a failed reply in place. A video that failed on the backend continues from the step it
   * stopped at (its storyboard and finished scenes are kept, and it does not use another video
   * from the plan); one that never reached the backend is queued again with the same promptId; one
   * still running (the connection dropped) is simply followed again.
   */
  const retry = useCallback(
    async (chatId: string, messageId: string) => {
      const chat = chatsRef.current.find((c) => c.id === chatId);
      const index = chat?.messages.findIndex((m) => m.id === messageId) ?? -1;
      const message = chat?.messages[index];
      const prompt = chat?.messages[index - 1]?.content ?? "";
      if (!chat || !message?.promptId || message.isStreaming) return;
      const { promptId } = message;
      const title = deriveTitle(prompt);
      patchMessage(chatId, messageId, { isStreaming: true, isError: false, paywall: undefined, content: "", stages: stagesFor("queued"), activity: undefined }, true);
      try {
        let status: PromptJob | null = null;
        try {
          status = (await api.prompt.status(promptId)).job;
        } catch (err) {
          if (!(err instanceof ApiError && err.statusCode === 404)) throw err;
        }
        if (!status) {
          const { ratio, length, provider, model, effort, route, sound } = chat.settings ?? DEFAULT_SETTINGS;
          await api.prompt.queue({
            prompt,
            promptId,
            ratio,
            length,
            provider: message.provider ?? provider,
            model: message.model ?? model,
            effort: message.effort ?? effort,
            route: message.model ? message.route : route,
            sound,
            ...(chat.theme ? { themeFrom: chat.theme.jobId } : {}),
          });
        } else if (status.status === "failed") {
          await api.prompt.retry(promptId);
        }
        stopPolling(messageId);
        track(chatId, messageId, promptId, title);
      } catch (err) {
        patchMessage(
          chatId,
          messageId,
          {
            isStreaming: false,
            isError: true,
            ...failureOf(err, "Could not retry this video."),
          },
          true
        );
      }
    },
    [patchMessage, track, stopPolling]
  );

  const updateChatSettings = useCallback(
    (chatId: string, settings: ChatSettings) => {
      updateChat(chatId, (c) => ({ ...c, settings }), false);
    },
    [updateChat]
  );

  return {
    chats,
    activeChat,
    activeId,
    goHome,
    selectChat: setActiveId,
    deleteChat,
    restoreChat,
    renameChat,
    send,
    newChat,
    retry,
    updateChatSettings,
  };
}
