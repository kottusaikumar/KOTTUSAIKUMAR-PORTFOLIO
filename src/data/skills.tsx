// Skills-grid content: one entry per tech badge shown in the
// "My Skills" section. Each entry either points at a colored
// simpleicons.org logo (`slug`) or supplies its own inline
// SVG / lucide icon (`icon`) for logos simpleicons renders poorly
// on this dark background.
import type { ReactNode } from "react";
import { Brain, Cpu, MessageSquare } from "lucide-react";

export const IconCSS3 = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 2l1.578 17.824L12 22l7.422-2.176L21 2H3zm14.116 4.879l-.166 1.874H8.92l.173 1.941h7.671l-.499 5.607-4.264 1.177-4.28-1.177-.29-3.27h1.924l.148 1.658 2.498.674 2.502-.674.271-3.033H7.037L6.54 6.879h10.576z"
      fill="#1572B6"
    />
  </svg>
);
export const IconFlask = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 2h6v1H9zm-.5 1h7l4.5 8v8a1 1 0 01-1 1h-14a1 1 0 01-1-1v-8L8.5 3zm1.5 1v6.5L5.07 19h13.86L14 10.5V4h-4zm1 8c2 0 4 1.5 4 3.5S13 19 11 19s-4-1.5-4-3.5S9.5 12 11 12z"
      fill="#222222"
    />
  </svg>
);
export const IconThreeJs = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 19.5h20L12 2zm0 3.5l7.5 13h-15L12 5.5zm-1.5 5v2h3v-2h-3zm0 3v2h3v-2h-3z"
      fill="#222222"
    />
  </svg>
);
export const IconTableau = () => (
  <svg
    viewBox="0 0 50 50"
    width="36"
    height="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23 2v8h-8v4h8v8h4v-8h8v-4h-8V2z" fill="#E97627" />
    <path d="M8 16v6H2v3h6v6h3v-6h6v-3H11v-6z" fill="#C0392B" />
    <path d="M39 16v6h-6v3h6v6h3v-6h6v-3h-6v-6z" fill="#5B9BD5" />
    <path d="M23 34v6h-8v4h8v6h4v-6h8v-4h-8v-6z" fill="#59A14F" />
  </svg>
);
export const IconPowerBI = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="8" width="4" height="12" rx="1" fill="#F2C811" />
    <rect
      x="7.5"
      y="4"
      width="4"
      height="16"
      rx="1"
      fill="#F2C811"
      opacity="0.85"
    />
    <rect
      x="13"
      y="11"
      width="4"
      height="9"
      rx="1"
      fill="#F2C811"
      opacity="0.7"
    />
    <rect
      x="18.5"
      y="14"
      width="3.5"
      height="6"
      rx="1"
      fill="#F2C811"
      opacity="0.55"
    />
  </svg>
);
export const IconGitHub = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      fill="#181717"
    />
  </svg>
);
export const IconVSCode = () => (
  <svg
    viewBox="0 0 24 24"
    width="36"
    height="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 20.06V3.939a1.5 1.5 0 00-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
      fill="#007ACC"
    />
  </svg>
);

export const SKILLS: {
  name: string;
  slug?: string;
  colored?: boolean;
  icon?: ReactNode;
}[] = [
  { name: "Python", slug: "python", colored: true },
  { name: "C++", slug: "cplusplus", colored: true },
  { name: "PostgreSQL", slug: "postgresql", colored: true },
  { name: "Machine Learning", icon: <Brain size={36} /> },
  { name: "Deep Learning", icon: <Cpu size={36} /> },
  { name: "NLP", icon: <MessageSquare size={36} /> },
  { name: "React", slug: "react", colored: true },
  { name: "HTML5", slug: "html5", colored: true },
  { name: "CSS3", icon: <IconCSS3 /> },
  { name: "TensorFlow", slug: "tensorflow", colored: true },
  { name: "PyTorch", slug: "pytorch", colored: true },
  { name: "Keras", slug: "keras", colored: true },
  { name: "Pandas", slug: "pandas", colored: true },
  { name: "NumPy", slug: "numpy", colored: true },
  { name: "Scikit-learn", slug: "scikitlearn", colored: true },
  { name: "LangChain", slug: "langchain", colored: true },
  { name: "FastAPI", slug: "fastapi", colored: true },
  { name: "Flask", icon: <IconFlask /> },
  { name: "Streamlit", slug: "streamlit", colored: true },
  { name: "Three.js", icon: <IconThreeJs /> },
  { name: "Tableau", icon: <IconTableau /> },
  { name: "Power BI", icon: <IconPowerBI /> },
  { name: "Docker", slug: "docker", colored: true },
  { name: "Git", slug: "git", colored: true },
  { name: "GitHub", icon: <IconGitHub /> },
  { name: "VS Code", icon: <IconVSCode /> },
];

// Resolve a simpleicons.org logo URL for a given skill slug.
// White variant is used when the section background is dark.
export function skillIconUrl(slug: string, colored?: boolean) {
  return colored
    ? `https://cdn.simpleicons.org/${slug}`
    : `https://cdn.simpleicons.org/${slug}/ffffff`;
}

// Render whichever icon representation a skill entry has:
// a fetched simpleicons logo, or a locally-defined icon component.
export function renderSkillIcon(s: {
  slug?: string;
  colored?: boolean;
  icon?: ReactNode;
  name: string;
}) {
  if (s.slug) {
    return (
      <img
        src={skillIconUrl(s.slug, s.colored)}
        alt={s.name}
        loading="lazy"
        width={36}
        height={36}
      />
    );
  }
  return <>{s.icon}</>;
}
