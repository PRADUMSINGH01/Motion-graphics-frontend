# byreel showreel — HyperFrames compositions

Original motion-graphics pieces for the home page showreel, authored as
[HyperFrames](https://github.com/heygen-com/hyperframes) compositions: plain HTML + CSS
driven by one paused, seekable GSAP timeline registered on `window.__timelines`.

| File | Length | What happens |
|---|---|---|
| `ink-to-motion.html` | 10s | A handwritten prompt on ruled paper tears off the page into bouncing kinetic type, then resolves to the byreel mark |
| `make-it-move.html` | 8s | Swiss kinetic poster: difference-blend disc, beat-synced slice glitches, six-colour shutter wipe |
| `every-frame.html` | 8s | 12×7 tile mosaic flipping in diagonal, reverse and radial waves between two scenes |
| `signal.html` | 8s | Data story: self-drawing glow chart, counter to 2.4M, milestone tags, camera push |
| `ideas-in-motion.html` | 8s | Gooey metaball blobs fuse, orbit and part to reveal the title, then a lime flood |

Every piece ends on the frame it starts on, so it loops cleanly.

## Playback modes

- **HyperFrames preview / render** – the timeline stays paused and the framework drives it.
- **`?autoplay`** – loops on its own (used by the landing page tiles).
- **`?t=4.2`** – seeks to one frame and holds (used to capture `/public/showreel` posters).

## Render to MP4

From this folder (needs Node 22+ and FFmpeg):

```bash
npx hyperframes render -c ./ink-to-motion.html -o ink-to-motion.mp4
```

## Rules these follow

- Deterministic: no `Math.random`/`Date.now`; "random" values come from a seeded generator,
  so a given timestamp always renders the same frame.
- Seek-safe: no `onUpdate` callbacks for visuals (seeks suppress them); counters use tween
  `modifiers` instead.
- Self-contained: GSAP (+ DrawSVG, MotionPath plugins) in `vendor/`, OFL fonts from
  `@fontsource` in `fonts/`. No CDN requests.
