/*
 * Standalone playback for byreel HyperFrames compositions.
 *
 * Under the HyperFrames renderer/preview the registered timeline stays paused and is
 * driven by the framework. Opened with ?autoplay (the landing-page showreel) it loops
 * on its own; ?t=<seconds> seeks to one frame and holds (used to capture posters).
 * Playback waits for fonts so the first frame is never set in a fallback face.
 */
(function () {
  var params = new URLSearchParams(window.location.search);
  var autoplay = params.has("autoplay");
  var hold = params.has("t") ? parseFloat(params.get("t")) : null;
  if (!autoplay && hold === null) return;

  function start() {
    var timelines = window.__timelines || {};
    Object.keys(timelines).forEach(function (id) {
      var tl = timelines[id];
      if (hold !== null) tl.pause(hold);
      else tl.repeat(-1).play(0);
    });
    document.documentElement.setAttribute("data-ready", "true");
  }

  window.addEventListener("load", function () {
    var fonts = document.fonts && document.fonts.ready;
    (fonts || Promise.resolve()).then(start, start);
  });
})();
