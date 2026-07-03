import { useEffect, useRef } from "react";

// Project-card video thumb: sets `muted` + calls play() imperatively
// via a ref, since on SSR-hydrated <video> tags the `muted` JSX prop
// doesn't always land as a live DOM property before the browser's
// autoplay-policy check runs, silently leaving the video paused.
//
// It also actively keeps the video playing: browsers will sometimes
// pause an autoplaying <video> on their own (buffering stalls, tab
// backgrounding, memory pressure, scrolling far out of view) and
// won't always resume it. This component only ever pushes playback
// forward — it never calls pause() itself — so a video already
// playing is left alone (no play/pause thrashing while it scrolls
// through a moving carousel), and one the browser stopped gets
// nudged back to life as soon as possible.
export function AutoplayVideo({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;

    const tryPlay = () => {
      if (el.paused) {
        el.play().catch(() => {
          /* ignore autoplay rejection */
        });
      }
    };

    // Nudge playback forward on essentially every signal that could
    // mean it stopped: metadata ready, a browser-initiated pause,
    // a buffering stall/suspend, the tab coming back into focus, or
    // the card scrolling back into view.
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) tryPlay();
        },
        { threshold: 0.01 },
      );
      io.observe(el);
    }

    el.addEventListener("loadedmetadata", tryPlay);
    el.addEventListener("pause", tryPlay);
    el.addEventListener("stalled", tryPlay);
    el.addEventListener("suspend", tryPlay);
    el.addEventListener("waiting", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);

    // Also poll at a low frequency as a last-resort safety net —
    // cheap, and catches anything the event listeners above miss.
    const interval = window.setInterval(tryPlay, 2000);

    tryPlay();

    return () => {
      io?.disconnect();
      window.clearInterval(interval);
      el.removeEventListener("loadedmetadata", tryPlay);
      el.removeEventListener("pause", tryPlay);
      el.removeEventListener("stalled", tryPlay);
      el.removeEventListener("suspend", tryPlay);
      el.removeEventListener("waiting", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={label}
    />
  );
}
