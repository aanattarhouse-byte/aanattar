"use client";

import { fadeUp, stagger } from "@/lib/framer/motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, Pause } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const stories = [
  {
    title: "Salim Signature Ritual",
    video: "/vid1.mp4",
    tag: "Signature",
  },
  {
    title: "Oud After Dark",
    video: "/vid2.mov",
    tag: "Oud Mood",
  },
  {
    title: "Royal Gifting Moment",
    video: "/vid3.mp4",
    tag: "Gifting",
  },
  {
    title: "Attar Craft Notes",
    poster: "/fragrance-bottle.jpg",
    tag: "Craft",
  },
];

interface MobileStoryCardProps {
  story: typeof stories[number];
  index: number;
  total: number;
  scrollYProgress: any;
  playingIndex: number | null;
  playVideo: (index: number) => void;
  videoRefs: React.MutableRefObject<HTMLVideoElement[]>;
}

function MobileStoryCard({
  story,
  index,
  total,
  scrollYProgress,
  playingIndex,
  playVideo,
  videoRefs,
}: MobileStoryCardProps) {
  // Dynamically calculate transition maps for scale and translateY
  // to cascade previous cards behind the current active card:
  // Active: scale 1.0, translateY 0px
  // 1-deep covered: scale 0.96
  // 2-deep covered: scale 0.92
  // 3-deep covered: scale 0.88
  const steps = [0];
  const scaleValues = [1];
  const yValues = [0];

  for (let j = index; j < total - 1; j++) {
    const startProgress = j / total;
    const endProgress = (j + 1) / total;
    const coverCount = j - index + 1;

    if (steps[steps.length - 1] !== startProgress) {
      steps.push(startProgress);
      scaleValues.push(1 - (coverCount - 1) * 0.04);
      yValues.push(0);
    }

    steps.push(endProgress);
    scaleValues.push(1 - coverCount * 0.04);
    yValues.push(0);
  }

  if (steps[steps.length - 1] !== 1) {
    steps.push(1);
    scaleValues.push(scaleValues[scaleValues.length - 1]);
    yValues.push(yValues[yValues.length - 1]);
  }

  // Create Framer Motion transformations linked to scroll progress
  const scale = useTransform(scrollYProgress, steps, scaleValues);
  const y = useTransform(scrollYProgress, steps, yValues);

  // Progressive sticky top offset: 80px, 100px, 120px, 140px
  const stickyTop = 80 + index * 20;

  return (
    <div
      className="sticky flex h-[30rem] w-full items-center justify-center px-4"
      style={{
        top: `${stickyTop}px`,
        zIndex: 10 + index,
      }}
    >
      <motion.article
        style={{
          scale,
          y,
          transformOrigin: "top center", // Keeps the top tab edge aligned while scaling down
        }}
        onClick={() => {
          if (story.video) playVideo(index);
        }}
        className={`group relative h-[27rem] min-h-[27rem] w-full max-w-[340px] overflow-hidden rounded-[8px] border border-[#d9a84e]/24 bg-white/[0.04] shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-shadow duration-300 ${
          story.video ? "cursor-pointer" : ""
        }`}
      >
        {story.video ? (
          <>
            <video
              ref={(node) => {
                if (node) videoRefs.current[index] = node;
              }}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              src={story.video}
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
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${story.poster})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/20 to-black/86" />
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute left-6 top-10 h-28 w-28 rounded-full bg-[#ffb347]/18 blur-3xl" />
          <div className="absolute bottom-10 right-5 h-24 w-24 rounded-full bg-[#ff6b35]/14 blur-3xl" />
        </div>

        <div className="relative z-10 flex h-full min-h-[27rem] flex-col p-5">
          <div aria-hidden />
        </div>
      </motion.article>
    </div>
  );
}

export default function VideoStoriesSection() {
  const videoRefs = useRef<HTMLVideoElement[]>([]);
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const videos = videoRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          if (!entry.isIntersecting) {
            video.pause();
            const idx = videos.indexOf(video);
            if (idx !== -1) {
              setPlayingIndex((prev) => (prev === idx ? null : prev));
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    videos.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [mounted, isMobile]);

  const playOnlyVideo = (index: number) => {
    const video = videoRefs.current[index];

    if (!video) return;

    if (playingIndex === index) {
      video.pause();
      setPlayingIndex(null);
      return;
    }

    videoRefs.current.forEach((item, itemIndex) => {
      if (!item) return;
      if (itemIndex === index) return;

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
    <section aria-labelledby="video-stories-heading" className="cinematic-section relative isolate overflow-x-clip py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_10%,rgba(255,179,71,0.12),transparent_32rem),radial-gradient(ellipse_at_85%_42%,rgba(255,107,53,0.08),transparent_28rem),linear-gradient(180deg,#090806,#11100d_48%,#070605)]" />
      <div className="absolute left-0 top-20 -z-10 h-72 w-72 rounded-full bg-[#ffb347]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-[#8a5a1a]/16 blur-3xl" />

      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
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
                className={`group relative min-h-[27rem] overflow-hidden rounded-[8px] border border-[#d9a84e]/24 bg-white/[0.04] shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl ${story.video ? "cursor-pointer" : ""
                  }`}
              >
                {story.video ? (
                  <>
                    <video
                      ref={(node) => {
                        if (node) videoRefs.current[index] = node;
                      }}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      src={story.video}
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
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${story.poster})` }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/20 to-black/86" />
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute left-6 top-10 h-28 w-28 rounded-full bg-[#ffb347]/18 blur-3xl" />
                  <div className="absolute bottom-10 right-5 h-24 w-24 rounded-full bg-[#ff6b35]/14 blur-3xl" />
                </div>

                <div className="relative z-10 flex h-full min-h-[27rem] flex-col p-5">
                  <div aria-hidden />
                </div>
              </motion.article>
            ))
          ) : (
            /* Mobile layout: Sticky stacking cards inside the track */
            stories.map((story, index) => (
              <MobileStoryCard
                key={story.title}
                story={story}
                index={index}
                total={stories.length}
                scrollYProgress={scrollYProgress}
                playingIndex={playingIndex}
                playVideo={playOnlyVideo}
                videoRefs={videoRefs}
              />
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
}