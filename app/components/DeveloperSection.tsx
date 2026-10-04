"use client";

import React, { useState, memo } from "react";
import { IconCode, IconCheck, IconTerminal, IconBox } from "./Icons";

export const DeveloperSection = memo(function DeveloperSection() {
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState<"api" | "config">("api");

  const apiCode = `import { ActionPanel, Action, List, showToast } from "@raycast/api";
import { MotionCanvas, Spring } from "@byreel/core";

export default function Command() {
  return (
    <List searchBarPlaceholder="Search motion effects...">
      <List.Item
        title="Generate Kinematic Chain"
        subtitle="Procedural inverse kinematics"
        actions={
          <ActionPanel>
            <Action.SubmitForm
              onSubmit={async () => {
                await showToast({ title: "Compiled 60 FPS Sequence!" });
              }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}`;

  const configCode = `export default {
  fps: 60,
  width: 1920,
  height: 1080,
  renderer: "webgl2-accelerated",
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  plugins: ["@byreel/blender-sync", "@byreel/lottie-export"],
};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile === "api" ? apiCode : configCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-[#09090c] text-white overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Text Column */}
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              <IconTerminal className="w-3.5 h-3.5" />
              Developer API
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.08]"
              style={{
                fontFamily: "var(--font-headline)",
                letterSpacing: "-0.03em",
              }}
            >
              Extend everything with React &amp; TypeScript.
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-8">
              Write commands, build custom workflows, and publish to the Store.
              Our battle-tested API gives you full native controls, hot reloading,
              and seamless cloud distribution.
            </p>

            <div className="space-y-4">
              {[
                { title: "Natively Typed", desc: "Full TypeScript definitions and autocomplete out of the box." },
                { title: "Zero Config", desc: "Run `npx create-raycast-extension` and start building in seconds." },
                { title: "Instant Publishing", desc: "Submit pull requests straight to GitHub for fast community review." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <IconCheck className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Code Window */}
          <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-surface/95 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Window Titlebar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20" />
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setActiveFile("api")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                      activeFile === "api"
                        ? "bg-white/10 text-white font-medium"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Command.tsx
                  </button>
                  <button
                    onClick={() => setActiveFile("config")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                      activeFile === "config"
                        ? "bg-white/10 text-white font-medium"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    byreel.config.ts
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <IconCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <IconCode className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-5 font-mono text-[12px] leading-relaxed text-zinc-300 overflow-x-auto">
              <pre>
                <code>{activeFile === "api" ? apiCode : configCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default DeveloperSection;
