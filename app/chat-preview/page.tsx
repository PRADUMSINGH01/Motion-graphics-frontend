"use client";

// Visual preview for the video chat layout and cinema loading screen
import React, { useEffect, useState } from "react";
import LaunchesSection from "../dashboard/components/sections/LaunchesSection";
import type { Chat, PipelineStage } from "../dashboard/lib/chatStore";
import "../dashboard/dashboard.css";

const STAGES = [
  { id: "look", label: "Visual Direction & Theme Match", activity: "Extracting color palette and lighting tokens" },
  { id: "story", label: "Kinetic Storyboard & Pacing", activity: "Drafting scene cuts and headline hierarchy" },
  { id: "sound", label: "Soundtrack & Audio Scoring", activity: "Synthesizing dynamic bassline and speech markers" },
  { id: "scenes", label: "3D Motion & WebGPU Layout", activity: "Compiling 360 camera path bezier easing curves" },
  { id: "checks", label: "Optical Quality & Blur Polish", activity: "Validating motion vectors and anti-aliasing" },
  { id: "render", label: "4K 60 FPS ProRes Assembly", activity: "Final compositing and encoding video output" },
];

const makeStages = (activeIdx: number): PipelineStage[] =>
  STAGES.map((s, i) => ({
    id: s.id,
    label: s.label,
    state: i < activeIdx ? "done" : i === activeIdx ? "running" : "pending",
  }));

export default function Preview() {
  const [stageIndex, setStageIndex] = useState(2);
  const [ratio, setRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [view, setView] = useState<"chat" | "empty">("chat");
  const [startedAt] = useState(() => new Date(Date.now() - 38_000).toISOString());

  const now = new Date().toISOString();
  const chat: Chat = {
    id: "c1",
    title: "Aero Sneaker 360 Launch Film",
    createdAt: now,
    updatedAt: now,
    settings: { ratio, length: 30 },
    theme: { jobId: "j1", name: "Neon Studio" },
    messages: [
      {
        id: "u1",
        role: "user",
        content: "A 30-second launch film for the Aero sneaker: slow turntable, neon green rim light, bold price reveal at the end.",
        createdAt: startedAt,
      },
      {
        id: "a1",
        role: "assistant",
        content: "",
        createdAt: startedAt,
        isStreaming: true,
        stages: makeStages(stageIndex),
        activity: STAGES[stageIndex]?.activity,
      },
    ],
  };

  const others: Chat[] = [
    {
      id: "c2",
      title: "Q3 Metrics 3D Telemetry",
      createdAt: now,
      updatedAt: new Date(Date.now() - 3600e3).toISOString(),
      messages: [{ id: "x", role: "assistant", content: "", createdAt: now, preview: { title: "Q3 Metrics", url: "#" } }],
    },
    {
      id: "c3",
      title: "Why AI Startups Fail (Social Hook)",
      createdAt: now,
      updatedAt: new Date(Date.now() - 26 * 3600e3).toISOString(),
      messages: [],
    },
    {
      id: "c4",
      title: "Onboarding Flow Walkthrough",
      createdAt: now,
      updatedAt: new Date(Date.now() - 4 * 86400e3).toISOString(),
      messages: [{ id: "y", role: "assistant", content: "GPU allocation timed out", isError: true, createdAt: now }],
    },
  ];

  return (
    <div className="db fixed inset-0 z-[100] flex flex-col bg-surf-fcfbf7">
      {/* Dev preview switcher bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surf-dedad0 bg-surf-ffffff px-4 py-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-ink-658b02 uppercase mr-1">Stage:</span>
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setStageIndex(idx)}
              className={`rounded-lg px-2.5 py-1 font-mono transition ${
                stageIndex === idx
                  ? "bg-surf-111110 text-ink-c5ef26 font-bold"
                  : "bg-surf-f2efe6 text-ink-55544e hover:bg-surf-dedad0"
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-ink-717069 mr-1">Ratio:</span>
          {(["16:9", "9:16", "1:1"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRatio(r)}
              className={`rounded-lg px-2.5 py-1 font-mono transition ${
                ratio === r
                  ? "bg-surf-111110 text-white font-bold"
                  : "bg-surf-f2efe6 text-ink-55544e hover:bg-surf-dedad0"
              }`}
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => setView(view === "chat" ? "empty" : "chat")}
            className="ml-2 rounded-lg bg-surf-c5ef26 px-3 py-1 font-bold text-ink-111110 transition hover:bg-surf-b8e21e"
          >
            Toggle Mode: {view === "chat" ? "In Chat" : "Empty Hub"}
          </button>
        </div>
      </div>

      {/* Main Studio View */}
      <div className="min-h-0 flex-1">
        <LaunchesSection
          chats={view === "chat" ? [chat, ...others] : others}
          activeChat={view === "chat" ? chat : null}
          onSend={() => {}}
          onRetry={() => {}}
          onNewChat={() => {}}
          onSelect={() => {}}
          onDelete={() => {}}
          onRename={() => {}}
          onBack={() => setView("empty")}
        />
      </div>
    </div>
  );
}
