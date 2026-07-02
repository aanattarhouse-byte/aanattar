"use client";

import dynamic from "next/dynamic";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useEffect, useState, type CSSProperties } from "react";

const ParticleField = dynamic(() => import("@/components/particles/ParticleField"), {
  ssr: false,
  loading: () => null,
});

export default function CinematicBackground() {
  const mouse = useMousePosition();
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setShowParticles(true));

    return () => cancelIdle(id);
  }, []);

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
      {showParticles ? <ParticleField /> : null}
      <div className="cinematic-grain" />
      <div className="cinematic-vignette" />
    </div>
  );
}
