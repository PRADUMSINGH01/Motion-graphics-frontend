import React, { memo } from "react";

export const TestimonialsWall = memo(function TestimonialsWall() {
  const testimonials = [
    {
      name: "Guillermo Rauch",
      handle: "@rauchg",
      role: "CEO at Vercel",
      avatarBg: "bg-zinc-800",
      content:
        "Raycast is the gold standard for native desktop ergonomics. Once you get used to running commands with keystrokes, you can never go back.",
    },
    {
      name: "Karri Saarinen",
      handle: "@karrisaarinen",
      role: "CEO at Linear",
      avatarBg: "bg-indigo-900",
      content:
        "Fast, reliable, and ridiculously well-designed. It has completely eliminated the need for dozens of micro-apps on my Mac.",
    },
    {
      name: "Jordan Singer",
      handle: "@ibuildmythought",
      role: "Product Designer & Builder",
      avatarBg: "bg-rose-950",
      content:
        "The Raycast extension ecosystem is pure joy. Creating and sharing tools with TypeScript is the fastest feedback loop I've ever experienced.",
    },
    {
      name: "Dylan Field",
      handle: "@zoink",
      role: "CEO at Figma",
      avatarBg: "bg-purple-900",
      content:
        "An indispensable part of our creative team's daily flow. Lightning quick and effortlessly extendable.",
    },
    {
      name: "Paco Coursey",
      handle: "@pacocoursey",
      role: "Design Engineer",
      avatarBg: "bg-emerald-950",
      content:
        "The attention to craft, micro-interactions, and keyboard ergonomics is masterclass. Every interaction feels instant.",
    },
    {
      name: "Amjad Masad",
      handle: "@amasad",
      role: "CEO at Replit",
      avatarBg: "bg-amber-950",
      content:
        "Raycast AI combined with native window management and clipboard history makes standard OS tooling feel decades old.",
    },
  ];

  return (
    <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-canvas text-white overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent mb-3">
            Wall of Love
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4"
            style={{
              fontFamily: "var(--font-headline)",
              letterSpacing: "-0.03em",
            }}
          >
            Loved by builders worldwide.
          </h2>
          <p className="text-base text-zinc-400">
            Join hundreds of thousands of designers and engineers elevating their workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl border border-white/10 bg-surface/80 backdrop-blur-xl hover:border-white/20 transition-all shadow-lg flex flex-col justify-between"
            >
              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${t.avatarBg} border border-white/15 flex items-center justify-center text-xs font-bold text-white shadow-xs`}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-zinc-500">
                    {t.handle} • {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default TestimonialsWall;
