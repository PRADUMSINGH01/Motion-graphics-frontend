"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiArrowRight,
  FiLayers,
  FiCheck,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
} from "react-icons/fi";
import SpiderNetBackground from "../components/SpiderNetBackground";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { success, failure, error } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = () => {
    failure(
      "Provider Sandbox Notice",
      "Google Workspace directory sync is pending verification. Please register using your direct work email."
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

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-[#121319]/85 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:bg-white/15 transition-all">
              <FiLayers className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-comic">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-400">
            Start generating autonomous motion graphics with Animagent AI
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Full Name
            </label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <label className="text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
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
                <span>Get Started Free</span>
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
            onClick={handleOAuthRegister}
            className="w-full py-2.5 px-4 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Plan note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
          <FiCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>7-day trial included • No credit card required</span>
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
