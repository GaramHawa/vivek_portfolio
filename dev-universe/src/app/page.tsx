"use client";

import React, { useState, useCallback, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Terminal from "@/components/terminal/Terminal";
import Navbar from "@/components/ui/Navbar";
import ProjectModal from "@/components/ui/ProjectModal";
import AboutPanel from "@/components/ui/AboutPanel";
import type { Project } from "@/data/projects";

const WarpTransition = lazy(
  () => import("@/components/warp/WarpTransition")
);
const SpaceScene = lazy(
  () => import("@/components/space/SpaceScene")
);

type Phase = "terminal" | "warp" | "universe";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("terminal");
  const [mantra, setMantra] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleLaunch = useCallback((userMantra: string) => {
    setMantra(userMantra);
    setPhase("warp");
  }, []);

  const handleWarpComplete = useCallback(() => {
    setPhase("universe");
  }, []);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#030108]">
      <AnimatePresence mode="wait">
        {/* Phase 1: Terminal */}
        {phase === "terminal" && (
          <motion.div
            key="terminal"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Terminal onLaunch={handleLaunch} />
          </motion.div>
        )}

        {/* Phase 2: Warp */}
        {phase === "warp" && (
          <motion.div
            key="warp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="fixed inset-0 bg-black flex items-center justify-center">
                  <div className="warp-spinner" />
                </div>
              }
            >
              <WarpTransition onComplete={handleWarpComplete} />
            </Suspense>
          </motion.div>
        )}

        {/* Phase 3: Universe */}
        {phase === "universe" && (
          <motion.div
            key="universe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="w-full h-full"
          >
            <Suspense
              fallback={
                <div className="fixed inset-0 bg-[#030108] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="warp-spinner" />
                    <span className="text-zinc-500 text-xs font-mono">
                      Loading universe...
                    </span>
                  </div>
                </div>
              }
            >
              {/* Navbar */}
              <Navbar onAboutClick={() => setAboutOpen(true)} />

              {/* 3D Space */}
              <SpaceScene
                mantra={mantra}
                onSelectProject={handleSelectProject}
              />

              {/* Project legend — bottom left */}
              <ProjectLegend onSelect={handleSelectProject} />

              {/* Modal */}
              <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />

              {/* About panel */}
              <AboutPanel
                isOpen={aboutOpen}
                onClose={() => setAboutOpen(false)}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ── Project Legend (always visible in universe phase) ── */
import { projects } from "@/data/projects";

function ProjectLegend({
  onSelect,
}: {
  onSelect: (project: Project) => void;
}) {
  return (
    <div className="fixed bottom-6 left-6 z-20 hidden sm:block">
      <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-4 max-w-[220px]">
        <h3 className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest mb-3">
          Celestial Bodies
        </h3>
        <div className="flex flex-col gap-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="flex items-center gap-2.5 text-left group hover:bg-white/5 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 legend-glow"
                style={
                  {
                    background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.secondaryColor})`,
                    "--glow": `${p.glowColor}44`,
                  } as React.CSSProperties
                }
              />
              <div>
                <div className="text-zinc-300 text-xs font-medium group-hover:text-white transition-colors">
                  {p.name}
                </div>
                <div className="text-zinc-600 text-[10px]">
                  {p.celestialType}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
