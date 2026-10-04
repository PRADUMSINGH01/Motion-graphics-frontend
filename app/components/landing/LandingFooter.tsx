import Link from "next/link";
import { LogoLockup } from "./LandingLogo";

const MONO_LABEL = "lp-mono text-[12px]";

export default function LandingFooter() {
  return (
    <footer className="lp-wrap pt-[72px]">
      <div className="lp-g12 grid grid-cols-12 gap-x-8 gap-y-8 text-[14px]">
        <p className="col-span-4 m-0 max-w-[300px]" style={{ color: "var(--lp-ink-2)" }}>
          The AI video studio for product launches, b-roll and short-form.
        </p>
        <nav aria-label="Product" className="col-span-2 col-start-7 flex flex-col gap-2.5">
          <span className={MONO_LABEL} style={{ color: "var(--lp-muted)" }}>
            PRODUCT
          </span>
          <a href="#studio" className="lp-link-u">Studio</a>
          <a href="#features" className="lp-link-u">Features</a>
          <a href="#pricing" className="lp-link-u">Pricing</a>
        </nav>
        <nav aria-label="Company" className="col-span-2 flex flex-col gap-2.5">
          <span className={MONO_LABEL} style={{ color: "var(--lp-muted)" }}>
            COMPANY
          </span>
          <Link href="/about" className="lp-link-u">About</Link>
          <a href="mailto:support@byreel.ai" className="lp-link-u">Contact</a>
        </nav>
        <nav aria-label="Legal" className="col-span-2 flex flex-col gap-2.5">
          <span className={MONO_LABEL} style={{ color: "var(--lp-muted)" }}>
            LEGAL
          </span>
          <Link href="/terms" className="lp-link-u">Terms</Link>
          <Link href="/policy" className="lp-link-u">Privacy</Link>
        </nav>
      </div>

      {/* Oversized brand lockup (the real logo artwork) */}
      <div aria-hidden="true" className="relative mt-[72px] overflow-hidden leading-[0]">
        <LogoLockup height="auto" style={{ maxWidth: 1100, display: "block", marginInline: "auto" }} />
      </div>

      <div
        className="lp-mono flex flex-wrap justify-between gap-3 border-t pb-7 pt-5 text-[12px]"
        style={{ borderColor: "var(--lp-rule)", color: "var(--lp-muted)" }}
      >
        <span>© {new Date().getFullYear()} BYREEL</span>
        <span>MADE FOR MAKERS WHO SHIP</span>
      </div>
    </footer>
  );
}
