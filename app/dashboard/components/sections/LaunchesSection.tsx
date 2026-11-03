"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiCheck, FiEdit2, FiFilm, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { type Chat, type ChatSettings, DEFAULT_SETTINGS, lastFinishedTake, themePending } from "../../lib/chatStore";
import { SHOWREEL } from "../../../components/landing/showreel";
import ChatMessages from "../ChatMessages";
import PromptBox from "../PromptBox";
import StudioSettings from "../StudioSettings";

/* Starting points are real films from the showreel: their prompts made what the thumbnails show. */
const EXAMPLE_IDS = ["launch-day", "ink-to-motion", "vertigo", "halftone-field"];
const EXAMPLES = EXAMPLE_IDS.map((id) => SHOWREEL.find((s) => s.id === id)).filter((s): s is (typeof SHOWREEL)[number] => Boolean(s));

type Tone = "ready" | "working" | "failed" | "draft";
const TONE: Record<Tone, { label: string; dot: string }> = {
  ready: { label: "Ready", dot: "bg-[#4d7c0f]" },
  working: { label: "Rendering", dot: "bg-[#b45309]" },
  failed: { label: "Needs attention", dot: "bg-[#b42318]" },
  draft: { label: "Draft", dot: "bg-[#9aa1b0]" },
};

function filmTone(chat: Chat): Tone {
  const last = [...chat.messages].reverse().find((m) => m.role === "assistant");
  if (last?.isStreaming) return "working";
  if (last?.isError) return "failed";
  if (chat.messages.some((m) => m.preview)) return "ready";
  return "draft";
}

