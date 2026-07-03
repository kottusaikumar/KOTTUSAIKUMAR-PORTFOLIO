// The full-viewport rotating character carousel at the top of the
// page, shown before the user starts scrolling into the sections.
import { useCallback, useEffect, useRef, useState } from "react";
import { TOON_IMAGES, GRAIN_SVG } from "../../data/heroSlides";

export function ToonHubHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [labelVisible, setLabelVisible] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    TOON_IMAGES.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const advance = useCallback(
    (dir: "next" | "prev" = "next") => {
      if (isAnimating) return;
      setLabelVisible(false);
      setTimeout(() => {
        setIsAnimating(true);
        setActiveIndex((prev) =>
          dir === "next" ? (prev + 1) % 4 : (prev + 3) % 4,
        );
        setTimeout(() => setIsAnimating(false), 600);
        setLabelVisible(true);
      }, 220);
    },
    [isAnimating],
  );

  useEffect(() => {
    autoRef.current = setInterval(() => advance("next"), 2000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [advance]);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => advance("next"), 2000);
  };

  const navigate = (dir: "next" | "prev") => {
    advance(dir);
    resetAuto();
  };

  const center = activeIndex;
  const left = (activeIndex + 3) % 4;
  const right = (activeIndex + 1) % 4;
  const back = (activeIndex + 2) % 4;

  const roleOf = (i: number) => {
    if (i === center) return "center";
    if (i === left) return "left";
    if (i === right) return "right";
    return "back";
  };

  const itemStyle = (role: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      aspectRatio: "0.6 / 1",
      transition:
        "transform 600ms cubic-bezier(0.4,0,0.2,1), filter 600ms cubic-bezier(0.4,0,0.2,1), opacity 600ms cubic-bezier(0.4,0,0.2,1), left 600ms cubic-bezier(0.4,0,0.2,1)",
      willChange: "transform, filter, opacity",
    };
    switch (role) {
      case "center":
        return {
          ...base,
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.65})`,
          filter: "none",
          opacity: 1,
          zIndex: 20,
          left: "50%",
          height: isMobile ? "58%" : "84%",
          bottom: isMobile ? "18%" : "-4%",
        };
      case "left":
        return {
          ...base,
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.8,
          zIndex: 10,
          left: isMobile ? "18%" : "28%",
          height: isMobile ? "16%" : "27%",
          bottom: isMobile ? "30%" : "10%",
        };
      case "right":
        return {
          ...base,
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.8,
          zIndex: 10,
          left: isMobile ? "82%" : "72%",
          height: isMobile ? "16%" : "27%",
          bottom: isMobile ? "30%" : "10%",
        };
      case "back":
        return {
          ...base,
          transform: "translateX(-50%) scale(1)",
          filter: "blur(4px)",
          opacity: 0.6,
          zIndex: 5,
          left: "50%",
          height: isMobile ? "12%" : "20%",
          bottom: isMobile ? "30%" : "10%",
        };
      default:
        return base;
    }
  };

  return (
    <div
      id="hero"
      style={{
        backgroundColor: TOON_IMAGES[activeIndex].bg,
        transition: "background-color 600ms cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          minHeight: 480,
        }}
      >
        {/* Grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 50,
            backgroundImage: `url("${GRAIN_SVG}")`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
            opacity: 0.35,
          }}
        />

        {/* Big role label */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            // A pure viewport-% offset can land underneath the fixed
            // header on short/narrow mobile screens (e.g. with
            // devtools device toolbars) — `max()` guarantees it never
            // sits higher than the header's own footprint, whichever
            // of the two is taller for the current viewport.
            top: isMobile
              ? "max(10%, calc(var(--header-h) + 14px))"
              : "max(13%, calc(var(--header-h) + 14px))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 40,
            padding: "0 1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: isMobile
                ? "clamp(34px, 9vw, 54px)"
                : "clamp(50px, 7vw, 108px)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.0,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              textAlign: "center",
              whiteSpace: "nowrap",
              opacity: labelVisible ? 1 : 0,
              transition: "opacity 220ms ease",
              textShadow: "0 2px 32px rgba(0,0,0,0.15)",
            }}
          >
            {TOON_IMAGES[activeIndex].label}
          </span>
        </div>

        {/* Brand wordmark, top-left */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? "calc(var(--header-h) + 8px)" : "1.5rem",
            left: isMobile ? "1rem" : "2rem",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span
            style={{
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "white",
              opacity: 0.92,
              letterSpacing: "0.14em",
              lineHeight: 1,
            }}
          >
            KOTTUSAIKUMAR
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "white",
              opacity: 0.6,
              letterSpacing: "0.32em",
              lineHeight: 1,
            }}
          >
            Portfolio
          </span>
        </div>

        {/* Carousel */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          {TOON_IMAGES.map((img, i) => (
            <div key={i} style={itemStyle(roleOf(i))}>
              <img
                src={img.src}
                alt={`Character ${i + 1}`}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                }}
              />
            </div>
          ))}
        </div>

        {/* Dot progress indicators */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "1.5rem" : "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {TOON_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                resetAuto();
              }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width:
                  i === activeIndex
                    ? isMobile
                      ? "20px"
                      : "28px"
                    : isMobile
                      ? "6px"
                      : "8px",
                height: isMobile ? "6px" : "8px",
                borderRadius: "99px",
                backgroundColor:
                  i === activeIndex ? "white" : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 300ms ease, background-color 300ms ease",
              }}
            />
          ))}
        </div>

        {/* Scroll cue bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "1.5rem" : "2.5rem",
            left: isMobile ? "1rem" : "2.5rem",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.35rem",
            opacity: 0.7,
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              textTransform: "uppercase",
              color: "white",
              letterSpacing: "0.18em",
              writingMode: "vertical-rl",
            }}
          >
            scroll
          </span>
          <div
            style={{
              width: "1px",
              height: isMobile ? "28px" : "40px",
              backgroundColor: "rgba(255,255,255,0.6)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "40%",
                backgroundColor: "white",
                animation: "scrollSlide 1.6s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes scrollSlide {
            0%   { transform: translateY(-100%); opacity: 1; }
            60%  { transform: translateY(250%); opacity: 1; }
            61%  { opacity: 0; }
            100% { transform: translateY(250%); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
