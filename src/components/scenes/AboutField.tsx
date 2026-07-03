import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Bespoke About-section mount: a slow orbit of organic facets
// around the portrait.
export function AboutField({
  color,
  lightColor,
  facetCount,
  className,
}: {
  color: string;
  lightColor?: string;
  facetCount: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let disposed = false;
    let field: any;
    let st: ScrollTrigger | undefined;

    (async () => {
      const [THREE, mod] = await Promise.all([
        import("three"),
        import("../../lib/portfolio/aboutOrbit.js"),
      ]);
      if (disposed) return;
      const { AboutOrbit } = mod as any;
      field = new AboutOrbit({
        canvas,
        container: wrap,
        color,
        lightColor,
        facetCount,
      });
      await field.init(THREE);
      if (disposed) {
        field.dispose();
        return;
      }

      st = ScrollTrigger.create({
        trigger: wrap.closest(".about") || wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => field.setScrollProgress(self.progress),
      });
    })().catch((err) => console.error("About orbit failed:", err));

    return () => {
      disposed = true;
      st?.kill();
      field?.dispose();
    };
  }, [color, lightColor, facetCount]);

  return (
    <div
      className={`section-field section-field--vivid about-orbit-field ${className ?? ""}`}
      ref={wrapRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
