"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import SpiderNetBackground from "../components/SpiderNetBackground";
import GoogleAuthButton from "../components/GoogleAuthButton";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { login } = useAuth();
  const { failure } = useAlert();
  const searchError = searchParams.get("error");
  const displayError = formError ?? (searchError ? decodeURIComponent(searchError) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setFormError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    try {
      const ok = await login(trimmedEmail, trimmedPass);
      if (!ok) {
        setFormError("Authentication failed. Please verify your email and password.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login request encountered an error.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 font-poppins text-[var(--text-primary)] bg-[var(--background)] overflow-hidden transition-colors duration-300">
      {/* Interactive Animated Spider Web Canvas Background */}
      <SpiderNetBackground />

      {/* Atmospheric themed fade overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-300"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(207,121,93,0.18), transparent 26%), radial-gradient(circle at 82% 10%, rgba(164,119,140,0.16), transparent 24%), linear-gradient(to bottom, rgba(243,238,229,0.12), rgba(243,238,229,0.02), rgba(243,238,229,0.18))",
        }}
        aria-hidden="true"
      />

      {/* Back Button */}
      <div className="relative z-10 w-full max-w-md mb-6">
        <BackButton fallbackUrl="/" label="Back" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)]/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Logo size={42} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-comic">
            Welcome Back
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Sign in to access your Animagent AI workspace
          </p>
        </div>

        {/* Server-Side Google OAuth */}
        <GoogleAuthButton mode="login" />

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[var(--border-subtle)]" />
          <span className="absolute bg-[var(--surface-card)] px-3 text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            or sign in with email
          </span>
        </div>

        {/* Inline Form Error Notification */}
        {displayError && (
          <div className="p-3 bg-[color:color-mix(in_srgb,var(--accent-primary)_12%,transparent)] border border-[color:color-mix(in_srgb,var(--accent-primary)_35%,transparent)] rounded-xl flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
            <FiAlertCircle className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="name@studio.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  failure(
                    "Password Reset",
                    "Password reset service is active. Contact your administrator or check the password reset endpoint."
                  )
                }
                className="text-xs text-[var(--accent-primary)] hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[var(--background)] bg-[var(--text-primary)] hover:opacity-90 shadow-md shadow-black/10 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Animagent</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="text-center text-xs text-[var(--text-secondary)] pt-1">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] hover:underline transition-colors"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--text-secondary)]">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
