import Link from "next/link";
import { FiArrowRight, FiShield } from "react-icons/fi";
import MainSection from "./components/MainSection";
import MotionQuote from "./components/MotionQuote";
import PricingSection from "./components/PricingSection";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col font-poppins text-slate-100">
      {/* MAIN HERO SECTION WITH ANIMATED SPIDER WEB CANVAS */}
      <MainSection />

      {/* GSAP MOTION QUOTE SHOWCASE */}
      <MotionQuote />

      {/* PRICING PLANS SECTION */}
      <PricingSection />

      {/* Production Conversion Banner */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-blue-900/30 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-2xl font-bold text-white font-sans">
              Ready to automate your motion production?
            </h4>
            <p className="text-sm text-slate-300 max-w-xl font-poppins">
              Join motion designers, VFX studios, and marketing teams creating broadcast-quality animations 10x faster.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 font-poppins">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-white/90 rounded-xl transition-colors shadow-lg shadow-black/20"
            >
              <span>Get Started Free</span>
              <FiArrowRight className="w-4 h-4 text-slate-900" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white bg-white/10 border border-white/15 rounded-xl hover:bg-white/20 transition-colors"
            >
              <FiShield className="w-4 h-4 text-yellow-300" />
              <span>Animagent Sign In</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
