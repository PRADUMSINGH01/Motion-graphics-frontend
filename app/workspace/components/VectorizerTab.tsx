"use client";

import React from "react";
import { FiType, FiZap } from "react-icons/fi";
import { CharEffect } from "../types";

interface VectorizerTabProps {
  charInput: string;
  setCharInput: (text: string) => void;
  charEffect: CharEffect;
  setCharEffect: (effect: CharEffect) => void;
  isConvertingChar: boolean;
  onRunVectorizer: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function VectorizerTab({
  charInput,
  setCharInput,
  charEffect,
  setCharEffect,
  isConvertingChar,
  onRunVectorizer,
  onCancel,
}: VectorizerTabProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-[#0d0f17] border border-white/[0.12] space-y-5 my-auto">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FiType className="text-cyan-400" />
          Character Vectorizer Engine
        </h3>
        <p className="text-xs text-slate-400">
          Convert any raw typography or words into procedural vector glyph keyframes with physics.
        </p>
      </div>

      <form onSubmit={onRunVectorizer} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-300">Text Characters</label>
          <input
            type="text"
            value={charInput}
            onChange={(e) => setCharInput(e.target.value)}
            placeholder="e.g. ANIMAGENT"
            className="w-full bg-[#12141d] border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white focus:outline-none font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Animation Effect</label>
          <select
            value={charEffect}
            onChange={(e) => setCharEffect(e.target.value as CharEffect)}
            className="w-full bg-[#12141d] border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
          >
            <option value="kinetic_split">Kinetic Split</option>
            <option value="neon_glow">Neon Glow</option>
            <option value="wave">Harmonic Wave</option>
            <option value="glitch">Digital Glitch</option>
            <option value="isometric">3D Isometric</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.04] border border-white/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isConvertingChar}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            {isConvertingChar ? (
              <>
                <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <FiZap className="w-3.5 h-3.5" />
                <span>Vectorize Characters</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
