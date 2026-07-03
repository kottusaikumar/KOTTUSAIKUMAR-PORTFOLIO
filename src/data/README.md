# src/data

All the actual **content** of the portfolio, kept separate from the
components that render it. Edit these files to change text, links, stats,
or the skills grid — you shouldn't need to touch any component or CSS
file just to update copy.

| File             | Powers                                   | Notes                                                                                                                                                                                                                                                                                    |
| ---------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projects.ts`    | "My Projects" card grid                  | Each entry needs a `video` path (must exist under `public/projects/videos/`) and a GitHub `link`.                                                                                                                                                                                        |
| `experience.ts`  | "My Experience" timeline                 | One card per role.                                                                                                                                                                                                                                                                       |
| `process.ts`     | "My Process" 4-step strip                |                                                                                                                                                                                                                                                                                          |
| `proof.ts`       | "Proof Wall" stat tiles                  |                                                                                                                                                                                                                                                                                          |
| `skills.tsx`     | "My Skills" grid                         | Also defines the SVG icon components used for logos that render poorly via the simpleicons.org CDN (`IconCSS3`, `IconFlask`, etc.), plus `skillIconUrl` / `renderSkillIcon` helpers. This is `.tsx` (not `.ts`) because it returns JSX.                                                  |
| `heroSlides.ts`  | The hero carousel at the top of the page | `TOON_IMAGES` (the 4 rotating slides) and `GRAIN_SVG` (the film-grain overlay texture, as a data URI).                                                                                                                                                                                   |
| `scrollTheme.ts` | The scroll-driven background crossfade   | One background color per section — read by the orchestration effect in `components/sections/Portfolio.tsx`. This is the color the _whole page background_ fades to while that section is on screen; it should usually match that section's dominant CSS color in `styles/portfolio.css`. |

None of these files import from `components/` — content stays independent
of how it's displayed.
