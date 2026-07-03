import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Generic ambient particle field used behind the Skills and
// Contact sections (any section without its own bespoke scene).
// Motif + count + color are passed in per-section as props.
export function SectionField({
  color,
  lightColor,
  motif,
  count,
  className,
}: {
  color: string;
  lightColor?: string;
  motif?: "glass" | "paper" | "dust" | "gem" | "orb" | "shard" | "halo";
  count?: number;
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
      const [THREE, fieldMod] = await Promise.all([
        import("three"),
        import("../../lib/portfolio/ambientField.js"),
      ]);
      if (disposed) return;
      const { AmbientField } = fieldMod as any;
      field = new AmbientField({
        canvas,
        container: wrap,
        color,
        lightColor,
        motif,
        count,
        parallax: 0.5,
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
    })().catch((err) => console.error("Ambient field failed:", err));

    return () => {
      disposed = true;
      st?.kill();
      field?.dispose();
    };
  }, [color, lightColor, motif, count]);

  return (
    <div
      className={`section-field ${className ?? ""}`}
      ref={wrapRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
