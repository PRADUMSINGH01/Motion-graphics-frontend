"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiMail,
  FiLock,
  FiArrowLeft,
  FiArrowRight,
  FiLayers,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
} from "react-icons/fi";
import SpiderNetBackground from "../components/SpiderNetBackground";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, failure, error } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = () => {
    failure(
      "OAuth Gateway Notice",
      "Google Workspace SSO is running in sandbox mode. Use email sign-in for full access."
    );
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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#121319]/85 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:bg-white/15 transition-all">
              <FiLayers className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-comic">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your Animagent AI workspace
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Email Address
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                    "Password Reset Notice",
                    "Password reset instructions will be sent once the email verification server responds."
                  )
                }
                className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 shadow-md shadow-black/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
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

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-white/[0.08]" />
          <span className="absolute bg-[#121319] px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            or
          </span>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleOAuthLogin}
            className="w-full py-2.5 px-4 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

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
