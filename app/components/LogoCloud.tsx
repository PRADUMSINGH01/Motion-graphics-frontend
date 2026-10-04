import React, { memo } from "react";

const LOGOS = ["Vercel", "Linear", "GitHub", "Figma", "Supabase", "Stripe", "Framer", "Raycast"];

export const LogoCloud = memo(function LogoCloud() {
  return (
    <section className="relative w-full py-14 border-y border-line bg-canvas-subtle">
      <div className="container-page text-center">
        <p className="text-[13px] text-fg-subtle mb-8">
          Trusted by product, marketing and design teams at
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-5 items-center">
          {LOGOS.map((name) => (
            <li
              key={name}
              className="text-[17px] font-semibold tracking-[-0.03em] text-fg-subtle/80 hover:text-fg-muted transition-colors select-none"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

export default LogoCloud;
