# src/lib/portfolio

The actual Three.js scene implementations (plain `.js`, not React) that
power each section's animated background. Each exports a class with an
`init(THREE)`, `setScrollProgress(progress)`, and `dispose()` method —
loaded lazily and mounted onto a `<canvas>` by the matching wrapper
component in `src/components/scenes/`.

| File                                | Class                         | Mounted by                                                                                                              |
| ----------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ambientField.js`                   | `AmbientField`                | `components/scenes/SectionField.tsx`                                                                                    |
| `experienceTimeline.js`             | `ExperienceTimeline`          | `components/scenes/ExperienceField.tsx`                                                                                 |
| `processCircuit.js`                 | `ProcessCircuit`              | `components/scenes/ProcessField.tsx`                                                                                    |
| `aboutOrbit.js`                     | `AboutOrbit`                  | `components/scenes/AboutField.tsx`                                                                                      |
| `proofRadar.js`                     | `ProofRadar`                  | `components/scenes/ProofField.tsx`                                                                                      |
| `workGallery.js`                    | `WorkGallery`                 | _(not currently used — Projects now uses a plain video-card grid instead of a 3D scene; kept for reference)_            |
| `heroScene.js`                      | —                             | _(not currently wired up — the hero uses the 2D character carousel in `components/sections/Hero.tsx` instead)_          |
| `scrubEngine.js`, `tunnelShader.js` | `ScrubEngine`, shader strings | Shared low-level helpers some of the classes above build on.                                                            |
| `portfolio.d.ts`                    | —                             | TypeScript ambient module declarations for all the `.js` files above, so they can be `import`ed from `.tsx` with types. |

If you're changing what a section's background _looks like_, this is the
file to edit. If you're changing _which section it appears in_ or _what
color it's passed_, that's in `src/components/scenes/` and
`components/sections/Portfolio.tsx` instead.
