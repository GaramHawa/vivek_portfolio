"use client";

import React from "react";

export default function AsciiHeader() {
  const ascii = `
 ██████╗  ███████╗ ██╗   ██╗
 ██╔══██╗ ██╔════╝ ██║   ██║
 ██║  ██║ █████╗   ██║   ██║
 ██║  ██║ ██╔══╝   ╚██╗ ██╔╝
 ██████╔╝ ███████╗  ╚████╔╝
 ╚═════╝  ╚══════╝   ╚═══╝
  `.trimEnd();

  return (
    <div className="mb-2 select-none">
      <pre className="text-[10px] sm:text-xs md:text-sm leading-tight font-mono ascii-glow whitespace-pre">
        {ascii}
      </pre>
      <div className="mt-1 flex items-center gap-3 text-xs sm:text-sm">
        <span className="text-cyan-400 font-bold tracking-widest">
          UNIVERSE v2.0
        </span>
        <span className="text-emerald-400 animate-pulse">●</span>
        <span className="text-zinc-500">System Online</span>
      </div>
      <div className="mt-1 h-px bg-gradient-to-r from-cyan-500/60 via-purple-500/40 to-transparent" />
    </div>
  );
}
