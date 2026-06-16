"use client";

import { fadeUp, stagger } from "@/lib/framer/motion";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Play, Pause } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const stories = [
  {
    title: "Salim Signature Ritual",
    video: "/vid1.mp4",
    tag: "Signature",
    description: "Experience the art of traditional attar application. A curated ritual designed to make your signature scent last all day.",
  },
  {
    title: "Oud After Dark",
    video: "/vid2.mov",
    tag: "Oud Mood",
    description: "A deep, mysterious blend of rare agarwood and night-blooming jasmine, crafted for the evening hours.",
  },
  {
    title: "Royal Gifting Moment",
    video: "/vid3.mp4",
    tag: "Gifting",
    description: "Unveiling the ultimate luxury gifting experience. Handcrafted coffrets, personalized messages, and timeless elegance.",
  },
  {
    title: "Attar Craft Notes",
    poster: "/bottle1.jpg",
    tag: "Craft",
    description: "Discover the painstaking process behind our distillations. Sourcing the finest raw ingredients from across the globe.",
  },
];

interface MobileCardProps {
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  video?: string;
  poster?: string;
  playingIndex: number | null;
  playVideo: (index: number) => void;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
}

function MobileCard({
  i,
  progress,
  range,
  targetScale,
  video,
  poster,
  playingIndex,
  playVideo,
  videoRefs,
}: MobileCardProps) {
  const container = useRef<HTMLDivElement>(null);

  // Reveal scaling as the card scrolls up into viewport
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky flex h-[30rem] w-full items-center justify-center px-4"
      style={{
        top: `${80 + i * 20}px`,
        zIndex: 10 + i,
      }}
    >
      <motion.div
        style={{
          scale,
          transformOrigin: "top center",
        }}
        onClick={() => {
          if (video) playVideo(i);
        }}
        className={`group relative h-[27rem] min-h-[27rem] w-full max-w-[340px] overflow-hidden rounded-[8px] border border-[#d9a84e]/24 bg-white/[0.04] shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-shadow duration-300 ${video ? "cursor-pointer" : ""
          }`}
      >
        {/* Video / Image Asset */}
        <div className="absolute inset-0 w-full h-full z-0">
          <motion.div
            className="w-full h-full relative"
            style={{ scale: imageScale }}
          >
            {video ? (
              <>
                <video
                  ref={(node) => {
                    if (node) videoRefs.current[i] = node;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={`${video}#t=0.001`}
                  loop
                  playsInline
                  preload="auto"
                />
                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 z-20 pointer-events-none">
                  {playingIndex !== i ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#ffcf7a] group-hover:text-black group-hover:border-[#ffcf7a]">
                      <Play className="ml-0.5 h-6 w-6 fill-current" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                      <Pause className="h-6 w-6 fill-current" />
                    </div>
                  )}
                </div>
              </>
            ) : (
              poster && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${poster})` }}
                />
              )
            )}
          </motion.div>
        </div>

        {/* Ambient Overlay & Highlights (No Text) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/20 to-black/86 z-10 pointer-events-none" />
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 z-10 pointer-events-none">
          <div className="absolute left-6 top-10 h-28 w-28 rounded-full bg-[#ffb347]/18 blur-3xl" />
          <div className="absolute bottom-10 right-5 h-24 w-24 rounded-full bg-[#ff6b35]/14 blur-3xl" />
        </div>

        <div className="relative z-10 flex h-full min-h-[27rem] flex-col p-5">
          <div aria-hidden />
        </div>
      </motion.div>
    </div>
  );
}

export default function VideoStoriesSection() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  // Stacking scroll progress across the entire cards container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Automatically pause non-active videos as the user scrolls them out of focus
  useEffect(() => {
    if (!isMobile) return;
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const total = stories.length;
      let activeIndex = Math.floor(progress * total);
      if (activeIndex >= total) activeIndex = total - 1;
      if (activeIndex < 0) activeIndex = 0;

      videoRefs.current.forEach((video, idx) => {
        if (video && idx !== activeIndex && !video.paused) {
          video.pause();
          setPlayingIndex((prev) => (prev === idx ? null : prev));
        }
      });
    });

    return () => unsubscribe();
  }, [scrollYProgress, isMobile]);

  // Pause videos when they exit viewport bounds completely
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (!entry.isIntersecting) {
            video.pause();
            const idx = videoRefs.current.indexOf(video);
            if (idx !== -1) {
              setPlayingIndex((prev) => (prev === idx ? null : prev));
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentVideos = videoRefs.current;
    currentVideos.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [mounted, isMobile]);

  const playOnlyVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingIndex === index) {
      video.pause();
      setPlayingIndex(null);
      return;
    }

    // Pause all other active videos
    videoRefs.current.forEach((item, itemIndex) => {
      if (!item || itemIndex === index) return;
      item.pause();
      item.currentTime = 0;
    });

    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    video.play()
      .then(() => setPlayingIndex(index))
      .catch(() => undefined);
  };

  return (
    <section
      aria-labelledby="video-stories-heading"
      className="cinematic-section relative isolate py-20 sm:py-24"
      style={{ overflow: "visible" }}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_10%,rgba(255,179,71,0.12),transparent_32rem),radial-gradient(ellipse_at_85%_42%,rgba(255,107,53,0.08),transparent_28rem),linear-gradient(180deg,#090806,#11100d_48%,#070605)]" />
      <div className="absolute left-0 top-20 -z-10 h-72 w-72 rounded-full bg-[#ffb347]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-[#8a5a1a]/16 blur-3xl pointer-events-none" />

      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.42em] text-[#ffb347]">
              Cinematic Stories
            </motion.p>
          </div>
        </div>

        {/* 
          Container element is always rendered to keep containerRef hydrated and prevent Framer Motion errors.
          On desktop: acts as a side-by-side grid.
          On mobile: acts as the scroll track for CSS sticky stacking (compact rem-based heights to avoid gaps).
          The mobile container height is equal to N * wrapperHeight + finalCardOffset (120rem + 140px).
        */}
        <div
          ref={containerRef}
          className={(!mounted || !isMobile)
            ? "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 w-full"
            : "relative w-full mt-12"
          }
          style={{ height: (mounted && isMobile) ? `calc(${stories.length * 30}rem + 140px)` : "auto" }}
        >
          {(!mounted || !isMobile) ? (
            /* Desktop layout: Side-by-side grid items */
            stories.map((story, index) => (
              <motion.article
                key={story.title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                onClick={() => {
                  if (story.video) playOnlyVideo(index);
                }}
                className={`group relative min-h-[27rem] overflow-hidden rounded-[8px] border border-[#d9a84e]/24 bg-white/[0.04] shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl ${story.video ? "cursor-pointer" : ""}`}
              >
                {story.video ? (
                  <>
                    <video
                      ref={(node) => {
                        if (node) videoRefs.current[index] = node;
                      }}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      src={`${story.video}#t=0.001`}
                      loop
                      playsInline
                      preload="auto"
                    />
                    {/* Play/Pause Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 z-20 pointer-events-none">
                      {playingIndex !== index ? (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#ffcf7a] group-hover:text-black group-hover:border-[#ffcf7a]">
                          <Play className="ml-0.5 h-6 w-6 fill-current" />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                          <Pause className="h-6 w-6 fill-current" />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  story.poster && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${story.poster})` }}
                    />
                  )
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/20 to-black/86" />
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute left-6 top-10 h-28 w-28 rounded-full bg-[#ffb347]/18 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-10 right-5 h-24 w-24 rounded-full bg-[#ff6b35]/14 blur-3xl pointer-events-none" />
                </div>

                <div className="relative z-10 flex h-full min-h-[27rem] flex-col p-5">
                  <div aria-hidden />
                </div>
              </motion.article>
            ))
          ) : (
            /* Mobile layout: Sticky stacking cards inside the track */
            stories.map((story, index) => {
              const targetScale = 1 - (stories.length - 1 - index) * 0.04;
              const startProgress = index / stories.length;
              return (
                <MobileCard
                  key={story.title}
                  i={index}
                  progress={scrollYProgress}
                  range={[startProgress, 1]}
                  targetScale={targetScale}
                  video={story.video}
                  poster={story.poster}
                  playingIndex={playingIndex}
                  playVideo={playOnlyVideo}
                  videoRefs={videoRefs}
                />
              );
            })
          )}
        </div>
      </motion.div>
    </section>
  );
}