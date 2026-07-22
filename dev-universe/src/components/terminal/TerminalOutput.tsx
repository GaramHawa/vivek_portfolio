"use client";

import React, { useEffect, useState } from "react";

interface TerminalOutputProps {
  lines: { text: string; type?: "system" | "user" | "success" | "info" | "error" | "highlight" }[];
}

export default function TerminalOutput({ lines }: TerminalOutputProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {lines.map((line, i) => (
        <TypewriterLine key={`${i}-${line.text}`} line={line} index={i} />
      ))}
    </div>
  );
}

function TypewriterLine({
  line,
  index,
}: {
  line: { text: string; type?: string };
  index: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const speed = line.type === "user" ? 0 : 18;

  useEffect(() => {
    if (speed === 0) {
      setDisplayed(line.text);
      setDone(true);
      return;
    }

    let idx = 0;
    setDisplayed("");
    setDone(false);

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        idx++;
        setDisplayed(line.text.slice(0, idx));
        if (idx >= line.text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, index * 40);

    return () => clearTimeout(timeout);
  }, [line.text, speed, index]);

  const colorClass = (() => {
    switch (line.type) {
      case "user":
        return "text-amber-300";
      case "success":
        return "text-emerald-400";
      case "info":
        return "text-cyan-400";
      case "error":
        return "text-red-400";
      case "highlight":
        return "text-purple-400";
      default:
        return "text-zinc-300";
    }
  })();

  return (
    <div className={`font-mono text-xs sm:text-sm ${colorClass} leading-relaxed`}>
      {displayed}
      {!done && <span className="animate-pulse">▊</span>}
    </div>
  );
}
