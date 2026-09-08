"use client";

import React, { RefObject, useState } from "react";
import StudioCanvasPlayer from "./StudioCanvasPlayer";
import PromptInspectorPanel from "./PromptInspectorPanel";
import GeneratedTemplatesGrid from "./GeneratedTemplatesGrid";
import Logo from "../../components/Logo";
import {
  AspectRatio,
  StylePreset,
  ColorPalette,
  MotionSpeed,
  GeneratedTemplateItem,
} from "../types";

interface MotionStudioViewProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canvasContainerRef: RefObject<HTMLDivElement | null>;
  aspectRatio: AspectRatio;
  isPlaying: boolean;
  togglePlay: () => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  isLooping: boolean;
  setIsLooping: (loop: boolean) => void;
  isGenerating: boolean;
  generationStatus: string;
  generationProgress: number;
  onScrub: (val: number) => void;
  promptText: string;
  setPromptText: (text: string) => void;
  activeStyle: StylePreset;
  setActiveStyle: (style: StylePreset) => void;
  liveText: string;
  setLiveText: (text: string) => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  motionSpeed: MotionSpeed;
  setMotionSpeed: (speed: MotionSpeed) => void;
  onGenerate: (e?: React.FormEvent) => void;
  hasActiveAnimation?: boolean;
  // Generated Templates Grid Props
  generatedTemplates: GeneratedTemplateItem[];
  activeTemplateId: string;
  onSelectTemplate: (template: GeneratedTemplateItem) => void;
  onDeleteTemplate: (id: string) => void;
  onRemixTemplate: (prompt: string, style: StylePreset) => void;
  onClearTemplates?: () => void;
}

export default function MotionStudioView({
  canvasRef,
  canvasContainerRef,
  aspectRatio,
  isPlaying,
  togglePlay,
  currentTime,
  setCurrentTime,
  duration,
  isLooping,
  setIsLooping,
  isGenerating,
  generationStatus,
  generationProgress,
  onScrub,
  promptText,
  setPromptText,
  activeStyle,
  onGenerate,
  hasActiveAnimation = false,
  generatedTemplates,
  activeTemplateId,
  onSelectTemplate,
  onDeleteTemplate,
  onRemixTemplate,
  onClearTemplates,
}: MotionStudioViewProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-6 py-2">
      {/* 1. Active 60FPS Studio Player (Displayed when animation has been generated or selected) */}
      {hasActiveAnimation && (
        <div className="w-full flex flex-col items-center">
          <StudioCanvasPlayer
            canvasRef={canvasRef}
            canvasContainerRef={canvasContainerRef}
            aspectRatio={aspectRatio}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            duration={duration}
            isLooping={isLooping}
            setIsLooping={setIsLooping}
            isGenerating={isGenerating}
            generationStatus={generationStatus}
            generationProgress={generationProgress}
            onScrub={onScrub}
            promptText={promptText}
            activeStyle={activeStyle}
          />
        </div>
      )}

      {/* 2. Generating Status Overlay (if generating without active canvas) */}
      {!hasActiveAnimation && isGenerating && (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center p-8 rounded-2xl bg-[#090b13]/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] animate-fadeIn select-none">
          {/* Rotating Ring & Core */}
          <div className="relative flex items-center justify-center w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shadow-lg">
              <Logo size={24} />
            </div>
          </div>

          {/* Status & Prompt */}
          <div className="text-center space-y-1.5 max-w-md px-4">
            <p className="text-sm font-semibold text-white tracking-wide">
              {generationStatus || "Connecting to /api/prompt..."}
            </p>
            {promptText && (
              <p className="text-xs font-mono text-cyan-400/80 truncate max-w-sm mx-auto italic">
                &ldquo;{promptText}&rdquo;
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-64 mt-5 space-y-1.5">
            <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                style={{ width: `${Math.max(10, generationProgress)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="uppercase text-cyan-400/70">Awaiting Server Response</span>
              <span className="text-cyan-400 font-semibold">{Math.round(generationProgress)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Hero Header (when no animation is yet active) */}
      {!hasActiveAnimation && !isGenerating && (
        <div className="text-center space-y-2 select-none pt-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            AI Motion Graphics Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Describe kinetic typography, 3D motion, or logo reveals. Generated templates appear in the grid below.
          </p>
        </div>
      )}

      {/* 4. Prompt Input Bar */}
      <div className="w-full max-w-2xl">
        <PromptInspectorPanel
          promptText={promptText}
          setPromptText={setPromptText}
          isGenerating={isGenerating}
          onGenerate={onGenerate}
        />
      </div>

      {/* 5. Generated Templates Grid */}
      <div className="w-full pt-4">
        <GeneratedTemplatesGrid
          templates={generatedTemplates}
          activeTemplateId={activeTemplateId}
          onSelectTemplate={onSelectTemplate}
          onDeleteTemplate={onDeleteTemplate}
          onRemixTemplate={onRemixTemplate}
          onClearAll={onClearTemplates}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
