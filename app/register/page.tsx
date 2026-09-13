"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiCheck,
  FiZap,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import SpiderNetBackground from "../components/SpiderNetBackground";
import GoogleAuthButton from "../components/GoogleAuthButton";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

function RegisterForm() {
  const searchParams = useSearchParams();
  const requestedPlan = (searchParams.get("plan") as string | null) || "free";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register } = useAuth();
  const searchError = searchParams.get("error");
  const displayError = formError ?? (searchError ? decodeURIComponent(searchError) : null);

  const planTitles: Record<string, string> = {
    creator: "Creator Tier (150 Gens/mo)",
    pro: "Studio Pro Tier (600 Gens/mo)",
    enterprise: "Enterprise Scale Tier",
    free: "Free Studio Trial (10 Gens)",
  };

  const selectedPlanTitle = planTitles[requestedPlan] || planTitles.free;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPass) {
      setFormError("All fields are required. Please enter your name, email, and password.");
      return;
    }

    if (trimmedPass.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const ok = await register(trimmedName, trimmedEmail, trimmedPass, requestedPlan);
      if (!ok) {
        setFormError("Registration could not be completed. Please check your details.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred during account creation.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 font-poppins text-[var(--text-primary)] bg-[var(--background)] overflow-hidden transition-colors duration-300">
      {/* Interactive Animated Canvas Background */}
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

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)]/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Logo size={42} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-comic">
            Create Your Account
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Start generating autonomous motion graphics with Animagent AI
          </p>

          {requestedPlan !== "free" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mt-2 bg-[color:color-mix(in_srgb,var(--accent-primary)_12%,transparent)] text-[var(--accent-primary)] border-[color:color-mix(in_srgb,var(--accent-primary)_35%,transparent)]">
              <FiZap className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Target: {selectedPlanTitle}</span>
            </div>
          )}
        </div>

        {/* Real Google Single Sign-On */}
        <GoogleAuthButton mode="register" plan={requestedPlan} />

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[var(--border-subtle)]" />
          <span className="absolute bg-[var(--surface-card)] px-3 text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            or register with email
          </span>
        </div>

        {/* Inline Form Error Notification */}
        {displayError && (
          <div className="p-3 bg-[color:color-mix(in_srgb,var(--accent-primary)_12%,transparent)] border border-[color:color-mix(in_srgb,var(--accent-primary)_35%,transparent)] rounded-xl flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
            <FiAlertCircle className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Alex Morgan"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Work Email
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
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Password
            </label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Use 8 or more characters with a mix of letters and numbers.
            </p>
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
                <span>Create Workspace Account</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Plan note */}
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] justify-center">
          <FiCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>Realtime DB sync • Instant cloud GPU queue</span>
        </div>

        {/* Footer switch */}
        <div className="text-center text-xs text-[var(--text-secondary)] pt-1 border-t border-[var(--border-subtle)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--text-secondary)]">
          Loading workspace registration...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
