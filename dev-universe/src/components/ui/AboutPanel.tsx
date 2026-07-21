"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/data/projects";

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="h-full bg-zinc-900/90 backdrop-blur-xl border-l border-white/5 overflow-y-auto">
              <div className="p-8">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="float-right w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  ✕
                </button>

                <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-2">
                  About Me
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {personalInfo.name}
                </h2>
                <p className="text-zinc-400 text-sm mb-6">{personalInfo.title}</p>

                <div className="h-px bg-gradient-to-r from-white/10 to-transparent mb-6" />

                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {personalInfo.bio}
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  When I&apos;m not coding, I&apos;m exploring the real universe through
                  astrophotography 🔭
                </p>

                {/* Skills */}
                <div className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-3">
                  Tech Stack
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {personalInfo.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-300 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Focus Areas */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { num: "Web Apps", label: "Frontend + Backend" },
                    { num: "APIs", label: "Scalable Systems" },
                    { num: "UI/UX", label: "Clean Interfaces" },
                    { num: "Collab", label: "Open to Projects" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center"
                    >
                      <div className="text-xl font-bold text-white">
                        {stat.num}
                      </div>
                      <div className="text-zinc-500 text-xs mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <div className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-3">
                  Connect
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={personalInfo.resumeUrl}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20 hover:bg-cyan-500/20 transition-colors group"
                  >
                    <span className="text-lg">📄</span>
                    <span className="text-zinc-200 text-sm group-hover:text-white transition-colors">
                      View Resume
                    </span>
                  </a>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group"
                  >
                    <span className="text-lg">📧</span>
                    <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">
                      {personalInfo.email}
                    </span>
                  </a>
                  <a
                    href={`https://${personalInfo.github}`}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group"
                  >
                    <span className="text-lg">🐙</span>
                    <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">
                      {personalInfo.github}
                    </span>
                  </a>
                  <a
                    href={`https://${personalInfo.linkedin}`}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors group"
                  >
                    <span className="text-lg">🔗</span>
                    <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">
                      {personalInfo.linkedin}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
