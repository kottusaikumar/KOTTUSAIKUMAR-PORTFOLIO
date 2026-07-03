import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Bespoke Process-section mount: an orthogonal circuit schematic
// with per-step primitives and flowing pulses.
export function ProcessField({
  color,
  lightColor,
  stepCount,
  className,
  rainbow,
}: {
  color: string;
  lightColor?: string;
  stepCount: number;
  className?: string;
  rainbow?: boolean;
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
        import("../../lib/portfolio/processCircuit.js"),
      ]);
      if (disposed) return;
      const { ProcessCircuit } = mod as any;
      field = new ProcessCircuit({
        canvas,
        container: wrap,
        color,
        lightColor,
        stepCount,
        rainbow,
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
    })().catch((err) => console.error("Process circuit failed:", err));

    return () => {
      disposed = true;
      st?.kill();
      field?.dispose();
    };
  }, [color, lightColor, stepCount, rainbow]);

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
