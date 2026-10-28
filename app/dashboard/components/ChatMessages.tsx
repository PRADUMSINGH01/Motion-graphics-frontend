"use client";

import type { RefObject } from "react";
import Image from "next/image";
import { FiRotateCw, FiAlertTriangle } from "react-icons/fi";
import { type ChatMessage, type Ratio, formatTokens } from "../lib/chatStore";
import VideoActions from "./VideoActions";
import RenderLoader from "./RenderLoader";

function AssistantAvatar() {
  return (
    <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surf-111110 border border-surf-2a2927 shadow-xs">
      <div className="relative h-4 w-4">
        <Image
          src="/byreel-mark.png"
          alt="byreel"
          fill
          className="object-contain"
          sizes="16px"
        />
      </div>
    </div>
  );
}

function VideoPlayerCard({ title, url, ratio, tokens }: { title: string; url: string; ratio: Ratio; tokens?: number }) {
  const isVertical = ratio === "9:16";
  const isSquare = ratio === "1:1";

  return (
    <div className="space-y-2.5">
      {/* Video Viewport */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-black border border-surf-e5e2d8 shadow-lg ${
          isVertical
            ? "max-w-[300px] aspect-[9/16]"
            : isSquare
            ? "max-w-[380px] aspect-square"
            : "max-w-2xl aspect-[16/9]"
        }`}
      >
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          aria-label={title}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Title & Actions Bar */}
      <div className="max-w-2xl flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-2">
          <h3 className="text-[14.5px] sm:text-[15.5px] font-semibold text-ink-111110 tracking-tight">{title}</h3>
          <span className="font-mono text-[10px] text-ink-717069 bg-surf-f2efe6 px-1.5 py-0.5 rounded-md">
            {ratio}
          </span>
          {tokens != null && (
            <span className="font-mono text-[10px] text-ink-717069 bg-surf-f2efe6 px-1.5 py-0.5 rounded-md" title="Model tokens this video used">
              {formatTokens(tokens)}
            </span>
          )}
        </div>

        <VideoActions url={url} title={title} />
      </div>
    </div>
  );
}

function AssistantMessage({
  message,
  ratio,
  onRetry,
}: {
  message: ChatMessage;
  ratio: Ratio;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-start gap-3 sm:gap-3.5 db-rise">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 space-y-3 pt-0.5">
        {/* Live Loading Rendering Viewfinder */}
        {message.isStreaming && message.stages && (
          <RenderLoader
            stages={message.stages}
            activity={message.activity}
            ratio={ratio}
            startedAt={message.createdAt}
            tokens={message.tokens}
          />
        )}

        {/* Text message content */}
        {message.content && !message.isError && (
          <div className="max-w-2xl text-[14px] sm:text-[14.5px] leading-relaxed text-ink-2d2c28">
            {message.content}
          </div>
        )}

        {/* Error panel */}
        {message.isError && (
          <div className="flex max-w-xl items-start gap-2.5 rounded-xl border border-surf-fecaca bg-surf-fef2f2 p-3 text-ink-991b1b">
            <FiAlertTriangle className="mt-0.5 shrink-0 text-ink-dc2626" size={16} />
            <div className="min-w-0 space-y-1.5">
              <p className="text-[13px] text-ink-7f1d1d leading-relaxed break-words">{message.content}</p>
              {message.tokens != null && (
                <p className="font-mono text-[10.5px] text-ink-991b1b/70">Used {formatTokens(message.tokens)} so far</p>
              )}
              <button
                type="button"
                onClick={onRetry}
                title="Continue from the step that failed, keeping what was already made"
                className="inline-flex items-center gap-1.5 rounded-md bg-surf-dc2626 px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-xs transition hover:bg-surf-b91c1c"
              >
                <FiRotateCw size={11} /> Retry
              </button>
            </div>
          </div>
        )}

        {/* Finished Video Card */}
        {message.preview && (
          <VideoPlayerCard
            title={message.preview.title}
            url={message.preview.url}
            ratio={ratio}
            tokens={message.tokens}
          />
        )}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end db-rise">
      <div className="max-w-[85%] sm:max-w-xl rounded-2xl rounded-br-xs bg-surf-111110 px-4 py-2.5 text-[14px] leading-relaxed text-ink-fcfbf7 shadow-2xs break-words whitespace-pre-wrap">
        {message.content}
      </div>
    </div>
  );
}

export default function ChatMessages({
  messages,
  ratio,
  bottomRef,
  onRetry,
}: {
  messages: ChatMessage[];
  ratio: Ratio;
  bottomRef: RefObject<HTMLDivElement | null>;
  /** Retry a failed reply in place (by message id). */
  onRetry: (messageId: string) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto" role="log" aria-live="polite" aria-label="Conversation History">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
        {messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage
              key={message.id}
              message={message}
              ratio={ratio}
              onRetry={() => onRetry(message.id)}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}