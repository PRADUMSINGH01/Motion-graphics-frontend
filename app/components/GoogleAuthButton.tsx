"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, openGoogleAuthPopup } from "../lib/api";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

interface GoogleAuthButtonProps {
  mode?: "login" | "register";
  plan?: string;
  className?: string;
}

export default function GoogleAuthButton({
  mode = "login",
  plan = "free",
  className = "",
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const { success, failure } = useAlert();
  const { applyOAuthSession } = useAuth();
  const router = useRouter();

  const popupRef = useRef<Window | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    if (popupRef.current && !popupRef.current.closed) {
      try {
        popupRef.current.close();
      } catch {
        // ignore cross-origin close restriction if any
      }
    }
    popupRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const handleGoogleAuth = () => {
    setLoading(true);

    try {
      // 1. Open centered popup window to server-side Google OAuth endpoint
      const popup = openGoogleAuthPopup({ mode, plan });

      // Fallback: If browser popup blocker prevented window from opening
      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        console.warn("[GoogleAuth] Popup was blocked by browser. Falling back to full redirect.");
        api.auth.initiateGoogleAuth({
          mode,
          plan,
          popup: false,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        });
        return;
      }

      popupRef.current = popup;
      popup.focus();

      // 2. Listen for postMessage from server-side callback HTML
      const handleMessage = (event: MessageEvent) => {
        const data = event.data;
        if (!data || typeof data !== "object") return;

        if (data.type === "GOOGLE_AUTH_SUCCESS") {
          window.removeEventListener("message", handleMessage);
          cleanup();

          const token = data.token;
          const user = data.user;

          if (token && user) {
            // Automatically synchronize session into context & cookies
            applyOAuthSession(token, user);
            success(
              mode === "login" ? "Google Sign-In Successful" : "Google Registration Complete",
              `Welcome to Animagent Studio, ${user.profile?.displayName || user.email?.split("@")[0] || "Creator"}!`
            );

            setTimeout(() => {
              router.push("/workspace");
            }, 600);
          } else {
            setLoading(false);
            failure("Google Authentication", "Server did not return a valid session.");
          }
        } else if (data.type === "GOOGLE_AUTH_ERROR") {
          window.removeEventListener("message", handleMessage);
          cleanup();
          setLoading(false);
          failure("Google Authentication", data.message || "Google sign-in was cancelled.");
        }
      };

      window.addEventListener("message", handleMessage);

      // 3. Monitor if the user manually closes the popup window without completing
      checkIntervalRef.current = setInterval(() => {
        if (popup.closed) {
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
          window.removeEventListener("message", handleMessage);
          setLoading(false);
        }
      }, 600);
    } catch (err: any) {
      cleanup();
      setLoading(false);
      failure("Google OAuth Error", err?.message || "Could not initiate Google authentication.");
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={loading}
        className="w-full py-2.5 px-4 text-xs font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/[0.09] hover:border-white/20 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-sm group disabled:opacity-70"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}

        <span className="tracking-wide">
          {loading
            ? "Connecting to Google..."
            : mode === "login"
            ? "Continue with Google"
            : "Sign up with Google"}
        </span>
      </button>
    </div>
  );
}
