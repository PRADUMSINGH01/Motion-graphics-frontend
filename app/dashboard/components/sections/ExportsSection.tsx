"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiDownload,
  FiCheckCircle,
  FiShare2,
  FiFilm,
  FiLoader,
  FiCopy,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";

interface ExportItem {
  id: string;
  title: string;
  project: string;
  res: string;
  format: "MP4" | "ProRes" | "WebM" | "GIF";
  size: string;
  fps: string;
  date: string;
  thumbnail: string;
  downloadUrl: string;
}

const COMPLETED_EXPORTS: ExportItem[] = [
  {
    id: "exp-1",
    title: "Product_Launch_Video_Master_4K.mp4",
    project: "Product Launch Video",
    res: "3840x2160 (4K UHD)",
    format: "MP4",
    size: "84.2 MB",
    fps: "60 fps",
    date: "2 hours ago",
    thumbnail: "/dashboard/project-launch.jpg",
    downloadUrl: "#",
  },
  {
    id: "exp-2",
    title: "App_Promo_Vertical_Reel_1080p.mp4",
    project: "App Promo",
    res: "1080x1920 (9:16)",
    format: "MP4",
    size: "42.1 MB",
    fps: "60 fps",
    date: "Yesterday",
    thumbnail: "/dashboard/project-app.jpg",
    downloadUrl: "#",
  },
  {
    id: "exp-3",
    title: "Velocity_Sneaker_ProRes422HQ.mov",
    project: "Velocity Kinetic Sneaker",
    res: "3840x2160 (4K UHD)",
    format: "ProRes",
    size: "420.8 MB",
    fps: "60 fps",
    date: "3 days ago",
    thumbnail: "/dashboard/template-sneaker.jpg",
    downloadUrl: "#",
  },
  {
    id: "exp-4",
    title: "Data_Story_Presentation_HD.mp4",
    project: "Data Story",
    res: "1920x1080 (16:9)",
    format: "MP4",
    size: "56.4 MB",
    fps: "30 fps",
    date: "5 days ago",
    thumbnail: "/dashboard/project-data.jpg",
    downloadUrl: "#",
  },
];

export default function ExportsSection() {
  const [activeQueue, setActiveQueue] = useState([
    {
      id: "q-1",
      title: "Canyon_Valleys_Flythrough_Master.mp4",
      progress: 68,
      fps: "58.4 fps",
      eta: "42s remaining",
    },
  ]);

  const [shareModalItem, setShareModalItem] = useState<ExportItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (item: ExportItem) => {
    setDownloadSuccess(`Downloading ${item.title}...`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const copyShareLink = () => {
    navigator.clipboard?.writeText("https://byreel.io/share/v/exp-4k-720194");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
            RENDER DISPATCHER
          </span>
        </div>
        <h1 className="mt-1 text-[28px] font-bold text-ink-111110">Exports & Renders</h1>
        <p className="text-[13.5px] text-ink-717069">
          Download 4K ProRes masters, web-ready MP4s, and manage your distribution queue.
        </p>
      </div>

      {downloadSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-surf-f2fac2 p-4 text-[13.5px] font-medium text-ink-658b02">
          <FiCheck size={16} /> {downloadSuccess}
        </div>
      )}

      {/* Active Rendering Queue */}
      {activeQueue.length > 0 && (
        <section className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[14px] font-bold text-ink-111110">
              <FiLoader className="animate-spin text-ink-c5ef26" /> Active Render Queue (
              {activeQueue.length})
            </h2>
            <span className="font-mono text-[11.5px] text-ink-717069">NVIDIA H100 GPU Farm</span>
          </div>

          <div className="mt-4 space-y-3">
            {activeQueue.map((q) => (
              <div key={q.id} className="rounded-xl border border-surf-eceae3 bg-surf-faf9f5 p-3.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-ink-111110">{q.title}</span>
                  <span className="font-mono text-[11px] text-ink-658b02">
                    {q.fps} · {q.eta}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surf-e5e2d8">
                    <div
                      className="h-full rounded-full bg-surf-c5ef26 transition-all duration-300"
                      style={{ width: `${q.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11.5px] font-semibold text-ink-111110">
                    {q.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Exports */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-ink-111110">Completed Exports</h2>
          <span className="text-[12.5px] text-ink-717069">{COMPLETED_EXPORTS.length} files</span>
        </div>

        <div className="space-y-3">
          {COMPLETED_EXPORTS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-4 shadow-2xs hover:border-surf-111110 transition"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-surf-111110">
                  <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 font-mono text-[9px] text-white">
                    {item.format}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[14px] font-semibold text-ink-111110">
                      {item.title}
                    </h3>
                    <span className="rounded-full bg-surf-f2fac2 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-658b02">
                      Ready
                    </span>
                  </div>
                  <p className="text-[12px] text-ink-717069 mt-0.5">
                    {item.res} • {item.fps} • {item.size} • Exported {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShareModalItem(item)}
                  className="flex items-center gap-1.5 rounded-xl border border-surf-dedad0 bg-surf-faf9f5 px-3.5 py-2 text-[12.5px] font-medium text-ink-111110 hover:bg-surf-f2efe6 transition"
                >
                  <FiShare2 size={14} /> Share
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  className="flex items-center gap-1.5 rounded-xl bg-surf-111110 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-surf-272725 transition shadow-xs"
                >
                  <FiDownload size={14} className="text-ink-c5ef26" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Share Modal */}
      {shareModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setShareModalItem(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[17px] font-bold text-ink-111110">Share Video Render</h3>
                <p className="text-[12.5px] text-ink-717069 mt-0.5 truncate max-w-xs">
                  {shareModalItem.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareModalItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surf-f2efe6 text-ink-717069"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-surf-dedad0 bg-surf-faf9f5 p-3 flex items-center justify-between">
              <span className="font-mono text-[12px] text-ink-55544e truncate pr-2">
                https://byreel.io/share/v/{shareModalItem.id}
              </span>
              <button
                type="button"
                onClick={copyShareLink}
                className="flex items-center gap-1 rounded-lg bg-surf-111110 px-2.5 py-1 text-[11px] font-semibold text-white shrink-0"
              >
                {copied ? <FiCheck size={11} className="text-ink-c5ef26" /> : <FiCopy size={11} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShareModalItem(null)}
                className="rounded-xl border border-surf-dedad0 px-4 py-2 text-[12.5px] font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
