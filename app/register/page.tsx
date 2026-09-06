"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiArrowRight,
  FiLayers,
  FiCheck,
  FiZap,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import SpiderNetBackground from "../components/SpiderNetBackground";
import GoogleAuthButton from "../components/GoogleAuthButton";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

function RegisterForm() {
  const searchParams = useSearchParams();
  const requestedPlan = (searchParams.get("plan") as any) || "free";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register } = useAuth();
  const { failure } = useAlert();

  const planTitles: Record<string, string> = {
    creator: "Creator Tier (150 Gens/mo)",
    pro: "Studio Pro Tier (600 Gens/mo)",
    enterprise: "Enterprise Scale Tier",
    free: "Free Studio Trial (10 Gens)",
  };

  const selectedPlanTitle = planTitles[requestedPlan] || planTitles.free;

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setFormError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

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
    } catch (err: any) {
      setFormError(err?.message || "An unexpected error occurred during account creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 font-poppins text-slate-100 bg-[#090a0f] overflow-hidden">
      {/* Interactive Animated Canvas Background */}
      <SpiderNetBackground />

      {/* Atmospheric dark fade overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#090a0f]/40 via-transparent to-[#090a0f]/70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Back to Home Button */}
      <div className="relative z-10 w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-md px-3.5 py-1.5 rounded-xl"
        >
          <FiArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-[#121319]/85 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Logo size={42} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-comic">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-400">
            Start generating autonomous motion graphics with Animagent AI
          </p>

          {requestedPlan !== "free" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-400/25 mt-2">
              <FiZap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target: {selectedPlanTitle}</span>
            </div>
          )}
        </div>

        {/* Real Google Single Sign-On */}
        <GoogleAuthButton mode="register" plan={requestedPlan} />

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-white/[0.08]" />
          <span className="absolute bg-[#121319] px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            or register with email
          </span>
        </div>

        {/* Inline Form Error Notification */}
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <FiAlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Full Name
            </label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
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
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Work Email
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
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
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
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
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Use 8 or more characters with a mix of letters and numbers.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 shadow-md shadow-black/30 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Workspace Account</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Plan note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
          <FiCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Realtime DB sync • Instant cloud GPU queue</span>
        </div>

        {/* Footer switch */}
        <div className="text-center text-xs text-slate-400 pt-1 border-t border-white/[0.06]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-white hover:text-cyan-400 hover:underline transition-colors"
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
        <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-slate-400">
          Loading workspace registration...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
