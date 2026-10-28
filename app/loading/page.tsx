"use client";

import React, { useState } from "react";
import Link from "next/link";
import StudioLoadingScreen from "../components/StudioLoadingScreen";

export default function LoadingDemoPage() {
  const [key, setKey] = useState(0);

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
      {/* Floating Notebook Control Bar */}
      <div
        style={{
          position: "fixed",
          top: 18,
          right: 22,
          zIndex: 95,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 8px",
          borderRadius: 10,
          border: "1.5px solid rgba(7, 20, 46, 0.42)",
          background: "rgba(255, 253, 248, 0.72)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Link
          href="/"
          style={{
            padding: "6px 11px",
            borderRadius: 7,
            border: "1px solid rgba(7, 20, 46, 0.35)",
            color: "#07142e",
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Home
        </Link>

        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          style={{
            padding: "6px 12px",
            borderRadius: 7,
            border: "1px solid #07142e",
            background: "#07142e",
            color: "#faf8f2",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Replay loader
        </button>
      </div>

      <StudioLoadingScreen key={key} fullScreen={true} showProgress={true} />
    </div>
  );
}
