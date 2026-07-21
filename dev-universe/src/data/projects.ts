export interface Project {
  id: number;
  name: string;
  desc: string;
  tags: string[];
  icon: string;
  logo: string;
  logoUrl: string;
  celestialType: string;
  color: string;
  glowColor: string;
  secondaryColor: string;
  emissiveColor: string;
  liveUrl: string;
  ghUrl: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Strand Craft",
    desc: "Custom bead customizer for designing, previewing, and exporting beadwork patterns with pixel-perfect controls and responsive live preview.",
    tags: ["React", "TypeScript", "Canvas", "Tailwind CSS", "UI Design"],
    icon: "🧶",
    logo: "SC",
    logoUrl: "/strand-craft.png",
    celestialType: "Bead Atelier",
    color: "#d946ef",
    glowColor: "#f472b6",
    secondaryColor: "#8b5cf6",
    emissiveColor: "#f9a8d4",
    liveUrl: "https://github.com/GaramHawa/strand-craft",
    ghUrl: "https://github.com/GaramHawa/strand-craft",
  },
  {
    id: 2,
    name: "Pixel Cursor",
    desc: "Custom mouse pointer studio for creating, animating, and exporting pixel-perfect cursors for web and desktop experiences.",
    tags: ["React", "TypeScript", "CSS", "Canvas", "UX"],
    icon: "🖱️",
    logo: "PC",
    logoUrl: "/pixel-cursor.png",
    celestialType: "Pointer Forge",
    color: "#22d3ee",
    glowColor: "#38bdf8",
    secondaryColor: "#0ea5e9",
    emissiveColor: "#7dd3fc",
    liveUrl: "https://pixel-cursor-phi.vercel.app/",
    ghUrl: "https://github.com/GaramHawa/pixel-cursor",
  },
  {
    id: 3,
    name: "URRJA",
    desc: "Peer-to-peer solar energy trading platform for gated communities with real-time node monitoring, marketplace matching, and microgrid transaction flow.",
    tags: ["Flask", "Python", "ESP32", "IoT", "Energy"],
    icon: "⚡",
    logo: "UR",
    logoUrl: "/urrja-logo.svg",
    celestialType: "Solar Exchange",
    color: "#f97316",
    glowColor: "#fb923c",
    secondaryColor: "#fcd34d",
    emissiveColor: "#fdba74",
    liveUrl: "https://github.com/GaramHawa/urrja",
    ghUrl: "https://github.com/GaramHawa/urrja",
  },
  {
    id: 4,
    name: "OvA Binary Decomposition",
    desc: "A generalized one-vs-all binary classification framework for scalable image recognition across diverse datasets using shared and independent model architectures.",
    tags: ["PyTorch", "Machine Learning", "Computer Vision", "AI", "Python"],
    icon: "🧠",
    logo: "OvA",
    logoUrl: "/binary-decomposition-logo.svg",
    celestialType: "Data Nebula",
    color: "#0f766e",
    glowColor: "#2dd4bf",
    secondaryColor: "#14b8a6",
    emissiveColor: "#5eead4",
    liveUrl: "https://github.com/GaramHawa/binary-decomposition",
    ghUrl: "https://github.com/GaramHawa/binary-decomposition",
  },
  {
    id: 5,
    name: "Otolith Analysis",
    desc: "Full-stack fish otolith morphology classification system with OpenCV preprocessing, PyTorch model inference, and a React-based researcher dashboard.",
    tags: ["Flask", "React", "OpenCV", "PyTorch", "Python"],
    icon: "🐟",
    logo: "OAS",
    logoUrl: "/otolith-logo.svg",
    celestialType: "Morphology Lab",
    color: "#1e3a8a",
    glowColor: "#2563eb",
    secondaryColor: "#3b82f6",
    emissiveColor: "#60a5fa",
    liveUrl: "https://github.com/GaramHawa/otolith-analysis",
    ghUrl: "https://github.com/GaramHawa/otolith-analysis",
  },
];

export const personalInfo = {
  name: "Vivek Changela",
  title: "Software Engineer & Full-Stack Developer",
  email: "vivekchangelawork@gmail.com",
  github: "github.com/GaramHawa",
  linkedin: "linkedin.com/in/vivek-changela-a5665a2aa",
  resumeUrl:
    "https://drive.google.com/file/d/1zQzSp2IgunaQtsNgRgcJ72oy11hN2IVu/view?usp=sharing",
  bio: "I build polished, user-focused web experiences with strong frontend craftsmanship, modern backend architecture, and a passion for turning ideas into reliable products.",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "Git",
    "Docker",
    "UI/UX",
    "Problem Solving",
  ],
};
