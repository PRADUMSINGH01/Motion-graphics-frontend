"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FiPlus, FiTrash2, FiUploadCloud, FiCheck, FiRefreshCw, FiEye } from "react-icons/fi";
import { type BrandKit, FONT_OPTIONS, loadBrandKit, newColor, saveBrandKit } from "../../lib/brandKit";

const MAX_LOGO_BYTES = 500 * 1024;

const TONES = [
  { id: "luxury", label: "Minimalist & Luxury", desc: "Clean typography, subtle micro-glints, editorial pauses" },
  { id: "viral", label: "High-Energy & Viral", desc: "Fast cuts, kinetic typography zooms, punchy beats" },
  { id: "technical", label: "Fintech & Developer", desc: "Wireframes, holographic charts, precise metric readouts" },
  { id: "cinematic", label: "Cinematic & Narrative", desc: "Atmospheric depth, film grain, anamorphic aspect" },
];

export default function BrandKitSection({ userId, brandName }: { userId: string; brandName: string }) {
  const [kit, setKit] = useState<BrandKit>(() => loadBrandKit(userId, brandName));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedTone, setSelectedTone] = useState("luxury");
  const [logoError, setLogoError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<BrandKit>) => {
    setKit((k) => ({ ...k, ...patch }));
    setDirty(true);
    setSaved(false);
  };

  const save = () => {
    saveBrandKit(userId, kit);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onLogo = (file: File | undefined) => {
    setLogoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return setLogoError("Please select an image file.");
    if (file.size > MAX_LOGO_BYTES) return setLogoError("Logo must be under 500 KB.");
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && update({ logoDataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const headingFamily = `"${kit.headingFont}", Georgia, serif`;
  const bodyFamily = `"${kit.bodyFont}", system-ui, sans-serif`;
  const accent = kit.colors.find((c) => /accent/i.test(c.name))?.value ?? kit.colors[2]?.value ?? "#C5EF26";

  return (
    <div className="mx-auto w-full max-w-6xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surf-f2fac2 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-658b02">
              GLOBAL DESIGN SYSTEM
            </span>
          </div>
          <h1 className="mt-1 text-[28px] font-bold text-ink-111110">Brand Kit</h1>
          <p className="text-[13.5px] text-ink-717069">
            Configure colors, typography, logos, and voice tone applied automatically to every render.
          </p>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={!dirty && !saved}
          className="flex items-center gap-1.5 h-10 rounded-xl bg-surf-111110 px-5 text-[13px] font-semibold text-white shadow-xs transition hover:bg-surf-272725 disabled:opacity-50"
        >
          {saved ? <FiCheck size={14} className="text-ink-c5ef26" /> : null}
          <span>{saved ? "Saved to Profile" : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Config Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Brand Name & Voice Tone */}
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs space-y-4">
            <h3 className="text-[16px] font-bold text-ink-111110">Brand Identity</h3>
            <div>
              <label className="block text-[12.5px] font-medium text-ink-55544e">Brand / Studio Name</label>
              <input
                type="text"
                value={kit.brandName}
                onChange={(e) => update({ brandName: e.target.value })}
                placeholder="e.g. byreel studio"
                className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-ink-55544e">Motion Narrative Voice</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => {
                      setSelectedTone(tone.id);
                      setDirty(true);
                    }}
                    className={`rounded-xl border p-3 text-left transition ${
                      selectedTone === tone.id
                        ? "border-surf-111110 bg-surf-faf9f5 ring-2 ring-surf-c5ef26/30"
                        : "border-surf-eceae3 hover:border-surf-dedad0"
                    }`}
                  >
                    <p className="text-[12.5px] font-bold text-ink-111110">{tone.label}</p>
                    <p className="mt-0.5 text-[11px] text-ink-717069 line-clamp-2">{tone.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-ink-111110">Color Palette</h3>
              <button
                type="button"
                onClick={() => update({ colors: [...kit.colors, newColor()] })}
                className="flex items-center gap-1 text-[12px] font-semibold text-ink-111110 hover:underline"
              >
                <FiPlus size={13} /> Add Color
              </button>
            </div>

            <div className="space-y-2.5">
              {kit.colors.map((color, idx) => (
                <div
                  key={color.id}
                  className="flex items-center gap-3 rounded-xl border border-surf-eceae3 bg-surf-faf9f5 p-2.5"
                >
                  <input
                    type="color"
                    value={color.value}
                    onChange={(e) => {
                      const next = [...kit.colors];
                      next[idx] = { ...color, value: e.target.value };
                      update({ colors: next });
                    }}
                    className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => {
                      const next = [...kit.colors];
                      next[idx] = { ...color, name: e.target.value };
                      update({ colors: next });
                    }}
                    className="flex-1 bg-transparent text-[13px] font-medium text-ink-111110 focus:outline-none"
                  />
                  <span className="font-mono text-[11.5px] text-ink-717069">{color.value}</span>
                  {kit.colors.length > 2 && (
                    <button
                      type="button"
                      onClick={() => update({ colors: kit.colors.filter((_, i) => i !== idx) })}
                      className="p-1 text-ink-8c8980 hover:text-ink-dc2626"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs space-y-4">
            <h3 className="text-[16px] font-bold text-ink-111110">Typography Hierarchy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-medium text-ink-55544e">Heading Font</label>
                <select
                  value={kit.headingFont}
                  onChange={(e) => update({ headingFont: e.target.value })}
                  className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 bg-surf-ffffff px-3 text-[13px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-ink-55544e">Body Font</label>
                <select
                  value={kit.bodyFont}
                  onChange={(e) => update({ bodyFont: e.target.value })}
                  className="mt-1.5 w-full h-10 rounded-xl border border-surf-dedad0 bg-surf-ffffff px-3 text-[13px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Logo Uploader */}
          <div className="rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5 shadow-2xs space-y-3">
            <h3 className="text-[16px] font-bold text-ink-111110">Brand Logo Watermark</h3>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-surf-dedad0 bg-surf-faf9f5 flex items-center justify-center p-2">
                {kit.logoDataUrl ? (
                  <img src={kit.logoDataUrl} alt="Brand Logo" className="max-h-full max-w-full object-contain" />
                ) : (
                  <Image src="/byreel-logo.png" alt="Byreel Logo" width={80} height={26} className="object-contain" />
                )}
              </div>

              <div>
                <input
                  type="file"
                  ref={logoRef}
                  accept="image/png,image/svg+xml,image/jpeg"
                  className="hidden"
                  onChange={(e) => onLogo(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  className="rounded-xl border border-surf-dedad0 bg-surf-faf9f5 px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-111110 hover:bg-surf-f2efe6"
                >
                  Upload Vector / PNG Logo
                </button>
                {logoError && <p className="mt-1 text-[11px] text-ink-dc2626">{logoError}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Visual Simulation Slate */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-ink-717069 font-mono">
              Live Motion Slate Preview
            </h3>

            {/* Video Canvas Simulation */}
            <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-3xl border border-surf-dedad0 bg-surf-0d0f10 p-6 text-white shadow-xl flex flex-col justify-between">
              {/* Subtle grid pattern background */}
              <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage: "radial-gradient(#c5ef26 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Slate Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {kit.logoDataUrl ? (
                    <img src={kit.logoDataUrl} alt="Logo" className="h-6 w-auto object-contain" />
                  ) : (
                    <Image src="/byreel-mark.png" alt="Mark" width={24} height={24} className="object-contain" />
                  )}
                  <span className="font-semibold text-[13px] tracking-tight">{kit.brandName || "byreel"}</span>
                </div>
                <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[9px] text-ink-c5ef26">
                  4K 60FPS
                </span>
              </div>

              {/* Slate Hero Headline */}
              <div className="relative z-10 my-auto text-center space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-9c9990">
                  SCENE 01 · KEY REVEAL
                </span>
                <h2
                  className="text-[26px] font-bold tracking-tight text-white leading-tight"
                  style={{ fontFamily: headingFamily }}
                >
                  Turn ideas into <br />
                  <span style={{ color: accent }}>motion graphics.</span>
                </h2>
                <p
                  className="text-[11.5px] text-ink-a8a8a2 max-w-xs mx-auto"
                  style={{ fontFamily: bodyFamily }}
                >
                  Crafted with {kit.brandName || "byreel"} design tokens.
                </p>
              </div>

              {/* Slate Footer Color Palette Bars */}
              <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-1.5">
                  {kit.colors.map((c) => (
                    <span
                      key={c.id}
                      className="h-3 w-3 rounded-full border border-black/40 shadow-xs"
                      style={{ backgroundColor: c.value }}
                      title={`${c.name}: ${c.value}`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-ink-8c8980">
                  {selectedTone.toUpperCase()} TONE
                </span>
              </div>
            </div>

            <p className="mt-3 text-center text-[12px] text-ink-717069">
              Every motion clip rendered in your studio inherits this palette and type style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
