"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CinematicShell = dynamic(
  () => import("@/components/cinematic/CinematicShell"),
  { ssr: false }
);

export default function DeferredCinematicShell() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 900));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setEnabled(true));

    return () => cancelIdle(id);
  }, []);

  return enabled ? <CinematicShell /> : null;
}
