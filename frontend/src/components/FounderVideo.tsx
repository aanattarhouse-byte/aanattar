"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const copy = [
  "Built from a fascination with identity, desire, and digital craft, Salim Luxury Attar began as a personal search for work that felt rarer than a template and warmer than a campaign.",
  "The founder's journey moves through brand strategy, visual storytelling, and performance-led design, shaped by the belief that luxury is not loud. It is precise, memorable, and deeply intentional.",
  "Today, that philosophy guides every client experience: cinematic websites, refined digital systems, and fragrance-led brand moments that feel composed down to the smallest interaction.",
];

export default function FounderVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => undefined);
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-black py-24 sm:py-28 lg:py-36">
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_18%_24%,rgba(212,162,76,0.18),transparent_34rem),radial-gradient(ellipse_at_82%_58%,rgba(255,179,71,0.1),transparent_28rem),linear-gradient(135deg,#020202_0%,#0b0906_46%,#050505_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#d4a24c]/60 to-transparent"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4a24c]/10 blur-[120px]"
        aria-hidden
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-12">
        <motion.div
          className="max-w-2xl text-left"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.44em] text-[#d4a24c]">
            Founder Story
          </p>

          <h2 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            Meet The Founder
          </h2>

          <div className="mt-8 space-y-5 text-base leading-8 text-zinc-300 sm:text-lg">
            {copy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-10 inline-flex items-center justify-center rounded-full border border-[#d4a24c]/70 px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f5d28a] transition duration-300 hover:-translate-y-1 hover:border-[#ffd88a] hover:bg-[#d4a24c] hover:text-black hover:shadow-[0_18px_60px_rgba(212,162,76,0.24)]"
          >
            Read Full Story
          </Link>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[500px] lg:mr-0"
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <div
            className="absolute -inset-10 -z-10 rounded-full bg-[#d4a24c]/20 blur-[80px]"
            aria-hidden
          />

          <motion.div
            onClick={togglePlay}
            className="group relative overflow-hidden rounded-[1.5rem] shadow-[0_32px_110px_rgba(0,0,0,0.58)] cursor-pointer"
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <video
              ref={videoRef}
              className="aspect-[9/16] max-h-[720px] w-full rounded-[1.5rem] bg-black object-cover transition duration-700 group-hover:scale-[1.02]"
              loop
              playsInline
              preload="metadata"
            >
              <source src="/founder.mp4" type="video/mp4" />
            </video>

            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 z-20 pointer-events-none">
              {!isPlaying ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 scale-100 group-hover:scale-110 group-hover:bg-[#d4a24c] group-hover:text-black group-hover:border-[#d4a24c]">
                  <Play className="ml-1 h-8 w-8 fill-current" />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <Pause className="h-8 w-8 fill-current" />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
