"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiArrowLeft,
  FiArrowRight,
  FiLayers,
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

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setFormError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

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
    } catch (err: any) {
      setFormError(err?.message || "Login request encountered an error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 font-poppins text-slate-100 bg-[#090a0f] overflow-hidden">
      {/* Interactive Animated Spider Web Canvas Background */}
      <SpiderNetBackground />

      {/* Atmospheric dark fade overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#090a0f]/40 via-transparent to-[#090a0f]/70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Back Button */}
      <div className="relative z-10 w-full max-w-md mb-6">
        <BackButton fallbackUrl="/" label="Back" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#121319]/85 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Logo size={42} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-comic">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your Animagent AI workspace
          </p>
        </div>

        {/* Server-Side Google OAuth */}
        <GoogleAuthButton mode="login" />

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-white/[0.08]" />
          <span className="absolute bg-[#121319] px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            or sign in with email
          </span>
        </div>

        {/* Inline Form Error Notification */}
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <FiAlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Email Address
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">
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
                className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
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
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
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
                <span>Sign In to Animagent</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="text-center text-xs text-slate-400 pt-1">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-white hover:text-cyan-400 hover:underline transition-colors"
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
        <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-slate-400">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
