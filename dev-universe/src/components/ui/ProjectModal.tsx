"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg pointer-events-auto"
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Glow header */}
                <div
                  className="h-32 relative flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${project.color}22, ${project.glowColor}33, transparent)`,
                  }}
                >
                  {/* Project logo */}
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden shadow-lg flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${project.color}, ${project.secondaryColor})`,
                      boxShadow: `0 0 40px ${project.glowColor}66`,
                    }}
                  >
                    <Image
                      src={project.logoUrl}
                      alt={`${project.name} logo`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Celestial type badge */}
                  <div
                    className="inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest mb-3"
                    style={{
                      background: `${project.color}15`,
                      color: project.color,
                      border: `1px solid ${project.color}30`,
                    }}
                  >
                    {project.celestialType}
                  </div>

                  <h2 className="text-white text-xl font-bold mb-2">
                    {project.name}
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {project.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-zinc-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl text-center text-sm font-semibold text-white transition-all hover:brightness-110"
                      style={{
                        background: `linear-gradient(135deg, ${project.color}, ${project.secondaryColor})`,
                      }}
                    >
                      Live Demo ↗
                    </a>
                    <a
                      href={project.ghUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl text-center text-sm font-semibold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      GitHub →
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
