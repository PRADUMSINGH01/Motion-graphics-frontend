"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Chat,
  type ChatMessage,
  type ChatSettings,
  type PipelineStage,
  createChat,
  createId,
  DEFAULT_SETTINGS,
  deriveTitle,
  loadChats,
  saveChats,
  themePending,
} from "../lib/chatStore";
import { api, ApiError, type PromptJob } from "../../lib/api";

const POLL_INTERVAL_MS = 3000;
// A render takes minutes; a backend that is briefly unreachable should not end the wait.
const MAX_CONSECUTIVE_POLL_FAILURES = 10;

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

export function useChats(userId: string) {
  // Only rendered client-side, after sign-in, so reading storage during the first render is safe.
  const [chats, setChats] = useState<Chat[]>(() => loadChats(userId));
  // null means the Home view; a chat opens when the user picks one or sends a prompt from Home.
  const [activeId, setActiveId] = useState<string | null>(null);
  const pollers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const stopPolling = useCallback((messageId: string) => {
    clearTimeout(pollers.current.get(messageId));
    pollers.current.delete(messageId);
  }, []);

  const updateChat = useCallback((chatId: string, updater: (chat: Chat) => Chat) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...updater(c), updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const patchMessage = useCallback(
    (chatId: string, messageId: string, patch: Partial<ChatMessage>) =>
      updateChat(chatId, (c) => ({
        ...c,
        messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
      })),
    [updateChat]
  );

  /** Follow a queued prompt until the backend reports it done or failed. */
  const track = useCallback(
    (chatId: string, messageId: string, promptId: string, title: string) => {
      let failures = 0;
      const fail = (content: string) => patchMessage(chatId, messageId, { isStreaming: false, isError: true, content });

      const poll = async () => {
        try {
          const { job } = await api.prompt.status(promptId);
          failures = 0;
          const tokens = job.tokens?.total ?? undefined;
          const tokenDetails = job.tokens ?? undefined;
          const logs = job.logs ?? undefined;
          const thought = (job as any).thought ?? undefined;
          // The chat's first video to settle a look sets the chat's theme; every later video reuses it.
          if (job.theme && job.harnessJobId) {
            updateChat(chatId, (c) => (c.theme ? c : { ...c, theme: { jobId: job.harnessJobId!, name: job.theme! } }));
          }
          if (job.status === "done") {
            const url = job.play[0];
            if (url) {
              patchMessage(chatId, messageId, {
                isStreaming: false,
                stages: stagesFor("done"),
                activity: undefined,
                harnessJobId: job.harnessJobId ?? undefined,
                content: "Your video is ready.",
                preview: { title, url },
                tokens,
                tokenDetails,
                logs,
                thought,
                provider: (job as any).provider,
                model: (job as any).model,
                effort: (job as any).effort,
              });
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
            provider: (job as any).provider,
            model: (job as any).model,
            effort: (job as any).effort,
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

  // Resume any render that was still running at the last reload.
  useEffect(() => {
    for (const chat of loadChats(userId)) {
      chat.messages.forEach((m, i) => {
        if (m.isStreaming && m.promptId) track(chat.id, m.id, m.promptId, deriveTitle(chat.messages[i - 1]?.content ?? ""));
      });
    }
    const active = pollers.current;
    return () => {
      active.forEach(clearTimeout);
      active.clear();
    };
  }, [userId, track]);

  useEffect(() => {
    saveChats(userId, chats);
  }, [userId, chats]);

  const activeChat = useMemo(() => chats.find((c) => c.id === activeId) ?? null, [chats, activeId]);

  const goHome = useCallback(() => setActiveId(null), []);

  const deleteChat = useCallback(
    (chatId: string) => {
      chats.find((c) => c.id === chatId)?.messages.forEach((m) => stopPolling(m.id));
      const remaining = chats.filter((c) => c.id !== chatId);
      setChats(remaining);
      if (activeId === chatId) setActiveId(remaining[0]?.id ?? null);
    },
    [chats, activeId, stopPolling]
  );

  const renameChat = useCallback(
    (chatId: string, title: string) => {
      const clean = title.trim();
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
    async (text: string, settings?: ChatSettings) => {
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
      const effectiveSettings = chat.settings ?? settings ?? DEFAULT_SETTINGS;
      const { ratio, length, provider, model, effort } = effectiveSettings;

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
      };
      updateChat(chat.id, (c) => ({
        ...c,
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
          ...(chat.theme ? { themeFrom: chat.theme.jobId } : {})
        });
        track(chat.id, assistant.id, promptId, title);
      } catch (err) {
        patchMessage(chat.id, assistant.id, {
          isStreaming: false,
          isError: true,
          content: err instanceof Error ? err.message : "Could not submit your prompt.",
        });
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
      const chat = chats.find((c) => c.id === chatId);
      const index = chat?.messages.findIndex((m) => m.id === messageId) ?? -1;
      const message = chat?.messages[index];
      const prompt = chat?.messages[index - 1]?.content ?? "";
      if (!chat || !message?.promptId || message.isStreaming) return;
      const { promptId } = message;
      const title = deriveTitle(prompt);
      patchMessage(chatId, messageId, { isStreaming: true, isError: false, content: "", stages: stagesFor("queued"), activity: undefined });
      try {
        let status: PromptJob | null = null;
        try {
          status = (await api.prompt.status(promptId)).job;
        } catch (err) {
          if (!(err instanceof ApiError && err.statusCode === 404)) throw err;
        }
        if (!status) {
          const { ratio, length, provider, model, effort } = chat.settings ?? DEFAULT_SETTINGS;
          await api.prompt.queue({
            prompt,
            promptId,
            ratio,
            length,
            provider: message.provider ?? provider,
            model: message.model ?? model,
            effort: message.effort ?? effort,
            ...(chat.theme ? { themeFrom: chat.theme.jobId } : {})
          });
        } else if (status.status === "failed") {
          await api.prompt.retry(promptId);
        }
        track(chatId, messageId, promptId, title);
      } catch (err) {
        patchMessage(chatId, messageId, {
          isStreaming: false,
          isError: true,
          content: err instanceof Error ? err.message : "Could not retry this video.",
        });
      }
    },
    [chats, patchMessage, track]
  );

  return { chats, activeChat, activeId, goHome, selectChat: setActiveId, deleteChat, renameChat, send, newChat, retry };
}
