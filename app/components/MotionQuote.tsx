"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const QUOTES = [
  ["IDEAS", "DESERVE", "TO MOVE."],
  ["MAKE", "EVERY FRAME", "MATTER."],
  ["TURN", "THOUGHT", "INTO MOTION."],
  ["LESS", "KEYFRAMES.", "MORE CREATING."],
  ["DESIGN", "SHOULD", "MOVE."],
  ["BEAUTIFUL", "IS GOOD.", "ALIVE IS BETTER."],
  ["FROM", "CODE", "TO EMOTION."],
  ["CREATE", "WITHOUT", "LIMITS."],
  ["GIVE", "IDEAS", "A REASON TO MOVE."],
  ["YOUR IDEA.", "OUR", "MOTION."],
];

// ----------------------------------------------------
// 10 animation presets — one per quote
// ----------------------------------------------------

type CharAnim = {
  name: string;
  enter: (tl: gsap.core.Timeline, chars: HTMLElement[]) => void;
  exit: (tl: gsap.core.Timeline, chars: HTMLElement[]) => void;
};

const ANIMATIONS: CharAnim[] = [
  // 1 — RISE (original style)
  {
    name: "Rise",
    enter: (tl, chars) => {
      tl.from(chars, {
        y: 90,
        opacity: 0,
        rotateX: -60,
        scale: 0.96,
        transformOrigin: "50% 100%",
        duration: 0.9,
        stagger: 0.022,
        ease: "power4.out",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        y: -80,
        opacity: 0,
        rotateX: 55,
        duration: 0.6,
        stagger: 0.015,
        ease: "power3.in",
      }, 0);
    },
  },

  // 2 — DROP (falls from above, bounces to settle)
  {
    name: "Drop",
    enter: (tl, chars) => {
      tl.from(chars, {
        y: -140,
        opacity: 0,
        duration: 0.85,
        stagger: 0.024,
        ease: "back.out(1.6)",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        y: 130,
        opacity: 0,
        rotation: 4,
        duration: 0.55,
        stagger: 0.016,
        ease: "power2.in",
      }, 0);
    },
  },

  // 3 — BLUR (soft focus reveal)
  {
    name: "Blur",
    enter: (tl, chars) => {
      tl.from(chars, {
        opacity: 0,
        filter: "blur(14px)",
        scale: 1.25,
        duration: 1,
        stagger: 0.03,
        ease: "power2.out",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        opacity: 0,
        filter: "blur(12px)",
        scale: 1.15,
        duration: 0.55,
        stagger: 0.014,
        ease: "power2.in",
      }, 0);
    },
  },

  // 4 — FLIP (3D card-flip cascade)
  {
    name: "Flip",
    enter: (tl, chars) => {
      tl.from(chars, {
        rotateY: -90,
        opacity: 0,
        transformOrigin: "left center",
        duration: 0.8,
        stagger: 0.025,
        ease: "power3.out",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        rotateY: 90,
        opacity: 0,
        transformOrigin: "right center",
        duration: 0.55,
        stagger: 0.016,
        ease: "power2.in",
      }, 0);
    },
  },

  // 5 — ELASTIC (springy wave settle)
  {
    name: "Elastic",
    enter: (tl, chars) => {
      tl.from(chars, {
        y: 60,
        opacity: 0,
        scale: 0.8,
        duration: 1.4,
        stagger: 0.035,
        ease: "elastic.out(1, 0.55)",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.014,
        ease: "power2.in",
      }, 0);
    },
  },

  // 6 — SCATTER (flies in from random directions)
  {
    name: "Scatter",
    enter: (tl, chars) => {
      tl.from(chars, {
        x: () => gsap.utils.random(-220, 220),
        y: () => gsap.utils.random(-160, 160),
        rotation: () => gsap.utils.random(-90, 90),
        opacity: 0,
        duration: 0.9,
        stagger: { each: 0.018, from: "random" },
        ease: "power3.out",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        x: () => gsap.utils.random(-180, 180),
        y: () => gsap.utils.random(-140, 140),
        rotation: () => gsap.utils.random(-60, 60),
        opacity: 0,
        duration: 0.6,
        stagger: { each: 0.014, from: "random" },
        ease: "power2.in",
      }, 0);
    },
  },

  // 7 — POP (scales up from nothing, center outward)
  {
    name: "Pop",
    enter: (tl, chars) => {
      tl.from(chars, {
        scale: 0,
        opacity: 0,
        duration: 0.7,
        stagger: { each: 0.03, from: "center" },
        ease: "back.out(2.4)",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: { each: 0.02, from: "center" },
        ease: "back.in(2)",
      }, 0);
    },
  },

  // 8 — SLIDE (alternating left/right converge)
  {
    name: "Slide",
    enter: (tl, chars) => {
      const even = chars.filter((_, i) => i % 2 === 0);
      const odd = chars.filter((_, i) => i % 2 === 1);

      tl.from(even, {
        x: -70,
        opacity: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power4.out",
      }, 0);

      tl.from(odd, {
        x: 70,
        opacity: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power4.out",
      }, 0.05);
    },
    exit: (tl, chars) => {
      const even = chars.filter((_, i) => i % 2 === 0);
      const odd = chars.filter((_, i) => i % 2 === 1);

      tl.to(even, { x: 60, opacity: 0, duration: 0.5, stagger: 0.015, ease: "power2.in" }, 0);
      tl.to(odd, { x: -60, opacity: 0, duration: 0.5, stagger: 0.015, ease: "power2.in" }, 0);
    },
  },

  // 9 — ZOOM (slams in from oversized scale)
  {
    name: "Zoom",
    enter: (tl, chars) => {
      tl.from(chars, {
        scale: 2.6,
        opacity: 0,
        rotateX: 25,
        duration: 0.9,
        stagger: 0.02,
        ease: "expo.out",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        scale: 2.2,
        opacity: 0,
        duration: 0.55,
        stagger: 0.012,
        ease: "expo.in",
      }, 0);
    },
  },

  // 10 — SWING (pendulum rotation from top)
  {
    name: "Swing",
    enter: (tl, chars) => {
      tl.from(chars, {
        rotation: (i) => (i % 2 === 0 ? -50 : 50),
        y: 70,
        opacity: 0,
        transformOrigin: "top center",
        duration: 0.9,
        stagger: 0.024,
        ease: "back.out(1.7)",
      }, 0);
    },
    exit: (tl, chars) => {
      tl.to(chars, {
        rotation: (i) => (i % 2 === 0 ? 40 : -40),
        y: 90,
        opacity: 0,
        transformOrigin: "bottom center",
        duration: 0.55,
        stagger: 0.015,
        ease: "power2.in",
      }, 0);
    },
  },
];

