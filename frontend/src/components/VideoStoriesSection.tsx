"use client";

import { fadeUp, stagger } from "@/lib/framer/motion";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

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
    poster: "/footer.jpg",
    tag: "Gifting",
  },
  {
    title: "Attar Craft Notes",
    poster: "/fragrance-bottle.jpg",
    tag: "Craft",
  },
];

export default function VideoStoriesSection() {
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    const videos = videoRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          if (!entry.isIntersecting) {
            video.pause();
          }
        });
      },
      { threshold: 0.45 }
    );

    videos.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, []);

  const playOnlyVideo = (index: number) => {
    const video = videoRefs.current[index];

    if (!video) return;

    videoRefs.current.forEach((item, itemIndex) => {
      if (!item || itemIndex === index) return;

      item.pause();
      item.currentTime = 0;
    });

    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    video.play().catch(() => undefined);
  };

  return (
    <section aria-labelledby="video-stories-heading" className="cinematic-section relative isolate overflow-hidden py-20 sm:py-24">
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

          <motion.a
            variants={fadeUp}
            href="/build-your-signature"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ffcf7a]/34 bg-white/[0.05] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#ffcf7a] backdrop-blur-xl transition hover:border-[#ffcf7a]/70 hover:bg-[#ffcf7a]/10 hover:shadow-[0_0_36px_rgba(255,179,71,0.18)]"
          >
            Explore Collection
            <Sparkles size={15} />
          </motion.a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story, index) => (
            <motion.article
              key={story.title}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              onClick={() => {
                if (story.video) playOnlyVideo(index);
              }}
              className={`group relative min-h-[27rem] overflow-hidden rounded-[8px] border border-[#d9a84e]/24 bg-white/[0.04] shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl ${
                story.video ? "cursor-pointer" : ""
              }`}
            >
              {story.video ? (
                <video
                  ref={(node) => {
                    if (node) videoRefs.current[index] = node;
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src={story.video} type={story.video.endsWith(".mp4") ? "video/mp4" : undefined} />
                </video>
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
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-[#ffcf7a]/30 bg-black/28 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#ffcf7a] backdrop-blur-md">
                    {story.tag}
                  </span>
                  <span className="text-xs font-semibold text-white/46">0{index + 1}</span>
                </div>

                <div aria-hidden />
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