function ago(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(min)) return "";
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  if (min < 24 * 60) return `${Math.round(min / 60)} h ago`;
  if (min < 48 * 60) return "Yesterday";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function FilmsList({
  chats,
  activeId,
  onSelect,
  onDelete,
  onNew,
}: {
  chats: Chat[];
  activeId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <section aria-labelledby="studio-films-title" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id="studio-films-title" className="text-[13px] font-semibold text-[var(--db-ink)]">
          Recent videos
        </h2>
        <button
          type="button"
          onClick={onNew}
          className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[var(--db-rule-strong)] bg-white px-3 text-[12.5px] font-medium text-[var(--db-ink)] hover:border-[rgba(7,20,46,0.32)] lg:h-9 cursor-pointer"
        >
          <FiPlus size={13} aria-hidden="true" /> New video
        </button>
      </div>
      {chats.length === 0 ? (
        <p className="text-[12.5px] leading-relaxed text-[var(--db-muted)]">Videos you make appear here.</p>
      ) : (
        <ul className="-mx-2 space-y-0.5">
          {chats.map((c) => {
            const tone = TONE[filmTone(c)];
            const active = c.id === activeId;
            return (
              <li key={c.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  aria-current={active ? "true" : undefined}
                  className={`flex w-full min-w-0 flex-col items-start gap-0.5 rounded-lg px-2 py-2 pr-10 text-left transition cursor-pointer ${
                    active ? "bg-white shadow-[var(--db-shadow-sm)]" : "hover:bg-white/70"
                  }`}
                >
                  <span className="w-full truncate text-[13px] font-medium text-[var(--db-ink)]">{c.title || "Untitled video"}</span>
                  <span className="flex w-full items-center gap-1.5 text-[12px] text-[var(--db-muted)]">
                    <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
                    <span>{tone.label}</span>
                    <span className="ml-auto shrink-0 tabular-nums">{ago(c.updatedAt)}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  aria-label={`Remove ${c.title || "this video"} from the list`}
                  title="Remove from the list (the video stays in Your videos)"
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-[var(--db-muted)] transition hover:bg-[var(--db-paper-2)] hover:text-[#b42318] focus-visible:opacity-100 lg:right-1 lg:h-8 lg:w-8 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
                >
                  <FiTrash2 size={13} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

interface LaunchesSectionProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSend: (text: string, settings?: ChatSettings, options?: { editOf?: string }) => void;
  onRetry: (chatId: string, messageId: string) => void;
  onNewChat: (settings?: ChatSettings) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onBack: () => void;
  onUpdateChatSettings?: (chatId: string, settings: ChatSettings) => void;
}

export default function LaunchesSection({
  chats,
  activeChat,
  onSend,
  onRetry,
  onSelect,
  onDelete,
  onRename,
  onBack,
  onUpdateChatSettings,
}: LaunchesSectionProps) {
  const [draft, setDraft] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [draftPrompt, setDraftPrompt] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [filmsOpen, setFilmsOpen] = useState(false);
  // A follow-up changes the latest finished video unless "New take" is chosen.
  const [newTake, setNewTake] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const filmsRef = useRef<HTMLDivElement | null>(null);

  const messages = activeChat?.messages;
  useEffect(() => {
    if (messages?.length) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // The mobile films list closes on Escape and on a click outside it.
  useEffect(() => {
    if (!filmsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFilmsOpen(false);
    const onClick = (e: MouseEvent) => {
      if (filmsRef.current && !filmsRef.current.contains(e.target as Node)) setFilmsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [filmsOpen]);

  // A film keeps its own settings; a new one starts from the last ones used here.
  const settings: ChatSettings = { ...draft, ...(activeChat?.settings ?? {}) };
  const changeSettings = useCallback(
    (st: ChatSettings) => {
      setDraft(st);
      if (activeChat && onUpdateChatSettings) onUpdateChatSettings(activeChat.id, st);
    },
    [activeChat, onUpdateChatSettings]
  );

  const hasMessages = !!activeChat && activeChat.messages.length > 0;
  const editable = lastFinishedTake(activeChat);
  const sendFollowUp = (text: string) => onSend(text, settings, editable && !newTake ? { editOf: editable.promptId } : undefined);
  const tone = activeChat ? filmTone(activeChat) : null;
  const waitingForTheme = activeChat ? themePending(activeChat) : false;

  const select = (id: string) => {
    onSelect(id);
    setFilmsOpen(false);
  };
  const startNew = () => {
    onBack();
    setFilmsOpen(false);
  };
  const saveRename = () => {
    if (activeChat && renameValue.trim()) onRename(activeChat.id, renameValue.trim());
    setRenaming(false);
  };

  const filmsList = <FilmsList chats={chats} activeId={activeChat?.id} onSelect={select} onDelete={onDelete} onNew={startNew} />;

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Main column: the film's title, its takes (or a new film), and the composer */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--db-rule)] px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            {activeChat && renaming ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveRename();
                }}
                className="flex min-w-0 items-center gap-1"
              >
                <label htmlFor="film-title" className="sr-only">
                  Video title
                </label>
                <input
                  id="film-title"
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={saveRename}
                  onKeyDown={(e) => e.key === "Escape" && setRenaming(false)}
                  className="h-9 min-w-0 rounded-lg border border-[var(--db-rule-strong)] px-2.5 text-[14px] font-semibold text-[var(--db-ink)] outline-none focus:border-[var(--db-ink)]"
                />
                <button type="submit" aria-label="Save title" className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--db-ink)] hover:bg-[var(--db-paper-2)] cursor-pointer">
                  <FiCheck size={15} aria-hidden="true" />
                </button>
              </form>
            ) : activeChat ? (
              <>
                <h1 className="truncate text-[15px] font-semibold text-[var(--db-ink)]">{activeChat.title || "Untitled video"}</h1>
                <button
                  type="button"
                  onClick={() => {
                    setRenameValue(activeChat.title);
                    setRenaming(true);
                  }}
                  aria-label="Rename video"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--db-muted)] hover:bg-[var(--db-paper-2)] hover:text-[var(--db-ink)] lg:h-8 lg:w-8 cursor-pointer"
                >
                  <FiEdit2 size={13} aria-hidden="true" />
                </button>
                {tone && tone !== "draft" ? (
                  <span className="hidden shrink-0 items-center gap-1.5 text-[12.5px] text-[var(--db-muted)] sm:flex">
                    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${TONE[tone].dot}`} />
                    {TONE[tone].label}
                  </span>
                ) : null}
              </>
            ) : (
              <h1 className="text-[15px] font-semibold text-[var(--db-ink)]">New video</h1>
            )}
          </div>

          {/* Narrow screens: the films list lives behind this button (the side panel holds it on wide ones) */}
          <div ref={filmsRef} className="relative shrink-0 lg:hidden">
            <button
              type="button"
              onClick={() => setFilmsOpen((v) => !v)}
              aria-expanded={filmsOpen}
              aria-controls="studio-films-popover"
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[var(--db-rule-strong)] bg-white px-3 text-[12.5px] font-medium text-[var(--db-ink)] cursor-pointer"
            >
              <FiFilm size={13} aria-hidden="true" />
              Videos{chats.length ? <span className="tabular-nums text-[var(--db-muted)]">{chats.length}</span> : null}
            </button>
            {filmsOpen ? (
              <div
                id="studio-films-popover"
                className="absolute right-0 top-full z-40 mt-2 max-h-[70svh] w-[min(320px,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-[var(--db-rule-strong)] bg-[var(--db-paper-2)] p-4 shadow-[var(--db-shadow-lg)]"
              >
                <div className="mb-2 flex justify-end">
                  <button type="button" onClick={() => setFilmsOpen(false)} aria-label="Close videos" className="flex h-11 w-11 items-center justify-center rounded-md text-[var(--db-muted)] hover:bg-white cursor-pointer">
                    <FiX size={15} aria-hidden="true" />
                  </button>
                </div>
                {filmsList}
              </div>
            ) : null}
          </div>
        </div>

        {hasMessages && activeChat ? (
          <>
            <ChatMessages
              messages={activeChat.messages}
              ratio={settings.ratio}
              bottomRef={bottomRef}
              onRetry={(messageId) => onRetry(activeChat.id, messageId)}
            />
            <div className="shrink-0 border-t border-[var(--db-rule)] bg-white px-4 py-3 sm:px-8 sm:py-4">
              <div className="mx-auto max-w-[820px]">
                {editable ? (
                  <div role="radiogroup" aria-label="What the next message does" className="mb-2 flex items-center gap-1 text-[12.5px]">
                    {[
                      { id: false, label: "Change this video", hint: "Keeps what you don't mention" },
                      { id: true, label: "New take", hint: "Starts again in the same look" },
                    ].map((o) => (
                      <button
                        key={String(o.id)}
                        type="button"
                        role="radio"
                        aria-checked={newTake === o.id}
                        title={o.hint}
                        onClick={() => setNewTake(o.id)}
                        className={`h-11 rounded-lg px-3 font-medium transition cursor-pointer lg:h-8 ${newTake === o.id ? "bg-[var(--db-ink)] text-white" : "text-[var(--db-muted)] hover:bg-[var(--db-paper-2)] hover:text-[var(--db-ink)]"}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                ) : null}
                <PromptBox
                  onSend={sendFollowUp}
                  settings={settings}
                  onSettingsChange={changeSettings}
                  placeholder={editable && !newTake ? "What should change? e.g. make the title bigger, use our brand colours…" : "Describe the next take…"}
                  disabledReason={waitingForTheme ? "The first take is still choosing the look. You can send the next prompt once it's set." : undefined}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[760px] px-4 py-8 sm:px-8 sm:py-12">
              <h2 className="db-serif text-[34px] leading-[1.05] tracking-[-0.02em] text-[var(--db-ink)] sm:text-[44px]">What should we make?</h2>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[var(--db-muted)]">
                Describe what&apos;s on screen, the words and the feel. The first take sets the look; after that, ask for
                changes in plain words.
              </p>

              <div className="mt-6">
                <PromptBox
                  key={draftPrompt}
                  size="start"
                  autoFocus
                  initialValue={draftPrompt}
                  settings={settings}
                  onSettingsChange={changeSettings}
                  onSend={(text) => onSend(text, settings)}
                />
              </div>

              <section aria-labelledby="studio-examples-title" className="mt-10">
                <h2 id="studio-examples-title" className="text-[13px] font-semibold text-[var(--db-ink)]">
                  Start from an example
                </h2>
                <p className="mt-1 text-[13px] text-[var(--db-faint)]">Each of these was made from the prompt it puts in the box.</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {EXAMPLES.map((ex) => (
                    <li key={ex.id}>
                      <button
                        type="button"
                        onClick={() => setDraftPrompt(ex.prompt)}
                        className="group flex w-full items-center gap-3 rounded-xl border border-[var(--db-rule)] bg-white p-2 pr-3 text-left transition hover:border-[rgba(7,20,46,0.3)] cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- small static poster, already sized */}
                        <img
                          src={`/showreel/${ex.id}.webp`}
                          alt=""
                          width={112}
                          height={63}
                          loading="lazy"
                          className="h-[63px] w-[112px] shrink-0 rounded-lg bg-[var(--db-paper-2)] object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-[13.5px] font-semibold text-[var(--db-ink)]">{ex.title}</span>
                          <span className="block text-[12.5px] text-[var(--db-faint)]">{ex.category}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>

      {/* Wide screens: the next film's settings and the films list, beside the work */}
      <aside aria-label="Video settings and recent videos" className="hidden w-[300px] shrink-0 flex-col gap-8 overflow-y-auto border-l border-[var(--db-rule)] bg-[var(--db-paper-2)] p-5 lg:flex">
        <StudioSettings settings={settings} onChange={changeSettings} variant="panel" />
        <div className="border-t border-[var(--db-rule)] pt-6">{filmsList}</div>
      </aside>
    </div>
  );
}
