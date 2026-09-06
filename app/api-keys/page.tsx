"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import BackButton from "../components/BackButton";
import {
  FiArrowLeft,
  FiKey,
  FiCopy,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiTerminal,
  FiAlertCircle,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";
import { api, ApiKeyItem, ApiError } from "../lib/api";

export default function ApiKeysPage() {
  const { success, failure, error } = useAlert();
  const { user, isLoading: authLoading } = useAuth();

  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "node" | "python">("curl");
  const [newKeyName, setNewKeyName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Modal to display newly generated secret key (only shown once)
  const [newlyCreatedSecret, setNewlyCreatedSecret] = useState<{
    name: string;
    secretKey: string;
  } | null>(null);

  // Client-side auth guard: immediately redirect to login if session ends
  useEffect(() => {
    if (!authLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/login?redirect=/api-keys";
      }
    }
  }, [user, authLoading]);

  // Fetch keys from live backend
  const fetchKeys = useCallback(async () => {
    if (!user) return;
    setLoadingKeys(true);
    try {
      const res = await api.keys.list();
      if (res.success && Array.isArray(res.keys)) {
        setKeys(res.keys);
      }
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : err?.message || "Failed to load keys.";
      console.warn("[ApiKeys] Error fetching keys:", msg);
    } finally {
      setLoadingKeys(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchKeys();
    }
  }, [user, fetchKeys]);

  const copyToClipboard = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success(
      `${label} Copied`,
      "Secret token copied to clipboard. Never expose secret keys in client-side repositories."
    );
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      failure("Key Name Required", "Please enter a descriptive name for your new API key.");
      return;
    }

    setCreating(true);
    try {
      const res = await api.keys.create({
        name: newKeyName.trim(),
        environment: "production",
      });

      if (res.success && res.apiKey) {
        setKeys((prev) => [res.apiKey, ...prev]);
        setNewKeyName("");
        setModalOpen(false);
        setNewlyCreatedSecret({
          name: res.apiKey.name,
          secretKey: res.secretKey,
        });

        success(
          "API Key Generated",
          `Key '${res.apiKey.name}' has been created with standard quota.`
        );
      }
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : err?.message || "Failed to create API key.";
      failure("Key Creation Notice", msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (id: string, name: string) => {
    try {
      const res = await api.keys.revoke(id);
      if (res.success) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        success("API Key Revoked", `Key '${name}' has been deactivated.`);
      }
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : err?.message || "Failed to revoke key.";
      error("Revocation Error", msg);
    }
  };

  const firstActiveKeyPrefix = keys.find((k) => k.status === "active")?.prefix || "anim_live_your_key";

  // Prevent rendering API keys console if unauthenticated
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
          Redirecting to authentication...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090a0f] text-slate-300 font-poppins pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-900/15 via-blue-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackUrl="/workspace" label="Back to Studio" />

          {user && (
            <button
              type="button"
              onClick={fetchKeys}
              disabled={loadingKeys}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-xl cursor-pointer transition-all"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loadingKeys ? "animate-spin text-cyan-400" : ""}`} />
              <span>Refresh Keys</span>
            </button>
          )}
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
              Programmatically generate 60FPS motion graphics, render physics loops, and extract SVG paths using the Animagent REST API.
            </p>
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-md shadow-black/30 cursor-pointer shrink-0"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create New Secret Key</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-md shadow-black/30 cursor-pointer shrink-0"
            >
              <span>Sign In to Manage Keys</span>
            </Link>
          )}
        </div>

        {/* Unauthenticated Notice */}
        {!user && !authLoading && (
          <div className="my-6 p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiShield className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-white">Authentication Required: </span>
                <span className="text-slate-300">
                  Please log in to your studio account to generate live API keys and connect to the motion engine.
                </span>
              </div>
            </div>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 shrink-0 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Active Keys Table Card */}
        <div className="my-8 rounded-3xl bg-[#0e0f14]/90 border border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl">
          <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white font-comic">
                Active Secret Keys
              </h3>
              <p className="text-xs text-slate-400">
                Keys authenticate your API requests. Do not commit or share them in public repositories.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-cyan-300">
              {keys.length} {keys.length === 1 ? "Key" : "Keys"}
            </span>
          </div>

          {/* Loading State */}
          {loadingKeys ? (
            <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>Fetching authenticated API keys from server...</span>
            </div>
          ) : keys.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 mx-auto flex items-center justify-center text-slate-400">
                <FiKey className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">No API Keys Generated Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create a secret key to authenticate your server, script, or mobile pipeline with Animagent AI.
              </p>
              {user && (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Create First Key</span>
                </button>
              )}
            </div>
          ) : (
            /* Key Rows */
            <div className="divide-y divide-white/[0.06]">
              {keys.map((k) => {
                const isCopied = copiedId === k.id;
                const displayKey = `${k.prefix}••••••••••••••••••••••••`;

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
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                            k.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {k.status}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {k.environment}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-cyan-300 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
                          {displayKey}
                        </code>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(k.prefix, k.id, "Key Prefix")}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-1"
                          title="Copy Key Prefix"
                        >
                          {isCopied ? (
                            <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <FiCopy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-0.5">
                        <span>Created: {new Date(k.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>
                          Last Used: {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}
                        </span>
                        <span>•</span>
                        <span>Rate Limit: {k.rateLimitPerMinute} req/min</span>
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
          )}
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
  -H "Authorization: Bearer ${firstActiveKeyPrefix}..." \\
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
  apiKey: process.env.ANIMAGENT_API_KEY || "${firstActiveKeyPrefix}...",
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

client = Animagent(api_key="${firstActiveKeyPrefix}...")

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
                  disabled={creating}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors cursor-pointer shadow-md flex items-center gap-2"
                >
                  {creating && (
                    <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>Generate Secret Key</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reveal Newly Created Secret Key (One-Time Display) */}
      {newlyCreatedSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#121319] border border-emerald-500/30 p-6 sm:p-8 space-y-5 shadow-2xl text-white">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <FiCheck className="w-3 h-3" />
                <span>Generated Successfully</span>
              </div>
              <h3 className="text-xl font-bold font-comic">Save Your API Secret Key</h3>
              <p className="text-xs text-slate-400">
                Please copy your secret key now. For your security, it will not be displayed again.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-[11px] font-medium text-slate-400 block font-mono">
                {newlyCreatedSecret.name}
              </span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-cyan-300 break-all select-all">
                  {newlyCreatedSecret.secretKey}
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(newlyCreatedSecret.secretKey, "new-secret", "Secret Key")
                  }
                  className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors shrink-0"
                  title="Copy Full Key"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Do not share or commit this key. If lost, you will need to revoke it and generate a new one.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setNewlyCreatedSecret(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors cursor-pointer shadow-md"
              >
                I Have Saved My Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
