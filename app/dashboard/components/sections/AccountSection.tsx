"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiLogOut,
  FiCheck,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiBriefcase,
  FiKey,
  FiShield,
  FiSave,
} from "react-icons/fi";
import type { User } from "../../../context/AuthContext";
import { api } from "../../../lib/api";

export default function AccountSection({
  user,
  onLogout,
  onRefresh,
}: {
  user: User;
  onLogout: () => void;
  onRefresh: () => Promise<void>;
}) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [company, setCompany] = useState(user.raw?.profile?.company || "");
  const [role, setRole] = useState(user.raw?.profile?.bio || "");

  // Passwords
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Preferences
  const [renderAlerts, setRenderAlerts] = useState(
    user.raw?.preferences?.renderCompletionAlerts ?? true
  );
  const [productUpdates, setProductUpdates] = useState(
    user.raw?.preferences?.productUpdates ?? false
  );
  const [hardwareAcceleration, setHardwareAcceleration] = useState(
    user.raw?.preferences?.hardwareAcceleration ?? true
  );

  // A new email needs the current password; an account that signs in only with Google keeps Google's email.
  const hasPassword = user.raw?.auth?.hasPassword !== false;
  const emailChanged = email.trim().toLowerCase() !== (user.email || "").toLowerCase();

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync state if user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setCompany(user.raw?.profile?.company || "");
      setRole(user.raw?.profile?.bio || "");
      if (user.raw?.preferences) {
        setRenderAlerts(user.raw.preferences.renderCompletionAlerts ?? true);
        setProductUpdates(user.raw.preferences.productUpdates ?? false);
        setHardwareAcceleration(user.raw.preferences.hardwareAcceleration ?? true);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const payload: any = {
        displayName: name.trim(),
        email: email.trim(),
        company: company.trim(),
        bio: role.trim(),
        role: role.trim(),
      };

      if (showPasswordSection && newPassword) {
        if (newPassword.length < 8) {
          throw new Error("New password must be at least 8 characters long.");
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      if (emailChanged) payload.currentPassword = currentPassword;

      const res = await api.user.updateProfile(payload);
      if (res.success) {
        setSaveSuccess(emailChanged ? `Profile saved. Check ${email.trim()} for a confirmation link.` : "Profile updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setShowPasswordSection(false);
        await onRefresh();
      } else {
        throw new Error(res.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  const handleTogglePreference = async (
    key: "renderCompletionAlerts" | "hardwareAcceleration" | "productUpdates",
    val: boolean
  ) => {
    const updated = {
      renderCompletionAlerts: key === "renderCompletionAlerts" ? val : renderAlerts,
      hardwareAcceleration: key === "hardwareAcceleration" ? val : hardwareAcceleration,
      productUpdates: key === "productUpdates" ? val : productUpdates,
    };

    if (key === "renderCompletionAlerts") setRenderAlerts(val);
    if (key === "hardwareAcceleration") setHardwareAcceleration(val);
    if (key === "productUpdates") setProductUpdates(val);

    try {
      await api.user.updatePreferences(updated);
      await onRefresh();
    } catch (err: any) {
      console.warn("Failed to update preferences:", err);
    }
  };

  const isGoogleUser =
    user.raw?.auth?.provider === "google" || user.raw?.auth?.provider === "email+google";

  return (
    <div className="mx-auto w-full max-w-4xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-ink-111110">Settings</h1>
        <p className="mt-1 text-[13.5px] text-ink-717069">
          Your profile, sign-in and email choices.{isGoogleUser ? " You sign in with Google." : ""}
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-surf-f2fac2 border border-lime-300 p-3 text-[13px] font-medium text-ink-658b02 shadow-2xs">
          <FiCheck size={16} /> {saveSuccess}
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-[13px] font-medium text-red-600 shadow-2xs">
          <FiAlertCircle size={16} /> {saveError}
        </div>
      )}

      {/* Profile Info Form */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-ink-111110">Personal Profile</h3>
          <span className="text-[12px] text-ink-8c8980 font-mono">
            Plan: <span className="font-bold uppercase text-ink-111110">{user.plan?.tier || "Pro"}</span>
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-surf-111110 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl">
            {user.raw?.profile?.avatarUrl && !user.raw.profile.avatarUrl.startsWith("/dashboard/") ? (
              <Image
                src={user.raw.profile.avatarUrl}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span>{name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-ink-111110">{name}</h4>
            <p className="text-[12px] text-ink-8c8980">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12.5px] font-medium text-ink-55544e">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-ink-55544e">Email Address</label>
            <input
              type="email"
              required
              value={email}
              readOnly={!hasPassword}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none read-only:bg-slate-50 read-only:text-ink-55544e"
            />
            {!hasPassword && <p className="mt-1 text-[11.5px] text-ink-55544e">Your email comes from your Google account.</p>}
          </div>

          {emailChanged && !showPasswordSection && (
            <div>
              <label className="block text-[12.5px] font-medium text-ink-55544e">Current password (to change your email)</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[12.5px] font-medium text-ink-55544e">Company / Studio</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-ink-55544e">Role / Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
            />
          </div>
        </div>

        {/* Change Password Toggle */}
        <div className="pt-2 border-t border-surf-f2efe6">
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="text-[12.5px] font-semibold text-ink-55544e hover:text-ink-111110 flex items-center gap-1.5"
          >
            <FiKey size={13} /> {showPasswordSection ? "Cancel Password Change" : "Change Studio Password"}
          </button>

          {showPasswordSection && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-[12px] font-medium text-ink-55544e">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full h-9 rounded-lg border border-surf-dedad0 px-3 text-[13px] bg-white text-ink-111110 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink-55544e">New Password (min 8 chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full h-9 rounded-lg border border-surf-dedad0 px-3 text-[13px] bg-white text-ink-111110 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-surf-111110 px-5 py-2.5 text-[12.5px] font-semibold text-white hover:bg-surf-272725 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave size={13} />
            )}
            <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
          </button>
        </div>
      </form>

      {/* Studio Notification Preferences */}
      <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-4">
        <h3 className="text-[17px] font-bold text-ink-111110">Email</h3>

        <div className="divide-y divide-surf-f2efe6">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13.5px] font-medium text-ink-111110">Product news</p>
              <p className="text-[12px] text-ink-717069">Email me now and then about new features.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={productUpdates}
              aria-label="Email me about new features"
              onClick={() => handleTogglePreference("productUpdates", !productUpdates)}
              className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                productUpdates ? "bg-surf-111110" : "bg-surf-dedad0"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-surf-c5ef26 transition-transform ${
                  productUpdates ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6">
        <div>
          <h3 className="text-[16px] font-bold text-ink-111110">Log out</h3>
          <p className="text-[12.5px] text-ink-717069">End your session on this device.</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-surf-dedad0 px-4 py-2 text-[12.5px] font-semibold text-ink-111110 hover:border-surf-111110 cursor-pointer"
        >
          <FiLogOut size={13} /> Log out
        </button>
      </div>

      <DeleteAccount user={user} hasPassword={hasPassword} />
    </div>
  );
}

/** Deleting the account: everything in it goes, so it asks for the password (or the email) first. */
function DeleteAccount({ user, hasPassword }: { user: User; hasPassword: boolean }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.user.deleteAccount(hasPassword ? { password: value } : { confirm: value });
      try {
        localStorage.removeItem("animagent_token");
        localStorage.removeItem("animagent_user");
      } catch {
        /* storage blocked */
      }
      document.cookie = "token=; path=/; max-age=0";
      window.location.href = "/?deleted=1";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the account.");
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/40 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-bold text-ink-dc2626">Delete account</h3>
          <p className="text-[12.5px] text-ink-7f1d1d">
            Deletes your profile, every video and chat, and your API keys. This can&apos;t be undone. Cancel a paid plan in
            Billing first.
          </p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-xl border border-red-300 bg-surf-ffffff px-4 py-2 text-[12.5px] font-semibold text-ink-dc2626 hover:bg-red-50 cursor-pointer"
          >
            Delete account
          </button>
        )}
      </div>
      {open && (
        <form onSubmit={submit} className="space-y-3 border-t border-red-200 pt-3">
          <label className="block">
            <span className="text-[12.5px] font-medium text-ink-7f1d1d">
              {hasPassword ? "Your password" : `Type ${user.email} to confirm`}
            </span>
            <input
              type={hasPassword ? "password" : "email"}
              autoComplete={hasPassword ? "current-password" : "off"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1.5 h-10 w-full max-w-sm rounded-xl border border-red-200 bg-surf-ffffff px-3.5 text-[13.5px] text-ink-111110 focus:border-red-400 focus:outline-none"
            />
          </label>
          {error && <p className="text-[12.5px] font-medium text-ink-dc2626">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy || !value.trim()}
              className="rounded-xl bg-surf-dc2626 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {busy ? "Deleting…" : "Delete my account"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setValue("");
                setError(null);
              }}
              className="rounded-xl border border-surf-dedad0 bg-surf-ffffff px-4 py-2 text-[12.5px] font-medium text-ink-111110 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
