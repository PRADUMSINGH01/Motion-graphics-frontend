"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAlert } from "./AlertContext";
import { useRouter } from "next/navigation";
import { api, BackendUser, ApiError } from "../lib/api";

export interface User {
  id?: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
  plan?: {
    tier: "free" | "creator" | "pro" | "enterprise";
    status: string;
    billingInterval: "monthly" | "annual";
    features: string[];
  };
  usage?: {
    generations: { daily: number; monthly: number; lifetime: number; limit: number };
    renders: { daily: number; monthly: number; lifetime: number; limit: number };
    apiCalls: { daily: number; monthly: number; lifetime: number; limit: number };
    storage: { usedBytes: number; limitBytes: number };
  };
  token?: string;
  raw?: BackendUser;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    pass: string,
    plan?: "free" | "creator" | "pro" | "enterprise"
  ) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  registerWithGoogle: (credential: string) => Promise<boolean>;
  applyOAuthSession: (token: string, backendUser: BackendUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  triggerDemoAlert: (type: "success" | "failure" | "error") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapBackendUserToUser(bUser: BackendUser, token?: string): User {
  return {
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
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, failure, error } = useAlert();
  const router = useRouter();

  // Re-fetch latest user profile and quotas from backend
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.user.getMe();
      if (res.success && res.user) {
        const storedToken = localStorage.getItem("animagent_token") || undefined;
        const mapped = mapBackendUserToUser(res.user, storedToken);
        setUser(mapped);
        localStorage.setItem("animagent_user", JSON.stringify(mapped));
      }
    } catch {
      // If token expired or session invalid, keep cached or log out
    }
  }, []);

  // Load persisted session on mount & sync with server
  useEffect(() => {
    try {
      const stored = localStorage.getItem("animagent_user");
      const storedToken = localStorage.getItem("animagent_token");
      if (stored) {
        setUser(JSON.parse(stored));
      }
      if (storedToken) {
        refreshUser().catch(() => {});
      }
    } catch {
      // localStorage may fail in restricted mode
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (emailVal: string, passVal: string): Promise<boolean> => {
    const trimmedEmail = emailVal.trim();
    const trimmedPass = passVal.trim();

    if (!trimmedEmail || !trimmedPass) {
      failure("Missing Credentials", "Please enter both your email address and password.");
      return false;
    }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      failure("Invalid Email Format", "Please enter a valid email address (e.g. name@studio.com).");
      return false;
    }

    try {
      const res = await api.auth.login({
        email: trimmedEmail,
        password: trimmedPass,
      });

      if (!res.success || !res.user) {
        failure("Authentication Failed", res.message || "Invalid credentials.");
        return false;
      }

      const loggedUser = mapBackendUserToUser(res.user, res.token);
      setUser(loggedUser);

      try {
        localStorage.setItem("animagent_user", JSON.stringify(loggedUser));
        if (res.token) {
          localStorage.setItem("animagent_token", res.token);
          if (typeof document !== "undefined") {
            document.cookie = `token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
        }
      } catch {
        // ignore
      }

      success(
        "Signed In Successfully",
        `Welcome back, ${loggedUser.name}! Your Animagent AI workspace is loaded.`
      );

      setTimeout(() => {
        router.push("/workspace");
      }, 700);

      return true;
    } catch (err: any) {
      const errMsg = err instanceof ApiError ? err.message : err?.message || "Login failed.";
      if (err instanceof ApiError && err.statusCode >= 500) {
        error("Server Error (500)", errMsg);
      } else {
        failure("Sign In Unsuccessful", errMsg);
      }
      return false;
    }
  };

  const register = async (
    nameVal: string,
    emailVal: string,
    passVal: string,
    plan?: "free" | "creator" | "pro" | "enterprise"
  ): Promise<boolean> => {
    const trimmedName = nameVal.trim();
    const trimmedEmail = emailVal.trim();
    const trimmedPass = passVal.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPass) {
      failure("Incomplete Information", "All fields are required. Please fill in your name, email, and password.");
      return false;
    }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      failure("Invalid Email Address", "Please provide a valid studio email for workspace registration.");
      return false;
    }

    if (trimmedPass.length < 8) {
      failure("Password Requirement", "Password must contain at least 8 characters.");
      return false;
    }

    try {
      const res = await api.auth.register({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPass,
        plan: plan || "free",
      });

      if (!res.success || !res.user) {
        failure("Registration Failed", res.message || "Failed to create account.");
        return false;
      }

      const newUser = mapBackendUserToUser(res.user, res.token);
      setUser(newUser);

      try {
        localStorage.setItem("animagent_user", JSON.stringify(newUser));
        if (res.token) {
          localStorage.setItem("animagent_token", res.token);
          if (typeof document !== "undefined") {
            document.cookie = `token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
        }
      } catch {
        // ignore
      }

      success(
        "Account Created Successfully",
        `Welcome to Animagent AI, ${trimmedName}! Your ${res.user.plan.tier.toUpperCase()} workspace is activated.`
      );

      setTimeout(() => {
        router.push("/workspace");
      }, 700);

      return true;
    } catch (err: any) {
      const errMsg = err instanceof ApiError ? err.message : err?.message || "Registration failed.";
      if (err instanceof ApiError && err.statusCode >= 500) {
        error("Server Error (500)", errMsg);
      } else {
        failure("Registration Notice", errMsg);
      }
      return false;
    }
  };

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    try {
      const res = await api.auth.googleLogin(credential);
      if (res.success && res.user) {
        const loggedUser = mapBackendUserToUser(res.user, res.token);
        setUser(loggedUser);
        localStorage.setItem("animagent_user", JSON.stringify(loggedUser));
        if (res.token) localStorage.setItem("animagent_token", res.token);
        success("Google Sign-In Successful", `Welcome back, ${loggedUser.name}!`);
        setTimeout(() => router.push("/workspace"), 700);
        return true;
      }
      return false;
    } catch (err: any) {
      failure("Google Login Failed", err?.message || "Could not authenticate with Google.");
      return false;
    }
  };

  const registerWithGoogle = async (credential: string): Promise<boolean> => {
    try {
      const res = await api.auth.googleRegister(credential);
      if (res.success && res.user) {
        const newUser = mapBackendUserToUser(res.user, res.token);
        setUser(newUser);
        localStorage.setItem("animagent_user", JSON.stringify(newUser));
        if (res.token) localStorage.setItem("animagent_token", res.token);
        success("Google Registration Successful", `Welcome to Animagent AI, ${newUser.name}!`);
        setTimeout(() => router.push("/workspace"), 700);
        return true;
      }
      return false;
    } catch (err: any) {
      failure("Google Sign-Up Failed", err?.message || "Could not register with Google.");
      return false;
    }
  };

  const applyOAuthSession = useCallback((token: string, backendUser: BackendUser) => {
    const mapped = mapBackendUserToUser(backendUser, token);
    setUser(mapped);
    try {
      localStorage.setItem("animagent_user", JSON.stringify(mapped));
      localStorage.setItem("animagent_token", token);
      if (typeof document !== "undefined") {
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch {
      // ignore
    }
    refreshUser().catch(() => {});
  }, [refreshUser]);

  const logout = () => {
    if (!user) {
      failure("No Active Session", "You are not currently logged into any account.");
      return;
    }

    const prevName = user.name;
    setUser(null);
    try {
      localStorage.removeItem("animagent_user");
      localStorage.removeItem("animagent_token");
      if (typeof document !== "undefined") {
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      }
      api.auth.logout().catch(() => {});
    } catch {
      // ignore
    }

    success("Logged Out Successfully", `Session for ${prevName} closed safely.`);
  };

  const triggerDemoAlert = (type: "success" | "failure" | "error") => {
    if (type === "success") {
      success(
        "Motion Graphic Exported",
        "High-definition 4K WebM render is ready for download."
      );
    } else if (type === "failure") {
      failure(
        "Action Blocked",
        "GPU compute token quota reached for current tier. Upgrade plan to increase limits."
      );
    } else {
      error(
        "GPU Rendering Failure (503)",
        "Cluster worker node timed out while compiling shaders."
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        registerWithGoogle,
        applyOAuthSession,
        logout,
        refreshUser,
        triggerDemoAlert,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
