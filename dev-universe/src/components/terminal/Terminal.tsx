"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import AsciiHeader from "./AsciiHeader";
import CrtOverlay from "./CrtOverlay";
import TerminalOutput from "./TerminalOutput";
import TerminalInput from "./TerminalInput";
import { personalInfo } from "@/data/projects";

type Line = {
  text: string;
  type?: "system" | "user" | "success" | "info" | "error" | "highlight";
};

type Phase = "boot" | "mantra" | "menu" | "launching";

interface TerminalProps {
  onLaunch: (mantra: string) => void;
}

export default function Terminal({ onLaunch }: TerminalProps) {
  const [phase, setPhase] = useState<Phase>("boot");
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [mantra, setMantra] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, phase]);

  // Boot sequence
  useEffect(() => {
    const bootLines: Line[] = [
      { text: "Initializing DEV UNIVERSE...", type: "system" },
      { text: "Loading modules... ████████████████ 100%", type: "info" },
      { text: "Neural networks... ONLINE", type: "success" },
      { text: "Creative engine... ACTIVE", type: "success" },
      { text: `Welcome, traveler. I'm ${personalInfo.name}.`, type: "highlight" },
      { text: "", type: "system" },
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i < bootLines.length) {
        setLines((prev) => [...prev, bootLines[i]]);
        i++;
      } else {
        clearInterval(timer);
        setBootDone(true);
        setPhase("mantra");
      }
    }, 400);

    return () => clearInterval(timer);
  }, []);

  const addLine = useCallback((text: string, type?: Line["type"]) => {
    setLines((prev) => [...prev, { text, type }]);
  }, []);

  const handleMantraSubmit = useCallback(() => {
    const val = input.trim();
    if (!val) return;

    setMantra(val);
    addLine(`> ${val}`, "user");
    setInput("");

    setTimeout(() => {
      addLine(`"${val}" — locked in. ✓`, "success");
    }, 300);

    setTimeout(() => {
      addLine("", "system");
      addLine("Want to connect? Pick a channel:", "info");
      addLine("", "system");
      addLine("  [1] 📧 Email  →  " + personalInfo.email, "system");
      addLine("  [2] 🔗 LinkedIn  →  " + personalInfo.linkedin, "system");
      addLine("  [3] 🐙 GitHub  →  " + personalInfo.github, "system");
      addLine("  [4] 🚀 Enter the Universe", "highlight");
      addLine("", "system");
      setPhase("menu");
    }, 900);
  }, [input, addLine]);

  const handleMenuSubmit = useCallback(() => {
    const val = input.trim();
    setInput("");

    switch (val) {
      case "1":
        addLine(`> ${val}`, "user");
        setTimeout(() => {
          addLine(`Opening email... → ${personalInfo.email}`, "success");
          window.open(`mailto:${personalInfo.email}`, "_blank");
          setTimeout(() => {
            addLine("", "system");
            addLine("Pick another option, or press [4] to enter the Universe:", "info");
          }, 500);
        }, 200);
        break;

      case "2":
        addLine(`> ${val}`, "user");
        setTimeout(() => {
          addLine(`Opening LinkedIn... → ${personalInfo.linkedin}`, "success");
          window.open(`https://${personalInfo.linkedin}`, "_blank");
          setTimeout(() => {
            addLine("", "system");
            addLine("Pick another option, or press [4] to enter the Universe:", "info");
          }, 500);
        }, 200);
        break;

      case "3":
        addLine(`> ${val}`, "user");
        setTimeout(() => {
          addLine(`Opening GitHub... → ${personalInfo.github}`, "success");
          window.open(`https://${personalInfo.github}`, "_blank");
          setTimeout(() => {
            addLine("", "system");
            addLine("Pick another option, or press [4] to enter the Universe:", "info");
          }, 500);
        }, 200);
        break;

      case "4":
        addLine(`> ${val}`, "user");
        setTimeout(() => {
          addLine("Initiating hyperspace jump...", "highlight");
          addLine("", "system");
        }, 200);
        setTimeout(() => {
          addLine("3...", "info");
        }, 600);
        setTimeout(() => {
          addLine("2...", "info");
        }, 1100);
        setTimeout(() => {
          addLine("1...", "info");
        }, 1600);
        setTimeout(() => {
          addLine("🚀 LAUNCH!", "success");
          setPhase("launching");
        }, 2100);
        setTimeout(() => {
          onLaunch(mantra);
        }, 2800);
        break;

      default:
        addLine(`> ${val}`, "user");
        setTimeout(() => {
          addLine("Invalid option. Enter 1, 2, 3, or 4.", "error");
        }, 200);
        break;
    }
  }, [input, addLine, mantra, onLaunch]);

  const handleSubmit = useCallback(() => {
    if (phase === "mantra") {
      handleMantraSubmit();
    } else if (phase === "menu") {
      handleMenuSubmit();
    }
  }, [phase, handleMantraSubmit, handleMenuSubmit]);

  const getPromptText = () => {
    switch (phase) {
      case "mantra":
        return "Enter your life mantra to proceed:";
      case "menu":
        return "Select [1-4]:";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a12] flex items-center justify-center p-4 sm:p-8">
      <CrtOverlay />

      {/* Terminal window */}
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-xl overflow-hidden terminal-border">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#12121f]/90 border-b border-zinc-800/60">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-zinc-500 text-xs font-mono ml-2">
            dev-universe@changela-vivek: ~
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="bg-[#0c0c18]/95 p-4 sm:p-6 overflow-y-auto font-mono"
          style={{ maxHeight: "calc(85vh - 40px)" }}
        >
          <AsciiHeader />

          <div className="mt-4">
            <TerminalOutput lines={lines} />
          </div>

          {/* Prompt line */}
          {bootDone && phase !== "launching" && (
            <div className="mt-3">
              {phase === "mantra" && (
                <p className="text-cyan-400 text-xs sm:text-sm mb-1.5 font-mono">
                  {getPromptText()}
                </p>
              )}
              <TerminalInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                prompt={phase === "menu" ? "$" : ">"}
                disabled={false}
                placeholder={
                  phase === "mantra"
                    ? "type something meaningful..."
                    : "1, 2, 3, or 4"
                }
              />
            </div>
          )}

          {/* Launching animation */}
          {phase === "launching" && (
            <div className="mt-4 flex items-center gap-2">
              <div className="warp-spinner" />
              <span className="text-purple-400 text-sm font-mono animate-pulse">
                Warping through spacetime...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
