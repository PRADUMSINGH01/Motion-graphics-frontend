import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Caveat } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";

/* ── Fonts via next/font (zero render-blocking external requests) ── */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* Display serif used by the landing page headlines. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/* Authentic handwritten fountain-pen font for notebook margin annotations & links. */
const caveat = Caveat({
  variable: "--font-pen",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/* Applies the stored theme before first paint so light-mode users never see a dark flash. */
const themeInitScript = `(function(){try{var t=localStorage.getItem("byreel_theme")||"light";if(t==="system"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;r.classList.add(t);r.setAttribute("data-theme",t);r.style.colorScheme=t}catch(e){}})();`;

const siteDescription =
  "Describe a scene in plain language and byreel writes, animates and exports broadcast-ready 60 FPS motion graphics — no timeline required.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://byreel.ai"),
  title: {
    default: "byreel — The AI agent for motion graphics",
    template: "%s · byreel",
  },
  description: siteDescription,
  keywords: ["motion graphics", "AI video", "kinetic typography", "video generation", "animation agent"],
  openGraph: {
    type: "website",
    siteName: "byreel",
    title: "byreel — The AI agent for motion graphics",
    description: siteDescription,
    images: [{ url: "/byreel-mark.png", width: 512, height: 512, alt: "byreel" }],
  },
  twitter: {
    card: "summary",
    title: "byreel — The AI agent for motion graphics",
    description: siteDescription,
    images: ["/byreel-mark.png"],
  },
  icons: {
    icon: [
      { url: "/byreel-mark.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/byreel-mark.png",
    apple: "/byreel-mark.png",
  },
};

import { ThemeProvider } from "./context/ThemeContext";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./navbar/navbar";
import Footer from "./components/Footer";
import RouteProgressBar from "./components/RouteProgressBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-fg">
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        <ThemeProvider>
          <AlertProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
