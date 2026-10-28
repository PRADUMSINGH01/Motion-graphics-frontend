"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiRefreshCw, FiLogOut, FiCheck, FiUser, FiMail, FiBell, FiShield, FiSave } from "react-icons/fi";
import type { User } from "../../../context/AuthContext";

export default function AccountSection({
  user,
  onLogout,
  onRefresh,
}: {
  user: User;
  onLogout: () => void;
  onRefresh: () => Promise<void>;
}) {
  const [name, setName] = useState(user.name || "Pradum Singh");
  const [email, setEmail] = useState(user.email || "pradum@byreel.io");
  const [role, setRole] = useState(user.role || "Lead Creative Director");
  const [renderAlerts, setRenderAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
            PREFERENCES & PROFILE
          </span>
        </div>
        <h1 className="mt-1 text-[28px] font-bold text-ink-111110">Account Settings</h1>
        <p className="text-[13.5px] text-ink-717069">
          Manage your account profile, personal studio preferences, and session security.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-surf-f2fac2 p-3 text-[13px] font-medium text-ink-658b02">
          <FiCheck size={16} /> Profile preferences saved successfully!
        </div>
      )}

      {/* Profile Info */}
      <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-6">
        <h3 className="text-[17px] font-bold text-ink-111110">Personal Profile</h3>

        <div className="flex items-center gap-5">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-surf-111110">
            <Image src="/dashboard/user-avatar.jpg" alt={name} fill className="object-cover" />
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-ink-55544e">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-surf-272725"
          >
            <FiSave size={13} /> Save Profile
          </button>
        </div>
      </div>

      {/* Studio Notification Preferences */}
      <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xs space-y-4">
        <h3 className="text-[17px] font-bold text-ink-111110">Studio Preferences</h3>

        <div className="divide-y divide-surf-f2efe6">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13.5px] font-medium text-ink-111110">Render Completion Alerts</p>
              <p className="text-[12px] text-ink-717069">Get notified when your 4K video exports finish.</p>
            </div>
            <button
              type="button"
              onClick={() => setRenderAlerts(!renderAlerts)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                renderAlerts ? "bg-surf-111110" : "bg-surf-dedad0"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-surf-c5ef26 transition-transform ${
                  renderAlerts ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13.5px] font-medium text-ink-111110">Hardware GPU Acceleration</p>
              <p className="text-[12px] text-ink-717069">Use WebGL / WebGPU for client timeline rendering.</p>
            </div>
            <button
              type="button"
              onClick={() => setHardwareAcceleration(!hardwareAcceleration)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                hardwareAcceleration ? "bg-surf-111110" : "bg-surf-dedad0"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-surf-c5ef26 transition-transform ${
                  hardwareAcceleration ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13.5px] font-medium text-ink-111110">Product Release Digests</p>
              <p className="text-[12px] text-ink-717069">Weekly digest of new AI motion styles and presets.</p>
            </div>
            <button
              type="button"
              onClick={() => setProductUpdates(!productUpdates)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
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

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 space-y-4">
        <h3 className="text-[16px] font-bold text-ink-dc2626">Session & Security</h3>
        <p className="text-[12.5px] text-ink-7f1d1d">
          Sign out of all active devices or refresh your authenticated profile token.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-red-300 bg-surf-ffffff px-3.5 py-2 text-[12.5px] font-medium text-ink-7f1d1d hover:bg-red-50"
          >
            <FiRefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Sync Session
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl bg-surf-dc2626 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-red-700 shadow-xs"
          >
            <FiLogOut size={13} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
