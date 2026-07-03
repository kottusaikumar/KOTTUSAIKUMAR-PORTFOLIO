// The main page: fixed nav, hero, and every scroll-driven section
// (Skills, Experience, Process, About, Projects, Proof, Contact).
//
// This stays one file rather than one-component-per-section because
// almost everything in it is wired to a *single* shared GSAP/Lenis/
// ScrollTrigger orchestration effect below (smooth scroll, the
// scroll-driven background colour crossfade, section-curtain wipes,
// pinned reveals, magnetic CTAs, etc.) that queries across every
// section's DOM by class name. Splitting the JSX out further would
// mean threading a lot of shared refs across files for no real
// clarity gain — the content data, the 3D background "scenes", and
// this composition/animation layer are already separated (see
// src/data and src/components/scenes).
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ExternalLink, Info, Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import "../../styles/portfolio.css";

import { PROJECTS } from "../../data/projects";
import { EXPERIENCE } from "../../data/experience";
import { PROCESS } from "../../data/process";
import { PROOF } from "../../data/proof";
import { SKILLS, renderSkillIcon } from "../../data/skills";
import { SCROLL_THEME } from "../../data/scrollTheme";

import { ToonHubHero } from "./Hero";
import { SectionField } from "../scenes/SectionField";
import { ExperienceField } from "../scenes/ExperienceField";
import { ProcessField } from "../scenes/ProcessField";
import { AboutField } from "../scenes/AboutField";
import { ProofField } from "../scenes/ProofField";
import { AutoplayVideo } from "../scenes/AutoplayVideo";
import { SectionCurtain } from "../scenes/SectionCurtain";

gsap.registerPlugin(ScrollTrigger);

