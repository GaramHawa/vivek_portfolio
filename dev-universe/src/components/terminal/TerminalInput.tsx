"use client";

import React, { useRef, useEffect } from "react";

interface TerminalInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  prompt?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function TerminalInput({
  value,
  onChange,
  onSubmit,
  prompt = ">",
  disabled = false,
  placeholder = "",
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div
      className="flex items-center gap-2 font-mono text-xs sm:text-sm cursor-text group"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-emerald-400 font-bold shrink-0">{prompt}</span>
      <div className="relative flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSubmit();
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus
          className="w-full bg-transparent border-none outline-none text-amber-300 caret-transparent placeholder:text-zinc-600 font-mono text-xs sm:text-sm"
          spellCheck={false}
          autoComplete="off"
        />
        {/* Custom blinking cursor */}
        {!disabled && (
          <span
            className="absolute top-0 text-emerald-400 animate-blink pointer-events-none"
            style={{ left: `${value.length * 0.6}em` }}
          >
            ▊
          </span>
        )}
      </div>
    </div>
  );
}
