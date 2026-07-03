import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Bespoke Proof-section mount: a continuously sweeping radar
// scanner with ping rings.
export function ProofField({
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
        import("../../lib/portfolio/proofRadar.js"),
      ]);
      if (disposed) return;
      const { ProofRadar } = mod as any;
      field = new ProofRadar({
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
        trigger: wrap.closest(".proof") || wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => field.setScrollProgress(self.progress),
      });
    })().catch((err) => console.error("Proof radar failed:", err));

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
