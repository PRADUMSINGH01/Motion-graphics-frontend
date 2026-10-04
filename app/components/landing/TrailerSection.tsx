"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PAL, SETS } from "./data";
import { SceneArt, SceneCaption } from "./SceneArt";
import { TRAILER, parseTrailerSource } from "./trailer";

const source = parseTrailerSource(TRAILER.src);
const SCENES = SETS.launch.scenes.map((s, i) => ({ pal: PAL[i], caption: s[1], delay: `${i * 2.2}s` }));

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
    </svg>
  );
}

export default function TrailerSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
  }, [open]);

  // Esc, backdrop click and the close button all end in the dialog's native `close` event.
  // Unmounting the player there is what actually stops the video / iframe audio.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
  };
  const ready = source !== null;

  return (
    <section id="trailer" className="lp-wrap pt-[120px]">
      <div className="lp-sc lp-mono">
        <span>SC.00 — THE TRAILER</span>
        <span>TC 00:00:06:00</span>
      </div>

      <div className="lp-g12 mb-14 grid grid-cols-12 items-end gap-x-8 gap-y-8">
        <h2 className="lp-serif lp-h2 col-span-7">
          See byreel <em className="lp-acc">in motion.</em>
        </h2>
        <p className="col-span-4 col-start-9 m-0 text-[18px]" style={{ color: "var(--lp-ink-2)" }}>
          A short film of how one product link becomes a launch video, a b-roll pack and shorts.
        </p>
      </div>

      <div className="relative">
        <span aria-hidden="true" className="lp-crop" style={{ top: -10, left: -10, borderWidth: "1px 0 0 1px" }} />
        <span aria-hidden="true" className="lp-crop" style={{ top: -10, right: -10, borderWidth: "1px 1px 0 0" }} />
        <span aria-hidden="true" className="lp-crop" style={{ bottom: -10, left: -10, borderWidth: "0 0 1px 1px" }} />
        <span aria-hidden="true" className="lp-crop" style={{ bottom: -10, right: -10, borderWidth: "0 1px 1px 0" }} />

        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            setFailed(false);
            setOpen(true);
          }}
          aria-label={ready ? `Play trailer: ${TRAILER.title}` : "Trailer coming soon"}
          className={`lp-trailer group relative block aspect-video w-full overflow-hidden rounded-[14px] border text-left ${
            ready ? "cursor-pointer" : "cursor-default"
          }`}
          style={{ borderColor: "var(--lp-ink)", background: "#0B0B0F", boxShadow: "0 40px 80px -48px rgba(17,17,16,.55)" }}
        >
          {/* poster: your still if set, otherwise the animated scene reel */}
          {TRAILER.poster ? (
            <Image
              src={TRAILER.poster}
              alt=""
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span aria-hidden="true" className="absolute inset-0 block">
              {SCENES.map((s, i) => (
                <span
                  key={i}
                  className="lp-scene-layer absolute inset-0 block overflow-hidden"
                  style={{ background: s.pal.bg, animationDelay: s.delay }}
                >
                  <SceneArt pal={s.pal} mode="stage" />
                  <SceneCaption text={s.caption} mode="stage" delay={s.delay} />
                </span>
              ))}
            </span>
          )}

          {/* legibility + cinematic shading */}
          <span
            aria-hidden="true"
            className="absolute inset-0 block"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11,11,15,.55), rgba(11,11,15,.1) 30%, rgba(11,11,15,.1) 55%, rgba(11,11,15,.75))",
            }}
          />

          <span className="lp-mono absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 text-[11px] tracking-[0.08em] text-white/80 sm:px-6">
            <span className="inline-flex items-center gap-2">
              <span className="lp-pulse h-[7px] w-[7px] rounded-full" style={{ background: "var(--lp-accent)" }} />
              {ready ? "TRAILER" : "TRAILER · COMING SOON"}
            </span>
            {TRAILER.duration && <span>{TRAILER.duration}</span>}
          </span>

          {/* play */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className={`relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24 ${ready ? "" : "opacity-45"}`}>
              {ready && <span className="lp-play-ring absolute inset-0 rounded-full" aria-hidden="true" />}
              <span
                className={`lp-play relative flex h-full w-full items-center justify-center rounded-full text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,.6)] ${
                  ready ? "transition-transform duration-300 group-hover:scale-110" : ""
                }`}
                style={{ background: ready ? "var(--lp-accent)" : "rgba(255,255,255,.18)" }}
              >
                <PlayIcon className="ml-1 h-9 w-9 sm:h-10 sm:w-10" />
              </span>
            </span>
          </span>

          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 py-5 text-white sm:px-6 sm:py-6">
            <span className="lp-serif text-[clamp(26px,3.4vw,48px)] leading-none tracking-[-0.02em]">
              {TRAILER.title}
            </span>
            <span className="lp-mono hidden flex-none text-[11px] tracking-[0.08em] text-white/70 sm:inline">
              {ready ? "PRESS TO PLAY ▶" : "CHECK BACK SOON"}
            </span>
          </span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="lp-trailer-dialog"
        aria-label={TRAILER.title}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {open && source && (
          <div className="lp-trailer-shell">
            <button type="button" className="lp-trailer-close" onClick={close} aria-label="Close trailer">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>

            <div className="lp-trailer-media">
              {failed ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-white">
                  <span className="lp-serif text-[28px]">The trailer couldn&apos;t load.</span>
                  <span className="text-[14px] text-white/70">Check your connection and try again.</span>
                </div>
              ) : source.kind === "file" ? (
                <video
                  src={source.url}
                  poster={TRAILER.poster ?? undefined}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  onError={() => setFailed(true)}
                />
              ) : (
                <iframe
                  src={source.url}
                  title={TRAILER.title}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>

            <div className="lp-mono mt-3 flex justify-between text-[11px] tracking-[0.08em] text-white/60">
              <span>{TRAILER.title.toUpperCase()}</span>
              <span>ESC TO CLOSE</span>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