export function Portfolio() {
  const headerCTARef = useRef<HTMLAnchorElement | null>(null);
  const resumeCTARef = useRef<HTMLAnchorElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  const scrollBarRef = useRef<HTMLDivElement | null>(null);
  const skillsSlabRef = useRef<HTMLDivElement | null>(null);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  /* Projects auto-scroll marquee — the track holds two back-to-back
     copies of PROJECTS so it can loop seamlessly (see the effect
     below); this ref is what that effect drives via `scrollLeft`. */
  const workTrackRef = useRef<HTMLDivElement | null>(null);


  /* Smooth scroll */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
    };
  }, []);

  /* Premium section motion director */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".premium-3d-scene").forEach((scene) => {
        const section = scene.closest(".section-world");
        gsap.fromTo(
          scene,
          { yPercent: 9, scale: 1.08, opacity: 0.45, rotateX: 5 },
          {
            yPercent: -7,
            scale: 1,
            opacity: 1,
            rotateX: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          },
        );
      });

      gsap.utils
        .toArray<HTMLElement>(".portal-ring, .circuit-node")
        .forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 ? -22 : 22,
            x: i % 3 ? 14 : -14,
            rotate: i % 2 ? 4 : -4,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: el.closest(".section-world"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          });
        });

      gsap.utils.toArray<HTMLElement>(".section-gateway").forEach((gate) => {
        gsap.fromTo(
          gate,
          { clipPath: "inset(0 50% 0 50%)", opacity: 0.2, scaleX: 0.75 },
          {
            clipPath: "inset(0 0% 0 0%)",
            opacity: 1,
            scaleX: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gate.parentElement,
              start: "top 86%",
              end: "top 30%",
              scrub: 0.7,
            },
          },
        );
      });

      /* Unique gateway-curtain reveal per section ───────────── */
      gsap.utils.toArray<HTMLElement>(".curtain-shutter").forEach((c) => {
        const sec = c.closest(".section-world");
        const tl = {
          trigger: sec,
          start: "top 92%",
          end: "top 18%",
          scrub: 0.6,
        };
        gsap.to(c.querySelector(".curtain-panel-l"), {
          xPercent: -100,
          ease: "none",
          scrollTrigger: tl,
        });
        gsap.to(c.querySelector(".curtain-panel-r"), {
          xPercent: 100,
          ease: "none",
          scrollTrigger: tl,
        });
      });

      gsap.utils.toArray<HTMLElement>(".curtain-iris").forEach((c) => {
        gsap.fromTo(
          c,
          { clipPath: "circle(150% at 50% 50%)" },
          {
            clipPath: "circle(0% at 50% 50%)",
            ease: "none",
            scrollTrigger: {
              trigger: c.closest(".section-world"),
              start: "top 92%",
              end: "top 16%",
              scrub: 0.6,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".curtain-dissolve").forEach((c) => {
        gsap.fromTo(
          c,
          { opacity: 1, scale: 1, filter: "blur(0px)" },
          {
            opacity: 0,
            scale: 1.32,
            filter: "blur(28px)",
            ease: "none",
            scrollTrigger: {
              trigger: c.closest(".section-world"),
              start: "top 92%",
              end: "top 20%",
              scrub: 0.6,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".curtain-blinds").forEach((c) => {
        const bars = c.querySelectorAll<HTMLElement>(".curtain-bar");
        gsap.set(bars, { transformOrigin: "top" });
        gsap.to(bars, {
          scaleY: 0,
          stagger: 0.045,
          ease: "none",
          scrollTrigger: {
            trigger: c.closest(".section-world"),
            start: "top 92%",
            end: "top 16%",
            scrub: 0.6,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".curtain-scanline").forEach((c) => {
        const tl = {
          trigger: c.closest(".section-world"),
          start: "top 92%",
          end: "top 16%",
          scrub: 0.6,
        };
        gsap.fromTo(
          c,
          { clipPath: "inset(0% 0 0% 0)" },
          { clipPath: "inset(100% 0 0% 0)", ease: "none", scrollTrigger: tl },
        );
        gsap.fromTo(
          c.querySelector(".curtain-scan-line"),
          { top: "0%", opacity: 1 },
          { top: "100%", opacity: 0, ease: "none", scrollTrigger: tl },
        );
      });

      gsap.utils.toArray<HTMLElement>(".curtain-diamond").forEach((c) => {
        gsap.fromTo(
          c,
          { clipPath: "polygon(50% -60%, 160% 50%, 50% 160%, -60% 50%)" },
          {
            clipPath: "polygon(50% 49%, 51% 50%, 50% 51%, 49% 50%)",
            ease: "none",
            scrollTrigger: {
              trigger: c.closest(".section-world"),
              start: "top 92%",
              end: "top 16%",
              scrub: 0.6,
            },
          },
        );
      });

      gsap.set(".skills-stage", {
        perspective: 1400,
        transformStyle: "preserve-3d",
      });
      gsap.set(skillsSlabRef.current, {
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
        rotateX: -10,
        rotateY: 13,
        rotateZ: -1.5,
        y: 30,
      });
      gsap.to(skillsSlabRef.current, {
        rotateX: 9,
        rotateY: -14,
        rotateZ: 1.5,
        y: -22,
        ease: "none",
        scrollTrigger: {
          trigger: "#skills",
          start: "top 78%",
          end: "bottom 22%",
          scrub: 1.1,
        },
      });

      const skillCells = gsap.utils.toArray<HTMLElement>(".skill-cell");
      gsap.set(skillCells, {
        transformStyle: "preserve-3d",
        transformPerspective: 900,
        transformOrigin: "50% 50%",
      });
      // (Entrance fade removed — cards stay visible at all times; the
      // scroll-scrubbed pulse below is the only per-cell scroll effect,
      // so scrolling up/down only ever moves which cell is zoomed in,
      // never makes cards appear/disappear.)

      const skillPulseTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#skills",
          start: "top 78%",
          end: "bottom 16%",
          scrub: 0.25,
        },
      });
      skillCells.forEach((cell, i) => {
        const step = i * 0.135;
        const swing = i % 2 === 0 ? 4 : -4;
        skillPulseTl
          .to(
            cell,
            {
              scale: 1.28,
              z: 120,
              rotateX: -5,
              rotateY: swing,
              opacity: 1,
              filter: "brightness(1.16)",
              boxShadow:
                "0 26px 78px rgba(61,255,208,.22), 0 0 0 1px rgba(61,255,208,.34)",
              ease: "power2.out",
              duration: 0.11,
            },
            step,
          )
          .to(
            cell,
            {
              scale: 0.98,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              filter: "brightness(1)",
              boxShadow: "",
              ease: "power2.inOut",
              duration: 0.13,
            },
            step + 0.12,
          );
      });

      gsap.utils.toArray<HTMLElement>(".experience-card").forEach((card, i) => {
        gsap.from(card, {
          rotateX: -18,
          rotateY: i % 2 ? -8 : 8,
          y: 70,
          opacity: 0,
          transformOrigin: "50% 0%",
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            end: "top 46%",
            scrub: 0.8,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".process-card").forEach((card, i) => {
        gsap.from(card, {
          y: i % 2 ? 80 : -80,
          rotateZ: i % 2 ? 4 : -4,
          opacity: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            end: "top 48%",
            scrub: 0.9,
          },
        });
      });
      gsap.to(".process-rail-line", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#process",
          start: "top 70%",
          end: "bottom 45%",
          scrub: true,
        },
      });

      gsap.to(".about-illustration", {
        yPercent: -8,
        rotate: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.from(".about-lede", {
        opacity: 0,
        y: 28,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-copy", start: "top 72%" },
      });

      gsap.utils.toArray<HTMLElement>(".work-item").forEach((item, i) => {
        const media = item.querySelector(".work-item-media");
        const info = item.querySelector(".work-item-info");
        const fromLeft = i % 2 === 0;

        gsap.set(item, {
          transformStyle: "preserve-3d",
          transformPerspective: 1200,
          transformOrigin: "50% 50%",
        });

        gsap.fromTo(
          item,
          {
            xPercent: fromLeft ? -22 : 22,
            rotateY: fromLeft ? 18 : -18,
            scale: 0.9,
            opacity: 0,
          },
          {
            xPercent: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              end: "top 42%",
              scrub: 0.75,
            },
          },
        );

        gsap.fromTo(
          media,
          {
            clipPath: "inset(18% 14% 18% 14% round 30px)",
            z: -130,
            scale: 0.94,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 30px)",
            z: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              end: "top 45%",
              scrub: 0.9,
            },
          },
        );

        gsap.fromTo(
          media?.querySelector("img") ?? [],
          { scale: 1.16, yPercent: -4 },
          {
            scale: 1.03,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.from(info, {
          x: fromLeft ? 56 : -56,
          opacity: 0,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 78%" },
        });

        gsap.to(item, {
          scale: 1.035,
          z: 70,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: item,
            start: "top 58%",
            end: "bottom 42%",
            scrub: 0.35,
            toggleActions: "play reverse play reverse",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".proof-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          scale: 0.72,
          rotate: i % 2 ? 7 : -7,
          y: 50,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: card, start: "top 82%" },
        });
      });

      gsap.from(".contact-form", {
        rotateX: 12,
        y: 80,
        opacity: 0,
        transformOrigin: "50% 0%",
        ease: "power3.out",
        scrollTrigger: { trigger: "#contact", start: "top 70%" },
      });
    });

    return () => ctx.revert();
  }, []);

  /* Scroll-driven background colour crossfade */
  useEffect(() => {
    const layer = bgLayerRef.current;
    if (!layer) return;

    const sectionEls = SCROLL_THEME.map((theme) => ({
      theme,
      el: document.getElementById(theme.id),
    })).filter(
      (s): s is { theme: (typeof SCROLL_THEME)[number]; el: HTMLElement } =>
        !!s.el,
    );

    let currentId = "";

    const apply = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let match: (typeof sectionEls)[number] | undefined;
      for (const s of sectionEls) {
        const rect = s.el.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const bottom = top + rect.height;
        if (viewportCenter >= top && viewportCenter < bottom) {
          match = s;
          break;
        }
      }
      if (!match) {
        match =
          viewportCenter <
          (sectionEls[0]?.el.getBoundingClientRect().top ?? 0) + window.scrollY
            ? sectionEls[0]
            : sectionEls[sectionEls.length - 1];
      }
      if (!match || match.theme.id === currentId) return;
      currentId = match.theme.id;
      gsap.to(layer, {
        backgroundColor: match.theme.bg,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
      document.body.setAttribute("data-tone", match.theme.id);
    };

    gsap.set(layer, { backgroundColor: SCROLL_THEME[0].bg });
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    const st = ScrollTrigger.create({ onRefresh: apply });
    return () => {
      st.kill();
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  /* Scroll progress bar */
  useEffect(() => {
    const bar = scrollBarRef.current;
    if (!bar) return;
    const update = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : "0%";
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  /* Projects auto-scroll marquee — continuously drifts the track to
     the right at a constant speed (frame-rate independent, via
     requestAnimationFrame) and wraps seamlessly: the track renders
     two back-to-back copies of PROJECTS, and once scrollLeft passes
     the width of the first copy, it's decremented by that same
     amount — since the second copy is pixel-identical, the wrap is
     invisible, giving an endless right-scrolling loop instead of a
     hard reset back to the start. Pauses on hover/touch/manual
     scroll so visitors can still read a card, then resumes shortly
     after they let go. */
  useEffect(() => {
    const track = workTrackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const SPEED = 34; // px / second
    let raf = 0;
    let last = performance.now();
    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused && document.visibilityState === "visible") {
        const singleSetWidth = track.scrollWidth / 2;
        let next = track.scrollLeft + SPEED * dt;
        if (singleSetWidth > 0 && next >= singleSetWidth) {
          next -= singleSetWidth;
        }
        track.scrollLeft = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => {
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
    };
    const scheduleResume = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
        last = performance.now();
      }, 1600);
    };

    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerleave", scheduleResume);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("touchend", scheduleResume);
    track.addEventListener("wheel", scheduleResume, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      track.removeEventListener("pointerenter", pause);
      track.removeEventListener("pointerleave", scheduleResume);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("touchend", scheduleResume);
      track.removeEventListener("wheel", scheduleResume);
    };
  }, []);

  /* Mobile nav panel — close on Escape, close if the viewport is
     resized back past the desktop breakpoint, and lock page scroll
     while it's open so it reads as a real overlay, not a section. */
  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 860) setMobileNavOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileNavOpen]);

  /* Contact link scroll-lighting */
  useEffect(() => {
    const COLORS = [
      "#7FE8C8", // skills — forest mint
      "#9C8C7D", // experience — warm editorial gray
      "#B86B2D", // process — champagne copper
      "#7E9C7A", // about — soft sage
      "#E8C988", // work — gallery gold
      "#7C99DD", // proof — midnight platinum
      "#B89874", // contact — warm taupe
    ];
    let hueIndex = 0;
    let ticking = false;
    const links =
      document.querySelectorAll<HTMLAnchorElement>(".contact-links a");
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const contactSection = document.getElementById("contact");
        if (!contactSection) {
          ticking = false;
          return;
        }
        const rect = contactSection.getBoundingClientRect();
        const visibleFrac = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight - rect.top) /
              (window.innerHeight + rect.height),
          ),
        );
        if (visibleFrac > 0.05) {
          hueIndex =
            Math.floor(visibleFrac * COLORS.length * 2) % COLORS.length;
          links.forEach((link, i) => {
            const c = COLORS[(hueIndex + i) % COLORS.length];
            link.style.setProperty("--link-glow", c);
            link.style.color = c;
            link.style.borderColor = c + "55";
            link.style.boxShadow = `0 0 18px ${c}44, 0 0 6px ${c}33`;
          });
        } else {
          links.forEach((link) => {
            link.style.color = "";
            link.style.borderColor = "";
            link.style.boxShadow = "";
          });
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-reveal */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Custom cursor removed — using the native mouse arrow everywhere. */

  /* Magnetic CTAs */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const cleanups: (() => void)[] = [];
    [headerCTARef.current, resumeCTARef.current].forEach((item) => {
      if (!item) return;
      const onMove = (e: MouseEvent) => {
        const r = item.getBoundingClientRect();
        gsap.to(item, {
          x: (e.clientX - r.left - r.width / 2) * 0.35,
          y: (e.clientY - r.top - r.height / 2) * 0.35,
          duration: 0.3,
          ease: "power2.out",
        });
      };
      const onLeave = () =>
        gsap.to(item, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1.1,0.4)",
        });
      item.addEventListener("mousemove", onMove);
      item.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        item.removeEventListener("mousemove", onMove);
        item.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  /* Contact form */
  const onContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name");
    const email = fd.get("email");
    const company = fd.get("company") || "Not provided";
    const message = fd.get("message");
    if (!name || !email || !message) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    const text = `*New Contact Form Submission*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Company:* ${company}%0A*Message:* ${message}`;
    window.open(`https://wa.me/916304830339?text=${text}`, "_blank");
    toast.success("Redirecting you to WhatsApp!");
  };

  /* ── JSX ─────────────────────────────────────────────── */
  return (
    <>
      {/* Fixed background — colour crossfades per section on scroll */}
      <div id="bg-layer" ref={bgLayerRef} aria-hidden="true" />

      {/* Scroll progress bar */}
      <div id="scroll-bar" ref={scrollBarRef} aria-hidden="true" />

      {/* HEADER */}
      <header className="site-header">
        <div className="nav-pill">
          <a href="#hero" className="nav-logo" aria-label="Home">
            KOTTU SAIKUMAR
          </a>
          <nav className="nav-items" aria-label="Primary">
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#process">Process</a>
            <a href="#about">About</a>
            <a href="#work">Projects</a>
            <a href="#proof">Proof</a>
          </nav>
          <a href="#contact" className="nav-cta" ref={headerCTARef}>
            Get in touch
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          id="mobile-nav-panel"
          className={`nav-mobile-panel${mobileNavOpen ? " is-open" : ""}`}
          aria-hidden={!mobileNavOpen}
        >
          <nav aria-label="Primary (mobile)">
            <a href="#skills" onClick={() => setMobileNavOpen(false)}>
              Skills
            </a>
            <a href="#experience" onClick={() => setMobileNavOpen(false)}>
              Experience
            </a>
            <a href="#process" onClick={() => setMobileNavOpen(false)}>
              Process
            </a>
            <a href="#about" onClick={() => setMobileNavOpen(false)}>
              About
            </a>
            <a href="#work" onClick={() => setMobileNavOpen(false)}>
              Projects
            </a>
            <a href="#proof" onClick={() => setMobileNavOpen(false)}>
              Proof
            </a>
            <a
              href="#contact"
              className="nav-mobile-cta"
              onClick={() => setMobileNavOpen(false)}
            >
              Get in touch
            </a>
          </nav>
        </div>
        {mobileNavOpen && (
          <div
            className="nav-mobile-scrim"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
        )}
      </header>

      {/* HERO — ToonHub carousel */}
      <ToonHubHero />

      {/* SKILLS */}
      <section
        className="skills reveal section-world section-world--skills"
        id="skills"
      >
        <div className="section-gateway gateway-skills" aria-hidden="true" />
        <SectionField
          color="#D8CDBA"
          lightColor="#FFF6E8"
          motif="glass"
          count={9}
        />
        <div className="skills-header">
          <span className="section-eyebrow">/ 01 — CAPABILITIES</span>
          <h2 className="skills-title">
            My <strong>Skills</strong>
          </h2>
        </div>
        <div className="skills-stage">
          <div className="skill-slab" ref={skillsSlabRef}>
            <div className="skill-slab-shine" aria-hidden="true" />
            <div className="skills-grid">
              {SKILLS.map((s) => (
                <div className="skill-cell" key={s.name} title={s.name}>
                  <div className="skill-cell-icon">{renderSkillIcon(s)}</div>
                  <span className="skill-cell-name">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        className="experience reveal section-world section-world--experience"
        id="experience"
      >
        <div
          className="section-gateway gateway-experience"
          aria-hidden="true"
        />
        <SectionCurtain variant="shutter" color="#1A0B12" />
        <ExperienceField
          color="#6B1028"
          lightColor="#C89B3C"
          nodeCount={EXPERIENCE.length}
        />
        <div className="experience-header">
          <span className="section-eyebrow">/ 02 — WORK HISTORY</span>
          <h2 className="experience-title">
            My <strong>Experience</strong>
          </h2>
        </div>
        <div className="experience-list">
          {EXPERIENCE.map((exp, i) => (
            <article className="experience-card" key={i}>
              <div className="experience-card-meta">
                <div className="experience-card-left">
                  {exp.logo && (
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="experience-logo"
                    />
                  )}
                  <span className="experience-company">
                    {exp.role} at {exp.company}
                  </span>
                </div>
                <span className="experience-period">{exp.period}</span>
              </div>
              <p className="experience-desc">{exp.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section
        className="process reveal section-world section-world--process"
        id="process"
      >
        <div className="section-gateway gateway-process" aria-hidden="true" />
        <SectionCurtain variant="iris" color="#FAF8F4" />
        <div
          className="premium-3d-scene process-circuit-world"
          aria-hidden="true"
        >
          <span className="circuit-node node-a" />
          <span className="circuit-node node-b" />
          <span className="circuit-node node-c" />
          <span className="circuit-node node-d" />
          <span className="circuit-path path-a" />
          <span className="circuit-path path-b" />
        </div>
        <div className="process-header">
          <span className="section-eyebrow">/ 03 — HOW I BUILD</span>
          <h2 className="process-title">
            My <strong>Process</strong>
          </h2>
          <p className="process-intro">
            A premium build should feel directed, not decorated. This section
            turns my workflow into a scroll-driven system map.
          </p>
        </div>
        <div className="process-rail" aria-hidden="true">
          <span className="process-rail-line" />
          <ProcessField
            color="#A97846"
            lightColor="#FFE3B8"
            stepCount={PROCESS.length}
          />
        </div>
        <div className="process-grid">
          {PROCESS.map((item) => (
            <article className="process-card" key={item.step}>
              <span className="process-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        className="about reveal section-world section-world--about"
        id="about"
      >
        <div className="section-gateway gateway-about" aria-hidden="true" />
        <SectionCurtain variant="dissolve" color="#0C2E22" />
        <div className="about-inner about-inner--split">
          <div className="about-illustration">
            <AboutField color="#1F9C6B" lightColor="#F3C969" facetCount={7} />
            <img src="/about-me.png" alt="About Me" />
          </div>
          <div className="about-copy">
            <span className="section-eyebrow">/ 04 — WHO I AM</span>
            <h2 className="about-title">
              About <strong>Me</strong>
            </h2>
            <p className="about-lede">
              I'm a passionate Full-Stack AI Developer with a strong foundation
              in Python, Machine Learning, and AI Engineering. I enjoy combining
              data-driven intelligence with clean, user-friendly interfaces to
              build impactful and scalable applications.
            </p>
            <p className="about-lede">
              My journey began during my engineering studies, where I developed
              a deep interest in Data Science and Artificial Intelligence. Since
              then, I've continuously expanded my skills across Machine
              Learning, Deep Learning, NLP, and full-stack development.
            </p>
            <p className="about-lede">
              Beyond coding, I enjoy exploring AI research trends, experimenting
              with ML models, and building practical projects that solve
              real-world problems. I actively maintain my work on GitHub and
              continuously learn from the evolving tech ecosystem.
            </p>
            <a
              href="https://drive.google.com/file/d/1dinXqMl82nn4RZt2OMEf1ajdir6K6NeH/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="about-cta"
              ref={resumeCTARef}
            >
              Download Resume ↓
            </a>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        className="work reveal section-world section-world--work"
        id="work"
      >
        <div className="work-header">
          <span className="section-eyebrow">/ 05 — SELECTED WORK</span>
          <h2 className="work-title">
            My <strong>Projects</strong>
          </h2>
        </div>
        <div className="work-carousel">
          <div className="work-track" ref={workTrackRef}>
          {[...PROJECTS, ...PROJECTS].map((p, i) => {
            const isClone = i >= PROJECTS.length;
            return (
              <div
                key={`${p.id}-${i}`}
                className="work-card reveal"
                aria-hidden={isClone ? true : undefined}
              >
                <div className="work-card-media">
                  <AutoplayVideo src={p.video} label={p.name} />
                </div>
                <div className="work-card-body">
                  <div className="work-card-title-row">
                    <h3 className="work-card-name">{p.name}</h3>
                    <button
                      type="button"
                      className="work-card-info-btn"
                      tabIndex={isClone ? -1 : undefined}
                      aria-label={
                        openProjectId === p.id
                          ? `Hide description for ${p.name}`
                          : `Show description for ${p.name}`
                      }
                      aria-expanded={openProjectId === p.id}
                      onClick={() =>
                        setOpenProjectId(openProjectId === p.id ? null : p.id)
                      }
                    >
                      {openProjectId === p.id ? (
                        <X size={14} />
                      ) : (
                        <Info size={14} />
                      )}
                      <span className="work-card-info-tip" role="tooltip">
                        {openProjectId === p.id
                          ? "Click to hide description"
                          : "Click to view description"}
                      </span>
                    </button>
                  </div>
                  {openProjectId === p.id && (
                    <p className="work-card-description">{p.description}</p>
                  )}
                  <div className="work-card-row">
                    <span className="work-card-label">Focus</span>
                    <span className="work-card-value">{p.focus}</span>
                  </div>
                  <div className="work-card-row work-card-row-bottom">
                    <div>
                      <span className="work-card-label">Highlight</span>
                      <span className="work-card-value work-card-highlight">
                        {p.highlight}
                      </span>
                      <span className="work-card-underline" />
                    </div>
                    <a
                      href={p.link}
                      className="work-card-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isClone ? -1 : undefined}
                      aria-label={`View ${p.name}`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section
        className="proof reveal section-world section-world--proof"
        id="proof"
      >
        <div className="section-gateway gateway-proof" aria-hidden="true" />
        <SectionCurtain variant="scanline" color="#120E22" />
        <ProofField
          color="#E8B04B"
          lightColor="#FFE39A"
          nodeCount={PROOF.length}
        />
        <div className="proof-header">
          <span className="section-eyebrow">/ 06 — OUTCOMES</span>
          <h2 className="proof-title">
            Proof <strong>Wall</strong>
          </h2>
        </div>
        <div className="proof-orbit" aria-hidden="true" />
        <div className="proof-grid">
          {PROOF.map((item) => (
            <article className="proof-card" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section
        className="contact reveal section-world section-world--contact"
        id="contact"
      >
        <div className="section-gateway gateway-contact" aria-hidden="true" />
        <SectionCurtain variant="diamond" color="#111827" />
        <SectionField
          color="#4285F4"
          lightColor="#FBBC05"
          motif="halo"
          count={9}
        />
        <div className="premium-3d-scene chromatic-portal" aria-hidden="true">
          <span className="portal-ring portal-ring--blue" />
          <span className="portal-ring portal-ring--red" />
          <span className="portal-ring portal-ring--yellow" />
          <span className="portal-ring portal-ring--green" />
          <span className="portal-core" />
        </div>
        <div className="contact-grid">
          <div>
            <span className="section-eyebrow">/ 07 — LET'S CONNECT</span>
            <h2 className="contact-title">
              Get in <strong>Touch</strong>
            </h2>
            <a
              href="mailto:kottusaikumar2003@gmail.com"
              className="contact-email"
            >
              kottusaikumar2003@gmail.com
            </a>
            <div className="contact-links">
              <a
                href="https://github.com/kottusaikumar?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/sai-kumar-10541b269"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://x.com/433Saikumar"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter / X ↗
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={onContactSubmit}>
            <input type="text" name="name" placeholder="Your name" />
            <input type="email" name="email" placeholder="Email" />
            <input
              type="text"
              name="company"
              placeholder="Company / Recruiter (optional)"
            />
            <textarea
              name="message"
              placeholder="Message regarding job opportunity, role, or collaboration*"
            />
            <button type="submit">Send via WhatsApp</button>
          </form>
        </div>
        <footer className="site-footer">
          <span>© 2026 Kottu Saikumar</span>
          <span>Built with Three.js &amp; GSAP</span>
        </footer>
      </section>

      <Toaster />
    </>
  );
}
