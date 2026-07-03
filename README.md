# Kottu Saikumar — Portfolio

[![Live Portfolio](https://img.shields.io/badge/Portfolio-Live-blue?style=for-the-badge)](https://kottusaikumar-portfolio.vercel.app/)

🌐 **Live Portfolio:** https://kottusaikumar-portfolio.vercel.app/

A single-page, scroll-driven portfolio site (TanStack Start + React + Three.js + GSAP). This README is a map of the project — start here if you're new to the codebase and want to know **where to make a change**.

---

## Quick orientation

| I want to...                                         | Go to                                                |
| ---------------------------------------------------- | ---------------------------------------------------- |
| Edit project/experience/skills text or links         | `src/data/`                                          |
| Change a section's colors or layout                  | `src/styles/portfolio.css` (search the section name) |
| Change the nav, hero, or how sections are assembled  | `src/components/sections/`                           |
| Change one section's animated 3D/particle background | `src/components/scenes/`                             |
| Add/replace a video, image, or other static file     | `public/`                                            |
| Change the route / page shell / `<head>` tags        | `src/routes/`                                        |

---

## Folder structure

```text
portfolio/
├── public/                    Static files served as-is (see public/README.md)
│   ├── projects/videos/       The 5 project demo clips shown in "My Projects"
│   ├── about-me.png           Portrait used in the About section
│   ├── vajra-logo.png         Company logo used in the Experience cards
│   └── favicon.ico
│
├── src/
│   ├── routes/                 TanStack Start file-based routes (see routes/README.md)
│   │   ├── __root.tsx           App shell: <html>/<head>, fonts, global CSS link
│   │   └── index.tsx            Route "/" — just wires up the Portfolio page
│   │
│   ├── components/
│   │   ├── sections/            The page itself (see components/sections/README.md)
│   │   │   ├── Hero.tsx          Rotating character carousel at the very top
│   │   │   └── Portfolio.tsx     Nav + all 7 sections + the shared scroll/animation logic
│   │   ├── scenes/               One file per animated section background
│   │   └── ui/                   Generic shadcn/ui primitives
│   │
│   ├── data/
│   │   ├── projects.ts          "My Projects" cards
│   │   ├── experience.ts        "My Experience" timeline
│   │   ├── process.ts           "My Process" steps
│   │   ├── proof.ts             "Proof Wall" stats
│   │   ├── skills.tsx           "My Skills" grid + icons
│   │   ├── heroSlides.ts        Hero carousel slides
│   │   └── scrollTheme.ts       Per-section background colors
│   │
│   ├── styles/
│   │   └── portfolio.css        All portfolio-specific CSS
│   │
│   ├── lib/
│   │   ├── portfolio/           Three.js scene implementations
│   │   └── utils.ts
│   │
│   ├── hooks/
│   ├── styles.css
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   └── routeTree.gen.ts
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## How a section is put together

Every section (Skills, Experience, Process, About, Projects, Proof, Contact) is composed the same way from three separate places:

### 1. Content
A plain data array in `src/data/`

Example:
```ts
experience.ts
```

### 2. Animated background
A component in:

```text
src/components/scenes/
```

Example:
```tsx
ExperienceField.tsx
```

These mount Three.js scenes for each section.

### 3. Layout + color
Markup lives in:

```text
src/components/sections/Portfolio.tsx
```

Visual styling lives in:

```text
src/styles/portfolio.css
```

Search by section name to locate styles quickly.

`Portfolio.tsx` remains one large file because most sections share:
- smooth scroll logic
- background color crossfades
- section transition wipes
- scroll reveal animations

---

## Tech Stack

- React
- TypeScript
- TanStack Start
- Vite
- Tailwind CSS
- Three.js
- GSAP
- ShadCN UI

---

## Features

- Premium scroll-driven animations
- Interactive 3D backgrounds
- Hero carousel
- Smooth section transitions
- Responsive portfolio design
- Project showcase with videos
- AI/ML-focused professional branding

---

## Running the project

```bash
npm install
npm run dev
npm run build
```

---

## Deployment

This project is deployed on Vercel.

Production URL:

https://kottusaikumar-portfolio.vercel.app/

---

## Author

**Kottu Saikumar**  
Full-Stack AI Developer | AI/ML Engineer  
Python • Machine Learning • NLP • Computer Vision • FastAPI • React
