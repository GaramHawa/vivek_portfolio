"use client";

import React from "react";
import { personalInfo } from "@/data/projects";

interface NavbarProps {
  onAboutClick: () => void;
}

export default function Navbar({ onAboutClick }: NavbarProps) {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full px-2 py-1.5">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-[8px] font-bold text-white">
            ✦
          </div>
          <span className="text-zinc-300 text-xs font-semibold hidden sm:inline">
            {personalInfo.name}
          </span>
        </div>

        <div className="w-px h-4 bg-white/10 hidden sm:block" />

        {/* Links */}
        <button
          onClick={onAboutClick}
          className="px-3 py-1.5 text-zinc-400 hover:text-white text-xs font-medium transition-colors rounded-full hover:bg-white/5"
        >
          About
        </button>

        <a
          href={`https://${personalInfo.github}`}
          target="_blank"
          rel="noopener"
          className="px-3 py-1.5 text-zinc-400 hover:text-white text-xs font-medium transition-colors rounded-full hover:bg-white/5"
        >
          GitHub
        </a>

        <a
          href={personalInfo.resumeUrl}
          target="_blank"
          rel="noopener"
          className="px-3 py-1.5 text-zinc-300 hover:text-white text-xs font-medium transition-colors rounded-full hover:bg-white/5"
        >
          Resume
        </a>

        <a
          href={`mailto:${personalInfo.email}`}
          className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-semibold rounded-full hover:brightness-110 transition-all"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
