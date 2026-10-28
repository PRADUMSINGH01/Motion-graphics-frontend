"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  FiUploadCloud,
  FiPlay,
  FiTrash2,
  FiDownload,
  FiSearch,
  FiImage,
  FiVideo,
  FiMusic,
  FiLayers,
  FiPlus,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { type Chat, collectVideos } from "../../lib/chatStore";

interface MediaSectionProps {
  chats: Chat[];
  onOpenLaunch: (chatId: string) => void;
  onNewLaunch: () => void;
}

interface MediaFile {
  id: string;
  name: string;
  kind: "video" | "image" | "audio" | "model";
  url: string;
  size: string;
  dimensions?: string;
  createdAt: string;
}

const SEED_MEDIA: MediaFile[] = [
  {
    id: "m-1",
    name: "Product_Launch_Hero_Turntable.mp4",
    kind: "video",
    url: "/dashboard/project-launch.jpg",
    size: "42.8 MB",
    dimensions: "3840x2160 (4K)",
    createdAt: "2 hours ago",
  },
  {
    id: "m-2",
    name: "Byreel_Official_Logo_Vector.png",
    kind: "image",
    url: "/byreel-logo.png",
    size: "140 KB",
    dimensions: "1024x341",
    createdAt: "Yesterday",
  },
  {
    id: "m-3",
    name: "Byreel_3D_Ribbon_Mark.png",
    kind: "image",
    url: "/byreel-mark.png",
    size: "53 KB",
    dimensions: "512x512",
    createdAt: "2 days ago",
  },
  {
    id: "m-4",
    name: "Kinetic_Electronic_Soundtrack.mp3",
    kind: "audio",
    url: "",
    size: "6.2 MB",
    dimensions: "01:45 • 320kbps",
    createdAt: "3 days ago",
  },
  {
    id: "m-5",
    name: "Sneaker_Sole_HighPoly.gltf",
    kind: "model",
    url: "/dashboard/template-sneaker.jpg",
    size: "18.4 MB",
    dimensions: "3D Mesh (94k polys)",
    createdAt: "4 days ago",
  },
  {
    id: "m-6",
    name: "App_Promo_Reel_Cut.mp4",
    kind: "video",
    url: "/dashboard/project-app.jpg",
    size: "31.2 MB",
    dimensions: "1080x1920 (9:16)",
    createdAt: "5 days ago",
  },
];

