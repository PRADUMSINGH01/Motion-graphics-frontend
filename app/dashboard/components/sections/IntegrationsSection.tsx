"use client";

import React, { useState } from "react";
import {
  FiCheck,
  FiPlus,
  FiExternalLink,
  FiCpu,
  FiLayers,
  FiVideo,
  FiShare2,
  FiKey,
  FiCopy,
  FiRefreshCw,
  FiTerminal,
  FiSend,
} from "react-icons/fi";

export default function IntegrationsSection() {
  const [activeTab, setActiveTab] = useState<"apps" | "api" | "webhooks">("apps");
  const [connected, setConnected] = useState<Record<string, boolean>>({
    figma: true,
    youtube: false,
    tiktok: true,
    premiere: false,
    slack: false,
    webhooks: true,
  });

  const [apiKey, setApiKey] = useState("byreel_live_sk_89f02c91b1a74e50d6");
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const toggle = (key: string) => {
    setConnected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const regenerateKey = () => {
    const next = `byreel_live_sk_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(next);
  };

  const copyKey = () => {
    navigator.clipboard?.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const triggerTestWebhook = () => {
    setWebhookStatus("Delivering test payload to https://api.yourdomain.com/webhooks/byreel...");
    setTimeout(() => {
      setWebhookStatus("✓ HTTP 200 OK — Payload acknowledged successfully (142ms)");
    }, 1200);
  };

  const integrations = [
    {
      id: "figma",
      title: "Figma",
      desc: "Import component layers, vector SVGs, and brand tokens directly into motion timelines.",
      icon: "🎨",
      category: "Design",
    },
    {
      id: "premiere",
      title: "Adobe Premiere Pro & After Effects",
      desc: "Export seamless MOGRT motion graphics packages and ProRes sequences.",
      icon: "🎬",
      category: "Video Editing",
    },
    {
      id: "tiktok",
      title: "TikTok Creator & Ads",
      desc: "Publish 9:16 vertical motion reels with trending audio hooks in one click.",
      icon: "🎵",
      category: "Social Publishing",
    },
    {
      id: "youtube",
      title: "YouTube Shorts & Studio",
      desc: "Automate video uploads, chapter markers, and high-definition 4K motion intros.",
      icon: "▶️",
      category: "Social Publishing",
    },
    {
      id: "slack",
      title: "Slack Workspace Alerts",
      desc: "Receive real-time rendering status and download links directly in team channels.",
      icon: "💬",
      category: "Collaboration",
    },
    {
      id: "webhooks",
      title: "REST Webhooks & Engine API",
      desc: "Trigger programmatic video generations using your custom backend pipelines.",
      icon: "⚡",
      category: "Developer Tools",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
            CONNECTED ECOSYSTEM
          </span>
        </div>
        <h1 className="mt-1 text-[28px] font-bold text-ink-111110">Integrations & API</h1>
        <p className="text-[13.5px] text-ink-717069">
          Connect Byreel Motion Studio to your creative tools, team channels, and programmatic APIs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-surf-eceae3 pb-3">
        {[
          { id: "apps", label: "App Connectors" },
          { id: "api", label: "API Keys & SDK" },
          { id: "webhooks", label: "Webhooks" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition ${
              activeTab === t.id
                ? "bg-surf-111110 text-white shadow-2xs"
                : "text-ink-717069 hover:text-ink-111110"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: APPS */}
      {activeTab === "apps" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {integrations.map((item) => {
            const isConn = connected[item.id];
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs hover:border-surf-111110 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surf-faf9f5 text-2xl border border-surf-eceae3">
                      {item.icon}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium ${
                        isConn
                          ? "bg-surf-f2fac2 text-ink-658b02"
                          : "bg-surf-f2efe6 text-ink-717069"
                      }`}
                    >
                      {isConn ? "Connected" : "Disconnected"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[15px] font-semibold text-ink-111110">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-717069">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-surf-f2efe6">
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={`w-full py-2 rounded-xl text-[12.5px] font-semibold transition ${
                      isConn
                        ? "border border-surf-dedad0 bg-surf-faf9f5 text-ink-111110 hover:bg-surf-f2efe6"
                        : "bg-surf-111110 text-white hover:bg-surf-272725"
                    }`}
                  >
                    {isConn ? "Configure Settings" : "Connect Integration"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: API KEYS */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-4">
            <h3 className="text-[17px] font-bold text-ink-111110">Live Secret Key</h3>
            <p className="text-[13px] text-ink-717069">
              Use this key to authorize requests to the Byreel Video Generation REST API.
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-surf-dedad0 bg-surf-faf9f5 p-3">
              <span className="font-mono text-[13px] text-ink-111110 flex-1 truncate select-all">
                {apiKey}
              </span>
              <button
                type="button"
                onClick={copyKey}
                className="flex items-center gap-1.5 rounded-lg bg-surf-111110 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-surf-272725"
              >
                {copiedKey ? <FiCheck size={13} className="text-ink-c5ef26" /> : <FiCopy size={13} />}
                <span>{copiedKey ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={regenerateKey}
                className="flex items-center gap-1 rounded-lg border border-surf-dedad0 bg-surf-ffffff px-3 py-1.5 text-[12px] font-medium text-ink-55544e hover:bg-surf-f2efe6"
              >
                <FiRefreshCw size={12} /> Regenerate
              </button>
            </div>
          </div>

          {/* Sample cURL Request */}
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-0d0f10 p-6 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[12px] text-ink-a8a8a2">
                <FiTerminal size={14} className="text-ink-c5ef26" /> Example Generation Request
              </span>
              <span className="font-mono text-[11px] text-ink-c5ef26">POST /v1/render</span>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-black/60 p-4 font-mono text-[12.5px] leading-relaxed text-ink-e5e5e0">
{`curl -X POST https://api.byreel.io/v1/render \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Dynamic 3D product launch sneaker with volumetric lime lighting",
    "ratio": "16:9",
    "resolution": "4K",
    "model": "octane-v2.4"
  }'`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: WEBHOOKS */}
      {activeTab === "webhooks" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[17px] font-bold text-ink-111110">Webhook Endpoints</h3>
                <p className="text-[13px] text-ink-717069 mt-0.5">
                  Receive webhook alerts when videos finish rendering.
                </p>
              </div>
              <button
                type="button"
                onClick={triggerTestWebhook}
                className="flex items-center gap-1.5 rounded-xl border border-surf-dedad0 bg-surf-faf9f5 px-3.5 py-2 text-[12.5px] font-semibold text-ink-111110 hover:bg-surf-f2efe6"
              >
                <FiSend size={13} /> Test Ping
              </button>
            </div>

            <div className="rounded-xl border border-surf-eceae3 bg-surf-faf9f5 p-3.5 flex items-center justify-between">
              <div>
                <span className="font-mono text-[13px] font-semibold text-ink-111110">
                  https://api.yourdomain.com/webhooks/byreel
                </span>
                <p className="text-[11.5px] text-ink-717069 mt-0.5">
                  Subscribed to: <code className="text-ink-111110">video.render_completed</code>, <code className="text-ink-111110">render.failed</code>
                </p>
              </div>
              <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-658b02">
                Active
              </span>
            </div>

            {webhookStatus && (
              <div className="rounded-xl border border-surf-dedad0 bg-surf-fdfdfc p-3 font-mono text-[12px] text-ink-2d2c28">
                {webhookStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
