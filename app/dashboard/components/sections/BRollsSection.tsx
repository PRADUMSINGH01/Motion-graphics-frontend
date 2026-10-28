"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiPlay,
  FiSearch,
  FiArrowRight,
  FiDownload,
  FiRepeat,
  FiSliders,
  FiCheck,
  FiX,
  FiLoader,
  FiFilm,
  FiZap,
} from "react-icons/fi";
import { IconSparkles } from "../../../components/Icons";

interface BRollItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  fps: string;
  resolution: string;
  thumbnail: string;
  prompt: string;
  camera: string;
  tags: string[];
}

const BROLL_ITEMS: BRollItem[] = [
  {
    id: "br-1",
    title: "Liquid Chrome Fluid Morph",
    category: "3D Fluids & Ribbons",
    duration: "4s Loop",
    fps: "60 fps",
    resolution: "4K UHD",
    thumbnail: "/dashboard/template-sphere.jpg",
    prompt: "Seamless liquid mercury fluid simulation with neon lime rim lighting and gloss reflections",
    camera: "Orbit 360° · Macro 85mm",
    tags: ["Fluid", "Chrome", "Glossy"],
  },
  {
    id: "br-2",
    title: "Sneaker Sole Macro Fabric Texture",
    category: "Cinematic Macro",
    duration: "5s Seamless",
    fps: "60 fps",
    resolution: "4K UHD",
    thumbnail: "/dashboard/template-sneaker.jpg",
    prompt: "Ultra macro scan of high-tech woven fabric with electric lime threads and microscopic depth of field",
    camera: "Slow Tracking Pan · F/1.8",
    tags: ["Texture", "Footwear", "Macro"],
  },
  {
    id: "br-3",
    title: "Glacial Canyon Mist Inversion",
    category: "Atmospheric Nature",
    duration: "6s Ambient",
    fps: "30 fps",
    resolution: "4K UHD",
    thumbnail: "/dashboard/project-explainer.jpg",
    prompt: "Hyper-detailed snow canyon ridges with rolling volumetric fog and directional cold rim light",
    camera: "Drone Glide · 24mm Wide",
    tags: ["Mountains", "Fog", "Cold"],
  },
  {
    id: "br-4",
    title: "Neon Metropolis Highway Glares",
    category: "Cyberpunk Metropolis",
    duration: "5s Seamless",
    fps: "60 fps",
    resolution: "4K UHD",
    thumbnail: "/dashboard/project-data.jpg",
    prompt: "Golden hour and twilight skyscraper reflections on water with holographic data streams and speed lines",
    camera: "Low Angle Dolly · Anamorphic",
    tags: ["City", "Skyline", "Data"],
  },
  {
    id: "br-5",
    title: "Holographic Telemetry Orbital Matrix",
    category: "Hologram & Telemetry",
    duration: "4s Loop",
    fps: "60 fps",
    resolution: "4K UHD",
    thumbnail: "/dashboard/template-data.jpg",
    prompt: "Translucent 3D data grid emitting glowing numeric telemetry particles in deep orbital space",
    camera: "Axial Roll · Zero Gravity",
    tags: ["Telemetry", "Charts", "Space"],
  },
  {
    id: "br-6",
    title: "Mountain Ridge Sunset Sunburst",
    category: "Atmospheric Nature",
    duration: "5s Loop",
    fps: "60 fps",
    resolution: "4K UHD",
    thumbnail: "/dashboard/template-hiker.jpg",
    prompt: "Cinematic mountain peak silhouette with volumetric golden sun rays and micro particle dust",
    camera: "Static Tripod · 50mm Prime",
    tags: ["Sunset", "Silhouette", "Sunburst"],
  },
  {
    id: "br-7",
    title: "Smartphone Glass Screen Refraction",
    category: "Cinematic Macro",
    duration: "4s Loop",
    fps: "60 fps",
    resolution: "4K UHD",
    thumbnail: "/dashboard/project-app.jpg",
    prompt: "Warm ambient studio lighting skimming over bevelled phone edge with floating micro particles",
    camera: "Crane Pan · Extreme Macro",
    tags: ["Mobile", "Glass", "Refraction"],
  },
  {
    id: "br-8",
    title: "Volumetric Mountain Peak Lightning",
    category: "Atmospheric Nature",
    duration: "4s Loop",
    fps: "60 fps",
    resolution: "4K UHD",
    thumbnail: "/dashboard/card-greeting-peak.jpg",
    prompt: "Sharp angular 3D geometric mountain crags with vibrant neon lime luminescence along the edges",
    camera: "High Altitude Orbit",
    tags: ["Geometric", "Neon", "Terrain"],
  },
];

const CATEGORIES = [
  "All B-Rolls",
  "Cinematic Macro",
  "3D Fluids & Ribbons",
  "Atmospheric Nature",
  "Cyberpunk Metropolis",
  "Hologram & Telemetry",
];

