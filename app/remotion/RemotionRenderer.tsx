"use client"
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 30;

const C = {
  bg: "#FBF9F4",
  ink: "#2B3A55",
  indigo: "#5B6CF0",
  indigoSoft: "#EEF0FE",
  coral: "#FF7A6B",
  coralSoft: "#FFEFEA",
  mint: "#3FBF9C",
  mintSoft: "#E4F6EF",
  gold: "#E8B54B",
  goldSoft: "#FBF2DC",
  muted: "#8B93A7",
  white: "#FFFFFF",
};

const clamp = (n: number) => Math.max(0, Math.min(1, n));

const easeOut = (n: number) => {
  const x = clamp(n);
  return 1 - Math.pow(1 - x, 3);
};

const anim = (
  frame: number,
  startFrame: number,
  durationFrames = 18,
) => {
  return easeOut(
    (frame - startFrame) / durationFrames,
  );
};

const fadeUpStyle = (
  frame: number,
  startFrame: number,
  duration = 18,
  distance = 25,
): React.CSSProperties => {
  const p = anim(frame, startFrame, duration);

  return {
    opacity: p,
    transform: `translateY(${interpolate(
      p,
      [0, 1],
      [distance, 0],
    )}px)`,
  };
};

const scaleStyle = (
  frame: number,
  startFrame: number,
  duration = 20,
): React.CSSProperties => {
  const p = anim(frame, startFrame, duration);

  return {
    opacity: p,
    transform: `scale(${interpolate(
      p,
      [0, 1],
      [0.75, 1],
    )})`,
  };
};

