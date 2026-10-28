"use client";

import { useRef, useState } from "react";
import { FiUploadCloud, FiLink, FiTrash2, FiImage, FiVideo, FiMusic, FiType, FiFile } from "react-icons/fi";
import type { IconType } from "react-icons";
import {
  type Asset,
  type AssetKind,
  createAssetId,
  fileToAsset,
  formatBytes,
  kindFromType,
  loadAssets,
  saveAssets,
} from "../../lib/assets";

const KIND_ICON: Record<AssetKind, IconType> = {
  image: FiImage,
  video: FiVideo,
  audio: FiMusic,
  font: FiType,
  other: FiFile,
};

const shortDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export default function AssetsSection({ userId }: { userId: string }) {
  const [assets, setAssets] = useState<Asset[]>(() => loadAssets(userId));
  const [urlOpen, setUrlOpen] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const persist = (next: Asset[]) => {
    setAssets(next);
    if (!saveAssets(userId, next)) {
      setNotice("Your browser storage is full, so this asset is only kept for now. Remove a few to save space.");
    }
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setNotice(null);
    const added = await Promise.all(Array.from(files).map(fileToAsset));
    persist([...added, ...assets]);
  };

  const addByUrl = () => {
    const url = urlValue.trim();
    if (!url) return;
    let name = url;
    try {
      name = decodeURIComponent(new URL(url).pathname.split("/").filter(Boolean).pop() || url);
    } catch {
      /* keep raw */
    }
    const asset: Asset = {
      id: createAssetId(),
      name,
      kind: kindFromType("", name),
      size: 0,
      sourceUrl: url,
      createdAt: new Date().toISOString(),
    };
    persist([asset, ...assets]);
    setUrlValue("");
    setUrlOpen(false);
  };

  const remove = (id: string) => persist(assets.filter((a) => a.id !== id));

  const preview = (a: Asset) => a.previewDataUrl ?? (a.kind === "image" ? a.sourceUrl : undefined);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-16 pt-10">
      <header className="db-rise mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="db-eyebrow mb-2">Assets</p>
          <h1 className="db-serif text-[38px] leading-[1] tracking-[-0.02em] sm:text-[48px]">Your assets</h1>
          <p className="mt-2 max-w-xl text-[14.5px] text-[var(--db-muted)]">
            Logos, footage, stills and audio for your videos. Stored in this browser; connect a workspace to sync across devices.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setUrlOpen((v) => !v)} className="db-btn-ghost">
            <FiLink size={13} /> Add by URL
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="db-btn">
            <FiUploadCloud size={15} /> Upload
          </button>
          <input ref={fileRef} type="file" multiple hidden onChange={(e) => onFiles(e.target.files)} aria-hidden="true" />
        </div>
      </header>

      {urlOpen && (
        <div className="db-card db-card-pad mb-6 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="db-field-label" htmlFor="asset-url">
              Asset URL
            </label>
            <input
              id="asset-url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addByUrl()}
              placeholder="https://…/logo.svg"
              className="db-input"
            />
          </div>
          <button type="button" onClick={addByUrl} className="db-btn">
            Add asset
          </button>
        </div>
      )}

      {notice && (
        <p className="mb-5 rounded-lg border-l-2 border-[var(--db-accent)] bg-[rgba(194,65,12,0.06)] px-3 py-2 text-[13px] text-[var(--db-accent)]">
          {notice}
        </p>
      )}

      {assets.length === 0 ? (
        <div
          className="db-card flex flex-col items-center justify-center rounded-xl border-dashed py-16 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFiles(e.dataTransfer.files);
          }}
        >
          <FiUploadCloud size={28} className="text-[var(--db-faint)]" />
          <p className="db-serif mt-3 text-[22px]">Drop files here</p>
          <p className="mt-1 text-[13.5px] text-[var(--db-muted)]">or use Upload. Images preview inline; other files are tracked by name.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => {
            const Icon = KIND_ICON[a.kind];
            const src = preview(a);
            return (
              <li key={a.id} className="db-card group overflow-hidden">
                <div className="relative flex aspect-[4/3] items-center justify-center bg-[var(--db-paper)]">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={a.name} className="h-full w-full object-cover" />
                  ) : (
                    <Icon size={26} className="text-[var(--db-faint)]" />
                  )}
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    aria-label={`Remove ${a.name}`}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--db-white)] text-[var(--db-muted)] opacity-0 shadow-sm transition-opacity hover:text-[var(--db-accent)] group-hover:opacity-100"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="truncate text-[13px] font-medium" title={a.name}>
                    {a.name}
                  </p>
                  <p className="db-label mt-1 !text-[10px] !text-[var(--db-faint)]">
                    {a.kind} · {a.size ? formatBytes(a.size) : "link"} · {shortDate(a.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