export default function BRollsSection({ onUseClip }: { onUseClip: (prompt: string) => void }) {
  const [selectedCat, setSelectedCat] = useState("All B-Rolls");
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState<BRollItem | null>(null);

  // Generator state
  const [genPrompt, setGenPrompt] = useState("");
  const [genDuration, setGenDuration] = useState("5s Loop");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState<string | null>(null);

  const filtered = BROLL_ITEMS.filter((item) => {
    if (selectedCat !== "All B-Rolls" && item.category !== selectedCat) return false;
    if (
      search &&
      !item.title.toLowerCase().includes(search.toLowerCase()) &&
      !item.prompt.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenSuccess(`B-Roll loop "${genPrompt.substring(0, 32)}..." rendered in 4K!`);
      setTimeout(() => setGenSuccess(null), 3500);
      setGenPrompt("");
    }, 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
            SEAMLESS CINEMATIC CUTAWAYS
          </span>
        </div>
        <h1 className="mt-1 text-[28px] sm:text-[32px] font-bold text-ink-111110">
          B-Roll Studio & Loop Vault
        </h1>
        <p className="text-[13.5px] text-ink-717069 max-w-2xl">
          Generate photorealistic 4K B-roll loops, textures, and macro cutaways to splice directly into your motion graphics videos.
        </p>
      </div>

      {/* AI B-Roll Generator Box */}
      <div className="rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surf-f2fac2 text-ink-658b02">
              <IconSparkles className="w-4 h-4" />
            </span>
            <h3 className="text-[16px] font-bold text-ink-111110">Generate Custom B-Roll Clip</h3>
          </div>
          <span className="rounded-full bg-surf-faf9f5 border border-surf-eceae3 px-2.5 py-0.5 font-mono text-[11px] text-ink-717069">
            60 FPS · 4K UHD
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder='e.g. "Extreme macro slow-motion camera pan over frosted glass with lime optical flares"'
              className="flex-1 h-11 rounded-2xl border border-surf-dedad0 bg-surf-faf9f5 px-4 text-[13.5px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:bg-surf-ffffff focus:outline-none"
            />

            <select
              value={genDuration}
              onChange={(e) => setGenDuration(e.target.value)}
              className="h-11 rounded-2xl border border-surf-dedad0 bg-surf-ffffff px-3 text-[13px] text-ink-111110 focus:border-surf-111110 focus:outline-none shrink-0"
            >
              <option value="3s Loop">3s Seamless Loop</option>
              <option value="5s Loop">5s Seamless Loop</option>
              <option value="8s Loop">8s Cinematic Loop</option>
            </select>

            <button
              type="submit"
              disabled={isGenerating || !genPrompt.trim()}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-surf-111110 px-6 text-[13px] font-semibold text-white shadow-xs transition hover:bg-surf-272725 disabled:opacity-50 shrink-0"
            >
              {isGenerating ? (
                <>
                  <FiLoader size={15} className="animate-spin text-ink-c5ef26" />
                  <span>Rendering Loop...</span>
                </>
              ) : (
                <>
                  <span>Generate B-Roll</span>
                  <FiArrowRight size={14} className="text-ink-c5ef26" />
                </>
              )}
            </button>
          </div>
        </form>

        {genSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-surf-f2fac2 p-3 text-[13px] font-medium text-ink-658b02">
            <FiCheck size={16} /> {genSuccess}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surf-eceae3 pb-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
                selectedCat === cat
                  ? "bg-surf-111110 text-white shadow-2xs"
                  : "border border-surf-dedad0 bg-surf-ffffff text-ink-55544e hover:border-surf-111110 hover:text-ink-111110"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <FiSearch size={15} className="absolute left-3 top-3 text-ink-8c8980" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search B-rolls..."
            className="w-full h-9 rounded-xl border border-surf-dedad0 bg-surf-ffffff pl-9 pr-3 text-[13px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:outline-none"
          />
        </div>
      </div>

      {/* B-Roll Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group cursor-pointer rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-3 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-surf-111110 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surf-111110">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <span className="absolute bottom-2 left-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] text-white flex items-center gap-1">
                  <FiRepeat size={10} className="text-ink-c5ef26" /> {item.duration}
                </span>
                <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[9.5px] text-white">
                  {item.resolution}
                </span>

                <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surf-ffffff text-ink-111110 shadow-md">
                    <FiPlay size={16} className="ml-0.5 fill-ink-111110" />
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span className="font-mono text-[10.5px] font-medium uppercase text-ink-8c8980">
                  {item.category}
                </span>
                <h3 className="text-[14px] font-semibold text-ink-111110 group-hover:underline">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[12px] text-ink-717069">
                  {item.prompt}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-surf-f2efe6 pt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUseClip(item.prompt);
                }}
                className="flex-1 rounded-xl bg-surf-111110 py-1.5 text-[12px] font-semibold text-white transition hover:bg-surf-272725"
              >
                Insert in Video
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* B-Roll Detail Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
                  {activeItem.category}
                </span>
                <h3 className="mt-1 text-[20px] font-bold text-ink-111110">
                  {activeItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surf-f2efe6 text-ink-717069"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <Image src={activeItem.thumbnail} alt={activeItem.title} fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surf-c5ef26 text-ink-111110 shadow-md">
                  <FiPlay size={20} className="ml-0.5 fill-ink-111110" />
                </span>
              </div>
              <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-0.5 font-mono text-[11px] text-white">
                {activeItem.duration} · {activeItem.fps}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-surf-eceae3 bg-surf-faf9f5 p-3 text-[12.5px] space-y-1">
              <p className="font-semibold text-ink-111110">AI Generation Prompt:</p>
              <p className="text-ink-717069">{activeItem.prompt}</p>
              <p className="font-mono text-[11px] text-ink-8c8980 pt-1">
                Camera Pathway: {activeItem.camera}
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-3 border-t border-surf-f2efe6 pt-4">
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="rounded-xl border border-surf-dedad0 px-4 py-2 text-[12.5px] font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = activeItem.prompt;
                  setActiveItem(null);
                  onUseClip(p);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-surf-111110 px-5 py-2 text-[12.5px] font-semibold text-white hover:bg-surf-272725"
              >
                <span>Add to Studio Timeline</span>
                <FiArrowRight size={13} className="text-ink-c5ef26" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
