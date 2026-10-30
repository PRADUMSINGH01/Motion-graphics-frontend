"use client";

import { useState, type RefObject } from "react";
import Image from "next/image";
import { FiRotateCw, FiAlertTriangle } from "react-icons/fi";
import { type ChatMessage, type Ratio, formatTokens } from "../lib/chatStore";
import VideoActions from "./VideoActions";
import RenderLoader from "./RenderLoader";

function AssistantAvatar() {
  return (
    <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#07142e] border border-[rgba(7,20,46,0.16)] shadow-xs">
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

function VideoPlayerCard({
  title,
  url,
  ratio,
  tokens,
  tokenDetails,
  logs,
  model,
  effort,
}: {
  title: string;
  url: string;
  ratio: Ratio;
  tokens?: number;
  tokenDetails?: { total: number; input: number; output: number };
  logs?: Array<{ ts: string; line: string }>;
  model?: string;
  effort?: string;
}) {
  const [showLogs, setShowLogs] = useState(false);
  const isVertical = ratio === "9:16";
  const isSquare = ratio === "1:1";
  const totalTokens = tokenDetails?.total ?? tokens;

  return (
    <div className="space-y-2.5">
      {/* Video Viewport with zero audio constraint */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-black border border-[rgba(7,20,46,0.16)] shadow-lg ${
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
          muted
          preload="metadata"
          aria-label={title}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Title & Actions Bar */}
      <div className="max-w-2xl flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[14.5px] sm:text-[15.5px] font-semibold text-[#07142e] tracking-tight">{title}</h3>
          <span className="font-mono text-[10px] font-bold text-[rgba(7,20,46,0.7)] bg-[rgba(7,20,46,0.06)] border border-[rgba(7,20,46,0.14)] px-1.5 py-0.5 rounded-md">
            {ratio}
          </span>
          {model && (
            <span className="font-mono text-[10px] font-medium text-[#07142e] bg-[rgba(7,20,46,0.06)] border border-[rgba(7,20,46,0.14)] px-1.5 py-0.5 rounded-md">
              🤖 {model} {effort ? `· ${effort}` : ""}
            </span>
          )}
          {totalTokens != null && (
            <span
              className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#07142e] bg-[rgba(7,20,46,0.06)] border border-[rgba(7,20,46,0.14)] px-2 py-0.5 rounded-md"
              title={
                tokenDetails
                  ? `Total: ${formatTokens(tokenDetails.total)} (${formatTokens(tokenDetails.input)} in, ${formatTokens(tokenDetails.output)} out)`
                  : "Model tokens used"
              }
            >
              <span>⚡ {formatTokens(totalTokens)}</span>
              {tokenDetails && (
                <span className="text-[9px] text-[rgba(7,20,46,0.55)] font-normal">
                  ({formatTokens(tokenDetails.input)} in · {formatTokens(tokenDetails.output)} out)
                </span>
              )}
            </span>
          )}
          {logs && logs.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLogs((prev) => !prev)}
              className="font-mono text-[10px] font-medium text-[rgba(7,20,46,0.6)] hover:text-[#07142e] underline transition-colors cursor-pointer"
            >
              {showLogs ? "Hide Reasoning" : "View Agent Thinking"}
            </button>
          )}
        </div>

        <VideoActions url={url} title={title} />
      </div>

      {/* Expandable Agent Reasoning Tray */}
      {showLogs && logs && logs.length > 0 && (
        <div className="max-w-2xl rounded-xl bg-[#07142e] border border-white/10 p-3 text-white font-mono text-[10px] space-y-1.5 max-h-48 overflow-y-auto no-scrollbar shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1 text-[9.5px] text-[#c5ef26]">
            <span>Model Reasoning & Event Log</span>
            <span>{logs.length} trace events</span>
          </div>
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2 text-white/80">
              <span className="text-white/30 shrink-0">{l.ts ? l.ts.slice(11, 19) : ""}</span>
              <span className="break-all">{l.line}</span>
            </div>
          ))}
        </div>
      )}
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
        {/* Live Loading Rendering Viewfinder with Agent Thinking Stream */}
        {message.isStreaming && message.stages && (
          <RenderLoader
            stages={message.stages}
            activity={message.activity}
            thought={message.thought}
            ratio={ratio}
            startedAt={message.createdAt}
            tokens={message.tokens}
            tokenDetails={message.tokenDetails}
            logs={message.logs}
            provider={message.provider}
            model={message.model}
            effort={message.effort}
          />
        )}

        {/* Text message content */}
        {message.content && !message.isError && (
          <div className="max-w-2xl text-[14px] sm:text-[14.5px] leading-relaxed text-[#07142e] font-normal">
            {message.content}
          </div>
        )}

        {/* Error panel */}
        {message.isError && (
          <div className="flex max-w-xl items-start gap-2.5 rounded-xl border border-[#fecaca] bg-[rgba(254,242,242,0.85)] p-3 text-[#991b1b]">
            <FiAlertTriangle className="mt-0.5 shrink-0 text-[#dc2626]" size={16} />
            <div className="min-w-0 space-y-1.5">
              <p className="text-[13px] text-[#7f1d1d] leading-relaxed break-words">{message.content}</p>
              {message.tokens != null && (
                <p className="font-mono text-[10.5px] text-[#991b1b]/70">Used {formatTokens(message.tokens)} so far</p>
              )}
              <button
                type="button"
                onClick={onRetry}
                title="Continue from the step that failed, keeping what was already made"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#dc2626] px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-xs transition hover:bg-[#b91c1c]"
              >
                <FiRotateCw size={11} /> Retry
              </button>
            </div>
          </div>
        )}

        {/* Finished Video Card with Reasoning Explorer */}
        {message.preview && (
          <VideoPlayerCard
            title={message.preview.title}
            url={message.preview.url}
            ratio={ratio}
            tokens={message.tokens}
            tokenDetails={message.tokenDetails}
            logs={message.logs}
            model={message.model}
            effort={message.effort}
          />
        )}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end db-rise">
      <div className="max-w-[85%] sm:max-w-xl rounded-2xl rounded-br-xs bg-[#07142e] px-4 py-2.5 text-[14px] leading-relaxed text-[#faf8f2] shadow-2xs break-words whitespace-pre-wrap">
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