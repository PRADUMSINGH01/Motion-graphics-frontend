"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "./components/DashboardShell";
import StudioLoadingScreen from "../components/StudioLoadingScreen";
import "./dashboard.css";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Videos are made as the signed-in user: without a session, go sign in first.
  useEffect(() => {
    if (!isLoading && !user) router.replace("/login?redirect=/dashboard");
  }, [isLoading, user, router]);

  if (!user?.id) {
    return (
      <StudioLoadingScreen
        message="Opening your byreel.in studio session"
        subMessage="Verifying studio pass and loading your video workspace"
      />
    );
  }

  return <DashboardShell key={user.id} user={{ ...user, id: user.id }} />;
}
