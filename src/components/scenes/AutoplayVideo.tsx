import { useEffect, useRef } from "react";

// Project-card video thumb: sets `muted` + calls play() imperatively
// via a ref, since on SSR-hydrated <video> tags the `muted` JSX prop
// doesn't always land as a live DOM property before the browser's
// autoplay-policy check runs, silently leaving the video paused.
//
// It plays the video only while its card is actually on screen, and
// pauses it as soon as it scrolls out. The auto-scroll marquee keeps
// two full copies of every project mounted at once (10 <video>
// elements total for 5 projects), and every browser caps how many
// videos it will decode concurrently — trying to force-play all of
// them at once (the previous "never pause" approach) is exactly what
// pushed past that cap and made playback freeze/stutter. Capping it
// to "decode only what's visible" keeps concurrent decodes to a
// handful and is what actually makes playback smooth and consistent.
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
    const tryPause = () => {
      if (!el.paused) el.pause();
    };

    let isVisible = false;

    // Play only while the card is genuinely in (or near) the
    // viewport; pause the instant it isn't. rootMargin gives a
    // little runway so playback starts just before a card scrolls
    // fully into view rather than popping in mid-motion.
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisible = !!entry?.isIntersecting;
          if (isVisible) tryPlay();
          else tryPause();
        },
        { threshold: 0.15, rootMargin: "80px" },
      );
      io.observe(el);
    } else {
      isVisible = true;
    }

    // Re-nudge playback forward, but only for a card that's actually
    // visible — a buffering stall/suspend or a tab regaining focus
    // shouldn't resurrect a video the user has already scrolled away
    // from.
    const resumeIfVisible = () => {
      if (isVisible) tryPlay();
    };

    el.addEventListener("loadedmetadata", resumeIfVisible);
    el.addEventListener("stalled", resumeIfVisible);
    el.addEventListener("suspend", resumeIfVisible);
    el.addEventListener("waiting", resumeIfVisible);
    document.addEventListener("visibilitychange", resumeIfVisible);

    return () => {
      io?.disconnect();
      el.removeEventListener("loadedmetadata", resumeIfVisible);
      el.removeEventListener("stalled", resumeIfVisible);
      el.removeEventListener("suspend", resumeIfVisible);
      el.removeEventListener("waiting", resumeIfVisible);
      document.removeEventListener("visibilitychange", resumeIfVisible);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
