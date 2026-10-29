"use client";

import { useEffect, useState } from "react";
import { useAuth, type User } from "../../context/AuthContext";
import { useChats } from "../hooks/useChats";
import { collectVideos } from "../lib/chatStore";
import { loadAssets } from "../lib/assets";
import { SECTION_LABELS, isSectionId, type SectionId } from "../lib/sections";
import NavSidebar from "./NavSidebar";
import DashboardHeader from "./DashboardHeader";
import OverviewSection from "./sections/OverviewSection";
import LaunchesSection from "./sections/LaunchesSection";
import ProductLaunchSection from "./sections/ProductLaunchSection";
import BRollsSection from "./sections/BRollsSection";
import YourVideosSection from "./sections/YourVideosSection";
import TemplatesSection from "./sections/TemplatesSection";
import ProjectsSection from "./sections/ProjectsSection";
import MediaSection from "./sections/MediaSection";
import AssetsSection from "./sections/AssetsSection";
import ExportsSection from "./sections/ExportsSection";
import AgentConsoleSection from "./sections/AgentConsoleSection";
import BrandKitSection from "./sections/BrandKitSection";
import IntegrationsSection from "./sections/IntegrationsSection";
import MembershipSection from "./sections/MembershipSection";
import BillingSection from "./sections/BillingSection";
import AccountSection from "./sections/AccountSection";

export default function DashboardShell({ user }: { user: User & { id: string } }) {
  const { logout, refreshUser } = useAuth();
  const chatsApi = useChats(user.id);
  const { chats, activeChat, send, retry, newChat, selectChat, goHome, deleteChat, renameChat } = chatsApi;

  const [section, setSectionState] = useState<SectionId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [assetCount, setAssetCount] = useState(() => (typeof window !== "undefined" ? loadAssets(user.id).length : 0));

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

    if (querySection && isSectionId(querySection)) {
      setSectionState(querySection);
      window.history.replaceState({}, "", `/dashboard#${querySection}`);
    }

    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (isSectionId(hash)) {
        setSectionState(hash);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (next: SectionId) => {
    setAssetCount(loadAssets(user.id).length);
    setSectionState(next);
    if (typeof window !== "undefined") window.location.hash = next;
  };

  const newLaunch = (initialPrompt?: string) => {
    goHome();
    navigate("create");
    // User explicitly requested: "sidebar will close one we start new video chat"
    setSidebarOpen(false);
    if (initialPrompt) {
      setTimeout(() => {
        send(initialPrompt);
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
    projects: chats.length + 4,
    media: collectVideos(chats).length,
    assets: assetCount,
    exports: 3,
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
      />

      {/* Main Workspace Column with notebook ruled lines */}
      <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden db-notebook-rules relative">
        {/* Global Header Bar */}
        <DashboardHeader
          user={user}
          onOpenMobileNav={() => setSidebarOpen((prev) => !prev)}
          onOpenSettings={() => navigate("settings")}
          onLogout={logout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewLaunch={() => newLaunch()}
          onNavigate={navigate}
        />

        {/* Scrollable Main Area (Full-height flex for chat interface) with local notebook rules */}
        <div className={`min-h-0 flex-1 db-notebook-rules ${section === "create" || section === "launches" ? "flex flex-col overflow-hidden" : "overflow-y-auto"}`}>
          {(section === "dashboard" || section === "overview") && (
            <OverviewSection
              user={user}
              chats={chats}
              assetCount={assetCount}
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
            />
          )}

          {section === "product-launch" && (
            <ProductLaunchSection onStartLaunch={(prompt) => newLaunch(prompt)} />
          )}

          {section === "brolls" && (
            <BRollsSection onUseClip={(prompt) => newLaunch(prompt)} />
          )}

          {section === "your-videos" && (
            <YourVideosSection onOpenStudio={(title) => newLaunch(title)} />
          )}

          {section === "templates" && (
            <TemplatesSection onSelectTemplate={(p) => newLaunch(p)} />
          )}

          {section === "projects" && (
            <ProjectsSection
              chats={chats}
              onOpenLaunch={openLaunch}
              onNewLaunch={() => newLaunch()}
              onDeleteChat={deleteChat}
            />
          )}

          {(section === "media" || section === "assets") && (
            <MediaSection chats={chats} onOpenLaunch={openLaunch} onNewLaunch={() => newLaunch()} />
          )}

          {section === "exports" && <ExportsSection />}
          {section === "agent-console" && <AgentConsoleSection />}
          {section === "brandkit" && <BrandKitSection userId={user.id} brandName={user.name} />}
          {section === "integrations" && <IntegrationsSection />}
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
