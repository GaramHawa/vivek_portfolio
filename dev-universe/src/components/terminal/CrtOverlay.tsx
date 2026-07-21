"use client";

import React from "react";

export default function CrtOverlay() {
  return (
    <>
      {/* Scan lines */}
      <div
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[99]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      {/* Subtle flicker via CSS animation */}
      <div className="pointer-events-none fixed inset-0 z-[98] crt-flicker" />
    </>
  );
}
