"use client";

import { useState } from "react";
import { FiCheck, FiPlus, FiTrash2 } from "react-icons/fi";
import { type BrandKit, FONT_OPTIONS, VOICES, brandGuide, loadBrandKit, newColor, saveBrandKit } from "../../lib/brandKit";

export default function BrandKitSection({ userId, brandName }: { userId: string; brandName: string }) {
  const [kit, setKit] = useState<BrandKit>(() => loadBrandKit(userId, ""));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<BrandKit>) => {
    setKit((k) => ({ ...k, ...patch }));
    setDirty(true);
    setSaved(false);
  };

  const save = (next: BrandKit = kit) => {
    saveBrandKit(userId, next);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // The switch saves at once: whether new videos follow the kit should never wait on a second click.
  const toggle = () => {
    const next = { ...kit, enabled: !kit.enabled };
    setKit(next);
    save(next);
  };

  const headingFamily = `"${kit.headingFont}", Georgia, serif`;
  const bodyFamily = `"${kit.bodyFont}", system-ui, sans-serif`;
  const ink = kit.colors[0]?.value ?? "#111110";
  const paper = kit.colors[1]?.value ?? "#FCFBF7";
  const accent = kit.colors.find((c) => /accent/i.test(c.name))?.value ?? kit.colors[2]?.value ?? "#C5EF26";
  const guide = brandGuide({ ...kit, enabled: true });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[26px] font-bold text-ink-111110">Brand kit</h1>
          <p className="mt-1 max-w-xl text-[13.5px] text-ink-717069">
            Your colours, fonts and feel. While it&apos;s on, every new video you start follows it; changes to an existing
            video keep that video&apos;s look.
          </p>
        </div>
        <button
          type="button"
          onClick={() => save()}
          disabled={!dirty}
          className="flex h-10 shrink-0 items-center gap-1.5 self-start rounded-xl bg-surf-111110 px-5 text-[13px] font-semibold text-white transition hover:bg-surf-272725 disabled:opacity-50 sm:self-auto"
        >
          {saved && <FiCheck size={14} />}
          {saved ? "Saved" : "Save changes"}
        </button>
      </header>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-4">
        <div>
          <p className="text-[14px] font-semibold text-ink-111110">Use in new videos</p>
          <p className="text-[12.5px] text-ink-717069">
            {kit.enabled ? "On: the Studio sends this kit with every new video." : "Off: new videos pick their own colours and type."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={kit.enabled}
          aria-label="Use the brand kit in new videos"
          onClick={toggle}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${kit.enabled ? "bg-surf-111110" : "bg-surf-dedad0"}`}
        >
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${kit.enabled ? "left-6" : "left-1"}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <section className="space-y-4 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5">
            <h2 className="text-[15px] font-semibold text-ink-111110">Identity</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12.5px] font-medium text-ink-55544e">Brand name</span>
                <input
                  type="text"
                  value={kit.brandName}
                  onChange={(e) => update({ brandName: e.target.value })}
                  placeholder="Northwind Coffee"
                  className="mt-1.5 h-10 w-full rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[12.5px] font-medium text-ink-55544e">Tagline (optional)</span>
                <input
                  type="text"
                  value={kit.tagline}
                  onChange={(e) => update({ tagline: e.target.value })}
                  placeholder="Roasted this morning"
                  className="mt-1.5 h-10 w-full rounded-xl border border-surf-dedad0 px-3.5 text-[13.5px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
                />
              </label>
            </div>
            <fieldset>
              <legend className="text-[12.5px] font-medium text-ink-55544e">Feel</legend>
              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {VOICES.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={kit.voice === v.id}
                    onClick={() => update({ voice: kit.voice === v.id ? "" : v.id })}
                    className={`rounded-xl border p-3 text-left transition ${kit.voice === v.id ? "border-surf-111110 bg-surf-faf9f5" : "border-surf-eceae3 hover:border-surf-dedad0"}`}
                  >
                    <span className="block text-[12.5px] font-semibold text-ink-111110">{v.label}</span>
                    <span className="mt-0.5 block text-[11.5px] text-ink-717069">{v.desc}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="space-y-3 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-ink-111110">Colours</h2>
              <button type="button" onClick={() => update({ colors: [...kit.colors, newColor()] })} className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-111110 hover:underline">
                <FiPlus size={13} /> Add colour
              </button>
            </div>
            <p className="text-[12px] text-ink-717069">The first colour is used for text, the second for the background, and one named “Accent” for highlights.</p>
            <ul className="space-y-2">
              {kit.colors.map((color, idx) => (
                <li key={color.id} className="flex items-center gap-3 rounded-xl border border-surf-eceae3 bg-surf-faf9f5 p-2.5">
                  <input
                    type="color"
                    value={color.value}
                    aria-label={`${color.name} colour`}
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
                    aria-label="Colour name"
                    onChange={(e) => {
                      const next = [...kit.colors];
                      next[idx] = { ...color, name: e.target.value };
                      update({ colors: next });
                    }}
                    className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-111110 focus:outline-none"
                  />
                  <span className="font-mono text-[11.5px] uppercase text-ink-717069">{color.value}</span>
                  {kit.colors.length > 2 && (
                    <button type="button" aria-label={`Remove ${color.name}`} onClick={() => update({ colors: kit.colors.filter((_, i) => i !== idx) })} className="p-1 text-ink-8c8980 hover:text-ink-dc2626">
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 rounded-2xl border border-surf-dedad0 bg-surf-ffffff p-5">
            <h2 className="text-[15px] font-semibold text-ink-111110">Fonts</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(
                [
                  ["headingFont", "Headings"],
                  ["bodyFont", "Body text"],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="block">
                  <span className="text-[12.5px] font-medium text-ink-55544e">{label}</span>
                  <select
                    value={kit[field]}
                    onChange={(e) => update({ [field]: e.target.value } as Partial<BrandKit>)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-surf-dedad0 bg-surf-ffffff px-3 text-[13px] text-ink-111110 focus:border-surf-111110 focus:outline-none"
                  >
                    {[...new Set([kit[field], ...FONT_OPTIONS])].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-3 lg:col-span-5">
          <div className="sticky top-6 space-y-3">
            <h2 className="text-[13px] font-semibold text-ink-717069">Preview</h2>
            <div className="flex aspect-video w-full flex-col justify-center overflow-hidden rounded-2xl border border-surf-dedad0 p-8" style={{ background: paper, color: ink }}>
              <p className="text-[30px] font-bold leading-tight" style={{ fontFamily: headingFamily }}>
                {kit.brandName || "Your brand"}
              </p>
              <span className="mt-2 block h-1 w-16 rounded-full" style={{ background: accent }} />
              <p className="mt-3 text-[13px] opacity-80" style={{ fontFamily: bodyFamily }}>
                {kit.tagline || "Your tagline sits here in the body font."}
              </p>
            </div>
            {guide && (
              <div className="rounded-xl border border-surf-eceae3 bg-surf-faf9f5 p-3.5">
                <p className="text-[12px] font-semibold text-ink-111110">Sent with each new video while on</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-717069">{guide}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
