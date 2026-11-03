"use client";

import { useState, type RefObject } from "react";
import { FiRotateCw, FiAlertTriangle } from "react-icons/fi";
import { type ChatMessage, type Ratio, formatTokens } from "../lib/chatStore";
import { creditCost } from "../../lib/plans";
import { useModels, type ModelOption } from "./ModelSelectorModal";
import VideoActions from "./VideoActions";
import RenderLoader from "./RenderLoader";
import { frameClass } from "./filmFrame";

/** A model id as people know it: its name when the server lists it. */
const modelName = (models: ModelOption[], id?: string) => (id ? models.find((m) => m.id === id)?.name ?? id : undefined);

function FilmCard({ message, ratio, model }: { message: ChatMessage; ratio: Ratio; model?: string }) {
  const [showLog, setShowLog] = useState(false);
  const preview = message.preview!;
  const total = message.tokenDetails?.total ?? message.tokens;
  const length = message.length;

  return (
    <figure className="m-0 space-y-3">
      <div className={`overflow-hidden rounded-xl bg-black shadow-[var(--db-shadow-md)] ${frameClass(ratio)}`}>
        <video src={preview.url} controls loop playsInline muted preload="metadata" aria-label={preview.title} className="h-full w-full object-contain" />
      </div>

      <figcaption className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-[15.5px] font-semibold leading-snug text-[var(--db-ink)]">{preview.title}</h3>
          <dl className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[var(--db-faint)]">
            <div className="flex gap-1">
              <dt className="sr-only">Frame</dt>
              <dd className="m-0">{ratio}</dd>
            </div>
            {length ? (
              <>
                <div className="flex gap-1">
                  <dt className="sr-only">Length</dt>
                  <dd className="m-0 tabular-nums">{length} s</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="sr-only">Cost</dt>
                  <dd className="m-0 tabular-nums" title={message.credits != null ? "Charged for what it used: model tokens and render time" : undefined}>
                    {message.credits != null ? `${message.credits} ${message.credits === 1 ? "credit" : "credits"}` : `about ${creditCost(length)} ${creditCost(length) === 1 ? "credit" : "credits"}`}
                  </dd>
                </div>
              </>
            ) : null}
            {total != null ? (
              <div className="flex gap-1">
                <dt className="sr-only">Model tokens</dt>
                <dd
                  className="m-0 tabular-nums"
                  title={
                    message.tokenDetails
                      ? `${message.tokenDetails.input.toLocaleString()} in (${(message.tokenDetails.cachedInput ?? 0).toLocaleString()} cached), ${message.tokenDetails.output.toLocaleString()} out`
                      : undefined
                  }
                >
                  {formatTokens(total)}
                </dd>
              </div>
            ) : null}
            {model ? (
              <div className="flex gap-1">
                <dt className="sr-only">Model</dt>
                <dd className="m-0">
                  {model}
                  {message.effort ? `, ${message.effort} effort` : ""}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
        <VideoActions url={preview.url} title={preview.title} />
      </figcaption>

      {message.notes?.length ? (
        <ul className="m-0 list-none space-y-1 rounded-lg border border-[#f0e2b6] bg-[#fdf8e8] px-3 py-2 text-[12.5px] leading-relaxed text-[#5c4a12]">
          {message.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      ) : null}

      {message.logs && message.logs.length > 0 ? (
        <div>
          <button
            type="button"
            onClick={() => setShowLog((v) => !v)}
            aria-expanded={showLog}
            className="text-[12.5px] font-medium text-[var(--db-muted)] underline underline-offset-2 hover:text-[var(--db-ink)] cursor-pointer"
          >
            {showLog ? "Hide build log" : "Show build log"}
          </button>
          {showLog ? (
            <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-[var(--db-rule)] bg-[var(--db-paper-2)] p-3 font-mono text-[11.5px] leading-relaxed text-[var(--db-muted)]">
              {total != null ? <p className="mb-2 text-[var(--db-ink)]">{formatTokens(total)} model tokens</p> : null}
              {message.logs.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <span className="shrink-0 text-[var(--db-faint)]">{l.ts ? l.ts.slice(11, 19) : ""}</span>
                  <span className="break-words">{l.line}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
}

function FailedFilm({ message, onRetry }: { message: ChatMessage; onRetry: () => void }) {
  return (
    <div className="flex max-w-[640px] items-start gap-3 rounded-xl border border-[#f1c9c4] bg-[#fff7f6] p-4">
      <FiAlertTriangle className="mt-0.5 shrink-0 text-[#b42318]" size={17} aria-hidden="true" />
      <div className="min-w-0 space-y-2">
        <p className="break-words text-[14px] font-medium leading-relaxed text-[#7a1a12]">{message.content}</p>
        {message.paywall ? (
          <p className="text-[13px] leading-relaxed text-[#7a1a12]">
            {message.paywall === "PLAN_LIMIT"
              ? "Choose a shorter length, or upgrade for longer films."
              : "Your credits renew with your plan, or upgrade for more."}
          </p>
        ) : message.tokens != null ? (
          <p className="text-[12.5px] text-[#7a1a12]">Used {formatTokens(message.tokens)} model tokens before it stopped.</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {message.paywall ? (
            <a href="#membership" className="inline-flex h-9 items-center rounded-lg bg-[var(--db-ink)] px-3.5 text-[13px] font-semibold text-white hover:bg-[#040c1c]">
              See plans
            </a>
          ) : null}
          {message.paywall === "CREDITS_EXHAUSTED" ? (
            <a href="#billing" className="inline-flex h-9 items-center rounded-lg border border-[#e3b4ae] bg-white px-3.5 text-[13px] font-medium text-[#7a1a12] hover:bg-[#fff1ef]">
              Credits and usage
            </a>
          ) : null}
          <button
            type="button"
            onClick={onRetry}
            title={message.paywall ? "Try again after upgrading or choosing a shorter length" : "Continue from the step that failed, keeping what was made"}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e3b4ae] bg-white px-3.5 text-[13px] font-medium text-[#7a1a12] hover:bg-[#fff1ef] cursor-pointer"
          >
            <FiRotateCw size={13} aria-hidden="true" /> {message.paywall ? "Try again" : "Retry"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({ message, ratio, onRetry, models }: { message: ChatMessage; ratio: Ratio; onRetry: () => void; models: ModelOption[] }) {
  const frame = message.ratio ?? ratio;
  const model = modelName(models, message.model);
  return (
    <div className="space-y-3">
      {message.editOf ? <p className="m-0 text-[12px] font-medium text-[var(--db-faint)]">Edit of the video above</p> : null}
      {message.isStreaming && message.stages ? (
        <RenderLoader
          stages={message.stages}
          activity={message.activity}
          thought={message.thought}
          ratio={frame}
          startedAt={message.createdAt}
          tokens={message.tokens}
          tokenDetails={message.tokenDetails}
          logs={message.logs}
          provider={message.provider}
          model={model}
          effort={message.effort}
        />
      ) : null}

      {message.content && !message.isError ? (
        <p className="max-w-[640px] text-[14.5px] leading-relaxed text-[var(--db-ink)]">{message.content}</p>
      ) : null}

      {message.isError ? <FailedFilm message={message} onRetry={onRetry} /> : null}

      {message.preview ? <FilmCard message={message} ratio={frame} model={model} /> : null}
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <p className="m-0 max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md border border-[var(--db-rule)] bg-[var(--db-paper-2)] px-4 py-2.5 text-[14.5px] leading-relaxed text-[var(--db-ink)] sm:max-w-[560px]">
        {message.content}
      </p>
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
  const models = useModels();
  return (
    <div className="min-h-0 flex-1 overflow-y-auto" role="log" aria-live="polite" aria-label="This video and its takes">
      <div className="mx-auto max-w-[820px] space-y-8 px-4 py-6 sm:px-8 sm:py-8">
        {messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage key={message.id} message={message} ratio={ratio} models={models} onRetry={() => onRetry(message.id)} />
          )
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
