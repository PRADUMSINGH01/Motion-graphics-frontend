"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  IconCheckCircle,
  IconAlertTriangle,
  IconXCircle,
  IconX,
  IconArrowRight,
} from "../components/Icons";

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
        className="fixed top-20 right-4 sm:right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)] pointer-events-none"
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

// Toast card rendered for each alert; colours come from the semantic theme tokens.
function AlertToast({
  alert,
  onDismiss,
}: {
  alert: AlertMessage;
  onDismiss: () => void;
}) {
  const config = {
    success: { tone: "text-success", bar: "bg-success", Icon: IconCheckCircle },
    failure: { tone: "text-warning", bar: "bg-warning", Icon: IconAlertTriangle },
    error: { tone: "text-danger", bar: "bg-danger", Icon: IconXCircle },
  }[alert.type];

  const { Icon } = config;

  return (
    <div
      role="alert"
      className="relative overflow-hidden pointer-events-auto rounded-xl border border-line bg-surface-2 shadow-elevated p-4 animate-fade-up"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-px shrink-0 ${config.tone}`} />

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-fg leading-snug">{alert.title}</h4>
          {alert.message && <p className="mt-1 text-[13px] text-fg-muted leading-relaxed">{alert.message}</p>}
          {alert.action && (
            <button
              type="button"
              onClick={() => {
                alert.action?.onClick();
                onDismiss();
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline underline-offset-4 cursor-pointer"
            >
              <span>{alert.action.label}</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 -mr-1 -mt-0.5 rounded-md text-fg-subtle hover:text-fg hover:bg-fg/5 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss alert"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>

      {alert.duration && alert.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-fg/[0.06] overflow-hidden">
          <div
            className={`h-full ${config.bar} opacity-70`}
            style={{ animation: `shrinkWidth ${alert.duration}ms linear forwards` }}
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
