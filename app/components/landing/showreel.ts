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
    id: "make-it-move",
    hyperframes: true,
    title: "Make it move",
    prompt:
      "Swiss-style kinetic poster: 'MAKE IT MOVE.' in giant condensed type on navy, a lime circle in difference blend sweeping across the letters, glitch slices on the beat, and a six-colour shutter wipe.",
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
    id: "aggressive-zoom-flashcuts",
    title: "Zoom punches and flash cuts",
    prompt:
      "Aggressive camera zoom punches with high-contrast flash cuts, scanline texture, and bold impact labels on every beat.",
  },
  {
    id: "phone-toss-clock",
    title: "Phone toss to ticking clock",
    prompt:
      "A smartphone gets tossed out of frame with motion blur, hard-cutting to a high-contrast ticking analog clock.",
  },
  {
    id: "host-intro-text",
    title: "Creator intro title",
    prompt:
      "Low-key creator silhouette with lens-glint eyes and giant stacked kinetic typography slamming into frame with subtle camera shake.",
  },
  {
    id: "ideas-in-motion",
    feature: "right",
    hyperframes: true,
    title: "Ideas in motion",
    prompt:
      "Gooey metaball blobs in lime, coral and sky pop in, fuse and orbit, then part to reveal 'ideas in motion' with bouncing letters before a lime flood swallows the frame.",
  },
  {
    id: "flash-cut-broadcast",
    title: "Broadcast lower third",
    prompt:
      "Skewed broadcast news lower-third title bar over studio lighting followed by rapid full-screen editorial flash cuts.",
  },
  {
    id: "faceless-story-reel",
    title: "Faceless story with captions",
    prompt:
      "Generate a complete faceless storytelling video with automated visual B-roll scenes, chapter progression, and synchronized word-by-word kinetic captions.",
  },
  {
    id: "host-dark-text",
    title: "Dark headline reveal",
    prompt:
      "Dramatic low-light keynote teaser where bold word-by-word typography ('WE NEED TO TALK.') emerges over a spotlighted stage.",
  },
  {
    id: "neon-host-neuron",
    title: "Neon callout to neuron",
    prompt:
      "3D perspective neon callout card beside the speaker that transitions into a glowing synaptic neuron firing across the axon.",
  },
];