export default function MediaSection({ chats, onOpenLaunch, onNewLaunch }: MediaSectionProps) {
  const [tab, setTab] = useState<"all" | "video" | "image" | "audio" | "model">("all");
  const [query, setQuery] = useState("");
  const [mediaList, setMediaList] = useState<MediaFile[]>(SEED_MEDIA);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = mediaList.filter((m) => {
    if (tab !== "all" && m.kind !== tab) return false;
    if (query && !m.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: MediaFile[] = [];

    Array.from(files).forEach((file, idx) => {
      let kind: MediaFile["kind"] = "image";
      if (file.type.startsWith("video/")) kind = "video";
      else if (file.type.startsWith("audio/")) kind = "audio";
      else if (file.name.endsWith(".gltf") || file.name.endsWith(".glb")) kind = "model";

      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const url = URL.createObjectURL(file);

      newItems.push({
        id: `upl-${Date.now()}-${idx}`,
        name: file.name,
        kind,
        url,
        size: sizeStr,
        dimensions: kind === "video" ? "1080p FHD" : "Custom File",
        createdAt: "Just now",
      });
    });

    setMediaList((prev) => [...newItems, ...prev]);
    setUploadNotice(`Uploaded ${newItems.length} file(s) successfully!`);
    setTimeout(() => setUploadNotice(null), 3000);
  };

  const handleDelete = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
              ASSET STORAGE
            </span>
          </div>
          <h1 className="mt-1 text-[28px] font-bold text-ink-111110">Media Library</h1>
          <p className="text-[13.5px] text-ink-717069">
            Store background footage, logos, audio stems, and 3D models for your motion graphics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <FiSearch size={15} className="absolute left-3 top-3 text-ink-8c8980" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media..."
              className="w-full h-10 rounded-xl border border-surf-dedad0 bg-surf-ffffff pl-9 pr-3 text-[13px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:outline-none"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 h-10 rounded-xl bg-surf-111110 px-4 text-[13px] font-semibold text-white shadow-xs transition hover:bg-surf-272725 shrink-0"
          >
            <FiUploadCloud size={16} /> Upload Media
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-surf-f2fac2 p-3 text-[13px] font-medium text-ink-658b02">
          <FiCheck size={16} /> {uploadNotice}
        </div>
      )}

      {/* Drag & Drop Upload Banner */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-surf-dedad0 bg-surf-ffffff p-6 text-center transition hover:border-surf-111110 hover:bg-surf-faf9f5"
      >
        <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-surf-f2fac2 text-ink-658b02">
          <FiUploadCloud size={24} />
        </span>
        <h3 className="mt-2 text-[14.5px] font-semibold text-ink-111110">
          Drop media files here or click to browse
        </h3>
        <p className="mt-0.5 text-[12px] text-ink-717069">
          Supports MP4, MOV, PNG, JPG, SVG, MP3, WAV, and GLTF/GLB models up to 500 MB.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-surf-eceae3 pb-3">
        {[
          { id: "all", label: "All Media", count: mediaList.length },
          { id: "video", label: "Videos", count: mediaList.filter((m) => m.kind === "video").length },
          { id: "image", label: "Images & Logos", count: mediaList.filter((m) => m.kind === "image").length },
          { id: "audio", label: "Audio Stems", count: mediaList.filter((m) => m.kind === "audio").length },
          { id: "model", label: "3D Assets", count: mediaList.filter((m) => m.kind === "model").length },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1 text-[12.5px] font-medium transition ${
              tab === t.id
                ? "bg-surf-111110 text-white"
                : "text-ink-717069 hover:text-ink-111110"
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 font-mono text-[10.5px] ${
                tab === t.id ? "bg-white/20 text-white" : "bg-surf-f2efe6 text-ink-717069"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Media Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setPreviewMedia(item)}
            className="group cursor-pointer rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-2.5 shadow-2xs hover:border-surf-111110 hover:shadow-sm transition flex flex-col justify-between"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surf-111110 flex items-center justify-center">
              {item.url && item.kind !== "audio" ? (
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              ) : item.kind === "audio" ? (
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surf-f2fac2 text-ink-658b02">
                  <FiMusic size={24} />
                </span>
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surf-faf9f5 text-ink-8c8980">
                  <FiLayers size={24} />
                </span>
              )}

              {item.kind === "video" && (
                <span className="absolute bottom-2 left-2 rounded bg-black/75 p-1 text-white">
                  <FiPlay size={10} />
                </span>
              )}
            </div>

            <div className="mt-2.5">
              <h4 className="truncate text-[12.5px] font-semibold text-ink-111110 group-hover:underline">
                {item.name}
              </h4>
              <p className="text-[11px] text-ink-8c8980 truncate">
                {item.size} · {item.dimensions}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-surf-f2efe6 pt-2">
              <span className="font-mono text-[10px] text-ink-8c8980">{item.createdAt}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="text-ink-8c8980 hover:text-ink-dc2626 p-1"
                title="Delete file"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-ink-658b02">
                  {previewMedia.kind}
                </span>
                <h3 className="mt-1 text-[18px] font-bold text-ink-111110 truncate max-w-sm">
                  {previewMedia.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surf-f2efe6 text-ink-717069"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center">
              {previewMedia.url && previewMedia.kind !== "audio" ? (
                <Image src={previewMedia.url} alt={previewMedia.name} fill className="object-contain" />
              ) : (
                <FiMusic size={48} className="text-ink-c5ef26" />
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-surf-f2efe6 pt-3 text-[12px]">
              <div>
                <span className="text-ink-8c8980">File Size</span>
                <p className="font-semibold text-ink-111110">{previewMedia.size}</p>
              </div>
              <div>
                <span className="text-ink-8c8980">Dimensions</span>
                <p className="font-semibold text-ink-111110">{previewMedia.dimensions}</p>
              </div>
              <div>
                <span className="text-ink-8c8980">Uploaded</span>
                <p className="font-semibold text-ink-111110">{previewMedia.createdAt}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-surf-f2efe6 pt-4">
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="rounded-xl border border-surf-dedad0 px-4 py-2 text-[12.5px] font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewMedia(null);
                  onNewLaunch();
                }}
                className="rounded-xl bg-surf-111110 px-4 py-2 text-[12.5px] font-semibold text-white"
              >
                Use in Motion Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
