import type { CSSProperties } from "react";
import { BARS6, type Pal } from "./data";
import { LogoMark } from "./LandingLogo";

export type SceneMode = "stage" | "card";

const INK = "#0B0B0F";

/**
 * Artwork for one demo scene. All sizes are container-query units (cqh / cqmin / cqw), so it
 * scales with whatever `container-type: size` ancestor it is placed in. `stage` is the 16:9
 * studio viewport; `card` is the tall 9:16 film-strip card.
 */
export function SceneArt({ pal, mode }: { pal: Pal; mode: SceneMode }) {
  const card = mode === "card";
  const p = (stage: number, c: number) => (card ? c : stage);

  const panelShadow = "0 5cqh 10cqh -4cqh rgba(11,11,15,.45)";
  const cardShadow = "0 3cqh 6cqh -3cqh rgba(11,11,15,.3)";

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "-18cqmin",
          right: "-18cqmin",
          width: "74cqmin",
          height: "74cqmin",
          borderRadius: "50%",
          background: pal.glow,
          filter: "blur(9cqmin)",
          opacity: 0.75,
        }}
      />

      {pal.variant === "device" && (
        <div
          className="lp-float-a"
          style={{
            position: "absolute",
            left: "50%",
            top: `${p(7, 9)}cqh`,
            marginLeft: `${-p(18, 19)}cqh`,
            width: `${p(36, 38)}cqh`,
            height: `${p(70, 66)}cqh`,
            borderRadius: "6cqh",
            background: pal.panel,
            boxShadow: panelShadow,
            padding: "3.4cqh",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: `${p(2.4, 2.2)}cqh`,
          }}
        >
          <div style={{ alignSelf: "center", width: "30%", height: `${p(1.6, 1.4)}cqh`, borderRadius: 99, background: pal.line }} />
          <div style={{ fontSize: `${p(2.2, 3.4)}cqmin`, fontWeight: 500, color: "#71717A", marginTop: "1cqh" }}>Today</div>
          <div style={{ fontSize: `${p(3.6, 6)}cqmin`, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, color: INK }}>
            Everything in one place
          </div>
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: `${p(9, 8)}cqh` }} aria-hidden="true">
            <polyline
              points="0,25 14,20 28,23 42,12 56,16 70,6 84,10 100,2"
              fill="none"
              stroke={pal.acc}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div style={{ height: `${p(4.4, 4)}cqh`, borderRadius: `${p(1.4, 1.2)}cqh`, background: pal.line }} />
          <div style={{ height: `${p(4.4, 4)}cqh`, borderRadius: `${p(1.4, 1.2)}cqh`, background: pal.line, width: "80%" }} />
          <div
            style={{
              marginTop: "auto",
              height: `${p(5.6, 5.4)}cqh`,
              borderRadius: 99,
              background: INK,
              color: "#fff",
              fontSize: `${p(2, 3.2)}cqmin`,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Get started
          </div>
        </div>
      )}

      {pal.variant === "type" && (
        <div style={{ position: "absolute", left: "9cqw", right: "9cqw", top: `${p(14, 16)}cqh`, display: "flex", flexDirection: "column", gap: "1cqmin" }}>
          <div style={{ fontSize: `${p(3.2, 5)}cqmin`, fontWeight: 500, color: pal.fg, opacity: 0.7 }}>The old way</div>
          <div
            style={{
              fontSize: `${p(11, 19)}cqmin`,
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              color: pal.fg,
              opacity: 0.4,
              textDecoration: "line-through",
            }}
          >
            Hours
          </div>
          <div style={{ fontSize: `${p(3.2, 5)}cqmin`, fontWeight: 500, color: pal.fg, opacity: 0.7, marginTop: `${p(2, 3)}cqmin` }}>
            With byreel
          </div>
          <div style={{ fontSize: `${p(14, 22)}cqmin`, lineHeight: 0.95, fontWeight: 700, letterSpacing: "-0.05em", color: pal.acc }}>
            Minutes.
          </div>
        </div>
      )}

      {pal.variant === "cards" &&
        (
          [
            { top: p(11, 12), cls: "lp-float-b", rot: -3, round: false, tone: pal.acc, w1: "70%", w2: "50%" },
            { top: p(33, 31), cls: "lp-float-c", rot: 2, round: true, tone: INK, w1: "62%", w2: "44%" },
            { top: p(55, 50), cls: "lp-float-a", rot: -1.5, round: false, tone: pal.glow, w1: "76%", w2: "40%" },
          ] as const
        ).map((c, i) => (
          <div
            key={i}
            className={c.cls}
            style={{
              position: "absolute",
              left: "50%",
              top: `${c.top}cqh`,
              marginLeft: `${-p(34, 39)}cqmin`,
              width: `${p(68, 78)}cqmin`,
              height: `${p(19, 15)}cqh`,
              borderRadius: `${p(3, 2.6)}cqh`,
              background: pal.panel,
              border: `1px solid ${pal.line}`,
              boxShadow: cardShadow,
              transform: `rotate(${c.rot}deg)`,
              display: "flex",
              alignItems: "center",
              gap: `${p(3, 4)}cqmin`,
              padding: `0 ${p(4, 5)}cqmin`,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: `${p(8, 11)}cqmin`,
                height: `${p(8, 11)}cqmin`,
                borderRadius: c.round ? "50%" : `${p(2.4, 3)}cqmin`,
                background: c.tone,
                flex: "none",
              }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: `${p(1.2, 1.6)}cqmin` }}>
              <div style={{ height: `${p(2, 2.6)}cqmin`, width: c.w1, borderRadius: 99, background: INK }} />
              <div style={{ height: `${p(1.6, 2)}cqmin`, width: c.w2, borderRadius: 99, background: pal.line }} />
            </div>
          </div>
        ))}

      {pal.variant === "chart" && (
        <div
          className="lp-float-b"
          style={{
            position: "absolute",
            left: "50%",
            top: "14cqh",
            marginLeft: "-40cqmin",
            width: "80cqmin",
            height: `${p(52, 40)}cqh`,
            borderRadius: `${p(4, 3.4)}cqh`,
            background: pal.panel,
            boxShadow: panelShadow,
            padding: `${p(4, 5)}cqmin`,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: `${p(2, 3)}cqmin`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: `${p(2.6, 4)}cqmin`, fontWeight: 600, color: INK }}>This week</span>
            <span
              style={{
                fontSize: `${p(2, 3)}cqmin`,
                fontWeight: 600,
                padding: `${p(0.6, 0.8)}cqmin ${p(1.8, 2.4)}cqmin`,
                borderRadius: 99,
                background: "#DCFCE7",
                color: "#166534",
              }}
            >
              Up
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: `${p(2, 3)}cqmin` }}>
            {BARS6.map((b, i) => (
              <div
                key={i}
                className="lp-rise"
                style={{ flex: 1, height: b.h, borderRadius: `${p(1, 1.4)}cqmin`, background: pal.acc, animationDelay: b.d }}
              />
            ))}
          </div>
        </div>
      )}

      {pal.variant === "logo" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: `${p(3, 4)}cqmin`,
            paddingBottom: `${p(12, 16)}cqh`,
          }}
        >
          {/* The end card shows the real byreel mark on an ink tile. */}
          <div
            className="lp-float-a"
            style={{
              width: `${p(20, 28)}cqmin`,
              height: `${p(20, 28)}cqmin`,
              borderRadius: `${p(6, 8)}cqmin`,
              background: INK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4cqmin 8cqmin -3cqmin rgba(11,11,15,.4)",
            }}
          >
            <LogoMark on="dark" style={{ width: "74%", height: "74%" }} />
          </div>
          <div style={{ fontSize: `${p(8, 11)}cqmin`, fontWeight: 700, letterSpacing: "-0.04em", color: pal.fg }}>byreel</div>
          <div
            style={{
              fontSize: `${p(2.6, 4)}cqmin`,
              fontWeight: 600,
              padding: `${p(1.2, 1.6)}cqmin ${p(3, 4)}cqmin`,
              borderRadius: 99,
              background: INK,
              color: "#fff",
            }}
          >
            byreel.ai
          </div>
        </div>
      )}
    </>
  );
}

export function SceneCaption({ text, mode, delay }: { text: string; mode: SceneMode; delay?: string }) {
  const card = mode === "card";
  const style: CSSProperties = {
    background: INK,
    color: "#fff",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    fontSize: card ? "5.4cqmin" : "4.4cqmin",
    padding: card ? "1.8cqmin 4cqmin" : "1.6cqmin 3.6cqmin",
    borderRadius: card ? "2.4cqmin" : "2cqmin",
    textAlign: "center",
    maxWidth: card ? "84%" : "86%",
    ...(delay ? { animation: "lp-captionIn 11s ease-out infinite", animationDelay: delay } : null),
  };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: card ? "5cqh" : "6cqh", display: "flex", justifyContent: "center" }}>
      <div style={style}>{text}</div>
    </div>
  );
}
