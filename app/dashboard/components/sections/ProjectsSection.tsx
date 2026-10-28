"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiPlus,
  FiSearch,
  FiMoreHorizontal,
  FiPlay,
  FiTrash2,
  FiEdit2,
  FiExternalLink,
  FiGrid,
  FiList,
  FiDownload,
  FiCopy,
  FiCheck,
  FiX,
} from "react-icons/fi";
import type { Chat } from "../../lib/chatStore";

interface ProjectsSectionProps {
  chats: Chat[];
  onOpenLaunch: (chatId: string) => void;
  onNewLaunch: () => void;
  onDeleteChat: (chatId: string) => void;
}

interface ProjectData {
  id: string;
  title: string;
  timecode: string;
  updatedAt: string;
  thumbnail: string;
  status: "Completed" | "Draft" | "Rendering";
  ratio: string;
}

const STATIC_PROJECTS: ProjectData[] = [
  {
    id: "sp-1",
    title: "Product Launch Video",
    timecode: "00:32",
    updatedAt: "2 hours ago",
    thumbnail: "/dashboard/project-launch.jpg",
    status: "Completed",
    ratio: "16:9",
  },
  {
    id: "sp-2",
    title: "App Promo",
    timecode: "00:28",
    updatedAt: "1 day ago",
    thumbnail: "/dashboard/project-app.jpg",
    status: "Completed",
    ratio: "9:16",
  },
  {
    id: "sp-3",
    title: "Explainer Video",
    timecode: "01:12",
    updatedAt: "3 days ago",
    thumbnail: "/dashboard/project-explainer.jpg",
    status: "Draft",
    ratio: "16:9",
  },
  {
    id: "sp-4",
    title: "Data Story",
    timecode: "00:45",
    updatedAt: "5 days ago",
    thumbnail: "/dashboard/project-data.jpg",
    status: "Completed",
    ratio: "16:9",
  },
];

