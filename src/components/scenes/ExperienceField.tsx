import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Bespoke Experience-section mount: a 3D career path that draws
// itself on scroll, instead of the generic SectionField above.
export function ExperienceField({
  color,
  lightColor,
  nodeCount,
  className,
}: {
  color: string;
  lightColor?: string;
  nodeCount: number;
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
        import("../../lib/portfolio/experienceTimeline.js"),
      ]);
      if (disposed) return;
      const { ExperienceTimeline } = mod as any;
      field = new ExperienceTimeline({
        canvas,
        container: wrap,
        color,
        lightColor,
        nodeCount,
      });
      await field.init(THREE);
      if (disposed) {
        field.dispose();
        return;
      }

      st = ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => field.setScrollProgress(self.progress),
      });
    })().catch((err) => console.error("Experience timeline failed:", err));

    return () => {
      disposed = true;
      st?.kill();
      field?.dispose();
    };
  }, [color, lightColor, nodeCount]);

  return (
    <div
      className={`section-field section-field--vivid ${className ?? ""}`}
      ref={wrapRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