function Background({ frame }: { frame: number }) {
  const drift = Math.sin(frame / 70);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "#DDE3FF",
          filter: "blur(60px)",
          opacity: 0.5,
          top: -120,
          left: -110,
          transform: `translate(${drift * 30}px, ${
            drift * 30
          }px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#FFE7DF",
          filter: "blur(60px)",
          opacity: 0.5,
          right: -100,
          bottom: -100,
          transform: `translate(${
            -drift * 30
          }px, ${-drift * 25}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "#DDF3EA",
          filter: "blur(60px)",
          opacity: 0.5,
          left: -90,
          bottom: "30%",
          transform: `translate(${drift * 20}px, ${
            -drift * 20
          }px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(91,108,240,.14) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          opacity: 0.8,
          maskImage:
            "radial-gradient(circle at 50% 40%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 40%, black, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
}

function Kicker({
  children,
  color = C.indigo,
  background = C.indigoSoft,
}: {
  children: React.ReactNode;
  color?: string;
  background?: string;
}) {
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color,
        fontWeight: 600,
        background,
        padding: "7px 16px",
        borderRadius: 100,
        marginBottom: 26,
      }}
    >
      {children}
    </div>
  );
}

function H1({
  children,
  size = 38,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: "Arial, sans-serif",
        fontWeight: 700,
        color: C.ink,
        fontSize: size,
        lineHeight: 1.16,
        letterSpacing: "-0.02em",
      }}
    >
      {children}
    </h1>
  );
}

function Sub({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p
      style={{
        margin: "18px auto 0",
        fontFamily: "Arial, sans-serif",
        fontSize: 14.5,
        lineHeight: 1.65,
        color: C.muted,
        maxWidth: 310,
      }}
    >
      {children}
    </p>
  );
}

function Pill({
  frame,
  start,
  icon,
  children,
  accent,
  right,
}: {
  frame: number;
  start: number;
  icon: string;
  children: React.ReactNode;
  accent: string;
  right?: string;
}) {
  return (
    <div
      style={{
        ...fadeUpStyle(frame, start),
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        background: C.white,
        border: "1px solid rgba(43,58,85,.07)",
        borderRadius: 14,
        padding: "13px 16px",
        marginBottom: 10,
        boxShadow:
          "0 10px 26px -14px rgba(43,58,85,.15)",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: accent,
          flexShrink: 0,
          fontSize: 13,
        }}
      >
        {icon}
      </div>

      <span
        style={{
          fontFamily: "Arial",
          fontSize: 13.5,
          color: C.ink,
          fontWeight: 500,
        }}
      >
        {children}
      </span>

      {right && (
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: C.muted,
            whiteSpace: "nowrap",
          }}
        >
          {right}
        </span>
      )}
    </div>
  );
}

function CodeBox({
  children,
  frame,
  start,
}: {
  children: React.ReactNode;
  frame: number;
  start: number;
}) {
  return (
    <div
      style={{
        ...fadeUpStyle(frame, start),
        marginTop: 26,
        width: "100%",
        textAlign: "left",
        background: C.ink,
        borderRadius: 16,
        padding: 18,
        fontFamily: "monospace",
        fontSize: 12.5,
        lineHeight: 1.9,
        color: "#BFC8FF",
        boxShadow:
          "0 20px 50px -18px rgba(43,58,85,.25)",
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------- */
/* SCENE 1 */
/* -------------------------------------------------- */

function Scene1({ frame }: { frame: number }) {
  const start = 0;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker>⚡ The Hidden Waste</Kicker>
      </div>

      <H1>
        <div style={fadeUpStyle(frame, start + 8)}>
          Most AI agents use
        </div>

        <div style={fadeUpStyle(frame, start + 13)}>
          powerful LLMs…
        </div>

        <div style={fadeUpStyle(frame, start + 18)}>
          just to answer
        </div>

        <div style={fadeUpStyle(frame, start + 23)}>
          <span
            style={{
              fontFamily: "Georgia",
              fontStyle: "italic",
              color: C.coral,
            }}
          >
            yes
          </span>{" "}
          or{" "}
          <span style={{ color: C.coral }}>no</span>.
        </div>
      </H1>

      <div style={fadeUpStyle(frame, start + 29)}>
        <Sub>
          A whole frontier model — for a single bit
          of information.
        </Sub>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------- */
/* SCENE 2 */
/* -------------------------------------------------- */

function Scene2({ frame }: { frame: number }) {
  const start = 4 * FPS;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker
          color="#E05A4C"
          background={C.coralSoft}
        >
          The Problem
        </Kicker>
      </div>

      <H1>
        <div style={fadeUpStyle(frame, start + 8)}>
          Text in.
        </div>

        <div style={fadeUpStyle(frame, start + 13)}>
          Parse it back.
        </div>

        <div style={fadeUpStyle(frame, start + 18)}>
          <span style={{ color: C.indigo }}>
            Hope
          </span>{" "}
          it works.
        </div>
      </H1>

      <div
        style={{
          width: "100%",
          marginTop: 28,
        }}
      >
        <Pill
          frame={frame}
          start={start + 25}
          icon="?"
          accent={C.coralSoft}
        >
          Should I call this tool?
        </Pill>

        <Pill
          frame={frame}
          start={start + 32}
          icon="↻"
          accent={C.goldSoft}
        >
          Should I retry?
        </Pill>

        <Pill
          frame={frame}
          start={start + 39}
          icon="⇉"
          accent={C.mintSoft}
        >
          Which workflow handles this?
        </Pill>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------- */
/* SCENE 3 */
/* -------------------------------------------------- */

function Scene3({ frame }: { frame: number }) {
  const start = 9 * FPS;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker
          color="#2E9B80"
          background={C.mintSoft}
        >
          ✦ Jev's Approach
        </Kicker>
      </div>

      <H1>
        <div style={fadeUpStyle(frame, start + 8)}>
          Don't generate
        </div>

        <div style={fadeUpStyle(frame, start + 14)}>
          <span
            style={{
              fontFamily: "Georgia",
              fontStyle: "italic",
              color: C.coral,
            }}
          >
            strings.
          </span>
        </div>

        <div style={fadeUpStyle(frame, start + 20)}>
          Output
        </div>

        <div style={fadeUpStyle(frame, start + 26)}>
          <span style={{ color: C.indigo }}>
            typed decisions
          </span>
        </div>
      </H1>

      <CodeBox
        frame={frame}
        start={start + 32}
      >
        <span style={{ color: "#7C87A8" }}>
          // instead of…
        </span>
        <br />

        <span style={{ color: "#FFB3A7" }}>
          "yes, risk = high"
        </span>

        <br />

        <span style={{ color: "#7C87A8" }}>
          // Jev returns…
        </span>

        <br />

        <span style={{ color: "#9BE8D3" }}>
          Decision
        </span>{" "}
        {"{ value: YES, p: 0.94 }"}
      </CodeBox>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------- */
/* SCENE 4 */
/* -------------------------------------------------- */

function Scene4({ frame }: { frame: number }) {
  const start = 16 * FPS;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker>How It Works</Kicker>
      </div>

      <H1>
        <div style={fadeUpStyle(frame, start + 8)}>
          Share your{" "}
          <span style={{ color: C.indigo }}>
            state.
          </span>
        </div>

        <div style={fadeUpStyle(frame, start + 15)}>
          Ask narrow{" "}
          <span
            style={{
              fontFamily: "Georgia",
              fontStyle: "italic",
              color: C.coral,
            }}
          >
            questions.
          </span>
        </div>
      </H1>

      <div
        style={{
          width: "100%",
          marginTop: 28,
        }}
      >
        <Pill
          frame={frame}
          start={start + 23}
          icon="01"
          accent={C.indigoSoft}
          right="→ Noul"
        >
          Is this request risky?
        </Pill>

        <Pill
          frame={frame}
          start={start + 30}
          icon="02"
          accent={C.coralSoft}
          right="→ Choice"
        >
          Which agent handles it?
        </Pill>

        <Pill
          frame={frame}
          start={start + 37}
          icon="03"
          accent={C.mintSoft}
          right="→ Score"
        >
          How confident are you?
        </Pill>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------- */
/* SCENE 5 */
/* -------------------------------------------------- */

function Scene5({ frame }: { frame: number }) {
  const start = 24 * FPS;

  const confidence = interpolate(
    clamp((frame - (start + 50)) / 45),
    [0, 1],
    [0, 94],
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker
          color="#B98A28"
          background={C.goldSoft}
        >
          ◆ Core Primitives
        </Kicker>
      </div>

      <H1 size={30}>
        <div style={fadeUpStyle(frame, start + 8)}>
          Three decision types,
        </div>

        <div style={fadeUpStyle(frame, start + 15)}>
          <span style={{ color: C.indigo }}>
            one contract.
          </span>
        </div>
      </H1>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 30,
        }}
      >
        {[
          ["⚖️", "Noul", "Yes or no.", C.indigo],
          ["🔀", "Choice", "Pick options.", C.coral],
          ["📊", "Score", "Defined scale.", C.mint],
        ].map((item, i) => (
          <div
            key={item[1]}
            style={{
              ...scaleStyle(
                frame,
                start + 23 + i * 7,
              ),
              width: 105,
              height: 125,
              background: C.white,
              borderRadius: 16,
              padding: 14,
              borderTop: `3px solid ${item[3]}`,
              boxShadow:
                "0 20px 50px -18px rgba(43,58,85,.18)",
            }}
          >
            <div style={{ fontSize: 20 }}>
              {item[0]}
            </div>

            <div
              style={{
                marginTop: 7,
                fontFamily: "Arial",
                fontWeight: 700,
                fontSize: 14,
                color: C.ink,
              }}
            >
              {item[1]}
            </div>

            <div
              style={{
                marginTop: 7,
                fontSize: 11,
                color: C.muted,
              }}
            >
              {item[2]}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          marginTop: 20,
          padding: 18,
          borderRadius: 18,
          background: C.white,
          boxShadow:
            "0 20px 50px -18px rgba(43,58,85,.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: C.muted,
            marginBottom: 10,
          }}
        >
          <span>Confidence included</span>
          <b style={{ color: C.ink }}>
            {Math.round(confidence)}%
          </b>
        </div>

        <div
          style={{
            height: 12,
            borderRadius: 100,
            background: C.indigoSoft,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${confidence}%`,
              background: `linear-gradient(90deg, ${C.mint}, ${C.indigo})`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------- */
/* SCENE 6 */
/* -------------------------------------------------- */

function Scene6({ frame }: { frame: number }) {
  const start = 33 * FPS;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker
          color="#E05A4C"
          background={C.coralSoft}
        >
          No More Hoping
        </Kicker>
      </div>

      <H1>
        <div style={fadeUpStyle(frame, start + 8)}>
          Stop asking for
        </div>

        <div style={fadeUpStyle(frame, start + 14)}>
          <span
            style={{
              fontFamily: "Georgia",
              fontStyle: "italic",
              color: C.coral,
            }}
          >
            "JSON please"
          </span>
        </div>

        <div style={fadeUpStyle(frame, start + 20)}>
          and hoping the model
        </div>

        <div style={fadeUpStyle(frame, start + 26)}>
          <span style={{ color: C.indigo }}>
            follows the schema.
          </span>
        </div>
      </H1>

      <CodeBox
        frame={frame}
        start={start + 34}
      >
        <span style={{ color: "#7C87A8" }}>
          // the type constrains the answer
        </span>
        <br />

        route = agent.
        <span style={{ color: "#9BE8D3" }}>
          decide
        </span>
        (state)
        <br />

        <span style={{ color: "#7C87A8" }}>
          // use it directly
        </span>
        <br />

        <span style={{ color: "#9BE8D3" }}>
          if
        </span>{" "}
        (route.
        <span style={{ color: "#FFB3A7" }}>
          yes
        </span>
        ) execute()
      </CodeBox>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------- */
/* SCENE 7 */
/* -------------------------------------------------- */

function Scene7({ frame }: { frame: number }) {
  const start = 42 * FPS;

  const items = [
    ["Jev", "decides — typed, fast", C.indigo, C.indigoSoft],
    ["Code", "routes the workflow", C.coral, C.coralSoft],
    ["LLM", "generates when needed", C.mint, C.mintSoft],
    ["Tools", "execute the action", C.gold, C.goldSoft],
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker
          color="#2E9B80"
          background={C.mintSoft}
        >
          Agent Architecture
        </Kicker>
      </div>

      <H1 size={28}>
        <div style={fadeUpStyle(frame, start + 8)}>
          Fast decisions.
        </div>

        <div style={fadeUpStyle(frame, start + 15)}>
          <span style={{ color: C.indigo }}>
            Open-ended generation.
          </span>
        </div>

        <div style={fadeUpStyle(frame, start + 22)}>
          Separated.
        </div>
      </H1>

      <div
        style={{
          width: "100%",
          marginTop: 26,
        }}
      >
        {items.map((item, i) => (
          <React.Fragment key={item[0]}>
            <div
              style={{
                ...fadeUpStyle(
                  frame,
                  start + 30 + i * 15,
                ),
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: C.white,
                borderRadius: 14,
                padding: "12px 16px",
                marginBottom: 6,
                boxShadow:
                  "0 10px 24px -14px rgba(43,58,85,.14)",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  padding: "5px 12px",
                  borderRadius: 8,
                  color: item[2],
                  background: item[3],
                }}
              >
                {item[0]}
              </span>

              <span
                style={{
                  fontSize: 12.5,
                  color: C.muted,
                }}
              >
                {item[1]}
              </span>
            </div>

            {i < 3 && (
              <div
                style={{
                  color: C.indigo,
                  fontSize: 14,
                  height: 7,
                }}
              >
                ↓
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------- */
/* SCENE 8 */
/* -------------------------------------------------- */

function Scene8({ frame }: { frame: number }) {
  const start = 50 * FPS;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker>The Big Idea</Kicker>
      </div>

      <div
        style={{
          fontFamily: "Georgia",
          fontStyle: "italic",
          fontSize: 29,
          lineHeight: 1.35,
          color: C.ink,
        }}
      >
        <div style={fadeUpStyle(frame, start + 8)}>
          Jev isn't trying to
        </div>

        <div style={fadeUpStyle(frame, start + 16)}>
          replace every LLM —
        </div>

        <div style={fadeUpStyle(frame, start + 27)}>
          it's built for the decisions
        </div>

        <div style={fadeUpStyle(frame, start + 38)}>
          <span
            style={{
              fontFamily: "Arial",
              fontStyle: "normal",
              fontWeight: 700,
              color: C.indigo,
            }}
          >
            inside software workflows.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------- */
/* SCENE 9 */
/* -------------------------------------------------- */

function Scene9({ frame }: { frame: number }) {
  const start = 56 * FPS;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "34px 30px 90px",
        textAlign: "center",
      }}
    >
      <div style={fadeUpStyle(frame, start + 4)}>
        <Kicker
          color="#E05A4C"
          background={C.coralSoft}
        >
          ✦ The Shift
        </Kicker>
      </div>

      <div
        style={{
          width: "100%",
          marginTop: 26,
        }}
      >
        <div
          style={{
            ...fadeUpStyle(frame, start + 12),
            background: C.white,
            color: C.muted,
            border: "1.5px dashed rgba(43,58,85,.2)",
            borderRadius: 16,
            padding: 18,
            fontSize: 15.5,
            fontWeight: 600,
            textDecoration: "line-through",
            textDecorationColor:
              "rgba(224,90,76,.5)",
          }}
        >
          "AI, give me some text."
        </div>

        <div
          style={{
            ...fadeUpStyle(frame, start + 25),
            color: C.coral,
            fontSize: 20,
            margin: 10,
          }}
        >
          ↓
        </div>

        <div
          style={{
            ...scaleStyle(frame, start + 30),
            background: `linear-gradient(120deg, ${C.indigo}, #7B8AF7)`,
            color: C.white,
            borderRadius: 16,
            padding: 18,
            fontSize: 15.5,
            fontWeight: 600,
            lineHeight: 1.4,
            boxShadow:
              "0 18px 40px -16px rgba(91,108,240,.55)",
          }}
        >
          "AI, give my software
          <br />
          a decision."
        </div>
      </div>

      <Sub>
        That's the future of{" "}
        <b>agentic software.</b>
      </Sub>
    </AbsoluteFill>
  );
}

/* ================================================== */
/* REGISTERED REMOTION COMPONENT */
/* ================================================== */

export const JevShort: React.FC = () => {
  /*
   * IMPORTANT:
   * This is the component registered in <Composition>.
   * Every child receives frame as a prop.
   */
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "#E9ECF2",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: Math.min(width, 430),
          height: Math.min(height, 765),
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          background: C.bg,
          boxShadow:
            "0 40px 90px -30px rgba(43,58,85,.35)",
        }}
      >
        <Background frame={frame} />

        {frame < 4 * FPS && <Scene1 frame={frame} />}

        {frame >= 4 * FPS &&
          frame < 9 * FPS && (
            <Scene2 frame={frame} />
          )}

        {frame >= 9 * FPS &&
          frame < 16 * FPS && (
            <Scene3 frame={frame} />
          )}

        {frame >= 16 * FPS &&
          frame < 24 * FPS && (
            <Scene4 frame={frame} />
          )}

        {frame >= 24 * FPS &&
          frame < 33 * FPS && (
            <Scene5 frame={frame} />
          )}

        {frame >= 33 * FPS &&
          frame < 42 * FPS && (
            <Scene6 frame={frame} />
          )}

        {frame >= 42 * FPS &&
          frame < 50 * FPS && (
            <Scene7 frame={frame} />
          )}

        {frame >= 50 * FPS &&
          frame < 56 * FPS && (
            <Scene8 frame={frame} />
          )}

        {frame >= 56 * FPS && (
          <Scene9 frame={frame} />
        )}

        <ProgressBar frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

function ProgressBar({ frame }: { frame: number }) {
  const progress = clamp(frame / (60 * FPS));

  return (
    <div
      style={{
        position: "absolute",
        left: 22,
        right: 22,
        bottom: 18,
        zIndex: 20,
      }}
    >
      <div
        style={{
          height: 4,
          background: "rgba(43,58,85,.1)",
          borderRadius: 100,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${C.coral}, ${C.indigo})`,
          }}
        />
      </div>
    </div>
  );
}