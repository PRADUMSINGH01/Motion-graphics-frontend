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
import type { PlanTier } from "../workspace/types";

const planTiers: PlanTier[] = ["free", "creator", "pro", "enterprise"];

function getRequestedPlan(value: string | null): PlanTier {
  return planTiers.includes(value as PlanTier) ? (value as PlanTier) : "free";
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const requestedPlan = getRequestedPlan(searchParams.get("plan"));

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
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 text-fg bg-canvas overflow-hidden">
      {/* Interactive Animated Canvas Background */}
      <SpiderNetBackground />

      {/* Back Button */}
      <div className="relative z-10 w-full max-w-md mb-6">
        <BackButton fallbackUrl="/" label="Back" />
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md card shadow-elevated p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Logo size={52} />
          </Link>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-fg">
            Create Your Account
          </h1>
          <p className="text-sm text-fg-muted">
            Start generating autonomous motion graphics with byreel AI
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
          <span className="absolute bg-surface px-3 text-xs text-fg-subtle">
            or register with email
          </span>
        </div>

        {/* Inline Form Error Notification */}
        {displayError && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg flex items-start gap-2.5 text-[13px] text-fg">
            <FiAlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-fg">
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
                className="input pl-10 pr-4"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-fg">
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
                className="input pl-10 pr-4"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-fg">
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
                className="input pl-10 pr-10"
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
            className="btn btn-primary w-full"
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
        <div className="text-center text-[13px] text-fg-muted pt-1 border-t border-[var(--border-subtle)]">
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