export default function ProjectsSection({
  chats,
  onOpenLaunch,
  onNewLaunch,
  onDeleteChat,
}: ProjectsSectionProps) {
  const [tab, setTab] = useState<"All" | "Completed" | "Draft" | "Rendering">("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Rename Dialog State
  const [renamingProject, setRenamingProject] = useState<ProjectData | null>(null);
  const [newTitle, setNewTitle] = useState("");

  // Combine user real chats and static showcase projects
  const [projectsList, setProjectsList] = useState<ProjectData[]>(() => {
    const fromChats: ProjectData[] = chats.map((c) => ({
      id: c.id,
      title: c.title,
      timecode: "00:30",
      updatedAt: new Date(c.updatedAt).toLocaleDateString(),
      thumbnail: "/dashboard/project-launch.jpg",
      status: c.messages.some((m) => m.isStreaming)
        ? "Rendering"
        : c.messages.some((m) => m.preview)
        ? "Completed"
        : "Draft",
      ratio: "16:9",
    }));
    return [...fromChats, ...STATIC_PROJECTS];
  });

  const filtered = projectsList.filter((p) => {
    if (tab !== "All" && p.status !== tab) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
    onDeleteChat(id);
    setActiveMenuId(null);
  };

  const handleDuplicate = (p: ProjectData) => {
    const copy: ProjectData = {
      ...p,
      id: `copy-${Date.now()}`,
      title: `${p.title} (Copy)`,
      updatedAt: "Just now",
    };
    setProjectsList((prev) => [copy, ...prev]);
    setActiveMenuId(null);
  };

  const handleSaveRename = () => {
    if (renamingProject && newTitle.trim()) {
      setProjectsList((prev) =>
        prev.map((p) => (p.id === renamingProject.id ? { ...p, title: newTitle.trim() } : p))
      );
    }
    setRenamingProject(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
              PROJECTS VAULT
            </span>
          </div>
          <h1 className="mt-1 text-[28px] font-bold text-ink-111110">Projects</h1>
          <p className="text-[13.5px] text-ink-717069">
            Organize, edit, duplicate, and export your motion graphic compositions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <FiSearch size={15} className="absolute left-3 top-3 text-ink-8c8980" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter projects..."
              className="w-full h-10 rounded-xl border border-surf-dedad0 bg-surf-ffffff pl-9 pr-3 text-[13px] text-ink-111110 placeholder-ink-9c9990 focus:border-surf-111110 focus:outline-none"
            />
          </div>

          {/* New Project CTA */}
          <button
            type="button"
            onClick={onNewLaunch}
            className="flex items-center gap-1.5 h-10 rounded-xl bg-surf-111110 px-4 text-[13px] font-semibold text-white shadow-xs transition hover:bg-surf-272725 shrink-0"
          >
            <FiPlus size={15} /> New Project
          </button>
        </div>
      </div>

      {/* Control Bar: Tabs + View Mode Toggle */}
      <div className="flex items-center justify-between border-b border-surf-eceae3 pb-3">
        {/* Tabs */}
        <div className="flex gap-1.5">
          {(["All", "Completed", "Draft", "Rendering"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-3.5 py-1 text-[12.5px] font-medium transition ${
                tab === t
                  ? "bg-surf-111110 text-white"
                  : "text-ink-717069 hover:text-ink-111110"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-xl border border-surf-dedad0 bg-surf-ffffff p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition ${
              viewMode === "grid" ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"
            }`}
            title="Grid view"
          >
            <FiGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition ${
              viewMode === "list" ? "bg-surf-111110 text-white" : "text-ink-717069 hover:text-ink-111110"
            }`}
            title="List view"
          >
            <FiList size={15} />
          </button>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-3 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-surf-111110 hover:shadow-md"
            >
              <div>
                <div
                  onClick={() => onOpenLaunch(proj.id)}
                  className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-surf-111110"
                >
                  <Image
                    src={proj.thumbnail}
                    alt={proj.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-white">
                    {proj.timecode}
                  </span>
                  <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                    {proj.ratio}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surf-ffffff text-ink-111110 shadow-md">
                      <FiPlay size={14} className="ml-0.5 fill-ink-111110" />
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <div
                    onClick={() => onOpenLaunch(proj.id)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <h3 className="truncate text-[14px] font-semibold text-ink-111110 group-hover:underline">
                      {proj.title}
                    </h3>
                    <p className="text-[11.5px] text-ink-8c8980">
                      {proj.updatedAt} · <span className="font-medium text-ink-111110">{proj.status}</span>
                    </p>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(activeMenuId === proj.id ? null : proj.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-8c8980 hover:bg-surf-f2efe6 hover:text-ink-111110"
                    >
                      <FiMoreHorizontal size={15} />
                    </button>

                    {activeMenuId === proj.id && (
                      <div className="absolute right-0 top-full z-30 mt-1 w-36 overflow-hidden rounded-xl border border-surf-dedad0 bg-surf-ffffff py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onOpenLaunch(proj.id);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] font-medium text-ink-2d2c28 hover:bg-surf-f7f6f0"
                        >
                          <FiExternalLink size={13} /> Open Studio
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            setRenamingProject(proj);
                            setNewTitle(proj.title);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] font-medium text-ink-2d2c28 hover:bg-surf-f7f6f0"
                        >
                          <FiEdit2 size={13} /> Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(proj)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] font-medium text-ink-2d2c28 hover:bg-surf-f7f6f0"
                        >
                          <FiCopy size={13} /> Duplicate
                        </button>
                        <div className="my-1 border-t border-surf-f2efe6" />
                        <button
                          type="button"
                          onClick={() => handleDelete(proj.id)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] font-medium text-ink-dc2626 hover:bg-red-50"
                        >
                          <FiTrash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-hidden rounded-2xl border border-surf-dedad0 bg-surf-ffffff shadow-2xs divide-y divide-surf-f2efe6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="flex items-center justify-between p-4 hover:bg-surf-faf9f5 transition"
            >
              <div
                onClick={() => onOpenLaunch(proj.id)}
                className="flex items-center gap-4 cursor-pointer min-w-0"
              >
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-surf-111110">
                  <Image src={proj.thumbnail} alt={proj.title} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-[14px] font-semibold text-ink-111110">{proj.title}</h4>
                  <p className="text-[12px] text-ink-717069">
                    {proj.timecode} · {proj.ratio} · Edited {proj.updatedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-surf-f2efe6 px-2.5 py-0.5 font-mono text-[11px] text-ink-55544e">
                  {proj.status}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenLaunch(proj.id)}
                  className="rounded-lg border border-surf-dedad0 px-3 py-1.5 text-[12px] font-medium text-ink-111110 hover:bg-surf-f2efe6"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 text-ink-8c8980 hover:text-ink-dc2626"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rename Dialog */}
      {renamingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setRenamingProject(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[17px] font-bold text-ink-111110">Rename Project</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mt-4 w-full h-10 rounded-xl border border-surf-dedad0 px-3 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenamingProject(null)}
                className="rounded-xl border border-surf-dedad0 px-4 py-2 text-[12.5px] font-medium text-ink-55544e"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRename}
                className="rounded-xl bg-surf-111110 px-4 py-2 text-[12.5px] font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
