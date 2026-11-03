"use client";

import { useEffect, useState } from "react";
import { useAuth, type User } from "../../context/AuthContext";
import { useChats } from "../hooks/useChats";
import { type ChatSettings } from "../lib/chatStore";
import { SECTION_LABELS, sectionFor, type SectionId } from "../lib/sections";
import NavSidebar from "./NavSidebar";
import DashboardHeader from "./DashboardHeader";
import OverviewSection from "./sections/OverviewSection";
import LaunchesSection from "./sections/LaunchesSection";
import ProductLaunchSection from "./sections/ProductLaunchSection";
import BRollsSection from "./sections/BRollsSection";
import YourVideosSection from "./sections/YourVideosSection";
import TemplatesSection from "./sections/TemplatesSection";
import AgentConsoleSection from "./sections/AgentConsoleSection";
import BrandKitSection from "./sections/BrandKitSection";
import MembershipSection from "./sections/MembershipSection";
import BillingSection from "./sections/BillingSection";
import AccountSection from "./sections/AccountSection";
import VerifyEmailBanner from "./VerifyEmailBanner";

export default function DashboardShell({ user }: { user: User & { id: string } }) {
  const { logout, refreshUser } = useAuth();
  const chatsApi = useChats(user.id, refreshUser);
  const { chats, activeChat, send, retry, newChat, selectChat, goHome, deleteChat, renameChat, updateChatSettings } = chatsApi;

  const [section, setSectionState] = useState<SectionId>("dashboard");
  // Shell only mounts client-side (after auth resolves), so the viewport is known here:
  // phones start with the drawer closed instead of covering the workspace.
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === "undefined" || window.matchMedia("(min-width: 768px)").matches
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Deep-link / back-button support via URL hash and query params (?section=... & ?prompt=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const querySection = params.get("section");
    const queryPrompt = params.get("prompt");

    if (queryPrompt && queryPrompt.trim()) {
      goHome();
      setSectionState("create");
      setSidebarOpen(false);
      setTimeout(() => {
        send(queryPrompt.trim());
      }, 120);
      window.history.replaceState({}, "", "/dashboard#create");
      return;
    }

    const fromQuery = sectionFor(querySection);
    if (fromQuery) {
      setSectionState(fromQuery);
      window.history.replaceState({}, "", `/dashboard#${fromQuery}`);
    }

    const sync = () => {
      const hash = window.location.hash.slice(1);
      const next = sectionFor(hash);
      if (!next) return;
      setSectionState(next);
      if (next !== hash) window.history.replaceState({}, "", `/dashboard#${next}`);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (next: SectionId) => {
    setSectionState(next);
    if (typeof window !== "undefined") {
      window.location.hash = next;
      if (!window.matchMedia("(min-width: 768px)").matches) setSidebarOpen(false);
    }
  };

  const newLaunch = (initialPrompt?: string, settings?: ChatSettings) => {
    goHome();
    navigate("create");
    // User explicitly requested: "sidebar will close one we start new video chat"
    setSidebarOpen(false);
    if (initialPrompt) {
      setTimeout(() => {
        send(initialPrompt, settings);
      }, 100);
    }
  };

  const openLaunch = (chatId: string) => {
    selectChat(chatId);
    navigate("create");
  };

  const planLabel = user.plan?.tier ? `${user.plan.tier[0].toUpperCase()}${user.plan.tier.slice(1)} plan` : "Free Plan";
  const counts: Partial<Record<SectionId, number>> = {
    create: chats.length,
  };

  return (
    <div className="db flex h-screen w-full overflow-hidden relative selection:bg-[#c5ef26] selection:text-[#07142e]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-[rgba(7,20,46,0.35)] backdrop-blur-2xs md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar matching notebook paper margin style */}
      <NavSidebar
        section={section}
        counts={counts}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={navigate}
        onNewLaunch={() => newLaunch()}
        userName={user.name}
        userEmail={user.email}
        planLabel={planLabel}
        usage={user.usage}
        chats={chats}
        activeChatId={activeChat?.id ?? null}
        onOpenChat={openLaunch}
        onDeleteChat={deleteChat}
      />

      {/* Main Workspace Column with notebook ruled lines */}
      <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden relative bg-[#fcfcfd]">
        {/* Global Header Bar */}
        <DashboardHeader
          user={user}
          onOpenMobileNav={() => setSidebarOpen((prev) => !prev)}
          onOpenSettings={() => navigate("settings")}
          onLogout={logout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          chats={chats}
          onOpenChat={openLaunch}
          onNewLaunch={() => newLaunch()}
          onNavigate={navigate}
          title={SECTION_LABELS[section]}
        />
        <VerifyEmailBanner />

        {/* Scrollable Main Area (Full-height flex for chat interface) with local notebook rules */}
        <div className={`min-h-0 flex-1 ${section === "create" || section === "launches" ? "flex flex-col overflow-hidden" : "overflow-y-auto"}`}>
          {(section === "dashboard" || section === "overview") && (
            <OverviewSection
              user={user}
              chats={chats}
              onNavigate={navigate}
              onOpenLaunch={openLaunch}
              onNewLaunch={newLaunch}
              searchFilter={searchQuery}
            />
          )}

          {(section === "create" || section === "launches") && (
            <LaunchesSection
              chats={chats}
              activeChat={activeChat}
              onSend={send}
              onRetry={retry}
              onNewChat={newChat}
              onSelect={selectChat}
              onDelete={deleteChat}
              onRename={renameChat}
              onBack={goHome}
              onUpdateChatSettings={updateChatSettings}
            />
          )}

          {section === "product-launch" && (
            <ProductLaunchSection onStartLaunch={(prompt, settings) => newLaunch(prompt, settings)} />
          )}

          {section === "brolls" && (
            <BRollsSection onMake={(prompt, settings) => newLaunch(prompt, settings)} />
          )}

          {section === "your-videos" && (
            <YourVideosSection chats={chats} onOpenChat={openLaunch} onNewVideo={() => newLaunch()} />
          )}

          {section === "templates" && (
            <TemplatesSection onSelectTemplate={(p) => newLaunch(p)} />
          )}

          {section === "agent-console" && <AgentConsoleSection />}
          {section === "brandkit" && <BrandKitSection userId={user.id} brandName={user.name} />}
          {section === "membership" && <MembershipSection user={user} />}
          {section === "billing" && <BillingSection user={user} />}
          {(section === "settings" || section === "account") && (
            <AccountSection user={user} onLogout={logout} onRefresh={refreshUser} />
          )}
        </div>
      </main>
    </div>
  );
}
