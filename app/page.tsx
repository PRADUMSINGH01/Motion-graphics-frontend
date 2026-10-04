import "./components/landing/landing.css";
import LandingNav from "./components/landing/LandingNav";
import Hero from "./components/landing/Hero";
import FilmStrip from "./components/landing/FilmStrip";
import TrailerSection from "./components/landing/TrailerSection";
import StudioMockup from "./components/landing/StudioMockup";
import { HowItWorks, Features, Statement, LandingPricing, Faq } from "./components/landing/Sections";
import GetStarted from "./components/landing/GetStarted";
import LandingFooter from "./components/landing/LandingFooter";
import StickyCta from "./components/landing/StickyCta";

export default function Home() {
  return (
    <div className="lp flex-1">
      <LandingNav />
      <Hero />
      <FilmStrip />
      <TrailerSection />
      <StudioMockup />
      <HowItWorks />
      <Features />
      <Statement />
      <LandingPricing />
      <Faq />
      <GetStarted />
      <LandingFooter />
      <StickyCta />
    </div>
  );
}
