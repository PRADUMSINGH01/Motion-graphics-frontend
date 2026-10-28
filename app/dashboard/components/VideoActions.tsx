"use client";

import { useState } from "react";
import { FiDownload, FiLink, FiCheck, FiRotateCw } from "react-icons/fi";
import { copyToClipboard, downloadVideo } from "../lib/videoActions";

interface VideoActionsProps {
  url: string;
  title: string;
  /** Optional "remake" affordance; omitted where it isn't useful. */
  onRemake?: () => void;
}

export default function VideoActions({ url, title, onRemake }: VideoActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const copy = async () => {
    if (await copyToClipboard(url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const download = async () => {
    setDownloading(true);
    try {
      await downloadVideo(url, title);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={download} disabled={downloading} className="db-btn-ghost">
        <FiDownload size={12} className={downloading ? "animate-pulse" : ""} />
        {downloading ? "Saving" : "Download"}
      </button>
      <button type="button" onClick={copy} className="db-btn-ghost" aria-live="polite">
        {copied ? <FiCheck size={12} className="db-acc" /> : <FiLink size={12} />}
        {copied ? "Copied" : "Copy link"}
      </button>
      {onRemake && (
        <button type="button" onClick={onRemake} className="db-btn-ghost">
          <FiRotateCw size={12} /> Remake
        </button>
      )}
    </div>
  );
}
