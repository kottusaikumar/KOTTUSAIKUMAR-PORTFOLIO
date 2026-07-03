# public

Static files served as-is at the site root (e.g. `public/about-me.png` is
served at `/about-me.png`). Referenced by path from `src/data/*` and
`src/components/sections/Portfolio.tsx`.

| File / folder           | Used by                              | Referenced as                                    |
| ----------------------- | ------------------------------------ | ------------------------------------------------ |
| `projects/videos/*.mp4` | The 5 "My Projects" cards            | `data/projects.ts` → each entry's `video` field  |
| `about-me.png`          | The About section portrait           | `components/sections/Portfolio.tsx`              |
| `vajra-logo.png`        | The company logo on Experience cards | `data/experience.ts` → each entry's `logo` field |
| `favicon.ico`           | Browser tab icon                     | linked from `src/routes/__root.tsx`              |

When adding a new project video: drop the `.mp4` into `projects/videos/`,
then add/point a `video` field at it in `src/data/projects.ts`.
