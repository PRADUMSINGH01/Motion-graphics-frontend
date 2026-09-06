"use client";

import React, { RefObject } from "react";
import { FiPlay, FiPause, FiRepeat } from "react-icons/fi";
import { AspectRatio } from "../types";
import FuturisticSynthesisOverlay from "./FuturisticSynthesisOverlay";

interface StudioCanvasPlayerProps {
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
}

export default function StudioCanvasPlayer({
  canvasRef,
  canvasContainerRef,
  aspectRatio,
  isPlaying,
  togglePlay,
  currentTime,
  duration,
  isLooping,
  setIsLooping,
  isGenerating,
  generationStatus,
  generationProgress,
  onScrub,
}: StudioCanvasPlayerProps) {
  return (
    <div
      ref={canvasContainerRef}
      className={`relative rounded-2xl bg-[#030406] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col w-full transition-all duration-300 ${
        aspectRatio === "16:9"
          ? "max-w-3xl aspect-[16/9] max-h-[50vh]"
          : aspectRatio === "9:16"
          ? "max-w-xs aspect-[9/16] max-h-[55vh]"
          : "max-w-md aspect-square max-h-[50vh]"
      }`}
    >
      {/* 60FPS Canvas */}
      <div className="relative w-full flex-1 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover select-none" />

        {/* Status Overlay Badge */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300 font-semibold">
            1080p • 60 FPS
          </span>
        </div>

        {/* Click-to-Play Center Overlay when paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/15 cursor-pointer group transition-all"
            title="Click to Play"
          >
            <div className="w-13 h-13 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-cyan-400/80 group-hover:text-cyan-300 transition-all shadow-xl">
              <FiPlay className="w-6 h-6 ml-0.5" />
            </div>
          </div>
        )}

        {/* Futuristic Synthesis Waiting Animation */}
        {isGenerating && (
          <FuturisticSynthesisOverlay
            generationStatus={generationStatus}
            generationProgress={generationProgress}
          />
        )}
      </div>

      {/* Integrated Transport Control Dock */}
      <div className="h-11 shrink-0 bg-[#090b10]/95 border-t border-white/[0.08] px-3.5 flex items-center gap-2.5 select-none">
        {/* Play / Pause Toggle */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-7 h-7 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <FiPause className="w-3.5 h-3.5" />
          ) : (
            <FiPlay className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>

        {/* Loop Toggle: Default OFF (Does not endlessly loop) */}
        <button
          type="button"
          onClick={() => setIsLooping(!isLooping)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            isLooping
              ? "text-cyan-400 bg-cyan-500/15"
              : "text-slate-500 hover:text-slate-300"
          }`}
          title={isLooping ? "Loop Enabled" : "Loop Disabled (Plays once)"}
        >
          <FiRepeat className="w-3.5 h-3.5" />
        </button>

        {/* Progress Scrub Slider */}
        <div className="flex-1 flex items-center px-1">
          <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={(e) => onScrub(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1 bg-white/15 rounded-lg appearance-none"
          />
        </div>

        {/* Timecode */}
        <span className="text-[11px] font-mono text-slate-400 shrink-0">
          00:0{currentTime.toFixed(1)} / 00:0{duration}.0
        </span>
      </div>
    </div>
  );
}
