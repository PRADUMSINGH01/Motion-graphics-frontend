/* Reels shown on the home page wall. Each is a self-contained HTML composition in /public
   authored on a 1280×720 stage, with a still poster in /public/showreel. `feature` entries
   take a 2×2 tile: the first sits top-left, the second (tenth entry) bottom-right. */

export interface ShowreelItem {
  id: string;
  title: string;
  prompt: string;
  feature?: "left" | "right";
}

export const SHOWREEL: ShowreelItem[] = [
  {
    id: "text-transition-cool",
    feature: "left",
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
    id: "saas-product-launch",
    title: "Product launch trailer",
    prompt:
      "Keynote SaaS product launch trailer with 3D glass telemetry dashboard, rising +340% YoY benchmark bars, sub-8ms latency counter, and bold CTA.",
  },
  {
    id: "split-screen-attention",
    title: "Split-screen attention",
    prompt:
      "Split-screen documentary B-roll contrasting monochrome analog deep work on the left against a saturated high-velocity social feed on the right.",
  },
  {
    id: "feed-scroll-macro",
    title: "Thumb-scrolling feed",
    prompt:
      "Handheld macro POV shot of a smartphone feed scrolling rapidly with jump-cut flashes and kinetic retention hooks.",
  },
  {
    id: "flash-cut-broadcast",
    title: "Broadcast lower third",
    prompt:
      "Skewed broadcast news lower-third title bar over studio lighting followed by rapid full-screen editorial flash cuts.",
  },
  {
    id: "neon-host-neuron",
    feature: "right",
    title: "Neon callout to neuron",
    prompt:
      "3D perspective neon callout card beside the speaker that transitions into a glowing synaptic neuron firing across the axon.",
  },
  {
    id: "broll-data-cutaway",
    title: "Archival highlight cutaway",
    prompt:
      "Vox-style documentary B-roll panning across an archival print clipping with an animated electric lime marker sweep and source citation.",
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
    id: "vertical-creator-short",
    title: "Vertical short hook",
    prompt:
      "Vertical 9:16 creator short: a phone mockup with rising retention bars and the hook 'Stop posting static videos on Reels & Shorts' popping in word by word.",
  },
];
