"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, BackendUser } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { FiLayers, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const { success, failure } = useAlert();

  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get("token");
      const errorParam = searchParams.get("error");
      const name = searchParams.get("name") || "Creator";

      if (errorParam) {
        setStatus("error");
        setErrorMessage(decodeURIComponent(errorParam));
        failure("Google Sign-In Failed", decodeURIComponent(errorParam));
        setTimeout(() => router.replace("/login"), 2500);
        return;
      }

      if (!token) {
        setStatus("error");
        setErrorMessage("No authentication token was returned from Google OAuth.");
        failure("Authentication Error", "Session token was not received.");
        setTimeout(() => router.replace("/login"), 2500);
        return;
      }

      try {
        // Save bearer session token
        localStorage.setItem("animagent_token", token);
        if (typeof document !== "undefined") {
          document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }

        // Fetch fresh profile from backend
        const userRes = await api.user.getMe();
        if (userRes.success && userRes.user) {
          const bUser = userRes.user;
          const mapped = {
            id: bUser.id,
            name: bUser.profile.displayName || bUser.email.split("@")[0],
            email: bUser.email,
            username: bUser.username,
            role: bUser.auth.role,
            plan: bUser.plan,
            usage: bUser.usage,
            token,
            raw: bUser,
          };
          localStorage.setItem("animagent_user", JSON.stringify(mapped));
        }

        await refreshUser();
        setStatus("success");
        success(
          "Google Sign-In Complete",
          `Welcome to Animagent Studio, ${name}! Your cloud workspace is ready.`
        );

        setTimeout(() => {
          router.replace("/workspace");
        }, 800);
      } catch (err: any) {
        console.error("[GoogleCallback] Error finalizing session:", err);
        // Even if getMe temporarily fails, token is stored; proceed to workspace
        setStatus("success");
        setTimeout(() => {
          router.replace("/workspace");
        }, 1000);
      }
    };

    processCallback();
  }, [searchParams, router, refreshUser, success, failure]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 font-poppins text-slate-100 bg-[#090a0f] overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-[#090a0f] to-[#090a0f] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#121319]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl p-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-white flex items-center justify-center mx-auto shadow-xl">
          <FiLayers className="w-7 h-7 text-cyan-400" />
        </div>

        {status === "processing" && (
          <div className="space-y-3">
            <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Authenticating with Google</h2>
            <p className="text-xs text-slate-400">
              Validating OAuth credentials and syncing your Firebase studio profile...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <FiCheckCircle className="w-10 h-10 text-green-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-bold text-white">Account Verified</h2>
            <p className="text-xs text-slate-300">
              Launching your Animagent AI workspace now...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <FiAlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Authentication Failed</h2>
            <p className="text-xs text-red-300">{errorMessage}</p>
            <p className="text-[11px] text-slate-500">Redirecting to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-slate-400">
          Loading authentication status...
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
