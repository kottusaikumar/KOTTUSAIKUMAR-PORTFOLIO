# src/components/sections

| File            | What it is                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Hero.tsx`      | The full-viewport rotating character carousel shown before the user scrolls. Self-contained (owns its own state/effects); content comes from `data/heroSlides.ts`.                                                                                                                                                                                                                                                                   |
| `Portfolio.tsx` | The whole rest of the page: the fixed nav, and all 7 scroll sections (Skills, Experience, Process, About, Projects, Proof, Contact) plus the shared animation orchestration (Lenis smooth scroll, GSAP `ScrollTrigger` reveals, the scroll-driven background color crossfade, section-curtain transitions, magnetic buttons, the contact form). This is the file `src/routes/index.tsx` renders as the "/" route. |

## Why `Portfolio.tsx` isn't split further per-section

Almost everything inside it is wired to **one shared effect** that queries
across every section's DOM at once (by class name), rather than being
scoped to a single section — e.g. the background-color crossfade walks
`SCROLL_THEME` and looks up every section's `id`; magnetic CTAs
attach to interactive elements across the whole page; Lenis/ScrollTrigger
are initialized once for the whole scroll container. Splitting the JSX
into one-file-per-section would mean threading a lot of shared refs and
callbacks across file boundaries for very little clarity gain.

What _is_ already split out, so this file stays as light as reasonably
possible:

- **Content** → `src/data/*`
- **Per-section animated backgrounds** → `src/components/scenes/*`
- **Visual styling** → `src/styles/portfolio.css`

`Portfolio.tsx` itself is left as the composition + interaction layer:
which section goes in what order, what content it uses, and how scroll
turns into motion.
