"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiSettings, FiCreditCard, FiKey, FiLogOut } from "react-icons/fi";
import type { User } from "../../context/AuthContext";

interface AccountMenuProps {
  user: User;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export default function AccountMenu({ user, onOpenSettings, onLogout }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const tier = user.plan?.tier ?? "free";
  const initial = user.name?.charAt(0).toUpperCase() || "P";
  const displayName = user.name || "Pradum Singh";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-10 cursor-pointer items-center gap-2.5 rounded-full border border-transparent px-2 py-1 transition hover:bg-surf-eceae3 hover:border-surf-dedad0"
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surf-dedad0 bg-surf-111110 text-[13px] font-medium text-white shadow-2xs">
          {!imgError ? (
            <Image
              src="/dashboard/user-avatar.jpg"
              alt={displayName}
              width={32}
              height={32}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </span>
        <span className="hidden sm:inline-block max-w-[120px] truncate text-[13.5px] font-medium text-ink-111110">
          {displayName}
        </span>
        <FiChevronDown
          size={14}
          className={`text-ink-717069 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-surf-dedad0 bg-surf-ffffff shadow-[0_16px_36px_-12px_rgba(17,17,16,0.2)]"
        >
          <div className="border-b border-surf-eceae3 px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[14px] font-semibold text-ink-111110">{displayName}</span>
              <span className="rounded-full bg-surf-f2efe6 px-2 py-0.5 text-[10.5px] font-mono font-medium uppercase text-ink-55544e">
                {tier}
              </span>
            </div>
            <span className="mt-0.5 block truncate text-[12px] text-ink-717069">{user.email}</span>
          </div>

          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onOpenSettings();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-ink-2d2c28 transition hover:bg-surf-f7f6f0"
            >
              <FiSettings size={15} className="text-ink-8c8980" /> Account settings
            </button>
            <Link
              href="#billing"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink-2d2c28 transition hover:bg-surf-f7f6f0"
            >
              <FiCreditCard size={15} className="text-ink-8c8980" /> Billing & plan
            </Link>
            <Link
              href="#assets"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink-2d2c28 transition hover:bg-surf-f7f6f0"
            >
              <FiKey size={15} className="text-ink-8c8980" /> Brand Assets
            </Link>
          </div>

          <div className="border-t border-surf-eceae3 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-ink-dc2626 transition hover:bg-red-50"
            >
              <FiLogOut size={15} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
