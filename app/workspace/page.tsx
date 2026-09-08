"use client";

import React from "react";
import SpiderNetBackground from "../components/SpiderNetBackground";
import StudioSidebar from "./components/StudioSidebar";
import StudioHeader from "./components/StudioHeader";
import MotionStudioView from "./components/MotionStudioView";
import VectorizerTab from "./components/VectorizerTab";
import UsageTab from "./components/UsageTab";
import BillingTab from "./components/BillingTab";
import StudioLoadingScreen from "../components/StudioLoadingScreen";
import { useWorkspace } from "./hooks/useWorkspace";

export default function WorkspacePage() {
  const ws = useWorkspace();

  if (ws.isRedirecting) {
    return (
      <StudioLoadingScreen
        message="AUTHENTICATING SESSION..."
        subMessage="Validating credentials and studio environment"
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-[#121013] text-slate-800 dark:text-slate-100 font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-300">
      {/* Dynamic SpiderNet Ambient Background */}
      <SpiderNetBackground opacity={0.3} className="fixed inset-0" />

      {/* 1. Studio Sidebar */}
      <StudioSidebar
        workspaceMode={ws.workspaceMode}
        setWorkspaceMode={ws.setWorkspaceMode}
        userPlan={ws.userPlan}
        genPercent={ws.genPercent}
        genUsed={ws.genUsed}
        genLimit={ws.genLimit}
        projects={ws.projects}
        activeProjectId={ws.activeProjectId}
        onSelectProject={ws.handleSelectProject}
        onCreateProject={ws.handleCreateProject}
        userDisplayName={ws.userDisplayName}
        userEmail={ws.userEmail}
        onLogout={ws.logout}
      />

      {/* 2. Main Workspace Stage */}
      <main className="relative flex-1 flex flex-col h-full overflow-hidden bg-transparent">
        <StudioHeader
          workspaceMode={ws.workspaceMode}
          setWorkspaceMode={ws.setWorkspaceMode}
          activeProject={ws.activeProject}
          activeStyle={ws.activeStyle}
          aspectRatio={ws.aspectRatio}
          setAspectRatio={ws.setAspectRatio}
          copiedPrompt={ws.copiedPrompt}
          onCopyPrompt={ws.copyPrompt}
          onExport={ws.handleExport}
          isRefreshingQuotas={ws.isRefreshingQuotas}
          onRefreshQuotas={ws.handleRefreshQuotas}
          hasActiveAnimation={ws.hasActiveAnimation}
        />

        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-3 sm:p-4 max-w-5xl mx-auto w-full flex flex-col items-center">
          {/* TAB A: MOTION STUDIO */}
          {ws.workspaceMode === "prompt" && (
            <MotionStudioView
              canvasRef={ws.canvasRef}
              canvasContainerRef={ws.canvasContainerRef}
              aspectRatio={ws.aspectRatio}
              isPlaying={ws.isPlaying}
              togglePlay={ws.togglePlay}
              currentTime={ws.currentTime}
              setCurrentTime={ws.setCurrentTime}
              duration={ws.activeProject.duration}
              isLooping={ws.isLooping}
              setIsLooping={ws.setIsLooping}
              isGenerating={ws.isGenerating}
              generationStatus={ws.generationStatus}
              generationProgress={ws.generationProgress}
              onScrub={ws.handleScrub}
              promptText={ws.promptText}
              setPromptText={ws.setPromptText}
              activeStyle={ws.activeStyle}
              setActiveStyle={ws.setActiveStyle}
              liveText={ws.liveText}
              setLiveText={ws.setLiveText}
              colorPalette={ws.colorPalette}
              setColorPalette={ws.setColorPalette}
              motionSpeed={ws.motionSpeed}
              setMotionSpeed={ws.setMotionSpeed}
              onGenerate={ws.handleGenerate}
              hasActiveAnimation={ws.hasActiveAnimation}
              generatedTemplates={ws.generatedTemplates}
              activeTemplateId={ws.activeTemplateId}
              onSelectTemplate={ws.handleSelectTemplate}
              onDeleteTemplate={ws.handleDeleteTemplate}
              onRemixTemplate={ws.handleRemixTemplate}
              onClearTemplates={ws.handleClearTemplates}
            />
          )}

          {/* TAB B: CHARACTER VECTORIZER */}
          {ws.workspaceMode === "vectorizer" && (
            <VectorizerTab
              charInput={ws.charInput}
              setCharInput={ws.setCharInput}
              charEffect={ws.charEffect}
              setCharEffect={ws.setCharEffect}
              isConvertingChar={ws.isConvertingChar}
              onRunVectorizer={ws.handleRunVectorizer}
              onCancel={() => ws.setWorkspaceMode("prompt")}
            />
          )}

          {/* TAB C: USAGE & COMPUTE QUOTAS */}
          {ws.workspaceMode === "usage" && (
            <UsageTab
              userPlan={ws.userPlan}
              genPercent={ws.genPercent}
              genUsed={ws.genUsed}
              genLimit={ws.genLimit}
              rendersPercent={ws.rendersPercent}
              rendersUsed={ws.rendersUsed}
              rendersLimit={ws.rendersLimit}
              apiPercent={ws.apiPercent}
              apiUsed={ws.apiUsed}
              apiLimit={ws.apiLimit}
              storagePercent={ws.storagePercent}
              storageUsedGB={ws.storageUsedGB}
              storageLimitGB={ws.storageLimitGB}
              extraCredits={ws.extraCredits}
              onTopUpCredits={ws.handleTopUpCredits}
            />
          )}

          {/* TAB D: PLANS & BILLING */}
          {ws.workspaceMode === "billing" && (
            <BillingTab
              billingInterval={ws.billingInterval}
              setBillingInterval={ws.setBillingInterval}
              userPlan={ws.userPlan}
              pricingTiers={ws.pricingTiers}
              isUpdatingPlan={ws.isUpdatingPlan}
              selectedTierForUpdate={ws.selectedTierForUpdate}
              onSwitchPlan={ws.handleSwitchPlan}
              onDownloadReceipt={ws.handleDownloadReceipt}
            />
          )}
        </div>
      </main>
    </div>
  );
}
