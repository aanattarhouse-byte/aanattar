"use client";

import CinematicBackground from "@/components/background/CinematicBackground";
import ScrollProgress from "@/components/cinematic/ScrollProgress";
import SmoothScrollProvider from "@/components/cinematic/SmoothScrollProvider";

export default function CinematicShell() {
  return (
    <>
      <SmoothScrollProvider />
      <CinematicBackground />
      <ScrollProgress />
    </>
  );
}
