"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CinematicShell = dynamic(
  () => import("@/components/cinematic/CinematicShell"),
  { ssr: false, loading: () => null }
);

const CINEMATIC_FALLBACK_DELAY_MS = 12000;

export default function DeferredCinematicShell() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const enable = () => setEnabled(true);
    const events: Array<keyof WindowEventMap> = [
      "pointermove",
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    const timeoutId = window.setTimeout(enable, CINEMATIC_FALLBACK_DELAY_MS);

    events.forEach((eventName) => {
      window.addEventListener(eventName, enable, { once: true, passive: true });
    });

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach((eventName) => {
        window.removeEventListener(eventName, enable);
      });
    };
  }, [enabled]);

  return enabled ? <CinematicShell /> : null;
}
