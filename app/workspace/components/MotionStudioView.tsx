"use client";

import React, { RefObject } from "react";
import StudioCanvasPlayer from "./StudioCanvasPlayer";
import PromptInspectorPanel from "./PromptInspectorPanel";
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
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto my-auto py-16 sm:py-24 space-y-6">
        <div className="text-center space-y-2 select-none">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            What would you like to animate?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Describe any kinetic typography, 3D motion, or logo reveal in natural language.
          </p>
        </div>

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
