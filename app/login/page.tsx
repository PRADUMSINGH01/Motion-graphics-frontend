"use client";

import React, { useState, useCallback, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { openGoogleAuthPopup, BackendUser } from "../lib/api";
import NotebookShell from "../components/landing/NotebookShell";

export default function LoginPage() {
  const router = useRouter();
  const { login, applyOAuthSession, loginAsDemo } = useAuth();
  const { showAlert, success } = useAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "GOOGLE_AUTH_SUCCESS" && data.token && data.user) {
        setGoogleLoading(false);
        applyOAuthSession(data.token as string, data.user as BackendUser);
        success("Google Sign-In Successful", "Welcome back to your studio notebook!");
        router.push("/dashboard");
      } else if (data.type === "GOOGLE_AUTH_ERROR") {
        setGoogleLoading(false);
        setError(data.message || "Google authentication failed.");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [applyOAuthSession, router, success]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      if (!email.trim() || !password) {
        setError("Please enter both your email and password.");
        return;
      }
      setLoading(true);
      try {
        await login(email.trim(), password);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to sign in. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [email, password, login]
  );

  const handleGoogleLogin = useCallback(() => {
    setError(null);
    setGoogleLoading(true);
    const popup = openGoogleAuthPopup({ mode: "login" });
    if (!popup) {
      setGoogleLoading(false);
      showAlert({
        type: "failure",
        title: "Popup Blocked",
        message: "Please allow popups for Google Sign-In.",
      });
    }
  }, [showAlert]);

  const handleAppleNotice = useCallback(() => {
    showAlert({
      type: "failure",
      title: "Coming Soon",
      message: "Apple Sign-In is coming soon. Please use email or Google.",
    });
  }, [showAlert]);

  return (
    <NotebookShell ariaLabel="byreel.in studio login notebook">
      <div className="lp-auth-stage">
        <div className="lp-hero-stage-wrap">
          {/* Left-Top Floating Transparent Ink Seal */}
          <Link
            href="/dashboard"
            className="lp-badge-sticker lp-badge-left-top"
            title="60 FPS Motion Studio"
          >
            <svg viewBox="0 0 112 112" className="lp-seal-svg">
              <defs>
                <path
                  id="loginSealPath"
                  d="M 56, 56 m -41, 0 a 41,41 0 1,1 82,0 a 41,41 0 1,1 -82,0"
                />
              </defs>
              <circle
                cx="56"
                cy="56"
                r="50"
                fill="none"
                stroke="#07142e"
                strokeWidth="1.5"
              />
              <circle
                cx="56"
                cy="56"
                r="24"
                fill="rgba(152,206,0,0.22)"
                stroke="#07142e"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <g className="lp-anim-spin-slow">
                <text
                  fill="#07142e"
                  fontSize="8.3"
                  fontWeight="800"
                  letterSpacing="2.1"
                  fontFamily="monospace"
                >
                  <textPath href="#loginSealPath">
                    ★ 60 FPS STUDIO ★ MOTION · B-ROLLS · LAUNCH
                  </textPath>
                </text>
              </g>
              <polygon points="51,47 51,65 66,56" fill="#07142e" />
            </svg>
          </Link>

          {/* Right-Top Floating Transparent Ink Stamp */}
          <Link
            href="/pricing"
            className="lp-badge-sticker lp-badge-right-top"
            title="View Studio Passes"
          >
            <svg viewBox="0 0 132 76" className="lp-stamp-svg">
              <rect
                x="4"
                y="4"
                width="124"
                height="68"
                rx="12"
                fill="none"
                stroke="#07142e"
                strokeWidth="1.5"
              />
              <rect
                x="9"
                y="9"
                width="114"
                height="58"
                rx="8"
                fill="none"
                stroke="rgba(7, 20, 46, 0.45)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <path
                d="M18 46 C 36 22, 58 54, 78 28 C 94 14, 104 42, 114 24"
                fill="none"
                stroke="#07142e"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="lp-anim-draw-line"
              />
              <circle
                cx="36"
                cy="33"
                r="3.5"
                fill="none"
                stroke="#07142e"
                strokeWidth="1.8"
              />
              <circle
                cx="78"
                cy="28"
                r="3.5"
                fill="#84cc16"
                stroke="#111110"
                strokeWidth="1.2"
              />
              <text
                x="66"
                y="60"
                textAnchor="middle"
                fill="#07142e"
                fontSize="8.5"
                fontWeight="800"
                fontFamily="monospace"
                letterSpacing="1.1"
              >
                B-ROLLS &amp; LAUNCH
              </text>
            </svg>
          </Link>

          {/* Left-Bottom Floating Transparent Ink Clapperboard */}
          <Link
            href="/templates"
            className="lp-badge-sticker lp-badge-left-bottom"
            title="Browse Templates"
          >
            <svg viewBox="0 0 116 68" className="lp-clapper-svg">
              <rect
                x="3"
                y="3"
                width="110"
                height="62"
                rx="10"
                fill="none"
                stroke="#07142e"
                strokeWidth="1.5"
              />
              <path
                d="M12 18 L24 6 M36 18 L48 6 M60 18 L72 6 M84 18 L96 6"
                stroke="#65a30d"
                strokeWidth="2.2"
              />
              <line
                x1="8"
                y1="20"
                x2="108"
                y2="20"
                stroke="rgba(7, 20, 46, 0.4)"
                strokeWidth="1.2"
              />
              <circle
                cx="24"
                cy="41"
                r="5"
                fill="rgba(239, 68, 68, 0.65)"
                className="lp-anim-ring-pulse"
              />
              <text
                x="66"
                y="45"
                textAnchor="middle"
                fill="#07142e"
                fontSize="11.5"
                fontWeight="900"
                fontFamily="monospace"
              >
                60 FPS
              </text>
            </svg>
          </Link>

          {/* Right-Bottom Floating Transparent Ink Lottie Pill */}
          <Link
            href="/register"
            className="lp-badge-sticker lp-badge-right-bottom"
            title="Create New Account"
          >
            <svg viewBox="0 0 118 66" className="lp-lottie-pill-svg">
              <rect
                x="4"
                y="4"
                width="110"
                height="58"
                rx="29"
                fill="rgba(152, 206, 0, 0.14)"
                stroke="#07142e"
                strokeWidth="1.5"
              />
              <g
                className="lp-anim-orbit-group"
                style={{ transformOrigin: "34px 33px" }}
              >
                <path
                  d="M34 21 L37 30 L46 33 L37 36 L34 45 L31 36 L22 33 L31 30 Z"
                  fill="#07142e"
                />
              </g>
              <text
                x="74"
                y="37"
                textAnchor="middle"
                fill="#07142e"
                fontSize="10.5"
                fontWeight="900"
                fontFamily="monospace"
              >
                SHORTS
              </text>
            </svg>
          </Link>

          {/* Center Taped Notebook Studio Pass Card */}
          <div className="lp-auth-card-wrap">
            <div className="lp-auth-card">
              <div
                className="lp-washi-tape is-lime"
                style={{ "--tape-rot": "-1.5deg" } as React.CSSProperties}
              />

              <div className="lp-auth-header">
                <div className="lp-auth-pen-kicker">
                  STUDIO ACCESS · WELCOME BACK
                </div>
                <h1 className="lp-auth-title">Sign in to your notebook.</h1>
                <p className="lp-auth-subtitle">
                  Open your motion graphics, B-roll cutaways, product launches &amp; short videos.
                </p>
              </div>

              {/* 1-Click Instant Studio Demo Button */}
              <button
                type="button"
                onClick={() => loginAsDemo("pro")}
                className="lp-demo-pass-btn"
              >
                <span>✦ Enter Instant Pro Studio Demo</span>
                <span className="lp-demo-pass-badge">1-CLICK PASS →</span>
              </button>

              {/* Google & Apple OAuth */}
              <div className="lp-oauth-grid">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="lp-oauth-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
                    />
                  </svg>
                  <span>{googleLoading ? "Connecting…" : "Google"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAppleNotice}
                  disabled={loading || googleLoading}
                  className="lp-oauth-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              <div className="lp-auth-divider">
                <span>or sign in with email</span>
              </div>

              {error && (
                <div role="alert" className="lp-auth-error" style={{ marginBottom: 12 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="lp-auth-form">
                <div className="lp-field-group">
                  <div className="lp-field-label-row">
                    <label htmlFor="login-email" className="lp-field-label">
                      Email Address
                    </label>
                  </div>
                  <div className="lp-field-input-wrap">
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@studio.com"
                      className="lp-field-input"
                    />
                  </div>
                </div>

                <div className="lp-field-group">
                  <div className="lp-field-label-row">
                    <label htmlFor="login-password" className="lp-field-label">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        showAlert({
                          type: "failure",
                          title: "Password Reset",
                          message:
                            "Contact support@byreel.in to reset your studio password.",
                        })
                      }
                      style={{
                        border: 0,
                        background: "transparent",
                        color: "#07142e",
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="lp-field-input-wrap">
                    <input
                      id="login-password"
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="lp-field-input"
                      style={{ paddingRight: 38 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      className="lp-field-eye-btn"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {showPass ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="lp-auth-submit"
                >
                  <span>{loading ? "Opening Studio…" : "Sign in to Studio"}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </form>

              <div className="lp-auth-footer-note">
                New to byreel.in?
                <Link href="/register" className="lp-auth-footer-link">
                  Create a free studio pass →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Laptop Bumper Sticker Trio */}
        <div className="lp-bumper-row" aria-hidden="true">
          <span className="lp-bumper-pill lp-bumper-dark">
            ✦ BYREEL.IN STUDIO PASS
          </span>
          <span className="lp-bumper-pill lp-bumper-lime">
            ★ 15 FREE CREDITS ON SIGNUP
          </span>
          <span className="lp-bumper-pill lp-bumper-blue">
            ◆ MOTION GRAPHICS · B-ROLLS · LAUNCH · SHORTS
          </span>
        </div>
      </div>
    </NotebookShell>
  );
}
