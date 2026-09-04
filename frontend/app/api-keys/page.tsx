"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiKey,
  FiCopy,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCode,
  FiTerminal,
  FiServer,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: "Active" | "Revoked";
}

export default function ApiKeysPage() {
  const { success, failure } = useAlert();
  const { user } = useAuth();

  const [keys, setKeys] = useState<ApiKeyItem[]>([
    {
      id: "key-1",
      name: "Default Studio Production Key",
      key: "anim_live_89f3bc194a2e87c01289fe32a",
      created: "Sep 2, 2026",
      lastUsed: "2 minutes ago",
      status: "Active",
    },
    {
      id: "key-2",
      name: "Local Dev / Test Sandbox",
      key: "anim_test_3120cb459e0a12f948cbb3301",
      created: "Aug 28, 2026",
      lastUsed: "Yesterday",
      status: "Active",
    },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "node" | "python">("curl");
  const [newKeyName, setNewKeyName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyKey = (id: string, keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedId(id);
    success(
      "API Key Copied to Clipboard",
      "Keep this secret key safe. Never expose secret keys in client-side repositories."
    );
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      failure("Key Name Required", "Please enter a descriptive name for your new API key.");
      return;
    }

    const randomHash = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      key: `anim_live_${randomHash}`,
      created: "Just now",
      lastUsed: "Never",
      status: "Active",
    };

    setKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    setModalOpen(false);
    success(
      "New API Key Generated",
      `API Key '${newKey.name}' generated. Stored securely with 60 req/sec quota.`
    );
  };

  const handleDeleteKey = (id: string, name: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    success("API Key Revoked", `Key '${name}' has been deactivated and will no longer accept requests.`);
  };

  return (
    <div className="relative min-h-screen bg-[#090a0f] text-slate-300 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-900/15 via-blue-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md px-3.5 py-1.5 rounded-xl"
          >
            <FiArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back to Studio</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-400/25">
              <FiKey className="w-3.5 h-3.5" />
              <span>Developer Access</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-comic">
              API Keys & Developer Tokens
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-poppins">
              Programmatically generate 60FPS motion graphics, render physics loops, and extract SVG paths using the Animagent REST API and WebSocket streaming agents.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-md shadow-black/30 cursor-pointer shrink-0"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create New Secret Key</span>
          </button>
        </div>

        {/* Active Keys Table Card */}
        <div className="my-8 rounded-3xl bg-[#0e0f14]/90 border border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl">
          <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white font-comic">
                Active Secret Keys
              </h3>
              <p className="text-xs text-slate-400">
                Keys authenticate your API requests. Do not share or commit them to public repos.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-cyan-300">
              {keys.length} Keys Generated
            </span>
          </div>

          {/* Key Rows */}
          <div className="divide-y divide-white/[0.06]">
            {keys.map((k) => {
              const isRevealed = visibleKeys[k.id];
              const isCopied = copiedId === k.id;
              const displayKey = isRevealed
                ? k.key
                : `${k.key.substring(0, 10)}••••••••••••••••${k.key.substring(k.key.length - 4)}`;

              return (
                <div
                  key={k.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-white font-comic">
                        {k.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {k.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-cyan-300 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
                        {displayKey}
                      </code>

                      <button
                        type="button"
                        onClick={() => toggleVisibility(k.id)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
                        title={isRevealed ? "Hide Key" : "Reveal Key"}
                      >
                        {isRevealed ? (
                          <FiEyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <FiEye className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => copyKey(k.id, k.key)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-1"
                        title="Copy Key"
                      >
                        {isCopied ? (
                          <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-0.5">
                      <span>Created: {k.created}</span>
                      <span>•</span>
                      <span>Last Used: {k.lastUsed}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDeleteKey(k.id, k.name)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Revoke Key"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quickstart Code Integration Tabs */}
        <div className="my-10 rounded-3xl bg-[#0e0f14]/90 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FiTerminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-comic">
                  Quickstart: Generate Animation via API
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-poppins">
                Send a prompt to the autonomous agent and receive a rendered WebM video URL and SVG path array.
              </p>
            </div>

            {/* Language switch */}
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 font-mono text-xs">
              {(["curl", "node", "python"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                    activeCodeTab === tab
                      ? "bg-white text-slate-900 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Code Block */}
          <div className="relative rounded-2xl bg-black/60 border border-white/10 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
            {activeCodeTab === "curl" && (
              <pre>
{`curl -X POST https://api.animagent.ai/v1/generate \\
  -H "Authorization: Bearer ${keys[0]?.key || "anim_live_your_key"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Kinetic cyber typographic logo reveal with spring-damper easing",
    "format": "webm",
    "fps": 60,
    "resolution": "4K",
    "duration_seconds": 4.5
  }'`}
              </pre>
            )}

            {activeCodeTab === "node" && (
              <pre>
{`import { AnimagentClient } from '@animagent/sdk';

const client = new AnimagentClient({
  apiKey: process.env.ANIMAGENT_API_KEY,
});

const render = await client.motion.generate({
  prompt: "Kinetic cyber typographic logo reveal with spring-damper easing",
  format: "webm",
  fps: 60,
  physics: { tension: 0.8, damping: 0.25 },
});

console.log('Video ready at:', render.videoUrl);`}
              </pre>
            )}

            {activeCodeTab === "python" && (
              <pre>
{`from animagent import Animagent

client = Animagent(api_key="anim_live_your_key")

animation = client.motion.generate(
    prompt="Kinetic cyber typographic logo reveal with spring-damper easing",
    format="webm",
    fps=60,
    resolution="4K"
)

print("Render output URL:", animation.url)`}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create Key */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#121319] border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-comic">Create API Secret Key</h3>
              <p className="text-xs text-slate-400">
                Assign a recognizable name to keep track of its environment or service usage.
              </p>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Key Name / Description
                </label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Mobile App Sync"
                  autoFocus
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500 font-poppins"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors cursor-pointer shadow-md"
                >
                  Generate Secret Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
