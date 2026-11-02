"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { api } from "../../lib/api";

// Free films wait for a confirmed email. This asks for it, resends the link, and greets the return from it
// (the link lands on /dashboard?verified=1).
export default function VerifyEmailBanner() {
  const { user, refreshUser } = useAuth();
  const { success, failure } = useAlert();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") !== "1") return;
    params.delete("verified");
    const rest = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${rest ? `?${rest}` : ""}${window.location.hash}`);
    success("Email confirmed", "You can make films now.");
    refreshUser().catch(() => {});
  }, [success, refreshUser]);

  if (!user?.raw?.auth?.mustVerify) return null;

  const resend = async () => {
    setSending(true);
    try {
      const res = await api.auth.resendVerification();
      success("Link sent", res.message);
    } catch (err) {
      failure("Could not send the link", err instanceof Error ? err.message : "Please try again shortly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[#f0e2b6] bg-[#fdf8e8] px-4 py-2 text-[12.5px] text-[#5c4a12]">
      <span>
        Confirm your email to start making films. We sent a link to <strong>{user.email}</strong>.
      </span>
      <button
        type="button"
        onClick={resend}
        disabled={sending}
        className="font-semibold underline underline-offset-2 hover:text-[#2f2608] disabled:opacity-50"
      >
        {sending ? "Sending…" : "Resend link"}
      </button>
    </div>
  );
}
