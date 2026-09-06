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
  setActiveStyle,
  liveText,
  setLiveText,
  colorPalette,
  setColorPalette,
  motionSpeed,
  setMotionSpeed,
  onGenerate,
}: MotionStudioViewProps) {
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
      />

      <PromptInspectorPanel
        promptText={promptText}
        setPromptText={setPromptText}
        activeStyle={activeStyle}
        setActiveStyle={setActiveStyle}
        liveText={liveText}
        setLiveText={setLiveText}
        colorPalette={colorPalette}
        setColorPalette={setColorPalette}
        motionSpeed={motionSpeed}
        setMotionSpeed={setMotionSpeed}
        isGenerating={isGenerating}
        onGenerate={onGenerate}
      />
    </div>
  );
}
