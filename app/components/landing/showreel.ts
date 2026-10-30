/* Reels shown on the home page wall.
   - Originals are HyperFrames compositions in /public/hyperframes (1920×1080, seekable GSAP
     timelines that also render to MP4); they loop on the page via `?autoplay`.
   - The rest are earlier HTML reels in /public authored on a 1280×720 stage.
   Every reel has a still poster in /public/showreel. `feature` entries take a 2×2 tile: the
   first sits top-left, the second (tenth entry) bottom-right. */

export interface ShowreelItem {
  id: string;
  title: string;
  prompt: string;
  feature?: "left" | "right";
  /** HyperFrames composition in /public/hyperframes, authored at 1920×1080. */
  hyperframes?: boolean;
}

export const SHOWREEL: ShowreelItem[] = [
  {
    id: "ink-to-motion",
    feature: "left",
    hyperframes: true,
    title: "Ink to motion",
    prompt:
      "A handwritten line on ruled notebook paper, 'make the words jump off the page', gets a lime highlighter swipe, then the letters tear off the page into giant multicolour kinetic type that bounces on the beat and resolves into the logo.",
  },
  {
    id: "vertigo",
    hyperframes: true,
    title: "Vertigo, a dolly zoom",
    prompt:
      "Cinematic title: an FPV push through a tunnel of film frames, rack focus onto 'Every shot, directed.', then a dolly zoom that holds the headline while the world stretches behind it, and a whip pan to the logo.",
  },
  {
    id: "make-it-move",
    hyperframes: true,
    title: "Make it move",
    prompt:
      "Swiss-style kinetic poster: 'MAKE IT MOVE.' in giant condensed type on navy, a lime circle in difference blend sweeping across the letters, glitch slices on the beat, and a six-colour shutter wipe.",
  },
  {
    id: "speed-ramp",
    hyperframes: true,
    title: "Speed-ramp whip pans",
    prompt:
      "Three-scene reel joined by speed-ramped whip pans with motion blur: a light sweep across a giant 60, camera-move words crash-zooming in on paper, then 'a sentence.' on lime.",
  },
  {
    id: "every-frame",
    hyperframes: true,
    title: "Every frame",
    prompt:
      "Mosaic transition: a grid of navy tiles flips away in a diagonal wave to reveal 'ONE PROMPT.' on lime, flips back in coral, then bursts open from the centre onto 'EVERY FRAME.' on navy.",
  },
  {
    id: "signal",
    hyperframes: true,
    title: "Signal, a data story",
    prompt:
      "Data story on dark navy: a glowing lime line chart draws itself while a counter rolls up to 2.4M views, milestone tags pop along the curve, volume bars rise and the camera pushes in on the peak.",
  },
  {
    id: "ideas-in-motion",
    hyperframes: true,
    title: "Ideas in motion",
    prompt:
      "Gooey metaball blobs in lime, coral and sky pop in, fuse and orbit, then part to reveal 'ideas in motion' with bouncing letters before a lime flood swallows the frame.",
  },
  {
    id: "text-transition-cool",
    title: "Kinetic text and colour wipes",
    prompt:
      "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
  },
  {
    id: "kinetic-typography-reel",
    title: "Broadcast kinetic type",
    prompt:
      "Bold kinetic typography title card: 'Turn plain text into broadcast motion graphics' slamming in line by line on a navy grid with a lime highlight bar.",
  },
  {
    id: "orbit",
    feature: "right",
    hyperframes: true,
    title: "Orbit, a product shot",
    prompt:
      "Premium product shot: the camera orbits a frosted-glass editor card with floating camera-move tags, racks focus to the background title, then crash-zooms into the preview window and cuts to 'ACTION.'",
  },
  {
    id: "aggressive-zoom-flashcuts",
    title: "Zoom punches and flash cuts",
    prompt:
      "Aggressive camera zoom punches with high-contrast flash cuts, scanline texture, and bold impact labels on every beat.",
  },
  {
    id: "host-intro-text",
    title: "Creator intro title",
    prompt:
      "Low-key creator silhouette with lens-glint eyes and giant stacked kinetic typography slamming into frame with subtle camera shake.",
  },
  {
    id: "neon-host-neuron",
    title: "Neon callout to neuron",
    prompt:
      "3D perspective neon callout card beside the speaker that transitions into a glowing synaptic neuron firing across the axon.",
  },
  {
    id: "host-dark-text",
    title: "Dark headline reveal",
    prompt:
      "Dramatic low-light keynote teaser where bold word-by-word typography ('WE NEED TO TALK.') emerges over a spotlighted stage.",
  },
];
