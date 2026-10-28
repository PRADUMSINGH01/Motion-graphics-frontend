"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiPlay,
  FiSearch,
  FiShare2,
  FiDownload,
  FiEye,
  FiCode,
  FiCheck,
  FiX,
  FiClock,
  FiTrendingUp,
  FiHardDrive,
  FiVideo,
  FiExternalLink,
} from "react-icons/fi";

interface VideoPortfolioItem {
  id: string;
  title: string;
  thumbnail: string;
  timecode: string;
  duration: string;
  ratio: "16:9" | "9:16" | "1:1";
  views: string;
  completionRate: string;
  status: "Published" | "Scheduled" | "Draft";
  createdAt: string;
}

const PORTFOLIO_VIDEOS: VideoPortfolioItem[] = [
  {
    id: "v-1",
    title: "Velocity Kinetic Sneaker Commercial",
    thumbnail: "/dashboard/template-sneaker.jpg",
    timecode: "00:30",
    duration: "30s",
    ratio: "16:9",
    views: "18.4K",
    completionRate: "89.2%",
    status: "Published",
    createdAt: "2 days ago",
  },
  {
    id: "v-2",
    title: "Mobile Banking Glassmorphism Reel",
    thumbnail: "/dashboard/project-app.jpg",
    timecode: "00:15",
    duration: "15s",
    ratio: "9:16",
    views: "42.1K",
    completionRate: "93.5%",
    status: "Published",
    createdAt: "4 days ago",
  },
  {
    id: "v-3",
    title: "A Bigger Tomorrow Brand Film",
    thumbnail: "/dashboard/template-hiker.jpg",
    timecode: "00:45",
    duration: "45s",
    ratio: "16:9",
    views: "8.9K",
    completionRate: "78.4%",
    status: "Published",
    createdAt: "1 week ago",
  },
  {
    id: "v-4",
    title: "Global FinTelemetry Real-Time Scan",
    thumbnail: "/dashboard/template-data.jpg",
    timecode: "00:20",
    duration: "20s",
    ratio: "16:9",
    views: "12.3K",
    completionRate: "82.1%",
    status: "Published",
    createdAt: "2 weeks ago",
  },
  {
    id: "v-5",
    title: "Organic Foliage Ambient Portrait",
    thumbnail: "/dashboard/template-portrait.jpg",
    timecode: "00:15",
    duration: "15s",
    ratio: "9:16",
    views: "29.7K",
    completionRate: "91.8%",
    status: "Published",
    createdAt: "2 weeks ago",
  },
  {
    id: "v-6",
    title: "Fluid Chrome Physics Concept",
    thumbnail: "/dashboard/template-sphere.jpg",
    timecode: "00:25",
    duration: "25s",
    ratio: "16:9",
    views: "15.6K",
    completionRate: "86.0%",
    status: "Scheduled",
    createdAt: "3 weeks ago",
  },
];

