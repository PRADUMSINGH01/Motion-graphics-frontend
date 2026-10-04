"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const EXAMPLES = ["yourproduct.com", "acme.io/launch", "getacme.app/pricing", "launch.acme.dev"];
const DEFAULT_PLACEHOLDER = EXAMPLES[0];

/** Session key the studio can read after sign-up to prefill the product link. */
export const PENDING_LINK_KEY = "byreel:pendingLink";

/**
 * Types example URLs into the placeholder while the field is idle and on screen.
 * Falls back to a static placeholder for reduced motion.
 */
function useTypingPlaceholder(enabled: boolean, target: React.RefObject<HTMLElement | null>) {
  const [text, setText] = useState(DEFAULT_PLACEHOLDER);

  useEffect(() => {
    const el = target.current;
    if (!enabled || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let word = 0;
    let chars = EXAMPLES[0].length;
    let deleting = true;
    let onScreen = false;

    const step = () => {
      if (deleting) {
        chars--;
        if (chars <= 0) {
          deleting = false;
          word = (word + 1) % EXAMPLES.length;
        }
      } else {
        chars++;
      }
      setText(EXAMPLES[word].slice(0, Math.max(chars, 0)) || "​");

      let delay = deleting ? 32 : 70;
      if (!deleting && chars >= EXAMPLES[word].length) {
        deleting = true;
        delay = 1800; // hold the finished URL
      } else if (!deleting && chars === 0) {
        delay = 250;
      }
      if (onScreen) timer = setTimeout(step, delay);
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      clearTimeout(timer);
      if (onScreen) timer = setTimeout(step, 1600);
    });
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      setText(DEFAULT_PLACEHOLDER);
    };
  }, [enabled, target]);

  return text;
}

/**
 * "Paste a product link" pill form. Signed-in users go straight to the studio; everyone
 * else is sent to sign-up. The link is kept in sessionStorage so the studio can pick it up.
 */
export default function LinkForm({
  tone = "light",
  button,
  notes,
}: {
  tone?: "light" | "dark";
  button: string;
  notes: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const dark = tone === "dark";
  const placeholder = useTypingPlaceholder(!focused && !value, fieldRef);

  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (pending) return;
        const link = value.trim();
        try {
          if (link) sessionStorage.setItem(PENDING_LINK_KEY, link);
        } catch {
          // storage unavailable (private mode); the link is optional
        }
        setPending(true);
        router.push(user ? "/workspace" : "/register");
      }}
    >
      <div
        ref={fieldRef}
        className={`lp-field flex flex-wrap gap-1.5 rounded-full border p-1.5 ${dark ? "lp-field-dark" : ""}`}
        style={{
          background: dark ? "#1C1C1A" : "#FFFFFF",
          borderColor: dark ? "#3A3935" : "var(--lp-ink)",
        }}
      >
        <label htmlFor={id} className="sr-only">
          Product link
        </label>
        <input
          id={id}
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`min-w-0 flex-[1_1_200px] bg-transparent px-5 text-[16px] ${dark ? "min-h-[52px]" : "min-h-[50px]"}`}
          style={{ border: 0, color: dark ? "var(--lp-paper)" : "var(--lp-ink)", font: "inherit", fontSize: 16 }}
        />
        <button
          type="submit"
          disabled={pending}
          aria-live="polite"
          className={`lp-shine inline-flex flex-none cursor-pointer items-center justify-center gap-2 rounded-full text-[15px] font-semibold disabled:cursor-progress ${
            dark ? "lp-btn-accent min-h-[52px] px-[26px]" : "lp-btn-ink min-h-[50px] px-6"
          }`}
          style={{
            border: 0,
            background: dark ? "var(--lp-accent)" : "var(--lp-ink)",
            color: dark ? "#fff" : "var(--lp-paper)",
            font: "inherit",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {pending ? (
            <>
              <span className="lp-rec" aria-hidden="true" />
              Rolling…
            </>
          ) : (
            <>
              {button} <span className="lp-arrow" aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
      <div
        className="lp-mono flex flex-wrap gap-x-5 gap-y-1.5 pl-5 text-[12px] tracking-[0.02em]"
        style={{ color: dark ? "#A8A59C" : "var(--lp-muted)" }}
      >
        {notes}
      </div>
    </form>
  );
}
