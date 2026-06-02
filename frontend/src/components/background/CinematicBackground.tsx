"use client";

import dynamic from "next/dynamic";
import { useMousePosition } from "@/hooks/useMousePosition";
import type { CSSProperties } from "react";

const ParticleField = dynamic(() => import("@/components/particles/ParticleField"), {
  ssr: false,
  loading: () => null,
});

export default function CinematicBackground() {
  const mouse = useMousePosition();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0b0b0b]">
      <div className="cinematic-gradient-field" />
      <div className="cinematic-light-ribbon cinematic-light-ribbon-a" />
      <div className="cinematic-light-ribbon cinematic-light-ribbon-b" />
      <div className="cinematic-smoke" />
      <div
        className="cinematic-spotlight"
        style={{
          "--mouse-x": `${mouse.x * 100}%`,
          "--mouse-y": `${mouse.y * 100}%`,
        } as CSSProperties}
      />
      <ParticleField />
      <div className="cinematic-grain" />
      <div className="cinematic-vignette" />
    </div>
  );
}
