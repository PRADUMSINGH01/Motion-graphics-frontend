"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";
import { useRouter } from "next/navigation";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  triggerDemoAlert: (type: "success" | "failure" | "error") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, failure, error } = useAlert();
  const router = useRouter();

  // Load persisted user on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("animagent_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // localStorage may fail in restricted mode
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (emailVal: string, passVal: string): Promise<boolean> => {
    const trimmedEmail = emailVal.trim();
    const trimmedPass = passVal.trim();

    // 1. Validation Failures (Failure UI)
    if (!trimmedEmail || !trimmedPass) {
      failure(
        "Missing Credentials",
        "Please provide both your registered email address and password."
      );
      return false;
    }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      failure(
        "Invalid Email Format",
        "Please enter a valid email address (e.g. name@studio.com)."
      );
      return false;
    }

    // 2. Simulated System Error (Error UI)
    if (trimmedEmail.toLowerCase().includes("error") || trimmedPass === "error") {
      error(
        "Auth Gateway Timeout (504)",
        "The authentication cluster failed to respond. Please try again later."
      );
      return false;
    }

    // 3. Simulated Credential Failure (Failure UI)
    if (trimmedPass.length < 6) {
      failure(
        "Invalid Credentials",
        "Password must contain at least 6 characters. Please try again."
      );
      return false;
    }

    // 4. Success State (Success UI)
    const displayName = trimmedEmail.split("@")[0];
    const capitalizedName =
      displayName.charAt(0).toUpperCase() + displayName.slice(1);
    const loggedUser: User = {
      name: capitalizedName,
      email: trimmedEmail,
    };

    setUser(loggedUser);
    try {
      localStorage.setItem("animagent_user", JSON.stringify(loggedUser));
    } catch {
      // ignore
    }

    success(
      "Signed In Successfully",
      `Welcome back, ${capitalizedName}! Your Animagent AI workspace is loaded.`
    );

    // Redirect to Explore page or home
    setTimeout(() => {
      router.push("/explore");
    }, 900);

    return true;
  };

  const register = async (
    nameVal: string,
    emailVal: string,
    passVal: string
  ): Promise<boolean> => {
    const trimmedName = nameVal.trim();
    const trimmedEmail = emailVal.trim();
    const trimmedPass = passVal.trim();

    // 1. Validation Failure (Failure UI)
    if (!trimmedName || !trimmedEmail || !trimmedPass) {
      failure(
        "Incomplete Information",
        "All fields are required. Please fill in your name, email, and password."
      );
      return false;
    }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      failure(
        "Invalid Email Address",
        "Please provide a legitimate studio email for workspace registration."
      );
      return false;
    }

    // 2. Simulated System Error (Error UI)
    if (trimmedEmail.toLowerCase().includes("error") || trimmedName.toLowerCase().includes("error")) {
      error(
        "Compute Cluster Error (500)",
        "Failed to provision isolated GPU runtime for your new studio workspace."
      );
      return false;
    }

    // 3. Password Failure (Failure UI)
    if (trimmedPass.length < 6) {
      failure(
        "Password Security Notice",
        "Your password is too short. It must contain a minimum of 6 characters."
      );
      return false;
    }

    // 4. Success State (Success UI)
    const newUser: User = {
      name: trimmedName,
      email: trimmedEmail,
    };

    setUser(newUser);
    try {
      localStorage.setItem("animagent_user", JSON.stringify(newUser));
    } catch {
      // ignore
    }

    success(
      "Account Created Successfully",
      `Welcome to Animagent AI, ${trimmedName}! Your 7-day Pro trial is activated.`
    );

    setTimeout(() => {
      router.push("/explore");
    }, 900);

    return true;
  };

  const logout = () => {
    if (!user) {
      failure(
        "No Active Session",
        "You are not currently logged into any Animagent account."
      );
      return;
    }

    const prevName = user.name;
    setUser(null);
    try {
      localStorage.removeItem("animagent_user");
    } catch {
      // ignore
    }

    success(
      "Logged Out Successfully",
      `Session for ${prevName} closed safely. See you on your next creative sprint!`
    );
  };

  const triggerDemoAlert = (type: "success" | "failure" | "error") => {
    if (type === "success") {
      success(
        "Motion Graphic Exported",
        "High-definition 4K WebM render of 'Spider Matrix Warp' is ready for download."
      );
    } else if (type === "failure") {
      failure(
        "Action Blocked (Warning)",
        "Rendering queue paused: GPU compute token quota reached for current tier."
      );
    } else {
      error(
        "GPU Rendering Failure (503)",
        "Cluster worker node #12 crashed unexpectedly while compiling shaders."
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
        logout,
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
