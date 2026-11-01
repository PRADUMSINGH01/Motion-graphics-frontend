/*
 * Shared helpers for byreel HyperFrames compositions.
 * Everything here is deterministic: the same timestamp always renders the same frame.
 */
(function () {
  var NS = "http://www.w3.org/2000/svg";

  /* Seeded PRNG (mulberry32): compositions must never use unseeded randomness. */
  function seeded(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /*
   * Wrap each character in <span class="ch"> and return those spans. Characters are grouped
   * into unbreakable word spans with real spaces between them, so text still wraps normally.
   */
  function split(el, cls) {
    if (typeof el === "string") el = document.querySelector(el);
    cls = cls || "ch";
    el.innerHTML = el.textContent
      .split(" ")
      .map(function (word) {
        return '<span class="w" style="display:inline-block;white-space:nowrap">' +
          word.split("").map(function (c) { return '<span class="' + cls + '">' + c + "</span>"; }).join("") +
          "</span>";
      })
      .join(" ");
    return Array.prototype.slice.call(el.querySelectorAll("." + cls));
  }

  /*
   * Animated film grain over the stage. The noise seed steps once per frame (on the
   * timeline, so it is seekable), giving live grain without any randomness.
   */
  function grain(tl, opts) {
    opts = opts || {};
    var stage = document.getElementById(opts.stage || "stage");
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1920 1080");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText =
      "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;z-index:" +
      (opts.z || 40) + ";opacity:" + (opts.opacity == null ? 0.09 : opts.opacity) +
      ";mix-blend-mode:" + (opts.blend || "overlay");
    var id = "hf-grain-" + (opts.id || "a");
    svg.innerHTML =
      '<filter id="' + id + '"><feTurbulence type="fractalNoise" baseFrequency="' +
      (opts.frequency || 0.9) + '" numOctaves="2" seed="1"/></filter>' +
      '<rect width="1920" height="1080" filter="url(#' + id + ')"/>';
    stage.appendChild(svg);
    var turb = svg.querySelector("feTurbulence");
    var dur = opts.duration || tl.duration() || 10;
    var frames = Math.round(dur * (opts.fps || 30));
    tl.to(turb, { attr: { seed: frames }, duration: dur, ease: "steps(" + frames + ")" }, 0);
    return svg;
  }

  /* Timelines are registered inline in each composition (window.__timelines[id] = tl) so the
     HyperFrames linter can see the registration. */
  window.HF = { seeded: seeded, split: split, grain: grain, NS: NS };
})();
