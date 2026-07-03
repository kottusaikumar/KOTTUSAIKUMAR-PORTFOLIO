# src/components/scenes

Each file here is a small React wrapper that mounts one Three.js
background scene into a section — lazy-loads `three` + the matching
module from `src/lib/portfolio/`, initializes it on a `<canvas>`, and
wires its scroll progress to GSAP `ScrollTrigger`. All follow the exact
same pattern; the only differences are which scene module they load and
which section they're used in.

| Component             | Section it's used in                                                                                                | Scene implementation                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `SectionField.tsx`    | Skills, Contact (generic — any section without a bespoke scene)                                                     | `lib/portfolio/ambientField.js`                                                                                           |
| `ExperienceField.tsx` | Experience                                                                                                          | `lib/portfolio/experienceTimeline.js`                                                                                     |
| `ProcessField.tsx`    | Process                                                                                                             | `lib/portfolio/processCircuit.js`                                                                                         |
| `AboutField.tsx`      | About                                                                                                               | `lib/portfolio/aboutOrbit.js`                                                                                             |
| `ProofField.tsx`      | Proof                                                                                                               | `lib/portfolio/proofRadar.js`                                                                                             |
| `AutoplayVideo.tsx`   | Projects (not a 3D scene — a `<video>` thumbnail helper that reliably autoplays muted/looped on SSR-hydrated pages) | —                                                                                                                         |
| `SectionCurtain.tsx`  | Every section                                                                                                       | The transition "wipe" (shutter / iris / dissolve / blinds / scanline / diamond) played as each section scrolls into view. |

`lib/portfolio/workGallery.js` exists but has no matching component here —
the Projects section now uses the plain white video-card grid instead of a
bespoke 3D scene. It's kept in `lib/portfolio/` in case that direction is
revisited later.

To add a new bespoke section scene: copy the closest existing file here,
point its `import("../../lib/portfolio/...")` at your new scene module,
and drop the resulting component into the section's JSX in
`components/sections/Portfolio.tsx`.
