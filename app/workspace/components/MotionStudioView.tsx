"use client";

import React, { RefObject } from "react";
import StudioCanvasPlayer from "./StudioCanvasPlayer";
import PromptInspectorPanel from "./PromptInspectorPanel";
import Logo from "../../components/Logo";
import { AspectRatio, StylePreset, ColorPalette, MotionSpeed } from "../types";

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
}: MotionStudioViewProps) {
  // If no motion graphic has been generated yet, show clean centered prompt box (no empty player)
  if (!hasActiveAnimation) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto my-auto py-12 sm:py-20 space-y-6">
        {isGenerating ? (
          <div className="w-full flex flex-col items-center justify-center p-8 rounded-2xl bg-[#090b13]/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] animate-fadeIn select-none">
            {/* Minimalist Rotating Ring & Core */}
            <div className="relative flex items-center justify-center w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shadow-lg">
                <Logo size={24} />
              </div>
            </div>

            {/* Status & Prompt */}
            <div className="text-center space-y-1.5 max-w-md px-4">
              <p className="text-sm font-semibold text-white tracking-wide">
                {generationStatus || "Awaiting response from /api/prompt..."}
              </p>
              {promptText && (
                <p className="text-xs font-mono text-cyan-400/80 truncate max-w-sm mx-auto italic">
                  &ldquo;{promptText}&rdquo;
                </p>
              )}
            </div>

            {/* 2px Progress Bar */}
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
        ) : (
          <div className="text-center space-y-2 select-none">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              What would you like to animate?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Describe any kinetic typography, 3D motion, or logo reveal in natural language.
            </p>
          </div>
        )}

        <PromptInspectorPanel
          promptText={promptText}
          setPromptText={setPromptText}
          isGenerating={isGenerating}
          onGenerate={onGenerate}
        />
      </div>
    );
  }

  // Once a prompt is submitted / generating / generated, show the 60FPS canvas player + prompt box
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-4 py-1">
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

      <PromptInspectorPanel
        promptText={promptText}
        setPromptText={setPromptText}
        isGenerating={isGenerating}
        onGenerate={onGenerate}
      />
    </div>
  );
}
