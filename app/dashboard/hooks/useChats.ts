"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Chat,
  type ChatMessage,
  type PipelineStage,
  CHAT_STYLES,
  createChat,
  createId,
  deriveTitle,
  loadChats,
  saveChats,
} from "../lib/chatStore";

const PIPELINE_TEMPLATE: Omit<PipelineStage, "state">[] = [
  { id: "plan", label: "Planning shots & script" },
  { id: "assets", label: "Resolving visual assets" },
  { id: "compose", label: "Composing motion scenes" },
  { id: "preview", label: "Rendering preview" },
];

const SUGGESTIONS = [
  "Kinetic typography short on compound interest",
  "Data explainer: why startups fail in year one",
  "Product promo for a minimalist habit tracker app",
  "60-second tech news vertical on the AI race",
];

/** Delays (ms) between pipeline stage transitions for the simulated reply. */
const STAGE_DELAYS = [900, 1400, 1200, 1500];

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Hydrate from storage (client only)
  useEffect(() => {
    const stored = loadChats();
    setChats(stored);
    setActiveId(stored[0]?.id ?? null);
    setIsLoading(false);
  }, []);

  // Persist on every change (skip pre-hydration)
  useEffect(() => {
    if (!isLoading) saveChats(chats);
  }, [chats, isLoading]);

  // Clear pending simulation timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeId) ?? null,
    [chats, activeId]
  );

  const updateChat = useCallback((chatId: string, updater: (chat: Chat) => Chat) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...updater(c), updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const handleNewChat = useCallback(
    (format: "9:16" | "16:9" = "9:16", style: string = CHAT_STYLES[0]) => {
      const chat = createChat(format, style);
      setChats((prev) => [chat, ...prev]);
      setActiveId(chat.id);
    },
    []
  );

  const handleSelectChat = useCallback((chatId: string) => setActiveId(chatId), []);

  const handleDeleteChat = useCallback((chatId: string) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== chatId);
      setActiveId((current) =>
        current === chatId ? (next[0]?.id ?? null) : current
      );
      return next;
    });
  }, []);

  const handleRenameChat = useCallback(
    (chatId: string, title: string) => {
      const clean = title.trim();
      if (!clean) return;
      updateChat(chatId, (c) => ({ ...c, title: clean }));
    },
    [updateChat]
  );

  const handleSetFormat = useCallback(
    (format: "9:16" | "16:9") => {
      if (!activeId) return;
      updateChat(activeId, (c) => ({ ...c, format }));
    },
    [activeId, updateChat]
  );

  const handleSetStyle = useCallback(
    (style: string) => {
      if (!activeId) return;
      updateChat(activeId, (c) => ({ ...c, style }));
    },
    [activeId, updateChat]
  );

  /**
   * Send a prompt: appends the user message, then animates an assistant
   * reply through the generation pipeline stages. Replace `simulateReply`
   * internals with a real `/api/prompt` (SSE/fetch) call when the backend
   * is wired to this UI.
   */
  const handleSend = useCallback(
    (text: string) => {
      const prompt = text.trim();
      if (!prompt || isSending) return;

      const chat = activeChat ?? createChat();
      if (!activeChat) {
        setChats((prev) => [chat, ...prev]);
        setActiveId(chat.id);
      }
      const chatId = chat.id;

      const userMsg: ChatMessage = {
        id: createId("m"),
        role: "user",
        content: prompt,
        createdAt: new Date().toISOString(),
      };
      const assistantMsg: ChatMessage = {
        id: createId("m"),
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        stages: PIPELINE_TEMPLATE.map((s, i) => ({
          ...s,
          state: i === 0 ? "running" : "pending",
        })),
        isStreaming: true,
      };

      updateChat(chatId, (c) => ({
        ...c,
        title: c.messages.length === 0 ? deriveTitle(prompt) : c.title,
        messages: [...c.messages, userMsg, assistantMsg],
      }));
      setIsSending(true);

      const patchAssistant = (patch: Partial<ChatMessage>) => {
        updateChat(chatId, (c) => ({
          ...c,
          messages: c.messages.map((m) => (m.id === assistantMsg.id ? { ...m, ...patch } : m)),
        }));
      };

      const patchStage = (index: number, state: PipelineStage["state"]) => {
        updateChat(chatId, (c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === assistantMsg.id && m.stages
              ? {
                  ...m,
                  stages: m.stages.map((s, i) => (i === index ? { ...s, state } : s)),
                }
              : m
          ),
        }));
      };

      // Animate the pipeline: each stage starts as the previous one completes.
      let elapsed = 0;
      PIPELINE_TEMPLATE.forEach((_, i) => {
        const delay = STAGE_DELAYS[i] ?? 1000;
        timersRef.current.push(
          setTimeout(() => {
            if (i > 0) {
              patchStage(i - 1, "done");
              patchStage(i, "running");
            }
          }, elapsed)
        );
        elapsed += delay;
      });

      // Finish: mark streaming complete + attach preview card
      timersRef.current.push(
        setTimeout(() => {
          patchAssistant({
            isStreaming: false,
            content: `Your short is ready. I composed a ${chat.format} motion graphics scene from your prompt in the **${chat.style}** style. Open it in the Studio to refine timing, voice-over, or export.`,
            preview: {
              format: chat.format,
              title: deriveTitle(prompt),
              style: chat.style,
            },
          });
          setIsSending(false);
        }, elapsed + 400)
      );
    },
    [activeChat, isSending, updateChat]
  );

  return {
    chats,
    activeChat,
    activeId,
    isLoading,
    isSending,
    suggestions: SUGGESTIONS,
    newChat: handleNewChat,
    selectChat: handleSelectChat,
    deleteChat: handleDeleteChat,
    renameChat: handleRenameChat,
    setFormat: handleSetFormat,
    setStyle: handleSetStyle,
    send: handleSend,
  };
}
