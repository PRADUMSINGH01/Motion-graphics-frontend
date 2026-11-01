/* Reels shown on the home page wall.
   - Originals are HyperFrames compositions in /public/hyperframes (1920×1080, seekable GSAP
     timelines that also render to MP4); they loop on the page via `?autoplay`.
   - The rest are earlier HTML reels in /public authored on a 1280×720 stage.
   Every reel has a still poster in /public/showreel. Order matters: the wall turns every
   ninth reel (0, 9, 18…) of whatever is showing into a large 2×2 tile, so the strongest
   pieces sit at the front of each category. */

export const CATEGORIES = ["Product launches", "Motion graphics", "Cinematic", "Textures"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface ShowreelItem {
  id: string;
  title: string;
  category: Category;
  prompt: string;
  /** HyperFrames composition in /public/hyperframes, authored at 1920×1080. */
  hyperframes?: boolean;
}

export const SHOWREEL: ShowreelItem[] = [
  {
    id: "ink-to-motion",
    hyperframes: true,
    category: "Motion graphics",
    title: "Ink to motion",
    prompt:
      "A handwritten line on ruled notebook paper, 'make the words jump off the page', gets a lime highlighter swipe, then the letters tear off the page into giant multicolour kinetic type that bounces on the beat and resolves into the logo.",
  },
  {
    id: "launch-day",
    hyperframes: true,
    category: "Product launches",
    title: "Launch day countdown",
    prompt:
      "Product launch countdown: giant 3, 2, 1 numerals on coloured paper sheets that rip away, a halftone burst, then the byreel 2.0 product card slams in with an 'out now!' sticker and 'Available today.'",
  },
  {
    id: "vertigo",
    hyperframes: true,
    category: "Cinematic",
    title: "Vertigo, a dolly zoom",
    prompt:
      "Cinematic title: an FPV push through a tunnel of film frames, rack focus onto 'Every shot, directed.', then a dolly zoom that holds the headline while the world stretches behind it, and a whip pan to the logo.",
  },
  {
    id: "riso-print",
    hyperframes: true,
    category: "Textures",
    title: "Riso print",
    prompt:
      "Two-colour risograph poster in fluoro pink and blue on paper: 'PRINT IN MOTION.' prints in 12 fps passes with overprint, ink dropout grain and misregistration jitter, then the sheet feeds out to 'ONE PROMPT / TWO INKS.'",
  },
  {
    id: "make-it-move",
    hyperframes: true,
    category: "Motion graphics",
    title: "Make it move",
    prompt:
      "Swiss-style kinetic poster: 'MAKE IT MOVE.' in giant condensed type on navy, a lime circle in difference blend sweeping across the letters, glitch slices on the beat, and a six-colour shutter wipe.",
  },
  {
    id: "pocket-studio",
    hyperframes: true,
    category: "Product launches",
    title: "Pocket studio app launch",
    prompt:
      "App launch: a 3D phone rises out of a drifting aurora, the prompt types itself, Generate is tapped, a render ring fills, the finished clip plays on screen with callouts, then 'Your studio, in your pocket.'",
  },
  {
    id: "liquid-chrome",
    hyperframes: true,
    category: "Textures",
    title: "Liquid chrome",
    prompt:
      "Iridescent chrome type pushed through a live liquid displacement: 'LIQUID' melts into a mirror floor and re-forms as 'CHROME' with a reflection sweep and caustic light.",
  },
  {
    id: "speed-ramp",
    hyperframes: true,
    category: "Cinematic",
    title: "Speed-ramp whip pans",
    prompt:
      "Three-scene reel joined by speed-ramped whip pans with motion blur: a light sweep across a giant 60, camera-move words crash-zooming in on paper, then 'a sentence.' on lime.",
  },
  {
    id: "every-frame",
    hyperframes: true,
    category: "Motion graphics",
    title: "Every frame",
    prompt:
      "Mosaic transition: a grid of navy tiles flips away in a diagonal wave to reveal 'ONE PROMPT.' on lime, flips back in coral, then bursts open from the centre onto 'EVERY FRAME.' on navy.",
  },
  {
    id: "orbit",
    hyperframes: true,
    category: "Product launches",
    title: "Orbit, a product shot",
    prompt:
      "Premium product shot: the camera orbits a frosted-glass editor card with floating camera-move tags, racks focus to the background title, then crash-zooms into the preview window and cuts to 'ACTION.'",
  },
  {
    id: "feature-bento",
    hyperframes: true,
    category: "Product launches",
    title: "Feature bento",
    prompt:
      "SaaS feature launch: the camera starts tight on toggles flipping on, pulls back to a six-card bento grid where each card plays its feature (chart, chat, timeline, brand palette), then the cards scatter off the page.",
  },
  {
    id: "halftone-field",
    hyperframes: true,
    category: "Textures",
    title: "Halftone field",
    prompt:
      "A full-frame halftone dot field on navy: a lime ripple wave morphs into the byreel play mark, then a ring, then back to the wave, with 'Every dot, directed.'",
  },
  {
    id: "signal",
    hyperframes: true,
    category: "Motion graphics",
    title: "Signal, a data story",
    prompt:
      "Data story on dark navy: a glowing lime line chart draws itself while a counter rolls up to 2.4M views, milestone tags pop along the curve, volume bars rise and the camera pushes in on the peak.",
  },
  {
    id: "terminal-render",
    hyperframes: true,
    category: "Motion graphics",
    title: "Terminal render",
    prompt:
      "A phosphor CRT terminal types a render command, logs and a progress bar stream in, then an RGB-split glitch cuts to the finished neon title 'It's a wrap.' with tube flicker.",
  },
  {
    id: "cut-paper",
    hyperframes: true,
    category: "Textures",
    title: "Cut paper",
    prompt:
      "Stop-motion paper craft at 12 fps: torn paper hills, a rising paper sun and a paper plane on a dashed path, then cut-out letters 'MADE BY HAND.' stick on one by one with boiling edges.",
  },
  {
    id: "text-transition-cool",
    category: "Motion graphics",
    title: "Kinetic text and colour wipes",
    prompt:
      "Create a vibrant, colorful 60 FPS kinetic text animation with spring word pops, diagonal multi-color shutter wipes, and an iris portal reveal.",
  },
  {
    id: "ideas-in-motion",
    hyperframes: true,
    category: "Motion graphics",
    title: "Ideas in motion",
    prompt:
      "Gooey metaball blobs in lime, coral and sky pop in, fuse and orbit, then part to reveal 'ideas in motion' with bouncing letters before a lime flood swallows the frame.",
  },
  {
    id: "brand-build",
    hyperframes: true,
    category: "Motion graphics",
    title: "Brand build",
    prompt:
      "A brand sheet on a blueprint grid: construction circles and guides draw the byreel mark with handwritten dimensions, the mark fills lime, then the wordmark, type spec and palette with hex codes assemble.",
  },
  {
    id: "merch-drop",
    hyperframes: true,
    category: "Product launches",
    title: "Merch drop",
    prompt:
      "E-commerce drop: a 3D merch box turns under a spotlight beside a split-flap board that rattles from 'DROP 04 / FRI 6PM' to 'LIVE NOW / 48 HOURS', the lid opens and stickers pop out.",
  },
  {
    id: "kinetic-typography-reel",
    category: "Motion graphics",
    title: "Broadcast kinetic type",
    prompt:
      "Bold kinetic typography title card: 'Turn plain text into broadcast motion graphics' slamming in line by line on a navy grid with a lime highlight bar.",
  },
  {
    id: "neon-host-neuron",
    category: "Cinematic",
    title: "Neon callout to neuron",
    prompt:
      "3D perspective neon callout card beside the speaker that transitions into a glowing synaptic neuron firing across the axon.",
  },
  {
    id: "host-dark-text",
    category: "Cinematic",
    title: "Dark headline reveal",
    prompt:
      "Dramatic low-light keynote teaser where bold word-by-word typography ('WE NEED TO TALK.') emerges over a spotlighted stage.",
  },
  {
    id: "host-intro-text",
    category: "Cinematic",
    title: "Creator intro title",
    prompt:
      "Low-key creator silhouette with lens-glint eyes and giant stacked kinetic typography slamming into frame with subtle camera shake.",
  },
];