export default function MotionQuote() {
  const root = useRef<HTMLDivElement>(null);
  const line1 = useRef<HTMLDivElement>(null);
  const line2 = useRef<HTMLDivElement>(null);
  const line3 = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      let index = 0;
      let autoTimer: gsap.core.Tween | null = null;
      let isTransitioning = false;
      let currentAnim = ANIMATIONS[0];

      const splitChars = (
        element: HTMLElement | null,
        text: string
      ) => {
        if (!element) return;

        element.innerHTML = "";

        [...text].forEach((char) => {
          const span = document.createElement("span");

          span.className =
            "quote-char inline-block will-change-transform";

          span.textContent =
            char === " " ? "\u00A0" : char;

          element.appendChild(span);
        });
      };

      const chars = (element: HTMLElement | null) => {
        if (!element) return [];

        return Array.from(
          element.querySelectorAll<HTMLElement>(".quote-char")
        );
      };

      const highlightBreath = gsap.to(
        ".quote-main-highlight",
        {
          y: -2,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          paused: true,
        }
      );

      const setQuote = () => {
        const [a, b, c] = QUOTES[index];

        splitChars(line1.current, a);
        splitChars(line2.current, b);
        splitChars(line3.current, c);
      };

      const enterQuote = () => {
        setQuote();

        const c1 = chars(line1.current);
        const c2 = chars(line2.current);
        const c3 = chars(line3.current);
        const all = [...c1, ...c2, ...c3];

        // Pick this quote's animation
        currentAnim = ANIMATIONS[index % ANIMATIONS.length];

        gsap.set(".quote-highlight-line", {
          scaleX: 0,
          opacity: 0,
          transformOrigin: "center",
        });

        gsap.set(".quote-main-highlight", {
          scale: 0.94,
        });

        const tl = gsap.timeline({
          defaults: {
            ease: "power4.out",
          },
        });

        currentAnim.enter(tl, all);

        // Highlight — every slide
        tl.to(
          ".quote-main-highlight",
          {
            scale: 1,
            duration: 0.8,
            ease: "expo.out",
          },
          0.35
        );

        tl.to(
          ".quote-highlight-line",
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            ease: "expo.inOut",
          },
          0.5
        );

        // Animation name label
        if (labelRef.current) {
          labelRef.current.textContent =
            currentAnim.name.toUpperCase();

          gsap.fromTo(
            labelRef.current,
            { opacity: 0 },
            { opacity: 0.35, duration: 0.7, ease: "power2.out" }
          );
        }

        highlightBreath.restart();

        autoTimer?.kill();

        autoTimer = gsap.delayedCall(
          5.2,
          nextQuote
        );
      };

      const exitQuote = () => {
        if (isTransitioning) return;

        isTransitioning = true;
        autoTimer?.kill();
        highlightBreath.pause();

        const c1 = chars(line1.current);
        const c2 = chars(line2.current);
        const c3 = chars(line3.current);
        const all = [...c1, ...c2, ...c3];

        const tl = gsap.timeline({
          onComplete: () => {
            index = (index + 1) % QUOTES.length;
            isTransitioning = false;
            enterQuote();
          },
        });

        // Exit with the SAME style the quote entered with
        currentAnim.exit(tl, all);

        tl.to(
          ".quote-highlight-line",
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
          },
          0
        );
      };

      const nextQuote = () => {
        exitQuote();
      };

      enterQuote();

      // ----------------------------------------------------
      // Mouse interaction
      // ----------------------------------------------------

      const onMove = (event: PointerEvent) => {
        const rect =
          root.current?.getBoundingClientRect();

        if (!rect) return;

        const x =
          (event.clientX - rect.left) /
          rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
          rect.height -
          0.5;

        gsap.to(".quote-stage", {
          x: x * 8,
          y: y * 5,
          rotateY: x * 1.5,
          rotateX: y * -1.2,
          duration: 0.8,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const onLeave = () => {
        gsap.to(".quote-stage", {
          x: 0,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          duration: 1,
          ease: "power4.out",
        });
      };

      root.current?.addEventListener(
        "pointermove",
        onMove
      );

      root.current?.addEventListener(
        "pointerleave",
        onLeave
      );

      return () => {
        autoTimer?.kill();
        highlightBreath.kill();

        root.current?.removeEventListener(
          "pointermove",
          onMove
        );

        root.current?.removeEventListener(
          "pointerleave",
          onLeave
        );
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="
        quote-highlight
        relative
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-black
        text-white
      "
    >
      <div
        className="
          quote-stage
          relative
          w-full
          max-w-[1800px]
          px-8
          text-center
        "
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="mx-auto w-fit"
          style={{
            perspective: "1200px",
          }}
        >
          {/* LINE 1 */}
          <div className="overflow-hidden">
            <div
              ref={line1}
              className="
                whitespace-nowrap
                text-[clamp(3rem,7vw,7rem)]
                font-light
                leading-[0.9]
                tracking-[-0.065em]
                text-white
              "
            />
          </div>

          {/* LINE 2 — PRIMARY */}
          <div className="overflow-hidden">
            <div
              ref={line2}
              data-highlight="true"
              className="
                quote-main-highlight
                whitespace-nowrap
                text-[clamp(4.8rem,13vw,14rem)]
                font-black
                leading-[0.78]
                tracking-[-0.09em]
                text-white
                will-change-transform
              "
            />
          </div>

          {/* LINE 3 */}
          <div className="overflow-hidden pb-7">
            <div
              ref={line3}
              className="
                whitespace-nowrap
                bg-gradient-to-r
                from-cyan-300
                via-white
                to-cyan-300
                bg-clip-text
                text-[clamp(3rem,7vw,7rem)]
                font-black
                leading-[0.9]
                tracking-[-0.065em]
                text-transparent
              "
            />
          </div>

          <div
            className="
              quote-highlight-line
              mx-auto
              mt-4
              h-[2px]
              w-[min(520px,55vw)]
              rounded-full
              bg-white
              opacity-0
            "
          />
        </div>
      </div>

      {/* Current animation name */}
      <div
        ref={labelRef}
        className="
          pointer-events-none
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          text-[11px]
          uppercase
          tracking-[0.4em]
          text-white
        "
      />
    </section>
  );
}