export default function YourVideosSection({ onOpenStudio }: { onOpenStudio: (title: string) => void }) {
  const [tab, setTab] = useState<"All" | "Published" | "Scheduled" | "Draft">("All");
  const [ratioFilter, setRatioFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [activeVideo, setActiveVideo] = useState<VideoPortfolioItem | null>(null);
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const filtered = PORTFOLIO_VIDEOS.filter((v) => {
    if (tab !== "All" && v.status !== tab) return false;
    if (ratioFilter !== "All" && v.ratio !== ratioFilter) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const copyEmbed = (id: string) => {
    const code = `<iframe src="https://byreel.io/embed/${id}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard?.writeText(code);
    setEmbedCodeCopied(true);
    setTimeout(() => setEmbedCodeCopied(false), 2000);
  };

  const handlePublish = (platform: string) => {
    setPublishMessage(`Direct export dispatched to ${platform}!`);
    setTimeout(() => setPublishMessage(null), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
            PORTFOLIO & ANALYTICS
          </span>
        </div>
        <h1 className="mt-1 text-[28px] sm:text-[34px] font-bold text-ink-111110">
          Your Videos
        </h1>
        <p className="text-[13.5px] text-ink-717069">
          Manage your published motion renders, view audience retention metrics, and export directly to social feeds.
        </p>
      </div>

      {publishMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-surf-f2fac2 p-3 text-[13px] font-medium text-ink-658b02">
          <FiCheck size={16} /> {publishMessage}
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase text-ink-8c8980">Total Renders</span>
            <FiVideo size={16} className="text-ink-658b02" />
          </div>
          <p className="mt-2 text-[28px] font-bold text-ink-111110 leading-none">14</p>
          <span className="mt-1 block text-[11.5px] text-ink-717069">4K ProRes masters</span>
        </div>

        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase text-ink-8c8980">Cumulative Views</span>
            <FiEye size={16} className="text-ink-658b02" />
          </div>
          <p className="mt-2 text-[28px] font-bold text-ink-111110 leading-none">126.9K</p>
          <span className="mt-1 block text-[11.5px] text-ink-658b02 font-medium">↑ +18.4% this month</span>
        </div>

        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase text-ink-8c8980">Avg. Completion</span>
            <FiTrendingUp size={16} className="text-ink-658b02" />
          </div>
          <p className="mt-2 text-[28px] font-bold text-ink-111110 leading-none">87.4%</p>
          <span className="mt-1 block text-[11.5px] text-ink-717069">High retention hook</span>
        </div>

        <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase text-ink-8c8980">Cloud Vault</span>
            <FiHardDrive size={16} className="text-ink-658b02" />
          </div>
          <p className="mt-2 text-[28px] font-bold text-ink-111110 leading-none">3.2 GB</p>
          <span className="mt-1 block text-[11.5px] text-ink-717069">of 10.0 GB storage used</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surf-eceae3 pb-4">
        {/* Status Tabs */}
        <div className="flex gap-1.5">
          {(["All", "Published", "Scheduled", "Draft"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition ${
                tab === t
                  ? "bg-surf-111110 text-white shadow-2xs"
                  : "text-ink-717069 hover:text-ink-111110"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Format selector */}
          <div className="flex items-center rounded-xl border border-surf-dedad0 bg-surf-ffffff p-1">
            {["All", "16:9", "9:16", "1:1"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRatioFilter(r)}
                className={`rounded-lg px-2.5 py-1 text-[11.5px] font-medium transition ${
                  ratioFilter === r ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"
                }`}
              >
                {r === "All" ? "All Formats" : r}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <FiSearch size={15} className="absolute left-3 top-3 text-ink-8c8980" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter videos..."
              className="w-full h-9 rounded-xl border border-surf-dedad0 bg-surf-ffffff pl-9 pr-3 text-[13px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group cursor-pointer rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-surf-111110 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surf-111110">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white">
                  {video.timecode} · {video.ratio}
                </span>
                <span className="absolute top-2 right-2 rounded-full bg-surf-f2fac2 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-658b02">
                  {video.status}
                </span>

                <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition group-hover:opacity-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surf-ffffff text-ink-111110 shadow-md">
                    <FiPlay size={18} className="ml-0.5 fill-ink-111110" />
                  </span>
                </div>
              </div>

              <div className="mt-3.5 px-1">
                <h3 className="text-[15px] font-semibold text-ink-111110 group-hover:underline truncate">
                  {video.title}
                </h3>
                <p className="text-[12px] text-ink-8c8980 mt-0.5">
                  Published {video.createdAt}
                </p>

                {/* Metrics */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-surf-faf9f5 border border-surf-eceae3 p-2 text-[11.5px]">
                  <div>
                    <span className="text-ink-8c8980">Views</span>
                    <p className="font-bold text-ink-111110">{video.views}</p>
                  </div>
                  <div>
                    <span className="text-ink-8c8980">Completion</span>
                    <p className="font-bold text-ink-658b02">{video.completionRate}</p>
                  </div>
                  <div>
                    <span className="text-ink-8c8980">Quality</span>
                    <p className="font-mono font-bold text-ink-111110">4K UHD</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-surf-f2efe6 pt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStudio(video.title);
                }}
                className="flex-1 rounded-xl bg-surf-111110 py-2 text-[12px] font-semibold text-white transition hover:bg-surf-272725"
              >
                Open in Studio
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Full Player & Distribution Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
                  {activeVideo.status}
                </span>
                <h3 className="mt-1 text-[20px] font-bold text-ink-111110">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surf-f2efe6 text-ink-717069"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <Image src={activeVideo.thumbnail} alt={activeVideo.title} fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surf-c5ef26 text-ink-111110 shadow-lg">
                  <FiPlay size={22} className="ml-1 fill-ink-111110" />
                </span>
              </div>
              <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-0.5 font-mono text-[11px] text-white">
                {activeVideo.timecode} · {activeVideo.ratio}
              </span>
            </div>

            {/* Direct Publishing Buttons */}
            <div className="mt-5 space-y-2">
              <h4 className="text-[13px] font-bold text-ink-111110">Direct Social Publish</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: "TikTok", icon: "🎵" },
                  { name: "YouTube Shorts", icon: "▶️" },
                  { name: "Instagram Reels", icon: "📸" },
                  { name: "LinkedIn Video", icon: "💼" },
                ].map((plat) => (
                  <button
                    key={plat.name}
                    type="button"
                    onClick={() => handlePublish(plat.name)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-surf-dedad0 bg-surf-faf9f5 py-2 text-[12px] font-semibold text-ink-111110 hover:bg-surf-f2efe6"
                  >
                    <span>{plat.icon}</span>
                    <span>{plat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Embed Code Snippet */}
            <div className="mt-4 rounded-xl border border-surf-dedad0 bg-surf-faf9f5 p-3 flex items-center justify-between">
              <span className="font-mono text-[11.5px] text-ink-717069 truncate pr-2">
                &lt;iframe src=&quot;https://byreel.io/embed/{activeVideo.id}&quot; ... /&gt;
              </span>
              <button
                type="button"
                onClick={() => copyEmbed(activeVideo.id)}
                className="flex items-center gap-1 rounded-lg bg-surf-111110 px-2.5 py-1 text-[11px] font-semibold text-white shrink-0"
              >
                {embedCodeCopied ? <FiCheck size={11} className="text-ink-c5ef26" /> : <FiCode size={11} />}
                <span>{embedCodeCopied ? "Copied" : "Copy Embed"}</span>
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-3 border-t border-surf-f2efe6 pt-4">
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-xl border border-surf-dedad0 px-4 py-2 text-[12.5px] font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const t = activeVideo.title;
                  setActiveVideo(null);
                  onOpenStudio(t);
                }}
                className="rounded-xl bg-surf-111110 px-5 py-2 text-[12.5px] font-semibold text-white hover:bg-surf-272725"
              >
                Edit in Motion Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
