"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

export type AlertType = "success" | "failure" | "error";

export interface AlertAction {
  label: string;
  onClick: () => void;
}

export interface AlertMessage {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
  action?: AlertAction;
}

interface AlertContextType {
  showAlert: (alert: Omit<AlertMessage, "id">) => void;
  success: (title: string, message?: string, action?: AlertAction, duration?: number) => void;
  failure: (title: string, message?: string, action?: AlertAction, duration?: number) => void;
  error: (title: string, message?: string, action?: AlertAction, duration?: number) => void;
  dismissAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(
    ({
      type,
      title,
      message,
      action,
      duration = 4500,
    }: Omit<AlertMessage, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newAlert: AlertMessage = { id, type, title, message, action, duration };

      // Keep maximum 4 alerts on screen at once
      setAlerts((prev) => [...prev.slice(-3), newAlert]);

      if (duration > 0) {
        setTimeout(() => {
          dismissAlert(id);
        }, duration);
      }
    },
    [dismissAlert]
  );

  const success = useCallback(
    (title: string, message?: string, action?: AlertAction, duration?: number) => {
      showAlert({ type: "success", title, message, action, duration });
    },
    [showAlert]
  );

  const failure = useCallback(
    (title: string, message?: string, action?: AlertAction, duration?: number) => {
      showAlert({ type: "failure", title, message, action, duration });
    },
    [showAlert]
  );

  const error = useCallback(
    (title: string, message?: string, action?: AlertAction, duration?: number) => {
      showAlert({ type: "error", title, message, action, duration });
    },
    [showAlert]
  );

  return (
    <AlertContext.Provider
      value={{ showAlert, success, failure, error, dismissAlert }}
    >
      {children}

      {/* Centralized Floating Alert Container (Top-Right on desktop, centered on mobile) */}
      <div
        aria-live="assertive"
        className="fixed top-20 sm:top-24 right-4 sm:right-6 z-[99999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none"
      >
        {alerts.map((alert) => (
          <AlertToast
            key={alert.id}
            alert={alert}
            onDismiss={() => dismissAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}

// Sub-component for each Alert Toast Card matching the website's dark spider-web & obsidian glassmorphic theme
function AlertToast({
  alert,
  onDismiss,
}: {
  alert: AlertMessage;
  onDismiss: () => void;
}) {
  const config = {
    success: {
      leftBorder: "border-l-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      pingBg: "bg-emerald-400",
      dotBg: "bg-emerald-500",
      tagColor: "text-emerald-400",
      progressBar: "bg-gradient-to-r from-emerald-400 to-cyan-400",
      glowColor: "shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(16,185,129,0.12)]",
      Icon: FiCheckCircle,
      tag: "ANIMAGENT • SUCCESS",
    },
    failure: {
      leftBorder: "border-l-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      pingBg: "bg-amber-400",
      dotBg: "bg-amber-500",
      tagColor: "text-amber-400",
      progressBar: "bg-gradient-to-r from-amber-400 to-yellow-400",
      glowColor: "shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.12)]",
      Icon: FiAlertTriangle,
      tag: "ANIMAGENT • NOTICE",
    },
    error: {
      leftBorder: "border-l-rose-500",
      iconBg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      pingBg: "bg-rose-400",
      dotBg: "bg-rose-500",
      tagColor: "text-rose-400",
      progressBar: "bg-gradient-to-r from-rose-500 to-pink-500",
      glowColor: "shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(244,63,94,0.12)]",
      Icon: FiXCircle,
      tag: "ANIMAGENT • ERROR",
    },
  }[alert.type];

  const { Icon } = config;

  return (
    <div
      role="alert"
      className={`relative overflow-hidden pointer-events-auto rounded-2xl border border-white/10 border-l-[3.5px] ${config.leftBorder} bg-[#0e0f14]/95 backdrop-blur-2xl p-4 sm:p-4.5 ${config.glowColor} transition-all duration-300 transform translate-y-0 font-poppins`}
    >
      {/* Subtle Spider-Web Corner Watermark matching hero & login canvas aesthetic */}
      <svg
        className="absolute -top-3 -right-3 w-24 h-24 text-white/[0.03] pointer-events-none select-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <circle cx="100" cy="0" r="30" strokeDasharray="2 4" />
        <circle cx="100" cy="0" r="60" strokeDasharray="3 5" />
        <circle cx="100" cy="0" r="90" strokeDasharray="3 6" />
        <line x1="100" y1="0" x2="20" y2="85" />
        <line x1="100" y1="0" x2="55" y2="95" />
        <line x1="100" y1="0" x2="5" y2="45" />
        <circle cx="55" cy="95" r="1.5" fill="currentColor" />
        <circle cx="20" cy="85" r="1.5" fill="currentColor" />
        <circle cx="5" cy="45" r="1.5" fill="currentColor" />
      </svg>

      <div className="relative z-10 flex items-start gap-3.5">
        {/* Type Icon Badge with website's signature frosted glass look */}
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm backdrop-blur-md ${config.iconBg}`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Header pill with live radar dot */}
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pingBg} opacity-75`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${config.dotBg}`}
              />
            </span>
            <span
              className={`text-[10px] font-mono font-semibold tracking-wider uppercase ${config.tagColor}`}
            >
              {config.tag}
            </span>
          </div>

          {/* Alert Title using website's Comic Relief typography */}
          <h4 className="text-sm font-bold text-white tracking-tight leading-snug font-comic">
            {alert.title}
          </h4>

          {/* Alert Description Message using Poppins */}
          {alert.message && (
            <p className="mt-1 text-xs text-slate-400 leading-relaxed font-normal">
              {alert.message}
            </p>
          )}

          {/* Action Button if specified */}
          {alert.action && (
            <button
              type="button"
              onClick={() => {
                alert.action?.onClick();
                onDismiss();
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-cyan-300 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-cyan-300 cursor-pointer"
            >
              <span>{alert.action.label}</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 -mr-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss alert"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic duration progress line with neon hairline glow */}
      {alert.duration && alert.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full ${config.progressBar} transition-all duration-linear shadow-sm`}
            style={{
              animation: `shrinkWidth ${alert.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
