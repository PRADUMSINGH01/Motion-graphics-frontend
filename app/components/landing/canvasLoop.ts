export interface LoopFrame {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  /** Seconds of animated time (frozen when reduced motion is on). */
  t: number;
  dt: number;
  /** Pointer position in canvas CSS pixels; only meaningful while `pointerActive`. */
  px: number;
  py: number;
  pointerActive: boolean;
}

interface LoopOptions {
  /** Element that receives pointer events (the canvas itself is pointer-events: none). */
  host: HTMLElement;
  draw: (f: LoopFrame) => void;
  onResize?: (w: number, h: number) => void;
  maxDpr?: number;
  /** Time used for the single static frame drawn when the user prefers reduced motion. */
  staticTime?: number;
}

/**
 * Runs a DPR-aware canvas animation that only ticks while the canvas is on screen and the
 * tab is visible. With `prefers-reduced-motion` it draws one still frame and never loops.
 * Returns a cleanup function.
 */
export function startCanvasLoop(canvas: HTMLCanvasElement, opts: LoopOptions): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: -9999, y: -9999, active: false };
  let w = 0;
  let h = 0;
  let t = reduce ? (opts.staticTime ?? 3) : 0;
  let last = 0;
  let raf = 0;
  let visible = false;

  const running = () => visible && !document.hidden && !reduce;

  const step = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    if (!reduce) t += dt;
    ctx.clearRect(0, 0, w, h);
    opts.draw({ ctx, w, h, t, dt, px: pointer.x, py: pointer.y, pointerActive: pointer.active && !reduce });
  };

  const tick = (now: number) => {
    raf = 0;
    step(now);
    if (running()) raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    if (!raf && running()) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    opts.onResize?.(w, h);
    if (!running()) step(performance.now());
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
    else stop();
  });
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? stop() : kick());
  document.addEventListener("visibilitychange", onVisibility);

  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  };
  const onLeave = () => {
    pointer.active = false;
  };
  opts.host.addEventListener("pointermove", onMove, { passive: true });
  opts.host.addEventListener("pointerleave", onLeave);

  resize();

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    opts.host.removeEventListener("pointermove", onMove);
    opts.host.removeEventListener("pointerleave", onLeave);
  };
}
